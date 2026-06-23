---
type: reference
status: active
module: mantenimiento
scope: api
tags: [api, endpoints, mantenimiento]
updated: 2026-06-23
---

# Endpoints: Mantenimiento preventivo

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Mantenimiento preventivo.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Gestión del mantenimiento preventivo de los activos del conjunto (ascensores, bombas, generadores, HVAC, puertas, etc.). Cubre el catálogo de activos con su plan de frecuencia y el registro de las ejecuciones de mantenimiento. Complementa a [[endpoints/ORDENES-TRABAJO]] (correctivo) con la gestión del preventivo. **Solo Web; N/A en App** — es gestión puramente administrativa.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 19.1 | GET | `/assets` | Sí | admin | Diseñado |
| 19.2 | POST | `/assets` | Sí | admin | Diseñado |
| 19.3 | GET | `/assets/{id}` | Sí | admin | Diseñado |
| 19.4 | PATCH | `/assets/{id}` | Sí | admin | Diseñado |
| 19.5 | DELETE | `/assets/{id}` | Sí | admin | Diseñado |
| 19.6 | GET | `/maintenance-records` | Sí | admin | Diseñado |
| 19.7 | POST | `/maintenance-records` | Sí | admin | Diseñado |
| 19.8 | POST | `/maintenance-records/{id}/execute` | Sí | admin | Diseñado |
| 19.9 | PATCH | `/maintenance-records/{id}` | Sí | admin | Diseñado |
| 19.10 | POST | `/maintenance-records/{id}/cancel` | Sí | admin | Diseñado |
| 19.11 | POST | `/assets/{id}/schedule-next` | Sí | admin | Diseñado |

---

## §19.1 Listar activos

```
GET /api/v1/assets
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `area` | string | Filtrar por área/zona: `common_zone_id` (UUID) o `building` (torre/bloque) |
| `type` | string | `elevator`, `pump`, `generator`, `hvac`, `door`, `other` |
| `status` | string | `active`, `inactive` |
| `provider_id` | uuid | Filtrar por proveedor responsable |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "name": "Ascensor Torre A",
      "type": "elevator",
      "area": { "kind": "building", "value": "A" },
      "location_description": "Ascensor principal, lado sur",
      "status": "active",
      "frequency_days": 30,
      "next_maintenance_at": "2026-07-15T10:00:00Z",
      "provider_id": "660e8400-e29b-41d4-a716-446655440010",
      "cost_per_maintenance": 250000,
      "created_at": "2026-01-10T08:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 24,
      "total_pages": 2
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Side effects:** ninguno — lectura pura

---

## §19.2 Crear activo

```
POST /api/v1/assets
```

**Request:**
```json
{
  "name": "Bomba hidroneumática sótano",
  "area": { "kind": "common_zone", "value": "550e8400-e29b-41d4-a716-446655440020" },
  "type": "pump",
  "location_description": "Cuarto de bombas sótano 2",
  "frequency_days": 60,
  "next_maintenance_at": "2026-08-01T10:00:00Z",
  "provider_id": "660e8400-e29b-41d4-a716-446655440010",
  "cost_per_maintenance": 180000
}
```

> [!note] Campo `area`
> Objeto con `kind` + `value`. `kind = common_zone` → `value` es un UUID de `common_zones`. `kind = building` → `value` es el identificador de torre/bloque. Se requiere uno de los dos.

> [!note] Tipos válidos de `type`
> `elevator` (ascensor) | `pump` (bomba) | `generator` (generador) | `hvac` (climatización) | `door` (portón/puerta automática) | `other` (otro).

**Response `201`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440099",
    "name": "Bomba hidroneumática sótano",
    "type": "pump",
    "area": { "kind": "common_zone", "value": "550e8400-e29b-41d4-a716-446655440020" },
    "location_description": "Cuarto de bombas sótano 2",
    "status": "active",
    "frequency_days": 60,
    "next_maintenance_at": "2026-08-01T10:00:00Z",
    "provider_id": "660e8400-e29b-41d4-a716-446655440010",
    "cost_per_maintenance": 180000,
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_SCHEDULE_DATE",
    "message": "La fecha no puede ser anterior a NOW",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `type` debe pertenecer al conjunto enumerado
  - `area` debe referenciar una zona común existente (`common_zone_id`) o un `building` válido
  - `frequency_days` debe ser entero positivo (> 0)
  - `next_maintenance_at` es opcional — si se envía, debe ser posterior a NOW; si se omite, no se agenda aún
  - `provider_id` opcional — si se envía, debe existir en `providers` y estar activo
- **Side effects:**
  - Crea registro en `assets`
  - No crea `maintenance_records` automáticamente (se agenda con §19.7 o §19.11)

---

## §19.3 Ver ficha del activo (con historial y próximo)

```
GET /api/v1/assets/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Ascensor Torre A",
    "type": "elevator",
    "area": { "kind": "building", "value": "A" },
    "location_description": "Ascensor principal, lado sur",
    "status": "active",
    "frequency_days": 30,
    "next_maintenance_at": "2026-07-15T10:00:00Z",
    "provider_id": "660e8400-e29b-41d4-a716-446655440010",
    "cost_per_maintenance": 250000,
    "last_maintenance": {
      "id": "880e8400-e29b-41d4-a716-446655440050",
      "executed_at": "2026-06-15T11:00:00Z",
      "technician_id": "550e8400-e29b-41d4-a716-446655440005",
      "total_cost": 270000
    },
    "maintenance_history": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440050",
        "scheduled_at": "2026-06-15T10:00:00Z",
        "executed_at": "2026-06-15T11:00:00Z",
        "status": "completed",
        "technician_id": "550e8400-e29b-41d4-a716-446655440005",
        "total_cost": 270000
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440049",
        "scheduled_at": "2026-05-15T10:00:00Z",
        "executed_at": "2026-05-15T10:30:00Z",
        "status": "completed",
        "technician_id": "550e8400-e29b-41d4-a716-446655440005",
        "total_cost": 250000
      }
    ],
    "next_scheduled_record": {
      "id": "880e8400-e29b-41d4-a716-446655440077",
      "scheduled_at": "2026-07-15T10:00:00Z",
      "status": "scheduled"
    },
    "created_at": "2026-01-10T08:00:00Z",
    "updated_at": "2026-06-15T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "Activo no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Incluye `maintenance_history` (todos los `maintenance_records` del activo, ordenados desc por `scheduled_at`)
  - Incluye `last_maintenance` (último `completed`) y `next_scheduled_record` (próximo `scheduled` más cercano), si existen
  - `next_maintenance_at` del asset se sincroniza con el siguiente registro programado
