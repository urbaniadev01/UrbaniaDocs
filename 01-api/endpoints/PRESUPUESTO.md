---
type: reference
status: active
module: presupuesto
scope: api
tags: [api, endpoints, presupuesto]
updated: 2026-06-23
---

# Endpoints: Presupuesto y fondo de reserva

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Presupuesto y fondo de reserva.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Función administrativa de planificación y seguimiento financiero del conjunto.
> Gestiona el presupuesto anual (ingresos y egresos por categoría) y el fondo de
> reserva (aportes y retiros). Es un feature solo Web — todos los endpoints
> requieren `role = admin`. La ejecución real se alimenta automáticamente de
> PAGOS (ingresos) y CUENTAS-PAGAR (egresos); este módulo solo expone lectura
> de ejecución y mantenimiento del plan presupuestal y del fondo de reserva.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 10.1 | GET | `/budgets` | Sí | admin | Diseñado |
| 10.2 | POST | `/budgets` | Sí | admin | Diseñado |
| 10.3 | GET | `/budgets/{id}` | Sí | admin | Diseñado |
| 10.4 | PATCH | `/budgets/{id}` | Sí | admin | Diseñado |
| 10.5 | GET | `/budgets/{id}/lines` | Sí | admin | Diseñado |
| 10.6 | POST | `/budgets/{id}/lines` | Sí | admin | Diseñado |
| 10.7 | PATCH | `/budgets/{id}/lines/{line_id}` | Sí | admin | Diseñado |
| 10.8 | DELETE | `/budgets/{id}/lines/{line_id}` | Sí | admin | Diseñado |
| 10.9 | GET | `/budgets/{id}/execution` | Sí | admin | Diseñado |
| 10.10 | GET | `/reserve-fund` | Sí | admin | Diseñado |
| 10.11 | POST | `/reserve-fund/transactions` | Sí | admin | Diseñado |
| 10.12 | GET | `/reserve-fund/transactions` | Sí | admin | Diseñado |

---

## §10.1 Listar presupuestos

```
GET /api/v1/budgets
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `year` | integer | Filtrar por año (ej: `2026`). Si se omite, lista todos los años |
| `status` | string | `borrador`, `aprobado`, `en_ejecucion`, `cerrado` |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "year": 2026,
      "status": "en_ejecucion",
      "total_income": 480000000,
      "total_expense": 456000000,
      "balance": 24000000,
      "approved_at": "2026-01-15T20:00:00Z",
      "created_at": "2026-01-05T10:00:00Z",
      "updated_at": "2026-06-01T10:00:00Z"
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
  - Orden descendente por `year`
  - Los totales (`total_income`, `total_expense`, `balance`) son agregados de las líneas del presupuesto, no se almacenan denormalizados
- **Side effects:** ninguno — lectura pura

---

## §10.2 Crear presupuesto anual

```
POST /api/v1/budgets
```

**Request:**
```json
{
  "year": 2027,
  "notes": "Presupuesto aprobado en asamblea del 2026-12-10"
}
```

> [!note]
> El presupuesto se crea en estado `borrador` y sin líneas. Las líneas se agregan
> con §10.6. El cambio a `aprobado` y `en_ejecucion` se realiza con §10.4.

**Response `201`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440099",
    "year": 2027,
    "status": "borrador",
    "total_income": 0,
    "total_expense": 0,
    "balance": 0,
    "notes": "Presupuesto aprobado en asamblea del 2026-12-10",
    "approved_at": null,
    "created_at": "2026-12-15T10:00:00Z",
    "updated_at": "2026-12-15T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "BUDGET_ALREADY_EXISTS",
    "message": "Ya existe un presupuesto para el año 2027",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo year es obligatorio y debe ser un entero de 4 dígitos",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo un presupuesto por `year` — único por año en `budgets`
  - `year` debe ser entero de 4 dígitos y no anterior al año en curso
  - Estado inicial siempre `borrador`; `approved_at` inicia en `null`
- **Side effects:** crea fila en `budgets`

---

## §10.3 Ver presupuesto con sus líneas

```
GET /api/v1/budgets/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "year": 2026,
    "status": "en_ejecucion",
    "total_income": 480000000,
    "total_expense": 456000000,
    "balance": 24000000,
    "notes": "Presupuesto aprobado en asamblea del 2025-12-15",
    "approved_at": "2026-01-15T20:00:00Z",
    "lines": [
      {
        "id": "771e8400-e29b-41d4-a716-446655440001",
        "kind": "income",
        "category_id": "772e8400-e29b-41d4-a716-446655440001",
        "category_name": "Cuotas de administración",
        "amount_projected": 420000000,
        "amount_executed": 215000000,
        "execution_percentage": 51.19
      },
      {
        "id": "771e8400-e29b-41d4-a716-446655440099",
        "kind": "expense",
        "category_id": "772e8400-e29b-41d4-a716-446655440099",
        "category_name": "Servicios públicos",
        "amount_projected": 60000000,
        "amount_executed": 31200000,
        "execution_percentage": 52.00
      }
    ],
    "created_at": "2026-01-05T10:00:00Z",
    "updated_at": "2026-06-01T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_NOT_FOUND",
    "message": "Presupuesto no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Incluye todas las líneas (`budget_lines`) ordenadas por `kind` (`income` primero) y luego por `category_name`
  - `amount_executed` y `execution_percentage` se calculan agregando movimientos reales asociados a la categoría (ver §10.9)
