---
type: ui-pantalla
status: active
module: mobile
feature: visitantes
pantalla: qr
tags: [app, visitantes, ui, qr]
updated: 2026-06-22
---

# Qr — Visitantes (App)

> Spec: [[03-app/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Screen  |  **Ruta go_router:** `/visitantes/qr`

---

## Qué muestra

Pantalla de escaneo de QR de preautorización. Solo visible para rol portero/admin. Cámara con área de escaneo. Al leer el QR: muestra los datos del visitante y la unidad. Botón 'Confirmar ingreso'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Sin visitas registradas" + botón preautorizar |
| Con datos | Vista normal |
