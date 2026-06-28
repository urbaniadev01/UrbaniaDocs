---
type: reference
status: active
module: properties
tags: [api, endpoints, catalogs, property-types, property-statuses]
updated: 2026-06-27
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
| 4.1 | GET | /property-types | Sí | Diseñado |
| 4.2 | POST | /property-types | Sí (admin) | Diseñado |
| 4.3 | PATCH | /property-types/{id} | Sí (admin) | Diseñado |
| 4.4 | DELETE | /property-types/{id} | Sí (admin) | Diseñado |
| 4.5 | GET | /property-statuses | Sí | Diseñado |
| 4.6 | POST | /property-statuses | Sí (admin) | Diseñado |
| 4.7 | PATCH | /property-statuses/{id} | Sí (admin) | Diseñado |
| 4.8 | DELETE | /property-statuses/{id} | Sí (admin) | Diseñado |
| 4.9 | GET | /property-document-types | Sí | Diseñado |
| 4.10 | POST | /property-document-types | Sí (admin) | Diseñado |
| 4.11 | PATCH | /property-document-types/{id} | Sí (admin) | Diseñado |
| 4.12 | DELETE | /property-document-types/{id} | Sí (admin) | Diseñado |

---

## §4.1 Listar tipos de unidad

```
GET /api/v1/property-types
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `include_inactive` | boolean | no | Incluir tipos desactivados (default: false) |
| `all` | boolean | no | Si es true, retorna todos sin paginación (para dropdowns) |

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
      "properties_count": 85,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345672",
      "code": "local",
      "name": "Local Comercial",
      "description": "Espacio de uso comercial",
      "sort_order": 2,
      "is_active": true,
      "properties_count": 12,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345673",
      "code": "parqueadero",
      "name": "Parqueadero",
      "description": "Plaza de estacionamiento",
      "sort_order": 3,
      "is_active": true,
      "properties_count": 80,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345674",
      "code": "deposito",
      "name": "Depósito",
      "description": "Bodega o cuarto de almacenamiento",
      "sort_order": 4,
      "is_active": true,
      "properties_count": 15,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado (cualquier rol). Los catálogos son de lectura para residentes.
- **Reglas de negocio:** Por defecto solo retorna `is_active = true`. Con `include_inactive=true` retorna todos. `properties_count` es el conteo en tiempo real de unidades activas con ese tipo.
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
    "properties_count": 0,
    "created_at": "2026-06-27T13:00:00Z",
    "updated_at": "2026-06-27T13:00:00Z"
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
      "code": ["El código ya está en uso"],
      "name": ["El nombre es obligatorio"]
    }
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** `code` es UNIQUE y no debe cambiarse después de creado (nunca implementar un endpoint PATCH de `code` para un catálogo con referencias activas). `code` en minúsculas, sin espacios, sin caracteres especiales (regex: `^[a-z][a-z0-9_]*$`).
- **Side effects:** Ninguno.

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
    "updated_at": "2026-06-27T13:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. Tipo debe existir.
- **Reglas de negocio:** `code` NO se puede modificar (es el identificador estable del catálogo). `sort_order` se puede reordenar.
- **Side effects:** El cambio de `name` se refleja en todas las unidades que usan este tipo.

---

## §4.4 Desactivar tipo de unidad

```
DELETE /api/v1/property-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345675",
    "code": "bodega",
    "name": "Bodega Privada",
    "is_active": false,
    "properties_count": 0
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
    "code": "CATALOG_IN_USE",
    "message": "No se puede desactivar el tipo porque hay 5 unidades activas que lo usan. Reasigne esas unidades a otro tipo primero.",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "details": {
      "properties_count": 5
    }
  }
}
```

### Diseño

- **Precondiciones:** Tipo debe existir.
- **Reglas de negocio:**
  - **No es DELETE físico.** Es un soft-disable: `is_active = false`. El registro permanece en BD para integridad referencial con unidades existentes.
  - Si `properties_count > 0` (unidades activas usando este tipo), se rechaza con 409.
  - Los tipos del seed (`apartamento`, `local`, `parqueadero`, `deposito`) deben tener una protección extra: no permitir ni siquiera la desactivación si hay unidades activas. Si son seed, `is_seed = true` se valida en backend.
  - No hay endpoint de "reactivar" por ahora. Opcional post-MVP.
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
| `include_inactive` | boolean | no | Incluir estados desactivados (default: false) |
| `all` | boolean | no | Sin paginación (para dropdowns) |

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
      "properties_count": 85,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345682",
      "code": "vacia",
      "name": "Vacía",
      "description": "Unidad desocupada, sin residentes",
      "allows_residents": false,
      "sort_order": 2,
      "is_active": true,
      "properties_count": 22,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345683",
      "code": "en_venta",
      "name": "En Venta",
      "description": "Unidad en proceso de comercialización",
      "allows_residents": true,
      "sort_order": 3,
      "is_active": true,
      "properties_count": 8,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345684",
      "code": "en_remodelacion",
      "name": "En Remodelación",
      "description": "Unidad en obras de remodelación interna",
      "allows_residents": false,
      "sort_order": 4,
      "is_active": true,
      "properties_count": 5,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado (cualquier rol).
- **Reglas de negocio:** `allows_residents` es la flag crítica que el frontend debe mostrar. Si `allows_residents = false`, el sistema no permitirá asignar residentes a unidades en ese estado.

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
    "properties_count": 0,
    "created_at": "2026-06-27T14:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- Mismas reglas que §4.2 (Crear tipo). `code` UNIQUE, minúsculas, sin espacios.
- `allows_residents` es obligatorio y default true.

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
  "description": "Unidad bajo proceso judicial de embargo — no puede realizar transferencias"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345685",
    "code": "embargada",
    "name": "Embargada Judicialmente",
    "description": "Unidad bajo proceso judicial de embargo — no puede realizar transferencias",
    "allows_residents": true,
    "sort_order": 5,
    "is_active": true,
    "updated_at": "2026-06-27T14:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- Mismas reglas que §4.3. `code` no se puede modificar. `allows_residents` se puede modificar pero con precaución: si se cambia de TRUE a FALSE, se debe verificar que ninguna unidad activa con este estado tenga residentes asignados.

---

## §4.8 Desactivar estado de unidad

```
DELETE /api/v1/property-statuses/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 200:** Misma estructura que §4.4.

