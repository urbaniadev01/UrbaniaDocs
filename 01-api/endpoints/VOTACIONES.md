---
type: reference
status: active
module: votaciones
scope: api
tags: [api, endpoints, votaciones]
updated: 2026-06-23
---

# Endpoints: Votaciones y encuestas

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Votaciones y encuestas.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Gobernanza de la copropiedad. El admin crea votaciones formales (vinculadas a asambleas, ponderadas por coeficiente) y encuestas informales (un residente = un voto). Los residentes votan una sola vez; el resultado se calcula al cierre con verificación de quórum y mayoría. El voto es anónimo en los reportes públicos, pero se conserva trazabilidad interna en `poll_votes` para auditoría (no expuesta en results).

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 17.1 | GET | `/polls` | Sí | admin, user | Diseñado |
| 17.2 | POST | `/polls` | Sí | admin | Diseñado |
| 17.3 | GET | `/polls/{id}` | Sí | admin, user | Diseñado |
| 17.4 | PATCH | `/polls/{id}` | Sí | admin | Diseñado |
| 17.5 | POST | `/polls/{id}/open` | Sí | admin | Diseñado |
| 17.6 | POST | `/polls/{id}/vote` | Sí | user | Diseñado |
| 17.7 | POST | `/polls/{id}/close` | Sí | admin | Diseñado |
| 17.8 | GET | `/polls/{id}/results` | Sí | admin, user* | Diseñado |
| 17.9 | POST | `/polls/{id}/revoke-vote` | Sí | user | Diseñado |
| 17.10 | GET | `/polls/{id}/my-vote` | Sí | user | Diseñado |

> `*` En §17.8, `user` solo recibe resultados si la votación está `closed`; en otro caso retorna `409 POLL_NOT_OPEN` o `409 POLL_CLOSED` según corresponda.

---

## §17.1 Listar votaciones

