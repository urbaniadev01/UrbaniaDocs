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
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AUTH (6 tablas)                                │
│  users ──< refresh_tokens     users ──< password_history                    │
│  users ──< login_attempts     users ──< security_events                    │
│  password_reset_tokens (PK: email)                                          │
└────────────────────────┬────────────────────────────────────────────────────┘
                         │ user_id (NULLABLE)
                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PROPIEDADES (tabla base del sistema)                    │
│  ┌──────────┐                                                              │
│  │properties│─ tower, floor, number, type, area_m2, coefficient, status    │
│  └────┬─────┘                                                              │
│       │ unit_id (FK en casi todas las tablas de negocio)                    │
│       ▼                                                                     │
├───────┴─────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  RESIDENTES:  residents ──< residents_history                               │
│               residents.unit_id → properties.id                             │
│               residents.user_id → users.id (NULLABLE)                       │
│                                                                             │
│  FINANZAS:    properties ──< fees ──< payment_applications >── payments     │
│               properties ──< agreements ──< agreement_installments          │
│               payments ──< payment_applications >── fees                    │
│               payments ──< payment_applications >── agreement_installments  │
│                                                                             │
│  PRESUPUESTO: budgets ──< budget_lines >── budget_categories               │
│               budget_executions (cache mensual)                             │
│               reserve_fund (singleton) ──< reserve_fund_transactions        │
│                                                                             │
│  NOTIFICACIONES:  users ──< notifications                                  │
│                   users ──< notification_preferences                        │
│                   users ──< push_devices                                    │
│                                                                             │
│  COMUNICADOS:  announcements ──< announcement_read_receipts                │
│                announcements ──< announcement_attachments                  │
│                announcement_read_receipts >── users                         │
│                                                                             │
│  PQRS:  properties ──< pqrs ──< pqrs_messages                              │
│         residents ──< pqrs         pqrs ──< pqrs_attachments               │
│         users ──< pqrs (assigned)  pqrs ──< pqrs_status_history            │
│         pqrs ──< pqrs_ratings                                              │
│                                                                             │
│  ÓRDENES:  work_orders ──< work_order_photos                               │
│            work_orders ──< work_order_materials >── materials              │
│            work_orders ──< work_order_timelog                              │
│            work_orders.pqrs_id → pqrs.id (NULLABLE)                        │
│                                                                             │
│  ASAMBLEAS:  meetings ──< meeting_attendance >── properties                │
│              meetings ──< meeting_minutes                                   │
│              meetings ──< meeting_attachments                              │
│              meetings ──< polls ──< poll_options                           │
│              polls ──< poll_votes ──< poll_vote_options                    │
│              polls ──< poll_results_cache                                   │
│                                                                             │
│  ACCESO:  properties ──< visitors >── visitor_preauths                     │
│           properties ──< vehicles ──< vehicle_access_logs                  │
│                                                                             │
│  PAQUETES:  properties ──< packages ──< package_events                     │
│                                                                             │
│  RESERVAS:  amenities ──< bookings >── properties                          │
│                                                                             │
│  PROVEEDORES:  providers ──< provider_contracts ──< provider_attachments   │
│                                                                             │
│  MANTENIMIENTO:  assets ──< maintenance_records ──< maintenance_photos     │
│                                                                             │
│  CXP:  providers ──< payables ──< payable_approvals                        │
│        payables ──< payable_payments                                       │
│        payables ──< payable_attachments                                    │
│        payables.category_budget_line_id → budget_lines.id (NULLABLE)       │
│                                                                             │
│  AUDITORÍA:  audit_log (tabla compartida por todos los módulos)            │
└─────────────────────────────────────────────────────────────────────────────┘
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

### Propiedades (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `properties` | **Tabla base.** Unidades (apto, local, parqueadero, depósito) | — |

