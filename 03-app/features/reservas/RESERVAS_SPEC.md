---
type: spec-tecnico
status: active
module: mobile
feature: reservas
tags: [app, reservas, spec]
updated: 2026-06-22
---

# Spec Técnico App: Reservas de áreas comunes

> Panorama global: [[00-shared/features/RESERVAS]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Áreas comunes | Screen | `/reservas/areas` | [[03-app/features/reservas/RESERVAS_UI_areas]] |
| Calendario de disponibilidad | Screen | `/reservas/areas/:id/calendario` | [[03-app/features/reservas/RESERVAS_UI_calendario]] |
| Crear reserva | BottomSheet | — | [[03-app/features/reservas/RESERVAS_UI_crear]] |
| Mis reservas | Screen | `/reservas` | [[03-app/features/reservas/RESERVAS_UI_mis-reservas]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — catálogo de áreas cacheado (TTL 30min); reservas online-only

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /amenities` | [[01-api/endpoints/RESERVAS]] §1 |
| `GET /bookings` | [[01-api/endpoints/RESERVAS]] §4 |
| `POST /bookings` | [[01-api/endpoints/RESERVAS]] §5 |