- **Side effects:** ninguno — lectura pura

---

## §19.4 Editar activo

```
PATCH /api/v1/assets/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "name": "Ascensor Torre A (Actualizado)",
  "location_description": "Ascensor principal, lado sur — revisado",
  "frequency_days": 45,
  "next_maintenance_at": "2026-07-20T10:00:00Z",
  "provider_id": "660e8400-e29b-41d4-a716-446655440011",
  "cost_per_maintenance": 260000,
  "status": "active"
}
```

> [!note]
> `type` y `area` no son editables — si cambian, se debe recrear el activo. Para activar/desactivar, usar `status: "active"` | `"inactive"`.

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Ascensor Torre A (Actualizado)",
    "frequency_days": 45,
    "next_maintenance_at": "2026-07-20T10:00:00Z",
    "provider_id": "660e8400-e29b-41d4-a716-446655440011",
    "cost_per_maintenance": 260000,
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "Activo no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - `next_maintenance_at`, si se envía, debe ser posterior a NOW
  - Cambiar `status` a `inactive` bloquea la programación de nuevos mantenimientos (§19.7 y §19.11)
- **Side effects:** actualiza registro en `assets`

---

## §19.5 Eliminar activo

```
DELETE /api/v1/assets/{id}
```

**Response `204`:** (No Content)

**Response `404`:**
```json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "Activo no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MAINTENANCE_ALREADY_EXECUTED",
    "message": "No se puede eliminar un activo con mantenimientos completados",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Soft delete — se marca `status = inactive` y `deleted_at = NOW()`
  - Si el activo tiene `maintenance_records` en estado `completed`, se rechaza (`409`) y se recomienda inactivar en su lugar
  - Si tiene registros `scheduled`, se cancelan automáticamente al eliminar
- **Side effects:**
  - Marca el activo como inactivo/eliminado en `assets`
  - Cancela registros `scheduled` asociados (`maintenance_records.status = cancelled`)

---

## §19.6 Listar registros de mantenimiento

```
GET /api/v1/maintenance-records
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `asset_id` | uuid | Filtrar por activo |
| `from` | timestamp ISO 8601 | Fecha `scheduled_at` desde (inclusive) |
| `to` | timestamp ISO 8601 | Fecha `scheduled_at` hasta (inclusive) |
| `status` | string | `scheduled`, `completed`, `cancelled` |
| `technician_id` | uuid | Filtrar por técnico |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440077",
      "asset_id": "770e8400-e29b-41d4-a716-446655440001",
      "asset_name": "Ascensor Torre A",
      "status": "scheduled",
      "scheduled_at": "2026-07-15T10:00:00Z",
      "executed_at": null,
      "technician_id": "550e8400-e29b-41d4-a716-446655440005",
      "provider_id": "660e8400-e29b-41d4-a716-446655440010",
      "estimated_cost": 250000,
      "materials_cost": null,
      "labor_cost": null,
      "total_cost": null,
      "notes": null,
      "cancelled_reason": null,
      "created_at": "2026-06-10T08:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 48,
      "total_pages": 3
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Orden descendente por `scheduled_at`
  - `from` y `to` aplican sobre `scheduled_at` (no `executed_at`)
