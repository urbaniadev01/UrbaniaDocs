---
type: ui-pantalla
status: active
module: web
feature: pqrs
pantalla: detalle
tags: [web, pqrs, ui, detalle]
updated: 2026-06-22
---

# Detalle — PQRS (Web)

> Spec: [[02-web/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Página  |  **Se abre desde:** `Click en fila de la lista`
**Ruta:** `/pqrs/:id`

---

## Qué muestra

Layout de dos columnas. Izquierda: hilo de comentarios cronológico (mensajes de residente y admin diferenciados por color). Derecha (panel lateral): número de radicado, tipo, estado actual, unidad, residente, asignado a, historial de cambios de estado con fechas. Botones: 'Cambiar estado', 'Asignar'. Área de respuesta para agregar comentario al hilo.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado al contexto |
| Con datos | Vista normal |
