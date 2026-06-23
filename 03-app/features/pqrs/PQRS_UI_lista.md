---
type: ui-pantalla
status: active
module: mobile
feature: pqrs
pantalla: lista
tags: [app, pqrs, ui, lista]
updated: 2026-06-22
---

# Lista — PQRS (App)

> Spec: [[03-app/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Screen  |  **Ruta go_router:** `/pqrs`

---

## Qué muestra

Lista de PQRS del residente. Card por PQRS: número de radicado, tipo (badge de color), título, estado (badge), fecha. Botón flotante '+' para crear nueva PQRS. Filtro de estado en AppBar.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Aún no has radicado ninguna PQRS" + botón crear |
| Con datos | Vista normal |
