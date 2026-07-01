---
type: endpoints
status: active
module: api
tags: [api, endpoints, directorio, contacts]
updated: 2026-06-27
---

# Endpoints: Directorio (Residentes y Propietarios)

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Directorio (contactos, ocupantes y catálogos).
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.
> Para el panorama global del feature, ver [[00-shared/features/DIRECTORIO]].

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Estado |
|---|--------|------|------|--------|
| 6.1 | GET | /contacts | Sí (admin) | Diseñado |
| 6.2 | POST | /contacts | Sí (admin) | Diseñado |
| 6.3 | GET | /contacts/{id} | Sí | Diseñado |
| 6.4 | PATCH | /contacts/{id} | Sí (admin) | Diseñado |
| 6.5 | DELETE | /contacts/{id} | Sí (admin) | Diseñado |
| 6.6 | GET | /properties/{propertyId}/occupants | Sí | Diseñado |
| 6.7 | POST | /properties/{propertyId}/occupants | Sí (admin) | Diseñado |
| 6.8 | PATCH | /property-occupants/{id} | Sí (admin) | Diseñado |
| 6.9 | DELETE | /property-occupants/{id} | Sí (admin) | Diseñado |
| 6.10 | GET | /contacts/{id}/properties | Sí | Diseñado |
| 6.11 | GET | /occupant-types | Sí | Diseñado |

> `Sí` = Autenticado. `Sí (admin)` = Autenticado con rol `admin`.

---

## §6.1 Listar contactos

```
GET /api/v1/contacts
```

**Headers:** Headers obligatorios estándar (ver [[API_CONTRACT]] §Convenciones Generales).

**Query params — Filtros:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `full_name` | string | no | Búsqueda parcial por nombre completo |
| `document_type` | string | no | Filtrar por tipo de documento (CC, NIT, CE, Pasaporte, Otro) |
| `document_number` | string | no | Búsqueda parcial por número de documento |
| `email` | string | no | Búsqueda parcial por email |
| `phone` | string | no | Búsqueda parcial por teléfono |
| `property_id` | UUID | no | Filtrar contactos vinculados a una unidad específica |
| `has_user` | boolean | no | `true` = solo con usuario vinculado, `false` = solo sin usuario |
| `is_active` | boolean | no | `true` (default) = excluir soft-deleted |
| `page` | integer | no | Número de página (default: 1) |
| `per_page` | integer | no | Resultados por página (default: 20, max: 100) |
| `sort_by` | string | no | `full_name`, `document_type`, `document_number`, `created_at` (default: `full_name`) |
| `sort_order` | string | no | `asc` (default) o `desc` |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345601",
      "user_id": null,
      "document_type": "CC",
      "document_number": "123456789",
      "full_name": "María García López",
      "email": "maria@example.com",
      "phone": "3001234567",
      "emergency_contact_name": "Carlos García",
      "emergency_contact_phone": "3007654321",
      "notes": null,
      "occupant_types": ["propietario", "residente"],
      "properties_count": 1,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 20,
    "total": 1,
    "last_page": 1
  }
}
```

**Response 403:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Solo los administradores pueden acceder a este recurso",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## §6.2 Crear contacto

```
POST /api/v1/contacts
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "full_name": "María García López",
  "document_type": "CC",
  "document_number": "123456789",
  "email": "maria@example.com",
  "phone": "3001234567",
  "emergency_contact_name": "Carlos García",
  "emergency_contact_phone": "3007654321",
  "notes": "Llamar antes de las 6pm",
  "user_id": null
}
```

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `full_name` | string | sí | Nombre completo de la persona (max 255 chars) |
| `document_type` | string | sí | Tipo de documento: `CC`, `NIT`, `CE`, `Pasaporte`, `Otro` |
| `document_number` | string | sí | Número de identificación (max 30 chars, único entre activos) |
| `email` | string | no | Email personal (max 255 chars) |
| `phone` | string | no | Teléfono (max 20 chars) |
| `emergency_contact_name` | string | no | Nombre del contacto de emergencia (max 255 chars) |
| `emergency_contact_phone` | string | no | Teléfono del contacto de emergencia (max 20 chars) |
| `notes` | string | no | Notas internas de administración |
| `user_id` | UUID | no | Vincular a un usuario existente (UNIQUE, nullable) |

**Response 201:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345601",
    "user_id": null,
    "document_type": "CC",
    "document_number": "123456789",
    "full_name": "María García López",
    "email": "maria@example.com",
    "phone": "3001234567",
    "emergency_contact_name": "Carlos García",
    "emergency_contact_phone": "3007654321",
    "notes": "Llamar antes de las 6pm",
    "created_at": "2026-06-27T12:00:00Z",
    "updated_at": "2026-06-27T12:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 422:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo full_name es obligatorio",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "CONTACT_DOCUMENT_DUPLICATE",
    "message": "Ya existe un contacto activo con el mismo tipo y número de documento",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. No existe otro contacto activo con el mismo `document_type` + `document_number`.
- **Reglas de negocio:**
  - `document_number` debe ser único entre contactos activos (partial unique index `WHERE deleted_at IS NULL`).
  - `user_id` si se envía no NULL, debe corresponder a un usuario existente y no estar ya vinculado a otro contacto.
  - `document_type` validado contra lista conocida (CC, NIT, CE, Pasaporte, Otro).
- **Side effects:** Si `user_id` se asigna, el usuario queda vinculado a este contacto (relación 1:1 usuario-persona).
- **Casos borde:**
  - `user_id` ya vinculado a otro contacto → `USER_ALREADY_LINKED` (409).
  - Documento duplicado (soft-deleted) → permitido, el partial unique index solo aplica a registros activos.

---

## §6.3 Ver detalle de contacto

```
GET /api/v1/contacts/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345601",
    "user_id": null,
    "document_type": "CC",
    "document_number": "123456789",
    "full_name": "María García López",
    "email": "maria@example.com",
    "phone": "3001234567",
    "emergency_contact_name": "Carlos García",
    "emergency_contact_phone": "3007654321",
    "notes": null,
    "properties": [
      {
        "id": "0190a1b2-c3d4-5678-9abc-def012345701",
        "property_id": "0190a1b2-c3d4-5678-9abc-def012345001",
        "occupant_type": {
          "id": "0190a1b2-c3d4-5678-9abc-def012345801",
          "code": "propietario",
          "name": "Propietario"
        },
        "is_primary": true,
        "is_active": true,
        "move_in_date": "2020-01-15",
        "move_out_date": null
      }
    ],
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
    "code": "CONTACT_NOT_FOUND",
    "message": "El contacto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El contacto debe existir y no estar soft-deleted.
