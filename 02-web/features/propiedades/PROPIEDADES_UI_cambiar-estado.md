---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: cambiar-estado
tags: [web, propiedades, ui, cambiar-estado]
updated: 2026-06-22
---

# Cambiar estado de unidad — Propiedades y unidades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** Menú contextual → "Cambiar estado" en lista, o botón "Cambiar estado" en detalle

---

## Qué muestra

Modal pequeño de confirmación de cambio de estado.

- `Identificación de la unidad` — "Torre A — Unidad 101", prominente como subtítulo
- `Estado actual` — badge del estado vigente
- `Selector de nuevo estado` — Select con las 3 opciones: Ocupada, Vacía, En venta; la opción actual está preseleccionada y deshabilitada
- `Nota informativa` — texto secundario que explica las implicaciones del cambio seleccionado

Pie del modal:
- Botón "Cancelar" — secundario
- Botón "Confirmar cambio" — primario, habilitado solo si se seleccionó un estado distinto al actual

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Select de estado | Cambio | Actualiza la selección y la nota informativa |
| Botón "Cancelar" | Click | Cierra el modal |
| Botón "Confirmar cambio" | Click | Llama a `useChangeEstado` |

**Flujos post-submit:**
| Resultado | Qué hace el cliente |
|---|---|
| Éxito | Cierra modal, invalida query de lista y detalle, toast de éxito |
| Error | Mensaje de error inline en el modal |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial | Select con estado actual preseleccionado, botón deshabilitado |
| Con selección | Botón habilitado, nota informativa actualizada |
| Cargando | Botón con spinner, select deshabilitado |

---

## Elementos condicionales

- `Nota informativa por estado`:
  - Ocupada: "La unidad quedará marcada como habitada con residente activo"
  - Vacía: "La unidad quedará marcada como disponible para nuevo residente"
  - En venta: "La unidad puede seguir habitada mientras está en proceso de venta"
