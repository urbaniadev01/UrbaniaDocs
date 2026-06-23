---
type: reference
status: active
module: contract
scope: cross-project
tags: [api, endpoints, rest, cross-project, dictionary]
updated: 2026-06-23
---

# 🔌 API_CONTRACT
## Diccionario de Endpoints de Urbania API

> [!info] Propósito
> **Fuente única de endpoints**: Este es el documento índice de TODOS los endpoints del proyecto.
> Contiene el índice maestro, convenciones globales, flujos comunes, códigos de error y rate limiting.
> El **detalle** de cada endpoint (request, response, errores, diseño, flujo) vive en `01-api/endpoints/<FEATURE>.md`.

> [!warning] Regla de fuente de verdad
> NINGÚN documento fuera de `01-api/` contiene request/response de un endpoint.
> Todos los documentos que necesiten referenciar un endpoint citan este documento o el documento
> de detalle correspondiente en `01-api/endpoints/`.
> Ver [[00-shared/SYSTEM_CONTRACT]] §1 para el contrato formal entre proyectos.

> [!note] Alcance actual
> Endpoints **implementados**: Auth (`/auth/*`, §1.x) + Health Check (`/health`, §11.1). Módulo Auth cerrado y congelado (ver [[API_SESSION_MANIFEST]]).
> Endpoints **diseñados**: 21 módulos de negocio documentados en `01-api/endpoints/` con estado "Diseñado" (sin código todavía) — sirven de contrato base para implementar las próximas sesiones del [[API_IMPLEMENTATION_PLAN]]. A medida que un módulo se implemente, sus filas del índice cambian a "Implementado" en esa misma sesión. Ver también [[00-shared/FEATURES_INDEX]] y [[00-shared/FEATURES_Y_PANTALLAS]].

---

## Índice de Endpoints

> [!info] Convención de numeración
> El primer número de cada `§N.M` identifica el módulo al que pertenece un endpoint (ej: §2 = Propiedades, §17 = Votaciones). El número de módulo NO sigue el orden de `FEATURES_INDEX` sino un orden lógico por dependencias (ver `00-shared/FEATURES_Y_PANTALLAS` para el orden de creación). §11 está reservado para `Health Check` (infraestructura, no negocio).

### §1 — Auth (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|--------|------|------|--------|-----------|
| 1.1 | POST | `/auth/login` | No | Implementado | [[endpoints/AUTH]] §1.1 |
| 1.2 | POST | `/auth/register` | No | Implementado | [[endpoints/AUTH]] §1.2 |
| 1.3 | POST | `/auth/logout` | Sí | Implementado | [[endpoints/AUTH]] §1.3 |
| 1.4 | POST | `/auth/refresh` | No (refresh_token en body) | Implementado | [[endpoints/AUTH]] §1.4 |
| 1.5 | GET | `/auth/me` | Sí | Implementado | [[endpoints/AUTH]] §1.5 |
| 1.6 | POST | `/auth/forgot-password` | No | Implementado | [[endpoints/AUTH]] §1.6 |
| 1.7 | POST | `/auth/reset-password` | No | Implementado | [[endpoints/AUTH]] §1.7 |
| 1.8 | GET | `/auth/sessions` | Sí | Implementado | [[endpoints/AUTH]] §1.8 |
| 1.9 | DELETE | `/auth/sessions` | Sí | Implementado | [[endpoints/AUTH]] §1.9 |
| 1.10 | DELETE | `/auth/sessions/{session_id}` | Sí | Implementado | [[endpoints/AUTH]] §1.10 |
| 1.11 | POST | `/auth/change-password` | Sí | Implementado | [[endpoints/AUTH]] §1.11 |
| 1.12 | POST | `/auth/verify-email` | No | Implementado | [[endpoints/AUTH]] §1.12 |
| 1.13 | POST | `/auth/resend-verification` | Sí | Implementado | [[endpoints/AUTH]] §1.13 |
| 1.14 | PATCH | `/auth/me` | Sí | Implementado | [[endpoints/AUTH]] §1.14 |
| 1.15 | POST | `/auth/mfa/setup` | Sí | Implementado | [[endpoints/AUTH]] §1.15 |
| 1.16 | POST | `/auth/mfa/verify` | No* | Implementado | [[endpoints/AUTH]] §1.16 |
| 1.17 | POST | `/auth/mfa/verify-backup` | No* | Implementado | [[endpoints/AUTH]] §1.17 |
| 1.18 | POST | `/auth/mfa/enable` | Sí | Implementado | [[endpoints/AUTH]] §1.18 |
| 1.19 | POST | `/auth/mfa/disable` | Sí | Implementado | [[endpoints/AUTH]] §1.19 |
| 1.20 | POST | `/auth/mfa/backup-codes` | Sí | Implementado | [[endpoints/AUTH]] §1.20 |

> `*` `/auth/mfa/verify` y `/auth/mfa/verify-backup` se usan tanto durante login (sin token, tras credenciales válidas) como ya autenticado; ver [[endpoints/AUTH]] §1.16-§1.17.

### §2 — Propiedades y unidades (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 2.1 | GET | `/properties` | Sí | admin, user | Diseñado | [[endpoints/PROPIEDADES]] §2.1 |
| 2.2 | POST | `/properties` | Sí | admin | Diseñado | [[endpoints/PROPIEDADES]] §2.2 |
| 2.3 | GET | `/properties/{id}` | Sí | admin, user | Diseñado | [[endpoints/PROPIEDADES]] §2.3 |
| 2.4 | PATCH | `/properties/{id}` | Sí | admin | Diseñado | [[endpoints/PROPIEDADES]] §2.4 |
| 2.5 | DELETE | `/properties/{id}` | Sí | admin | Diseñado | [[endpoints/PROPIEDADES]] §2.5 |
| 2.6 | PATCH | `/properties/{id}/status` | Sí | admin | Diseñado | [[endpoints/PROPIEDADES]] §2.6 |

### §3 — Residentes y propietarios (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 3.1 | GET | `/residents` | Sí | admin | Diseñado | [[endpoints/RESIDENTES]] §3.1 |
| 3.2 | POST | `/residents` | Sí | admin | Diseñado | [[endpoints/RESIDENTES]] §3.2 |
| 3.3 | GET | `/residents/{id}` | Sí | admin, user* | Diseñado | [[endpoints/RESIDENTES]] §3.3 |
| 3.4 | PATCH | `/residents/{id}` | Sí | admin | Diseñado | [[endpoints/RESIDENTES]] §3.4 |
| 3.5 | PATCH | `/residents/{id}/unit` | Sí | admin | Diseñado | [[endpoints/RESIDENTES]] §3.5 |
| 3.6 | PATCH | `/residents/{id}/status` | Sí | admin | Diseñado | [[endpoints/RESIDENTES]] §3.6 |

