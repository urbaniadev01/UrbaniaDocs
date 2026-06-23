---
type: reference
status: active
module: notificaciones
scope: api
tags: [api, endpoints, notificaciones]
updated: 2026-06-23
---

# Endpoints: Notificaciones

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Notificaciones.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Infraestructura transversal. Emite y entrega notificaciones a los usuarios por los canales configurados (in-app, push, email). Es consumido por todos los demás features que disparan eventos (PAGOS, CUOTAS, PQRS, COMUNICADOS, ASAMBLEAS, VISITANTES, MORA, ÓRDENES DE TRABAJO). El envío se realiza internamente — los endpoints expuestos son de **consumo** (listar, leer, preferencias, registro de dispositivo push).

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 12.1 | GET | `/notifications` | Sí | admin, user | Diseñado |
| 12.2 | GET | `/notifications/unread-count` | Sí | admin, user | Diseñado |
| 12.3 | PATCH | `/notifications/{id}` | Sí | admin, user | Diseñado |
| 12.4 | POST | `/notifications/read-all` | Sí | admin, user | Diseñado |
| 12.5 | GET | `/notifications/preferences` | Sí | admin, user | Diseñado |
| 12.6 | PATCH | `/notifications/preferences` | Sí | admin, user | Diseñado |
| 12.7 | POST | `/notifications/devices` | Sí | admin, user | Diseñado |
| 12.8 | DELETE | `/notifications/devices/{device_id}` | Sí | admin, user | Diseñado |

---

## §12.1 Listar notificaciones

