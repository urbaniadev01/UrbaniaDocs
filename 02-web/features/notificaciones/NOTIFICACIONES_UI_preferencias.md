---
type: ui-pantalla
status: active
module: web
feature: notificaciones
pantalla: preferencias
tags: [web, notificaciones, ui, preferencias]
updated: 2026-06-22
---

# Preferencias — Notificaciones (Web)

> Spec técnico del feature: [[02-web/features/notificaciones/NOTIFICACIONES_SPEC]]
> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Link 'Preferencias' en el centro de notificaciones`
**Ruta:** `/notificaciones/preferencias`

---

## Qué muestra

Tabla de preferencias. Filas: tipo de notificación (ej: Cuota vencida, Pago recibido, PQRS actualizada). Columnas: In-app (toggle), Push (toggle), Email (toggle). Botón 'Guardar cambios' al pie.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de items |
| Vacío | Ilustración + "No tienes notificaciones" |
| Con datos | Lista normal |
