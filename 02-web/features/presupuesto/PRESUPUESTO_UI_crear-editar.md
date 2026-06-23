---
type: ui-pantalla
status: active
module: web
feature: presupuesto
pantalla: crear-editar
tags: [web, presupuesto, ui, crear-editar]
updated: 2026-06-22
---

# Crear Editar — Presupuesto y fondo de reserva (Web)

> Spec técnico del feature: [[02-web/features/presupuesto/PRESUPUESTO_SPEC]]
> Panorama global: [[00-shared/features/PRESUPUESTO]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Crear presupuesto' o ícono editar en header`


---

## Qué muestra

Modal con formulario de presupuesto. Año (selector). Dos secciones editables: Ingresos (categorías + montos) y Egresos (categorías + montos). Botones para agregar/eliminar categorías. Total proyectado calculado automáticamente. Validación: los ingresos deben cubrir los egresos.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Sin presupuesto para el año | EmptyState + botón "Crear presupuesto" |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
