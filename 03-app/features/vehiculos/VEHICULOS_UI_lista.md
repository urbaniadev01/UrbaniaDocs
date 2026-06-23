---
type: ui-pantalla
status: active
module: mobile
feature: vehiculos
pantalla: lista
tags: [app, vehiculos, ui, lista]
updated: 2026-06-22
---

# Lista — Vehículos (App)

> Spec: [[03-app/features/vehiculos/VEHICULOS_SPEC]]
> Panorama: [[00-shared/features/VEHICULOS]]

**Tipo:** Screen  |  **Ruta go_router:** `/vehiculos`

---

## Qué muestra

Lista de vehículos de la unidad del residente. Card por vehículo: tipo (ícono), placa, marca/color, cupo asignado. Solo lectura.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No tienes vehículos registrados. Contáctate con el admin." |
| Con datos | Lista normal |
