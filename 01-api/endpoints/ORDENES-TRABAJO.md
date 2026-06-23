---
type: reference
status: active
module: ordenes-trabajo
scope: api
tags: [api, endpoints, ordenes-trabajo]
updated: 2026-06-23
---

# Endpoints: Órdenes de trabajo

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Órdenes de trabajo.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Mantenimiento **correctivo** de áreas comunes (complementa MANTENIMIENTO preventivo). Una orden de trabajo (OT) nace de un reporte (PQRS heredada o creación manual del admin), se asigna a un técnico, se ejecuta y se cierra con evidencia fotográfica y costo. Las transiciones de estado que afectan al técnico o al residente reportante emiten notificaciones vía [[endpoints/NOTIFICACIONES]] (type `orden_trabajo`).

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 15.1 | GET | `/work-orders` | Sí | admin, technician*, user* | Diseñado |
| 15.2 | POST | `/work-orders` | Sí | admin | Diseñado |
| 15.3 | GET | `/work-orders/{id}` | Sí | admin, technician*, user* | Diseñado |
| 15.4 | PATCH | `/work-orders/{id}` | Sí | admin | Diseñado |
| 15.5 | PATCH | `/work-orders/{id}/assign` | Sí | admin | Diseñado |
| 15.6 | PATCH | `/work-orders/{id}/reschedule` | Sí | admin, technician* | Diseñado |
| 15.7 | POST | `/work-orders/{id}/start` | Sí | admin, technician* | Diseñado |
| 15.8 | POST | `/work-orders/{id}/complete` | Sí | admin, technician* | Diseñado |
| 15.9 | POST | `/work-orders/{id}/cancel` | Sí | admin | Diseñado |
| 15.10 | POST | `/work-orders/{id}/photos` | Sí | admin, technician* | Diseñado |
| 15.11 | GET | `/work-orders/areas` | Sí | admin | Diseñado |

> `*` technician: solo órdenes asignadas a él/ella (`technician_id = user_id`).
> `*` user (residente): solo órdenes que él/ella reportó (`reported_by = user_id`). En listados se filtra automáticamente; en mutaciones sobre OT ajena retorna `403 FORBIDDEN`.

---

## §15.1 Listar órdenes de trabajo

