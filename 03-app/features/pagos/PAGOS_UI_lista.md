---
type: ui-pantalla
status: active
module: mobile
feature: pagos
pantalla: lista
tags: [app, pagos, ui, lista]
updated: 2026-06-22
---

# Lista — Pagos y recibos (App)

> Spec técnico del feature: [[03-app/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/pagos`

---

## Qué muestra

Historial de pagos de la unidad del residente logueado. Card por pago: fecha prominente, monto, método, estado (badge). Filtro de período en AppBar.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Con datos | Vista normal |
| Sin conexión | Datos en caché (online-only para mutaciones) |
