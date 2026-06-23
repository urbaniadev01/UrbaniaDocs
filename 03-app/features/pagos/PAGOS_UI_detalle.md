---
type: ui-pantalla
status: active
module: mobile
feature: pagos
pantalla: detalle
tags: [app, pagos, ui, detalle]
updated: 2026-06-22
---

# Detalle — Pagos y recibos (App)

> Spec técnico del feature: [[03-app/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/pagos/:id`

---

## Qué muestra

Detalle completo del pago: fecha, monto, método, referencia, cuotas cubiertas. Sección del recibo con botón para descargar PDF.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Con datos | Vista normal |
| Sin conexión | Datos en caché (online-only para mutaciones) |
