---
type: ui-pantalla
status: active
module: mobile
feature: notificaciones
pantalla: lista
tags: [app, notificaciones, ui, lista]
updated: 2026-06-22
---

# Lista — Notificaciones (App)

> Spec técnico del feature: [[03-app/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/notificaciones`

---

## Qué muestra

Lista scrolleable de notificaciones. Card por notificación: ícono de tipo, título prominente, cuerpo truncado, tiempo relativo. Badge de no leída (punto de color) a la izquierda. Swipe izquierda para marcar como leída. Botón 'Marcar todas' en AppBar.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de cards |
| Vacío | "Sin notificaciones nuevas" |
| Con datos | Lista normal |
