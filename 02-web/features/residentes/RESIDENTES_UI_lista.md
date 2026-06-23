---
type: ui-pantalla
status: active
module: web
feature: residentes
pantalla: lista
tags: [web, residentes, ui, lista]
updated: 2026-06-22
---

# Lista — Residentes y propietarios (Web)

> Spec técnico del feature: [[02-web/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Residentes'`
**Ruta:** `/residentes`

---

## Qué muestra

Tabla de residentes con columnas:

| Columna | Qué muestra | Notas |
|---|---|---|
| Nombre | Nombre completo + avatar | Con link al perfil |
| Documento | Tipo + número | Texto secundario |
| Unidad | Torre + número | Badge; "—" si inactivo |
| Tipo | Propietario / Arrendatario / Familiar | Badge |
| Estado | Activo / Inactivo | Badge |
| Acciones | Menú contextual | 48px fijo |

Sobre la tabla: Botón "Nuevo residente", filtros de tipo y estado, búsqueda por nombre o documento.

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Nuevo residente" | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_crear]] |
| Fila de tabla | Click | Navega a `/residentes/:id` |
| Menú → Editar | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_editar]] |
| Menú → Cambiar unidad | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_cambiar-unidad]] |
| Menú → Desactivar | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_desactivar]] |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |
