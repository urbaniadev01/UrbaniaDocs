---
type: reference
status: active
module: properties
tags: [api, endpoints, condominiums]
updated: 2026-06-27
---

# Endpoints: Condominiums

> [!info] Consultar
> Documento de detalle de los endpoints del módulo Condominiums.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.
> Para el panorama global del feature, ver [[00-shared/features/PROPIEDADES]].

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Estado |
|---|--------|------|------|--------|
| 5.1 | GET | /condominiums | Sí (admin) | Diseñado |
| 5.2 | GET | /condominiums/{id} | Sí (admin) | Diseñado |
| 5.3 | PATCH | /condominiums/{id} | Sí (admin) | Diseñado |
| 5.4 | GET | /condominiums/{id}/coefficient-validation | Sí (admin) | Diseñado |

---

## §5.1 Listar condominiums

```
GET /api/v1/condominiums
```

**Headers:** Headers obligatorios estándar (ver [[API_CONTRACT]] §Convenciones Generales).

**Query params:**

| Parámetro | Tipo | Req | Descripción |
|-----------|------|-----|-------------|
| `page` | integer | no | Número de página (default: 1) |
| `per_page` | integer | no | Resultados por página (default: 15, max: 100) |
| `search` | string | no | Búsqueda por nombre o NIT |
| `is_active` | boolean | no | Filtrar por estado activo/inactivo |

**Response 200:**
```json
{
  "data": [
    {
      "id": "0190a1b2-c3d4-5678-9abc-def012345678",
      "name": "Conjunto Residencial San Rafael",
      "address": "Calle 123 # 45-67",
      "city": "Bogotá",
      "department": "Cundinamarca",
      "country": "Colombia",
      "nit": "900.000.000-1",
      "phone": "6012345678",
      "email": "admin@sanrafael.com",
      "legal_representative": "Carlos Méndez",
      "total_coefficient": "1.000000",
      "logo_url": null,
      "is_active": true,
      "stats": {
        "total_towers": 3,
        "total_units": 120,
        "occupied_units": 98,
        "vacant_units": 22
      },
      "created_at": "2026-06-27T12:00:00Z",
      "updated_at": "2026-06-27T12:00:00Z"
    }
  ],
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "current_page": 1,
    "per_page": 15,
    "total": 1,
    "last_page": 1
  }
}
```

**Response 403:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Solo los administradores pueden acceder a este recurso",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`.
- **Reglas de negocio:** El administrador ve todos los condominios del sistema (multi-tenant). El residente no tiene acceso a este endpoint.
- **Side effects:** Ninguno.
- **Casos borde:** Si no hay condominios registrados, retorna `data: []`.

---

## §5.2 Obtener detalle de condominium

```
GET /api/v1/condominiums/{id}
```

**Headers:** Headers obligatorios estándar.

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345678",
    "name": "Conjunto Residencial San Rafael",
    "address": "Calle 123 # 45-67",
    "city": "Bogotá",
    "department": "Cundinamarca",
    "country": "Colombia",
    "nit": "900.000.000-1",
    "phone": "6012345678",
    "email": "admin@sanrafael.com",
    "legal_representative": "Carlos Méndez",
    "total_coefficient": "1.000000",
    "logo_url": null,
    "is_active": true,
    "stats": {
      "total_towers": 3,
      "total_units": 120,
      "occupied_units": 98,
      "vacant_units": 22,
      "occupied_percentage": 81.67
    },
    "created_at": "2026-06-27T12:00:00Z",
    "updated_at": "2026-06-27T12:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONDOMINIUM_NOT_FOUND",
    "message": "El conjunto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. El condominium debe existir y no estar soft-deleted.
- **Reglas de negocio:** `stats` se calcula en tiempo real (COUNT sobre propiedades activas del condominium).
- **Side effects:** Ninguno.
- **Casos borde:** Si el condominium está soft-deleted, responde 404.

---

## §5.3 Actualizar condominium

```
PATCH /api/v1/condominiums/{id}
```

**Headers:** Headers obligatorios estándar.

**Request:**
```json
{
  "name": "Conjunto Residencial San Rafael (Actualizado)",
  "address": "Carrera 45 # 67-89",
  "phone": "6019876543",
  "email": "admin.nuevo@sanrafael.com",
  "legal_representative": "María López",
  "logo_url": "https://storage.urbania.com/logos/san-rafael.png"
}
```