- **Reglas de negocio:** Incluye en la respuesta las unidades asociadas (vía `property_occupants`) con su tipo de ocupante, fechas y estado. Los residentes solo ven sus propios datos (validación vía `user_id` del JWT).
- **Side effects:** Ninguno.
- **Casos borde:** Contacto soft-deleted retorna `404 NOT_FOUND`.

---

## §6.4 Actualizar contacto

```
PATCH /api/v1/contacts/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "full_name": "María García López de Rodríguez",
  "email": "mariarodriguez@example.com",
  "phone": "3009876543",
  "emergency_contact_name": "Pedro Rodríguez",
  "emergency_contact_phone": "3001112233",
  "notes": "Nuevo número de contacto"
}
```

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `full_name` | string | no | Nombre completo (max 255 chars) |
| `document_type` | string | no | Tipo de documento (cambiar solo si es legalmente correcto) |
| `document_number` | string | no | Número de documento (max 30 chars) |
| `email` | string | no | Email personal (max 255 chars) |
| `phone` | string | no | Teléfono (max 20 chars) |
| `emergency_contact_name` | string | no | Nombre del contacto de emergencia |
| `emergency_contact_phone` | string | no | Teléfono del contacto de emergencia |
| `notes` | string | no | Notas internas |
| `user_id` | UUID | no | Vincular/desvincular usuario (enviar `null` para desvincular) |

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345601",
    "user_id": null,
    "document_type": "CC",
    "document_number": "123456789",
    "full_name": "María García López de Rodríguez",
    "email": "mariarodriguez@example.com",
    "phone": "3009876543",
    "emergency_contact_name": "Pedro Rodríguez",
    "emergency_contact_phone": "3001112233",
    "notes": "Nuevo número de contacto",
    "created_at": "2026-06-27T12:00:00Z",
    "updated_at": "2026-06-27T14:00:00Z"
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
    "code": "CONTACT_NOT_FOUND",
    "message": "El contacto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "CONTACT_DOCUMENT_DUPLICATE",
    "message": "Ya existe otro contacto activo con el mismo tipo y número de documento",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El contacto debe existir y no estar soft-deleted. Usuario autenticado con rol `admin`.
