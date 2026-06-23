---
type: reference
status: active
module: comunicados
scope: api
tags: [api, endpoints, comunicados]
updated: 2026-06-23
---

# Endpoints: Comunicados y circulares

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Comunicados y circulares.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Canal oficial de comunicación del admin hacia los residentes. El admin redacta borradores con adjuntos y segmentación de audiencia, y al publicar se disparan notificaciones a los destinatarios vía el feature [[endpoints/NOTIFICACIONES]] (tipo `comunicado_nuevo`), respetando las preferencias por canal de cada usuario. Los residentes confirman lectura y el admin puede auditar quién leyó.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 13.1 | GET | `/announcements` | Sí | admin, user | Diseñado |
| 13.2 | POST | `/announcements` | Sí | admin | Diseñado |
| 13.3 | GET | `/announcements/{id}` | Sí | admin, user* | Diseñado |
| 13.4 | PATCH | `/announcements/{id}` | Sí | admin | Diseñado |
| 13.5 | POST | `/announcements/{id}/publish` | Sí | admin | Diseñado |
| 13.6 | POST | `/announcements/{id}/read` | Sí | user | Diseñado |
| 13.7 | GET | `/announcements/{id}/read-receipts` | Sí | admin | Diseñado |
| 13.8 | DELETE | `/announcements/{id}` | Sí | admin | Diseñado |

> `*` Un residente (`role = user`) solo puede ver un comunicado `publicado` cuya audiencia lo incluya; cualquier otro `id` retorna `404`.

---

## §13.1 Listar comunicados

```
GET /api/v1/announcements
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `audience` | string | Filtrar por audiencia: `all`, `owners`, `tenants`, `specific_units` |
| `status` | string | `draft`, `published` (solo admin) |
| `read` | boolean | `true` = solo leídos, `false` = solo no leídos (solo `user`). Sin parámetro = todas |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "title": "Cambio de horario de basuras",
      "status": "published",
      "audience": "owners",
      "attachments_count": 1,
      "total_recipients": 42,
      "total_read": 18,
      "read": false,
      "published_at": "2026-06-23T10:00:00Z",
      "created_at": "2026-06-22T15:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 12,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: ve todos los comunicados (borradores y publicados), orden desc por `created_at`
  - `role = user`: ve solo comunicados `published` cuya audiencia lo incluya; `read` refleja si el usuario confirmó lectura
  - El filtro `read` solo aplica para `role = user`; para `admin` se ignora
- **Side effects:** ninguno — lectura pura

---

## §13.2 Crear comunicado (borrador)

```
POST /api/v1/announcements
```

**Request:**
```json
{
  "title": "Cambio de horario de basuras",
  "body": "A partir del 1 de julio, la recolección será los martes y viernes de 6:00 a 8:00 a.m.",
  "audience": "owners",
  "attachment_ids": ["aa1e8400-e29b-41d4-a716-446655440001"],
  "scheduled_at": "2026-07-01T13:00:00Z"
}
```

> [!note] Audiencia
> `audience` = `all` | `owners` | `tenants` | `specific_units`.
> Cuando `audience = specific_units`, el campo `unit_ids` (array de UUID de unidades) es obligatorio.
> `scheduled_at` es opcional — si se envía, el borrador queda programado y un job de fondo lo publica a esa hora (ver §13.5).

**Response `201`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "title": "Cambio de horario de basuras",
    "body": "A partir del 1 de julio...",
    "status": "draft",
    "audience": "owners",
    "unit_ids": null,
    "attachment_ids": ["aa1e8400-e29b-41d4-a716-446655440001"],
    "scheduled_at": "2026-07-01T13:00:00Z",
    "published_at": null,
    "created_at": "2026-06-23T09:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_AUDIENCE",
    "message": "La audiencia specific_units requiere unit_ids",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El comunicado se crea siempre en estado `draft`
  - `title` (max 200) y `body` son obligatorios
  - `audience` debe ser uno de los valores válidos; si es `specific_units`, `unit_ids` no puede ser vacío
  - `attachment_ids` deben existir en `announcement_attachments` y pertenecer al admin
  - `scheduled_at` debe ser futura
- **Side effects:**
  - Crea registro en `announcements`
  - Vincula adjuntos referenciados

---

## §13.3 Ver detalle de comunicado

```
GET /api/v1/announcements/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "title": "Cambio de horario de basuras",
    "body": "A partir del 1 de julio, la recolección será los martes y viernes de 6:00 a 8:00 a.m.",
    "status": "published",
    "audience": "owners",
    "unit_ids": null,
    "attachments": [
      { "id": "aa1e8400-e29b-41d4-a716-446655440001", "url": "https://...", "name": "horario.pdf", "type": "pdf" }
    ],
    "total_recipients": 42,
    "total_read": 18,
    "read": false,
    "scheduled_at": null,
    "published_at": "2026-06-23T10:00:00Z",
    "created_at": "2026-06-22T15:00:00Z",
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "ANNOUNCEMENT_NOT_FOUND",
    "message": "Comunicado no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: puede ver cualquier comunicado (incluido `draft`)
  - `role = user`: solo `published` y cuya audiencia lo incluya; en caso contrario `404` (no `403`, para no filtrar existencia)
  - La lectura del detalle **no** marca como leído — la confirmación es explícita vía §13.6
