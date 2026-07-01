---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Cartelera / muro — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Página · **Ruta:** `/comunicaciones/cartelera` · **Permiso:** `comunicaciones.ver`

## Qué muestra
Comunicados con `fijado=true` ordenados por fecha, como tarjetas (lo que el residente ve fijado en su muro).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Tarjeta → "Desfijar" | Click | `fijado=false` |
| "Fijar comunicado" | Click | Selector de comunicado enviado a fijar |

## Estados
| Estado | Cómo se ve |
|---|---|
| Vacío | "No hay avisos fijados" |
