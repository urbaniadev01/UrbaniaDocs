---
type: ui-pantalla
status: active
module: mobile
feature: notificaciones
pantalla: detalle
tags: [app, notificaciones, ui, detalle]
updated: 2026-06-22
---

# Detalle — Notificaciones (App)

> Spec técnico del feature: [[03-app/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** BottomSheet
**Se abre desde:** Tap en notificación

---

## Qué muestra

Contenido completo de la notificación. Se marca como leída al abrir. Título, cuerpo, fecha/hora. Botón de acción si tiene accion_url (navega al recurso relacionado).

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de cards |
| Vacío | "Sin notificaciones nuevas" |
| Con datos | Lista normal |