- **Side effects:** ninguno — lectura pura

---

## §13.4 Editar comunicado

```
PATCH /api/v1/announcements/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "title": "Cambio de horario de basuras (actualizado)",
  "body": "Texto corregido...",
  "audience": "specific_units",
  "unit_ids": ["550e8400-e29b-41d4-a716-446655440000"],
  "attachment_ids": ["aa1e8400-e29b-41d4-a716-446655440001"],
  "scheduled_at": "2026-07-02T13:00:00Z"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "title": "Cambio de horario de basuras (actualizado)",
    "body": "Texto corregido...",
    "status": "draft",
    "audience": "specific_units",
    "unit_ids": ["550e8400-e29b-41d4-a716-446655440000"],
    "updated_at": "2026-06-23T09:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "ANNOUNCEMENT_LOCKED",
    "message": "Un comunicado publicado no puede editarse",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Solo se puede editar si `status = draft`; un `published` retorna `409 ANNOUNCEMENT_LOCKED`
  - Si se cambia `audience` a `specific_units`, `unit_ids` es obligatorio (si no, `422 INVALID_AUDIENCE`)
  - `scheduled_at` debe ser futura
- **Side effects:** actualiza registro en `announcements` y revincula adjuntos si `attachment_ids` cambia

---

## §13.5 Publicar comunicado

```
POST /api/v1/announcements/{id}/publish
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "published",
    "published_at": "2026-06-23T10:00:00Z",
    "total_recipients": 42
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "ANNOUNCEMENT_ALREADY_PUBLISHED",
    "message": "El comunicado ya está publicado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo se puede publicar si `status = draft`; si ya está `published`, retorna `409 ANNOUNCEMENT_ALREADY_PUBLISHED`
  - Publicación inmediata: anula `scheduled_at` (publica ahora). Los comunicados con `scheduled_at` futura se publican automáticamente por un job de fondo usando el mismo flujo
  - Calcula `total_recipients` según `audience`:
    - `all` → todos los residentes activos
    - `owners` → residentes con `type = owner` activos
    - `tenants` → residentes con `type = tenant` activos
    - `specific_units` → residentes activos asignados a `unit_ids`
- **Side effects:**
  - Actualiza `status = published` y `published_at = NOW()` en `announcements`
  - Crea filas en `announcement_read_receipts` (una por destinatario, `read = false`) para auditar lectura
  - Dispara el feature [[endpoints/NOTIFICACIONES]]: emite una notificación `comunicado_nuevo` a cada destinatario, por los canales que tenga activos según sus preferencias (`in_app` siempre; `push`/`email` según `notification_preferences`)

