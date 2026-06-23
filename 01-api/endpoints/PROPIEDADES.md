---
type: reference
status: active
module: propiedades
scope: api
tags: [api, endpoints, propiedades, unidades]
updated: 2026-06-23
---

# Endpoints: Propiedades y Unidades

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Propiedades.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 2.1 | GET | `/properties` | Sí | admin, user | Diseñado |
| 2.2 | POST | `/properties` | Sí | admin | Diseñado |
| 2.3 | GET | `/properties/{id}` | Sí | admin, user | Diseñado |
| 2.4 | PATCH | `/properties/{id}` | Sí | admin | Diseñado |
| 2.5 | DELETE | `/properties/{id}` | Sí | admin | Diseñado |
| 2.6 | PATCH | `/properties/{id}/status` | Sí | admin | Diseñado |

---

## §2.1 Listar unidades

```
GET /api/v1/properties
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `tower` | string | Filtrar por torre |
| `floor` | integer | Filtrar por piso |
| `type` | string | Filtrar por tipo: `apartment`, `local`, `parking`, `storage` |
| `status` | string | Filtrar por estado: `occupied`, `vacant`, `for_sale` |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A",
      "floor": 1,
      "type": "apartment",
      "area_m2": 72.5,
      "coefficient": 0.0245,
      "status": "occupied",
      "current_resident": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Juan Perez",
        "type": "owner"
      }
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 120,
      "total_pages": 6
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo ve las unidades de su propio conjunto, sin datos de otros residentes
  - `role = admin`: ve todas las unidades con datos completos incluyendo residente actual
- **Side effects:** ninguno — lectura pura

---

## §2.2 Crear unidad

```
POST /api/v1/properties
```

**Request:**
```json
{
  "number": "205",
  "tower": "B",
  "floor": 2,
  "type": "apartment",
  "area_m2": 85.0,
  "coefficient": 0.0312
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440099",
    "number": "205",
    "tower": "B",
    "floor": 2,
    "type": "apartment",
    "area_m2": 85.0,
    "coefficient": 0.0312,
    "status": "vacant",
    "current_resident": null,
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PROPERTY_ALREADY_EXISTS",
    "message": "Ya existe una unidad con ese número y torre",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La combinación `tower + number` debe ser única
  - `coefficient` debe ser > 0 y ≤ 1; el sistema emite advertencia (no error) si la suma total de coeficientes supera 1.000
  - Estado inicial siempre es `vacant`
- **Side effects:**
  - Crea registro en tabla `properties`
  - Loggea la acción con el ID del admin

---

## §2.3 Ver detalle de unidad

```
GET /api/v1/properties/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "number": "101",
    "tower": "A",
    "floor": 1,
    "type": "apartment",
    "area_m2": 72.5,
    "coefficient": 0.0245,
    "status": "occupied",
    "current_resident": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Juan Perez",
      "email": "juan@email.com",
      "phone": "3001234567",
      "type": "owner"
    },
    "resident_history": [
      {
        "resident_id": "770e8400-e29b-41d4-a716-446655440002",
        "name": "Maria Lopez",
        "type": "tenant",
        "from": "2024-01-01",
        "to": "2025-12-31"
      }
    ],
    "created_at": "2023-01-15T08:00:00Z",
    "updated_at": "2026-06-01T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Unidad no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo puede ver la unidad a la que pertenece; cualquier otro `id` retorna `404`
  - `role = admin`: puede ver cualquier unidad con historial completo de residentes
- **Side effects:** ninguno — lectura pura

---

## §2.4 Editar unidad

```
PATCH /api/v1/properties/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "area_m2": 74.0,
  "coefficient": 0.0248,
  "tower": "A",
  "floor": 1,
  "type": "apartment"
}
```

> [!note]
> El campo `number` y `tower` pueden editarse siempre que la nueva combinación no exista ya.

**Response `200`:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "number": "101",
    "tower": "A",
    "floor": 1,
    "type": "apartment",
    "area_m2": 74.0,
    "coefficient": 0.0248,
    "status": "occupied"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Si se cambia `coefficient`, el sistema recalcula las cuotas pendientes del período actual (no retroactivo)
  - El campo `status` no se modifica aquí — usar §2.6
- **Side effects:**
  - Actualiza registro en `properties`
  - Loggea el cambio con valores anteriores y nuevos (auditoría)

---

## §2.5 Eliminar unidad

```
DELETE /api/v1/properties/{id}
```

**Response `204`:** (No Content)

**Response `409`:**
```json
{
  "error": {
    "code": "PROPERTY_HAS_ACTIVE_RESIDENT",
    "message": "No se puede eliminar una unidad con residente activo",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - No se puede eliminar si existe un residente con `status = active` asignado a la unidad
  - No se puede eliminar si tiene cuotas pendientes sin pagar
  - La eliminación es física (no soft delete) — todos los datos relacionados se deben haber migrado o eliminado previamente
- **Casos borde:**
  - Si existen dependencias (cuotas, pagos, reservas históricas) → **409** `PROPERTY_HAS_DEPENDENCIES` con lista de recursos bloqueantes

---

## §2.6 Cambiar estado de unidad

```
PATCH /api/v1/properties/{id}/status
```

**Request:**
```json
{
  "status": "for_sale",
  "notes": "Propietario puso en venta, continúa habitada"
}
```

> [!note] Valores válidos de `status`
> `occupied` | `vacant` | `for_sale`
> Cualquier transición entre estos tres estados es válida.

**Response `200`:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "for_sale",
    "status_updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El cambio a `vacant` cuando hay un residente activo requiere que el residente sea desactivado primero en RESIDENTES (`PATCH /residents/{id}/status`)
  - El estado `for_sale` no impide tener residente asignado
  - `notes` es opcional pero recomendado para auditoría
- **Side effects:**
  - Actualiza `status` y `status_updated_at` en `properties`
  - Loggea el cambio con usuario y timestamp

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec Web: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
- Spec App: [[03-app/features/propiedades/PROPIEDADES_SPEC]]
- Panorama global: [[00-shared/features/PROPIEDADES]]
- Módulos dependientes: [[endpoints/RESIDENTES]], [[endpoints/CUOTAS]], [[endpoints/PAGOS]]
