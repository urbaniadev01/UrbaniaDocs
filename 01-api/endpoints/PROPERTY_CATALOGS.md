---
type: reference
status: active
module: properties
tags: [api, endpoints, catalogs, property-types, property-statuses]
updated: 2026-06-28
---

# Endpoints: Catálogos de Propiedades

> [!info] Consultar
> Documento de detalle de los endpoints de los catálogos configurables: tipos de unidad y estados de unidad.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.
> Para el panorama global del feature, ver [[00-shared/features/PROPIEDADES]].

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Estado |
|---|--------|------|------|--------|
| 4.1 | GET | /property-types | Sí (admin) | Implementado |
| 4.2 | POST | /property-types | Sí (admin) | Implementado |
| 4.3 | PATCH | /property-types/{id} | Sí (admin) | Implementado |
| 4.4 | DELETE | /property-types/{id} | Sí (admin) | Implementado |
| 4.5 | GET | /property-statuses | Sí (admin) | Implementado |
| 4.6 | POST | /property-statuses | Sí (admin) | Implementado |
| 4.7 | PATCH | /property-statuses/{id} | Sí (admin) | Implementado |
| 4.8 | DELETE | /property-statuses/{id} | Sí (admin) | Implementado |
| 4.9 | GET | /property-document-types | Sí | Diseñado |
| 4.10 | POST | /property-document-types | Sí (admin) | Diseñado |
| 4.11 | PATCH | /property-document-types/{id} | Sí (admin) | Diseñado |
| 4.12 | DELETE | /property-document-types/{id} | Sí (admin) | Diseñado |

> Todos los endpoints de catálogos implementados requieren autenticación JWT y rol `admin`.

---

## Formato de respuesta

### Respuesta única

```json
{
  "data": { ... },
  "meta": {
    "trace_id": "uuid"
  }
}
```

### Respuesta paginada

```json
{
  "data": [...],
  "meta": {
    "trace_id": "uuid",
    "current_page": 1,
    "per_page": 20,
    "total": 10,
    "last_page": 1
  }
}
```

---

## §4.1 Listar tipos de unidad

```
GET /api/v1/property-types
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `search` | string | no | Búsqueda por `code` o `name` (ilike) |
| `is_active` | boolean | no | Filtrar por estado activo/inactivo |
| `sort_by` | string | no | Campo de ordenamiento: `code`, `name`, `sort_order`, `created_at` (default: `sort_order`) |
| `sort_order` | string | no | `asc` o `desc` (default: `asc`) |
| `page` | integer | no | Página actual (default: 1) |
| `per_page` | integer | no | Tamaño de página 1-100 (default: 20) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345671",
      "code": "apartamento",
      "name": "Apartamento",
      "description": "Unidad residencial estándar",
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 20,
    "total": 4,
    "last_page": 1
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** Orden por defecto `sort_order ASC`. El filtro `is_active` acepta `0`/`1`, `true`/`false`.
- **Side effects:** Ninguno.

---

## §4.2 Crear tipo de unidad

```
POST /api/v1/property-types
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "code": "bodega",
  "name": "Bodega",
  "description": "Bodega de almacenamiento independiente",
  "sort_order": 5
}
```

**Response 201:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345675",
    "code": "bodega",
    "name": "Bodega",
    "description": "Bodega de almacenamiento independiente",
    "sort_order": 5,
    "is_active": true,
    "created_at": "2026-06-27T13:00:00Z",
    "updated_at": "2026-06-27T13:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "PROPERTY_TYPE_CODE_ALREADY_EXISTS",
    "message": "El código de tipo de propiedad ya existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** `code` es UNIQUE. `sort_order` default 0.
- **Side effects:** Crea un registro en `property_types`.

---

## §4.3 Actualizar tipo de unidad

```
PATCH /api/v1/property-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "name": "Bodega Privada",
  "description": "Bodega de almacenamiento con acceso independiente",
  "sort_order": 6
}
```

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345675",
    "code": "bodega",
    "name": "Bodega Privada",
    "description": "Bodega de almacenamiento con acceso independiente",
    "sort_order": 6,
    "is_active": true,
    "created_at": "2026-06-27T13:00:00Z",
    "updated_at": "2026-06-27T13:30:00Z"
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
    "code": "PROPERTY_TYPE_NOT_FOUND",
    "message": "Tipo de propiedad no encontrado",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "PROPERTY_TYPE_IN_USE",
    "message": "No se puede cambiar el código porque el tipo está en uso",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. Tipo debe existir.
- **Reglas de negocio:** `code` se puede modificar solo si no hay propiedades activas referenciándolo. `name`, `description` y `sort_order` son actualizables.
- **Side effects:** Actualiza `updated_at`.

---

## §4.4 Desactivar tipo de unidad

```
DELETE /api/v1/property-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 204:** Sin cuerpo.

**Response 404:** `PROPERTY_TYPE_NOT_FOUND`

