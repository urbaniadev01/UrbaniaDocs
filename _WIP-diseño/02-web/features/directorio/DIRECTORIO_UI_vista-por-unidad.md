---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip]
updated: 2026-06-28
---

# Vista por unidad — Directorio (Web)

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Página
**Ruta:** `/directorio/unidad/:propertyId`
**Se abre desde:** Propiedades → unidad → "Ver ocupantes", o búsqueda por unidad

---

## Qué muestra
- Cabecera de la unidad: torre, número, tipo, coeficiente.
- Ocupantes agrupados por tipo (propietario, residentes, inquilinos, contactos de emergencia), cada uno con nombre, contacto y flag primary.
- Línea de tiempo resumida (enlace a historial completo).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Agregar ocupante" | Click | Abre `DIRECTORIO_UI_vincular-unidad` |
| Ocupante → "Historial" | Click | Abre `DIRECTORIO_UI_historial-ocupantes` |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tarjetas |
| Vacío | "Esta unidad no tiene ocupantes registrados" |