```
GET /api/v1/work-orders
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `open`, `assigned`, `in_progress`, `completed`, `cancelled` |
| `priority` | string | `low`, `medium`, `high`, `urgent` |
| `technician_id` | uuid | Filtrar por técnico asignado |
| `area` | string | Filtrar por tipo de área: `common_zone`, `unit`, `building` |
| `from` | date ISO 8601 | Creadas a partir de esta fecha (inclusive) |
| `to` | date ISO 8601 | Creadas hasta esta fecha (inclusive) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "code": "OT-2026-0042",
      "title": "Goteo en tubería lobby Torre A",
      "status": "open",
      "priority": "high",
      "area": {
        "type": "common_zone",
        "ref_id": "550e8400-e29b-41d4-a716-446655440010",
        "label": "Lobby Torre A"
      },
      "technician": null,
      "estimated_date": null,
      "final_cost": null,
      "created_at": "2026-06-23T10:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 47,
      "total_pages": 3
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: ve todas las órdenes del conjunto
  - `role = technician`: se ignora cualquier `technician_id` del query y se filtra automáticamente por `technician_id = user_id`
  - `role = user`: se filtra automáticamente por `reported_by = user_id`
  - Orden descendente por `created_at`
- **Side effects:** ninguno — lectura pura

---

## §15.2 Crear orden de trabajo

```
POST /api/v1/work-orders
```

**Request:**
```json
{
  "title": "Goteo en tubería lobby Torre A",
  "description": "Se observa goteo constante en tubería principal del lobby...",
  "area": {
    "type": "common_zone",
    "ref_id": "550e8400-e29b-41d4-a716-446655440010"
  },
  "priority": "high",
  "technician_id": "660e8400-e29b-41d4-a716-446655440050",
  "estimated_date": "2026-07-01",
  "materials_ids": [
    "990e8400-e29b-41d4-a716-446655440001",
    "990e8400-e29b-41d4-a716-446655440002"
  ],
  "pqrs_id": "440e8400-e29b-41d4-a716-446655440099"
}
```

> [!note] Campos opcionales
> `technician_id`, `estimated_date`, `materials_ids` y `pqrs_id` son opcionales.
> Si se omite `technician_id`, la OT queda en estado `open` (pendiente de asignación).
> Si se envía `technician_id`, la OT nace en estado `assigned`.
> Si se envía `pqrs_id` con `description` vacío, se hereda la descripción de la PQRS.

**Response `201`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "code": "OT-2026-0042",
    "title": "Goteo en tubería lobby Torre A",
    "description": "Se observa goteo constante en tubería principal del lobby...",
    "status": "assigned",
    "priority": "high",
    "area": {
      "type": "common_zone",
      "ref_id": "550e8400-e29b-41d4-a716-446655440010",
      "label": "Lobby Torre A"
    },
    "technician": {
      "id": "660e8400-e29b-41d4-a716-446655440050",
      "name": "Carlos Mantenimiento"
    },
    "estimated_date": "2026-07-01",
    "final_cost": null,
    "pqrs_id": "440e8400-e29b-41d4-a716-446655440099",
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "TECHNICIAN_NOT_AVAILABLE",
    "message": "El técnico no está disponible para la fecha indicada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `area.type` ∈ `common_zone` | `unit` | `building`; `ref_id` obligatorio para `common_zone` y `unit`, ignorado para `building`
  - `code` se autogenera con formato `OT-YYYY-NNNN` (secuencia anual)
  - Si se envía `technician_id`, el técnico debe existir y estar activo; se valida disponibilidad contra `estimated_date` → si no, `409 TECHNICIAN_NOT_AVAILABLE`
  - Si se envía `materials_ids`, cada material debe existir en el catálogo `materials` con stock suficiente
  - Si se envía `pqrs_id`, la PQRS debe existir y estar en estado que admita derivación
- **Side effects:**
  - Crea registro en `work_orders` (`reported_by` = admin o residente derivado de la PQRS)
  - Si `materials_ids`: crea filas en `work_order_materials` (reserva, no descuenta stock hasta §15.8)
  - Crea entrada inicial en `work_order_timelog` (estado `open` o `assigned`)
  - Si `technician_id` presente: emite notificación al técnico vía [[endpoints/NOTIFICACIONES]] (type `orden_trabajo`)

---

## §15.3 Ver detalle de orden de trabajo

```
GET /api/v1/work-orders/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "code": "OT-2026-0042",
    "title": "Goteo en tubería lobby Torre A",
    "description": "Se observa goteo constante en tubería principal del lobby...",
    "status": "in_progress",
    "priority": "high",
    "area": {
      "type": "common_zone",
      "ref_id": "550e8400-e29b-41d4-a716-446655440010",
      "label": "Lobby Torre A"
    },
    "technician": {
      "id": "660e8400-e29b-41d4-a716-446655440050",
      "name": "Carlos Mantenimiento"
    },
    "estimated_date": "2026-07-01",
    "final_cost": null,
    "pqrs_id": "440e8400-e29b-41d4-a716-446655440099",
    "timeline": [
      { "status": "open",        "at": "2026-06-23T10:00:00Z", "actor": { "id": "...", "name": "Admin Urbania" },         "note": "Orden creada desde PQRS" },
      { "status": "assigned",    "at": "2026-06-23T10:05:00Z", "actor": { "id": "...", "name": "Admin Urbania" },         "note": "Asignada a Carlos" },
      { "status": "in_progress", "at": "2026-07-01T08:15:00Z", "actor": { "id": "...", "name": "Carlos Mantenimiento" }, "note": "Inicio de trabajo" }
    ],
    "photos_before": [
      { "id": "880e8400-e29b-41d4-a716-446655440011", "url": "https://cdn.urbania.com/ot/.../antes1.jpg", "uploaded_at": "2026-07-01T08:16:00Z" }
    ],
    "photos_after": [],
    "materials": [
      { "id": "990e8400-e29b-41d4-a716-446655440001", "name": "Tubo PVC 2\"", "qty": 2, "unit_cost": 15000 }
    ],
    "created_at": "2026-06-23T10:00:00Z",
    "updated_at": "2026-07-01T08:15:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "WORK_ORDER_NOT_FOUND",
    "message": "Orden de trabajo no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: ve cualquier OT
  - `role = technician`: solo si `technician_id = user_id`; sino `403 FORBIDDEN`
  - `role = user`: solo si `reported_by = user_id`; sino `403 FORBIDDEN`
  - El `404 WORK_ORDER_NOT_FOUND` solo aplica cuando la OT no existe; para IDs ajenos de technician/user se retorna `403` (no se oculta existencia al actor legítimo que se equivoca de id)
