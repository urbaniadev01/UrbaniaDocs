---
type: ui-pantalla
status: active
module: mobile
feature: notificaciones
pantalla: preferencias
tags: [app, notificaciones, ui, preferencias]
updated: 2026-06-22
---

# Preferencias — Notificaciones (App)

> Spec técnico del feature: [[03-app/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/notificaciones/preferencias`

---

## Qué muestra

Lista de tipos de notificación con toggles por canal: Push, Email, In-App. Cada fila es un tipo. Guardar automático al cambiar un toggle.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de cards |
| Vacío | "Sin notificaciones nuevas" |
| Con datos | Lista normal |
