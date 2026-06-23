---
type: ui-pantalla
status: active
module: mobile
feature: asambleas
pantalla: lista
tags: [app, asambleas, ui, lista]
updated: 2026-06-22
---

# Lista — Asambleas (App)

> Spec: [[03-app/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Screen  |  **Ruta go_router:** `/asambleas`

---

## Qué muestra

Próximas y pasadas asambleas. Card por asamblea: tipo, fecha, estado (badge). Notificación si hay una asamblea próxima (en los próximos 15 días). Tap para ver detalle.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay asambleas programadas" |
| Con datos | Vista normal |
