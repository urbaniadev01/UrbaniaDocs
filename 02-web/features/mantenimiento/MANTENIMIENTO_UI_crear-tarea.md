---
type: ui-pantalla
status: active
module: web
feature: mantenimiento
pantalla: crear-tarea
tags: [web, mantenimiento, ui, crear-tarea]
updated: 2026-06-22
---

# Crear Tarea — Mantenimiento preventivo (Web)

> Spec: [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]]
> Panorama: [[00-shared/features/MANTENIMIENTO]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Agregar tarea' en la vista del plan`


---

## Qué muestra

Formulario de tarea. Campos: Activo (selector del catálogo), Descripción de la tarea, Frecuencia (días entre mantenimientos), Próxima fecha, Proveedor asignado (del catálogo de PROVEEDORES, opcional). Al crear: aparece en el calendario.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state con botón de acción |
| Con datos | Vista normal |
