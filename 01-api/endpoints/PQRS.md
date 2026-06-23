---
type: reference
status: active
module: pqrs
scope: api
tags: [api, endpoints, pqrs]
updated: 2026-06-23
---

# Endpoints: PQRS

> [!info] Consultar
> Documento de detalle de los endpoints del módulo PQRS (Peticiones, Quejas, Reclamos y Sugerencias).
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Canal formal de radicado con flujo de estados auditado, hilo de mensajes entre residente y administración, adjuntos, asignación de responsable y calificación de cierre. Todo cambio de estado emite una notificación al residente vía [[endpoints/NOTIFICACIONES]] (`type = pqrs_actualizada`). El residente solo ve y opera sus propias PQRS; el admin gestiona todas.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 14.1 | GET | `/pqrs` | Sí | admin, user* | Diseñado |
| 14.2 | POST | `/pqrs` | Sí | admin, user | Diseñado |
| 14.3 | GET | `/pqrs/{id}` | Sí | admin, user* | Diseñado |
| 14.4 | POST | `/pqrs/{id}/messages` | Sí | admin, user | Diseñado |
| 14.5 | PATCH | `/pqrs/{id}/assign` | Sí | admin | Diseñado |
| 14.6 | PATCH | `/pqrs/{id}/status` | Sí | admin | Diseñado |
| 14.7 | POST | `/pqrs/{id}/rate` | Sí | user | Diseñado |
| 14.8 | GET | `/pqrs/types` | Sí | admin, user | Diseñado |
| 14.9 | GET | `/pqrs/{id}/attachments/{attachment_id}` | Sí | admin, user* | Diseñado |

> `*` Un residente (`role = user`) solo puede acceder a PQRS cuyo `resident_id` coincida con su usuario. Cualquier intento sobre `id` ajeno retorna `404` (no `403`, para no filtrar existencia).

---

## §14.1 Listar PQRS

