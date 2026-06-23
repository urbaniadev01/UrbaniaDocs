---
type: ui-pantalla
status: active
module: mobile
feature: reservas
pantalla: areas
tags: [app, reservas, ui, areas]
updated: 2026-06-22
---

# Areas — Reservas (App)

> Spec: [[03-app/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Screen  |  **Ruta go_router:** `/reservas/areas`

---

## Qué muestra

Catálogo de áreas comunes disponibles. Card por área: foto, nombre, capacidad, tarifa, horario. Tap para ver el calendario de disponibilidad.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay áreas disponibles" / "Sin reservas" |
| Con datos | Vista normal |
