---
type: ui-pantalla
status: active
module: mobile
feature: visitantes
pantalla: detalle
tags: [app, visitantes, ui, detalle]
updated: 2026-06-22
---

# Detalle — Visitantes (App)

> Spec: [[03-app/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** BottomSheet  |  **Se abre desde:** Tap en visita

---

## Qué muestra

Detalle de la visita. Nombre, cédula, fecha, hora ingreso/salida. Si está preautorizada: muestra el código QR en grande para que el visitante lo presente en portería.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Sin visitas registradas" + botón preautorizar |
| Con datos | Vista normal |