- **Side effects:** ninguno — lectura pura

---

## §10.4 Editar presupuesto

```
PATCH /api/v1/budgets/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "status": "aprobado",
  "notes": "Aprobado en asamblea extraordinaria del 2026-01-20"
}
```

> [!note] Transiciones válidas de `status`
> `borrador` → `aprobado` | `aprobado` → `en_ejecucion` | `en_ejecucion` → `cerrado`
> Las transiciones inversas no están permitidas. Un presupuesto `cerrado` no es
> editable — cualquier intento retorna `409 BUDGET_LOCKED`.

**Response `200`:**
```json
{
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "year": 2026,
    "status": "aprobado",
    "notes": "Aprobado en asamblea extraordinaria del 2026-01-20",
    "approved_at": "2026-01-20T21:00:00Z",
    "updated_at": "2026-01-20T21:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_NOT_FOUND",
    "message": "Presupuesto no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "BUDGET_LOCKED",
    "message": "El presupuesto está cerrado y no se puede editar",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Solo se permite cambiar `status` siguiendo las transiciones válidas; transición inválida retorna `409 BUDGET_LOCKED`
  - Al pasar a `aprobado` por primera vez, `approved_at` se fija a `NOW()` y no se vuelve a modificar
  - Un presupuesto `cerrado` bloquea también la edición de líneas (§10.6-§10.8)
- **Side effects:** actualiza registro en `budgets`

---

## §10.5 Listar líneas del presupuesto

```
GET /api/v1/budgets/{id}/lines
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `kind` | string | `income` o `expense` |
| `category_id` | uuid | Filtrar por categoría |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 50, max: 200) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "771e8400-e29b-41d4-a716-446655440001",
      "kind": "income",
      "category_id": "772e8400-e29b-41d4-a716-446655440001",
      "category_name": "Cuotas de administración",
      "amount_projected": 420000000,
      "amount_executed": 215000000,
      "execution_percentage": 51.19,
      "created_at": "2026-01-05T10:00:00Z",
      "updated_at": "2026-06-01T10:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 50,
      "total": 18,
      "total_pages": 1
    }
  }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_NOT_FOUND",
    "message": "Presupuesto no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Orden: `kind` (`income` primero), luego `category_name`
  - Una sola categoría no puede aparecer dos veces con el mismo `kind` dentro del mismo presupuesto
- **Side effects:** ninguno — lectura pura

---

## §10.6 Agregar línea de presupuesto

```
POST /api/v1/budgets/{id}/lines
```

**Request:**
```json
{
  "kind": "expense",
  "category_id": "772e8400-e29b-41d4-a716-446655440099",
  "amount_projected": 60000000
}
```

> [!note]
> `kind` = `income` (ingreso) | `expense` (egreso). La categoría referenciada
> debe existir en `budget_categories` y corresponder al mismo `kind`.

