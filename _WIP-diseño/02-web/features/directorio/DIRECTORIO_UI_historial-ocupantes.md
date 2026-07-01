---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip]
updated: 2026-06-28
---

# Historial de ocupantes por unidad — Directorio (Web)

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Drawer
**Se abre desde:** detalle de contacto o vista por unidad

---

## Qué muestra
Timeline cronológico de `property_occupants` (vigentes e históricos) de la unidad:
- Persona, tipo de ocupante, fecha de ingreso y salida.
- Marca visual de vinculación vigente vs. finalizada.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Filtro "Solo vigentes" | Toggle | Filtra la línea de tiempo |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de timeline |
| Vacío | "Sin historial de ocupación" |
