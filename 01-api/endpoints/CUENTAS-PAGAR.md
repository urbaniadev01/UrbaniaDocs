---
type: reference
status: active
module: cuentas-pagar
scope: api
tags: [api, endpoints, cuentas-pagar]
updated: 2026-06-23
---

# Endpoints: Cuentas por pagar

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Cuentas por pagar.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Solo Web
> Este feature es **solo Web**; N/A en App (gestión administrativa del conjunto).

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 21.1 | GET | `/payables` | Sí | admin | Diseñado |
| 21.2 | POST | `/payables` | Sí | admin | Diseñado |
| 21.3 | GET | `/payables/{id}` | Sí | admin | Diseñado |
| 21.4 | PATCH | `/payables/{id}` | Sí | admin | Diseñado |
| 21.5 | POST | `/payables/{id}/approve` | Sí | admin | Diseñado |
| 21.6 | POST | `/payables/{id}/reject` | Sí | admin | Diseñado |
| 21.7 | POST | `/payables/{id}/payment` | Sí | admin | Diseñado |
| 21.8 | POST | `/payables/{id}/void` | Sí | admin | Diseñado |
| 21.9 | GET | `/payables/summary` | Sí | admin | Diseñado |

> El flujo de aprobación y el pago ejecutado usan subrutas: `/payables/{id}/approvals` (acciones §21.5 y §21.6) y `/payables/{id}/payment` (§21.7). El admin aprueba, rechaza y ejecuta pago en todo el módulo.

---

## §21.1 Listar cuentas por pagar

```
GET /api/v1/payables
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `pending`, `approved`, `rejected`, `paid`, `void` |
| `provider_id` | uuid | Filtrar por proveedor |
| `due_within_days` | integer | Alerta de vencimiento: cuentas que vencen en los próximos N días |
| `from` | date ISO 8601 | Filtra por `due_at` desde (inclusive) |
| `to` | date ISO 8601 | Filtra por `due_at` hasta (inclusive) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "provider": {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "name": "Seguridad Andina S.A.S."
      },
      "concept": "Vigilancia junio 2026",
      "amount": 4500000,
      "currency": "COP",
      "due_at": "2026-06-30T23:59:59Z",
      "status": "pending",
      "category_budget_line_id": "880e8400-e29b-41d4-a716-446655440010",
      "paid_at": null,
      "is_overdue": false,
      "created_at": "2026-06-23T10:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 37,
      "total_pages": 2
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Orden descendente por `due_at` (más próximas a vencer primero)
  - `is_overdue` se calcula en runtime: `due_at < NOW() AND status IN (pending, approved)`
  - `due_within_days` retorna cuentas con `due_at BETWEEN NOW() AND NOW() + interval 'N days'` y `status IN (pending, approved)`
- **Side effects:** ninguno — lectura pura

---

## §21.2 Registrar cuenta por pagar

```
POST /api/v1/payables
```

**Request:**
```json
{
  "provider_id": "770e8400-e29b-41d4-a716-446655440001",
  "concept": "Vigilancia junio 2026",
  "amount": 4500000,
  "currency": "COP",
  "due_at": "2026-06-30T23:59:59Z",
  "attachment_ids": ["aa1e8400-e29b-41d4-a716-446655440001"],
  "category_budget_line_id": "880e8400-e29b-41d4-a716-446655440010"
}
```

> [!note]
> `category_budget_line_id` es **opcional** pero recomendado: vincula la cuenta a una línea de presupuesto para afectar la ejecución presupuestaria al pagar (ver §21.7).

**Response `201`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "provider": {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "name": "Seguridad Andina S.A.S."
    },
    "concept": "Vigilancia junio 2026",
    "amount": 4500000,
    "currency": "COP",
    "due_at": "2026-06-30T23:59:59Z",
    "status": "pending",
    "category_budget_line_id": "880e8400-e29b-41d4-a716-446655440010",
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
    "message": "El monto debe ser mayor a 0",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La cuenta se crea en estado `pending`
  - `provider_id` debe existir y estar activo
  - `amount` debe ser mayor que 0
  - `due_at` debe ser posterior a `NOW()`
  - `attachment_ids[]` deben existir y pertenecer al tenant; se asocian como soportes de la factura
  - Si se envía `category_budget_line_id`, debe existir y pertenecer al presupuesto vigente
- **Side effects:**
  - Crea registro en `payables`
  - Asocia filas en `payable_attachments` para cada `attachment_id`
- **Casos borde:** si `category_budget_line_id` no se envía, la cuenta se puede aprobar y pagar pero no afecta ejecución presupuestaria — el admin puede asignarla luego vía §21.4 si la cuenta sigue `pending`

---

## §21.3 Ver detalle de cuenta por pagar

```
GET /api/v1/payables/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "provider": {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "name": "Seguridad Andina S.A.S.",
      "tax_id": "900123456-7"
    },
    "concept": "Vigilancia junio 2026",
    "amount": 4500000,
    "currency": "COP",
    "due_at": "2026-06-30T23:59:59Z",
    "status": "approved",
    "category_budget_line": {
      "id": "880e8400-e29b-41d4-a716-446655440010",
      "name": "Seguridad"
    },
    "is_overdue": false,
    "approvals": [
      {
        "id": "bb1e8400-e29b-41d4-a716-446655440001",
        "action": "approved",
        "actor": { "id": "660e8400-e29b-41d4-a716-446655440000", "name": "Admin Urbania" },
        "comment": "Factura verificada contra contrato",
        "created_at": "2026-06-23T11:00:00Z"
      }
    ],
    "attachments": [
      {
        "id": "aa1e8400-e29b-41d4-a716-446655440001",
        "url": "/files/.../factura.pdf",
        "filename": "factura-vigilancia-junio.pdf",
        "size": 184320
      }
    ],
    "payment": null,
    "voided_at": null,
    "created_at": "2026-06-23T10:00:00Z",
    "updated_at": "2026-06-23T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PAYABLE_NOT_FOUND",
    "message": "Cuenta por pagar no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Incluye el historial completo de aprobaciones (`approvals`) y los soportes (`attachments`)
  - Incluye el registro de pago (`payment`) si la cuenta fue pagada