- **Reglas de negocio:** Si se cambia `document_type` o `document_number`, se valida unicidad. Si se cambia `user_id`, se valida que el nuevo usuario no esté vinculado a otro contacto. Solo los campos enviados se actualizan (PATCH parcial).
- **Side effects:** Si `user_id` cambia, el vínculo usuario-contacto anterior se rompe.
- **Casos borde:** `user_id` enviado como `null` desvincula el usuario del contacto (si tenía uno). Contacto soft-deleted retorna 404.

---

## §6.5 Eliminar contacto (soft delete)

```
DELETE /api/v1/contacts/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 204:** Sin contenido.

**Response 404:**
```json
{
  "error": {
    "code": "CONTACT_NOT_FOUND",
    "message": "El contacto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "HAS_ACTIVE_OCCUPANTS",
    "message": "El contacto tiene vínculos activos como ocupante. Desvincúlelo de todas las unidades antes de eliminarlo",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El contacto debe existir, no estar soft-deleted y no tener vínculos activos como ocupante (`property_occupants.is_active = true` o `deleted_at IS NULL`).
- **Reglas de negocio:**
  - Soft delete: se asigna `deleted_at` al timestamp actual. El registro no se elimina físicamente de la BD.
  - No se puede eliminar un contacto que sea el **único propietario** de alguna unidad. Primero debe asignarse otro propietario o desvincularlo.
  - El `user_id` asociado (si existe) se conserva pero el usuario queda sin contacto vinculado.
- **Side effects:** El contacto queda invisible para todas las consultas subsiguientes (filtro `WHERE deleted_at IS NULL` en todos los queries de listado y detalle).
- **Casos borde:** Si el contacto es el único propietario de una unidad, el DELETE debe rechazarse con `HAS_ACTIVE_OCCUPANTS` (el copy describe "validar que no tenga vínculos activos como propietario").

---

## §6.6 Listar ocupantes de una unidad

```
GET /api/v1/properties/{propertyId}/occupants
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `occupant_type_id` | UUID | no | Filtrar por tipo de ocupante |
| `is_active` | boolean | no | `true` (default) = solo ocupantes activos |
| `include_inactive` | boolean | no | `true` = incluir también ocupantes inactivos (historial) |
| `search` | string | no | Búsqueda por nombre del contacto |
| `page` | integer | no | Número de página (default: 1) |
| `per_page` | integer | no | Resultados por página (default: 20, max: 100) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345901",
      "contact": {
        "id": "0190a1b2-c3d4-5678-9abc-def012345601",
        "full_name": "María García López",
        "document_type": "CC",
        "document_number": "123456789"
      },
      "occupant_type": {
        "id": "0190a1b2-c3d4-5678-9abc-def012345801",
        "code": "propietario",
        "name": "Propietario"
      },
      "is_primary": true,
      "is_active": true,
      "move_in_date": "2020-01-15",
      "move_out_date": null,
      "created_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 20,
    "total": 1,
    "last_page": 1
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "La unidad solicitada no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** La unidad (`propertyId`) debe existir y no estar soft-deleted.
- **Reglas de negocio:** Los residentes ven solo su propia unidad. Los admins ven cualquier unidad. Los ocupantes inactivos (soft-delete o `is_active = false`) se excluyen por defecto; se incluyen si `include_inactive = true`.
- **Side effects:** Ninguno.

---

## §6.7 Vincular contacto a unidad

```
POST /api/v1/properties/{propertyId}/occupants
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "contact_id": "0190a1b2-c3d4-5678-9abc-def012345601",
  "occupant_type_id": "0190a1b2-c3d4-5678-9abc-def012345801",
  "is_primary": true,
  "move_in_date": "2020-01-15",
  "notes": "Propietario principal"
}
```

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `contact_id` | UUID | sí | Contacto a vincular |
| `occupant_type_id` | UUID | sí | Tipo de ocupante (debe pertenecer a `occupant_types` y estar activo) |
| `is_primary` | boolean | no | DEFAULT `false`. Marcar como contacto principal para este rol en la unidad |
| `move_in_date` | date | no | Fecha de ingreso/mudanza (formato `YYYY-MM-DD`, default: today) |
| `notes` | string | no | Notas sobre la vinculación |

**Response 201:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345901",
    "property_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "contact": {
      "id": "0190a1b2-c3d4-5678-9abc-def012345601",
      "full_name": "María García López"
    },
    "occupant_type": {
      "id": "0190a1b2-c3d4-5678-9abc-def012345801",
      "code": "propietario",
      "name": "Propietario"
    },
    "is_primary": true,
    "is_active": true,
    "move_in_date": "2020-01-15",
    "move_out_date": null,
    "notes": "Propietario principal",
    "created_at": "2026-06-27T12:00:00Z",
    "updated_at": "2026-06-27T12:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 422:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo contact_id es obligatorio",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONTACT_NOT_FOUND",
    "message": "El contacto especificado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "DUPLICATE_OCCUPANT",
    "message": "El contacto ya está vinculado a esta unidad con el mismo tipo de ocupante",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El contacto debe existir y no estar soft-deleted. La unidad debe existir. El `occupant_type_id` debe corresponder a un tipo activo.
- **Reglas de negocio:**
  - No puede existir duplicado de `(property_id, contact_id, occupant_type_id)` activo (partial unique index).
  - Si `is_primary = true`, se desmarcan los otros primary del mismo `property_id` + `occupant_type_id` (máximo un primary por rol por unidad).
  - `move_in_date` por defecto es la fecha actual si no se envía.
- **Side effects:** El contacto queda visible en la unidad. El contador `residents_count` (si existe en `properties`) se actualiza.
- **Casos borde:** Si el contacto ya existe pero está soft-deleteado en la relación, se reactiva (restaurar soft delete) en vez de crear duplicado. `move_out_date` no debe enviarse en creación (se asigna al desvincular).

---

## §6.8 Actualizar vínculo ocupante

```
PATCH /api/v1/property-occupants/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "occupant_type_id": "0190a1b2-c3d4-5678-9abc-def012345802",
  "is_primary": false,
  "is_active": false,
  "move_in_date": "2020-01-15",
  "move_out_date": "2026-06-27",
  "notes": "Cambió a tipo residente"
}
```

| Campo | Tipo | Req | Descripción |
|-------|------|-----|-------------|
| `occupant_type_id` | UUID | no | Cambiar tipo de ocupante |
| `is_primary` | boolean | no | Marcar/desmarcar como contacto principal del rol |
| `is_active` | boolean | no | Activar o desactivar el vínculo manualmente |
| `move_in_date` | date | no | Actualizar fecha de ingreso |
| `move_out_date` | date | no | Fecha de salida (si se asigna, `is_active` se establece automáticamente a `false`) |
| `notes` | string | no | Notas sobre la vinculación |

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345901",
    "property_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "contact": {
      "id": "0190a1b2-c3d4-5678-9abc-def012345601",
      "full_name": "María García López"
    },
    "occupant_type": {
      "id": "0190a1b2-c3d4-5678-9abc-def012345802",
      "code": "residente",
      "name": "Residente"
    },
    "is_primary": false,
    "is_active": false,
    "move_in_date": "2020-01-15",
    "move_out_date": "2026-06-27",
    "notes": "Cambió a tipo residente",
    "created_at": "2026-06-27T12:00:00Z",
    "updated_at": "2026-06-27T14:00:00Z"
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
    "code": "OCCUPANT_NOT_FOUND",
    "message": "El vínculo ocupante solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "MUST_HAVE_OWNER",
    "message": "No se puede cambiar el tipo del último propietario de la unidad. Asigne otro propietario primero",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El vínculo debe existir y no estar soft-deleted. Usuario autenticado con rol `admin`.
- **Reglas de negocio:**
  - Solo los campos enviados se actualizan (PATCH parcial).
  - Si se asigna `move_out_date`, `is_active` se establece automáticamente a `false`.
  - `move_out_date` debe ser ≥ `move_in_date` (si ambos están presentes).
  - Si se cambia `occupant_type_id` de `propietario` a otro tipo, validar que la unidad tenga al menos otro propietario activo.
  - Si `is_primary = true`, desmarcar los otros primary del mismo `property_id + occupant_type_id`.
- **Side effects:** Cambiar `is_active` o `occupant_type_id` puede afectar el contador de residentes de la unidad.
- **Casos borde:** No se puede cambiar el tipo del último propietario. Si `move_out_date` se asigna, `is_active` se sincroniza automáticamente. Si luego se elimina `move_out_date` (enviando `null`), `is_active` NO se reactiva automáticamente (el usuario debe establecerlo explícitamente).

---

## §6.9 Eliminar vínculo ocupante (soft delete)

```
DELETE /api/v1/property-occupants/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 204:** Sin contenido.