- **Side effects:** ninguno — lectura pura

---

## §15.4 Editar orden de trabajo

```
PATCH /api/v1/work-orders/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "title": "Goteo en tubería lobby Torre A (actualizado)",
  "description": "Descripción revisada...",
  "priority": "urgent",
  "estimated_date": "2026-06-28"
}
```

> [!note] Restricción de estado
> Solo editable si `status` ∈ `open` | `assigned`. Sobre una OT en `in_progress`, `completed` o `cancelled` retorna `409 WORK_ORDER_NOT_ASSIGNABLE`.

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "code": "OT-2026-0042",
    "title": "Goteo en tubería lobby Torre A (actualizado)",
    "priority": "urgent",
    "estimated_date": "2026-06-28",
    "updated_at": "2026-06-23T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - `area` y `pqrs_id` no son editables aquí; para cambiar área, recrear la OT
- **Side effects:** actualiza registro en `work_orders`

---

## §15.5 Asignar técnico

```
PATCH /api/v1/work-orders/{id}/assign
```

**Request:**
```json
{
  "technician_id": "660e8400-e29b-41d4-a716-446655440050",
  "estimated_date": "2026-07-01",
  "comment": "Asignado a Carlos por disponibilidad"
}
```

> [!note]
> `estimated_date` y `comment` opcionales. Si se omite `estimated_date`, conserva la fecha existente.

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "assigned",
    "technician": {
      "id": "660e8400-e29b-41d4-a716-446655440050",
      "name": "Carlos Mantenimiento"
    },
    "estimated_date": "2026-07-01"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "WORK_ORDER_NOT_ASSIGNABLE",
    "message": "No se puede asignar una orden ya cerrada o cancelada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La OT debe estar en `open` o `assigned` (reasignación); si está `in_progress`, `completed` o `cancelled` → `409 WORK_ORDER_NOT_ASSIGNABLE`
  - El técnico debe existir, estar activo y disponible para `estimated_date` → si no, `409 TECHNICIAN_NOT_AVAILABLE`
  - Transición de estado: `open` → `assigned`. Si ya era `assigned`, conserva el estado y solo cambia el técnico
- **Side effects:**
  - Actualiza `technician_id` y `estimated_date` en `work_orders`
  - Crea entrada en `work_order_timelog` (estado `assigned`, nota = `comment`)
  - Emite notificación al técnico asignado vía [[endpoints/NOTIFICACIONES]] (type `orden_trabajo`)

---

## §15.6 Reprogramar orden

```
PATCH /api/v1/work-orders/{id}/reschedule
```

**Request:**
```json
{
  "estimated_date": "2026-07-05",
  "reason": "Técnico con urgencia médica"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "estimated_date": "2026-07-05",
    "status": "assigned"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin` o `technician` asignado
- **Reglas de negocio:**
  - `reason` obligatorio (auditoría)
  - No se puede reprogramar una OT `completed` o `cancelled` → `409 WORK_ORDER_NOT_ASSIGNABLE`
  - El técnico solo puede reprogramar sus propias OT asignadas (`technician_id = user_id`)
