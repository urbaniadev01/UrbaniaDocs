---
type: spec-tecnico
status: active
module: mobile
feature: vehiculos
tags: [app, vehiculos, spec]
updated: 2026-06-22
---

# Spec Técnico App: Control de vehículos

> Panorama global: [[00-shared/features/VEHICULOS]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Mis vehículos | Screen | `/vehiculos` | [[03-app/features/vehiculos/VEHICULOS_UI_lista]] |
| Detalle | BottomSheet | — | [[03-app/features/vehiculos/VEHICULOS_UI_detalle]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lista cacheada (TTL 1h)

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /vehicles` | [[01-api/endpoints/VEHICULOS]] §1 |
