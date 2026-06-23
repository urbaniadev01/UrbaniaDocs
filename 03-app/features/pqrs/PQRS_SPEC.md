---
type: spec-tecnico
status: active
module: mobile
feature: pqrs
tags: [app, pqrs, spec]
updated: 2026-06-22
---

# Spec Técnico App: PQRS

> Panorama global: [[00-shared/features/PQRS]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista | Screen | `/pqrs` | [[03-app/features/pqrs/PQRS_UI_lista]] |
| Crear | Screen | `/pqrs/nueva` | [[03-app/features/pqrs/PQRS_UI_crear]] |
| Detalle | Screen | `/pqrs/:id` | [[03-app/features/pqrs/PQRS_UI_detalle]] |
| Adjuntos | BottomSheet | — | [[03-app/features/pqrs/PQRS_UI_adjuntos]] |

---

## Estrategia offline

- **Clasificación:** `online-only` para mutaciones; lista con TTL 2min para lectura

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /pqrs` | [[01-api/endpoints/PQRS]] §1 |
| `POST /pqrs` | [[01-api/endpoints/PQRS]] §2 |
| `GET /pqrs/{id}` | [[01-api/endpoints/PQRS]] §3 |
| `POST /pqrs/{id}/comments` | [[01-api/endpoints/PQRS]] §4 |
