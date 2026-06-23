---
type: reference
status: active
module: paquetes
scope: api
tags: [api, endpoints, paquetes]
updated: 2026-06-23
---

# Endpoints: Correspondencia y paquetes

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Correspondencia y paquetes.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

> [!note] Naturaleza del módulo
> Solo App; N/A en Web. El portero/admin registra paquetes recibidos en portería, notifica al residente y entrega contra firma. El residente ve los paquetes de su unidad y confirma recepción desde la app.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 18.1 | GET | `/packages` | Sí | admin, user | Diseñado |
| 18.2 | POST | `/packages` | Sí | admin | Diseñado |
| 18.3 | GET | `/packages/{id}` | Sí | admin, user* | Diseñado |
| 18.4 | POST | `/packages/{id}/notify` | Sí | admin | Diseñado |
| 18.5 | POST | `/packages/{id}/deliver` | Sí | admin, user | Diseñado |
| 18.6 | POST | `/packages/{id}/return` | Sí | admin | Diseñado |
| 18.7 | GET | `/packages/stats` | Sí | admin | Diseñado |

> `*` Un residente (`role = user`) solo puede ver paquetes de su propia unidad; cualquier otro `id` retorna `404` (no `403`, para no filtrar existencia).

---

## §18.1 Listar paquetes

```
GET /api/v1/packages
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `received`, `notified`, `delivered`, `returned` |
| `unit_id` | uuid | Filtrar por unidad destinataria |
| `carrier` | string | Filtrar por transportador (ej: `DHL`, `servientrega`) |
| `from` | date ISO 8601 | Fecha de recepción desde (inclusive) |
| `to` | date ISO 8601 | Fecha de recepción hasta (inclusive) |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20, max: 100) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "990e8400-e29b-41d4-a716-446655440001",
      "description": "Sobre Amazon",
      "carrier": "DHL",
      "tracking_code": "JD0012345678",
      "status": "notified",
      "recipient_unit": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "number": "101",
        "tower": "A"
      },
      "received_by_admin_id": "110e8400-e29b-41d4-a716-446655440010",
      "photo_url": null,
      "received_at": "2026-06-23T09:00:00Z",
      "notified_at": "2026-06-23T09:05:00Z",
      "delivered_at": null,
      "returned_at": null
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 42,
      "total_pages": 3
    }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: ve todos los paquetes del conjunto, puede usar cualquier filtro
  - `role = user`: solo ve paquetes de su unidad — los filtros `unit_id` ajeno se ignoran y se fuerza su `unit_id`
  - Orden descendente por `received_at`
- **Side effects:** ninguno — lectura pura

---

## §18.2 Registrar paquete recibido

```
POST /api/v1/packages
```

**Request:**
```json
{
  "description": "Caja mediana Mercadolibre",
  "carrier": "servientrega",
  "tracking_code": "SR000999111",
  "recipient_unit_id": "550e8400-e29b-41d4-a716-446655440000",
  "photo_url": "https://cdn.urbania.com/packages/990e...jpg"
}
```

> [!note]
> `carrier` y `tracking_code` son opcionales. `photo_url` es opcional. `description` y `recipient_unit_id` son obligatorios. El `received_by_admin_id` se toma del JWT del admin autenticado.

**Response `201`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "description": "Caja mediana Mercadolibre",
    "carrier": "servientrega",
    "tracking_code": "SR000999111",
    "status": "received",
    "recipient_unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A"
    },
    "received_by_admin_id": "110e8400-e29b-41d4-a716-446655440010",
    "photo_url": "https://cdn.urbania.com/packages/990e...jpg",
    "received_at": "2026-06-23T10:00:00Z",
    "notified_at": null,
    "delivered_at": null,
    "returned_at": null
  },
  "meta": { "trace_id": "..." }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo recipient_unit_id es obligatorio",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `recipient_unit_id` debe existir y estar activa
  - El paquete se crea en estado `received`
  - `received_by_admin_id` se setea con el `user_id` del JWT (no se acepta en el body)
- **Side effects:**
  - Crea registro en `packages`
  - Crea evento `received` en `package_events` (timestamp + actor = admin)
  - No notifica al residente automáticamente — usar §18.4 para notificar

---

## §18.3 Ver detalle de paquete

```
GET /api/v1/packages/{id}
```

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "description": "Caja mediana Mercadolibre",
    "carrier": "servientrega",
    "tracking_code": "SR000999111",
    "status": "delivered",
    "recipient_unit": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "number": "101",
      "tower": "A",
      "floor": 1
    },
    "received_by_admin_id": "110e8400-e29b-41d4-a716-446655440010",
    "photo_url": "https://cdn.urbania.com/packages/990e...jpg",
    "delivered_to_name": "Juan Perez",
    "signature_url": null,
    "timeline": [
      { "event": "received",  "at": "2026-06-23T10:00:00Z", "actor_id": "110e8400-e29b-41d4-a716-446655440010" },
      { "event": "notified",  "at": "2026-06-23T10:05:00Z", "actor_id": "110e8400-e29b-41d4-a716-446655440010" },
      { "event": "delivered", "at": "2026-06-23T18:30:00Z", "actor_id": "660e8400-e29b-41d4-a716-446655440001" }
    ],
    "received_at": "2026-06-23T10:00:00Z",
    "notified_at": "2026-06-23T10:05:00Z",
    "delivered_at": "2026-06-23T18:30:00Z",
    "returned_at": null,
    "created_at": "2026-06-23T10:00:00Z",
    "updated_at": "2026-06-23T18:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PACKAGE_NOT_FOUND",
    "message": "Paquete no encontrado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo puede ver paquetes de su unidad; `id` ajeno retorna `404`
  - `role = admin`: puede ver cualquier paquete
  - La respuesta incluye `timeline` con todos los eventos de `package_events` ordenados ascendentemente
- **Side effects:** ninguno — lectura pura

---

## §18.4 Notificar residente

```
POST /api/v1/packages/{id}/notify
```

**Request:** vacío

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "status": "notified",
    "notified_at": "2026-06-23T10:05:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PACKAGE_NOT_FOUND",
    "message": "Paquete no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PACKAGE_ALREADY_DELIVERED",
    "message": "El paquete ya fue entregado",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El paquete debe estar en estado `received`
  - Si está `delivered` → `409 PACKAGE_ALREADY_DELIVERED`
  - Si está `returned` → `409 PACKAGE_RETURNED`
  - Si ya está `notified` es idempotente: responde `200` sin re-enviar notificación
  - Cambia `status` a `notified` y setea `notified_at = NOW()`
- **Side effects:**
  - Actualiza `status` y `notified_at` en `packages`
  - Crea evento `notified` en `package_events` (actor = admin)
  - Emite notificación al residente de la unidad vía [[endpoints/NOTIFICACIONES]] con tipo `paquete_recibido`
    > [!warning] Sugerencia para ENUM de tipos
    > Añadir `paquete_recibido` al ENUM `notification_type` de NOTIFICACIONES (junto a `pago_recibido`, `visitante_autorizado`, etc.). Pendiente de sincronizar con [[endpoints/NOTIFICACIONES]] cuando se implemente.

---

## §18.5 Registrar entrega

```
POST /api/v1/packages/{id}/deliver
```

**Request:**
```json
{
  "delivered_to_name": "Juan Perez",
  "signature_url": "https://cdn.urbania.com/signatures/990e...png"
}
```

> [!note]
> Ambos campos opcionales. `delivered_to_name` describe quién recibe físicamente (puede ser el residente u otra persona autorizada en la unidad). `signature_url` es la firma digital o foto de confirmación. Si el `role = user` confirma desde la app, no se exige `delivered_to_name` (se asume el propio residente).

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "status": "delivered",
    "delivered_to_name": "Juan Perez",
    "signature_url": "https://cdn.urbania.com/signatures/990e...png",
    "delivered_at": "2026-06-23T18:30:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PACKAGE_NOT_FOUND",
    "message": "Paquete no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PACKAGE_NOT_NOTIFIED",
    "message": "No se puede entregar un paquete sin haber notificado al residente",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = admin`: puede entregar cualquier paquete (portería)
  - `role = user`: solo puede confirmar paquetes de su unidad (auto-entrega desde la app); `id` ajeno retorna `404`
  - El paquete debe estar en estado `notified` — si está `received` retorna `409 PACKAGE_NOT_NOTIFIED`
  - Si está `delivered` → `409 PACKAGE_ALREADY_DELIVERED`
  - Si está `returned` → `409 PACKAGE_RETURNED`
  - Cambia `status` a `delivered` y setea `delivered_at = NOW()`