### §4 — Cuotas de administración (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 4.1 | GET | `/fees` | Sí | admin | Diseñado | [[endpoints/CUOTAS]] §4.1 |
| 4.2 | POST | `/fees/generate` | Sí | admin | Diseñado | [[endpoints/CUOTAS]] §4.2 |
| 4.3 | GET | `/fees/unit/{unit_id}` | Sí | admin, user* | Diseñado | [[endpoints/CUOTAS]] §4.3 |
| 4.4 | PATCH | `/fees/{id}/adjust` | Sí | admin | Diseñado | [[endpoints/CUOTAS]] §4.4 |
| 4.5 | GET | `/fees/{id}/breakdown` | Sí | admin, user* | Diseñado | [[endpoints/CUOTAS]] §4.5 |

### §5 — Pagos y recibos (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 5.1 | GET | `/payments` | Sí | admin, user* | Diseñado | [[endpoints/PAGOS]] §5.1 |
| 5.2 | POST | `/payments` | Sí | admin | Diseñado | [[endpoints/PAGOS]] §5.2 |
| 5.3 | GET | `/payments/{id}` | Sí | admin, user* | Diseñado | [[endpoints/PAGOS]] §5.3 |
| 5.4 | POST | `/payments/{id}/void` | Sí | admin | Diseñado | [[endpoints/PAGOS]] §5.4 |
| 5.5 | GET | `/payments/{id}/receipt` | Sí | admin, user* | Diseñado | [[endpoints/PAGOS]] §5.5 |

### §6 — Cartera de mora (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 6.1 | GET | `/arrears` | Sí | admin | Diseñado | [[endpoints/MORA]] §6.1 |
| 6.2 | GET | `/arrears/unit/{unit_id}` | Sí | admin, user* | Diseñado | [[endpoints/MORA]] §6.2 |
| 6.3 | POST | `/arrears/agreements` | Sí | admin | Diseñado | [[endpoints/MORA]] §6.3 |
| 6.4 | GET | `/arrears/agreements/{id}` | Sí | admin | Diseñado | [[endpoints/MORA]] §6.4 |
| 6.5 | PATCH | `/arrears/agreements/{id}/status` | Sí | admin | Diseñado | [[endpoints/MORA]] §6.5 |

### §7 — Reservas de áreas comunes (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 7.1 | GET | `/amenities` | Sí | admin, user | Diseñado | [[endpoints/RESERVAS]] §7.1 |
| 7.2 | POST | `/amenities` | Sí | admin | Diseñado | [[endpoints/RESERVAS]] §7.2 |
| 7.3 | PATCH | `/amenities/{id}` | Sí | admin | Diseñado | [[endpoints/RESERVAS]] §7.3 |
| 7.4 | GET | `/bookings` | Sí | admin, user* | Diseñado | [[endpoints/RESERVAS]] §7.4 |
| 7.5 | POST | `/bookings` | Sí | admin, user | Diseñado | [[endpoints/RESERVAS]] §7.5 |
| 7.6 | GET | `/bookings/{id}` | Sí | admin, user* | Diseñado | [[endpoints/RESERVAS]] §7.6 |
| 7.7 | POST | `/bookings/{id}/approve` | Sí | admin | Diseñado | [[endpoints/RESERVAS]] §7.7 |
| 7.8 | POST | `/bookings/{id}/reject` | Sí | admin | Diseñado | [[endpoints/RESERVAS]] §7.8 |
| 7.9 | POST | `/bookings/{id}/cancel` | Sí | admin, user* | Diseñado | [[endpoints/RESERVAS]] §7.9 |

### §8 — Control de visitantes (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 8.1 | GET | `/visitors` | Sí | admin | Diseñado | [[endpoints/VISITANTES]] §8.1 |
| 8.2 | POST | `/visitors` | Sí | admin | Diseñado | [[endpoints/VISITANTES]] §8.2 |
| 8.3 | PATCH | `/visitors/{id}/exit` | Sí | admin | Diseñado | [[endpoints/VISITANTES]] §8.3 |
| 8.4 | GET | `/visitors/{id}` | Sí | admin, user* | Diseñado | [[endpoints/VISITANTES]] §8.4 |
| 8.5 | POST | `/visitors/preauth` | Sí | admin, user | Diseñado | [[endpoints/VISITANTES]] §8.5 |
| 8.6 | GET | `/visitors/preauth` | Sí | admin, user* | Diseñado | [[endpoints/VISITANTES]] §8.6 |

### §9 — Control de vehículos (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 9.1 | GET | `/vehicles` | Sí | admin, user* | Diseñado | [[endpoints/VEHICULOS]] §9.1 |
| 9.2 | POST | `/vehicles` | Sí | admin | Diseñado | [[endpoints/VEHICULOS]] §9.2 |
| 9.3 | PATCH | `/vehicles/{id}` | Sí | admin | Diseñado | [[endpoints/VEHICULOS]] §9.3 |
| 9.4 | DELETE | `/vehicles/{id}` | Sí | admin | Diseñado | [[endpoints/VEHICULOS]] §9.4 |
| 9.5 | GET | `/vehicles/access-log` | Sí | admin | Diseñado | [[endpoints/VEHICULOS]] §9.5 |
| 9.6 | POST | `/vehicles/access-log` | Sí | admin | Diseñado | [[endpoints/VEHICULOS]] §9.6 |

### §10 — Presupuesto y fondo de reserva (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 10.1 | GET | `/budgets` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.1 |
| 10.2 | POST | `/budgets` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.2 |
| 10.3 | GET | `/budgets/{id}` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.3 |
| 10.4 | PATCH | `/budgets/{id}` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.4 |
| 10.5 | GET | `/budgets/{id}/lines` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.5 |
| 10.6 | POST | `/budgets/{id}/lines` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.6 |
| 10.7 | PATCH | `/budgets/{id}/lines/{line_id}` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.7 |
| 10.8 | DELETE | `/budgets/{id}/lines/{line_id}` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.8 |
| 10.9 | GET | `/budgets/{id}/execution` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.9 |
| 10.10 | GET | `/reserve-fund` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.10 |
| 10.11 | POST | `/reserve-fund/transactions` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.11 |
| 10.12 | GET | `/reserve-fund/transactions` | Sí | admin | Diseñado | [[endpoints/PRESUPUESTO]] §10.12 |

