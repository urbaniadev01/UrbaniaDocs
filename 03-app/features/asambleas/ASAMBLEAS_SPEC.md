---
type: spec-tecnico
status: active
module: mobile
feature: asambleas
tags: [app, asambleas, spec]
updated: 2026-06-22
---

# Spec Técnico App: Asambleas

> Panorama global: [[00-shared/features/ASAMBLEAS]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista | Screen | `/asambleas` | [[03-app/features/asambleas/ASAMBLEAS_UI_lista]] |
| Detalle | Screen | `/asambleas/:id` | [[03-app/features/asambleas/ASAMBLEAS_UI_detalle]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lista y detalle de asambleas pasadas cacheables; gestión de quórum online-only

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /assemblies` | [[01-api/endpoints/ASAMBLEAS]] §1 |
| `GET /assemblies/{id}` | [[01-api/endpoints/ASAMBLEAS]] §2 |
