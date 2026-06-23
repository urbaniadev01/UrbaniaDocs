---
type: ui-pantalla
status: active
module: mobile
feature: vehiculos
pantalla: detalle
tags: [app, vehiculos, ui, detalle]
updated: 2026-06-22
---

# Detalle — Vehículos (App)

> Spec: [[03-app/features/vehiculos/VEHICULOS_SPEC]]
> Panorama: [[00-shared/features/VEHICULOS]]

**Tipo:** BottomSheet  |  **Se abre desde:** Tap en vehículo

---

## Qué muestra

Detalle del vehículo: tipo, placa, marca, modelo, color, cupo de parqueadero. Sin acciones de edición (solo el admin puede editar).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No tienes vehículos registrados. Contáctate con el admin." |
| Con datos | Lista normal |
