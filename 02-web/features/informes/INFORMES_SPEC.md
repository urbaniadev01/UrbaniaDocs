---
type: spec-tecnico
status: active
module: web
feature: informes
tags: [web, informes, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Informes financieros y de gestión

> Panorama global: [[00-shared/features/INFORMES]]

> Este feature es solo Web (App N/A).

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Centro de informes | Página | `/informes` | [[02-web/features/informes/INFORMES_UI_centro]] |
| Informe financiero | Página | `/informes/financiero` | [[02-web/features/informes/INFORMES_UI_financiero]] |
| Informe de cartera | Página | `/informes/cartera` | [[02-web/features/informes/INFORMES_UI_cartera]] |
| Informe de gestión | Página | `/informes/gestion` | [[02-web/features/informes/INFORMES_UI_gestion]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/informes/*` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useInformeFinanciero` | `GET /reports/financial` |
| `useInformeCartera` | `GET /reports/arrears` |
| `useInformeGestion` | `GET /reports/management` |
| `useExportarInforme` | `GET /reports/{type}/export` |
