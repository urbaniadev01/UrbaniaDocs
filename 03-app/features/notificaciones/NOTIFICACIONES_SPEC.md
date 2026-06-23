---
type: spec-tecnico
status: active
module: mobile
feature: notificaciones
tags: [app, notificaciones, spec]
updated: 2026-06-22
---

# Spec Técnico App: Notificaciones

> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Endpoints: [[01-api/endpoints/NOTIFICACIONES]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de notificaciones | Screen | `/notificaciones` | [[03-app/features/notificaciones/NOTIFICACIONES_UI_lista]] |
| Detalle | BottomSheet | — | [[03-app/features/notificaciones/NOTIFICACIONES_UI_detalle]] |
| Preferencias | Screen | `/notificaciones/preferencias` | [[03-app/features/notificaciones/NOTIFICACIONES_UI_preferencias]] |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lista cacheada; se actualiza con FCM push notifications

---

## Deep links

| Origen | Destino |
|---|---|
| Push: cualquier tipo | `/notificaciones/:id` |

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /notifications` | [[01-api/endpoints/NOTIFICACIONES]] §1 |
| `PATCH /notifications/{id}` | [[01-api/endpoints/NOTIFICACIONES]] §2 |
