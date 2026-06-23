---
type: ui-pantalla
status: active
module: mobile
feature: asambleas
pantalla: detalle
tags: [app, asambleas, ui, detalle]
updated: 2026-06-22
---

# Detalle — Asambleas (App)

> Spec: [[03-app/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Screen  |  **Ruta go_router:** `/asambleas/:id`

---

## Qué muestra

Información completa de la asamblea: tipo, fecha, hora, lugar. Orden del día (lista de puntos). Si está finalizada: sección de acta con botón para descargar el PDF. Si hay votaciones activas: link a la pantalla de votación.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay asambleas programadas" |
| Con datos | Vista normal |
