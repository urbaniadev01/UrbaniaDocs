---
type: ui-pantalla
status: active
module: mobile
feature: visitantes
pantalla: lista
tags: [app, visitantes, ui, lista]
updated: 2026-06-22
---

# Lista — Visitantes (App)

> Spec: [[03-app/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Screen  |  **Ruta go_router:** `/visitantes`

---

## Qué muestra

Historial de visitas a la unidad del residente. Card por visita: nombre del visitante, fecha, hora de ingreso/salida, estado. Botón 'Preautorizar visita'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Sin visitas registradas" + botón preautorizar |
| Con datos | Vista normal |
