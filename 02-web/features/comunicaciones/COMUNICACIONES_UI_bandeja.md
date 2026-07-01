---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Bandeja de comunicados — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Página · **Ruta:** `/comunicaciones` · **Permiso:** `comunicaciones.ver`

## Qué muestra
| Columna | Qué muestra | Notas |
|---|---|---|
| Título | `titulo` | + ícono "fijado" si cartelera |
| Segmento | todos/torre/morosos/unidad | chip |
| Estado | borrador/programado/enviado | badge |
| Programado | fecha si aplica | — |
| Lectura | % leídos | barra mini |

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Nuevo comunicado" | Click | Navega a `COMUNICACIONES_UI_redactar` |
| Fila | Click | Abre `COMUNICACIONES_UI_detalle` |
| Borrador → Editar | Click | Reabre en el editor |

## Estados
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "Aún no has enviado comunicados" + CTA |

## Filtros
Estado · Segmento · Rango de fechas · Búsqueda por título.
