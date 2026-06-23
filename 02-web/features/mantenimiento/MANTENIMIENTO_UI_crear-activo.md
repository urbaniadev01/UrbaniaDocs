---
type: ui-pantalla
status: active
module: web
feature: mantenimiento
pantalla: crear-activo
tags: [web, mantenimiento, ui, crear-activo]
updated: 2026-06-22
---

# Crear Activo — Mantenimiento preventivo (Web)

> Spec: [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]]
> Panorama: [[00-shared/features/MANTENIMIENTO]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Agregar activo' o ícono editar`


---

## Qué muestra

Formulario de ficha técnica. Campos: Nombre, Categoría, Marca, Modelo, Número de serie (opcional), Ubicación, Fecha de instalación (date), Vida útil en años (opcional). Toggle Activo.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state con botón de acción |
| Con datos | Vista normal |
