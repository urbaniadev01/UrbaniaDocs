---
type: reference
status: active
module: mora
scope: api
tags: [api, endpoints, mora, financiero]
updated: 2026-06-23
---

# Endpoints: Mora y Cartera Vencida

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Mora.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 6.1 | GET | `/arrears` | Sí | admin | Diseñado |
| 6.2 | GET | `/arrears/unit/{unit_id}` | Sí | admin, user* | Diseñado |
| 6.3 | POST | `/arrears/agreements` | Sí | admin | Diseñado |
| 6.4 | GET | `/arrears/agreements/{id}` | Sí | admin | Diseñado |
| 6.5 | PATCH | `/arrears/agreements/{id}/status` | Sí | admin | Diseñado |

> `*` Un residente puede consultar el estado de mora de su propia unidad.

---

## §6.1 Listar cartera vencida

```
GET /api/v1/arrears
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `in_arrears`, `agreement_active`, `up_to_date` |
| `min_days` | integer | Días mínimos de mora |
| `tower` | string | Filtrar por torre |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "unit": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "number": "101",
        "tower": "A",
        "resident": "Juan Perez"
      },
      "status": "in_arrears",
      "overdue_fees": 2,
      "overdue_days": 45,
      "fees_balance": 24500,
      "interest_balance": 1837,
      "total_balance": 26337,
      "oldest_overdue_period": "2026-05",
      "has_active_agreement": false
    }
  ],
  "meta": {
    "trace_id": "...",
    "summary": {
      "units_in_arrears": 18,
      "total_arrears": 485000,
      "total_interest": 36375
    },
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 18,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La lista incluye solo unidades con al menos una cuota vencida (`status = overdue`)
  - Los intereses se calculan en tiempo real: `cuota_vencida × tasa_interés_diaria × días_vencidos`
  - La tasa de interés diaria se configura en CONFIGURACION del conjunto
- **Side effects:** ninguno — lectura pura con cálculo en tiempo real

---

## §6.2 Ver mora por unidad

```
GET /api/v1/arrears/unit/{unit_id}
```

**Response `200`:**
```json
{
  "data": {
    "unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A"
    },
    "status": "in_arrears",
    "overdue_fees": [
      {
        "fee_id": "fee-may-001",
        "period": "2026-05",
        "original_amount": 12250,
        "amount_paid": 0,
        "days_overdue": 45,
        "interest_accrued": 918,
        "due_date": "2026-05-15"
      },
      {
        "fee_id": "fee-jun-001",
        "period": "2026-06",
        "original_amount": 12250,
        "amount_paid": 0,
        "days_overdue": 8,
        "interest_accrued": 196,
        "due_date": "2026-06-15"
      }
    ],
    "summary": {
      "fees_balance": 24500,
      "interest_balance": 1114,
      "total_balance": 25614,
      "interest_rate_daily": 0.001,
      "calculated_at": "2026-06-23T10:00:00Z"
    },
    "active_agreement": null
  },
  "meta": { "trace_id": "..." }
}
```

**Response `200` (unidad al día):**
```json
{
  "data": {
    "unit": { "id": "...", "number": "205", "tower": "B" },
    "status": "up_to_date",
    "overdue_fees": [],
    "summary": {
      "fees_balance": 0,
      "interest_balance": 0,
      "total_balance": 0
    },
    "active_agreement": null
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo puede ver la mora de su propia unidad
  - `role = admin`: puede ver cualquier unidad
  - Los intereses se calculan dinámicamente al momento de la consulta
- **Side effects:** ninguno — lectura pura

---

## §6.3 Crear acuerdo de pago

```
POST /api/v1/arrears/agreements
```

**Request:**
```json
{
  "unit_id": "550e8400-e29b-41d4-a716-446655440000",
  "installments": [
    { "due_date": "2026-07-15", "amount": 12807 },
    { "due_date": "2026-08-15", "amount": 12807 }
  ],
  "freeze_interest": true,
  "notes": "Acuerdo aprobado en comité - residente notificado"
}
```

> [!note]
> La suma de `installments.amount` debe cubrir el `total_balance` actual de la unidad.

**Response `201`:**
```json
{
  "data": {
    "id": "agr-001",
    "unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A"
    },
    "total_amount": 25614,
    "installments": [
      {
        "id": "inst-001",
        "due_date": "2026-07-15",
        "amount": 12807,
        "status": "pending"
      },
      {
        "id": "inst-002",
        "due_date": "2026-08-15",
        "amount": 12807,
        "status": "pending"
      }
    ],
    "freeze_interest": true,
    "status": "active",
    "created_by": "admin-uuid",
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, unidad con mora activa
- **Reglas de negocio:**
  - Una unidad solo puede tener un acuerdo activo a la vez — si ya tiene uno, retorna `409 AGREEMENT_ALREADY_ACTIVE`
  - Si `freeze_interest = true`: se suspende el cálculo de nuevos intereses mientras el acuerdo esté vigente y se cumplan las cuotas
  - Si se incumple una cuota del acuerdo (no se paga en la fecha), el acuerdo pasa a `defaulted` y la unidad vuelve a acumular intereses normales
- **Side effects:**
  - Crea registro en `agreements` con sus cuotas
  - Actualiza estado de mora de la unidad a `agreement_active`
  - Emite notificación al residente confirmando el acuerdo

---

## §6.4 Ver detalle de acuerdo

```
GET /api/v1/arrears/agreements/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "agr-001",
    "unit": { "id": "...", "number": "101", "tower": "A" },
    "total_amount": 25614,
    "amount_paid": 12807,
    "amount_pending": 12807,
    "installments": [
      {
        "id": "inst-001",
        "due_date": "2026-07-15",
        "amount": 12807,
        "status": "paid",
        "paid_at": "2026-07-14T09:00:00Z",
        "payment_id": "pay-098"
      },
      {
        "id": "inst-002",
        "due_date": "2026-08-15",
        "amount": 12807,
        "status": "pending",
        "paid_at": null,
        "payment_id": null
      }
    ],
    "freeze_interest": true,
    "status": "active",
    "notes": "Acuerdo aprobado en comité - residente notificado",
    "created_by": "admin-uuid",
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Side effects:** ninguno — lectura pura

---

## §6.5 Cambiar estado del acuerdo

```
PATCH /api/v1/arrears/agreements/{id}/status
```

**Request:**
```json
{
  "status": "cancelled",
  "reason": "Residente solicitó cancelación voluntaria del acuerdo"
}
```

> [!note] Valores válidos de `status`
> `active` → `cancelled` (cancelación manual por admin)
> `active` → `completed` (se completa automáticamente al pagar la última cuota; también puede forzarse manualmente)
> `active` → `defaulted` (incumplimiento — puede activarse manualmente o automáticamente por el sistema)

**Response `200`:**
```json
{
  "data": {
    "id": "agr-001",
    "status": "cancelled",
    "status_updated_at": "2026-06-23T11:00:00Z",
    "reason": "Residente solicitó cancelación voluntaria del acuerdo"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, acuerdo con `status = active`
- **Reglas de negocio:**
  - Al cancelar o marcar como `defaulted`: la unidad vuelve a estado `in_arrears` y se reactiva el cálculo de intereses
  - Al completar: la unidad pasa a `up_to_date` si no hay otras cuotas pendientes
  - `reason` es obligatorio para `cancelled` y `defaulted`
- **Side effects:**
  - Actualiza estado del acuerdo
  - Actualiza estado de mora de la unidad según la transición

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Módulos relacionados: [[endpoints/CUOTAS]], [[endpoints/PAGOS]]
- Spec Web: [[02-web/features/mora/MORA_SPEC]]
- Spec App: [[03-app/features/mora/MORA_SPEC]]
- Panorama global: [[00-shared/features/MORA]]
