---
type: reference
status: active
priority: P1
module: shared
tags: [database, schema, shared, reference]
updated: 2026-06-27
---

# 🗄️ DB_SCHEMA_OVERVIEW
## Resumen Visual de la Base de Datos — Urbania

> [!info] Propósito
> Mapa simplificado del esquema de base de datos para consulta rápida desde cualquier proyecto.
> **La fuente de verdad detallada** (columnas, tipos, índices, constraints) está en `01-api/API_DATABASE.md`.
> Este documento debe mantenerse sincronizado con ese archivo.

> [!note] Estado tras el reinicio de diseños (2026-06-27)
> Se eliminaron los diseños especulativos de features. Este resumen muestra solo lo que existe hoy:
> **Auth** (implementado, con código y tests) y **Propiedades** (en diseño, como ejemplo del método).
> El esquema **crece a medida que se rediseña cada feature**: la sección §6 "Modelo de datos" de cada
> panorama (ver [[FEATURE_PLANNING_TEMPLATE]]) define sus tablas, que al implementarse pasan a
> `01-api/API_DATABASE.md` y se reflejan aquí.

---

## Convenciones

| Regla | Valor |
|---|---|
| Motor | PostgreSQL 16 (Docker) |
| Todas las PK | `id` UUID v7 |
| FKs | `{tabla_singular}_id` |
| Timestamps | `created_at`, `updated_at` automáticos |
| Soft delete | `deleted_at` |
| Moneda | `NUMERIC(15,2)` (COP) |

---

## Diagrama de Relaciones (Texto)

```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTH (6 tablas) — implementado            │
│  users ──< refresh_tokens      users ──< password_history        │
│  users ──< login_attempts      users ──< security_events         │
│  password_reset_tokens (PK: email)                               │
└───────────────────────────────┬─────────────────────────────────┘
                                │ owner_user_id (NULLABLE)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              PROPIEDADES (tabla base) — en diseño                 │
│  properties ─ tower, floor, number, type, area_m2,               │
│               coefficient, status, owner_user_id (FK users)      │
│                                                                  │
│  → A futuro, las tablas de negocio (residents, fees, payments,   │
│    visitors, …) referenciarán properties.id vía unit_id.         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tablas por Módulo

### Auth (Implementado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `users` | Usuarios del sistema (admin/residente). Login, MFA, roles | — |
| `refresh_tokens` | Tokens refresh con rotación y device fingerprint | `user_id → users` |
| `password_history` | Últimas 12 contraseñas (evita reutilización) | `user_id → users` |
| `login_attempts` | Auditoría de intentos de login | `user_id → users` (NULLABLE) |
| `security_events` | Eventos de seguridad (login, MFA, bloqueos) | `user_id → users` (NULLABLE) |
| `password_reset_tokens` | Tokens de recuperación de contraseña (TTL 60 min) | PK: `email` |

### Propiedades (En diseño — ver [[00-shared/features/PROPIEDADES]])

| Tabla | Descripción | FK principales |
|---|---|---|
| `properties` | **Tabla base.** Unidades (apto, local, parqueadero, depósito) | `owner_user_id → users` (NULLABLE) |

> El diccionario de campos completo de `properties` está en [[00-shared/features/PROPIEDADES]] §6.

---

## Tablas Implementadas vs. Diseñadas

| Estado | Tablas |
|---|---|
| ✅ Implementadas | `users`, `refresh_tokens`, `password_history`, `login_attempts`, `security_events`, `password_reset_tokens` |
| 📐 En diseño | `properties` (ejemplo del método; el resto se diseña feature por feature) |

> La fuente de verdad detallada con columnas, tipos, índices y ENUMs está en [[01-api/API_DATABASE]].

---

## Mantenimiento

Este documento se actualiza cuando `01-api/API_DATABASE.md` cambie, y cuando se rediseñe/implemente un feature. Reglas:
- Si se agrega una tabla nueva: agregar fila en la sección correspondiente + actualizar el diagrama.
- Si se elimina una tabla: quitarla del documento.
- Si cambia una FK principal: reflejar el cambio en la columna "FK principales".
- Cada feature define sus tablas en su §6 Modelo de datos antes de implementar.