- **Side effects:** ninguno — lectura pura

---

## §19.7 Programar una ejecución de mantenimiento

```
POST /api/v1/maintenance-records
```

**Request:**
```json
{
  "asset_id": "770e8400-e29b-41d4-a716-446655440001",
  "scheduled_at": "2026-07-15T10:00:00Z",
  "technician_id": "550e8400-e29b-41d4-a716-446655440005",
  "provider_id": "660e8400-e29b-41d4-a716-446655440010",
  "estimated_cost": 250000
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440077",
    "asset_id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "scheduled",
    "scheduled_at": "2026-07-15T10:00:00Z",
    "technician_id": "550e8400-e29b-41d4-a716-446655440005",
    "provider_id": "660e8400-e29b-41d4-a716-446655440010",
    "estimated_cost": 250000,
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "Activo no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "ASSET_INACTIVE",
    "message": "No se puede programar mantenimiento de un activo inactivo",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_SCHEDULE_DATE",
    "message": "La fecha programada no puede ser anterior a NOW",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `asset_id` debe existir y estar `active` — si está `inactive`, se rechaza con `ASSET_INACTIVE`
  - `scheduled_at` debe ser posterior a NOW — si no, `INVALID_SCHEDULE_DATE`
  - `technician_id` y `provider_id` opcionales — si se envían, deben existir y estar activos
  - `estimated_cost` opcional — default tomado de `assets.cost_per_maintenance` si el activo lo tiene
  - El nuevo registro se crea en estado `scheduled`
- **Side effects:**
  - Crea registro en `maintenance_records`
  - Si es el registro `scheduled` más cercano, actualiza `assets.next_maintenance_at`

---

## §19.8 Registrar ejecución de mantenimiento

```
POST /api/v1/maintenance-records/{id}/execute
```

**Request:**
```json
{
  "executed_at": "2026-07-15T11:00:00Z",
  "technician_id": "550e8400-e29b-41d4-a716-446655440005",
  "notes": "Cambio de aceite y revisión de frenos. Todo en orden.",
  "materials_cost": 40000,
  "labor_cost": 210000,
  "photos_after": ["https://cdn.example.com/m1.jpg", "https://cdn.example.com/m2.jpg"]
}
```

> [!note]
> Transición de estado `scheduled → completed`. `total_cost = materials_cost + labor_cost` (cuando ambos vienen).

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440077",
    "asset_id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "completed",
    "scheduled_at": "2026-07-15T10:00:00Z",
    "executed_at": "2026-07-15T11:00:00Z",
    "technician_id": "550e8400-e29b-41d4-a716-446655440005",
    "materials_cost": 40000,
    "labor_cost": 210000,
    "total_cost": 250000,
    "notes": "Cambio de aceite y revisión de frenos. Todo en orden.",
    "photos": [
      { "id": "990e8400-e29b-41d4-a716-446655440001", "url": "https://cdn.example.com/m1.jpg" },
      { "id": "990e8400-e29b-41d4-a716-446655440002", "url": "https://cdn.example.com/m2.jpg" }
    ],
    "updated_at": "2026-07-15T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "MAINTENANCE_RECORD_NOT_FOUND",
    "message": "Registro de mantenimiento no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MAINTENANCE_ALREADY_EXECUTED",
    "message": "El registro ya fue completado y no se puede ejecutar de nuevo",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`; el registro debe estar `scheduled`
- **Reglas de negocio:**
  - Si el registro ya está `completed`, se rechaza con `MAINTENANCE_ALREADY_EXECUTED` (idempotente de error)
  - Si el registro está `cancelled`, se rechaza con `409`
  - `executed_at` debe ser una fecha válida (acepta fechas pasadas recientes para registrar a posteriori)
  - `photos_after[]` opcional — cada URL debe ser accesible; se persisten en `maintenance_photos`
  - `total_cost = (materials_cost ?? 0) + (labor_cost ?? 0)`
- **Side effects:**
  - Actualiza `maintenance_records` (status, executed_at, costs, notes)
  - Crea filas en `maintenance_photos` por cada URL enviada
  - Actualiza `assets.last_maintenance_at` y recalcula `next_maintenance_at` según `frequency_days`
  - Emite notificación `orden_trabajo`/`mantenimiento_completado` vía [[endpoints/NOTIFICACIONES]]

