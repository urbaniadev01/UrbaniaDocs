---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: gestionar-catalogos
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Gestionar Catálogos — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página con tabs
**Se abre desde:** Sidebar → Propiedades → Catálogos
**Ruta:** `/properties/catalogs`

---

## Qué muestra

Dos tabs: "Tipos de unidad" y "Estados de unidad".

**Tab "Tipos de unidad":**
- Título: "Tipos de unidad"
- Botón "+ Nuevo tipo" (solo admin)
- Tabla:

| Columna | Qué muestra | Notas |
|---|---|---|
| Código | Código interno | Monospace |
| Nombre | Nombre visible | — |
| Descripción | Texto corto | — |
| Unidades | Conteo de unidades activas con este tipo | — |
| Activo | Badge "Sí"/"No" | — |
| Acciones | Editar, Desactivar | Solo admin |

- Modal de creación/edición: Código (input, solo minúsculas + _, no editable en edición), Nombre, Descripción, Orden numérico

**Tab "Estados de unidad":**
- Título: "Estados de unidad"
- Botón "+ Nuevo estado" (solo admin)
- Tabla:

| Columna | Qué muestra | Notas |
|---|---|---|
| Código | Código interno | Monospace |
| Nombre | Nombre visible | — |
| Permite residentes | Icono check/cross | — |
| Unidades | Conteo | — |
| Activo | Badge | — |
| Acciones | Editar, Desactivar | Solo admin |

- Modal de creación/edición: Código, Nombre, Descripción, ¿Permite residentes? (toggle), Orden

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "+ Nuevo tipo/estado" | Click | Abre modal de creación |
| Editar | Click | Abre modal pre-poblado |
| Desactivar | Click | ConfirmDialog → PATCH is_active = false |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tabla |
| Vacío | "No hay tipos/estados creados" + botón CTA |
| Error | Mensaje + botón Reintentar |
| Desactivación protegida | Error toast: "No se puede desactivar porque tiene N unidades activas" |
