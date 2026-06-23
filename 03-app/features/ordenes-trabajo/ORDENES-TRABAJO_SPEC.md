---
type: spec-tecnico
status: active
module: mobile
feature: ordenes-trabajo
tags: [app, ordenes-trabajo, spec]
updated: 2026-06-22
---

# Spec Técnico App: Órdenes de trabajo

> Panorama global: [[00-shared/features/ORDENES-TRABAJO]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista | Screen | `/ordenes-trabajo` | [[03-app/features/ordenes-trabajo/ORDENES-TRABAJO_UI_lista]] |
| Detalle | Screen | `/ordenes-trabajo/:id` | [[03-app/features/ordenes-trabajo/ORDENES-TRABAJO_UI_detalle]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lectura cacheada (TTL 5min), mutaciones online-only

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /work-orders` | [[01-api/endpoints/ORDENES-TRABAJO]] §1 |
| `GET /work-orders/{id}` | [[01-api/endpoints/ORDENES-TRABAJO]] §3 |