```
GET /api/v1/pqrs
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `open`, `in_progress`, `waiting_response`, `resolved`, `closed`, `rejected` |
| `type` | string | `petition`, `complaint`, `claim`, `suggestion` |
| `assigned_to` | uuid | Filtrar por responsable (admin) |
| `search` | string | Búsqueda por `numero_radicado` o `title` |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

> [!note] Alcance por rol
> `admin`: retorna todas las PQRS del conjunto, aplica todos los filtros. `user`: ignora los filtros de gestión y devuelve solo sus propias PQRS (`resident_id = JWT.user_id`).

**Response `200`:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "numero_radicado": "PQRS-2026-00042",
      "type": "complaint",
      "status": "in_progress",
      "title": "Ruido en zona común",
      "unit": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "number": "101",
        "tower": "A"
      },
      "resident": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Juan Perez"
      },
      "assigned_to": {
        "id": "660e8400-e29b-41d4-a716-446655440010",
        "name": "Admin Sastre"
      },
      "created_at": "2026-06-23T10:00:00Z",
      "updated_at": "2026-06-23T12:30:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 42,
      "total_pages": 3
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Side effects:** ninguno — lectura pura

---

## §14.2 Crear PQRS

```
POST /api/v1/pqrs
```

**Request:**
```json
{
  "type": "complaint",
  "title": "Ruido en zona común",
  "description": "El vecino del 102 pone música alta después de las 11pm.",
  "unit_id": "550e8400-e29b-41d4-a716-446655440000",
  "attachment_ids": ["990e8400-e29b-41d4-a716-446655440001"]
}
```

> [!note] Tipos de PQRS
> `petition` = petición | `complaint` = queja | `claim` = reclamo | `suggestion` = sugerencia

> [!note] Radicación por admin
> `admin` puede radicar en nombre de un residente enviando `resident_id` opcional. Si se omite, se asigna al admin como solicitante interno. `user` no puede enviar `resident_id` (se ignora y se usa su `user_id`).

**Response `201`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "numero_radicado": "PQRS-2026-00042",
    "type": "complaint",
    "status": "open",
    "title": "Ruido en zona común",
    "description": "El vecino del 102 pone música alta después de las 11pm.",
    "unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A"
    },
    "resident": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Juan Perez"
    },
    "assigned_to": null,
    "attachments": [
      { "id": "990e8400-e29b-41d4-a716-446655440001", "filename": "evidencia.jpg", "size": 204800 }
    ],
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo unit_id es obligatorio",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `numero_radicado` se genera automáticamente con formato `PQRS-YYYY-NNNNN` (secuencia anual por conjunto) — único en el sistema
  - `status` inicial = `open`
  - `unit_id` debe existir y pertenecer al conjunto del usuario
  - Para `user`: `unit_id` debe corresponder a una unidad vinculada al residente
  - `attachment_ids` deben existir y estar marcados como adjuntos temporales del usuario (ver §14.9); se asocian a la PQRS al crear
  - Un residente con `status = suspended` (ver [[endpoints/RESIDENTES]] §3.6) no puede radicar PQRS → `403 FORBIDDEN`
- **Side effects:**
  - Crea registro en `pqrs`
  - Asocia filas en `pqrs_attachments`
  - Crea primer evento en `pqrs_status_history` (`status = open`)
  - Emite notificación al admin de gestión vía [[endpoints/NOTIFICACIONES]] (`type = pqrs_actualizada`)

---

## §14.3 Ver detalle de PQRS

```
GET /api/v1/pqrs/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "numero_radicado": "PQRS-2026-00042",
    "type": "complaint",
    "status": "in_progress",
    "title": "Ruido en zona común",
    "description": "El vecino del 102 pone música alta después de las 11pm.",
    "unit": { "id": "550e8400-e29b-41d4-a716-446655440000", "number": "101", "tower": "A" },
    "resident": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Juan Perez" },
    "assigned_to": { "id": "660e8400-e29b-41d4-a716-446655440010", "name": "Admin Sastre" },
    "messages": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440001",
        "author": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Juan Perez", "role": "user" },
        "body": "Adjunto evidencia de ayer.",
        "attachments": [
          { "id": "990e8400-e29b-41d4-a716-446655440001", "filename": "evidencia.jpg", "size": 204800 }
        ],
        "created_at": "2026-06-23T10:05:00Z"
      }
    ],
    "timeline": [
      { "id": "aa0e8400-e29b-41d4-a716-446655440001", "status": "open", "actor": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Juan Perez" }, "comment": null, "created_at": "2026-06-23T10:00:00Z" },
      { "id": "aa0e8400-e29b-41d4-a716-446655440002", "status": "in_progress", "actor": { "id": "660e8400-e29b-41d4-a716-446655440010", "name": "Admin Sastre" }, "comment": "Se revisa con vigilancia.", "created_at": "2026-06-23T12:30:00Z" }
    ],
    "rating": null,
    "created_at": "2026-06-23T10:00:00Z",
    "updated_at": "2026-06-23T12:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PQRS_NOT_FOUND",
    "message": "PQRS no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `user`: solo puede ver PQRS propias; `id` ajeno retorna `404 PQRS_NOT_FOUND`
  - `admin`: puede ver cualquier PQRS
  - `messages` se retornan ordenados ascendentemente por `created_at` (hilo cronológico)
  - `timeline` se retorna completa (historial de `pqrs_status_history`)
  - `rating` es `null` hasta que el residente califica el cierre (§14.7)
- **Side effects:** ninguno — lectura pura

---

## §14.4 Añadir mensaje al hilo

```
POST /api/v1/pqrs/{id}/messages
```

**Request:**
```json
{
  "body": "Adjunto nueva evidencia de esta noche.",
  "attachment_ids": ["990e8400-e29b-41d4-a716-446655440002"]
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440002",
    "author": { "id": "660e8400-e29b-41d4-a716-446655440001", "name": "Juan Perez", "role": "user" },
    "body": "Adjunto nueva evidencia de esta noche.",
    "attachments": [
      { "id": "990e8400-e29b-41d4-a716-446655440002", "filename": "evidencia2.jpg", "size": 153600 }
    ],
    "created_at": "2026-06-23T22:10:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PQRS_CLOSED",
    "message": "No se puede modificar una PQRS cerrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `user`: solo puede comentar en PQRS propias y solo si `status ∈ {open, in_progress, waiting_response}` — no se permite comentar PQRS `resolved`, `closed` o `rejected`
  - `admin`: puede comentar en cualquier PQRS no terminal (`status ∈ {open, in_progress, waiting_response}`)
  - Sobre una PQRS `closed` o `rejected`: retorna `409 PQRS_CLOSED`
  - `body` es obligatorio (min 1, max 2000 chars); `attachment_ids` opcional
- **Side effects:**
  - Crea registro en `pqrs_messages`
  - Asocia filas en `pqrs_attachments` al mensaje
  - Si el autor es `user`, notifica al admin asignado; si es `admin`, notifica al residente — vía [[endpoints/NOTIFICACIONES]] (`type = pqrs_actualizada`)

---

## §14.5 Asignar responsable

```
PATCH /api/v1/pqrs/{id}/assign
```

**Request:**
```json
{
  "user_id": "660e8400-e29b-41d4-a716-446655440010",
  "comment": "Asignado a Sastre por ser la guardia de hoy."
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "assigned_to": {
      "id": "660e8400-e29b-41d4-a716-446655440010",
      "name": "Admin Sastre"
    }
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "ASSIGNEE_NOT_VALID",
    "message": "El usuario asignado no es un administrador interno válido",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `user_id` debe existir, estar activo y tener `role = admin` — en caso contrario `422 ASSIGNEE_NOT_VALID`
  - `comment` es obligatorio (auditoría de asignación)
  - Se puede reasignar (cambia `assigned_to`) en cualquier estado no terminal
  - Sobre PQRS `closed` o `rejected`: `409 PQRS_CLOSED`
- **Side effects:**
  - Actualiza `assigned_to` en `pqrs`
  - Crea entrada en `pqrs_status_history` con `action = assigned` (metadato del cambio, sin cambio de `status`)
  - Notifica al nuevo responsable y al residente vía [[endpoints/NOTIFICACIONES]]

---

## §14.6 Cambiar estado

```
PATCH /api/v1/pqrs/{id}/status
```

**Request:**
```json
{
  "status": "waiting_response",
  "comment": "Se solicitó informe a vigilancia. Pendiente respuesta del residente."
}
```

> [!note] Valores válidos de `status`
> `open` → `in_progress`, `rejected` | `in_progress` → `waiting_response`, `resolved`, `closed`, `rejected` | `waiting_response` → `in_progress`, `resolved`, `closed` | `resolved` → `closed` | `closed`, `rejected` = terminales

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "waiting_response",
    "previous_status": "in_progress",
    "timeline_entry": {
      "id": "aa0e8400-e29b-41d4-a716-446655440003",
      "status": "waiting_response",
      "actor": { "id": "660e8400-e29b-41d4-a716-446655440010", "name": "Admin Sastre" },
      "comment": "Se solicitó informe a vigilancia. Pendiente respuesta del residente.",
      "created_at": "2026-06-23T13:00:00Z"
    }
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PQRS_CLOSED",
    "message": "No se puede modificar una PQRS cerrada",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Transición no permitida: no se puede pasar de closed a in_progress",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `comment` es obligatorio para toda transición (trazabilidad)
  - Transición debe estar permitida según la tabla del callout anterior; si no, `422 INVALID_STATE_TRANSITION`
  - Si el `status` actual es `closed` o `rejected`, cualquier cambio retorna `409 PQRS_CLOSED`
  - Para `status = closed`: el `comment` debe contener la resolución (mínimo 10 chars)
- **Side effects:**
  - Actualiza `status` y `updated_at` en `pqrs`
  - Crea entrada en `pqrs_status_history` con `actor`, `previous_status`, `status` y `comment`
  - Emite notificación al residente vía [[endpoints/NOTIFICACIONES]] (`type = pqrs_actualizada`, `action_url` al detalle)

---

## §14.7 Calificar cierre

```
POST /api/v1/pqrs/{id}/rate
```

**Request:**
```json
{
  "rating": 5,
  "comment": "Resuelto rápido y con buen trato."
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "rating": {
      "rating": 5,
      "comment": "Resuelto rápido y con buen trato.",
      "created_at": "2026-06-24T09:00:00Z"
    }
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "RATING_NOT_ALLOWED",
    "message": "Solo se puede calificar una PQRS cerrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = user`
- **Reglas de negocio:**
  - Solo el residente propietario puede calificar; `id` ajeno retorna `404 PQRS_NOT_FOUND`
  - `status` debe ser `closed`; en caso contrario `409 RATING_NOT_ALLOWED`
  - `rating` entero entre 1 y 5 (obligatorio); `comment` opcional (max 500 chars)
  - Idempotente: si ya existe calificación, se reemplaza (editable mientras la PQRS permanezca `closed`)
- **Side effects:**
  - Crea o actualiza fila en `pqrs_ratings` (upsert por `pqrs_id`)
  - No emite notificación al residente (es su propia acción); opcionalmente notifica al admin asignado con la calificación recibida vía [[endpoints/NOTIFICACIONES]]

---

## §14.8 Metadatos: tipos y estados

```
GET /api/v1/pqrs/types
```

> [!note] Uso
> Endpoint de metadatos para poblar selects/filtros en Web y App. Lectura pura, sin paginación.

**Response `200`:**
```json
{
  "data": {
    "types": ["petition", "complaint", "claim", "suggestion"],
    "statuses": ["open", "in_progress", "waiting_response", "resolved", "closed", "rejected"],
    "transitions": {
      "open": ["in_progress", "rejected"],
      "in_progress": ["waiting_response", "resolved", "closed", "rejected"],
      "waiting_response": ["in_progress", "resolved", "closed"],
      "resolved": ["closed"],
      "closed": [],
      "rejected": []
    }
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:** los valores provienen de los ENUMs de dominio (alineados con `API_DATABASE`); `transitions` refleja la matriz de §14.6
- **Side effects:** ninguno — lectura pura

---

## §14.9 Descargar adjunto

```
GET /api/v1/pqrs/{id}/attachments/{attachment_id}
```

**Response `200`:**
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="evidencia.jpg"
```

> El body es el stream binario del archivo almacenado. El servidor valida que el `attachment_id` pertenezca a la PQRS `{id}` antes de servirlo.

**Response `404`:**
```json
{
  "error": {
    "code": "PQRS_NOT_FOUND",
    "message": "Adjunto no encontrado para esta PQRS",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `user`: solo descarga adjuntos de PQRS propias; `id` ajeno → `404 PQRS_NOT_FOUND`
  - `admin`: descarga adjuntos de cualquier PQRS
  - El `attachment_id` debe estar asociado a la PQRS `{id}` (ya sea al radicado o a un mensaje del hilo); si no → `404 PQRS_NOT_FOUND`
  - No se exige que la PQRS esté abierta — los adjuntos son consultables incluso tras el cierre
- **Side effects:** ninguno — lectura pura (se puede registrar `download_at` a futuro para auditoría, fuera de scope del diseño actual)

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/pqrs/PQRS_SPEC]]
- Spec App: [[03-app/features/pqrs/PQRS_SPEC]]
- Panorama global: [[00-shared/features/PQRS]]
- Notificaciones (side effect): [[endpoints/NOTIFICACIONES]]
- Residentes (validación de solicitante): [[endpoints/RESIDENTES]]
