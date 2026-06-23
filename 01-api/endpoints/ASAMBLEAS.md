---
type: reference
status: active
module: asambleas
scope: api
tags: [api, endpoints, asambleas]
updated: 2026-06-23
---

# Endpoints: Asambleas

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Asambleas.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Nomenclatura del recurso
> En la API las asambleas se llaman **`meetings`** (en plural inglés) para evitar ambigüedad con _board meetings_ y con el término `assemblies` (que en algunos dominios se reserva para conjuntos administrativos). Toda ruta, tabla y event type usa `meeting`.

> [!note] Alcance por cliente
> - **Web** (admin): gestión completa — crear, editar, cancelar, registrar asistencia, cargar/cerrar acta.
> - **App** (`user`): **solo lectura** por defecto. Marcar presencia propia (`POST /meetings/{id}/attendance` con `unit_id` propio y `present: true`) queda **reservado para una sesión futura** — no habilitado en la app actual.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 16.1 | GET | `/meetings` | Sí | admin, user | Diseñado |
| 16.2 | POST | `/meetings` | Sí | admin | Diseñado |
| 16.3 | GET | `/meetings/{id}` | Sí | admin, user* | Diseñado |
| 16.4 | PATCH | `/meetings/{id}` | Sí | admin | Diseñado |
| 16.5 | POST | `/meetings/{id}/cancel` | Sí | admin | Diseñado |
| 16.6 | POST | `/meetings/{id}/attendance` | Sí | admin | Diseñado |
| 16.7 | GET | `/meetings/{id}/attendance` | Sí | admin, user* | Diseñado |
| 16.8 | POST | `/meetings/{id}/minutes` | Sí | admin | Diseñado |
| 16.9 | GET | `/meetings/{id}/minutes` | Sí | admin, user* | Diseñado |
| 16.10 | POST | `/meetings/{id}/close` | Sí | admin | Diseñado |

> `*` Un residente (`role = user`) puede consultar el detalle (§16.3), la lista de asistencia (§16.7) y descargar el acta publicada (§16.9) de cualquier asamblea. El registro de asistencia por parte de `user` queda fuera del scope actual.

---

## §16.1 Listar asambleas

```
GET /api/v1/meetings
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `type` | string | `ordinary`, `extraordinary` |
| `status` | string | `scheduled`, `in_progress`, `closed`, `cancelled` |
| `year` | integer | Filtra por año de `scheduled_at` (ej: `2026`) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440001",
      "type": "ordinary",
      "title": "Asamblea Ordinaria 2026",
      "status": "scheduled",
      "scheduled_at": "2026-07-15T19:00:00Z",
      "location": "Salón Social — Torre A",
      "quorum_required": 0.5001,
      "quorum_reached": 0.0,
      "attendees_count": 0,
      "minutes_uploaded": false,
      "created_at": "2026-06-23T10:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 12,
      "total_pages": 1
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Orden descendente por `scheduled_at`
  - `role = user` ve las mismas asambleas (es información pública del conjunto); sin filtros administrativos
  - `quorum_reached` se calcula en tiempo real a partir de `meeting_attendance` (suma de coeficientes de unidades presentes)
- **Side effects:** ninguno — lectura pura

---

## §16.2 Crear asamblea

```
POST /api/v1/meetings
```

**Request:**
```json
{
  "type": "ordinary",
  "title": "Asamblea Ordinaria 2026",
  "scheduled_at": "2026-07-15T19:00:00Z",
  "location": "Salón Social — Torre A",
  "agenda": [
    { "item": "Informe de gestión", "description": "Presentación del balance 2025" },
    { "item": "Aprobación del presupuesto 2026", "description": "Discusión y votación", "requires_vote": true }
  ],
  "attachment_ids": ["550e8400-e29b-41d4-a716-4466554400aa"]
}
```

> [!note]
> `type` = `ordinary` (ordinaria) | `extraordinary` (extraordinaria). `agenda[].requires_vote` (bool, default `false`) marca los puntos que generarán una Votación vinculada al cerrar la creación. `attachment_ids` es opcional — UUIDs de documentos previamente cargados (ver `meeting_attachments`).

**Response `201`:**
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "type": "ordinary",
    "title": "Asamblea Ordinaria 2026",
    "status": "scheduled",
    "scheduled_at": "2026-07-15T19:00:00Z",
    "location": "Salón Social — Torre A",
    "agenda": [
      {
        "id": "ab0e8400-e29b-41d4-a716-446655440010",
        "order": 1,
        "item": "Informe de gestión",
        "description": "Presentación del balance 2025",
        "requires_vote": false,
        "vote_id": null,
        "status": "pending"
      },
      {
        "id": "ab0e8400-e29b-41d4-a716-446655440011",
        "order": 2,
        "item": "Aprobación del presupuesto 2026",
        "description": "Discusión y votación",
        "requires_vote": true,
        "vote_id": "cc0e8400-e29b-41d4-a716-446655440099",
        "status": "pending"
      }
    ],
    "attachment_ids": ["550e8400-e29b-41d4-a716-4466554400aa"],
    "quorum_required": 0.5001,
    "quorum_reached": 0.0,
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422` (validación):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "scheduled_at debe ser futura",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `scheduled_at` debe ser futura (a partir de `NOW()` + antelación mínima configurable, default 15 días — ver panorama §7)
  - `title` obligatorio, máx 255 chars
  - `agenda` mínimo 1 ítem; `order` se asigna automáticamente según el orden del array
  - Para cada ítem con `requires_vote = true`, se crea una Votación vinculada (ver [[endpoints/VOTACIONES]] en futuras specs) y se retorna `vote_id`
  - `quorum_required` = `0.5001` (50%+1 del coeficiente total) salvo override por reglamento
  - La asamblea nace en `status = scheduled`
