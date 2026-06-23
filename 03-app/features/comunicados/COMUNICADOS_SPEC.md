---
type: spec-tecnico
status: active
module: mobile
feature: comunicados
tags: [app, comunicados, spec]
updated: 2026-06-22
---

# Spec Técnico App: Comunicados

> Panorama global: [[00-shared/features/COMUNICADOS]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista | Screen | `/comunicados` | [[03-app/features/comunicados/COMUNICADOS_UI_lista]] |
| Detalle | Screen | `/comunicados/:id` | [[03-app/features/comunicados/COMUNICADOS_UI_detalle]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lista cacheada (TTL 5min), detalle cacheado al leer

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /announcements` | [[01-api/endpoints/COMUNICADOS]] §1 |
| `GET /announcements/{id}` | [[01-api/endpoints/COMUNICADOS]] §2 |