```
GET /api/v1/notifications
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `type` | string | Filtrar por tipo: `pago_recibido`, `cuota_vencida`, `pqrs_actualizada`, `comunicado_nuevo`, `asamblea_programada`, `visitante_autorizado`, `mora_nueva`, `acuerdo_pago`, `orden_trabajo` |
| `read` | boolean | `true` = solo leídas, `false` = solo no leídas. Sin parámetro = todas |
| `since` | timestamp ISO 8601 | Notificaciones a partir de esta fecha (inclusive) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440001",
      "type": "pago_recibido",
      "title": "Pago registrado",
      "body": "Tu pago de $350.000 fue registrado correctamente.",
      "read": false,
      "action_url": "/pagos/990e8400-e29b-41d4-a716-446655440099",
      "created_at": "2026-06-23T10:00:00Z",
      "read_at": null
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 53,
      "total_pages": 3
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Solo retorna notificaciones del usuario autenticado (`user_id` del JWT)
  - Orden descendente por `created_at`
  - Para `role = user` y `role = admin` el comportamiento es idéntico — cada quien ve sus propias notificaciones
- **Side effects:** ninguno — lectura pura

## §12.2 Conteo de no leídas

```
GET /api/v1/notifications/unread-count
```

> [!note] Uso
> Endpoint liviano para el badge del header. El cliente hace polling (60s en web) o lo consulta tras una push notification (app).

**Response `200`:**
```json
{
  "data": {
    "unread_count": 7
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:** solo cuenta notificaciones no leídas del usuario autenticado
- **Side effects:** ninguno — lectura pura

---

## §12.3 Marcar notificación como leída

```
PATCH /api/v1/notifications/{id}
```

**Request:**
```json
{
  "read": true
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440001",
    "read": true,
    "read_at": "2026-06-23T11:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "NOTIFICATION_NOT_FOUND",
    "message": "Notificación no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - La notificación debe pertenecer al usuario autenticado — un intento sobre `id` ajeno retorna `404` (no `403`, para no filtrar existencia)
  - Idempotente: marcar como leída una ya leída no genera error
- **Side effects:** actualiza `read = true` y `read_at = NOW()` en `notifications`

---

## §12.4 Marcar todas como leídas

```
POST /api/v1/notifications/read-all
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "marked_count": 7
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Marca como leídas todas las notificaciones no leídas del usuario autenticado
  - No afecta notificaciones de otros usuarios
- **Side effects:** `UPDATE notifications SET read = true, read_at = NOW() WHERE user_id = ? AND read = false`

---

## §12.5 Ver preferencias de notificaciones

```
GET /api/v1/notifications/preferences
```

**Response `200`:**
```json
{
  "data": {
    "preferences": {
      "pago_recibido":      { "in_app": true,  "push": true,  "email": true  },
      "cuota_vencida":      { "in_app": true,  "push": true,  "email": true  },
      "pqrs_actualizada":    { "in_app": true,  "push": true,  "email": false },
      "comunicado_nuevo":   { "in_app": true,  "push": false, "email": true  },
      "asamblea_programada":{ "in_app": true,  "push": true,  "email": true  },
      "visitante_autorizado":{ "in_app": true, "push": true,  "email": false },
      "mora_nueva":         { "in_app": true,  "push": false, "email": true  },
      "acuerdo_pago":       { "in_app": true,  "push": false, "email": true  },
      "orden_trabajo":      { "in_app": true,  "push": false, "email": false }
    }
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Retorna los 9 tipos con los 3 canales cada uno; si el usuario no personalizó, retorna los defaults del sistema
  - El canal `in_app` está siempre `true` — no se puede desactivar el centro de notificaciones
- **Side effects:** ninguno — lectura pura

---

## §12.6 Actualizar preferencias de notificaciones

```
PATCH /api/v1/notifications/preferences
```

**Request:**
```json
{
  "preferences": {
    "comunicado_nuevo": { "push": false, "email": true },
    "mora_nueva": { "push": true, "email": true }
  }
}
```

> [!note]
> PATCH parcial — solo se actualizan los tipos/canales enviados. Los omitidos conservan su valor actual. El canal `in_app` siempre se ignora (no se puede desactivar).

**Response `200`:**
```json
{
  "data": {
    "preferences": { "...": "preferencias completasactualizadas" }
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Solo se aceptan tipos válidos del ENUM `notification_type`
  - Solo se aceptan canales válidos: `push`, `email` (se ignora `in_app`)
  - Valores deben ser booleanos
- **Side effects:**
  - Actualiza o crea filas en `notification_preferences` (upsert por `user_id` + `type`)
  - Si se desactiva `push` para todos los tipos, no se eliminan los dispositivos registrados pero no se envían push futuras a ese usuario

---

## §12.7 Registrar dispositivo push

```
POST /api/v1/notifications/devices
```

**Request:**
```json
{
  "platform": "android",
  "token": "dGhpcyBpcyBhIGZjbSB0b2tlbg...",
  "device_name": "Pixel 8 de Juan",
  "device_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

> [!note]
> `platform` = `ios` | `android` | `web`. El `token` se almacena hasheado (SHA-256) — nunca en texto planomás allá del request. El `device_id` es un identificador estable del dispositivo cliente.

**Response `201`:**
```json
{
  "data": {
    "device_id": "550e8400-e29b-41d4-a716-446655440000",
    "platform": "android",
    "device_name": "Pixel 8 de Juan",
    "registered_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Si ya existe un dispositivo con el mismo `device_id` para el usuario, se actualiza el `token` (rotación de token FCM/APNs)
  - Un usuario puede tener múltiples dispositivos registrados
  - El `token` se almacena como SHA-256 hash +letas cifrado AES-256-GCM (ver [[API_DATABASE]] tabla `push_devices`)
- **Side effects:**
  - Crea o actualiza fila en `push_devices`
  - Si el `token` cambió, se cancelan las suscripciones push del token anterior en FCM/APNs (best-effort)

---

## §12.8 Eliminar dispositivo push

```
DELETE /api/v1/notifications/devices/{device_id}
```

**Response `204`:** (No Content)

**Response `404`:**
```json
{
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Dispositivo no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - El `device_id` debe pertenecer al usuario autenticado — un intento ajeno retorna `404`
  - Se usa típicamente al cerrar sesión o desinstalar la app
- **Side effects:**
  - Elimina (soft delete) la fila en `push_devices`
  - Cancela suscripción push en FCM/APNs (best-effort)

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/notificaciones/NOTIFICACIONES_SPEC]]
- Spec App: [[03-app/features/notificaciones/NOTIFICACIONES_SPEC]]
- Panorama global: [[00-shared/features/NOTIFICACIONES]]
- Módulos consumidores: [[endpoints/PAGOS]], [[endpoints/CUOTAS]], [[endpoints/PQRS]], [[endpoints/COMUNICADOS]], [[endpoints/ASAMBLEAS]], [[endpoints/VISITANTES]], [[endpoints/MORA]], [[endpoints/ORDENES-TRABAJO]]