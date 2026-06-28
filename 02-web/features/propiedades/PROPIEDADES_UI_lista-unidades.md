---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: lista-unidades
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Lista de Unidades — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** Sidebar → Propiedades
**Ruta:** `/properties`

---

## Qué muestra

Página principal de gestión de unidades. Layout: sidebar + barra de filtros superior + tabla de resultados.

- **Barra de filtros** (siempre visible):
  - `Selector de torre` — dropdown con todas las torres del condominio + "Todas"
  - `Selector de tipo` — dropdown con tipos activos + "Todos"
  - `Selector de estado` — dropdown con estados activos + "Todos"
  - `Selector de piso` — dropdown numérico (rango dinámico según torre seleccionada) + "Todos"
  - `Búsqueda por unidad` — input de texto con icono de lupa, búsqueda server-side por `unit_number`
  - `Botón "Validar coeficientes"` — abre el resumen de validación en un inline expandible
- **Tabla de unidades** (con paginación server-side):

| Columna | Qué muestra | Notas |
|---|---|---|
| Unidad | `full_designation` ("T1 - 302") | Enlace que abre el Drawer de detalle |
| Torre | Nombre de la torre | — |
| Piso | Número de piso ("3", "Sótano" si es 0) | — |
| Tipo | Badge con el nombre del tipo | Color por tipo configurable |
| Área | `area_m2` + "m²" | Alineado a la derecha |
| Coeficiente | Valor del coeficiente | Tooltip: "Porcentaje de copropiedad" |
| Estado | `StatusBadge` coloreado | Color mapeado por status code |
| Residentes | Número de residentes | *(post-MVP, siempre 0 hasta feature #4)* Si es 0, mostrar "—" |
| Acciones | Menú de tres puntos: Ver, Cambiar estado, Editar, Eliminar | Solo visible para admin |

- **Botón flotante "+ Nueva unidad"** — FAB abajo a la derecha, abre el modal de creación
- **Resumen de validación de coeficientes** (inline, expandible) — tarjeta que muestra: suma actual, total esperado, diferencia, indicador visual de balance (verde/rojo)

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Filtro de torre | Seleccionar | Refetch lista con filtro |
| Filtro de tipo | Seleccionar | Refetch lista con filtro |
| Filtro de estado | Seleccionar | Refetch lista con filtro |
| Búsqueda | Escribir (debounce 300ms) | Refetch con search term |
| Botón "Validar coeficientes" | Click | Expande/colapsa resumen debajo de filtros |
| Fila de tabla | Click | Abre `PROPIEDADES_UI_detalle-unidad` (Drawer) |
| Menú → Ver | Click | Abre `PROPIEDADES_UI_detalle-unidad` (Drawer) |
| Menú → Cambiar estado | Click | Abre `PROPIEDADES_UI_cambiar-estado` (Modal) |
| Menú → Editar | Click | Abre `PROPIEDADES_UI_crear-editar-unidad` (Modal, modo edición) |
| Menú → Eliminar | Click | Abre ConfirmDialog: "¿Eliminar unidad X?" + dependencias |
| FAB "+ Nueva unidad" | Click | Abre `PROPIEDADES_UI_crear-editar-unidad` (Modal, modo creación) |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tabla (5 filas) + filtros deshabilitados |
| Vacío | Ilustración "No hay unidades registradas" + botón "Crear primera unidad" |
| Error | Mensaje "Error al cargar unidades" + botón "Reintentar" |
| Con datos | Tabla con filas + paginador en la parte inferior |
| Filtros sin resultados | Tabla vacía con mensaje "No hay unidades que coincidan con los filtros" + botón "Limpiar filtros" |

---

## Elementos condicionales

- `FAB "+ Nueva unidad"` — visible solo si el usuario tiene rol `admin`
- `Columna de Acciones` — visible solo si el usuario tiene rol `admin`
- `Resumen de coeficientes` — expandido/colapsado según estado toggle del botón
- `Paginador` — visible solo si `total > per_page`

---

## Filtros y búsqueda

| Filtro | Control | Opciones / comportamiento |
|---|---|---|
| Torre | Select | "Todas" + lista de torres; al seleccionar, actualiza rango de pisos |
| Tipo | Select | "Todos" + tipos activos |
| Estado | Select | "Todos" + estados activos (coloreados) |
| Piso | Select | "Todos" + números de 0 a floor_count de la torre seleccionada |
| Residentes | Select | *(post-MVP — requiere feature #4 Directorio de Residentes)* "Todos" / "Con residentes" / "Sin residentes" |
| Búsqueda | Text input con debounce | Búsqueda server-side por número de unidad |
