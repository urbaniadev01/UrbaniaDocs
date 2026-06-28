---
type: ui-pantalla
status: active
module: mobile
feature: propiedades
pantalla: detalle-unidad
tags: [app, propiedades, ui]
updated: 2026-06-27
---

# Detalle de Unidad — Propiedades (App)

> Spec técnico del feature: [[03-app/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** BottomSheet (expandible, ~70% de la pantalla)
**Se abre desde:** Tap en `PropertyCard` en [[PROPIEDADES_UI_lista-unidades]]
**Ruta:** — (no tiene ruta propia)

---

## Qué muestra

BottomSheet con handle de arrastre. Contenido scrollable.

**Header del sheet:**
- `full_designation` como título ("T1 - 302")
- Badge de estado grande, coloreado
- Nota si aplica

**Sección "Información":**
- Torre: nombre
- Piso: número (0 → "Sótano")
- Tipo: nombre
- Área: `valor` m²
- Coeficiente: `valor`
- Habitaciones: número o "—"
- Baños: número o "—"
- Parqueadero: "Sí (P-12)" o "No"

**Sección "Ocupación":**
- Estado actual con badge
- Residentes: contador (0 si no hay)

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Swipe hacia abajo | Arrastrar | Cierra el BottomSheet |
| Tap fuera del sheet | Tap en backdrop | Cierra el BottomSheet |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton del sheet |
| Error | Snackbar "Error al cargar detalle" |
| Con datos | Sheet con info completa |

---

## Elementos condicionales

- Badge de estado: color según el código del estado
- Contador de residentes: si es 0, mostrar "Sin residentes"