- **Side effects:** ninguno — lectura pura

---

## §21.4 Editar cuenta por pagar

```
PATCH /api/v1/payables/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "concept": "Vigilancia junio 2026 (ajuste)",
  "amount": 4600000,
  "due_at": "2026-07-05T23:59:59Z",
  "category_budget_line_id": "880e8400-e29b-41d4-a716-446655440011"
}
```

> [!note]
> Solo se puede editar una cuenta en estado `pending`. Una vez aprobada, rechazada, pagada o anulada, no es editable.

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "concept": "Vigilancia junio 2026 (ajuste)",
    "amount": 4600000,
    "due_at": "2026-07-05T23:59:59Z",
    "status": "pending",
    "category_budget_line_id": "880e8400-e29b-41d4-a716-446655440011",
    "updated_at": "2026-06-23T11:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PAYABLE_NOT_PENDING",
    "message": "Solo se puede editar una cuenta pendiente",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, cuenta en estado `pending`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - `provider_id` no es editable; si se equivoca el proveedor, anular (§21.8) y recrear
  - `amount` debe seguir siendo mayor que 0
- **Side effects:** actualiza registro en `payables`

---

## §21.5 Aprobar cuenta por pagar

```
POST /api/v1/payables/{id}/approve
```

**Request:**
```json
{
  "comment": "Factura verificada contra contrato de servicios"
}
```

> [!note]
> `comment` es **opcional**. La aprobación registra el actor (`user_id` del JWT) y el timestamp.

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "approved",
    "approved_by": { "id": "660e8400-e29b-41d4-a716-446655440000", "name": "Admin Urbania" },
    "approved_at": "2026-06-23T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PAYABLE_NOT_PENDING",
    "message": "La cuenta ya fue procesada y no se puede aprobar",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, cuenta en estado `pending`
- **Reglas de negocio:**
  - Solo se puede aprobar una cuenta `pending` — si está `approved`, `rejected`, `paid` o `void`, retorna `PAYABLE_NOT_PENDING`
  - La aprobación es un registro inmutable en `payable_approvals` con `action = approved`
- **Side effects:**
  - Actualiza `status = approved` en `payables`
  - Crea registro en `payable_approvals`

---

## §21.6 Rechazar cuenta por pagar

```
POST /api/v1/payables/{id}/reject
```

**Request:**
```json
{
  "reason": "Factura no coincide con el contrato vigente"
}
```

> [!note]
> `reason` es **obligatorio** para dejar trazabilidad del motivo de rechazo.

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "rejected",
    "rejected_by": { "id": "660e8400-e29b-41d4-a716-446655440000", "name": "Admin Urbania" },
    "reason": "Factura no coincide con el contrato vigente",
    "rejected_at": "2026-06-23T11:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PAYABLE_NOT_PENDING",
    "message": "La cuenta ya fue procesada y no se puede rechazar",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, cuenta en estado `pending`
- **Reglas de negocio:**
  - Solo se puede rechazar una cuenta `pending` — cualquier otro estado retorna `PAYABLE_NOT_PENDING`
  - `reason` obligatorio (no vacío)
  - El rechazo es un registro inmutable en `payable_approvals` con `action = rejected`
- **Side effects:**
  - Actualiza `status = rejected` en `payables`
  - Crea registro en `payable_approvals`

---

## §21.7 Registrar pago de cuenta por pagar

```
POST /api/v1/payables/{id}/payment
```

