---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Resultados de encuesta — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Drawer · **Se abre desde:** Encuestas

## Qué muestra
- Pregunta + barras por opción (conteo y %), total de respuestas.
- Actualización en tiempo real (polling).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Exportar" | Click | CSV de resultados |
| "Cerrar encuesta" | Click | Cierra y congela resultados |

## Estados
| Estado | Cómo se ve |
|---|---|
| Abierta | Barras + indicador "en vivo" |
| Cerrada | Resultados finales + fecha de cierre |