**Response 409:**
```json
{
  "error": {
    "code": "CATALOG_IN_USE",
    "message": "No se puede desactivar el estado porque hay 12 unidades activas en este estado. Cambie esas unidades a otro estado primero.",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "details": {
      "properties_count": 12
    }
  }
}
```

### Diseño

- Mismas reglas que §4.4. Soft-disable. Seed data protegido.

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

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345900",
      "code": "escritura",
      "name": "Escritura Pública",
      "description": "Escritura pública de la unidad",
      "sort_order": 1,
      "is_active": true,
      "documents_count": 24,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    },
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345901",
      "code": "plano",
      "name": "Plano Arquitectónico",
      "description": "Plano arquitectónico de la unidad",
      "sort_order": 2,
      "is_active": true,
      "documents_count": 18,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado (cualquier rol). Los tipos de documento son de lectura para residentes.
- **Reglas de negocio:** Por defecto solo retorna `is_active = true`. Con `include_inactive=true` retorna todos. `documents_count` es el conteo en tiempo real de documentos activos con ese tipo.
- **Side effects:** Ninguno.

---

## §4.10 Crear tipo de documento

```
POST /api/v1/property-document-types
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "code": "acta_entrega",
  "name": "Acta de Entrega",
  "description": "Documento de entrega de la unidad al propietario",
  "sort_order": 7
}
```

**Response 201:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345902",
    "code": "acta_entrega",
    "name": "Acta de Entrega",
    "description": "Documento de entrega de la unidad al propietario",
    "sort_order": 7,
    "is_active": true,
    "documents_count": 0,
    "created_at": "2026-06-27T13:00:00Z",
    "updated_at": "2026-06-27T13:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** `code` es UNIQUE y no debe cambiarse después de creado (nunca implementar un endpoint PATCH de `code` para un catálogo con referencias activas). `code` en minúsculas, sin espacios, sin caracteres especiales (regex: `^[a-z][a-z0-9_]*$`).
- **Side effects:** Ninguno.

---

## §4.11 Actualizar tipo de documento

```
PATCH /api/v1/property-document-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "name": "Acta de Entrega de Llaves",
  "description": "Acta de entrega de llaves y accesorios",
  "sort_order": 8
}
```

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345902",
    "code": "acta_entrega",
    "name": "Acta de Entrega de Llaves",
    "description": "Acta de entrega de llaves y accesorios",
    "sort_order": 8,
    "is_active": true,
    "updated_at": "2026-06-27T13:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. El tipo debe existir.
- **Reglas de negocio:** `code` NO se puede modificar (es el identificador estable del catálogo). `sort_order` se puede reordenar.
- **Side effects:** El cambio de `name` se refleja en todos los documentos que usan este tipo.

---

## §4.12 Desactivar tipo de documento

```
DELETE /api/v1/property-document-types/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345902",
    "code": "acta_entrega",
    "name": "Acta de Entrega de Llaves",
    "is_active": false,
    "documents_count": 0
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
    "code": "CATALOG_IN_USE",
    "message": "No se puede desactivar el tipo de documento porque hay 5 documentos activos que lo usan. Reasigne esos documentos a otro tipo primero.",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "details": {
      "documents_count": 5
    }
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. El tipo debe existir.
- **Reglas de negocio:**
  - **No es DELETE físico.** Es un soft-disable: `is_active = false`. El registro permanece en BD para integridad referencial con documentos existentes.
  - Si `documents_count > 0` (documentos activos usando este tipo), se rechaza con 409.
  - Los tipos del seed (`escritura`, `plano`, `certificado_libertad`, `recibo_pago`, `contrato`, `otros`) deben tener protección extra: no permitir ni siquiera la desactivación si hay documentos activos. Si son seed, `is_seed = true` se valida en backend.
  - No hay endpoint de "reactivar" por ahora. Opcional post-MVP.
- **Side effects:** Ninguno.

---

## Códigos de error específicos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `CATALOG_IN_USE` | 409 | No se puede desactivar un catálogo que tiene unidades activas referenciándolo |
| `CATALOG_CODE_EXISTS` | 400 | El código del catálogo ya está en uso |
| `CATALOG_NOT_FOUND` | 404 | El elemento del catálogo no existe |
| `CATALOG_SEED_PROTECTED` | 403 | No se puede eliminar un registro de seed data |
| `STATUS_HAS_RESIDENTS` | 409 | No se puede cambiar `allows_residents` a FALSE porque hay residentes activos en unidades con este estado |

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Panorama global: [[00-shared/features/PROPIEDADES]]
- Detalle de propiedades: [[endpoints/PROPIEDADES]]
- Detalle de torres: [[endpoints/TOWERS]]