**Response 404:**
```json
{
  "error": {
    "code": "OCCUPANT_NOT_FOUND",
    "message": "El vínculo ocupante solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "MUST_HAVE_OWNER",
    "message": "No se puede eliminar el último propietario de la unidad. Asigne otro propietario primero",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El vínculo debe existir, no estar soft-deleted y no ser el único propietario activo de la unidad.
- **Reglas de negocio:**
  - Soft delete: se asigna `deleted_at` al timestamp actual.
  - **Ley 675 de 2001:** Una unidad debe tener al menos un propietario activo en todo momento. Si el vínculo a eliminar tiene `occupant_type = propietario` y es el único propietario activo de la unidad, se rechaza con `MUST_HAVE_OWNER`.
  - Si el vínculo tiene `is_active = false` o `move_out_date` asignado, el soft delete igualmente se permite (el historial se preserva).
- **Side effects:** El ocupante deja de aparecer en la unidad. El contador `residents_count` se actualiza.
- **Casos borde:** Si el contacto tenía este como su único vínculo, el contacto mismo no se elimina (sigue en el directorio). Si se elimina un vínculo primario y hay otro del mismo tipo, ese otro debe promoverse a primario automáticamente (validar si hay uno existente).

---

## §6.10 Listar unidades de un contacto

```
GET /api/v1/contacts/{id}/properties
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `occupant_type_id` | UUID | no | Filtrar por tipo de ocupante |
| `is_active` | boolean | no | `true` (default) = solo vínculos activos |
| `include_inactive` | boolean | no | `true` = incluir vínculos inactivos |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345901",
      "property": {
        "id": "0190a1b2-c3d4-5678-9abc-def012345001",
        "tower_name": "Torre 1",
        "unit_number": "302",
        "full_designation": "T1 - 302"
      },
      "occupant_type": {
        "id": "0190a1b2-c3d4-5678-9abc-def012345801",
        "code": "propietario",
        "name": "Propietario"
      },
      "is_primary": true,
      "is_active": true,
      "move_in_date": "2020-01-15",
      "move_out_date": null
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 20,
    "total": 1,
    "last_page": 1
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONTACT_NOT_FOUND",
    "message": "El contacto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** El contacto debe existir y no estar soft-deleted.