- **Side effects:**
  - Crea registro en `meetings`, filas en `meeting_attendance` (vacío) y `meeting_attachments` (si llegan `attachment_ids`)
  - Crea Votaciones vinculadas para cada punto con `requires_vote`
  - Emite notificación `asamblea_programada` a todos los residentes activos vía [[endpoints/NOTIFICACIONES]] (canales: in-app + email + push según preferencias del usuario)

---

## §16.3 Ver detalle de asamblea

```
GET /api/v1/meetings/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "type": "ordinary",
    "title": "Asamblea Ordinaria 2026",
    "status": "in_progress",
    "scheduled_at": "2026-07-15T19:00:00Z",
    "location": "Salón Social — Torre A",
    "quorum_required": 0.5001,
    "quorum_reached": 0.4823,
    "agenda": [
      {
        "id": "ab0e8400-e29b-41d4-a716-446655440010",
        "order": 1,
        "item": "Informe de gestión",
        "description": "Presentación del balance 2025",
        "requires_vote": false,
        "vote_id": null,
        "status": "approved"
      }
    ],
    "attendees": [
      {
        "unit_id": "550e8400-e29b-41d4-a716-446655440000",
        "unit_label": "101 — Torre A",
        "present": true,
        "represented_by_id": null,
        "registered_at": "2026-07-15T19:05:00Z"
      }
    ],
    "minutes": {
      "uploaded": true,
      "minutes_pdf_url": "https://storage.../acta-aa0e8400.pdf",
      "uploaded_at": "2026-07-16T09:00:00Z"
    },
    "attachments": [
      { "id": "550e8400-e29b-41d4-a716-4466554400aa", "name": "convocatoria.pdf", "url": "https://storage.../convocatoria.pdf" }
    ],
    "created_at": "2026-06-23T10:00:00Z",
    "updated_at": "2026-07-15T19:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "MEETING_NOT_FOUND",
    "message": "Asamblea no encontrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - Visible para `admin` y `user` (residente consulta sus asambleas)
  - `attendees` se omiten para `role = user` si la asamblea está `scheduled` (privacidad de asistencia antes de iniciar); se exponen una vez `status` ∈ {`in_progress`, `closed`}
  - `minutes` solo aparece con el PDF publicado (`uploaded = true`); antes de eso retorna `"uploaded": false` sin `minutes_pdf_url` ni `minutes_text`
- **Side effects:** ninguno — lectura pura

---

## §16.4 Editar asamblea

```
PATCH /api/v1/meetings/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "title": "Asamblea Ordinaria 2026 — Reprogramada",
  "scheduled_at": "2026-07-22T19:00:00Z",
  "location": "Salón Social — Torre B",
  "agenda": [
    { "item": "Informe de gestión", "description": "Actualizado" }
  ]
}
```

> [!note]
> Solo editable si `status = scheduled`. Una vez en `in_progress` o `closed`, el endpoint retorna `409 MEETING_ALREADY_STARTED`. Reemplazar `agenda` recrea los puntos (los `id` cambian) — para edición parcial de puntos usar un endpoint dedicado futuro.

**Response `200`:**
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "title": "Asamblea Ordinaria 2026 — Reprogramada",
    "scheduled_at": "2026-07-22T19:00:00Z",
    "location": "Salón Social — Torre B",
    "updated_at": "2026-06-24T08:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MEETING_ALREADY_STARTED",
    "message": "La asamblea ya inició y no puede editarse",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status = scheduled`
- **Reglas de negocio:**
  - PATCH parcial sobre `title`, `scheduled_at`, `location`
  - `agenda`, si se envía, reemplaza el orden del día completo (destruye y recrea los puntos)
  - Si se cambia `scheduled_at` a una fecha futura válida, se reemite la notificación `asamblea_programada` indicando reprogramación
