---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip]
updated: 2026-06-28
---

# Vincular contacto a unidad — Directorio (Web)

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Modal
**Se abre desde:** detalle de contacto → "Vincular a unidad"

---

## Qué muestra
- Selector de **unidad** (autocomplete por número de unidad, scopeado al conjunto).
- Selector de **tipo de ocupante** (`occupant_type`: propietario/residente/inquilino/…).
- Toggle **primary** (ocupante principal de la unidad).
- Fechas `move_in_date` (ingreso) y `move_out_date` (salida, opcional).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Vincular" | Click | `POST /directorio/property-occupants`; refresca el detalle |
| Botón "Cancelar" | Click | Cierra sin guardar |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Validando | Botón loading |
| Conflicto primary | Aviso "Ya existe un ocupante principal en esta unidad" |

## Elementos condicionales
- `move_out_date` deshabilitado si la vinculación es vigente (sin salida).
