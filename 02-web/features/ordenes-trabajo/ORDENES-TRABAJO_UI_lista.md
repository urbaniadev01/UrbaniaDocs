---
type: ui-pantalla
status: active
module: web
feature: ordenes-trabajo
pantalla: lista
tags: [web, ordenes-trabajo, ui, lista]
updated: 2026-06-22
---

# Lista — Órdenes de trabajo (Web)

> Spec: [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Órdenes de trabajo'`
**Ruta:** `/ordenes-trabajo`

---

## Qué muestra

Tablero Kanban o tabla (toggle de vista). Columnas Kanban: Abierta, Asignada, En ejecución, Cerrada. Filtros: prioridad, proveedor, área, rango de fechas. Botón 'Nueva orden'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay órdenes de trabajo abiertas" |
| Con datos | Vista normal |
