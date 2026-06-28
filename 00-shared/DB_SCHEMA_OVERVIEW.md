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

> [!note] Estado actual (2026-06-27)
> **Auth** (6 tablas) implementado con código. **Propiedades** (8 tablas) diseñado en [[00-shared/features/PROPIEDADES]], pendiente de implementar.
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
┌──────────────────────────────────────────────────────────────────────┐
│              AUTH (6 tablas) — implementado                           │
│  users ──< refresh_tokens      users ──< password_history             │
│  users ──< login_attempts      users ──< security_events              │
│  password_reset_tokens (PK: email)                                    │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ uploaded_by_user_id (FK)
                                │ changed_by_user_id (FK)
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  PROPIEDADES (8 tablas) — diseñado, pendiente de implementar         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  CONDOMINIUMS ──< TOWERS ──< PROPERTIES ──< PROPERTY_STATUS_LOG│  │
│  │       │                        │                               │  │
│  │       │                        └──< PROPERTY_DOCUMENTS         │  │
│  │       │                              ▲                         │  │
│  │       │                              │                         │  │
│  │       └──< PROPERTIES (denormalizado)  PROPERTY_DOCUMENT_TYPES  │  │
│  │                                                                  │  │
│  │  PROPERTY_TYPES ──< PROPERTIES (tipo configurable)              │  │
│  │  PROPERTY_STATUSES ──< PROPERTIES (estado configurable)         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  → Todo feature futuro (residentes, cobranza, pagos, visitantes,     │
│    mantenimiento, reservas) referencia properties.id vía unit_id.    │
└──────────────────────────────────────────────────────────────────────┘
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

### Propiedades (Diseñado — ver [[00-shared/features/PROPIEDADES]])

| Tabla | Descripción | FK principales |
|---|---|---|
| `condominiums` | Conjunto residencial / propiedad horizontal. Raíz del inventario | — |
| `towers` | Torre, bloque o sección dentro de un conjunto | `condominium_id → condominiums` |
| `property_types` | **Catálogo configurable** de tipos de unidad (apartamento, local, parqueadero, depósito, …) | — |
| `property_statuses` | **Catálogo configurable** de estados de unidad (ocupada, vacía, en venta, en remodelación, …) | — |
| `property_document_types` | **Catálogo configurable** de tipos de documento (escritura, plano, certificado_libertad, recibo_pago, contrato, otros, …) | — |
| `properties` | **Tabla central.** Unidad individual | `condominium_id → condominiums`, `tower_id → towers`, `property_type_id → property_types`, `property_status_id → property_statuses` |
| `property_status_log` | Auditoría de cambios de estado por unidad | `property_id → properties`, `from/to_status_id → property_statuses`, `changed_by_user_id → users` |
| `property_documents` | Documentos adjuntos por unidad (escrituras, planos) | `property_id → properties`, `property_document_type_id → property_document_types`, `uploaded_by_user_id → users` |

> El diccionario de campos completo de las 8 tablas está en [[00-shared/features/PROPIEDADES]] §6.

---

## Tablas Implementadas vs. Diseñadas

| Estado | Tablas |
|---|---|
| ✅ Implementadas | `users`, `refresh_tokens`, `password_history`, `login_attempts`, `security_events`, `password_reset_tokens` |
| 📐 Diseñadas (pendientes de implementar) | `condominiums`, `towers`, `property_types`, `property_statuses`, `property_document_types`, `properties`, `property_status_log`, `property_documents` |

> La fuente de verdad detallada con columnas, tipos, índices y ENUMs está en [[01-api/API_DATABASE]].

---

## Mantenimiento

Este documento se actualiza cuando `01-api/API_DATABASE.md` cambie, y cuando se rediseñe/implemente un feature. Reglas:
- Si se agrega una tabla nueva: agregar fila en la sección correspondiente + actualizar el diagrama.
- Si se elimina una tabla: quitarla del documento.
- Si cambia una FK principal: reflejar el cambio en la columna "FK principales".
- Cada feature define sus tablas en su §6 Modelo de datos antes de implementar.
