---
type: ui-pantalla
status: active
module: mobile
feature: ordenes-trabajo
pantalla: lista
tags: [app, ordenes-trabajo, ui, lista]
updated: 2026-06-22
---

# Lista — Órdenes de trabajo (App)

> Spec: [[03-app/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Screen  |  **Ruta go_router:** `/ordenes-trabajo`

---

## Qué muestra

Lista de órdenes reportadas por el residente autenticado. Card por orden: código, título, área, estado (badge de color por estado), fecha. Solo lectura — el residente ve el estado de sus solicitudes.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No has reportado ninguna solicitud de mantenimiento" |
| Con datos | Vista normal |
