---
type: ui-pantalla
status: active
module: mobile
feature: votaciones
pantalla: resultados
tags: [app, votaciones, ui, resultados]
updated: 2026-06-22
---

# Resultados — Votaciones (App)

> Spec: [[03-app/features/votaciones/VOTACIONES_SPEC]]
> Panorama: [[00-shared/features/VOTACIONES]]

**Tipo:** Screen  |  **Ruta go_router:** `/votaciones/:id/resultados`

---

## Qué muestra

Resultados visuales. Barras horizontales por opción con porcentaje. Badge de la opción que ganó. Muestra si el residente ya votó y qué opción eligió. Para votaciones cerradas: resultado final con sello de 'Cerrada'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Ya votó | Redirige a resultados automáticamente |
| Votación cerrada | Solo resultados (modo lectura) |
| Con datos | Vista normal |
