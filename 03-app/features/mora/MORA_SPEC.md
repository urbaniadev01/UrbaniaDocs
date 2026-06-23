---
type: spec-tecnico
status: active
module: mobile
feature: mora
tags: [app, mora, spec]
updated: 2026-06-22
---

# Spec Técnico App: Cartera de mora

> Panorama global: [[00-shared/features/MORA]]
> Endpoints: [[01-api/endpoints/MORA]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Reporte de mora | Screen | `/mora` | [[03-app/features/mora/MORA_UI_reporte]] |
| Detalle de mora | BottomSheet | — | [[03-app/features/mora/MORA_UI_detalle-unidad]] |

---

## Estrategia offline

- **Clasificación:** `online-only` — datos financieros en tiempo real

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /arrears/unit/{id}` | [[01-api/endpoints/MORA]] §2 |
