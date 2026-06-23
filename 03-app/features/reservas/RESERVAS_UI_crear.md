---
type: ui-pantalla
status: active
module: mobile
feature: reservas
pantalla: crear
tags: [app, reservas, ui, crear]
updated: 2026-06-22
---

# Crear — Reservas (App)

> Spec: [[03-app/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** BottomSheet  |  **Se abre desde:** Tap en bloque disponible del calendario

---

## Qué muestra

Formulario de reserva. Prerellenado con el área y bloque seleccionado. Campos: número de asistentes (stepper), notas opcionales. Resumen: fecha, horario, costo calculado. Botón 'Solicitar reserva'. Notificación de que debe ser aprobada.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay áreas disponibles" / "Sin reservas" |
| Con datos | Vista normal |
