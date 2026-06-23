---
type: ui-pantalla
status: active
module: web
feature: presupuesto
pantalla: anual
tags: [web, presupuesto, ui, anual]
updated: 2026-06-22
---

# Anual — Presupuesto y fondo de reserva (Web)

> Spec técnico del feature: [[02-web/features/presupuesto/PRESUPUESTO_SPEC]]
> Panorama global: [[00-shared/features/PRESUPUESTO]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Presupuesto'`
**Ruta:** `/presupuesto`

---

## Qué muestra

Vista principal del presupuesto del año seleccionado. Selector de año en header. Dos secciones: Ingresos y Egresos. Por categoría: monto proyectado, ejecutado y barra de progreso. Totales al pie. Sección de Fondo de Reserva embebida al final (ver [[02-web/features/presupuesto/PRESUPUESTO_UI_fondo-reserva]]). Botón 'Crear presupuesto' si no existe para el año seleccionado.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Sin presupuesto para el año | EmptyState + botón "Crear presupuesto" |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