**Response 409:**
```json
{
  "error": {
    "code": "PROPERTY_TYPE_IN_USE",
    "message": "El tipo de propiedad está en uso y no puede ser desactivado",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. Tipo debe existir.
- **Reglas de negocio:**
  - **No es DELETE físico.** Es un soft-disable: `is_active = false`.
  - No se puede desactivar si hay propiedades activas usando este tipo.
  - Los tipos del seed (`apartamento`, `local`, `parqueadero`, `deposito`) no pueden desactivarse.
  - No hay endpoint de "reactivar" por ahora.
- **Side effects:** Ninguno.

---

## §4.5 Listar estados de unidad

```
GET /api/v1/property-statuses
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `search` | string | no | Búsqueda por `code` o `name` (ilike) |
| `is_active` | boolean | no | Filtrar por estado activo/inactivo |
| `sort_by` | string | no | Campo de ordenamiento: `code`, `name`, `sort_order`, `created_at` (default: `sort_order`) |
| `sort_order` | string | no | `asc` o `desc` (default: `asc`) |
| `page` | integer | no | Página actual (default: 1) |
| `per_page` | integer | no | Tamaño de página 1-100 (default: 20) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345681",
      "code": "ocupada",
      "name": "Ocupada",
      "description": "Unidad habitada por sus propietarios o arrendatarios",
      "allows_residents": true,
      "sort_order": 1,
      "is_active": true,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 20,
    "total": 4,
    "last_page": 1
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** `allows_residents` indica si las unidades en este estado pueden tener residentes asignados.

---

## §4.6 Crear estado de unidad

```
POST /api/v1/property-statuses
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "code": "embargada",
  "name": "Embargada",
  "description": "Unidad bajo proceso judicial de embargo",
  "allows_residents": true,
  "sort_order": 5
}
```

**Response 201:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345685",
    "code": "embargada",
    "name": "Embargada",
    "description": "Unidad bajo proceso judicial de embargo",
    "allows_residents": true,
    "sort_order": 5,
    "is_active": true,
    "created_at": "2026-06-27T14:00:00Z",
    "updated_at": "2026-06-27T14:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:** `PROPERTY_STATUS_CODE_ALREADY_EXISTS`

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** `code` es UNIQUE. `allows_residents` default true.

---

## §4.7 Actualizar estado de unidad

```
PATCH /api/v1/property-statuses/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "name": "Embargada Judicialmente",
  "description": "Unidad bajo proceso judicial de embargo",
  "allows_residents": true,
  "sort_order": 6
}
```

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345685",
    "code": "embargada",
    "name": "Embargada Judicialmente",
    "description": "Unidad bajo proceso judicial de embargo",
    "allows_residents": true,
    "sort_order": 6,
    "is_active": true,
    "created_at": "2026-06-27T14:00:00Z",
    "updated_at": "2026-06-27T14:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 404:** `PROPERTY_STATUS_NOT_FOUND`

**Response 409:** `PROPERTY_STATUS_IN_USE` (al cambiar `code` con propiedades activas)

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. El estado debe existir.
- **Reglas de negocio:** `code` se puede modificar solo si no hay propiedades activas con este estado.

---

## §4.8 Desactivar estado de unidad

```
DELETE /api/v1/property-statuses/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 204:** Sin cuerpo.

**Response 404:** `PROPERTY_STATUS_NOT_FOUND`

**Response 409:**
```json
{
  "error": {
    "code": "PROPERTY_STATUS_IN_USE",
    "message": "El estado de propiedad está en uso y no puede ser desactivado",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. El estado debe existir.
- **Reglas de negocio:**
  - **No es DELETE físico.** Es un soft-disable: `is_active = false`.
  - No se puede desactivar si hay propiedades activas usando este estado.
  - Los estados del seed (`ocupada`, `vacia`, `en_venta`, `en_remodelacion`) no pueden desactivarse.

---

## §4.9 Listar tipos de documento

```
GET /api/v1/property-document-types
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `include_inactive` | boolean | no | Incluir tipos desactivados (default: false) |
| `all` | boolean | no | Si es true, retorna todos sin paginación (para dropdowns) |

**Response 200:** Ver diseño en §4.1 (estructura similar, sin paginación).

### Diseño

- **Estado:** Diseñado, no implementado.
- **Precondiciones:** Usuario autenticado (cualquier rol).

---

## §4.10 Crear tipo de documento

```
POST /api/v1/property-document-types
```

**Headers:** Headers obligatorios estándar.

**Request/Response:** Ver §4.2 (estructura similar).

### Diseño

- **Estado:** Diseñado, no implementado.
- **Precondiciones:** Usuario autenticado con rol `admin`.

---

## §4.11 Actualizar tipo de documento

```
PATCH /api/v1/property-document-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Request/Response:** Ver §4.3 (estructura similar).

### Diseño

- **Estado:** Diseñado, no implementado.
- **Precondiciones:** Usuario autenticado con rol `admin`.

---

## §4.12 Desactivar tipo de documento

```
DELETE /api/v1/property-document-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Request/Response:** Ver §4.4 (estructura similar).

### Diseño

- **Estado:** Diseñado, no implementado.
- **Precondiciones:** Usuario autenticado con rol `admin`.

---

## Códigos de error específicos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PROPERTY_TYPE_NOT_FOUND` | 404 | El tipo de propiedad no existe |
| `PROPERTY_TYPE_CODE_ALREADY_EXISTS` | 409 | El código del tipo de propiedad ya está en uso |
| `PROPERTY_TYPE_IN_USE` | 409 | El tipo está en uso (propiedades activas o seed protegido) |
| `PROPERTY_STATUS_NOT_FOUND` | 404 | El estado de propiedad no existe |
| `PROPERTY_STATUS_CODE_ALREADY_EXISTS` | 409 | El código del estado ya está en uso |
| `PROPERTY_STATUS_IN_USE` | 409 | El estado está en uso (propiedades activas o seed protegido) |

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Panorama global: [[00-shared/features/PROPIEDADES]]
- Detalle de propiedades: [[endpoints/PROPIEDADES]]
- Detalle de torres: [[endpoints/TOWERS]]
