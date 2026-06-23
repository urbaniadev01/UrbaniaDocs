---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: eliminar-unidad
tags: [web, propiedades, ui, eliminar-unidad]
updated: 2026-06-22
---

# Eliminar unidad — Propiedades y unidades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** Menú contextual → "Eliminar" en lista, o botón "Eliminar" en detalle (solo visible si no hay residente activo)

---

## Qué muestra

Modal de confirmación destructiva (ConfirmDialog).

- `Título` — "¿Eliminar unidad [número]?", prominente
- `Advertencia` — "Esta acción no se puede deshacer. Se eliminará toda la información de la unidad incluyendo su historial."
- `Lista de dependencias` (si aplica) — items en rojo que advierten qué datos asociados se perderán (ej: historial de residentes, ajustes de cuota)

Pie del modal:
- Botón "Cancelar" — secundario
- Botón "Eliminar permanentemente" — destructivo (rojo), con spinner durante el request

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Cancelar" | Click | Cierra el modal |
| Botón "Eliminar permanentemente" | Click | Llama a `useDeletePropiedad` |

**Flujos post-submit:**
| Resultado | Qué hace el cliente |
|---|---|
| Éxito | Cierra modal, invalida lista, toast "Unidad eliminada" |
| Error UNIT_HAS_RESIDENT | Error: "No se puede eliminar: la unidad tiene un residente activo" |
| Error genérico | Mensaje de error en el modal |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial | Modal con advertencia y botones |
| Cargando | Botón "Eliminar" con spinner, ambos botones deshabilitados |
| Error | Mensaje de error bajo los botones |
