---
type: spec-tecnico
status: active
module: mobile
feature: votaciones
tags: [app, votaciones, spec]
updated: 2026-06-22
---

# Spec Técnico App: Votaciones

> Panorama global: [[00-shared/features/VOTACIONES]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de activas | Screen | `/votaciones` | [[03-app/features/votaciones/VOTACIONES_UI_lista]] |
| Votar | Screen | `/votaciones/:id/votar` | [[03-app/features/votaciones/VOTACIONES_UI_votar]] |
| Resultados | Screen | `/votaciones/:id/resultados` | [[03-app/features/votaciones/VOTACIONES_UI_resultados]] |

---

## Estrategia offline

- **Clasificación:** `online-only` — el acto de votar debe ser en tiempo real

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /votes` | [[01-api/endpoints/VOTACIONES]] §1 |
| `GET /votes/{id}` | [[01-api/endpoints/VOTACIONES]] §2 |
| `POST /votes/{id}/cast` | [[01-api/endpoints/VOTACIONES]] §3 |
