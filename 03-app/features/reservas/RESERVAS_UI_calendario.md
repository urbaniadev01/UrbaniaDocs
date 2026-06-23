---
type: ui-pantalla
status: active
module: mobile
feature: reservas
pantalla: calendario
tags: [app, reservas, ui, calendario]
updated: 2026-06-22
---

# Calendario — Reservas (App)

> Spec: [[03-app/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Screen  |  **Ruta go_router:** `/reservas/areas/:id/calendario`

---

## Qué muestra

Vista de calendario del área seleccionada. Día seleccionable. Bloques horarios: disponible (verde), ocupado (rojo), seleccionado (azul). Al seleccionar un bloque disponible: abre el BottomSheet de crear reserva.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay áreas disponibles" / "Sin reservas" |
| Con datos | Vista normal |
