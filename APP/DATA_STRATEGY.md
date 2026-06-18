---
type: reference
status: active
priority: P0
module: mobile
tags: [data, offline, sync, drift, realtime, mobile]
updated: 2026-06-18
---

# 🗄️ DATA_STRATEGY
## Estrategia de Datos: Online, Offline y Tiempo Real

> [!info] Consultar
> Antes de decidir cómo una feature nueva obtiene, cachea o sincroniza sus datos.

> [!info] Decisión base (ver respuesta de producto)
> La app combina funciones que **deben** ser online-only por naturaleza (pagos, chat en tiempo real), con funciones que se benefician de **cache local** para uso fluido con conectividad intermitente (reservas, visitas, perfil, avisos). No es ni offline-first puro ni online-only puro — es **híbrido por feature**, clasificado explícitamente en la tabla de §1.

---

## 1. Clasificación de Datos por Feature

| Feature | Estrategia | Justificación |
|---|---|---|
| Sesión / Perfil | **Cache local obligatorio** (Drift + secure storage para tokens) | La app debe poder mostrar "quién soy" sin red, y debe sobrevivir reinicios |
| Avisos / Anuncios de la administración | **Offline-first** (cache local, sync periódico + pull-to-refresh) | Contenido de solo lectura, alta frecuencia de consulta, tolera estar unos minutos desactualizado |
| Reservas de zonas comunes | **Híbrido**: lectura cacheada + escritura optimista con cola de sincronización | El usuario necesita ver sus reservas sin red, pero crear/cancelar una reserva requiere confirmación del servidor (puede haber conflicto de disponibilidad) |
| Registro de visitas | **Híbrido**: lectura cacheada, escritura optimista | Igual razonamiento que reservas — la portería necesita el dato actualizado, pero el residente debe poder registrar una visita esperada sin conexión perfecta (ej. parqueadero con mala señal) |
| Pagos | **Online-only, sin excepción** | Nunca se debe mostrar o procesar un estado de pago basado en datos potencialmente obsoletos — ver [[SECURITY]] §6 |
| Chat | **Tiempo real (WebSocket) + cache local de historial** | Necesita entrega inmediata; el historial se cachea para scroll hacia atrás sin red, pero nunca se "inventan" mensajes nuevos offline sin marcarlos como pendientes de envío |
| Notificaciones push | **Solo disparador**, no fuente de verdad | El payload de la notificación nunca es la única fuente del dato — al tocarla, la app siempre re-consulta el endpoint correspondiente (ver §5) |

---

## 2. Manejo de Conectividad

- Paquete: `connectivity_plus` para detectar estado de red + `internet_connection_checker` (o equivalente) para diferenciar "conectado a una red" de "con salida real a internet" (wifi cautivo de portería sin internet es un caso real en este dominio).
- Estado global expuesto como provider (`connectivityProvider`) consumido por:
  - Un banner persistente no intrusivo ("Sin conexión — mostrando datos guardados") en las pantallas con datos cacheados.
  - El `AuthInterceptor`/repositorios, para decidir si intentar red o servir directo desde Drift.
- **Nunca** mostrar un error genérico de red como si fuera un error de negocio del API (`NetworkFailure` vs `ApiFailure`, ver [[ARCHITECTURE]] §6) — la UX debe distinguir claramente "no hay internet" de "el servidor rechazó la operación".

---

## 3. Base de Datos Local (Drift)

```dart
@DriftDatabase(tables: [LocalAnnouncements, LocalReservations, LocalVisits, LocalChatMessages, SyncQueue])
class AppDatabase extends _$AppDatabase { ... }
```

| Tabla | Propósito | ¿Sobrevive logout? |
|---|---|---|
| `local_announcements` | Cache de avisos para lectura offline | No — se limpia en logout (puede contener info de otra cuenta/unidad) |
| `local_reservations` | Cache de reservas del usuario + estado de sincronización (`pending`/`synced`/`failed`) | No |
| `local_visits` | Cache de visitas registradas | No |
| `local_chat_messages` | Historial de chat para scroll offline | No |
| `sync_queue` | Cola genérica de operaciones de escritura pendientes (ver §4) | No |
| `app_preferences` (vía `shared_preferences`, no Drift) | Preferencias de UX no sensibles (tema, idioma, biometría activada) | **Sí** — no es dato de cuenta |

> [!warning] Regla de limpieza
> Todas las tablas Drift que contienen datos de la cuenta del usuario se vacían (`DELETE FROM ...` o `database.close()` + recrear el archivo) al hacer logout o al detectar `DEVICE_NOT_RECOGNIZED`/`TOKEN_INVALID`. Un dispositivo compartido o vendido no debe filtrar datos de la cuenta anterior — ver [[SECURITY]] §2.1.

### 3.1 Migraciones