- **Side effects:**
  - Actualiza `status`, `delivered_to_name`, `signature_url` y `delivered_at` en `packages`
  - Crea evento `delivered` en `package_events` (actor = admin o user según quien confirma)

---

## §18.6 Marcar como devuelto

```
POST /api/v1/packages/{id}/return
```

**Request:**
```json
{
  "reason": "Residente no reclamó en 7 días"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440002",
    "status": "returned",
    "reason": "Residente no reclamó en 7 días",
    "returned_at": "2026-06-30T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `404`:**
```json
{
  "error": {
    "code": "PACKAGE_NOT_FOUND",
    "message": "Paquete no encontrado",
    "trace_id": "..."
  }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PACKAGE_ALREADY_DELIVERED",
    "message": "El paquete ya fue entregado, no se puede devolver",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El paquete NO debe estar `delivered` — si lo está, retorna `409 PACKAGE_ALREADY_DELIVERED`
  - Si ya está `returned` → `409 PACKAGE_RETURNED`
  - Se puede devolver desde `received` o `notified` (típico: residente no reclama)
  - `reason` es obligatorio (máx 500 caracteres)
  - Cambia `status` a `returned` y setea `returned_at = NOW()`
- **Side effects:**
  - Actualiza `status`, `reason` y `returned_at` en `packages`
  - Crea evento `returned` en `package_events` (actor = admin)

---

## §18.7 Estadísticas de paquetes

```
GET /api/v1/packages/stats
```

> [!note] Uso
> Endpoint para el dashboard de portería: conteos rápidos por estado y pendientes de entrega.

**Response `200`:**
```json
{
  "data": {
    "by_status": {
      "received":  4,
      "notified":  7,
      "delivered": 53,
      "returned":  2
    },
    "pending_delivery": 11,
    "pending_delivery_older_than_7d": 3,
    "total_today": 12,
    "delivered_today": 8
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `pending_delivery` = `received` + `notified`
  - `pending_delivery_older_than_7d` = paquetes en `received` o `notified` con `received_at <= NOW() - 7 days`
  - `total_today` y `delivered_today` se calculan sobre la fecha actual UTC
- **Side effects:** ninguno — lectura pura

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Spec App: [[03-app/features/PAQUETES_SPEC]]
- Panorama global: [[00-shared/features/PAQUETES]]
- Notificaciones (side effect de §18.4): [[endpoints/NOTIFICACIONES]]
- Feature vecino (reglas de portería): [[00-shared/features/VISITANTES]]
