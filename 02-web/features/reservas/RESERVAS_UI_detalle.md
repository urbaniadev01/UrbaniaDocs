---
type: ui-pantalla
status: active
module: web
feature: reservas
pantalla: detalle
tags: [web, reservas, ui, detalle]
updated: 2026-06-22
---

# Detalle — Reservas (Web)

> Spec: [[02-web/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Drawer  |  **Se abre desde:** `Click en fila de la lista o bloque del calendario`


---

## Qué muestra

Panel de detalle de una reserva. Datos: área, residente, unidad, fecha, horario, asistentes, costo. Estado actual. Acciones disponibles según el estado: Aprobar, Rechazar (para pendientes); Cancelar (para aprobadas futuras).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