- **Side effects:**
  - Actualiza `estimated_date` en `work_orders`
  - Crea entrada en `work_order_timelog` con el motivo
  - Emite notificación al residente reportante vía [[endpoints/NOTIFICACIONES]] (type `orden_trabajo`)

---

## §15.7 Iniciar trabajo

```
POST /api/v1/work-orders/{id}/start
```

**Request:**
```json
{
  "photos_before": [
    { "url": "https://cdn.urbania.com/ot/.../antes1.jpg" }
  ],
  "note": "Inicio de trabajo, condiciones confirmadas"
}
```

> [!note]
> `photos_before` y `note` opcionales. Las fotos también pueden subirse después vía §15.10.

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "in_progress",
    "started_at": "2026-07-01T08:15:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "No se puede iniciar una orden que no esté asignada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin` o `technician` asignado
- **Reglas de negocio:**
  - Transición válida: `assigned` → `in_progress`. Cualquier otro estado → `422 INVALID_STATUS_TRANSITION`
  - Si la OT no tiene `technician_id` asignado → `409 WORK_ORDER_NOT_ASSIGNABLE`
- **Side effects:**
  - Actualiza `status = in_progress` y `started_at` en `work_orders`
  - Si `photos_before`: crea filas en `work_order_photos` (tipo `before`)
  - Crea entrada en `work_order_timelog` (estado `in_progress`)

---

## §15.8 Cerrar orden de trabajo

```
POST /api/v1/work-orders/{id}/complete
```

**Request:**
```json
{
  "notes": "Reparación completada, tubería sellada",
  "photos_after": [
    { "url": "https://cdn.urbania.com/ot/.../despues1.jpg" },
    { "url": "https://cdn.urbania.com/ot/.../despues2.jpg" }
  ],
  "materials_used": [
    { "id": "990e8400-e29b-41d4-a716-446655440001", "qty": 2, "unit_cost": 15000 },
    { "id": "990e8400-e29b-41d4-a716-446655440002", "qty": 1, "unit_cost": 8500 }
  ],
  "final_cost": 38500
}
```

> [!note]
> `final_cost` opcional — si se omite, se calcula como `Σ(qty × unit_cost)` de `materials_used` más mano de obra (si aplica).

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "completed",
    "completed_at": "2026-07-01T11:30:00Z",
    "final_cost": 38500
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "WORK_ORDER_ALREADY_COMPLETED",
    "message": "La orden de trabajo ya está cerrada",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MATERIAL_INSUFFICIENT_STOCK",
    "message": "Stock insuficiente para el material 'Tubo PVC 2\"'",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin` o `technician` asignado
- **Reglas de negocio:**
  - Transición válida: `in_progress` → `completed`. Si ya está `completed` → `409 WORK_ORDER_ALREADY_COMPLETED`; si está `open`, `assigned` o `cancelled` → `422 INVALID_STATUS_TRANSITION`
  - Se requiere al menos una foto en `photos_after` como evidencia de cierre
  - `materials_used`: cada `id` debe existir en catálogo `materials` y tener stock disponible → si no, `409 MATERIAL_INSUFFICIENT_STOCK`
  - `final_cost` se persiste tal cual se envía (o el calculado)
- **Side effects:**
  - Actualiza `status = completed`, `completed_at`, `final_cost` en `work_orders`
  - Crea filas en `work_order_photos` (tipo `after`)
  - Inserta/actualiza filas en `work_order_materials` con `qty` y `unit_cost` reales
  - Descuenta stock del catálogo `materials` (`stock -= qty`)
  - Crea entrada en `work_order_timelog` (estado `completed`)
  - Emite notificación al residente reportante vía [[endpoints/NOTIFICACIONES]] (type `orden_trabajo`)

---

## §15.9 Cancelar orden de trabajo

```
POST /api/v1/work-orders/{id}/cancel
```

