---
type: ui-pantalla
status: active
module: mobile
feature: votaciones
pantalla: votar
tags: [app, votaciones, ui, votar]
updated: 2026-06-22
---

# Votar — Votaciones (App)

> Spec: [[03-app/features/votaciones/VOTACIONES_SPEC]]
> Panorama: [[00-shared/features/VOTACIONES]]

**Tipo:** Screen  |  **Ruta go_router:** `/votaciones/:id/votar`

---

## Qué muestra

Pantalla de votación. Pregunta prominente. Opciones como botones seleccionables (radio). Botón 'Confirmar voto'. Diálogo de confirmación antes de enviar (irreversible). Muestra el coeficiente del voto si es formal.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Ya votó | Redirige a resultados automáticamente |
| Votación cerrada | Solo resultados (modo lectura) |
| Con datos | Vista normal |