> [!note] Side effect sobre NOTIFICACIONES
> La publicación de un comunicado encola tantas notificaciones `comunicado_nuevo` como destinatarios resulten de la audiencia. La entrega (in-app, push, email) la resuelve el módulo [[endpoints/NOTIFICACIONES]] respetando las preferencias del usuario — este endpoint solo encola. Para el flujo de preferencias, ver [[endpoints/NOTIFICACIONES]] §12.5 y §12.6.

---

## §13.6 Confirmar lectura

```
POST /api/v1/announcements/{id}/read
```

**Request:** vacío (el `user_id` se toma del JWT)

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
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
    "code": "ANNOUNCEMENT_NOT_FOUND",
    "message": "Comunicado no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = user`
- **Reglas de negocio:**
  - El comunicado debe estar `published` y el usuario debe estar dentro de la audiencia; en caso contrario `404` (no `403`, para no filtrar existencia)
  - Idempotente: confirmar una lectura ya registrada no genera error y refresca `read_at`
  - La marca de lectura se registra automáticamente cuando el residente abre el detalle — la app/web llama a este endpoint al renderizar §13.3
- **Side effects:**
  - Actualiza `read = true` y `read_at = NOW()` en `announcement_read_receipts` para el `(announcement_id, user_id)`
  - Si el usuario tenía una notificación `comunicado_nuevo` sin leer, se marca como leída (ver [[endpoints/NOTIFICACIONES]] §12.3)

---

## §13.7 Ver confirmaciones de lectura

```
GET /api/v1/announcements/{id}/read-receipts
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `read` | boolean | `true` = solo quienes leyeron, `false` = solo pendientes |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 50, max: 200) |

**Response `200`:**
```json
{
  "data": {
    "announcement_id": "990e8400-e29b-41d4-a716-446655440001",
    "total_recipients": 42,
    "total_read": 18,
    "receipts": [
      {
        "user_id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Juan Perez",
        "unit": "101 A",
        "read": true,
        "read_at": "2026-06-23T11:00:00Z"
      },
      {
        "user_id": "660e8400-e29b-41d4-a716-446655440099",
        "name": "Maria Lopez",
        "unit": "102 A",
        "read": false,
        "read_at": null
      }
    ]
  },
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 50,
      "total": 42,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo aplica a comunicados `published`; un `draft` no tiene `read_receipts` y retorna `404 ANNOUNCEMENT_NOT_FOUND`
  - Lista todos los destinatarios con su estado de lectura, útil para las estadísticas inline del drawer web
- **Side effects:** ninguno — lectura pura

---

## §13.8 Eliminar comunicado

```
DELETE /api/v1/announcements/{id}
```

**Response `204`:** (No Content)

**Response `409`:**
```json
{
  "error": {
    "code": "ANNOUNCEMENT_ALREADY_PUBLISHED",
    "message": "Un comunicado publicado no puede eliminarse",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo se puede eliminar si `status = draft`; un `published` retorna `409 ANNOUNCEMENT_ALREADY_PUBLISHED` (los comunicados publicados son inmutables y permanentes, para preservar el historial del canal oficial)
  - Eliminación lógica (`status = eliminado`, soft delete) — no borra físicamente el registro
- **Side effects:**
  - Marca el registro en `announcements` como eliminado
  - Desvincula los adjuntos referenciados en `announcement_attachments` (no elimina los archivos subidos)

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec Web: [[02-web/features/comunicados/COMUNICADOS_SPEC]]
- Spec App: [[03-app/features/comunicados/COMUNICADOS_SPEC]]
- Panorama global: [[00-shared/features/COMUNICADOS]]
- Notificaciones (side effect de publicación): [[endpoints/NOTIFICACIONES]]
