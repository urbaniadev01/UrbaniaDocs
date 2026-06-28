---
type: ui-pantalla
status: active
module: mobile
feature: propiedades
pantalla: lista-unidades
tags: [app, propiedades, ui]
updated: 2026-06-27
---

# Lista de Unidades — Propiedades (App)

> Spec técnico del feature: [[03-app/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Bottom navigation → "Propiedades" / "Unidades"
**Ruta go_router:** `/properties`

---

## Qué muestra

Pantalla con AppBar titulada "Unidades" y una lista scrollable.

- **AppBar**: título "Unidades" + icono de filtro (opcional)
- **Lista de cards**: cada `PropertyCard` muestra:
  - `full_designation` ("T1 - 302") como título, texto grande y bold
  - Tipo de unidad como subtítulo (ej: "Apartamento")
  - Badge de estado coloreado (ej: "Ocupada" en verde)
  - Área en m² como metadata secundaria
  - Coeficiente como metadata secundaria
- **Pull-to-refresh**: actualiza la lista desde el servidor
- **Loading skeleton**: mientras carga la lista

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Card de unidad | Tap | Abre `PROPIEDADES_UI_detalle-unidad` (BottomSheet) |
| Pull-to-refresh | Swipe hacia abajo | Refetch lista |
| AppBar filter icon | Tap | Abre modal de filtros (post-MVP) |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | 5 skeleton cards |
| Vacío | Ilustración "No hay unidades registradas" |
| Error | Snackbar "Error al cargar unidades" + botón Reintentar |
| Con datos | Lista de cards |

---

## Elementos condicionales

- Badge de estado: color dinámico según `status.code`
