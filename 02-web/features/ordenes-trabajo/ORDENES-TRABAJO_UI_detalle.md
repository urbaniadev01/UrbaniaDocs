---
type: ui-pantalla
status: active
module: web
feature: ordenes-trabajo
pantalla: detalle
tags: [web, ordenes-trabajo, ui, detalle]
updated: 2026-06-22
---

# Detalle — Órdenes de trabajo (Web)

> Spec: [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Página  |  **Se abre desde:** `Click en orden de la lista o tablero`
**Ruta:** `/ordenes-trabajo/:id`

---

## Qué muestra

Dos columnas. Izquierda: descripción, área, prioridad, proveedor asignado, fecha límite, costo. Historial de cambios de estado. Galería de evidencias. Botones: 'Cambiar estado', 'Asignar'. Derecha (si viene de PQRS): card con el resumen de la PQRS origen.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay órdenes de trabajo abiertas" |
| Con datos | Vista normal |
