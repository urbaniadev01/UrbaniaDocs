---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Detalle de comunicado — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Drawer · **Se abre desde:** Bandeja

## Qué muestra
- Contenido enviado + segmento + canales.
- `DeliveryStats`: enviados / entregados / leídos / fallidos, **por canal**.
- Lista de destinatarios con su estado de entrega (búsqueda).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Reenviar a fallidos" | Click | Reencola `deliveries` con estado fallido |
| "Duplicar" | Click | Abre el editor precargado |

## Estados
| Estado | Cómo se ve |
|---|---|
| En progreso | Métricas con polling (15s) |
| Completado | Métricas finales |
