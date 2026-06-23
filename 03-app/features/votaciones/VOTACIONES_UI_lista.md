---
type: ui-pantalla
status: active
module: mobile
feature: votaciones
pantalla: lista
tags: [app, votaciones, ui, lista]
updated: 2026-06-22
---

# Lista — Votaciones (App)

> Spec: [[03-app/features/votaciones/VOTACIONES_SPEC]]
> Panorama: [[00-shared/features/VOTACIONES]]

**Tipo:** Screen  |  **Ruta go_router:** `/votaciones`

---

## Qué muestra

Lista de votaciones activas en las que puede votar el residente. Card: tipo, pregunta truncada, fecha límite, badge si ya votó. Sección separada de votaciones cerradas (historial).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Ya votó | Redirige a resultados automáticamente |
| Votación cerrada | Solo resultados (modo lectura) |
| Con datos | Vista normal |
