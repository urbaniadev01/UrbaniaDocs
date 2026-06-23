---
type: reference
status: active
module: vehiculos
scope: api
tags: [api, endpoints, vehiculos, acceso]
updated: 2026-06-23
---

# Endpoints: Vehículos y Control de Acceso Vehicular

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Vehículos.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales, ver [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Rol | Estado |
|---|--------|------|------|-----|--------|
| 9.1 | GET | `/vehicles` | Sí | admin, user* | Diseñado |
| 9.2 | POST | `/vehicles` | Sí | admin | Diseñado |
| 9.3 | PATCH | `/vehicles/{id}` | Sí | admin | Diseñado |
| 9.4 | DELETE | `/vehicles/{id}` | Sí | admin | Diseñado |
| 9.5 | GET | `/vehicles/access-log` | Sí | admin | Diseñado |
| 9.6 | POST | `/vehicles/access-log` | Sí | admin | Diseñado |

> `*` Un residente puede ver los vehículos registrados a su unidad.

---

## §9.1 Listar vehículos

```
GET /api/v1/vehicles
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `unit_id` | uuid | Filtrar por unidad |
| `status` | string | `active`, `inactive` |
| `type` | string | `car`, `motorcycle`, `bicycle`, `other` |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 20) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "veh-001",
      "plate": "ABC123",
      "type": "car",
      "brand": "Toyota",
      "model": "Corolla",
      "color": "Gris",
      "year": 2021,
      "parking_spot": "P-15",
      "status": "active",
      "unit": { "id": "...", "number": "101", "tower": "A" }
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": { "page": 1, "per_page": 20, "total": 87, "total_pages": 5 }
  }
}
```

### Diseño

- **Precondiciones:** token válido
- **Reglas de negocio:**
  - `role = user`: solo ve los vehículos de su propia unidad
  - `role = admin`: puede filtrar por cualquier unidad o ver todos
- **Side effects:** ninguno — lectura pura

---

## §9.2 Registrar vehículo

```
POST /api/v1/vehicles
```

**Request:**
```json
{
  "plate": "XYZ789",
  "type": "motorcycle",
  "brand": "Honda",
  "model": "CB500",
  "color": "Negro",
  "year": 2023,
  "unit_id": "550e8400-e29b-41d4-a716-446655440000",
  "parking_spot": "M-03"
}
```

**Response `201`:**
```json
{
  "data": {
    "id": "veh-099",
    "plate": "XYZ789",
    "type": "motorcycle",
    "brand": "Honda",
    "model": "CB500",
    "color": "Negro",
    "year": 2023,
    "parking_spot": "M-03",
    "status": "active",
    "unit": { "id": "...", "number": "101", "tower": "A" },
    "created_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

**Response `409`:**
```json
{
  "error": {
    "code": "PLATE_ALREADY_REGISTERED",
    "message": "La placa XYZ789 ya está registrada en el sistema",
    "trace_id": "..."
  }
}
```

**Response `422`:**
```json
{
  "error": {
    "code": "VEHICLE_LIMIT_EXCEEDED",
    "message": "La unidad ya alcanzó el límite máximo de vehículos permitidos",
    "trace_id": "..."
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - La placa debe ser única en el sistema
  - El número máximo de vehículos por unidad es configurable (ver CONFIGURACION del conjunto)
  - `parking_spot` es opcional — puede no estar asignado
- **Side effects:** crea registro en `vehicles`

---

## §9.3 Editar vehículo

```
PATCH /api/v1/vehicles/{id}
```

**Request:** (todos los campos opcionales)
```json
{
  "color": "Blanco",
  "parking_spot": "M-07",
  "status": "inactive"
}
```

**Response `200`:**
```json
{
  "data": {
    "id": "veh-001",
    "plate": "ABC123",
    "color": "Blanco",
    "parking_spot": "M-07",
    "status": "inactive",
    "updated_at": "2026-06-23T10:00:00Z"
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - `plate` no es editable (identificador del recurso)
  - PATCH parcial — solo se actualizan los campos enviados
- **Side effects:** actualiza registro en `vehicles`

---

## §9.4 Eliminar vehículo

```
DELETE /api/v1/vehicles/{id}
```

**Response `204`:** (No Content)

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Reglas de negocio:**
  - El vehículo se elimina físicamente
  - El historial de accesos del vehículo se conserva (los registros de `access_log` no se borran)
- **Side effects:** elimina registro en `vehicles`

---

## §9.5 Ver log de acceso vehicular

```
GET /api/v1/vehicles/access-log
```

**Query params:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `vehicle_id` | uuid | Filtrar por vehículo |
| `unit_id` | uuid | Filtrar por unidad |
| `plate` | string | Filtrar por placa |
| `type` | string | `entry`, `exit` |
| `date` | date | Filtrar por fecha `YYYY-MM-DD` |
| `from` | date | Rango inicio |
| `to` | date | Rango fin |
| `page` | integer | Página (default: 1) |
| `per_page` | integer | Resultados por página (default: 50) |

**Response `200`:**
```json
{
  "data": [
    {
      "id": "log-001",
      "vehicle": {
        "id": "veh-001",
        "plate": "ABC123",
        "type": "car"
      },
      "unit": { "id": "...", "number": "101", "tower": "A" },
      "event_type": "entry",
      "timestamp": "2026-06-23T08:15:00Z",
      "registered_by": "admin-uuid",
      "notes": null
    }
  ],
  "meta": {
    "trace_id": "...",
    "pagination": { "page": 1, "per_page": 50, "total": 342, "total_pages": 7 }
  }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin`
- **Side effects:** ninguno — lectura pura

---

## §9.6 Registrar evento de acceso vehicular

```
POST /api/v1/vehicles/access-log
```

**Request:**
```json
{
  "plate": "ABC123",
  "event_type": "entry",
  "notes": null
}
```

> [!note]
> Se usa la placa como identificador para el registro. Si la placa está registrada en el sistema, se vincula automáticamente al vehículo y su unidad. Si no está registrada, se crea el log como "vehículo no registrado".

**Response `201`:**
```json
{
  "data": {
    "id": "log-099",
    "plate": "ABC123",
    "vehicle": { "id": "veh-001", "type": "car" },
    "unit": { "id": "...", "number": "101", "tower": "A" },
    "event_type": "entry",
    "timestamp": "2026-06-23T10:00:00Z",
    "registered_vehicle": true
  },
  "meta": { "trace_id": "..." }
}
```

### Diseño

- **Precondiciones:** token válido, `role = admin` (portero)
- **Reglas de negocio:**
  - Si la placa no está registrada en `vehicles`: el log se guarda con `registered_vehicle = false` y sin vincular a unidad
  - El admin puede registrar manualmente `exit` aunque no haya registro previo de `entry`
  - Pensado para uso manual en portería o futura integración con cámara ALPR
- **Side effects:** crea registro en `vehicle_access_logs`

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Módulos relacionados: [[endpoints/PROPIEDADES]], [[endpoints/RESIDENTES]]
- Spec Web: [[02-web/features/vehiculos/VEHICULOS_SPEC]]
- Spec App: [[03-app/features/vehiculos/VEHICULOS_SPEC]]
- Panorama global: [[00-shared/features/VEHICULOS]]
