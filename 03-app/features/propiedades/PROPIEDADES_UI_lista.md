---
type: ui-pantalla
status: active
module: mobile
feature: propiedades
pantalla: lista
tags: [app, propiedades, ui, lista]
updated: 2026-06-22
---

# Lista de unidades — Propiedades y unidades (App)

> Spec técnico del feature: [[03-app/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Navegación principal o deep link
**Ruta go_router:** `/propiedades`

---

## Qué muestra

Lista de unidades del conjunto visibles para el residente autenticado.

- `AppBar` — título "Propiedades", SearchBar integrado
- Lista de `UnidadCard`:

| Campo en card | Qué muestra | Posición |
|---|---|---|
| Número de unidad | "Apto 101" o "Local L-01" | Línea 1, prominente |
| Torre | "Torre A" | Línea 2, muted |
| Estado | Badge de estado | Derecha, alineado al centro |
| Coeficiente | "1.25%" | Debajo del badge, pequeño |

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Card de unidad | Tap | Abre [[03-app/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |
| SearchBar | Escribir | Filtra lista local por número de unidad |
| Pull down | Pull to refresh | Recarga desde API |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de 5 cards |
| Vacío | Ilustración + "No hay unidades registradas" |
| Error | Mensaje + botón "Reintentar" |
| Sin conexión | Banner offline; datos en caché |
| Con datos | Lista scrolleable |

---

## Elementos condicionales

- `SearchBar` — visible siempre en la AppBar

---

## Accesibilidad

- `UnidadCard` — Semantics con label "Unidad [número], Torre [torre], estado [estado]"
