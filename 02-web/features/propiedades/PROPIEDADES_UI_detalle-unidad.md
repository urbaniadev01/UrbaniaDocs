---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: detalle-unidad
tags: [web, propiedades, ui, detalle-unidad]
updated: 2026-06-22
---

# Detalle de unidad — Propiedades y unidades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Drawer
**Se abre desde:** Click en fila de la tabla en [[02-web/features/propiedades/PROPIEDADES_UI_lista]]

---

## Qué muestra

Panel lateral (Drawer) de solo lectura con la información completa de la unidad.

**Sección: Información de la unidad**
- `Torre` — identificador de torre o bloque
- `Número` — número de unidad, prominente como heading
- `Tipo` — badge de tipo (apartamento / local / parqueadero / depósito)
- `Estado` — badge de estado (ocupada / vacía / en venta)
- `Área` — en m², con 1 decimal
- `Coeficiente` — porcentaje de copropiedad con 4 decimales

**Sección: Residente actual** (visible solo si hay residente)
- `Nombre` — link al perfil del residente
- `Tipo` — propietario / arrendatario
- `Desde` — fecha de inicio de la asignación

**Sección: Historial de residentes** (colapsada por defecto)
- Lista cronológica de residentes anteriores con fechas de inicio y fin

**Acciones al pie del drawer:**
- Botón "Editar" — abre Modal crear/editar
- Botón "Cambiar estado" — abre Modal cambiar estado
- Botón "Eliminar" — abre Modal eliminar (solo visible si no hay residente activo)

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Editar" | Click | Cierra drawer, abre [[02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad]] |
| Botón "Cambiar estado" | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_cambiar-estado]] encima del drawer |
| Botón "Eliminar" | Click | Abre [[02-web/features/propiedades/PROPIEDADES_UI_eliminar-unidad]] |
| Link de residente | Click | Navega a `/residentes/:id` |
| Sección historial | Click | Expande / colapsa el historial |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de las secciones del drawer |
| Con datos | Vista normal con todas las secciones |
| Error | Mensaje de error + botón "Reintentar" |

---

## Elementos condicionales

- `Sección "Residente actual"` — visible solo si `unidad.residente_actual !== null`
- `Botón "Eliminar"` — visible solo si `unidad.residente_actual === null`
- `Sección "Historial de residentes"` — visible solo si hay al menos un residente histórico