- **Reglas de negocio:** Los residentes solo ven sus propias unidades (su `user_id` debe coincidir con `contacts.user_id` del contacto solicitado). Los admins ven las unidades de cualquier contacto.
- **Side effects:** Ninguno.
- **Casos borde:** Contacto sin vínculos → `data` array vacío (200). Contacto soft-deleted → 404.

---

## §6.11 Listar tipos de ocupante

```
GET /api/v1/occupant-types
```

**Headers:** Headers obligatorios estándar.

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `is_active` | boolean | no | `true` (default) = solo tipos activos |
| `page` | integer | no | Número de página (default: 1) |
| `per_page` | integer | no | Resultados por página (default: 20, max: 100) |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345801",
      "code": "propietario",
      "name": "Propietario",
      "description": "Persona propietaria de la unidad",
      "sort_order": 1,
      "is_active": true,
      "occupants_count": 45,
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 20,
    "total": 6,
    "last_page": 1
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado (cualquier rol).
- **Reglas de negocio:** Los tipos inactivos se excluyen por defecto para no mostrarse en selects de creación. El campo `occupants_count` es calculado (número de `property_occupants` activos que referencian este tipo).
- **Side effects:** Ninguno.

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Panorama global del feature: [[00-shared/features/DIRECTORIO]]
- Spec Web (pendiente): [[02-web/features/directorio/DIRECTORIO_SPEC]]
- Spec App (pendiente): [[03-app/features/directorio/DIRECTORIO_SPEC]]