**Response `201`:**
```json
{
  "data": {
    "id": "771e8400-e29b-41d4-a716-446655440101",
    "kind": "expense",
    "category_id": "772e8400-e29b-41d4-a716-446655440099",
    "category_name": "Servicios públicos",
    "amount_projected": 60000000,
    "amount_executed": 0,
    "execution_percentage": 0,
    "created_at": "2026-01-05T10:30:00Z",
    "updated_at": "2026-01-05T10:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_NOT_FOUND",
    "message": "Presupuesto no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "BUDGET_LOCKED",
    "message": "El presupuesto está aprobado o cerrado, no se pueden agregar líneas",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "amount_projected debe ser un número positivo",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El presupuesto debe estar en estado `borrador` — si está `aprobado`, `en_ejecucion` o `cerrado`, retorna `409 BUDGET_LOCKED`
  - `amount_projected` debe ser un entero positivo (centavos implícitos si la moneda lo requiere — ver [[API_DATABASE]])
  - No puede existir otra línea con el mismo `kind` + `category_id` en el mismo presupuesto (upsert alternativo: usar PATCH en lugar de duplicar)
  - El `kind` de la línea debe coincidir con el `kind` de la categoría referenciada
- **Side effects:** crea fila en `budget_lines`

---

## §10.7 Editar línea de presupuesto

```
PATCH /api/v1/budgets/{id}/lines/{line_id}
```

**Request:** (todos los campos opcionales)
```json
{
  "amount_projected": 63000000
}
```

> [!note]
> `kind` y `category_id` no son editables — para recategorizar, eliminar la
> línea (§10.8) y crear una nueva (§10.6).

**Response `200`:**
```json
{
  "data": {
    "id": "771e8400-e29b-41d4-a716-446655440099",
    "kind": "expense",
    "category_id": "772e8400-e29b-41d4-a716-446655440099",
    "category_name": "Servicios públicos",
    "amount_projected": 63000000,
    "amount_executed": 31200000,
    "execution_percentage": 49.52,
    "updated_at": "2026-06-01T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_LINE_NOT_FOUND",
    "message": "Línea de presupuesto no encontrada",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "BUDGET_LOCKED",
    "message": "El presupuesto está cerrado, no se pueden editar líneas",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El presupuesto debe estar en `borrador` o `aprobado` — si está `cerrado`, retorna `409 BUDGET_LOCKED`
  - Si está `aprobado` o `en_ejecucion`, editar `amount_projected` se interpreta como ajuste del consejo (queda registrado en auditoría del presupuesto)
  - PATCH parcial — solo se actualizan los campos enviados
- **Side effects:** actualiza registro en `budget_lines`

---

## §10.8 Eliminar línea de presupuesto

```
DELETE /api/v1/budgets/{id}/lines/{line_id}
```

**Response `204`:** (No Content)

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_LINE_NOT_FOUND",
    "message": "Línea de presupuesto no encontrada",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "BUDGET_LOCKED",
    "message": "El presupuesto está aprobado o cerrado, no se pueden eliminar líneas",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo se permite eliminar líneas si el presupuesto está en `borrador`
  - Si la línea tiene movimientos reales asociados (ejecución > 0), no se puede eliminar — debe anularse el movimiento de origen
- **Side effects:** elimina (soft delete) la fila en `budget_lines`

---

## §10.9 Ver ejecución real vs proyectado

```
GET /api/v1/budgets/{id}/execution
```

> [!note] Uso
> Alimenta el drawer "Detalle de categoría" del Web (ver
> [[02-web/features/presupuesto/PRESUPUESTO_UI_detalle-categoria]]).
> Retorna, por categoría, monto proyectado, monto ejecutado real (agregado desde
> PAGOS y CUENTAS-PAGAR) y variación. Soporta agrupar por `month` para el
> gráfico de ejecución mes a mes.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `kind` | string | `income` o `expense` (default: ambos) |
| `group_by` | string | `category` (default) o `month` (agrupación mensual por categoría) |
| `from` | date ISO 8601 | Fecha inicial (inclusive) para filtrar movimientos reales |
| `to` | date ISO 8601 | Fecha final (inclusive) para filtrar movimientos reales |

**Response `200`:**
```json
{
  "data": {
    "budget_id": "770e8400-e29b-41d4-a716-446655440001",
    "year": 2026,
    "total_projected_income": 480000000,
    "total_executed_income": 245000000,
    "total_projected_expense": 456000000,
    "total_executed_expense": 218000000,
    "categories": [
      {
        "category_id": "772e8400-e29b-41d4-a716-446655440001",
        "category_name": "Cuotas de administración",
        "kind": "income",
        "amount_projected": 420000000,
        "amount_executed": 215000000,
        "variance": -205000000,
        "execution_percentage": 51.19,
        "movements": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440099",
            "date": "2026-02-05",
            "description": "Cuota Febrero - Apto 101",
            "amount": 350000,
            "source": "PAGOS"
          }
        ]
      }
    ]
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "BUDGET_NOT_FOUND",
    "message": "Presupuesto no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La ejecución se calcula en tiempo real agregando movimientos reales:
    - **Ingresos:** pagos recibidos en `payments` (ver [[endpoints/PAGOS]]) asociados a la categoría
    - **Egresos:** facturas pagadas en `accounts_payable` (ver [[00-shared/features/CUENTAS-PAGAR]]) asociadas a la categoría
  - `variance = amount_executed - amount_projected` (negativo = bajo lo proyectado en ingresos, sobre lo proyectado en egresos)
  - Con `group_by=month`, cada categoría incluye un array `months` con 12 entradas (enero-diciembre) con `amount_projected` y `amount_executed`
  - `source` en cada movimiento indica el feature de origen (`PAGOS` o `CUENTAS-PAGAR`)
- **Side effects:** ninguno — lectura pura (agregación de solo lectura sobre `payments` y `accounts_payable`)

---

## §10.10 Ver saldo del fondo de reserva

```
GET /api/v1/reserve-fund
```

> [!note] Singleton
> El fondo de reserva es un recurso singleton del conjunto (un único registro en
> `reserve_fund`). No requiere `{id}` en la ruta. Incluye últimos 5 movimientos
> para alimentar la sección inline del Web (ver
> [[02-web/features/presupuesto/PRESUPUESTO_UI_fondo-reserva]]).

**Response `200`:**
```json
{
  "data": {
    "id": "773e8400-e29b-41d4-a716-446655440001",
    "balance": 125000000,
    "target_percentage": 10,
    "annual_budget_total": 480000000,
    "target_amount": 48000000,
    "compliance_percentage": 260.42,
    "last_transactions": [
      {
        "id": "774e8400-e29b-41d4-a716-446655440001",
        "type": "contribution",
        "amount": 5000000,
        "description": "Aporte mensual mayo",
        "transaction_date": "2026-05-31",
        "created_at": "2026-05-31T10:00:00Z"
      }
    ],
    "updated_at": "2026-05-31T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `balance` se calcula como suma de `contribution` menos suma de `withdrawal` en `reserve_fund_transactions`
  - `target_amount = annual_budget_total * target_percentage / 100` (presupuesto anual vigente en `en_ejecucion`)
  - `compliance_percentage = balance / target_amount * 100` (cuánto del mínimo recomendado se ha acumulado)
  - `last_transactions` son los 5 más recientes ordenados por `transaction_date` desc
  - Si no existe ningún presupuesto `en_ejecucion`, `annual_budget_total` y `target_amount` vienen `null` y `compliance_percentage` también
- **Side effects:** ninguno — lectura pura

---

## §10.11 Registrar movimiento del fondo de reserva

```
POST /api/v1/reserve-fund/transactions
```

**Request:**
```json
{
  "type": "withdrawal",
  "amount": 15000000,
  "description": "Retiro para impermeabilización de terraza",
  "transaction_date": "2026-06-15"
}
```

> [!note] Tipos de movimiento
> `type` = `contribution` (aporte al fondo) | `withdrawal` (retiro del fondo).
> Los aportes pueden ser automáticos (porcentaje configurado de cada pago de
> cuota) o manuales; los retiros son siempre manuales y requieren justificación.

**Response `201`:**
```json
{
  "data": {
    "id": "774e8400-e29b-41d4-a716-446655440099",
    "type": "withdrawal",
    "amount": 15000000,
    "description": "Retiro para impermeabilización de terraza",
    "transaction_date": "2026-06-15",
    "resulting_balance": 110000000,
    "created_at": "2026-06-15T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `400`:**
```json
{
  "error": {
    "code": "RESERVE_INSUFFICIENT_FUNDS",
    "message": "Saldo del fondo de reserva insuficiente para este retiro",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo description es obligatorio para retiros",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Para `type = withdrawal`: `amount` debe ser positivo y no superior al `balance` actual — en caso contrario retorna `400 RESERVE_INSUFFICIENT_FUNDS`
  - `description` es obligatorio para retiros (justificación del gasto); opcional para aportes automáticos
  - `transaction_date` debe ser una fecha válida y no futura
  - `resulting_balance` = balance anterior ± amount según tipo
  - Para `type = contribution` proveniente de la liquidación automática de cuotas, el origen ya está registrado en `payments`; este endpoint solo se usa para aportes/retiros manuales
- **Side effects:**
  - Crea fila en `reserve_fund_transactions`
  - El `balance` del fondo se recalcula como suma de transacciones (no se almacena denormalizado)

---

## §10.12 Historial de movimientos del fondo de reserva

```
GET /api/v1/reserve-fund/transactions
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `type` | string | `contribution` o `withdrawal` |
| `from` | date ISO 8601 | Fecha inicial (inclusive) |
| `to` | date ISO 8601 | Fecha final (inclusive) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "774e8400-e29b-41d4-a716-446655440099",
      "type": "withdrawal",
      "amount": 15000000,
      "description": "Retiro para impermeabilización de terraza",
      "transaction_date": "2026-06-15",
      "created_at": "2026-06-15T10:00:00Z"
    },
    {
      "id": "774e8400-e29b-41d4-a716-446655440001",
      "type": "contribution",
      "amount": 5000000,
      "description": "Aporte mensual mayo",
      "transaction_date": "2026-05-31",
      "created_at": "2026-05-31T10:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 28,
      "total_pages": 2
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Orden descendente por `transaction_date` y luego por `created_at`
  - Filtrado por rango `from`/`to` es inclusivo en ambos extremos
- **Side effects:** ninguno — lectura pura

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/presupuesto/PRESUPUESTO_SPEC]]
- Panorama global: [[00-shared/features/PRESUPUESTO]]
- Módulos relacionados: [[endpoints/PAGOS]], [[00-shared/features/CUENTAS-PAGAR]], [[00-shared/features/INFORMES]]