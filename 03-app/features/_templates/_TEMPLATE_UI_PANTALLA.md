---
type: template
status: active
module: mobile
tags: [app, template, features, ui, pantalla]
updated: 2026-06-22
---

# <Nombre de la pantalla> — <Feature> (App)

> Spec técnico del feature: [[03-app/features/<NOMBRE>_SPEC]]
> Panorama global: [[00-shared/features/<NOMBRE>]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen / BottomSheet / Dialog / Inline
**Se abre desde:** `<qué acción o navegación la origina>`
**Ruta go_router:** `/<ruta>` *(solo si es Screen)*

---

## Qué muestra

> Campos visibles en orden de aparición, de arriba a abajo. No mencionar colores ni fuentes (eso lo cubre [[APP_DESIGN_SYSTEM]]). Sí mencionar jerarquía: qué es prominente, qué es secundario.

- `campo` — qué representa y cómo se presenta (ej: fecha en formato "lun 22 jun")
- `campo` — ...

*Si es una lista, describir el card de cada ítem:*

| Campo en card | Qué muestra | Posición |
|---|---|---|
| Título | Nombre del recurso | Línea 1, prominente |
| Subtítulo | Dato secundario | Línea 2, muted |
| Badge | Estado | Derecha, alineado al centro |
| Ícono trailing | Acción rápida | Extremo derecho |

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Card de ítem | Tap | Navega a `<NOMBRE>_UI_<pantalla>` |
| FAB "+" | Tap | Abre `<NOMBRE>_UI_<pantalla>` |
| Swipe izquierda | Swipe | Acción rápida: eliminar |
| Pull down | Pull to refresh | Recarga la lista |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de N cards |
| Vacío | Ilustración + texto + botón CTA |
| Error | Mensaje + botón "Reintentar" |
| Sin conexión | Banner de offline; datos en caché si disponibles |
| Con datos | Vista normal |

---

## Elementos condicionales

- `<widget>` — visible solo si `<condición>`
- `<widget>` — oculto si `<condición>`

---

## Filtros y búsqueda

> Eliminar esta sección si la pantalla no tiene filtros.

| Filtro | Control | Opciones |
|---|---|---|
| Estado | Chips horizontales | Todos / Pendiente / Activo |
| Búsqueda | SearchBar en AppBar | Server-side |

---

## Accesibilidad

> Solo lo que requiere atención específica en esta pantalla. Ver [[APP_ACCESSIBILITY]] para reglas generales.

- `<widget>` — `<qué Semantics o label necesita>`

---

## Archivos de diseño adicionales

> Eliminar si no hay archivos complementarios para esta pantalla.

| Archivo | Descripción |
|---|---|
| `<NOMBRE>_<pantalla>.png` | Captura del diseño |