- **Side effects:** actualiza `meetings`; si cambia `scheduled_at`, nueva notificación `asamblea_programada` vía [[endpoints/NOTIFICACIONES]]

---

## §16.5 Cancelar asamblea

```
POST /api/v1/meetings/{id}/cancel
```

**Request:**
```json
{
  "reason": "Falta de quórum previsto",
  "notify": true
}
```

> [!note]
> `notify` default `true`. La cancelación es _soft_: el registro se conserva con `status = cancelled`.

**Response `200`:**
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "status": "cancelled",
    "cancelled_at": "2026-07-14T10:00:00Z",
    "reason": "Falta de quórum previsto"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MEETING_CANNOT_CANCEL",
    "message": "La asamblea ya fue celebrada o cerrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status` ∈ {`scheduled`, `in_progress`}
- **Reglas de negocio:**
  - Solo se puede cancelar si NO está `closed`
  - Cancelar una asamblea `in_progress` requiere confirmación explícita (en la UI web) de que se descartará la asistencia registrada
  - Votaciones vinculadas se marcan `cancelled` en cascada (no se eliminan; se conservan para auditoría)
- **Side effects:**
  - `meetings.status = cancelled`, registra `cancelled_at`
  - Si `notify = true`, emite notificación a residentes (tipo `asamblea_programada` con cuerpo "Asamblea cancelada") vía [[endpoints/NOTIFICACIONES]]

---

## §16.6 Registrar asistencia

```
POST /api/v1/meetings/{id}/attendance
```

**Request:**
```json
{
  "attendance": [
    { "unit_id": "550e8400-e29b-41d4-a716-446655440000", "present": true },
    { "unit_id": "550e8400-e29b-41d4-a716-446655440077", "present": true, "represented_by_id": "660e8400-e29b-41d4-a716-446655440099" },
    { "unit_id": "550e8400-e29b-41d4-a716-446655440022", "present": false }
  ]
}
```

> [!note]
> Envío por lotes (upsert por `meeting_id` + `unit_id`). `represented_by_id` es opcional e indica qué residente representa a esa unidad (poder). El `user` puede enviar solo su propia fila — el admin envía cualquier combinación.

