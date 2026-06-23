---
type: reference
status: active
module: proveedores
scope: api
tags: [api, endpoints, proveedores]
updated: 2026-06-23
---

# Endpoints: Proveedores y contratos

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Proveedores y contratos.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Alcance del módulo
> Solo Web; N/A en App. Gestión administrativa del catálogo de proveedores del conjunto y sus contratos vigentes. Es la fuente de datos para MANTENIMIENTO, ORDENES-TRABAJO y CUENTAS-PAGAR.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 20.1 | GET | `/providers` | Sí | admin | Diseñado |
| 20.2 | POST | `/providers` | Sí | admin | Diseñado |
| 20.3 | GET | `/providers/{id}` | Sí | admin | Diseñado |
| 20.4 | PATCH | `/providers/{id}` | Sí | admin | Diseñado |
| 20.5 | DELETE | `/providers/{id}` | Sí | admin | Diseñado |
| 20.6 | GET | `/providers/{id}/contracts` | Sí | admin | Diseñado |
| 20.7 | POST | `/providers/{id}/contracts` | Sí | admin | Diseñado |
| 20.8 | GET | `/providers/{id}/contracts/{contract_id}` | Sí | admin | Diseñado |
| 20.9 | PATCH | `/providers/{id}/contracts/{contract_id}` | Sí | admin | Diseñado |
| 20.10 | POST | `/providers/{id}/contracts/{contract_id}/terminate` | Sí | admin | Diseñado |
| 20.11 | GET | `/providers/expiring-contracts` | Sí | admin | Diseñado |

> Todas las rutas llevan el prefijo `/api/v1` (omitido en la tabla por brevedad).

---

## §20.1 Listar proveedores

```
GET /api/v1/providers
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category` | string | `cleaning`, `security`, `elevator`, `gardening`, `pool`, `other` |
| `status` | string | `active`, `inactive`, `blacklisted` |
| `expires_within_days` | integer | Contratos que vencen en ≤ N días (para alertas). Default: sin filtro |
| `search` | string | Búsqueda por nombre, NIT o contacto |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "name": "Limpieza Total S.A.S.",
      "nit": "900123456-7",
      "category": "cleaning",
      "status": "active",
      "contact_name": "Carlos Ruiz",
      "contact_email": "carlos@limpiezatotal.com",
      "contact_phone": "3105551234",
      "active_contract": {
        "id": "880e8400-e29b-41d4-a716-446655440010",
        "valid_until": "2026-12-31",
        "automatic_renewal": true
      }
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 14,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `expires_within_days` cruza con `provider_contracts` donde `valid_until - NOW() <= N` y el contrato está `active`; útil para el badge de alerta de vencimiento en la UI
  - Orden por `name` ascendente
- **Side effects:** ninguno — lectura pura

---

## §20.2 Crear proveedor

```
POST /api/v1/providers
```

**Request:**
```json
{
  "name": "Limpieza Total S.A.S.",
  "nit": "900123456-7",
  "category": "cleaning",
  "contact_name": "Carlos Ruiz",
  "contact_email": "carlos@limpiezatotal.com",
  "contact_phone": "3105551234",
  "bank_account": "001-123456-78",
  "notes": "Servicio de aseo común zonas interiores"
}
```

> [!note] Categorías válidas
> `cleaning` (aseo) | `security` (vigilancia) | `elevator` (ascensores) | `gardening` (jardinería) | `pool` (piscina) | `other` (otros)

**Response `201`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Limpieza Total S.A.S.",
    "nit": "900123456-7",
    "category": "cleaning",
    "status": "active",
    "contact_name": "Carlos Ruiz",
    "contact_email": "carlos@limpiezatotal.com",
    "contact_phone": "3105551234",
    "bank_account": "001-123456-78",
    "notes": "Servicio de aseo común zonas interiores",
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "NIT_ALREADY_EXISTS",
    "message": "Ya existe un proveedor con ese NIT",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `nit` debe ser único en el sistema
  - `name`, `nit`, `category`, `contact_name`, `contact_email` y `contact_phone` son obligatorios
  - `bank_account` y `notes` son opcionales
  - El proveedor se crea con `status = active`
- **Side effects:** crea registro en `providers`

---

## §20.3 Ver detalle de proveedor

