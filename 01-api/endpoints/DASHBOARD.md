---
type: reference
status: active
module: dashboard
scope: api
tags: [api, endpoints, dashboard]
updated: 2026-06-23
---

# Endpoints: KPI Dashboard

> [!info] Consultar
> Documento de detalle de los endpoints del módulo KPI Dashboard.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Solo Web; N/A en App. Es un agregador de métricas de solo lectura que consume datos de todos los demás features (PAGOS, CUOTAS, PQRS, VISITANTES, ASAMBLEAS, NOTIFICACIONES, MORA). No genera datos — los consulta y los consolida para el dashboard principal del administrador. Todos los endpoints son `GET`.

> [!warning] Tolerancia a fallos parciales
> Los drill-downs y el endpoint principal son tolerantes a fallos por submódulo: si un submódulo caído no puede alimentar un widget, ese widget retorna `null` y la respuesta global sigue siendo `200`. Solo se retorna `500 INTERNAL_ERROR` si el agregador no puede responder nada. Ver §Diseño de cada endpoint.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 23.1 | GET | `/dashboard` | Sí | admin | Diseñado |
| 23.2 | GET | `/dashboard/collection-rate` | Sí | admin | Diseñado |
| 23.3 | GET | `/dashboard/arrears` | Sí | admin | Diseñado |
| 23.4 | GET | `/dashboard/pqrs-status` | Sí | admin | Diseñado |
| 23.5 | GET | `/dashboard/visitors-today` | Sí | admin | Diseñado |
| 23.6 | GET | `/dashboard/upcoming-meetings` | Sí | admin | Diseñado |

> Todas las rutas llevan el prefijo `/api/v1`. Estado = "Diseñado": contrato definido, pendiente de implementación.

---

## §23.1 Dashboard principal

```
GET /api/v1/dashboard
```

Retorna el payload completo del dashboard del administrador con todos los widgets consolidados en una sola respuesta.

**Response `200`:**
```json
{
  "data": {
    "collection_rate_month": {
      "rate": 0.87,
      "collected": 12500000,
      "expected": 14367820,
      "month": "2026-06"
    },
    "arrears_percentage": 13.4,
    "open_pqrs_count": 7,
    "visitors_today": 12,
    "upcoming_meetings": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "title": "Asamblea ordinaria Q2",
        "scheduled_at": "2026-07-15T19:00:00Z",
        "delta_days": 22
      }
    ],
    "notifications_unread_count": 7
  },
  "meta": { "trace_id": "..." }
}
```

> [!note] Widgets como agregados
> Cada campo de `data` es producido por un submódulo independiente (recaudo, mora, PQRS, visitantes, asambleas, notificaciones). Si un submódulo falla, su campo retorna `null` (no error) y el resto del dashboard se entrega normalmente. El cliente Web debe renderizar un placeholder en el widget caído.

**Response `500`:** (solo si el agregador no puede producir ningún widget)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "No fue posible construir el dashboard",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Orquesta 6 submódulos en paralelo; cada uno se resuelve de forma aislada
  - `upcoming_meetings` se limita a las próximas 5 asambleas dentro de los próximos 90 días
  - `notifications_unread_count` refleja las no leídas del usuario autenticado (no del conjunto)
  - Tolerante a fallos parciales: un submódulo caído → su widget retorna `null` y la respuesta global es `200`; solo si fallan todos se retorna `500`
- **Side effects:** ninguno — lectura pura. Cada submódulo cachea su resultado en Redis por 5 min (`dashboard:summary:{user_id}`) para no sobrecargar la BD

---

## §23.2 Tasa de recaudo — histórico

```
GET /api/v1/dashboard/collection-rate
```

Drill-down histórico de la tasa de recaudo mensual.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `months_back` | integer | Meses hacia atrás a consultar (default: 12, max: 36) |

