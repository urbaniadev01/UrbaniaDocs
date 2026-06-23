---
type: ui-pantalla
status: active
module: web
feature: notificaciones
pantalla: detalle
tags: [web, notificaciones, ui, detalle]
updated: 2026-06-22
---

# Detalle — Notificaciones (Web)

> Spec técnico del feature: [[02-web/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Click en una notificación en el centro o en el panel`


---

## Qué muestra

Modal con el contenido completo de la notificación. Marca automáticamente como leída al abrirse. Muestra: título, cuerpo completo, fecha y hora exacta. Botón de acción contextual (ej: 'Ver pago', 'Ver PQRS') si la notificación tiene accion_url.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de items |
| Vacío | Ilustración + "No tienes notificaciones" |
| Con datos | Lista normal |