### Residentes (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `residents` | Personas que habitan las unidades (propietario/arrendatario/familiar) | `unit_id → properties`, `user_id → users` (NULLABLE) |
| `residents_history` | Historial de ocupación por unidad | `unit_id → properties`, `resident_id → residents` |

### Cuotas (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `fees` | Cuotas de administración por unidad y período | `unit_id → properties` |

### Pagos (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `payments` | Pagos registrados (efectivo, transferencia, cheque, online) | `unit_id → properties` |
| `payment_applications` | Distribución de un pago entre cuotas/intereses | `payment_id → payments`, `unit_id → properties`, `fee_id → fees` (NULLABLE), `agreement_installment_id → agreement_installments` (NULLABLE) |

### Mora (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `agreements` | Acuerdos de pago para unidades en mora | `unit_id → properties` |
| `agreement_installments` | Cuotas de un acuerdo de pago | `agreement_id → agreements` |

### Presupuesto (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `budgets` | Presupuestos anuales del conjunto (uno por año) | — |
| `budget_categories` | Catálogo de categorías (ingreso/egreso), jerarquizable | `parent_id → budget_categories` (NULLABLE) |
| `budget_lines` | Líneas de presupuesto por categoría | `budget_id → budgets`, `category_id → budget_categories` |
| `budget_executions` | Cache de ejecución mensual (opcional MVP) | `budget_line_id → budget_lines` |
| `reserve_fund` | Fondo de reserva (singleton) | — |
| `reserve_fund_transactions` | Aportes y retiros al fondo | — |

### Notificaciones (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `notifications` | Bandeja de notificaciones in-app | `user_id → users` |
| `notification_preferences` | Preferencias por canal (push/email) | `user_id → users` |
| `push_devices` | Dispositivos registrados para push | `user_id → users` |

### Comunicados (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `announcements` | Comunicados oficiales (borrador/publicado) | `created_by → users` |
| `announcement_read_receipts` | Confirmaciones de lectura | `announcement_id → announcements`, `user_id → users` |
| `announcement_attachments` | Adjuntos de comunicados (PDF, imágenes) | `announcement_id → announcements` (NULLABLE) |

### PQRS (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `pqrs` | Peticiones, Quejas, Reclamos, Sugerencias | `unit_id → properties`, `resident_id → residents`, `assigned_to → users` (NULLABLE) |
| `pqrs_messages` | Hilo de mensajes entre residente y admin | `pqrs_id → pqrs` |
| `pqrs_attachments` | Adjuntos de PQRS | `pqrs_id → pqrs`, `message_id → pqrs_messages` (NULLABLE) |
| `pqrs_status_history` | Timeline de cambios de estado | `pqrs_id → pqrs` |
| `pqrs_ratings` | Calificación de cierre (1-5 estrellas) | `pqrs_id → pqrs` (UNIQUE) |

### Órdenes de trabajo (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `work_orders` | Órdenes de mantenimiento correctivo | `area_ref_id → properties` (NULLABLE), `pqrs_id → pqrs` (NULLABLE), `technician_id → users` (NULLABLE) |
| `work_order_photos` | Evidencia fotográfica before/after | `work_order_id → work_orders` |
| `work_order_materials` | Materiales usados/reservados en una OT | `work_order_id → work_orders`, `material_id → materials` (NULLABLE) |
| `work_order_timelog` | Timeline de cambios de estado | `work_order_id → work_orders` |
| `materials` | Catálogo de materiales con stock | — |

### Asambleas (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `meetings` | Asambleas (ordinarias/extraordinarias) | `created_by → users` |
| `meeting_attendance` | Asistencia por unidad | `meeting_id → meetings`, `unit_id → properties` |
| `meeting_minutes` | Acta de la asamblea (una por meeting) | `meeting_id → meetings` (UNIQUE) |
| `meeting_attachments` | Documentos adjuntos a la convocatoria | `meeting_id → meetings` (NULLABLE) |