### §11 — Health Check (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|--------|------|------|--------|-----------|
| 11.1 | GET | `/health` | No | Implementado | [[endpoints/HEALTH]] §11.1 |

### §12 — Notificaciones (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 12.1 | GET | `/notifications` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.1 |
| 12.2 | GET | `/notifications/unread-count` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.2 |
| 12.3 | PATCH | `/notifications/{id}` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.3 |
| 12.4 | POST | `/notifications/read-all` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.4 |
| 12.5 | GET | `/notifications/preferences` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.5 |
| 12.6 | PATCH | `/notifications/preferences` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.6 |
| 12.7 | POST | `/notifications/devices` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.7 |
| 12.8 | DELETE | `/notifications/devices/{device_id}` | Sí | admin, user | Diseñado | [[endpoints/NOTIFICACIONES]] §12.8 |

### §13 — Comunicados y circulares (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 13.1 | GET | `/announcements` | Sí | admin, user | Diseñado | [[endpoints/COMUNICADOS]] §13.1 |
| 13.2 | POST | `/announcements` | Sí | admin | Diseñado | [[endpoints/COMUNICADOS]] §13.2 |
| 13.3 | GET | `/announcements/{id}` | Sí | admin, user* | Diseñado | [[endpoints/COMUNICADOS]] §13.3 |
| 13.4 | PATCH | `/announcements/{id}` | Sí | admin | Diseñado | [[endpoints/COMUNICADOS]] §13.4 |
| 13.5 | POST | `/announcements/{id}/publish` | Sí | admin | Diseñado | [[endpoints/COMUNICADOS]] §13.5 |
| 13.6 | POST | `/announcements/{id}/read` | Sí | user | Diseñado | [[endpoints/COMUNICADOS]] §13.6 |
| 13.7 | GET | `/announcements/{id}/read-receipts` | Sí | admin | Diseñado | [[endpoints/COMUNICADOS]] §13.7 |
| 13.8 | DELETE | `/announcements/{id}` | Sí | admin | Diseñado | [[endpoints/COMUNICADOS]] §13.8 |

### §14 — PQRS (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 14.1 | GET | `/pqrs` | Sí | admin, user* | Diseñado | [[endpoints/PQRS]] §14.1 |
| 14.2 | POST | `/pqrs` | Sí | admin, user | Diseñado | [[endpoints/PQRS]] §14.2 |
| 14.3 | GET | `/pqrs/{id}` | Sí | admin, user* | Diseñado | [[endpoints/PQRS]] §14.3 |
| 14.4 | POST | `/pqrs/{id}/messages` | Sí | admin, user | Diseñado | [[endpoints/PQRS]] §14.4 |
| 14.5 | PATCH | `/pqrs/{id}/assign` | Sí | admin | Diseñado | [[endpoints/PQRS]] §14.5 |
| 14.6 | PATCH | `/pqrs/{id}/status` | Sí | admin | Diseñado | [[endpoints/PQRS]] §14.6 |
| 14.7 | POST | `/pqrs/{id}/rate` | Sí | user | Diseñado | [[endpoints/PQRS]] §14.7 |
| 14.8 | GET | `/pqrs/types` | Sí | admin, user | Diseñado | [[endpoints/PQRS]] §14.8 |
| 14.9 | GET | `/pqrs/{id}/attachments/{attachment_id}` | Sí | admin, user* | Diseñado | [[endpoints/PQRS]] §14.9 |

### §15 — Órdenes de trabajo (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 15.1 | GET | `/work-orders` | Sí | admin, technician*, user* | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.1 |
| 15.2 | POST | `/work-orders` | Sí | admin | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.2 |
| 15.3 | GET | `/work-orders/{id}` | Sí | admin, technician*, user* | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.3 |
| 15.4 | PATCH | `/work-orders/{id}` | Sí | admin | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.4 |
| 15.5 | PATCH | `/work-orders/{id}/assign` | Sí | admin | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.5 |
| 15.6 | PATCH | `/work-orders/{id}/reschedule` | Sí | admin, technician* | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.6 |
| 15.7 | POST | `/work-orders/{id}/start` | Sí | admin, technician* | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.7 |
| 15.8 | POST | `/work-orders/{id}/complete` | Sí | admin, technician* | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.8 |
| 15.9 | POST | `/work-orders/{id}/cancel` | Sí | admin | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.9 |
| 15.10 | POST | `/work-orders/{id}/photos` | Sí | admin, technician* | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.10 |
| 15.11 | GET | `/work-orders/areas` | Sí | admin | Diseñado | [[endpoints/ORDENES-TRABAJO]] §15.11 |

### §16 — Asambleas (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 16.1 | GET | `/meetings` | Sí | admin, user | Diseñado | [[endpoints/ASAMBLEAS]] §16.1 |
| 16.2 | POST | `/meetings` | Sí | admin | Diseñado | [[endpoints/ASAMBLEAS]] §16.2 |
| 16.3 | GET | `/meetings/{id}` | Sí | admin, user | Diseñado | [[endpoints/ASAMBLEAS]] §16.3 |
| 16.4 | PATCH | `/meetings/{id}` | Sí | admin | Diseñado | [[endpoints/ASAMBLEAS]] §16.4 |
| 16.5 | POST | `/meetings/{id}/cancel` | Sí | admin | Diseñado | [[endpoints/ASAMBLEAS]] §16.5 |
| 16.6 | POST | `/meetings/{id}/attendance` | Sí | admin | Diseñado | [[endpoints/ASAMBLEAS]] §16.6 |
| 16.7 | GET | `/meetings/{id}/attendance` | Sí | admin, user* | Diseñado | [[endpoints/ASAMBLEAS]] §16.7 |
| 16.8 | POST | `/meetings/{id}/minutes` | Sí | admin | Diseñado | [[endpoints/ASAMBLEAS]] §16.8 |
| 16.9 | GET | `/meetings/{id}/minutes` | Sí | admin, user | Diseñado | [[endpoints/ASAMBLEAS]] §16.9 |
| 16.10 | POST | `/meetings/{id}/close` | Sí | admin | Diseñado | [[endpoints/ASAMBLEAS]] §16.10 |

