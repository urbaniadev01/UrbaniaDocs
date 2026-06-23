---
type: ui-pantalla
status: active
module: web
feature: presupuesto
pantalla: fondo-reserva
tags: [web, presupuesto, ui, fondo-reserva]
updated: 2026-06-22
---

# Fondo Reserva — Presupuesto y fondo de reserva (Web)

> Spec técnico del feature: [[02-web/features/presupuesto/PRESUPUESTO_SPEC]]
> Panorama global: [[00-shared/features/PRESUPUESTO]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Inline
**Se abre desde:** `Sección dentro de /presupuesto`


---

## Qué muestra

Sección inline al pie de la página de presupuesto. Muestra: saldo actual del fondo, porcentaje del presupuesto, últimos 5 movimientos (aportes y retiros con fecha y descripción). Botón 'Registrar movimiento' (aporte/retiro).

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Sin presupuesto para el año | EmptyState + botón "Crear presupuesto" |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
