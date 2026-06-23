---
type: feature-panorama
status: active
module: shared
tags: [visitantes, control-acceso, shared]
updated: 2026-06-22
---

# Feature: Control de visitantes

## 1. Resumen y motivación

Digitaliza el registro de ingreso y salida de visitantes. El residente preautoriza visitas y el portero las registra desde la app o desde un dispositivo en portería. Elimina el libro físico de visitantes.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Preautorización de visitas por el residente (nombre, cédula, fecha/hora estimada)
- Registro de ingreso y salida por parte del portero o admin
- Historial de visitantes por unidad y global
- Notificación al residente cuando llega su visitante autorizado

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/RESIDENTES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Historial de visitantes | Página | Log global de ingresos y salidas |
| Detalle de visita | Drawer | Info completa de la visita |
| Crear visita (portero/admin) | Modal | Registro manual de ingreso |
| Preautorizaciones | Página | Lista de visitas preautorizadas activas |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Mis visitantes | Screen | Historial de visitas de la unidad |
| Preautorizar visita | Screen | Formulario de preautorización |
| Detalle de visita | BottomSheet | Info de la visita, estado |
| Escaneo QR (portero) | Screen | Escaneo de código QR de autorización |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver historial | GET | `/visitors` |
| Registrar ingreso | POST | `/visitors` |
| Registrar salida | PATCH | `/visitors/{id}/exit` |
| Preautorizar | POST | `/visitors/preauth` |
| Ver preautorizaciones | GET | `/visitors/preauth` |
| Ver detalle | GET | `/visitors/{id}` |

---

## 7. Reglas de negocio globales

- Una visita preautorizada genera un código QR que el visitante puede mostrar en portería.
- El ingreso puede registrarse manualmente o escaneando el QR de preautorización.
- Al registrar el ingreso, el residente recibe notificación inmediata.
- La salida puede registrarla el portero o quedar sin registrar (el sistema la marca como "sin salida" después de X horas).
- Solo residentes de la unidad pueden preautorizar visitas a su unidad.

## 8. Estados del recurso

```
preautorizada → ingresó → salió | expirada
```

## 9. Endpoints

> Ver [[01-api/endpoints/VISITANTES]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/visitantes/VISITANTES_SPEC]] |
| App | [[03-app/features/visitantes/VISITANTES_SPEC]] |
