---
type: ui-pantalla
status: active
module: web
feature: presupuesto
pantalla: detalle-categoria
tags: [web, presupuesto, ui, detalle-categoria]
updated: 2026-06-22
---

# Detalle Categoria — Presupuesto y fondo de reserva (Web)

> Spec técnico del feature: [[02-web/features/presupuesto/PRESUPUESTO_SPEC]]
> Panorama global: [[00-shared/features/PRESUPUESTO]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Drawer
**Se abre desde:** `Click en una fila de categoría en la vista anual`


---

## Qué muestra

Detalle de una categoría específica. Muestra: nombre, monto proyectado, ejecutado, diferencia. Lista de movimientos reales con fecha, descripción y monto (pagos recibidos para ingresos; facturas pagadas para egresos). Gráfico de ejecución mes a mes (si aplica).

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Sin presupuesto para el año | EmptyState + botón "Crear presupuesto" |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
