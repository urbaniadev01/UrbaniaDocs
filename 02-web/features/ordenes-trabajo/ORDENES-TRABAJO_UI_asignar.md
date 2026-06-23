---
type: ui-pantalla
status: active
module: web
feature: ordenes-trabajo
pantalla: asignar
tags: [web, ordenes-trabajo, ui, asignar]
updated: 2026-06-22
---

# Asignar — Órdenes de trabajo (Web)

> Spec: [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Asignar proveedor' en detalle`


---

## Qué muestra

Selector de proveedor del catálogo (busqueda por nombre). Fecha límite (date picker). Botón 'Asignar'. Al guardar: cambia estado a 'asignada' y envía notificación al proveedor.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay órdenes de trabajo abiertas" |
| Con datos | Vista normal |