**Request:**
```json
{
  "paid_at": "2026-07-01T14:30:00Z",
  "method": "transfer",
  "reference": "TRF-2026-000456",
  "amount_paid": 4500000
}
```

> [!note] Métodos de pago
> `method` = `transfer` | `check` | `cash`. `reference` es el comprobante bancario/cheque.

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "paid",
    "payment": {
      "paid_at": "2026-07-01T14:30:00Z",
      "method": "transfer",
      "reference": "TRF-2026-000456",
      "amount_paid": 4500000,
      "registered_by": { "id": "660e8400-e29b-41d4-a716-446655440000", "name": "Admin Urbania" }
    }
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PAYABLE_NOT_APPROVED",
    "message": "No se puede pagar una cuenta pendiente o rechazada",
    "trace_id": "..."
  }
}
```

**Response `409` (ya pagada):**
```json
{
  "error": {
    "code": "PAYABLE_ALREADY_PAID",
    "message": "La cuenta ya fue pagada",
    "trace_id": "..."
  }
}
```

**Response `422` (monto divergente):**
```json
{
  "error": {
    "code": "AMOUNT_MISMATCH",
    "message": "El monto pagado no coincide con el monto de la cuenta",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, cuenta en estado `approved`
- **Reglas de negocio:**
  - Solo se puede pagar una cuenta `approved` — si está `pending` o `rejected`, retorna `PAYABLE_NOT_APPROVED`; si ya está `paid`, retorna `PAYABLE_ALREADY_PAID`; si está `void`, retorna `PAYABLE_VOIDED`
  - `amount_paid` debe ser exactamente igual a `payables.amount` — si difiere, retorna `AMOUNT_MISMATCH`
  - `paid_at` no puede ser posterior a `NOW()`
  - `reference` es obligatorio para `transfer` y `check`; opcional para `cash`
- **Side effects:**
  - Actualiza `status = paid` en `payables`
  - Crea registro en `payable_payments`
  - **Ejecución presupuestaria:** si la cuenta tiene `category_budget_line_id`, incrementa el monto ejecutado de esa línea — ver [[endpoints/PRESUPUESTO]]
  - > [!warning] `BUDGET_LINE_EXCEEDED` es **no bloqueante** (warning-only): si el pago excede el monto presupuestado de la categoría, el pago se registra igual pero se retorna un warning en `meta.warnings` y se emite una alerta al admin. No se bloquea el pago.

---

## §21.8 Anular cuenta por pagar

```
POST /api/v1/payables/{id}/void
```

**Request:**
```json
{
  "reason": "Factura duplicada, registrada por error"
}
```

> [!note]
> `reason` es **obligatorio**. La anulación deja la cuenta en estado `void` y no se puede operar más sobre ella.

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "void",
    "voided_by": { "id": "660e8400-e29b-41d4-a716-446655440000", "name": "Admin Urbania" },
    "reason": "Factura duplicada, registrada por error",
    "voided_at": "2026-06-23T12:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PAYABLE_ALREADY_PAID",
    "message": "No se puede anular una cuenta ya pagada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, cuenta no esté `paid` ni `void`
- **Reglas de negocio:**
  - No se puede anular una cuenta `paid` (retorna `PAYABLE_ALREADY_PAID`)
  - No se puede anular una cuenta ya `void` (retorna `PAYABLE_VOIDED`)
  - `reason` obligatorio
- **Side effects:**
  - Actualiza `status = void` y `voided_at` en `payables`
  - Si la cuenta estaba `approved`, no revierte ejecución presupuestaria (no se había pagado aún)

---

## §21.9 Resumen del dashboard

```
GET /api/v1/payables/summary
```

> [!note] Uso
> Endpoint para el dashboard de Cuentas por pagar. Agregados por estado del mes actual.

**Response `200`:**
```json
{
  "data": {
    "period": "2026-06",
    "pending": {
      "count": 8,
      "total_amount": 12500000
    },
    "approved_to_pay": {
      "count": 3,
      "total_amount": 7200000
    },
    "overdue": {
      "count": 2,
      "total_amount": 3800000
    },
    "paid_this_month": {
      "count": 15,
      "total_amount": 28500000
    }
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `pending`: cuentas en `status = pending` (independiente del mes)
  - `approved_to_pay`: cuentas en `status = approved` pendientes de pago
  - `overdue`: cuentas con `due_at < NOW()` y `status IN (pending, approved)`
  - `paid_this_month`: cuentas con `payment.paid_at` dentro del mes en curso
  - `period` = `YYYY-MM` del mes actual
- **Side effects:** ninguno — lectura pura

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec Web: [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]]
- Panorama global: [[00-shared/features/CUENTAS-PAGAR]]
- Módulo relacionado: [[endpoints/PRESUPUESTO]] (ejecución presupuestaria al pagar)
- Módulo relacionado: [[endpoints/PROVEEDORES]] (datos del proveedor referenciado)