---

## §19.9 Editar registro de mantenimiento

```
PATCH /api/v1/maintenance-records/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "scheduled_at": "2026-07-18T10:00:00Z",
  "technician_id": "550e8400-e29b-41d4-a716-446655440005",
  "provider_id": "660e8400-e29b-41d4-a716-446655440011",
  "estimated_cost": 255000
}
```

> [!note]
> Solo se puede editar si el registro está `scheduled`. Registros `completed` o `cancelled` son inmutables.

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440077",
    "status": "scheduled",
    "scheduled_at": "2026-07-18T10:00:00Z",
    "technician_id": "550e8400-e29b-41d4-a716-446655440005",
    "provider_id": "660e8400-e29b-41d4-a716-446655440011",
    "estimated_cost": 255000,
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "MAINTENANCE_RECORD_NOT_FOUND",
    "message": "Registro de mantenimiento no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MAINTENANCE_ALREADY_EXECUTED",
    "message": "No se puede editar un registro completado o cancelado",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_SCHEDULE_DATE",
    "message": "La fecha programada no puede ser anterior a NOW",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`; el registro debe estar `scheduled`
- **Reglas de negocio:**
  - Si el registro está `completed` o `cancelled`, se rechaza con `MAINTENANCE_ALREADY_EXECUTED`
  - Si se cambia `scheduled_at`, debe ser posterior a NOW
  - PATCH parcial — solo se actualizan los campos enviados
- **Side effects:**
  - Actualiza `maintenance_records`
  - Si cambia `scheduled_at` y sigue siendo el más cercano, recalcula `assets.next_maintenance_at`

---

## §19.10 Cancelar registro de mantenimiento

```
POST /api/v1/maintenance-records/{id}/cancel
```

**Request:**
```json
{
  "reason": "Conflicto de agenda del proveedor"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440077",
    "status": "cancelled",
    "cancelled_reason": "Conflicto de agenda del proveedor",
    "cancelled_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "MAINTENANCE_RECORD_NOT_FOUND",
    "message": "Registro de mantenimiento no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MAINTENANCE_ALREADY_EXECUTED",
    "message": "No se puede cancelar un registro completado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`; el registro debe estar `scheduled`
- **Reglas de negocio:**
  - Si el registro está `completed`, se rechaza con `MAINTENANCE_ALREADY_EXECUTED`
  - `reason` obligatorio (texto libre, min 5 caracteres)
  - Idempotente: cancelar un registro ya `cancelled` retorna `200` sin cambios
- **Side effects:**
  - Actualiza `maintenance_records` (`status = cancelled`, `cancelled_reason`, `cancelled_at = NOW()`)
  - Recalcula `assets.next_maintenance_at` al siguiente `scheduled` disponible

---

## §19.11 Agendar próximo mantenimiento

```
POST /api/v1/assets/{id}/schedule-next
```

> [!note] Uso
> Calcula y crea el siguiente registro `scheduled` según `frequency_days` del activo. Toma como base el último `executed_at` (o `next_maintenance_at` si no hay historial) y le suma `frequency_days`. Atajo administrativo para regenerar el ciclo preventivo.

**Request:** vacío

**Response `201`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440099",
    "asset_id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "scheduled",
    "scheduled_at": "2026-08-14T10:00:00Z",
    "estimated_cost": 250000,
    "created_at": "2026-07-15T11:05:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "ASSET_NOT_FOUND",
    "message": "Activo no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "ASSET_INACTIVE",
    "message": "No se puede programar mantenimiento de un activo inactivo",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`; el activo debe estar `active`
- **Reglas de negocio:**
  - Calcula `next = last_executed_at + frequency_days` si existe historial; si no, `next = next_maintenance_at` (si válido) o `NOW + frequency_days`
  - Si ya existe un registro `scheduled` con la misma fecha calculada, lo retorna (idempotente) en lugar de crear duplicado
  - Si el activo está `inactive`, se rechaza con `ASSET_INACTIVE`
  - `frequency_days` debe ser > 0 — si el activo no lo tiene, se rechaza con `422`
- **Side effects:**
  - Crea registro en `maintenance_records` (status `scheduled`)
  - Actualiza `assets.next_maintenance_at`

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec Web: [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]]
- Panorama global: [[00-shared/features/MANTENIMIENTO]]
- Módulos relacionados: [[endpoints/ORDENES-TRABAJO]], [[endpoints/PROVEEDORES]], [[endpoints/NOTIFICACIONES]]