- Toda migración de esquema Drift debe tener una estrategia explícita de `onUpgrade` — igual que el backend exige `down()` reversible en sus migraciones ([[../AGENTS|AGENTS]] del API, Regla de Oro #5), aquí la equivalencia es: **nunca** lanzar una migración que destruya datos del usuario sin una ruta de migración de datos definida, salvo que sea una tabla 100% cache (en cuyo caso `dropTable` + recrear es aceptable, ya que se puede re-sincronizar desde el API).

---

## 4. Cola de Sincronización (Reservas y Visitas)

```dart
sealed class SyncStatus { }
class Pending extends SyncStatus { }
class Synced extends SyncStatus { }
class SyncFailed extends SyncStatus { final Failure reason; SyncFailed(this.reason); }
```

**Flujo de creación de una reserva (ejemplo, aplica igual a visitas):**

1. Usuario crea la reserva en la app → se inserta en `local_reservations` con `status = pending` y un `local_id` (UUID generado en cliente) → la UI la muestra inmediatamente (escritura optimista).
2. Si hay red: se dispara `POST /reservations` (endpoint del módulo futuro, ver [[FEATURE_SCOPE]] §3) inmediatamente.
   - Éxito → actualizar la fila local con el `id` real del servidor, `status = synced`.
   - Conflicto (ej. `409 Conflict` — zona ya reservada en ese horario) → `status = SyncFailed`, mostrar al usuario el conflicto explícitamente, **nunca** reintentar automáticamente un conflicto de negocio.
3. Si no hay red: la operación queda en `sync_queue`, se reintenta automáticamente cuando `connectivityProvider` detecta reconexión (con backoff, máx. N intentos antes de marcarla como `SyncFailed` y requerir acción manual del usuario).

> [!note] Por qué no sincronización "mágica" tipo CRDT
> Dado el dominio (reservas de recursos físicos compartidos, visitas con horario), los conflictos son de **negocio** (disponibilidad), no de fusión de datos. Una estrategia de resolución automática de conflictos (CRDT, last-write-wins) sería incorrecta aquí — el conflicto debe resolverlo el backend (fuente de verdad de disponibilidad) y comunicarse explícitamente al usuario, nunca silenciarse.

---

## 5. Notificaciones Push (FCM) → Datos

```
FCM payload (data-only, no notification-only) llega al dispositivo
    │
    ▼
Background handler (app cerrada/background) o foreground handler
    │
    ▼
Se interpreta `type` del payload: "chat" | "reservation_update" | "payment_status" | "announcement"
    │
    ▼
Se invalida/refresca el provider correspondiente (NO se confía en el contenido textual del push como dato final)
    │
    ▼
Si el usuario toca la notificación → deep link (go_router) a la pantalla relevante, que ya dispara su propio fetch
```

- Usar **data messages** de FCM en vez de `notification` payload puro cuando se necesite lógica en background, para tener control total del manejo y evitar inconsistencias entre iOS/Android.
- Las notificaciones de chat y de actualización de pagos deben considerarse "señales para refrescar", nunca la fuente final del dato — esto evita bugs de sincronización si una notificación llega duplicada, fuera de orden, o se pierde (los push no son garantizados, ni por FCM ni por APNs).

---

## 6. Chat en Tiempo Real (Laravel Reverb)

- Cliente: `pusher_channels_flutter` (protocolo compatible con Reverb) suscrito a un canal privado por conversación (`private-chat.{conversation_id}`), autenticado vía el `access_token` actual.
- Mensajes recibidos por WebSocket se insertan en `local_chat_messages` inmediatamente (fuente de verdad para la UI es Drift, no el stream directo — así el historial sobrevive a una reconexión del socket).
- Mensajes enviados por el usuario: escritura optimista igual que §4 (estado `sending` → `sent` → `failed`), con reintento manual si falla.
- Reconexión del socket tras pérdida de red: al reconectar, solicitar mensajes desde el `last_synced_message_id` local para rellenar huecos (el WebSocket no garantiza entrega de lo que pasó mientras estaba desconectado).

---

## 7. Caché de Imágenes y Assets Remotos

- `cached_network_image` para avatares, fotos de avisos, comprobantes de pago, etc.
- Política de expiración de cache: 7 días por defecto, configurable por tipo de recurso (un avatar cambia poco, un comprobante de pago no debería re-descargarse nunca si ya se tiene).

---

## 8. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[ARCHITECTURE]] | Capas `data/`/`domain/`, dónde vive cada repositorio |
| [[API_INTEGRATION]] | Contratos de los endpoints que alimentan cada cache |
| [[SECURITY]] | Qué datos nunca se persisten localmente y por qué |
| [[FEATURE_SCOPE]] | Endpoints aún no diseñados por el backend que esta estrategia asume (reservas, visitas, chat, pagos) |
