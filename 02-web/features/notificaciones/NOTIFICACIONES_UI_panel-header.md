---
type: ui-pantalla
status: active
module: web
feature: notificaciones
pantalla: panel-header
tags: [web, notificaciones, ui, panel-header]
updated: 2026-06-22
---

# Panel Header — Notificaciones (Web)

> Spec técnico del feature: [[02-web/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Inline
**Se abre desde:** `Click en ícono de campana en el header del dashboard`


---

## Qué muestra

Dropdown flotante en el header. Muestra las últimas 5-7 notificaciones. Cada item: ícono, título, tiempo relativo, punto azul si no leída. Botón 'Ver todas' al pie que navega a /notificaciones. Badge numérico en el ícono de campana con el conteo de no leídas.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de items |
| Vacío | Ilustración + "No tienes notificaciones" |
| Con datos | Lista normal |
