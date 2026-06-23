---
type: ui-pantalla
status: active
module: mobile
feature: cuotas
pantalla: lista
tags: [app, cuotas, ui, lista]
updated: 2026-06-22
---

# Lista — Cuotas de administración (App)

> Spec técnico del feature: [[03-app/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/cuotas`

---

## Qué muestra

Lista de cuotas del período vigente para la unidad del residente autenticado. Card por período con monto, estado y saldo pendiente. Selector de período para ver histórico.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de cards |
| Vacío | Mensaje "No hay cuotas para este período" |
| Con datos | Lista normal |
| Sin conexión | Datos en caché |
