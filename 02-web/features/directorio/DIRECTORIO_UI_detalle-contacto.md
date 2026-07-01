---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip]
updated: 2026-06-28
---

# Detalle de contacto — Directorio (Web)

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Drawer
**Se abre desde:** fila de `DIRECTORIO_UI_directorio-general`

---

## Qué muestra
- Cabecera: nombre, documento, badge "Tiene usuario" si `user_id`.
- Datos de contacto: email, teléfono, contacto de emergencia, notas.
- Sección **Unidades**: lista de `property_occupants` (unidad · tipo · primary · fechas ingreso/salida).
- Acciones rápidas: editar, vincular a unidad, ver historial.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Editar" | Click | Abre `DIRECTORIO_UI_crear-editar-contacto` (modo edición) |
| Botón "Vincular a unidad" | Click | Abre `DIRECTORIO_UI_vincular-unidad` |
| Chip de unidad → "Historial" | Click | Abre `DIRECTORIO_UI_historial-ocupantes` |
| Menú → Desvincular | Click | `ConfirmDialog` → marca salida en `property_occupants` |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Sin unidades | "Este contacto no está vinculado a ninguna unidad" |

## Elementos condicionales
- Badge "Tiene usuario" — visible solo si `contact.user_id != null`.