### §17 — Votaciones y encuestas (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 17.1 | GET | `/polls` | Sí | admin, user | Diseñado | [[endpoints/VOTACIONES]] §17.1 |
| 17.2 | POST | `/polls` | Sí | admin | Diseñado | [[endpoints/VOTACIONES]] §17.2 |
| 17.3 | GET | `/polls/{id}` | Sí | admin, user | Diseñado | [[endpoints/VOTACIONES]] §17.3 |
| 17.4 | PATCH | `/polls/{id}` | Sí | admin | Diseñado | [[endpoints/VOTACIONES]] §17.4 |
| 17.5 | POST | `/polls/{id}/open` | Sí | admin | Diseñado | [[endpoints/VOTACIONES]] §17.5 |
| 17.6 | POST | `/polls/{id}/vote` | Sí | user | Diseñado | [[endpoints/VOTACIONES]] §17.6 |
| 17.7 | POST | `/polls/{id}/close` | Sí | admin | Diseñado | [[endpoints/VOTACIONES]] §17.7 |
| 17.8 | GET | `/polls/{id}/results` | Sí | admin, user* | Diseñado | [[endpoints/VOTACIONES]] §17.8 |
| 17.9 | POST | `/polls/{id}/revoke-vote` | Sí | user | Diseñado | [[endpoints/VOTACIONES]] §17.9 |
| 17.10 | GET | `/polls/{id}/my-vote` | Sí | user | Diseñado | [[endpoints/VOTACIONES]] §17.10 |

### §18 — Correspondencia y paquetes (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 18.1 | GET | `/packages` | Sí | admin, user* | Diseñado | [[endpoints/PAQUETES]] §18.1 |
| 18.2 | POST | `/packages` | Sí | admin | Diseñado | [[endpoints/PAQUETES]] §18.2 |
| 18.3 | GET | `/packages/{id}` | Sí | admin, user* | Diseñado | [[endpoints/PAQUETES]] §18.3 |
| 18.4 | POST | `/packages/{id}/notify` | Sí | admin | Diseñado | [[endpoints/PAQUETES]] §18.4 |
| 18.5 | POST | `/packages/{id}/deliver` | Sí | admin, user | Diseñado | [[endpoints/PAQUETES]] §18.5 |
| 18.6 | POST | `/packages/{id}/return` | Sí | admin | Diseñado | [[endpoints/PAQUETES]] §18.6 |
| 18.7 | GET | `/packages/stats` | Sí | admin | Diseñado | [[endpoints/PAQUETES]] §18.7 |

### §19 — Mantenimiento preventivo (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 19.1 | GET | `/assets` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.1 |
| 19.2 | POST | `/assets` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.2 |
| 19.3 | GET | `/assets/{id}` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.3 |
| 19.4 | PATCH | `/assets/{id}` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.4 |
| 19.5 | DELETE | `/assets/{id}` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.5 |
| 19.6 | GET | `/maintenance-records` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.6 |
| 19.7 | POST | `/maintenance-records` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.7 |
| 19.8 | POST | `/maintenance-records/{id}/execute` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.8 |
| 19.9 | PATCH | `/maintenance-records/{id}` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.9 |
| 19.10 | POST | `/maintenance-records/{id}/cancel` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.10 |
| 19.11 | POST | `/assets/{id}/schedule-next` | Sí | admin | Diseñado | [[endpoints/MANTENIMIENTO]] §19.11 |

### §20 — Proveedores y contratos (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 20.1 | GET | `/providers` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.1 |
| 20.2 | POST | `/providers` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.2 |
| 20.3 | GET | `/providers/{id}` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.3 |
| 20.4 | PATCH | `/providers/{id}` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.4 |
| 20.5 | DELETE | `/providers/{id}` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.5 |
| 20.6 | GET | `/providers/{id}/contracts` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.6 |
| 20.7 | POST | `/providers/{id}/contracts` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.7 |
| 20.8 | GET | `/providers/{id}/contracts/{contract_id}` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.8 |
| 20.9 | PATCH | `/providers/{id}/contracts/{contract_id}` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.9 |
| 20.10 | POST | `/providers/{id}/contracts/{contract_id}/terminate` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.10 |
| 20.11 | GET | `/providers/expiring-contracts` | Sí | admin | Diseñado | [[endpoints/PROVEEDORES]] §20.11 |

### §21 — Cuentas por pagar (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 21.1 | GET | `/payables` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.1 |
| 21.2 | POST | `/payables` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.2 |
| 21.3 | GET | `/payables/{id}` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.3 |
| 21.4 | PATCH | `/payables/{id}` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.4 |
| 21.5 | POST | `/payables/{id}/approve` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.5 |
| 21.6 | POST | `/payables/{id}/reject` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.6 |
| 21.7 | POST | `/payables/{id}/payment` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.7 |
| 21.8 | POST | `/payables/{id}/void` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.8 |
| 21.9 | GET | `/payables/summary` | Sí | admin | Diseñado | [[endpoints/CUENTAS-PAGAR]] §21.9 |

### §22 — Informes financieros y asamblea (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 22.1 | GET | `/reports/financial-monthly` | Sí | admin | Diseñado | [[endpoints/INFORMES]] §22.1 |
| 22.2 | GET | `/reports/debtors` | Sí | admin | Diseñado | [[endpoints/INFORMES]] §22.2 |
| 22.3 | GET | `/reports/assembly` | Sí | admin | Diseñado | [[endpoints/INFORMES]] §22.3 |
| 22.4 | GET | `/reports/payments-summary` | Sí | admin, user* | Diseñado | [[endpoints/INFORMES]] §22.4 |
| 22.5 | GET | `/reports/occupancy` | Sí | admin | Diseñado | [[endpoints/INFORMES]] §22.5 |
| 22.6 | GET | `/reports/auditing-log` | Sí | admin | Diseñado | [[endpoints/INFORMES]] §22.6 |
| 22.7 | GET | `/reports/{report_id}/download` | Sí | admin, user* | Diseñado | [[endpoints/INFORMES]] §22.7 |

### §23 — KPI Dashboard (Diseñado)

| # | Método | Ruta | Auth | Rol | Estado | Documento |
|---|--------|------|------|-----|--------|-----------|
| 23.1 | GET | `/dashboard` | Sí | admin | Diseñado | [[endpoints/DASHBOARD]] §23.1 |
| 23.2 | GET | `/dashboard/collection-rate` | Sí | admin | Diseñado | [[endpoints/DASHBOARD]] §23.2 |
| 23.3 | GET | `/dashboard/arrears` | Sí | admin | Diseñado | [[endpoints/DASHBOARD]] §23.3 |
| 23.4 | GET | `/dashboard/pqrs-status` | Sí | admin | Diseñado | [[endpoints/DASHBOARD]] §23.4 |
| 23.5 | GET | `/dashboard/visitors-today` | Sí | admin | Diseñado | [[endpoints/DASHBOARD]] §23.5 |
| 23.6 | GET | `/dashboard/upcoming-meetings` | Sí | admin | Diseñado | [[endpoints/DASHBOARD]] §23.6 |