> Todos los campos son opcionales en PATCH. Solo se actualizan los enviados.

**Response 200:**
```json
{
  "data": {
    "id": "0190a1b2-c3d4-5678-9abc-def012345678",
    "name": "Conjunto Residencial San Rafael (Actualizado)",
    "address": "Carrera 45 # 67-89",
    "city": "Bogotá",
    "department": "Cundinamarca",
    "country": "Colombia",
    "nit": "900.000.000-1",
    "phone": "6019876543",
    "email": "admin.nuevo@sanrafael.com",
    "legal_representative": "María López",
    "total_coefficient": "1.000000",
    "logo_url": "https://storage.urbania.com/logos/san-rafael.png",
    "is_active": true,
    "updated_at": "2026-06-27T14:00:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 400:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000",
    "errors": {
      "email": ["El email ya está registrado por otro condominio"],
      "total_coefficient": ["El coeficiente total no puede modificarse si hay unidades registradas"]
    }
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONDOMINIUM_NOT_FOUND",
    "message": "El conjunto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. Condominium debe existir.
- **Reglas de negocio:**
  - `total_coefficient` solo puede modificarse si no hay unidades registradas (`COUNT(properties) = 0`). Si hay unidades, el cambio requeriría recalcular todos los coeficientes — rechazar con error.
  - `nit` es UNIQUE y no puede duplicarse.
  - `city`, `department`, `country` solo se pueden modificar si no hay torres registradas (para mantener consistencia geográfica).
- **Side effects:** Si cambia el `name`, se refleja en todos los endpoints que muestren el nombre del conjunto. No hay notificaciones por este cambio.
- **Casos borde:** PATCH con body vacío retorna 200 con los datos actuales (no hay nada que cambiar).

---

## §5.4 Validar coeficientes del condominio

```
GET /api/v1/condominiums/{id}/coefficient-validation
```

**Headers:** Headers obligatorios estándar.

**Response 200:**
```json
{
  "data": {
    "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "condominium_name": "Conjunto Residencial San Rafael",
    "total_coefficient_expected": "1.000000",
    "total_coefficient_sum": "0.999998",
    "difference": "-0.000002",
    "is_balanced": false,
    "total_units": 120,
    "units_with_coefficient_zero": 0,
    "warnings": [
      {
        "type": "IMBALANCE",
        "message": "La suma de coeficientes (0.999998) difiere del total esperado (1.000000) en -0.000002"
      }
    ],
    "checked_at": "2026-06-27T17:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 200 (balanceado):**
```json
{
  "data": {
    "condominium_id": "0190a1b2-c3d4-5678-9abc-def012345001",
    "condominium_name": "Conjunto Residencial San Rafael",
    "total_coefficient_expected": "1.000000",
    "total_coefficient_sum": "1.000000",
    "difference": "0.000000",
    "is_balanced": true,
    "total_units": 120,
    "units_with_coefficient_zero": 0,
    "warnings": [],
    "checked_at": "2026-06-27T17:30:00Z"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "CONDOMINIUM_NOT_FOUND",
    "message": "El conjunto solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** Usuario autenticado con rol `admin`. El condominium debe existir y no estar soft-deleted.
- **Reglas de negocio:**
  - Calcula `SUM(coefficient)` de todas las unidades activas del condominio (excluyendo soft-deleted).
  - Compara con `condominiums.total_coefficient`.
  - `is_balanced = true` cuando `difference = 0` (considerando precisión NUMERIC(7,6)).
  - Si `total_units = 0`, retorna `is_balanced: true` con nota "Sin unidades registradas".
  - Si hay unidades con `coefficient = 0`, se listan en `warnings`.
- **Side effects:** Ninguno. Es endpoint de solo lectura.

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Esquema de base de datos: [[API_DATABASE]]
- Panorama global: [[00-shared/features/PROPIEDADES]]
- Detalle de torres: [[endpoints/TOWERS]]
- Detalle de propiedades: [[endpoints/PROPIEDADES]]
- Detalle de catálogos: [[endpoints/PROPERTY_CATALOGS]]