```
GET /api/v1/polls
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `draft`, `open`, `closed`, `cancelled` |
| `meeting_id` | uuid | Filtrar por asamblea vinculada (opcional) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "question": "¿Se aprueba el presupuesto 2027?",
      "type": "single_choice",
      "status": "open",
      "meeting_id": "770e8400-e29b-41d4-a716-446655440010",
      "majority_required": "simple",
      "open_at": "2026-06-23T10:00:00Z",
      "close_at": "2026-06-23T18:00:00Z",
      "options_count": 3,
      "total_votes": 42,
      "has_voted": true,
      "created_at": "2026-06-20T08:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
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

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: ve todas las votaciones (incluidas `draft` y `cancelled`)
  - `role = user`: solo ve votaciones `open` o `closed`; las `draft` y `cancelled` se excluyen
  - `has_voted` se calcula para el usuario autenticado (siempre `false` para admin)
- **Side effects:** ninguno — lectura pura

---

## §17.2 Crear votación

```
POST /api/v1/polls
```

**Request:**
```json
{
  "question": "¿Se aprueba el presupuesto 2027?",
  "type": "single_choice",
  "options": [
    { "text": "Sí", "order": 1 },
    { "text": "No", "order": 2 },
    { "text": "Abstención", "order": 3 }
  ],
  "majority_required": "simple",
  "open_at": "2026-06-23T10:00:00Z",
  "close_at": "2026-06-23T18:00:00Z",
  "meeting_id": "770e8400-e29b-41d4-a716-446655440010"
}
```

> [!note] Tipos de votación
> `single_choice` = una opción | `multiple_choice` = N opciones | `yes_no` = voto binario (el campo `options` se ignora; se generan las opciones `yes` y `no` automáticamente).

> [!note] Mayoría requerida
> `simple` = más votos a favor que en contra | `absolute` = más del 50% de los votos válidos | `qualified` = mayoría de coeficiente de copropiedad (≥ 2/3).

**Response `201`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "question": "¿Se aprueba el presupuesto 2027?",
    "type": "single_choice",
    "status": "draft",
    "options": [
      { "id": "991e8400-e29b-41d4-a716-446655440001", "text": "Sí", "order": 1 },
      { "id": "991e8400-e29b-41d4-a716-446655440002", "text": "No", "order": 2 },
      { "id": "991e8400-e29b-41d4-a716-446655440003", "text": "Abstención", "order": 3 }
    ],
    "majority_required": "simple",
    "meeting_id": "770e8400-e29b-41d4-a716-446655440010",
    "open_at": "2026-06-23T10:00:00Z",
    "close_at": "2026-06-23T18:00:00Z",
    "created_at": "2026-06-20T08:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo close_at debe ser posterior a open_at",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - Se crea siempre en estado `draft` — no queda abierta al público hasta §17.5
  - Mínimo 2 opciones para `single_choice` y `multiple_choice` (máximo 10)
  - `type = yes_no` ignora `options` y genera las opciones `yes`/`no` automáticamente
  - `close_at` debe ser posterior a `open_at`
  - `meeting_id` es opcional; si se envía, la asamblea debe existir y estar en estado `scheduled` o `open`
  - `majority_required = qualified` solo aplica cuando la votación está vinculada a una asamblea formal (`meeting_id` presente)
- **Side effects:**
  - Crea registro en `polls`
  - Crea registros en `poll_options` por cada opción

---

## §17.3 Ver detalle de votación

```
GET /api/v1/polls/{id}
```

**Response `200` (admin, cualquier estado):**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "question": "¿Se aprueba el presupuesto 2027?",
    "type": "single_choice",
    "status": "closed",
    "meeting_id": "770e8400-e29b-41d4-a716-446655440010",
    "majority_required": "simple",
    "open_at": "2026-06-23T10:00:00Z",
    "close_at": "2026-06-23T18:00:00Z",
    "options": [
      { "id": "991e8400-...", "text": "Sí", "order": 1, "votes": 28, "coefficient": 0.6821, "percentage": 66.7 },
      { "id": "991e8400-...", "text": "No", "order": 2, "votes": 12, "coefficient": 0.2854, "percentage": 28.6 },
      { "id": "991e8400-...", "text": "Abstención", "order": 3, "votes": 2, "coefficient": 0.0325, "percentage": 4.7 }
    ],
    "total_votes": 42,
    "total_coefficient": 1.0000,
    "quorum_reached": true,
    "winner_option_id": "991e8400-e29b-41d4-a716-446655440001",
    "majority_reached": true,
    "created_at": "2026-06-20T08:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `200` (user, status = `open`):**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "question": "¿Se aprueba el presupuesto 2027?",
    "type": "single_choice",
    "status": "open",
    "majority_required": "simple",
    "open_at": "2026-06-23T10:00:00Z",
    "close_at": "2026-06-23T18:00:00Z",
    "options": [
      { "id": "991e8400-...", "text": "Sí", "order": 1 },
      { "id": "991e8400-...", "text": "No", "order": 2 },
      { "id": "991e8400-...", "text": "Abstención", "order": 3 }
    ],
    "has_voted": false,
    "created_at": "2026-06-20T08:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

> [!note] Visibilidad de resultados
> - `admin`: siempre ve resultados (votos, coeficiente, porcentaje, ganador) sin importar el estado.
> - `user` con `status = open`: ve las opciones sin conteos (no se filtran votos parciales).
> - `user` con `status = closed`: ve los resultados completos (mismo shape que admin, sin campos de auditoría interna).

**Response `404`:**
```json
{
  "error": {
    "code": "POLL_NOT_FOUND",
    "message": "Votación no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user` no puede ver votaciones en `draft` o `cancelled` → `404 POLL_NOT_FOUND` (no `403`, para no filtrar existencia)
  - En `open`, el user nunca recibe conteos parciales — solo opciones y `has_voted`
- **Side effects:** ninguno — lectura pura

---

## §17.4 Editar votación

```
PATCH /api/v1/polls/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "question": "¿Se aprueba el presupuesto 2027 (revisado)?",
  "options": [
    { "id": "991e8400-...", "text": "Sí", "order": 1 },
    { "text": "En blanco", "order": 4 }
  ],
  "open_at": "2026-06-24T10:00:00Z",
  "close_at": "2026-06-24T18:00:00Z"
}
```

> [!note]
> Solo editable si `status = draft`. Una vez abierta (§17.5), la votación queda congelada — cualquier intento de PATCH retorna `409 POLL_NOT_OPEN` con mensaje "Solo se puede editar una votación en borrador".

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "question": "¿Se aprueba el presupuesto 2027 (revisado)?",
    "status": "draft",
    "open_at": "2026-06-24T10:00:00Z",
    "close_at": "2026-06-24T18:00:00Z",
    "updated_at": "2026-06-22T15:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "POLL_NOT_OPEN",
    "message": "Solo se puede editar una votación en borrador",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status = draft`
- **Reglas de negocio:**
  - PATCH parcial — solo se actualizan los campos enviados
  - Si se envía `options`, se reemplaza el set completo; las opciones con `id` se actualizan, las sin `id` se crean, las omitidas se eliminan
  - `type` y `majority_required` no son editables después de la creación
  - `close_at` debe seguir siendo posterior a `open_at`
- **Side effects:**
  - Actualiza registro en `polls`
  - Sincroniza registros en `poll_options` (insert/update/delete)

---

## §17.5 Abrir votación

```
POST /api/v1/polls/{id}/open
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "open",
    "open_at": "2026-06-23T10:00:00Z",
    "close_at": "2026-06-23T18:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "POLL_NOT_OPEN",
    "message": "La votación ya fue abierta o cerrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status = draft`
- **Reglas de negocio:**
  - `open_at` debe ser `≤ NOW()` — no se puede abrir una votación programada para el futuro
  - Si la votación está vinculada a `meeting_id`, la asamblea debe estar en estado `open`
  - Verifica audiencia: al menos 1 residente activo con unidad asignada; si no, `409 QUORUM_NOT_REACHED` con mensaje "No hay residentes habilitados para votar"
  - Transición permitida: `draft` → `open` (cualquier otro estado retorna `409 POLL_NOT_OPEN`)
- **Side effects:**
  - Actualiza `status = open` en `polls`
  - Emite notificación `asamblea_programada` (o tipo equivalente de votación) a todos los residentes habilitados vía [[endpoints/NOTIFICACIONES]]

---

## §17.6 Emitir voto

```
POST /api/v1/polls/{id}/vote
```

**Request (`single_choice`):**
```json
{
  "option_ids": ["991e8400-e29b-41d4-a716-446655440001"]
}
```

**Request (`multiple_choice`):**
```json
{
  "option_ids": [
    "991e8400-e29b-41d4-a716-446655440001",
    "991e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Request (`yes_no`):**
```json
{
  "option_ids": ["yes"]
}
```

> [!note] Formato del voto por tipo
> - `single_choice`: `option_ids` con exactamente **1** elemento (id de `poll_options`).
> - `multiple_choice`: `option_ids` con **N** elementos (mín. 1, máx. número de opciones de la encuesta).
> - `yes_no`: `option_ids` con exactamente **1** elemento, valor `"yes"` o `"no"` (id virtual, no de `poll_options`).

**Response `201`:**
```json
{
  "data": {
    "poll_id": "990e8400-e29b-41d4-a716-446655440001",
    "voted_at": "2026-06-23T11:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "POLL_ALREADY_VOTED",
    "message": "Ya emitiste tu voto en esta votación",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_VOTE_OPTION",
    "message": "La opción indicada no pertenece a esta votación",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = user`, `status = open`
- **Reglas de negocio:**
  - El usuario debe ser residente activo con unidad asignada (para votaciones formales ponderadas por coeficiente)
  - Un usuario vota una sola vez por votación — segundo intento retorna `409 POLL_ALREADY_VOTED`
  - Si `status ≠ open`: `409 POLL_CLOSED` (si `closed`/`cancelled`) o `409 POLL_NOT_OPEN` (si `draft`)
  - Validación de opciones:
    - Cada `option_id` debe pertenecer a la votación → si no, `422 INVALID_VOTE_OPTION`
    - Cantidad de opciones debe coincidir con `type` → si no, `422 INVALID_VOTE_COUNT` (ej: 2 opciones en `single_choice`, o 0 en cualquier tipo)
    - `yes_no`: el valor debe ser `"yes"` o `"no"` (string), no un UUID
  - El voto se registra con `user_id` + `unit_id` en `poll_votes` para trazabilidad de quórum y coeficiente, pero **no se expone** en results (§17.8) — el reporte es anónimo
  - Concurrencia: la unicidad se garantiza con constraint UNIQUE en `(poll_id, user_id)`
- **Side effects:**
  - Crea registro en `poll_votes` (con `user_id`, `unit_id`, `coefficient` snapshot)
  - Invalida el cache de resultados parciales en `poll_results_cache` si la votación es de visualización en tiempo real para admin

---

## §17.7 Cerrar votación

```
POST /api/v1/polls/{id}/close
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "closed",
    "closed_at": "2026-06-23T18:00:00Z",
    "total_votes": 42,
    "total_coefficient": 0.8750,
    "quorum_reached": true,
    "winner_option_id": "991e8400-e29b-41d4-a716-446655440001",
    "majority_reached": true
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "QUORUM_NOT_REACHED",
    "message": "No se alcanzó el quórum mínimo para cerrar la votación",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status = open`
- **Reglas de negocio:**
  - Transición permitida: `open` → `closed` (cualquier otro estado retorna `409 POLL_NOT_OPEN`)
  - Cálculo al cerrar:
    1. Suma de coeficientes emitidos vs. coeficiente total de la copropiedad → quórum (típicamente ≥ 50%)
    2. Conteo por opción con porcentaje sobre votos válidos
    3. Verificación de `majority_required` (`simple` / `absolute` / `qualified`)
  - Si el quórum no se alcanza: `409 QUORUM_NOT_REACHED` y la votación **no se cierra** (queda `open` para permitir más votos hasta `close_at`)
  - Si el quórum se alcanza pero la mayoría no: se cierra igual, `majority_reached = false`, sin error (la votación se desecha formalmente)
  - Cierre automático: un job programado cierra votaciones al llegar `close_at` con el mismo cálculo (no requiere llamada de admin)
- **Side effects:**
  - Actualiza `status = closed`, `closed_at = NOW()` en `polls`
  - Calcula y congela resultados en `poll_results_cache` (snapshot inmutable)
  - Emite notificación a todos los participantes (usuarios con voto registrado) vía [[endpoints/NOTIFICACIONES]] con el resultado resumido

---

## §17.8 Ver resultados detallados

```
GET /api/v1/polls/{id}/results
```

**Response `200`:**
```json
{
  "data": {
    "poll_id": "990e8400-e29b-41d4-a716-446655440001",
    "status": "closed",
    "total_votes": 42,
    "total_coefficient": 0.8750,
    "quorum_required": 0.5000,
    "quorum_reached": true,
    "majority_required": "simple",
    "majority_reached": true,
    "winner_option_id": "991e8400-e29b-41d4-a716-446655440001",
    "options": [
      {
        "id": "991e8400-e29b-41d4-a716-446655440001",
        "text": "Sí",
        "order": 1,
        "votes": 28,
        "coefficient": 0.6821,
        "percentage": 66.7
      },
      {
        "id": "991e8400-e29b-41d4-a716-446655440002",
        "text": "No",
        "order": 2,
        "votes": 12,
        "coefficient": 0.2854,
        "percentage": 28.6
      },
      {
        "id": "991e8400-e29b-41d4-a716-446655440003",
        "text": "Abstención",
        "order": 3,
        "votes": 2,
        "coefficient": 0.0325,
        "percentage": 4.7
      }
    ]
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409` (user, votación `open`):**
```json
{
  "error": {
    "code": "POLL_NOT_OPEN",
    "message": "Los resultados no están disponibles mientras la votación está abierta",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: ve resultados en cualquier estado (incluido `open`, para monitor en tiempo real)
  - `role = user`: solo ve resultados si `status = closed`; si `open` → `409 POLL_NOT_OPEN`; si `draft`/`cancelled` → `404 POLL_NOT_FOUND`
  - Para votaciones `closed`, los datos provienen del snapshot en `poll_results_cache` (no se recalculan)
  - El reporte **no incluye** `user_id` ni identificadores de votantes — el voto es anónimo en el reporte público
- **Side effects:** ninguno — lectura pura

---

## §17.9 Revocar voto

```
POST /api/v1/polls/{id}/revoke-vote
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "poll_id": "990e8400-e29b-41d4-a716-446655440001",
    "revoked_at": "2026-06-23T12:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "POLL_CLOSED",
    "message": "No se puede revocar el voto de una votación cerrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = user`, `status = open`, usuario ya votó
- **Reglas de negocio:**
  - Solo se puede revocar mientras `status = open` — si `closed`/`cancelled` → `409 POLL_CLOSED`; si `draft` → `409 POLL_NOT_OPEN`
  - Si el usuario no había votado: `404 POLL_NOT_FOUND` con mensaje "No hay voto registrado para revocar"
  - Best-effort: si la revocación falla por una condición de carrera (votación cerrada entre validación y delete), se retorna `409 POLL_CLOSED`
  - Tras revocar, el usuario puede volver a votar (§17.6) mientras la votación siga `open`
- **Side effects:**
  - Elimina (soft delete con `revoked_at`) el registro en `poll_votes`
  - Invalida el cache de resultados parciales en `poll_results_cache`

---

## §17.10 Ver mi voto

```
GET /api/v1/polls/{id}/my-vote
```

**Response `200`:**
```json
{
  "data": {
    "poll_id": "990e8400-e29b-41d4-a716-446655440001",
    "voted_at": "2026-06-23T11:30:00Z",
    "option_ids": ["991e8400-e29b-41d4-a716-446655440001"],
    "options_text": ["Sí"]
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "POLL_NOT_FOUND",
    "message": "No has emitido voto en esta votación",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = user`
- **Reglas de negocio:**
  - Retorna el voto del usuario autenticado para la votación indicada
  - Si no ha votado → `404 POLL_NOT_FOUND` con mensaje "No has emitido voto en esta votación"
  - Si la votación no existe o está en `draft` → `404 POLL_NOT_FOUND`
  - Solo el propio usuario ve su voto — no hay endpoint para que un admin consulte el voto individual de un residente (anonimato del voto)
- **Side effects:** ninguno — lectura pura

---

## Códigos de error del módulo

| Código | HTTP | Descripción |
|--------|------|-------------|
| `POLL_NOT_FOUND` | 404 | Votación no encontrada (o no visible para el usuario) |
| `POLL_NOT_OPEN` | 409 | La votación no está abierta (para votar, editar o ver resultados parciales) |
| `POLL_ALREADY_VOTED` | 409 | El usuario ya emitió voto en esta votación |
| `POLL_CLOSED` | 409 | La votación está cerrada (para votar o revocar) |
| `INVALID_VOTE_OPTION` | 422 | Una opción indicada no pertenece a la votación |
| `INVALID_VOTE_COUNT` | 422 | El número de opciones no coincide con el `type` de la votación |
| `QUORUM_NOT_REACHED` | 409 | No se alcanzó el quórum mínimo al cerrar |
| `MAJORITY_NOT_REACHED` | 409 | No se alcanzó la mayoría requerida al cerrar (informativo, la votación sí se cierra) |

> [!note]
> `MAJORITY_NOT_REACHED` no se retorna como error al cerrar (la votación se cierra con `majority_reached = false`); se documenta para uso interno de informes y posible endpoint futuro de anulación.

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/votaciones/VOTACIONES_SPEC]]
- Spec App: [[03-app/features/votaciones/VOTACIONES_SPEC]]
- Panorama global: [[00-shared/features/VOTACIONES]]
- Notificaciones (cierre a participantes): [[endpoints/NOTIFICACIONES]]
- Asambleas vinculadas: [[endpoints/ASAMBLEAS]]
- Residentes (audiencia habilitada): [[endpoints/RESIDENTES]]
