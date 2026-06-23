---
type: ui-pantalla
status: active
module: mobile
feature: pqrs
pantalla: crear
tags: [app, pqrs, ui, crear]
updated: 2026-06-22
---

# Crear — PQRS (App)

> Spec: [[03-app/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Screen  |  **Ruta go_router:** `/pqrs/nueva`

---

## Qué muestra

Formulario de radicación. Campos: Tipo (selector por botones grandes: Petición / Queja / Reclamo / Sugerencia), Título, Descripción (textarea). Sección de adjuntos: botón para tomar foto o seleccionar de galería.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Aún no has radicado ninguna PQRS" + botón crear |
| Con datos | Vista normal |
