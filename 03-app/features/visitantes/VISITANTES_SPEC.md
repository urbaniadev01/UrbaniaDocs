---
type: spec-tecnico
status: active
module: mobile
feature: visitantes
tags: [app, visitantes, spec]
updated: 2026-06-22
---

# Spec Técnico App: Control de visitantes

> Panorama global: [[00-shared/features/VISITANTES]]

---

## Pantallas

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Mis visitantes | Screen | `/visitantes` | [[03-app/features/visitantes/VISITANTES_UI_lista]] |
| Preautorizar visita | Screen | `/visitantes/nueva` | [[03-app/features/visitantes/VISITANTES_UI_preautorizar]] |
| Detalle de visita | BottomSheet | — | [[03-app/features/visitantes/VISITANTES_UI_detalle]] |
| Escaneo QR (portero) | Screen | `/visitantes/qr` | [[03-app/features/visitantes/VISITANTES_UI_qr]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lista cacheada (TTL 10min); escaneo QR online-only

---

## Notas de implementación

- La pantalla de escaneo QR solo es accesible para usuarios con rol `portero` o `admin`.
- El QR de preautorización contiene el `qr_token` que se envía al endpoint de registro de ingreso.

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /visitors` | [[01-api/endpoints/VISITANTES]] §1 |
| `POST /visitors` | [[01-api/endpoints/VISITANTES]] §2 |
| `POST /visitors/preauth` | [[01-api/endpoints/VISITANTES]] §4 |
