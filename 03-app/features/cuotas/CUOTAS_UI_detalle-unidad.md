---
type: ui-pantalla
status: active
module: mobile
feature: cuotas
pantalla: detalle-unidad
tags: [app, cuotas, ui, detalle-unidad]
updated: 2026-06-22
---

# Detalle Unidad — Cuotas de administración (App)

> Spec técnico del feature: [[03-app/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/cuotas/:id`

---

## Qué muestra

Detalle de la cuota seleccionada. Muestra: período, monto base, ajustes, saldo. Botón para ver el recibo si está pagada (link a PAGOS).

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de cards |
| Vacío | Mensaje "No hay cuotas para este período" |
| Con datos | Lista normal |
| Sin conexión | Datos en caché |
