---
type: ui-pantalla
status: active
module: web
feature: ordenes-trabajo
pantalla: crear
tags: [web, ordenes-trabajo, ui, crear]
updated: 2026-06-22
---

# Crear — Órdenes de trabajo (Web)

> Spec: [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]]
> Panorama: [[00-shared/features/ORDENES-TRABAJO]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Nueva orden' o desde el detalle de una PQRS`


---

## Qué muestra

Formulario de creación. Campos: Título, Descripción (precargado si viene de PQRS), Área afectada (select), Prioridad (Baja/Media/Alta/Urgente), Proveedor (opcional, del catálogo de PROVEEDORES), Fecha límite (opcional). Si viene de PQRS, el link a la PQRS queda registrado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay órdenes de trabajo abiertas" |
| Con datos | Vista normal |
