---
type: ui-pantalla
status: active
module: mobile
feature: reservas
pantalla: mis-reservas
tags: [app, reservas, ui, mis-reservas]
updated: 2026-06-22
---

# Mis Reservas — Reservas (App)

> Spec: [[03-app/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Screen  |  **Ruta go_router:** `/reservas`

---

## Qué muestra

Historial de reservas del residente. Card por reserva: área, fecha, horario, estado (badge de color). Tabs: Próximas / Pasadas. Botón 'Cancelar' en reservas aprobadas futuras (dentro del plazo permitido).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay áreas disponibles" / "Sin reservas" |
| Con datos | Vista normal |