### §C — Configuración (Implementado vía AUTH)

> [!note] Sin endpoints nuevos
> El feature **Configuración** no introduce endpoints propios: reorganiza los endpoints de Auth ya implementados (§1.x) desde la perspectiva de las pantallas de "Perfil / Seguridad / MFA / Sesiones". Ver [[CONFIGURACION]] para el mapeo pantalla → endpoint Auth.

| Pantalla | Endpoint(s) usado(s) | Estado | Documento |
|----------|----------------------|--------|-----------|
| Perfil | `GET /auth/me`, `PATCH /auth/me` (§1.5, §1.14) | Implementado | [[endpoints/CONFIGURACION]] §C.1 |
| Cambiar contraseña | `POST /auth/change-password` (§1.11) | Implementado | [[endpoints/CONFIGURACION]] §C.2 |
| Sesiones activas | `GET/DELETE /auth/sessions` (§1.8, §1.9, §1.10) | Implementado | [[endpoints/CONFIGURACION]] §C.3 |
| Setup MFA | `POST /auth/mfa/setup`, `POST /auth/mfa/enable` (§1.15, §1.18) | Implementado | [[endpoints/CONFIGURACION]] §C.4 |
| Gestionar MFA | `POST /auth/mfa/disable`, `POST /auth/mfa/backup-codes` (§1.19, §1.20) | Implementado | [[endpoints/CONFIGURACION]] §C.5 |

> Todas las rutas llevan el prefijo `/api/v1` (omitido aquí por brevedad). Base URL en Convenciones Generales.
> `user*` = el residente (`role = user`) puede acceder solo a sus propios recursos (no listado completo en ese endpoint).
> **Estado**: "Diseñado" = contrato definido, pendiente de implementación. "Implementado" = código y tests en `main`.

---

## Flujos Comunes (referencia rápida para integración)

> Notación compacta para que un cliente (web, móvil, u otro servicio) sepa
> encadenar llamadas sin tener que leer cada sección. `Bearer` = requiere
> `Authorization: Bearer <access_token>`.

| Flujo | Secuencia |
|-------|-----------|
| Login simple | `POST /auth/login {email,password}` → `200 {access_token,refresh_token,user}` |
| Login con MFA | `POST /auth/login {email,password}` → `401 MFA_REQUIRED` → `POST /auth/mfa/verify {code}` → `200 {access_token,refresh_token,user}` |
| Sesión expirada | `401 TOKEN_EXPIRED` en cualquier endpoint Bearer → `POST /auth/refresh {refresh_token}` → `200 {access_token,refresh_token}` → reintentar request original |
| Logout | `POST /auth/logout` (Bearer) → `204` (revoca el refresh_token de la sesión actual) |
| Registro | `POST /auth/register {...}` → `201 {user}` (sin tokens) → `POST /auth/login` para obtener tokens |
| Olvido de contraseña | `POST /auth/forgot-password {email}` → `200` → usuario recibe email → `POST /auth/reset-password {email,token,password,password_confirmation}` → `200` |
| Cambio de contraseña autenticado | `POST /auth/change-password {current_password,new_password,new_password_confirmation}` (Bearer) → `200` (revoca TODAS las sesiones, incl. la actual: requiere nuevo login) |
| Activar MFA | `POST /auth/mfa/setup` (Bearer) → `200 {secret,qr_code_url,backup_codes}` → `POST /auth/mfa/enable {code}` (Bearer) → `200` |
| Desactivar MFA | `POST /auth/mfa/disable {password,code}` (Bearer) → `200` |
| Login con código de respaldo | `POST /auth/login {email,password}` → `401 MFA_REQUIRED` → `POST /auth/mfa/verify-backup {code}` → `200 {access_token,refresh_token,user}` |
| Verificar email | Usuario hace click en link del email → `POST /auth/verify-email {token}` → `200` |
| Forzar cambio de contraseña | `POST /auth/login` → `403 FORCE_PASSWORD_CHANGE + limited_token` → `POST /auth/change-password` (Bearer con limited_token) → `200` → login normal para obtener token completo |

> Para detalle completo de cada endpoint (request, response, errores, diseño, flujo), ver el documento correspondiente en `01-api/endpoints/`.

### Flujos de negocio (módulos diseñados)

| Flujo | Secuencia |
|-------|-----------|
| Generar cuotas del período | `POST /fees/generate {period, base_value, due_date}` → `201 {units_count, total_expected, fees_generated}` (una cuota por unidad activa) |
| Registrar pago de unidades | `POST /payments {unit_id, amount, method, reference, voucher}` → `201 {applied_to[], surplus, receipt_url}` (aplica: primero mora, luego cuotas FIFO) + notificación al residente |
| Anular pago | `POST /payments/{id}/void {reason}` → `200` (revierte cuotas y mora; notifica al residente) |
| Acuerdo de pago de mora | `GET /arrears/unit/{unit_id}` (ver saldo) → `POST /arrears/agreements {installments[], freeze_interest}` → `201` → si incumple `PATCH /arrears/agreements/{id}/status {status: defaulted}` |
| Reserva de área común | `GET /amenities` → `POST /bookings {amenity_id, date, start_time, end_time}` → `409 BOOKING_CONFLICT`|`422 RESIDENT_IN_ARREARS`|`201 {status: pending\|approved}` → admin `POST /bookings/{id}/approve` o `/reject` → notifica al residente |
| PQRS completo | `POST /pqrs {type, title, description, unit_id}` → admin `PATCH /pqrs/{id}/assign` → admin `PATCH /pqrs/{id}/status` (cambios de estado notifican al residente) → `POST /pqrs/{id}/messages` (intercambio) → `PATCH /pqrs/{id}/status {status: closed}` → residente `POST /pqrs/{id}/rate {rating}` |
| Comunicado a residentes | `POST /announcements {title, body, audience}` (borrador) → `POST /announcements/{id}/publish` (envía notificaciones masivas según audiencia) → residentes `POST /announcements/{id}/read` (confirman lectura) → admin `GET /announcements/{id}/read-receipts` (ver quiénes leyeron) |
| Asamblea + votación | `POST /meetings {type, scheduled_at, agenda[]}` → `POST /meetings/{id}/attendance` → `POST /polls {question, options[], meeting_id}` → `POST /polls/{id}/open` → residentes `POST /polls/{id}/vote {option_ids[]}` → admin `POST /polls/{id}/close` (calcula quórum + ganador) → `POST /meetings/{id}/minutes` (carga acta) → `POST /meetings/{id}/close` |
| Flujo cuenta por pagar | `POST /payables {provider_id, concept, amount, due_at}` → admin `POST /payables/{id}/approve` o `/reject` → admin `POST /payables/{id}/payment {paid_at, method, reference}` (afecta ejecución presupuestaria) |
| Notificaciones push del badge | Cliente polling `GET /notifications/unread-count` cada 60s (web) → al recibir push (app) `POST /notifications/devices {platform, token}` (registro) → al abrir `GET /notifications` |

