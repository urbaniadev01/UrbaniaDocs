---
type: ui-pantalla
status: active
module: web
feature: mantenimiento
pantalla: historial
tags: [web, mantenimiento, ui, historial]
updated: 2026-06-22
---

# Historial — Mantenimiento preventivo (Web)

> Spec: [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]]
> Panorama: [[00-shared/features/MANTENIMIENTO]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Mantenimiento' → 'Historial'`
**Ruta:** `/mantenimiento/historial`

---

## Qué muestra

Log de mantenimientos realizados. Columnas: Activo, Tarea, Fecha realizada, Proveedor, Costo, Estado. Filtros: activo, categoría, proveedor, rango de fechas. Botón 'Registrar mantenimiento'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state con botón de acción |
| Con datos | Vista normal |
