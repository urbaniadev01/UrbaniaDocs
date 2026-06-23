---
type: template
status: active
module: web
tags: [web, template, features, ui, pantalla]
updated: 2026-06-22
---

# <Nombre de la pantalla> — <Feature> (Web)

> Spec técnico del feature: [[02-web/features/<NOMBRE>_SPEC]]
> Panorama global: [[00-shared/features/<NOMBRE>]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página / Modal / Drawer / Sheet / Inline
**Se abre desde:** `<qué acción o pantalla la origina>`
**Ruta:** `/<ruta>` *(solo si es Página)*

---

## Qué muestra

> Campos visibles en orden de aparición. No mencionar estilos (eso lo cubre [[WEB_VISUAL_STANDARDS]]). Sí mencionar jerarquía: qué es prominente, qué es secundario.

- `campo` — qué representa y cómo se presenta (ej: fecha en formato relativo "hace 2h")
- `campo` — ...

*Si la pantalla tiene una tabla, describir sus columnas:*

| Columna | Qué muestra | Notas |
|---|---|---|
| Nombre | Nombre del recurso | — |
| Estado | Badge de estado | 100px fijo |
| Acciones | Menú contextual | 48px fijo |

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Crear" | Click | Abre `<NOMBRE>_UI_<modal>` |
| Fila de tabla | Click | Abre `<NOMBRE>_UI_<drawer>` |
| Menú → Eliminar | Click | Abre `<NOMBRE>_UI_confirmar-eliminar` |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tabla (3 filas) |
| Vacío | Ilustración + "No hay `<recursos>` aún" + botón CTA |
| Error | Mensaje de error + botón "Reintentar" |
| Con datos | Vista normal |

---

## Elementos condicionales

- `<elemento>` — visible solo si `<condición>`
- `<elemento>` — oculto si `<condición>`

---

## Filtros y búsqueda

> Eliminar esta sección si la pantalla no tiene filtros.

| Filtro | Control | Opciones / comportamiento |
|---|---|---|
| Estado | Select | Todos / Pendiente / Activo |
| Búsqueda | Text input | Filtra por nombre, server-side |
| Período | Date range picker | Mes y año |

---

## Archivos de diseño adicionales

> Eliminar si no hay archivos complementarios para esta pantalla.

| Archivo | Descripción |
|---|---|
| `<NOMBRE>_mockup_<pantalla>.html` | Mockup interactivo |
| `<NOMBRE>_<pantalla>.png` | Captura del diseño en Figma |