---

## Convenciones Generales

### Base URL
```
Desarrollo:   http://localhost:8080/api/
Producción:   https://api.urbania.com/
```

### Headers Obligatorios
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>    (excepto endpoints públicos)
X-Trace-Id: <uuid>                   (opcional. Si no se envía, el servidor genera uno automáticamente)
X-Device-Name: <string>              (opcional, max 255 chars)
```

> [!note] Nota sobre X-Device-Fingerprint
> Este header ha sido **deprecado**.
> El servidor calcula el `device_fingerprint` automáticamente a partir de
> `User-Agent`, `IP`, `Accept-Language` y `X-Device-Name` (opcional).
> Ver [[API_JWT_IMPLEMENTATION]] §4.3 para detalles del cálculo.

### Formato de Fechas

Todas las fechas en respuestas DEBEN usar formato ISO 8601 en UTC:
- Formato: `YYYY-MM-DDThh:mm:ssZ`
- Ejemplo: `2026-06-07T12:00:00Z`
- **Prohibido** usar zonas horarias locales o formatos alternativos.

Ver [[API_ARCHITECTURE]] §13 (`APP_TIMEZONE=UTC`).

### Formato de Respuesta de Éxito
```json
{
  "data": { ... },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Formato de Respuesta de Error (ÚNICO FORMATO)
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "El usuario solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

> [!warning] IMPORTANTE
> Este es el ÚNICO formato de error permitido en toda la API.
> Todos los documentos deben usar este formato. No usar `error_code` a nivel raíz
> ni `success: false`.
> **Excepción**: `GET /health` en estado unhealthy responde `{ data: { status: "unhealthy", ... } }` con HTTP 503 — ver [[endpoints/HEALTH]] §11.1.

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 OK | GET exitoso, recurso encontrado |
| 201 Created | POST exitoso, recurso creado |
| 204 No Content | DELETE exitoso, PUT sin body |
| 400 Bad Request | Error de validación de negocio |
| 401 Unauthorized | Token inválido o expirado |
| 403 Forbidden | Sin permisos para el recurso |
| 404 Not Found | Recurso no existe |
| 409 Conflict | Conflicto de estado (ej: reserva duplicada) |
| 422 Unprocessable Entity | Error de validación de campos |
| 429 Too Many Requests | Rate limit excedido |
| 500 Internal Server Error | Error del servidor |
| 503 Service Unavailable | Servicio no disponible (health check) |

---

## Códigos de Error Completos

> [!note] Organización
> Códigos **base** (heredados por todos los endpoints) + códigos específicos por módulo. Cada código pertenece a un único módulo aunque algunos son reutilizable conceptualmente (ej: `*_NOT_FOUND`).

### Base (Auth + transversales)

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `TOKEN_EXPIRED` | 401 | El token JWT ha expirado |
| `TOKEN_INVALID` | 401 | El token JWT es inválido |
| `UNAUTHORIZED` | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos para esta acción |
| `USER_NOT_FOUND` | 404 | Usuario no encontrado |
| `EMAIL_ALREADY_EXISTS` | 409 | El email ya está registrado |
| `MFA_REQUIRED` | 401 | MFA requerido, verificación pendiente |
| `MFA_INVALID_CODE` | 401 | Código MFA incorrecto o expirado |
| `MFA_BACKUP_USED` | 401 | Código de respaldo ya utilizado |
| `FORCE_PASSWORD_CHANGE` | 403 | Debes cambiar tu contraseña antes de continuar |
| `PASSWORD_REUSED` | 400 | La contraseña no puede ser una de las 12 últimas utilizadas |
| `DEVICE_NOT_RECOGNIZED` | 403 | Dispositivo no reconocido, requiere re-autenticación |
| `SESSION_NOT_FOUND` | 404 | Sesión no encontrada o ya revocada |
| `RATE_LIMIT_EXCEEDED` | 429 | Límite de peticiones excedido |
| `VALIDATION_ERROR` | 422 | Error de validación de campos |
| `DATABASE_ERROR` | 500 | Error de base de datos |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

### §2 Propiedades y unidades

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PROPERTY_NOT_FOUND` | 404 | Unidad no encontrada |
| `PROPERTY_ALREADY_EXISTS` | 409 | Ya existe una unidad con ese número y torre |
| `PROPERTY_HAS_ACTIVE_RESIDENT` | 409 | No se puede eliminar una unidad con residente activo |
| `PROPERTY_HAS_DEPENDENCIES` | 409 | No se puede eliminar: tiene recursos bloqueantes asociados |

### §3 Residentes y propietarios

| Código | HTTP | Descripción |
|--------|------|-------------|
| `RESIDENT_NOT_FOUND` | 404 | Residente no encontrado |
| `DOCUMENT_ALREADY_EXISTS` | 409 | Ya existe un residente con ese número de documento |
| `UNIT_NOT_AVAILABLE` | 409 | La unidad objetivo no está disponible para asignación (no `vacant`/`for_sale`) |

### §4 Cuotas de administración

| Código | HTTP | Descripción |
|--------|------|-------------|
| `FEE_NOT_FOUND` | 404 | Cuota no encontrada |
| `FEES_ALREADY_GENERATED` | 409 | Las cuotas del período ya fueron generadas |
| `FEE_ALREADY_PAID` | 409 | No se puede ajustar una cuota ya pagada |

### §5 Pagos y recibos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PAYMENT_NOT_FOUND` | 404 | Pago no encontrado |
| `PAYMENT_ALREADY_VOIDED` | 409 | El pago ya fue anulado anteriormente |
| `NO_PENDING_FEES` | 422 | La unidad no tiene cuotas pendientes de pago |
| `RECEIPT_NOT_FOUND` | 404 | El recibo de este pago aún no ha sido generado |

### §6 Cartera de mora

| Código | HTTP | Descripción |
|--------|------|-------------|
| `AGREEMENT_NOT_FOUND` | 404 | Acuerdo de pago no encontrado |
| `AGREEMENT_ALREADY_ACTIVE` | 409 | La unidad ya tiene un acuerdo de pago activo |

### §7 Reservas de áreas comunes

| Código | HTTP | Descripción |
|--------|------|-------------|
| `AMENITY_NOT_FOUND` | 404 | Área común no encontrada |
| `BOOKING_NOT_FOUND` | 404 | Reserva no encontrada |
| `BOOKING_CONFLICT` | 409 | El horario solicitado no está disponible |
| `RESIDENT_IN_ARREARS` | 422 | No puede reservar áreas comunes con mora pendiente |
| `CANCELLATION_TOO_LATE` | 422 | No se puede cancelar con menos del plazo mínimo configurado |

### §8 Control de visitantes

| Código | HTTP | Descripción |
|--------|------|-------------|
| `VISITOR_NOT_FOUND` | 404 | Visita no encontrada |
| `PREAUTH_NOT_FOUND` | 404 | Preautorización no encontrada |
| `PREAUTH_EXPIRED` | 409 | La preautorización está vencida |
| `PREAUTH_ALREADY_USED` | 409 | La preautorización ya fue utilizada |

### §9 Control de vehículos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `VEHICLE_NOT_FOUND` | 404 | Vehículo no encontrado |
| `PLATE_ALREADY_REGISTERED` | 409 | La placa ya está registrada en el sistema |
| `VEHICLE_LIMIT_EXCEEDED` | 422 | La unidad alcanzó el límite máximo de vehículos permitidos |

### §10 Presupuesto y fondo de reserva

| Código | HTTP | Descripción |
|--------|------|-------------|
| `BUDGET_NOT_FOUND` | 404 | Presupuesto no encontrado |
| `BUDGET_ALREADY_EXISTS` | 409 | Ya existe un presupuesto para ese año |
| `BUDGET_LOCKED` | 409 | El presupuesto está cerrado y no se puede editar |
| `BUDGET_LINE_NOT_FOUND` | 404 | Línea de presupuesto no encontrada |
| `RESERVE_INSUFFICIENT_FUNDS` | 400 | El retiro supera el saldo del fondo de reserva |

### §12 Notificaciones

| Código | HTTP | Descripción |
|--------|------|-------------|
| `NOTIFICATION_NOT_FOUND` | 404 | Notificación no encontrada |
| `DEVICE_NOT_FOUND` | 404 | Dispositivo push no encontrado para el usuario autenticado |

### §13 Comunicados y circulares

| Código | HTTP | Descripción |
|--------|------|-------------|
| `ANNOUNCEMENT_NOT_FOUND` | 404 | Comunicado no encontrado |
| `ANNOUNCEMENT_ALREADY_PUBLISHED` | 409 | El comunicado ya está publicado y no se puede editar |
| `ANNOUNCEMENT_LOCKED` | 409 | El comunicado está bloqueado (publicado/cancelado) |
| `INVALID_AUDIENCE` | 422 | La audiencia especificada no es válida |

### §14 PQRS

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PQRS_NOT_FOUND` | 404 | PQRS no encontrado |
| `PQRS_CLOSED` | 409 | El PQRS está cerrado y no admite modificaciones |
| `INVALID_STATE_TRANSITION` | 422 | Transición de estado no permitida |
| `RATING_NOT_ALLOWED` | 409 | El PQRS no está cerrado; no se puede calificar |
| `ASSIGNEE_NOT_VALID` | 422 | El usuario asignado no es un responsable válido |

### §15 Órdenes de trabajo

| Código | HTTP | Descripción |
|--------|------|-------------|
| `WORK_ORDER_NOT_FOUND` | 404 | Orden de trabajo no encontrada |
| `MAINTENANCE_ALREADY_EXECUTED` | 409 | La orden ya está completada, no se puede editar/cancelar |
| `WORK_ORDER_NOT_ASSIGNABLE` | 409 | No se puede asignar a una OT ya cerrada |
| `TECHNICIAN_NOT_AVAILABLE` | 409 | El técnico no está disponible para la fecha indicada |
| `MATERIAL_INSUFFICIENT_STOCK` | 409 | Stock insuficiente del material solicitado |

### §16 Asambleas

| Código | HTTP | Descripción |
|--------|------|-------------|
| `MEETING_NOT_FOUND` | 404 | Asamblea no encontrada |
| `MEETING_ALREADY_STARTED` | 409 | La asamblea ya inició; no se puede editar |
| `MEETING_ALREADY_CLOSED` | 409 | La asamblea ya está cerrada |
| `MEETING_CANNOT_CANCEL` | 409 | No se puede cancelar una asamblea ya celebrada/cerrada |
| `INVALID_ATTENDANCE` | 422 | Asistencia inválida (unidad duplicada o inexistente) |
| `MINUTES_ALREADY_UPLOADED` | 409 | El acta ya fue cargada |
| `QUORUM_NOT_REACHED` | 409 | Quórum insuficiente para cerrar la asamblea |

### §17 Votaciones y encuestas

| Código | HTTP | Descripción |
|--------|------|-------------|
| `POLL_NOT_FOUND` | 404 | Votación/encuesta no encontrada |
| `POLL_NOT_OPEN` | 409 | La votación no está abierta |
| `POLL_CLOSED` | 409 | La votación está cerrada |
| `POLL_ALREADY_VOTED` | 409 | El usuario ya emitió su voto en esta votación |
| `INVALID_VOTE_OPTION` | 422 | Opción de voto no existe en la votación |
| `INVALID_VOTE_COUNT` | 422 | Número de opciones no coincide con el tipo de votación |
| `MAJORITY_NOT_REACHED` | 409 | Mayoría requerida no alcanzada al cerrar |

### §18 Correspondencia y paquetes

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PACKAGE_NOT_FOUND` | 404 | Paquete no encontrado |
| `PACKAGE_ALREADY_DELIVERED` | 409 | El paquete ya fue entregado |
| `PACKAGE_NOT_NOTIFIED` | 409 | No se puede entregar sin haber notificado al residente |
| `PACKAGE_RETURNED` | 409 | El paquete ya fue devuelto al transportador |

### §19 Mantenimiento preventivo

| Código | HTTP | Descripción |
|--------|------|-------------|
| `ASSET_NOT_FOUND` | 404 | Activo no encontrado |
| `MAINTENANCE_RECORD_NOT_FOUND` | 404 | Registro de mantenimiento no encontrado |
| `INVALID_SCHEDULE_DATE` | 422 | Fecha de programación inválida (pasada o fuera de rango) |
| `ASSET_INACTIVE` | 409 | No se puede programar mantenimiento de un activo inactivo |

### §20 Proveedores y contratos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PROVIDER_NOT_FOUND` | 404 | Proveedor no encontrado |
| `NIT_ALREADY_EXISTS` | 409 | Ya existe un proveedor con ese NIT |
| `CONTRACT_NOT_FOUND` | 404 | Contrato no encontrado |
| `CONTRACT_EXPIRED` | 409 | Operación no permitida sobre un contrato vencido sin reemplazo vigente |
| `PROVIDER_HAS_ACTIVE_CONTRACTS` | 409 | No se puede eliminar proveedor con contratos vigentes |

### §21 Cuentas por pagar

| Código | HTTP | Descripción |
|--------|------|-------------|
| `PAYABLE_NOT_FOUND` | 404 | Cuenta por pagar no encontrada |
| `PAYABLE_NOT_PENDING` | 409 | La cuenta ya está procesada (aprobada/rechazada/pagada/void) |
| `PAYABLE_NOT_APPROVED` | 409 | La cuenta no está aprobada; no se puede ejecutar pago |
| `PAYABLE_ALREADY_PAID` | 409 | La cuenta ya está pagada |
| `PAYABLE_VOIDED` | 409 | La cuenta está anulada; no se puede operar |
| `AMOUNT_MISMATCH` | 422 | El monto pagado no coincide con el monto de la cuenta |

### §22 Informes financieros y asamblea

| Código | HTTP | Descripción |
|--------|------|-------------|
| `REPORT_NOT_AVAILABLE` | 404 | Informe no generado o sin datos para el periodo |
| `REPORT_GENERATION_FAILED` | 500 | Falló la generación del informe |
| `INVALID_DATE_RANGE` | 422 | Rango de fechas inválido (`from > to` o rango > 2 años) |
| `EXPORT_FORMAT_NOT_SUPPORTED` | 422 | Formato de exportación no soportado |

### §23 KPI Dashboard

> No introduce códigos propios — usa `INTERNAL_ERROR` y `RATE_LIMIT_EXCEEDED` heredados; fallos parciales de un widget se retornan con `data.<widget> = null` manteniendo `200` global.

> [!note] Mantenimiento
> Esta tabla incluye los códigos usados por todos los endpoints documentados (base + módulos).
> Al agregar un endpoint de un módulo nuevo, agregar sus códigos aquí en la misma sesión de
> documentación (no esperar a la implementación). Detalle de cada código en su `endpoints/<FEATURE>.md`.

---

## Rate Limiting

> [!info] Fuente de verdad
> Ver configuración completa en [[API_JWT_IMPLEMENTATION]] Sección 4.1.
>
> Resumen para endpoints de Auth:
>
> | Endpoint | Límite | Ventana |
> |----------|--------|---------|
> | `POST /auth/login` | 5 intentos | 15 minutos |
> | `POST /auth/register` | 3 intentos | 1 hora |
> | `POST /auth/forgot-password` | 3 intentos | 1 hora |
> | `POST /auth/mfa/verify` | 3 intentos | 5 minutos |
> | API general (autenticado) | 1000 requests | 1 minuto |
> | API general (no autenticado) | 60 requests | 1 hora |

---

## Cómo Agregar un Endpoint Nuevo

> [!important] Flujo obligatorio
> Antes de escribir una sola línea de código, el endpoint debe estar documentado.

1. Crear o actualizar el documento en `01-api/endpoints/<FEATURE>.md` usando [[endpoints/_TEMPLATE]]
2. Completar: request, response, errores, sección **Diseño** (reglas, precondiciones, side effects, casos borde)
3. Agregar sección **Flujo** (Mermaid) solo si el endpoint es complejo
4. Agregar fila en el "Índice de Endpoints" de este documento (estado: "Diseñado")
5. Agregar códigos de error nuevos a "Códigos de Error Completos" de este documento
6. Si el flujo de uso no es obvio, agregar fila en "Flujos Comunes"
7. Verificar rate limiting en "Rate Limiting" / [[API_JWT_IMPLEMENTATION]] §4.1
8. Al implementar, cambiar estado a "Implementado" en el índice de este documento
9. Si afecta a Web o App, verificar si es cambio cross-project con skill `cross-project-change`

---

## Checklist de Implementación (código, una vez el contrato ya está documentado)

- [ ] Verificar que el endpoint está en el scope de la sesión actual ([[API_IMPLEMENTATION_PLAN]])
- [ ] Si requiere cambios en sesiones anteriores (Domain, Application), documentar como deuda técnica en [[API_SESSION_MANIFEST]]
- [ ] Crear Request DTO en `Application/DTOs/`
- [ ] Crear Response DTO en `Application/DTOs/`
- [ ] Crear o modificar UseCase en `Application/UseCases/`
- [ ] Crear Resource en `Infrastructure/Http/Resources/` (si aplica)
- [ ] Actualizar Controller en `Infrastructure/Http/Controllers/`
- [ ] Registrar ruta en `Presentation/routes.php`
- [ ] Crear Feature Test para el endpoint
- [ ] Documentar en Scribe (`php artisan scribe:generate`)
- [ ] Verificar formato de error único (sección "Formato de Respuesta de Error" de este documento)
- [ ] Marcar endpoint como "Implementado" en el índice de este documento
- [ ] Actualizar [[API_SESSION_MANIFEST]] con el nuevo endpoint y tests asociados

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[endpoints/_TEMPLATE]] | Plantilla para nuevos documentos de endpoint |
| [[endpoints/AUTH]] | Detalle de endpoints de autenticación |
| [[endpoints/HEALTH]] | Detalle de endpoint de health check |
| [[API_DATABASE]] | Esquema de base de datos PostgreSQL |
| [[API_JWT_IMPLEMENTATION]] | Seguridad JWT (claims, rotación, blacklist, device fingerprint) |
| [[API_ARCHITECTURE]] | Arquitectura DDD, convenciones, ADRs |
| [[API_AGENTS]] | Mapa de navegación del proyecto API |
| [[00-shared/SYSTEM_CONTRACT]] | Contrato formal entre proyectos (índice cross-project) |
