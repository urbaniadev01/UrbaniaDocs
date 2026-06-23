---
type: reference
status: active
module: visitantes
scope: api
tags: [api, endpoints, visitantes, acceso]
updated: 2026-06-23
---

# Endpoints: Visitantes y Control de Acceso

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Visitantes.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 8.1 | GET | `/visitors` | Sí | admin | Diseñado |
| 8.2 | POST | `/visitors` | Sí | admin | Diseñado |
| 8.3 | PATCH | `/visitors/{id}/exit` | Sí | admin | Diseñado |
| 8.4 | GET | `/visitors/{id}` | Sí | admin, user* | Diseñado |
| 8.5 | POST | `/visitors/preauth` | Sí | admin, user | Diseñado |
| 8.6 | GET | `/visitors/preauth` | Sí | admin, user* | Diseñado |

> `*` Un residente puede ver las visitas y preautorizaciones de su propia unidad.

---

## §8.1 Listar historial de visitas

```
GET /api/v1/visitors
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `unit_id` | uuid | Filtrar por unidad destino |
| `status` | string | `preauthorized`, `inside`, `exited`, `expired` |
| `date` | date | Filtrar por fecha `YYYY-MM-DD` |
| `from` | date | Rango inicio |
| `to` | date | Rango fin |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "vis-001",
      "visitor_name": "Carlos Mendez",
      "visitor_document": "98765432",
      "unit": { "id": "...", "number": "101", "tower": "A" },
      "purpose": "Visita familiar",
      "status": "exited",
      "entry_time": "2026-06-23T14:30:00Z",
      "exit_time": "2026-06-23T18:45:00Z",
      "registered_by": "admin-uuid",
      "preauth_id": null
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": { "page": 1, "per_page": 20, "total": 215, "total_pages": 11 }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Side effects:** ninguno — lectura pura

---

## §8.2 Registrar ingreso de visitante

```
POST /api/v1/visitors
```

**Request:**
```json
{
  "visitor_name": "Carlos Mendez",
  "visitor_document": "98765432",
  "unit_id": "550e8400-e29b-41d4-a716-446655440000",
  "purpose": "Visita familiar",
  "preauth_id": null
}
```

> [!note] Ingreso por preautorización
> Si el visitante llega con un QR de preautorización, incluir `preauth_id` para que el sistema vincule el ingreso al registro previo y no requiera capturar todos los datos manualmente.

**Response `201`:**
```json
{
  "data": {
    "id": "vis-099",
    "visitor_name": "Carlos Mendez",
    "visitor_document": "98765432",
    "unit": { "id": "...", "number": "101", "tower": "A" },
    "purpose": "Visita familiar",
    "status": "inside",
    "entry_time": "2026-06-23T14:30:00Z",
    "preauth_id": null
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin` (portero)
- **Reglas de negocio:**
  - Si se provee `preauth_id`: se valida que la preautorización esté vigente (no expirada ni ya usada) y la unidad coincida
  - Si la preautorización es válida, los datos del visitante se completan automáticamente desde la preautorización
- **Side effects:**
  - Crea registro en `visitors` con `status = inside`
  - Emite notificación push al residente de la unidad destino
  - Si se usó preautorización: marca la preautorización como `used`

---

## §8.3 Registrar salida de visitante

```
PATCH /api/v1/visitors/{id}/exit
```

**Request:** (vacío o con timestamp manual)
```json
{
  "exit_time": "2026-06-23T18:45:00Z"
}
```

> [!note]
> `exit_time` es opcional. Si no se envía, el servidor usa el timestamp actual.

**Response `200`:**
```json
{
  "data": {
    "id": "vis-099",
    "status": "exited",
    "exit_time": "2026-06-23T18:45:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`, visita con `status = inside`
- **Side effects:**
  - Actualiza `status = exited` y `exit_time`

---

## §8.4 Ver detalle de visita

```
GET /api/v1/visitors/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "vis-001",
    "visitor_name": "Carlos Mendez",
    "visitor_document": "98765432",
    "unit": { "id": "...", "number": "101", "tower": "A" },
    "purpose": "Visita familiar",
    "status": "exited",
    "entry_time": "2026-06-23T14:30:00Z",
    "exit_time": "2026-06-23T18:45:00Z",
    "registered_by": "admin-uuid",
    "preauth_id": null
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo puede ver visitas a su propia unidad
  - `role = admin`: puede ver cualquier visita
- **Side effects:** ninguno — lectura pura

---

## §8.5 Crear preautorización de visita

```
POST /api/v1/visitors/preauth
```

**Request:**
```json
{
  "visitor_name": "Pedro Ramirez",
  "visitor_document": "11223344",
  "valid_from": "2026-06-25T08:00:00Z",
  "valid_until": "2026-06-25T22:00:00Z",
  "purpose": "Técnico de reparación"
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "preauth-001",
    "visitor_name": "Pedro Ramirez",
    "visitor_document": "11223344",
    "unit": { "id": "...", "number": "101", "tower": "A" },
    "valid_from": "2026-06-25T08:00:00Z",
    "valid_until": "2026-06-25T22:00:00Z",
    "purpose": "Técnico de reparación",
    "qr_code": "data:image/png;base64,...",
    "qr_token": "preauth-token-abc123",
    "status": "active",
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: crea preautorizaciones solo para su propia unidad
  - `role = admin`: puede crear preautorizaciones para cualquier unidad
  - `valid_until` no puede ser más de 7 días después de `valid_from`
- **Side effects:**
  - Crea registro en `visitor_preauths`
  - Genera QR con token único
  - El residente puede compartir el QR con el visitante

---

## §8.6 Listar preautorizaciones

```
GET /api/v1/visitors/preauth
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `active`, `used`, `expired` |
| `unit_id` | uuid | Filtrar por unidad (solo admin) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "preauth-001",
      "visitor_name": "Pedro Ramirez",
      "unit": { "id": "...", "number": "101", "tower": "A" },
      "valid_from": "2026-06-25T08:00:00Z",
      "valid_until": "2026-06-25T22:00:00Z",
      "status": "active",
      "created_at": "2026-06-23T10:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": { "page": 1, "per_page": 20, "total": 5, "total_pages": 1 }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo ve preautorizaciones de su propia unidad
  - `role = admin`: puede filtrar por `unit_id` o ver todas
- **Side effects:** ninguno — lectura pura

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Módulos relacionados: [[endpoints/NOTIFICACIONES]]
- Spec Web: [[02-web/features/visitantes/VISITANTES_SPEC]]
- Spec App: [[03-app/features/visitantes/VISITANTES_SPEC]]
- Panorama global: [[00-shared/features/VISITANTES]]
