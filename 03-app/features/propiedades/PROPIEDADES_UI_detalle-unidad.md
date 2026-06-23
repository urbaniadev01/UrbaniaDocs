---
type: ui-pantalla
status: active
module: mobile
feature: propiedades
pantalla: detalle-unidad
tags: [app, propiedades, ui, detalle-unidad]
updated: 2026-06-22
---

# Detalle de unidad — Propiedades y unidades (App)

> Spec técnico del feature: [[03-app/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** BottomSheet
**Se abre desde:** Tap en card de unidad en [[03-app/features/propiedades/PROPIEDADES_UI_lista]]

---

## Qué muestra

BottomSheet con información completa de la unidad seleccionada.

- `Número de unidad` — prominente como título del sheet
- `Torre / Bloque` — subtítulo
- `Estado` — badge prominente
- `Tipo` — chip de tipo (apartamento / local / parqueadero / depósito)
- `Área` — "X.X m²"
- `Coeficiente` — "X.XXXX% de copropiedad"
- `Residente actual` (si aplica) — nombre, tipo (propietario / arrendatario)

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Drag down / botón X | Swipe o tap | Cierra el BottomSheet |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de los campos del sheet |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |

---

## Elementos condicionales

- `Sección "Residente actual"` — visible solo si `unidad.residente_actual !== null`

---

## Accesibilidad

- El BottomSheet debe tener `Semantics(label: "Detalle de unidad [número]")`
- El botón de cierre debe tener `Semantics(label: "Cerrar detalle")`