```
GET /api/v1/providers/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Limpieza Total S.A.S.",
    "nit": "900123456-7",
    "category": "cleaning",
    "status": "active",
    "contact_name": "Carlos Ruiz",
    "contact_email": "carlos@limpiezatotal.com",
    "contact_phone": "3105551234",
    "bank_account": "001-123456-78",
    "notes": "Servicio de aseo común zonas interiores",
    "active_contracts": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440010",
        "valid_from": "2026-01-01",
        "valid_until": "2026-12-31",
        "automatic_renewal": true,
        "status": "active"
      }
    ],
    "work_orders_history": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440020",
        "title": "Mantenimiento preventivo",
        "status": "completed",
        "created_at": "2026-05-10T08:00:00Z"
      }
    ],
    "payments_history": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440030",
        "amount": 1200000,
        "currency": "COP",
        "paid_at": "2026-06-01T10:00:00Z"
      }
    ],
    "created_at": "2026-01-01T08:00:00Z",
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PROVIDER_NOT_FOUND",
    "message": "Proveedor no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Incluye los contratos activos, el historial de órdenes de trabajo y el historial de pagos asociados al proveedor
  - El historial de OTs y pagos se retorna paginado implícitamente (últimos 50 registros); para detalle completo usar los endpoints de MANTENIMIENTO / CUENTAS-PAGAR
- **Side effects:** ninguno — lectura pura

---

## §20.4 Editar proveedor

```
PATCH /api/v1/providers/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "name": "Limpieza Total S.A.S. Actualizada",
  "contact_phone": "3109999999",
  "bank_account": "001-999999-00",
  "notes": "Servicio ampliado a zonas exteriores"
}
```

> [!note]
> `nit` y `category` no son editables aquí. Para cambiar `status`, usar los flujos de blacklist/desactivación (futuro). El `status` solo se muta vía transiciones explícitas.

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "name": "Limpieza Total S.A.S. Actualizada",
    "contact_phone": "3109999999",
    "bank_account": "001-999999-00",
    "notes": "Servicio ampliado a zonas exteriores",
    "updated_at": "2026-06-23T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Si se cambia `contact_email`, no se requiere verificación (es dato administrativo, no credencial)
- **Side effects:** actualiza registro en `providers`

---

## §20.5 Eliminar proveedor

```
DELETE /api/v1/providers/{id}
```

**Response `204`:** (No Content)

**Response `409`:**
```json
{
  "error": {
    "code": "PROVIDER_HAS_ACTIVE_CONTRACTS",
    "message": "No se puede eliminar el proveedor porque tiene contratos vigentes",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Soft delete — marca `deleted_at` en `providers`, no elimina físicamente
  - Si el proveedor tiene al menos un contrato en estado `active`, se rechaza con `PROVIDER_HAS_ACTIVE_CONTRACTS` (409). Deben terminarse o vencerse primero los contratos vigentes
  - Un proveedor eliminado no aparece en listados ni puede asignarse a nuevas órdenes de trabajo
- **Side effects:** actualiza `deleted_at` en `providers`

---

## §20.6 Listar contratos de un proveedor

```
GET /api/v1/providers/{id}/contracts
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `active`, `expired`, `terminated` |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440010",
      "contract_pdf_url": "https://storage.urbania.com/contracts/limpiezatotal-2026.pdf",
      "signed_at": "2025-12-15T14:00:00Z",
      "valid_from": "2026-01-01",
      "valid_until": "2026-12-31",
      "automatic_renewal": true,
      "status": "active",
      "notes": "Renovación anual automática",
      "attachments_count": 2,
      "created_at": "2025-12-15T14:30:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 3,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El `id` del proveedor debe existir; si no, `PROVIDER_NOT_FOUND` (404)
  - Orden descendente por `valid_until` (más recientes primero)
- **Side effects:** ninguno — lectura pura

---

## §20.7 Adjuntar contrato a un proveedor

```
POST /api/v1/providers/{id}/contracts
```

**Request:**
```json
{
  "contract_pdf_url": "https://storage.urbania.com/contracts/limpiezatotal-2026.pdf",
  "signed_at": "2025-12-15T14:00:00Z",
  "valid_from": "2026-01-01",
  "valid_until": "2026-12-31",
  "automatic_renewal": true,
  "notes": "Renovación anual automática"
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440010",
    "provider_id": "770e8400-e29b-41d4-a716-446655440001",
    "contract_pdf_url": "https://storage.urbania.com/contracts/limpiezatotal-2026.pdf",
    "signed_at": "2025-12-15T14:00:00Z",
    "valid_from": "2026-01-01",
    "valid_until": "2026-12-31",
    "automatic_renewal": true,
    "status": "active",
    "notes": "Renovación anual automática",
    "created_at": "2025-12-15T14:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `valid_until` debe ser posterior a `valid_from`
  - `contract_pdf_url` es obligatorio — el PDF debe estar ya subido al storage del sistema (subida por endpoint de archivos, no por este)
  - El contrato se crea con `status = active`
  - Un proveedor puede tener múltiples contratos históricos pero solo uno `active` por categoría (ver panorama §7)
- **Side effects:** crea registro en `provider_contracts`

---

## §20.8 Ver contrato específico

```
GET /api/v1/providers/{id}/contracts/{contract_id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440010",
    "provider_id": "770e8400-e29b-41d4-a716-446655440001",
    "contract_pdf_url": "https://storage.urbania.com/contracts/limpiezatotal-2026.pdf",
    "signed_at": "2025-12-15T14:00:00Z",
    "valid_from": "2026-01-01",
    "valid_until": "2026-12-31",
    "automatic_renewal": true,
    "status": "active",
    "notes": "Renovación anual automática",
    "attachments": [
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440040",
        "name": "anexo_servicios.pdf",
        "url": "https://storage.urbania.com/contracts/anexo_servicios.pdf"
      }
    ],
    "created_at": "2025-12-15T14:30:00Z",
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "CONTRACT_NOT_FOUND",
    "message": "Contrato no encontrado para este proveedor",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El contrato debe pertenecer al proveedor indicado; si el `contract_id` existe pero no pertenece al `id`, retorna `CONTRACT_NOT_FOUND` (404)
  - Incluye la lista de adjuntos del contrato (`provider_attachments`)
- **Side effects:** ninguno — lectura pura

---

## §20.9 Editar contrato

```
PATCH /api/v1/providers/{id}/contracts/{contract_id}
```

**Request:** (todos los campos opcionales)
```json
{
  "valid_until": "2027-03-31",
  "automatic_renewal": false,
  "notes": "Prórroga trimestral acordada"
}
```

> [!note]
> `contract_pdf_url` y `signed_at` no son editables aquí. Para reemplazar el documento, subir uno nuevo y referenciarlo. Para `valid_from` ya cumplido, no se modifica.

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440010",
    "valid_until": "2027-03-31",
    "automatic_renewal": false,
    "notes": "Prórroga trimestral acordada",
    "updated_at": "2026-06-23T11:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "CONTRACT_EXPIRED",
    "message": "El contrato ya venció y existe uno nuevo que lo reemplaza; no se puede modificar",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Si se mueve `valid_until`, debe seguir siendo posterior a `valid_from`
  - Si el contrato está `expired` **y** ya existe un contrato `active` posterior para el mismo proveedor y categoría, se rechaza con `CONTRACT_EXPIRED` (409): no se puede editar un contrato vencido que ya fue reemplazado. Si está `expired` pero no hay reemplazo, sí se permite (extender la vigencia lo vuelve `active`)
  - Un contrato `terminated` no es editable
- **Side effects:** actualiza registro en `provider_contracts`

---

## §20.10 Terminar contrato anticipadamente

```
POST /api/v1/providers/{id}/contracts/{contract_id}/terminate
```

**Request:**
```json
{
  "reason": "Incumplimiento de SLA",
  "terminated_at": "2026-06-30"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440010",
    "status": "terminated",
    "terminated_at": "2026-06-30",
    "termination_reason": "Incumplimiento de SLA",
    "updated_at": "2026-06-23T12:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo aplica a contratos `active`; un contrato `expired` o `terminated` retorna `CONTRACT_NOT_FOUND` (404) o `409` según estado
  - `reason` y `terminated_at` son obligatorios
  - `terminated_at` no puede ser anterior a `valid_from` ni posterior a `valid_until`
  - Tras la terminación, el contrato queda `terminated` y el proveedor queda sin contrato activo para esa categoría (hasta que se adjunte uno nuevo)
- **Side effects:**
  - Actualiza `status = terminated`, `terminated_at` y `termination_reason` en `provider_contracts`
  - Emite evento para que CUENTAS-PAGAR no agende más pagos recurrentes asociados a este contrato

---

## §20.11 Contratos por vencer

```
GET /api/v1/providers/expiring-contracts
```

> [!note] Uso
> Source de la alerta de vencimiento en la UI (catálogo de proveedores y dashboard del admin). Retorna los contratos `active` cuyo `valid_until` está a ≤ 30 días de la fecha actual.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `days` | integer | Ventana de vencimiento en días (default: 30, max: 90) |
| `category` | string | Filtrar por categoría del proveedor |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "contract_id": "880e8400-e29b-41d4-a716-446655440010",
      "provider_id": "770e8400-e29b-41d4-a716-446655440001",
      "provider_name": "Limpieza Total S.A.S.",
      "category": "cleaning",
      "valid_until": "2026-07-15",
      "days_until_expiry": 22,
      "automatic_renewal": false
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 4,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo incluye contratos `active` con `valid_until >= NOW()` (no los ya vencidos)
  - `days_until_expiry` se calcula como `valid_until::date - NOW()::date`
  - Orden ascendente por `days_until_expiry` (los más urgentes primero)
  - Los contratos con `automatic_renewal = true` se incluyen igual (el admin debe confirmar la renovación)
- **Side effects:** ninguno — lectura pura

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec Web: [[02-web/features/proveedores/PROVEEDORES_SPEC]]
- Panorama global: [[00-shared/features/PROVEEDORES]]
- Módulos consumidores: [[endpoints/MANTENIMIENTO]], [[endpoints/ORDENES-TRABAJO]], [[endpoints/CUENTAS-PAGAR]]
