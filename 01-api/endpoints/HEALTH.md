---
type: reference
status: active
module: system
tags: [api, endpoints, health, system]
updated: 2026-06-21
---

# Endpoints: Health Check

> [!info] Consultar
> Documento de detalle del endpoint de health check del sistema.
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.

---

## Endpoints en este documento

| # | Método | Ruta | Auth | Estado |
|---|--------|------|------|--------|
| 11.1 | GET | /health | No | Implementado |

---

## §11.1 Health Check

```
GET /api/v1/health
```

**Response 200 (Healthy):**
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "2026-05-20T16:00:00Z",
    "checks": {
      "database": {
        "healthy": true,
        "message": "Connected"
      },
      "redis": {
        "healthy": true,
        "message": "Connected"
      },
      "storage": {
        "healthy": true,
        "message": "Writable"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 503 (Unhealthy):**
```json
{
  "data": {
    "status": "unhealthy",
    "timestamp": "2026-05-20T16:00:00Z",
    "checks": {
      "database": {
        "healthy": false,
        "message": "Connection refused"
      },
      "redis": {
        "healthy": true,
        "message": "Connected"
      },
      "storage": {
        "healthy": true,
        "message": "Writable"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Diseño

- **Precondiciones:** ninguna — endpoint público, sin autenticación
- **Reglas de negocio:** verifica conectividad con database, Redis y storage. Si todos están healthy → 200. Si alguno falla → 503
- **Side effects:** ninguno — es una lectura de estado
- **Casos borde:** este es el **único endpoint** que usa `{ data: { status: "unhealthy", ... } }` con HTTP 503 en lugar del formato estándar de error `{ error: { code, message, trace_id } }`. Esto es intencional: un health check no representa un error de negocio, sino un estado del sistema

> [!note] Excepción al formato de error
> Ver [[API_AGENTS]] regla de oro #7: este endpoint es la única excepción al formato único de error. En estado unhealthy responde con `data` (no `error`) y HTTP 503.

---

## Referencias

- Índice general: [[API_CONTRACT]]
- Implementación: ver [[API_SETUP_GUIDE]] §10 para verificación post-setup
- Testing: ver [[API_TESTING]] §3.4 para feature tests del endpoint
