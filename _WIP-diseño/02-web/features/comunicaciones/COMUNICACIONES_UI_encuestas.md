---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Encuestas — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Página · **Ruta:** `/comunicaciones/encuestas` · **Permiso:** `comunicaciones.ver`

## Qué muestra
Lista de encuestas (pregunta, estado abierta/cerrada, n.º de respuestas, fecha de cierre).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Nueva encuesta" | Click | `SurveyBuilder`: pregunta + opciones + cierre |
| Fila | Click | Abre `COMUNICACIONES_UI_resultados-encuesta` |
| Abierta → Cerrar | Click | `ConfirmDialog` → cierra la encuesta |

## Estados
| Estado | Cómo se ve |
|---|---|
| Vacío | "Crea una encuesta para sondear a la comunidad" |

> No vinculante: para votaciones formales de asamblea ver feature Asambleas (#19).
