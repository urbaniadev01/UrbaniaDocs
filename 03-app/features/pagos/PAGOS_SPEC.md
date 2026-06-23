---
type: spec-tecnico
status: active
module: mobile
feature: pagos
tags: [app, pagos, spec]
updated: 2026-06-22
---

# Spec Técnico App: Pagos y recibos

> Panorama global: [[00-shared/features/PAGOS]]
> Endpoints: [[01-api/endpoints/PAGOS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de pagos | Screen | `/pagos` | [[03-app/features/pagos/PAGOS_UI_lista]] |
| Detalle de pago | Screen | `/pagos/:id` | [[03-app/features/pagos/PAGOS_UI_detalle]] |
| Registrar pago | BottomSheet | — | [[03-app/features/pagos/PAGOS_UI_registrar]] |

---

## Estrategia offline

- **Clasificación:** `online-only` — datos financieros, no se cachean las mutaciones

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /payments` | [[01-api/endpoints/PAGOS]] §1 |
| `POST /payments` | [[01-api/endpoints/PAGOS]] §2 |
| `GET /payments/{id}` | [[01-api/endpoints/PAGOS]] §3 |
