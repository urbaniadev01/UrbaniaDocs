---
type: ui-pantalla
status: active
module: web
feature: ordenes-trabajo
pantalla: cambiar-estado
tags: [web, ordenes-trabajo, ui, cambiar-estado]
updated: 2026-06-22
---

# Cambiar Estado — Órdenes de trabajo (Web)

> Spec: [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Cambiar estado' en detalle`


---

## Qué muestra

Selector de nuevo estado (solo transiciones válidas). Comentario de transición requerido. Al cerrar: campos adicionales obligatorios: costo final y upload de al menos una foto de evidencia.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay órdenes de trabajo abiertas" |
| Con datos | Vista normal |
