---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: lista
tags: [web, propiedades, ui, lista]
updated: 2026-06-22
---

# Lista de propiedades — Propiedades y unidades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** Sidebar → "Propiedades"
**Ruta:** `/propiedades`

---

## Qué muestra

Tabla principal de unidades del conjunto. Columnas:

| Columna | Qué muestra | Notas |
|---|---|---|
| Torre | Identificador de torre o bloque | Texto |
| Unidad | Número de unidad (ej: "101", "PH2") | Texto, prominente |
| Tipo | Tipo de unidad | Badge: apartamento / local / parqueadero / depósito |
| Área | Área en m² | Número con 1 decimal |
| Coeficiente | % de copropiedad | Número con 4 decimales |
| Estado | Estado de ocupación | Badge: ocupada (verde) / vacía (gris) / en venta (amarillo) |
| Residente | Nombre del residente actual | Link a perfil; "—" si vacía |
| Acciones | Menú contextual | 48px fijo |

Sobre la tabla:
- `Botón "Nueva unidad"` — primario, abre Modal crear/editar
- `Selector de torre` — filtra la tabla por torre/bloque
- `Input de búsqueda` — filtra por número de unidad o residente
- `Badge de advertencia de coeficientes` — visible si la suma no es 1.0000

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Nueva unidad" | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad]] |
| Fila de tabla | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |
| Menú → Editar | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad]] con datos precargados |
| Menú → Cambiar estado | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_cambiar-estado]] |
| Menú → Eliminar | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_eliminar-unidad]] |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tabla (5 filas) |
| Vacío | EmptyState: "No hay unidades registradas aún" + botón "Nueva unidad" |
| Error | Mensaje de error + botón "Reintentar" |
| Con datos | Tabla con paginación server-side, 20 filas por página |

---

## Elementos condicionales

- `Badge de advertencia de coeficientes` — visible solo si `Math.abs(sumaCoeficientes - 1.0) > 0.0001`
- `Menú contextual` — visible solo para usuarios con rol admin
- `Residente (link)` — solo si la unidad tiene residente activo; "—" en caso contrario

---

## Filtros y búsqueda

| Filtro | Control | Opciones / comportamiento |
|---|---|---|
| Torre | Select | Todas / Torre A / Torre B / ... (dinámico desde API) |
| Estado | Select | Todos / Ocupada / Vacía / En venta |
| Búsqueda | Text input | Filtra por número de unidad o nombre de residente, server-side |
