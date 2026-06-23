---
type: ui-pantalla
status: active
module: mobile
feature: ordenes-trabajo
pantalla: detalle
tags: [app, ordenes-trabajo, ui, detalle]
updated: 2026-06-22
---

# Detalle — Órdenes de trabajo (App)

> Spec: [[03-app/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Screen  |  **Ruta go_router:** `/ordenes-trabajo/:id`

---

## Qué muestra

Detalle completo. Estado visual prominente (stepper de estados: Abierta → Asignada → En ejecución → Cerrada). Proveedor asignado, fecha límite, comentarios del historial de estados. Evidencias al cerrar (galería de fotos).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No has reportado ninguna solicitud de mantenimiento" |
| Con datos | Vista normal |