**Response `200`:**
```json
{
  "data": {
    "series": [
      { "month": "2025-07", "rate": 0.82, "collected": 11800000, "expected": 14367820 },
      { "month": "2025-08", "rate": 0.85, "collected": 12112500, "expected": 14367820 },
      { "month": "2026-06", "rate": 0.87, "collected": 12500000, "expected": 14367820 }
    ],
    "months_back": 12
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `rate = collected / expected` por mes, redondeado a 4 decimales
  - El mes en curso se incluye con los valores parciales al momento de la consulta
  - Si el submódulo no puede calcular el histórico, `series` retorna `[]` y la respuesta sigue siendo `200`
- **Side effects:** ninguno — lectura pura. Cache en Redis por 5 min (`dashboard:collection-rate:{months_back}`)

---

## §23.3 Cartera morosa — breakdown por antigüedad

```
GET /api/v1/dashboard/arrears
```

Drill-down de la cartera morosa segmentada por rangos de antigüedad.

**Response `200`:**
```json
{
  "data": {
    "arrears_percentage": 13.4,
    "total_outstanding": 1923400,
    "breakdown": [
      { "bucket": "0-30",  "units": 18, "amount": 540000  },
      { "bucket": "31-60", "units": 9,  "amount": 480000  },
      { "bucket": "61-90", "units": 4,  "amount": 320000  },
      { "bucket": ">90",   "units": 3,  "amount": 583400  }
    ]
  },
  "meta": { "trace_id": "..." }
}
```

> [!note] Rangos de antigüedad
> Los buckets son fijos y excluyentes: `0-30`, `31-60`, `61-90`, `>90` días de mora. La suma de `amount` por bucket debe igualar `total_outstanding`.

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La antigüedad se calcula desde la fecha de vencimiento de cada cuota hasta hoy
  - `arrears_percentage` = porcentaje de unidades con al menos una cuota vencida sobre el total de unidades activas
  - Si el submódulo no puede calcular el breakdown, `breakdown` retorna `[]` y la respuesta sigue siendo `200`
- **Side effects:** ninguno — lectura pura. Cache en Redis por 5 min (`dashboard:arrears`)

---

## §23.4 PQRS — por estado

```
GET /api/v1/dashboard/pqrs-status
```

Drill-down de PQRS abiertas agrupadas por estado.

**Response `200`:**
```json
{
  "data": {
    "open_count": 7,
    "by_status": [
      { "status": "abierta",   "count": 3 },
      { "status": "en_estudio", "count": 2 },
      { "status": "en_proceso", "count": 2 }
    ]
  },
  "meta": { "trace_id": "..." }
}
```

> [!note]
> Solo se cuentan PQRS no cerradas/resueltas. Los estados provienen del ENUM `pqrs_status` del módulo PQRS.

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `open_count` = suma de `by_status[*].count`
  - Si el submódulo no puede calcular el conteo, `by_status` retorna `[]` y `open_count` retorna `0`, respuesta `200`
- **Side effects:** ninguno — lectura pura. Cache en Redis por 5 min (`dashboard:pqrs-status`)

---

## §23.5 Visitantes — hoy

```
GET /api/v1/dashboard/visitors-today
```

Lista de visitantes registrados el día en curso.

**Response `200`:**
```json
{
  "data": {
    "visitors": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440010",
        "name": "Carlos Ramirez",
        "document_number": "90123456",
        "unit": { "id": "550e8400-e29b-41d4-a716-446655440000", "number": "101", "tower": "A" },
        "check_in_at": "2026-06-23T14:20:00Z",
        "check_out_at": null
      }
    ],
    "count": 12
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - "Hoy" se define en UTC según `APP_TIMEZONE=UTC`
  - Incluye visitantes con `check_in_at` en el día en curso, sin paginar (volumen acotado por día)
  - Si el submódulo no puede listar, `visitors` retorna `[]` y `count` retorna `0`, respuesta `200`
- **Side effects:** ninguno — lectura pura. Cache en Redis por 5 min (`dashboard:visitors-today:{date}`)

---

## §23.6 Próximas asambleas

```
GET /api/v1/dashboard/upcoming-meetings
```

Lista de asambleas próximas, ordenadas ascendentemente por fecha.

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `delta_days` | integer | Días hacia adelante a consultar (default: 90, max: 365) |

**Response `200`:**
```json
{
  "data": {
    "meetings": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440001",
        "title": "Asamblea ordinaria Q2",
        "scheduled_at": "2026-07-15T19:00:00Z",
        "delta_days": 22,
        "status": "programada"
      }
    ],
    "delta_days": 90
  },
  "meta": { "trace_id": "..." }
}
```

> [!note]
> `delta_days` en cada item es la diferencia en días entre hoy y `scheduled_at`. Solo se incluyen asambleas en estado `programada` con `scheduled_at > NOW()`.

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Orden ascendente por `scheduled_at`
  - Límite de 20 resultados (suficiente para cubrir el horizonte típico sin sobrecargar la UI)
  - Si el submódulo no puede listar, `meetings` retorna `[]`, respuesta `200`
- **Side effects:** ninguno — lectura pura. Cache en Redis por 5 min (`dashboard:upcoming-meetings:{delta_days}`)

---

## Códigos de error

Este módulo **no define códigos de error nuevos**. Todos los endpoints retornan `200` con `data` (tolerante a fallos parciales). Solo aplican:

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INTERNAL_ERROR` | 500 | El agregador no pudo construir ninguna parte de la respuesta |
| `RATE_LIMIT_EXCEEDED` | 429 | Límite global de peticiones excedido (heredado del rate limiting global, ver [[API_CONTRACT]] §Rate Limiting) |

Formato único de error (ver [[API_CONTRACT]] §Formato de Respuesta de Error):
```json
{
  "error": {
    "code": "...",
    "message": "...",
    "trace_id": "..."
  }
}
```

> Adicionalmente aplican los códigos comunes de auth (`UNAUTHORIZED` 401, `FORBIDDEN` 403) cuando el token falta, expira o el rol no es `admin`.

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/dashboard/DASHBOARD_SPEC]]
- Spec App: N/A (feature solo Web)
- Panorama global: [[00-shared/features/DASHBOARD]]
- Módulos consumidores de datos: [[endpoints/PAGOS]], [[endpoints/CUOTAS]], [[endpoints/PQRS]], [[endpoints/VISITANTES]], [[endpoints/ASAMBLEAS]], [[endpoints/NOTIFICACIONES]], [[endpoints/MORA]]
