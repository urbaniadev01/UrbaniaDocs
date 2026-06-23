---
type: reference
status: active
module: informes
scope: api
tags: [api, endpoints, informes]
updated: 2026-06-23
---

# Endpoints: Informes financieros y asamblea

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Informes.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Solo Web; N/A en App
> La generación y descarga de informes es una tarea administrativa. Este feature se consume únicamente desde Web; no aplica en App.

> [!note] Naturaleza del módulo
> Feature de lectura — todos los endpoints son `GET`. No posee datos propios: consolida en tiempo real desde `payables`, `payments`, `fees`, `arrears`, `properties` y `audit_log`. El esquema de esas tablas se documenta en sus módulos dueños; aquí no se documentan tablas.

> [!note] Exportación
> Todos los endpoints soportan `?format=pdf|csv|xlsx`. Si `format` se omite o es `json`, la respuesta es el payload JSON estructurado con `data` + `meta`. Si `format` es `pdf`/`csv`/`xlsx`, la respuesta es **binaria** con `Content-Type` adecuado (`application/pdf`, `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` respectivamente), `Content-Disposition: attachment; filename="<report>-<period>.<ext>"` y el `trace_id` se retorna en header `X-Trace-Id`. Los códigos de error siguen el mismo formato JSON descrito en [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 22.1 | GET | `/reports/financial-monthly` | Sí | admin | Diseñado |
| 22.2 | GET | `/reports/debtors` | Sí | admin | Diseñado |
| 22.3 | GET | `/reports/assembly` | Sí | admin | Diseñado |
| 22.4 | GET | `/reports/payments-summary` | Sí | admin, user* | Diseñado |
| 22.5 | GET | `/reports/occupancy` | Sí | admin | Diseñado |
| 22.6 | GET | `/reports/auditing-log` | Sí | admin | Diseñado |
| 22.7 | GET | `/reports/{report_id}/download` | Sí | admin | Diseñado |

> `*` En §22.4 un residente (`role = user`) puede consultar únicamente sus recibos propios del período — el `user_id` del JWT restringe el alcance; cualquier intento de ver sin filtrar retorna `403 FORBIDDEN`.

---

## §22.1 Informe financiero mensual

```
GET /api/v1/reports/financial-monthly
```

Estado de cuenta consolidado del mes: ingresos, egresos y saldo. Compara lo ejecutado contra el presupuesto.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `year` | integer | Obligatorio. Año del período (ej: `2026`) |
| `month` | integer | Obligatorio. Mes `1`–`12` |
| `format` | string | `json` (default), `pdf`, `csv`, `xlsx` |

**Response `200`:**
```json
{
  "data": {
    "period": { "year": 2026, "month": 6 },
    "income": {
      "fees_collected": 28500000,
      "other_income":    1200000,
      "total":           29700000
    },
    "expenses": {
      "payables_paid":   19400000,
      "other_expenses":   850000,
      "total":          20250000
    },
    "balance": 9450000,
    "budget_comparison": {
      "budgeted_income":   30000000,
      "budgeted_expenses": 20000000,
      "income_variance":    300000,
      "expenses_variance": 250000
    }
  },
  "meta": {
    "trace_id": "...",
    "generated_at": "2026-06-23T10:00:00Z",
    "period": { "from": "2026-06-01", "to": "2026-06-30" }
  }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "REPORT_NOT_AVAILABLE",
    "message": "No hay datos para el período solicitado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `year` y `month` son obligatorios; `month` fuera de `1`–`12` retorna `422`
  - Si no existen movimientos (`payments`/`payables`) en el período, retorna `404 REPORT_NOT_AVAILABLE`
  - `budget_comparison` se llena desde [[endpoints/PRESUPUESTO]]; si no hay presupuesto definido, los campos de presupuesto van `null`
- **Side effects:** ninguno — lectura pura

---

## §22.2 Informe de deudores

```
GET /api/v1/reports/debtors
```

Deudores con saldo, días vencidos y acciones de cobro registradas.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `as_of_date` | date ISO 8601 | Opcional. Fecha de corte (default: fecha actual) |
| `format` | string | `json` (default), `pdf`, `csv`, `xlsx` |

**Response `200`:**
```json
{
  "data": {
    "as_of_date": "2026-06-23",
    "summary": {
      "total_debtors": 12,
      "total_debt":   8450000,
      "average_days_overdue": 47
    },
    "debtors": [
      {
        "resident_id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Juan Perez",
        "unit": { "number": "101", "tower": "A" },
        "total_debt": 720000,
        "days_overdue": 95,
        "arrears_breakdown": [
          { "concept": "Cuota ordinaria", "amount": 420000, "days_overdue": 95 },
          { "concept": "Intereses",       "amount": 300000, "days_overdue": 95 }
        ],
        "collection_actions": [
          { "type": "call", "at": "2026-06-10", "result": "promesa_pago" }
        ]
      }
    ]
  },
  "meta": {
    "trace_id": "...",
    "generated_at": "2026-06-23T10:00:00Z",
    "period": { "as_of": "2026-06-23" }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Solo se incluyen residentes con saldo en `arrears` > 0 a la fecha de corte
  - `days_overdue` se calcula por cada ítem de `arrears` y se promedia/suma a nivel residente según la vista del informe
  - Origen de datos: [[endpoints/MORA]] y [[endpoints/CUOTAS]]
- **Side effects:** ninguno — lectura pura

---

## §22.3 Informe de rendición de cuentas (asamblea)

```
GET /api/v1/reports/assembly
```

Rendición de cuentas anual para asamblea: presupuesto ejecutado, deudores y logros de comunicación agregados.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `year` | integer | Obligatorio. Año de la rendición (ej: `2026`) |
| `format` | string | `json` (default), `pdf`, `csv`, `xlsx` |

**Response `200`:**
```json
{
  "data": {
    "year": 2026,
    "financial_execution": {
      "budgeted_income":    360000000,
      "actual_income":      352000000,
      "budgeted_expenses":  240000000,
      "actual_expenses":    248500000,
      "executed_pct":       0.97
    },
    "debtors_summary": {
      "total_debtors": 9,
      "total_debt":   6300000,
      "vs_previous_year": -0.18
    },
    "communication_log": {
      "comunicados_sent": 24,
      "pqrs_open": 18,
      "pqrs_closed": 142,
      "assemblies_held": 2
    }
  },
  "meta": {
    "trace_id": "...",
    "generated_at": "2026-06-23T10:00:00Z",
    "period": { "from": "2026-01-01", "to": "2026-12-31" }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Cubre el año calendario completo (`from = YYYY-01-01`, `to = YYYY-12-31`)
  - `communication_log` agrega datos de [[endpoints/COMUNICADOS]], [[endpoints/PQRS]] y [[endpoints/ASAMBLEAS]]
  - Si `year` es futuro o anterior al primer movimiento en el sistema, retorna `404 REPORT_NOT_AVAILABLE`
- **Side effects:** ninguno — lectura pura

---

## §22.4 Resumen de pagos

```
GET /api/v1/reports/payments-summary
```

Resumen de pagos hechos ([[endpoints/CUENTAS-PAGAR]]) y recibidos ([[endpoints/PAGOS]]) en un rango, agrupados por dimensión configurable.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `from` | date ISO 8601 | Obligatorio. Fecha inicial (inclusive) |
| `to` | date ISO 8601 | Obligatorio. Fecha final (inclusive) |
| `group_by` | string | `day`, `week`, `month`, `provider_category` |
| `format` | string | `json` (default), `pdf`, `csv`, `xlsx` |

**Response `200`:**
```json
{
  "data": {
    "received": [
      { "bucket": "2026-06", "amount": 29700000, "count": 142 }
    ],
    "paid": [
      { "bucket": "2026-06", "amount": 20250000, "count": 38 }
    ],
    "net": 9450000
  },
  "meta": {
    "trace_id": "...",
    "generated_at": "2026-06-23T10:00:00Z",
    "period": { "from": "2026-06-01", "to": "2026-06-30" }
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "El rango no puede superar 2 años",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `from` y `to` obligatorios; `from > to` retorna `422 INVALID_DATE_RANGE`
  - Rango superior a 2 años retorna `422 INVALID_DATE_RANGE`
  - `group_by` debe ser uno de los valores permitidos; cualquier otro retorna `422`
  - `role = admin`: ve todo el conjunto. `role = user`: alcance restringido a sus propios recibos del período (`user_id` del JWT); ver nota `*` en la tabla de endpoints
  - `provider_category` solo aplica a `paid`; para `received` se ignora y se agrupa por `month`
- **Side effects:** ninguno — lectura pura

---

## §22.5 Informe de ocupación

```
GET /api/v1/reports/occupancy
```

Estado de ocupación de las unidades con resumen agregado.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `as_of_date` | date ISO 8601 | Opcional. Fecha de corte (default: fecha actual) |
| `format` | string | `json` (default), `pdf`, `csv`, `xlsx` |

**Response `200`:**
```json
{
  "data": {
    "as_of_date": "2026-06-23",
    "summary": {
      "total_units": 120,
      "occupied":    108,
      "vacant":         9,
      "for_sale":       3,
      "occupancy_rate": 0.90
    },
    "units": [
      { "number": "101", "tower": "A", "status": "occupied", "resident": "Juan Perez" },
      { "number": "204", "tower": "B", "status": "vacant",   "resident": null }
    ]
  },
  "meta": {
    "trace_id": "...",
    "generated_at": "2026-06-23T10:00:00Z",
    "period": { "as_of": "2026-06-23" }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Cálculo sobre `properties`; el `status` de cada unidad se determina a la fecha de corte
  - Origen: [[endpoints/PROPIEDADES]]
- **Side effects:** ninguno — lectura pura

---

## §22.6 Log de auditoría

```
GET /api/v1/reports/auditing-log
```

Log de auditoría del sistema filtrable por rango, usuario y tipo de acción.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `from` | date ISO 8601 | Obligatorio. Fecha inicial (inclusive) |
| `to` | date ISO 8601 | Obligatorio. Fecha final (inclusive) |
| `user_id` | uuid | Opcional. Filtra por usuario |
| `action_type` | string | Opcional. Filtra por tipo de acción (`login`, `pago_registrado`, `cuota_actualizada`, `pqrs_resuelta`, etc.) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 50, max: 200) |
| `format` | string | `json` (default), `pdf`, `csv`, `xlsx` |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "user_name": "Admin Urbania",
      "action_type": "pago_registrado",
      "resource": "payments/990e8400-e29b-41d4-a716-446655440099",
      "ip": "190.0.0.1",
      "at": "2026-06-23T10:14:22Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 50,
      "total": 318,
      "total_pages": 7
    },
    "period": { "from": "2026-06-01", "to": "2026-06-23" }
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "El rango no puede superar 2 años",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `from` y `to` obligatorios; `from > to` retorna `422 INVALID_DATE_RANGE`
  - Rango superior a 2 años retorna `422 INVALID_DATE_RANGE`
  - Lectura desde `audit_log`; no se eliminan ni modifican entradas
  - La exportación (`format != json`) ignora la paginación y exporta el rango completo (sujeto a límites internos del sistema)
- **Side effects:** ninguno — lectura pura

---

## §22.7 Descargar informe generado

```
GET /api/v1/reports/{report_id}/download
```

Descarga el archivo binario de un informe previamente generado. Requiere `access_token` de la sesión que originó el informe.

**Path params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `report_id` | uuid | Identificador del informe generado |

**Response `200`:** respuesta binaria
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="financial-monthly-2026-06.pdf"
X-Trace-Id: <trace_id>
```

**Response `404`:**
```json
{
  "error": {
    "code": "REPORT_NOT_AVAILABLE",
    "message": "El informe no existe o expiró",
    "trace_id": "..."
  }
}
```

**Response `500`:**
```json
{
  "error": {
    "code": "REPORT_GENERATION_FAILED",
    "message": "No se pudo generar el archivo del informe",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`; `report_id` debe pertenecer a la sesión activa
- **Reglas de negocio:**
  - El `report_id` se obtiene como cabecera de cualquier informe §22.1–§22.6 cuando se solicitó con `format != json`, o directo vía `Content-Disposition` al generar
  - Un `report_id` ajeno o vencido (TTL configurable, default 24h) retorna `404 REPORT_NOT_AVAILABLE`
  - Si el archivo se regenera bajo demanda y el motor falla, retorna `500 REPORT_GENERATION_FAILED`
- **Side effects:** ninguno — lectura pura; respeta el TTL de cache del archivo

---

## Códigos de error del módulo

| Code | HTTP | Descripción |
|------|------|-------------|
| `REPORT_NOT_AVAILABLE` | 404 | Período sin datos o informe inexistente/expirado |
| `REPORT_GENERATION_FAILED` | 500 | Falló la generación del archivo binario |
| `INVALID_DATE_RANGE` | 422 | `from > to` o rango > 2 años |
| `EXPORT_FORMAT_NOT_SUPPORTED` | 422 | `format` no está en `pdf\|csv\|xlsx\|json` |

> Formato de error: `{"error":{"code":"...","message":"...","trace_id":"..."}}`.

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/informes/INFORMES_SPEC]]
- Panorama global: [[00-shared/features/INFORMES]]
- Módulos fuente (solo lectura): [[endpoints/PRESUPUESTO]], [[endpoints/MORA]], [[endpoints/CUOTAS]], [[endpoints/CUENTAS-PAGAR]], [[endpoints/PAGOS]], [[endpoints/PROPIEDADES]], [[endpoints/COMUNICADOS]], [[endpoints/PQRS]], [[endpoints/ASAMBLEAS]]