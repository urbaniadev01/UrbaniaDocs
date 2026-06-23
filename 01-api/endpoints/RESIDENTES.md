---
type: reference
status: active
module: residentes
scope: api
tags: [api, endpoints, residentes]
updated: 2026-06-23
---

# Endpoints: Residentes

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Residentes.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 3.1 | GET | `/residents` | Sí | admin | Diseñado |
| 3.2 | POST | `/residents` | Sí | admin | Diseñado |
| 3.3 | GET | `/residents/{id}` | Sí | admin, user* | Diseñado |
| 3.4 | PATCH | `/residents/{id}` | Sí | admin | Diseñado |
| 3.5 | PATCH | `/residents/{id}/unit` | Sí | admin | Diseñado |
| 3.6 | PATCH | `/residents/{id}/status` | Sí | admin | Diseñado |

> `*` Un residente (`role = user`) puede ver su propio perfil vía `/residents/{id}` si el `id` corresponde a su usuario.

---

## §3.1 Listar residentes

```
GET /api/v1/residents
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `active`, `inactive`, `suspended` |
| `type` | string | `owner`, `tenant`, `family` |
| `unit_id` | uuid | Filtrar por unidad |
| `search` | string | Búsqueda por nombre, email o documento |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Juan Perez",
      "email": "juan@email.com",
      "phone": "3001234567",
      "document_type": "CC",
      "document_number": "12345678",
      "type": "owner",
      "status": "active",
      "unit": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "number": "101",
        "tower": "A"
      }
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 85,
      "total_pages": 5
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Side effects:** ninguno — lectura pura

---

## §3.2 Crear residente

```
POST /api/v1/residents
```

**Request:**
```json
{
  "name": "Maria Lopez",
  "email": "maria.lopez@email.com",
  "phone": "3009876543",
  "document_type": "CC",
  "document_number": "87654321",
  "type": "tenant",
  "unit_id": "550e8400-e29b-41d4-a716-446655440000",
  "move_in_date": "2026-07-01"
}
```

> [!note] Tipos de residente
> `owner` = propietario | `tenant` = arrendatario | `family` = familiar del propietario

**Response `201`:**
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440099",
    "name": "Maria Lopez",
    "email": "maria.lopez@email.com",
    "phone": "3009876543",
    "document_type": "CC",
    "document_number": "87654321",
    "type": "tenant",
    "status": "active",
    "unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A"
    },
    "move_in_date": "2026-07-01",
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "DOCUMENT_ALREADY_EXISTS",
    "message": "Ya existe un residente con ese número de documento",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `document_number` debe ser único en el sistema — independiente del tipo de documento
  - La unidad referenciada (`unit_id`) debe existir y estar en estado `vacant` o `for_sale` — no se asigna residente a unidad ya ocupada por otro residente activo
  - Al crear, la unidad cambia automáticamente a estado `occupied`
  - El residente se crea sin credenciales de acceso — si necesita acceso al portal, el admin invita por email desde un flujo separado
- **Side effects:**
  - Crea registro en `residents`
  - Actualiza `status = occupied` en la unidad referenciada
  - Crea registro en historial de residentes de la unidad

---

## §3.3 Ver perfil de residente

```
GET /api/v1/residents/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Juan Perez",
    "email": "juan@email.com",
    "phone": "3001234567",
    "document_type": "CC",
    "document_number": "12345678",
    "type": "owner",
    "status": "active",
    "unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A",
      "floor": 1,
      "coefficient": 0.0245
    },
    "move_in_date": "2023-01-15",
    "move_out_date": null,
    "vehicles_count": 1,
    "created_at": "2023-01-15T08:00:00Z",
    "updated_at": "2026-06-01T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo puede ver su propio perfil; cualquier otro `id` retorna `403 FORBIDDEN`
  - `role = admin`: puede ver cualquier residente
- **Side effects:** ninguno — lectura pura

---

## §3.4 Editar datos del residente

```
PATCH /api/v1/residents/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "name": "Juan Perez Actualizado",
  "phone": "3001111111",
  "email": "nuevo@email.com"
}
```

> [!note]
> `document_number`, `document_type`, `type` y `unit_id` no son editables aquí.
> Para cambiar unidad, usar §3.5. Para cambiar tipo de residente, debe recrearse el registro.

**Response `200`:**
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Juan Perez Actualizado",
    "email": "nuevo@email.com",
    "phone": "3001111111",
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Si se cambia `email`, se envía verificación al nuevo email (no se actualiza hasta que el residente confirme)
- **Side effects:** actualiza registro en `residents`

---

## §3.5 Cambiar unidad del residente

```
PATCH /api/v1/residents/{id}/unit
```

**Request:**
```json
{
  "unit_id": "550e8400-e29b-41d4-a716-446655440077",
  "move_in_date": "2026-08-01",
  "notes": "Traslado a unidad más grande"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "unit": {
      "id": "550e8400-e29b-41d4-a716-446655440077",
      "number": "302",
      "tower": "B"
    },
    "move_in_date": "2026-08-01"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La nueva unidad debe estar en estado `vacant` o `for_sale`
  - La unidad anterior cambia a `vacant` automáticamente
  - La nueva unidad cambia a `occupied` automáticamente
  - Se cierra el registro histórico en la unidad anterior con `to = move_in_date`
- **Side effects:**
  - Actualiza `unit_id` en el residente
  - Actualiza `status` de ambas unidades
  - Crea entrada en historial de residentes de ambas unidades

---

## §3.6 Cambiar estado del residente

```
PATCH /api/v1/residents/{id}/status
```

**Request:**
```json
{
  "status": "inactive",
  "move_out_date": "2026-07-31",
  "notes": "Vence contrato de arrendamiento"
}
```

> [!note] Valores válidos de `status`
> `active` → `inactive` (salida) | `active` → `suspended` | `suspended` → `active`

**Response `200`:**
```json
{
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "inactive",
    "move_out_date": "2026-07-31"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Para `status = inactive`: `move_out_date` es obligatorio
  - Al desactivar, la unidad cambia automáticamente a `vacant`
  - Un residente inactivo mantiene acceso de solo lectura a su historial financiero en la app
  - Un residente suspendido no puede hacer reservas ni registrar PQRS
- **Side effects:**
  - Actualiza `status` y `move_out_date` en `residents`
  - Si `inactive`: actualiza unidad a `vacant`
  - Cierra el registro histórico de la unidad con `to = move_out_date`

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec Web: [[02-web/features/residentes/RESIDENTES_SPEC]]
- Spec App: [[03-app/features/residentes/RESIDENTES_SPEC]]
- Panorama global: [[00-shared/features/RESIDENTES]]
- Módulo base: [[endpoints/PROPIEDADES]]