**Request:**
```json
{
  "reason": "Trabajo no requerido, falso positivo"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "status": "cancelled",
    "cancelled_at": "2026-06-24T09:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `reason` obligatorio (auditoría)
  - Si está `completed` → `409 WORK_ORDER_ALREADY_COMPLETED`; si ya está `cancelled` → `422 INVALID_STATUS_TRANSITION`
  - Si la OT tenía `materials_ids` reservados en §15.2, se libera la reserva (sin descuento de stock)
- **Side effects:**
  - Actualiza `status = cancelled`, `cancelled_at` en `work_orders`
  - Crea entrada en `work_order_timelog` (estado `cancelled`, nota = `reason`)
  - Emite notificación al técnico asignado (si lo había) y al residente reportante vía [[endpoints/NOTIFICACIONES]] (type `orden_trabajo`)

---

## §15.10 Subir foto de evidencia

```
POST /api/v1/work-orders/{id}/photos
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Request (multipart):**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `file` | binary | Archivo de imagen (jpg, png, webp; max 10MB) |
| `type` | string | `before` o `after` |
| `description` | string | Opcional, descripción de la foto |

**Response `201`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440012",
    "url": "https://cdn.urbania.com/ot/770e.../foto_antes_2.jpg",
    "type": "before",
    "uploaded_at": "2026-07-01T08:20:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "WORK_ORDER_NOT_FOUND",
    "message": "Orden de trabajo no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin` o `technician` asignado
- **Reglas de negocio:**
  - La OT debe existir → si no, `404 WORK_ORDER_NOT_FOUND`
  - `type = after` solo se permite si la OT está en `in_progress` o `completed`; si está `open`, `assigned` o `cancelled` → `422 INVALID_STATUS_TRANSITION`
  - El archivo se almacena en CDN (S3-compatible) y se retorna la URL pública firmada
- **Side effects:**
  - Crea fila en `work_order_photos` (con `type`, `url`, `uploaded_by`)

---

## §15.11 Listar áreas para selector

```
GET /api/v1/work-orders/areas
```

> [!note] Uso
> Metadatos para el selector de área del formulario de creación (§15.2). Retorna zonas comunes y edificios disponibles.

**Response `200`:**
```json
{
  "data": {
    "common_zones": [
      { "id": "550e8400-e29b-41d4-a716-446655440010", "name": "Lobby Torre A", "building": "Torre A" },
      { "id": "550e8400-e29b-41d4-a716-446655440011", "name": "Gimnasio",        "building": "Torre B" }
    ],
    "buildings": [
      { "id": "330e8400-e29b-41d4-a716-446655440001", "name": "Torre A" },
      { "id": "330e8400-e29b-41d4-a716-446655440002", "name": "Torre B" }
    ]
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo retorna zonas comunes y edificios activos
  - Las unidades (`unit`) se obtienen vía [[endpoints/PROPIEDADES]] — no se duplican aquí
- **Side effects:** ninguno — lectura pura

---

## Códigos de error del módulo

| Código | HTTP | Descripción |
|--------|------|-------------|
| `WORK_ORDER_NOT_FOUND` | 404 | Orden de trabajo no encontrada |
| `WORK_ORDER_ALREADY_COMPLETED` | 409 | La orden ya está cerrada (no se puede cerrar/cancelar/editar) |
| `WORK_ORDER_NOT_ASSIGNABLE` | 409 | No se puede asignar/reasignar a una OT ya cerrada o cancelada |
| `INVALID_STATUS_TRANSITION` | 422 | Transición de estado no permitida para el estado actual |
| `TECHNICIAN_NOT_AVAILABLE` | 409 | El técnico no existe, no está activo o no está disponible para la fecha |
| `MATERIAL_INSUFFICIENT_STOCK` | 409 | Stock insuficiente en catálogo `materials` para un material usado |

> [!note] Sincronización pendiente
> Al implementar, agregar estos códigos a "Códigos de Error Completos" de [[API_CONTRACT]] y las filas correspondientes al índice de endpoints (estado "Diseñado" → "Implementado").

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
- Spec App: [[03-app/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
- Panorama global: [[00-shared/features/ORDENES-TRABAJO]]
- Notificaciones (side effects): [[endpoints/NOTIFICACIONES]]
- Módulos relacionados: [[endpoints/PQRS]], [[endpoints/PROPIEDADES]]
