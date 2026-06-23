---
type: ui-pantalla
status: active
module: web
feature: notificaciones
pantalla: centro
tags: [web, notificaciones, ui, centro]
updated: 2026-06-22
---

# Centro — Notificaciones (Web)

> Spec técnico del feature: [[02-web/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Click en 'Ver todas' desde el panel del header o icono de campana`
**Ruta:** `/notificaciones`

---

## Qué muestra

Lista completa de notificaciones, ordenadas por fecha descendente. Cada item: ícono por tipo, título, cuerpo (truncado a 2 líneas), tiempo relativo (ej: 'hace 2h'), badge de estado no leída (punto azul). Botón 'Marcar todas como leídas'. Tabs o pills de filtro: Todas / No leídas / Por tipo.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de items |
| Vacío | Ilustración + "No tienes notificaciones" |
| Con datos | Lista normal |