### Votaciones (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `polls` | Votaciones formales y encuestas | `meeting_id → meetings` (NULLABLE) |
| `poll_options` | Opciones de respuesta de una votación | `poll_id → polls` |
| `poll_votes` | Votos emitidos (trazabilidad interna) | `poll_id → polls`, `user_id → users`, `unit_id → properties` |
| `poll_vote_options` | Opciones marcadas en cada voto (para multiple_choice) | `poll_vote_id → poll_votes`, `option_id → poll_options` |
| `poll_results_cache` | Snapshot de resultados al cerrar (inmutable) | `poll_id → polls` (UNIQUE) |

### Control de visitantes (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `visitors` | Registro de ingresos/salidas de visitantes | `unit_id → properties`, `preauth_id → visitor_preauths` (NULLABLE) |
| `visitor_preauths` | Preautorizaciones con QR | `unit_id → properties` |

### Control de vehículos (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `vehicles` | Vehículos registrados por unidad | `unit_id → properties` |
| `vehicle_access_logs` | Log de ingresos/salidas vehiculares | `vehicle_id → vehicles` (NULLABLE), `unit_id → properties` (NULLABLE) |

### Paquetes (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `packages` | Paquetes recibidos en portería | `recipient_unit_id → properties` |
| `package_events` | Timeline de eventos del paquete | `package_id → packages` |

### Reservas (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `amenities` | Áreas comunes reservables (salón, BBQ, etc.) | — |
| `bookings` | Reservas de áreas comunes por residentes | `amenity_id → amenities`, `unit_id → properties`, `resident_id → residents` (NULLABLE) |

### Proveedores (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `providers` | Proveedores de servicios del conjunto | — |
| `provider_contracts` | Contratos vigentes/históricos | `provider_id → providers` |
| `provider_attachments` | Documentos adjuntos de contratos | `provider_contract_id → provider_contracts` (NULLABLE) |

### Mantenimiento preventivo (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `assets` | Activos físicos sujetos a mantenimiento | `provider_id → providers` (NULLABLE), `area_ref_id → amenities` (NULLABLE) |
| `maintenance_records` | Ejecuciones de mantenimiento | `asset_id → assets`, `technician_id → users` (NULLABLE), `provider_id → providers` (NULLABLE) |
| `maintenance_photos` | Fotos de evidencia del mantenimiento | `maintenance_record_id → maintenance_records` |

### Cuentas por pagar (Diseñado)

| Tabla | Descripción | FK principales |
|---|---|---|
| `payables` | Cuentas por pagar a proveedores | `provider_id → providers`, `category_budget_line_id → budget_lines` (NULLABLE) |
| `payable_approvals` | Historial de aprobaciones/rechazos | `payable_id → payables` |
| `payable_payments` | Pagos ejecutados (uno por payable) | `payable_id → payables` (UNIQUE) |
| `payable_attachments` | Facturas/soportes de la cuenta | `payable_id → payables` (NULLABLE) |

### Auditoría global

| Tabla | Descripción | FK principales |
|---|---|---|
| `audit_log` | Registro de auditoría de acciones de negocio | `actor_user_id → users` (NULLABLE). Tabla compartida por todos los módulos |

---

## Tablas Implementadas vs. Diseñadas

| Estado | Tablas |
|---|---|
| ✅ Implementadas | `users`, `refresh_tokens`, `password_history`, `login_attempts`, `security_events`, `password_reset_tokens` |
| 📐 Diseñadas (sin código) | Las 52 tablas de negocio restantes (properties → audit_log) |

> La fuente de verdad detallada con columnas, tipos, índices y ENUMs está en [[01-api/API_DATABASE]].

---

## Mantenimiento

Este documento se actualiza cuando `01-api/API_DATABASE.md` cambie. Reglas:
- Si se agrega una tabla nueva: agregar fila en la sección correspondiente + actualizar diagrama
- Si se elimina una tabla: quitarla del documento
- Si cambia una FK principal: reflejar el cambio en la columna "FK principales"
