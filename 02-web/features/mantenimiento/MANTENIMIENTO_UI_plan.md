---
type: ui-pantalla
status: active
module: web
feature: mantenimiento
pantalla: plan
tags: [web, mantenimiento, ui, plan]
updated: 2026-06-22
---

# Plan — Mantenimiento preventivo (Web)

> Spec: [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]]
> Panorama: [[00-shared/features/MANTENIMIENTO]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Mantenimiento' → 'Plan'`
**Ruta:** `/mantenimiento/plan`

---

## Qué muestra

Vista de calendario de tareas preventivas. Mes actual con bloques por tarea. Código de color por estado: programado (azul), en ejecución (amarillo), completado (verde), vencido (rojo). Panel lateral: lista de tareas del mes con fecha y proveedor. Botón 'Agregar tarea'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state con botón de acción |
| Con datos | Vista normal |