**Response `200`:**
```json
{
  "data": {
    "meeting_id": "aa0e8400-e29b-41d4-a716-446655440001",
    "registered_count": 3,
    "quorum_reached": 0.4823,
    "quorum_required": 0.5001,
    "quorum_met": false
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "INVALID_ATTENDANCE",
    "message": "Unidad 550e8400...022 duplicada en el lote",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MEETING_ALREADY_CLOSED",
    "message": "La asamblea está cerrada, no se puede modificar asistencia",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido; `role = admin` para lote completo, `role = user` solo para su unidad (scope futuro)
- **Reglas de negocio:**
  - No se permiten `unit_id` duplicados en el mismo lote → `422 INVALID_ATTENDANCE`
  - Cada `unit_id` debe existir y estar `occupied` (una unidad vacía no aporta asistencia) → `422 INVALID_ATTENDANCE`
  - `represented_by_id` (si se envía) debe ser `resident_id` activo distinto del titular de la unidad
  - Idempotente: reenviar la misma fila actualiza `present`/`represented_by_id` y `registered_at = NOW()`
  - `quorum_reached` se recalcula y retorna: suma de coeficientes de unidades con `present = true`
  - Una asamblea `closed` rechaza cambios → `409 MEETING_ALREADY_CLOSED`
- **Side effects:** upsert en `meeting_attendance`; recalcula `quorum_reached` en `meetings`

---

## §16.7 Ver asistencia y quórum

```
GET /api/v1/meetings/{id}/attendance
```

**Response `200`:**
```json
{
  "data": {
    "meeting_id": "aa0e8400-e29b-41d4-a716-446655440001",
    "meeting_status": "in_progress",
    "quorum_required": 0.5001,
    "quorum_reached": 0.4823,
    "quorum_met": false,
    "total_units": 64,
    "present_units": 31,
    "attendees": [
      {
        "unit_id": "550e8400-e29b-41d4-a716-446655440000",
        "unit_label": "101 — Torre A",
        "coefficient": 0.0245,
        "present": true,
        "represented_by_id": null,
        "represented_by_name": null,
        "registered_at": "2026-07-15T19:05:00Z"
      },
      {
        "unit_id": "550e8400-e29b-41d4-a716-446655440077",
        "unit_label": "302 — Torre B",
        "coefficient": 0.0188,
        "present": true,
        "represented_by_id": "660e8400-e29b-41d4-a716-446655440099",
        "represented_by_name": "Maria Lopez",
        "registered_at": "2026-07-15T19:06:00Z"
      }
    ]
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo ve la lista si la asamblea estuvo `in_progress`/`closed` (igual que §16.3); mientras está `scheduled` recibe `409 MEETING_ALREADY_STARTED` equivalente → en la práctica se devuelve `403` para no revelar asistencia anticipada. Se prefiere devolver los registros solo cuando aplica
  - `quorum_met` = `quorum_reached >= quorum_required`
- **Side effects:** ninguno — lectura pura

---

## §16.8 Cargar acta

```
POST /api/v1/meetings/{id}/minutes
```

**Request:**
```json
{
  "minutes_pdf_url": "https://storage.../acta-aa0e8400.pdf",
  "minutes_text": "En Bogotá, el 15 de julio de 2026, se reunió la asamblea..."
}
```

> [!note]
> El PDF del acta firmada se carga previamente (storage), aquí se referencia su URL. `minutes_text` es el contenido textual indexable; ambos opcionales pero al menos uno obligatorio. Operación idempotente salvo que la asamblea ya tenga acta → `409 MINUTES_ALREADY_UPLOADED`.

**Response `201`:**
```json
{
  "data": {
    "meeting_id": "aa0e8400-e29b-41d4-a716-446655440001",
    "minutes_uploaded": true,
    "minutes_pdf_url": "https://storage.../acta-aa0e8400.pdf",
    "uploaded_at": "2026-07-16T09:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MINUTES_ALREADY_UPLOADED",
    "message": "Esta asamblea ya tiene un acta cargada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status` ∈ {`in_progress`, `closed`}
- **Reglas de negocio:**
  - Una sola acta por asamblea; si ya existe → `409 MINUTES_ALREADY_UPLOADED` (para reemplazar, se debe eliminar primero — endpoint futuro)
  - `minutes_pdf_url` debe ser URL accesible del bucket del conjunto; el sistema valida que sea del dominio autorizado
- **Side effects:** crea registro en `meeting_minutes` (o actualiza campos en `meetings` según esquema); no cierra la asamblea (use §16.10)

---

## §16.9 Descargar acta

```
GET /api/v1/meetings/{id}/minutes
```

**Response `200`:**
```json
{
  "data": {
    "meeting_id": "aa0e8400-e29b-41d4-a716-446655440001",
    "minutes_pdf_url": "https://storage.../acta-aa0e8400.pdf",
    "minutes_text": "En Bogotá, el 15 de julio de 2026...",
    "uploaded_at": "2026-07-16T09:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "MEETING_NOT_FOUND",
    "message": "Acta no publicada para esta asamblea",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user` y `role = admin` pueden descargar el acta _publicada_
  - Si no hay acta cargada (`minutes_uploaded = false`), retorna `404 MEETING_NOT_FOUND` con mensaje específico de acta (no filtra existencia del meeting, que ya se validó)
- **Side effects:** ninguno — lectura pura

---

## §16.10 Cerrar asamblea

```
POST /api/v1/meetings/{id}/close
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "status": "closed",
    "closed_at": "2026-07-15T22:30:00Z",
    "quorum_required": 0.5001,
    "quorum_reached": 0.5120,
    "quorum_met": true,
    "minutes_uploaded": true
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "QUORUM_NOT_REACHED",
    "message": "No se alcanzó el quórum mínimo (0.4823 < 0.5001)",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "MEETING_ALREADY_CLOSED",
    "message": "La asamblea ya está cerrada",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, `status = in_progress`
- **Reglas de negocio:**
  - Calcula el `quorum_reached` final desde `meeting_attendance`
  - Si `quorum_reached < quorum_required` → `409 QUORUM_NOT_REACHED` (la asamblea queda `in_progress`; el admin debe cancelarla vía §16.5 si lo desea)
  - Recomendado (no obligatorio) que exista acta cargada (`minutes_uploaded`) antes de cerrar; si no la hay se permite el cierre pero se marca `minutes_uploaded: false` en la respuesta
  - Bloquea toda edición futura de asistencia (§16.6) y de la asamblea (§16.4)
  - Cierra en cascada las Votaciones vinculadas (estado final `closed`)
- **Side effects:**
  - `meetings.status = closed`, `closed_at = NOW()`, recalcula `quorum_reached`
  - Cierra Votaciones vinculadas
  - Emite notificación `asamblea_programada` con cuerpo "Acta de la asamblea disponible" a residentes (si `minutes_uploaded = true`) vía [[endpoints/NOTIFICACIONES]]

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Seguridad JWT: [[API_JWT_IMPLEMENTATION]]
- Spec Web: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
- Spec App: [[03-app/features/asambleas/ASAMBLEAS_SPEC]]
- Panorama global: [[00-shared/features/ASAMBLEAS]]
- Módulos relacionados: [[endpoints/RESIDENTES]], [[endpoints/NOTIFICACIONES]]