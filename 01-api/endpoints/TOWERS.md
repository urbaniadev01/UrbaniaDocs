---
type: reference
status: active
module: properties
tags: [api, endpoints, towers]
updated: 2026-06-28
---

# Endpoints: Torres

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Towers.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.
> Para el panorama global del feature, ver [[00-shared/features/PROPIEDADES]].

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Estado |
|---|--------|------|------|--------|
| 3.1 | GET | /condominiums/{condominium_id}/towers | Sí (admin) | Implementado |
| 3.2 | POST | /towers | Sí (admin) | Implementado |
| 3.3 | GET | /towers/{id} | Sí (admin) | Implementado |
| 3.4 | PATCH | /towers/{id} | Sí (admin) | Implementado |
| 3.5 | DELETE | /towers/{id} | Sí (admin) | Implementado |

---

## §3.1 Listar torres de un condominium

```
GET /api/v1/condominiums/{condominium_id}/towers
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `sort_by` | string | no | Campo por ordenar (default: `sort_order`). Valores: `name`, `sort_order`, `floor_count`, `created_at` |
| `sort_order` | string | no | `asc` (default) o `desc` |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345678",
      "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
      "name": "Torre 1",
      "code": "T1",
      "floor_count": 15,
      "has_elevator": true,
      "description": "Torre principal — acceso por la carrera 7",
      "sort_order": 1,
      "stats": {
        "total_units": 60,
        "occupied_units": 52,
        "vacant_units": 8
      },
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONDOMINIUM_NOT_FOUND",
    "message": "El conjunto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Condominium debe existir y no estar soft-deleted.
- **Reglas de negocio:** Las torres se retornan en orden ascendente por `sort_order`. Los `stats` se calculan en tiempo real.
- **Side effects:** Ninguno.

---

## §3.2 Crear torre

```
POST /api/v1/towers
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
  "name": "Torre 2",
  "code": "T2",
  "floor_count": 10,
  "has_elevator": true,
  "description": "Torre secundaria — acceso por la carrera 5",
  "sort_order": 2
}
```

**Response 201:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345679",
    "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "name": "Torre 2",
    "code": "T2",
    "floor_count": 10,
    "has_elevator": true,
    "description": "Torre secundaria — acceso por la carrera 5",
    "sort_order": 2,
    "stats": {
      "total_units": 0,
      "occupied_units": 0,
      "vacant_units": 0
    },
    "created_at": "2026-06-27T12:30:00Z",
    "updated_at": "2026-06-27T12:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 400:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "errors": {
      "name": ["El nombre de la torre ya existe en este condominio"],
      "floor_count": ["El número de pisos debe ser mayor a 0"]
    }
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONDOMINIUM_NOT_FOUND",
    "message": "El conjunto especificado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. `condominium_id` debe existir.
- **Reglas de negocio:**
  - `name` + `condominium_id` deben ser UNIQUE. No pueden existir dos torres con el mismo nombre en el mismo condominio.
  - `floor_count` debe ser >= 1.
  - `code` es opcional pero si se envía debe ser UNIQUE dentro del condominio.
  - `sort_order` default 0. Si no se envía, se auto-asigna el siguiente número.
- **Side effects:** Se actualizan los `stats` del condominium (total_towers + 1).
- **Casos borde:** Crear la primera torre de un condominio es válido. No hay límite máximo de torres.

---

## §3.3 Obtener detalle de torre

```
GET /api/v1/towers/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345678",
    "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "condominium_name": "Conjunto Residencial San Rafael",
    "name": "Torre 1",
    "code": "T1",
    "floor_count": 15,
    "has_elevator": true,
    "description": "Torre principal — acceso por la carrera 7",
    "sort_order": 1,
    "stats": {
      "total_units": 60,
      "occupied_units": 52,
      "vacant_units": 8,
      "occupied_percentage": 86.67
    },
    "created_at": "2026-06-27T12:00:00Z",
    "updated_at": "2026-06-27T12:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "TOWER_NOT_FOUND",
    "message": "La torre solicitada no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Torre debe existir y no estar soft-deleted.
- **Reglas de negocio:** `condominium_name` se incluye como campo adicional para evitar un segundo request al cliente. `stats` se calculan en tiempo real.
- **Side effects:** Ninguno.

---

## §3.4 Actualizar torre

```
PATCH /api/v1/towers/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "name": "Torre 1 — Ampliada",
  "floor_count": 18,
  "description": "Torre principal — se agregaron 3 pisos"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345678",
    "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "name": "Torre 1 — Ampliada",
    "code": "T1",
    "floor_count": 18,
    "has_elevator": true,
    "description": "Torre principal — se agregaron 3 pisos",
    "sort_order": 1,
    "updated_at": "2026-06-27T15:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 400:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "errors": {
      "floor_count": ["El número de pisos no puede ser menor al piso más alto registrado entre las unidades de esta torre"]
    }
  }
}
```

### Diseño

- **Precondiciones:** Torre debe existir y no estar soft-deleted.
- **Reglas de negocio:**
  - Si se reduce `floor_count`, se valida que no existan unidades con `floor > nuevo floor_count`. Si existen, se rechaza con `VALIDATION_ERROR`.
  - `condominium_id` no se puede cambiar (una torre no se reasigna de condominio).
- **Side effects:** Si cambia `name`, se refleja en cascada donde se muestre. No hay notificaciones.

---

## §3.5 Eliminar torre

```
DELETE /api/v1/towers/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 204:** Sin contenido.

**Response 409:**
```json
{
  "error": {
    "code": "TOWER_HAS_UNITS",
    "message": "No se puede eliminar la torre porque tiene unidades registradas. Elimine o reasigne las unidades primero.",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "details": {
      "total_units": 60,
      "hint": "Use GET /properties?tower_id={id} para listar las unidades asociadas"
    }
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "TOWER_NOT_FOUND",
    "message": "La torre solicitada no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Torre debe existir y no estar soft-deleted.
- **Reglas de negocio:**
  - **Soft delete**: la torre no se elimina físicamente. Se marca `deleted_at`.
  - **Protección**: si la torre tiene unidades (`COUNT(properties) > 0` donde `tower_id = {id}` y `deleted_at IS NULL`), se rechaza con 409.
  - La restauración de una torre soft-deleted es un endpoint de administración (post-MVP).
- **Side effects:** Se actualizan los `stats` del condominium (total_towers - 1).

---

## Códigos de error específicos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `TOWER_NOT_FOUND` | 404 | La torre solicitada no existe |
| `TOWER_HAS_UNITS` | 409 | La torre tiene unidades registradas y no puede eliminarse |
| `TOWER_DUPLICATE_NAME` | 400 | Ya existe una torre con ese nombre en el condominio |

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Panorama global: [[00-shared/features/PROPIEDADES]]
- Detalle de condominiums: [[endpoints/CONDOMINIUMS]]
- Detalle de propiedades: [[endpoints/PROPIEDADES]]
