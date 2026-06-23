---
type: ui-pantalla
status: active
module: web
feature: mantenimiento
pantalla: activos
tags: [web, mantenimiento, ui, activos]
updated: 2026-06-22
---

# Activos — Mantenimiento preventivo (Web)

> Spec: [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]]
> Panorama: [[00-shared/features/MANTENIMIENTO]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Mantenimiento' → 'Activos'`
**Ruta:** `/mantenimiento/activos`

---

## Qué muestra

Catálogo de activos del conjunto. Card por activo: nombre, categoría (ej: Eléctrico, Hidráulico), ubicación, próxima fecha de mantenimiento. Botón 'Agregar activo'. Filtro por categoría y estado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state con botón de acción |
| Con datos | Vista normal |
