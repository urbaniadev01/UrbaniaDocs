---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: gestionar-torres
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Gestionar Torres — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** Sidebar → Propiedades → Torres
**Ruta:** `/properties/towers`

---

## Qué muestra

- Título: "Torres"
- Botón "+ Nueva torre" (solo admin)
- Tabla de torres:

| Columna | Qué muestra | Notas |
|---|---|---|
| Nombre | Nombre de la torre + código | Ej: "Torre 1 (T1)" |
| Pisos | Número de pisos | — |
| Ascensor | Icono check/cancel | Sí/No |
| Unidades | Total / Ocupadas / Vacías | — |
| Acciones | Editar, Eliminar | Solo admin |

- Modal de creación/edición: Nombre, Código (opcional), N° pisos, Ascensor (toggle), Descripción, Orden

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "+ Nueva torre" | Click | Abre modal de creación |
| Editar | Click | Abre modal pre-poblado |
| Eliminar | Click | ConfirmDialog → DELETE |



## PROPIEDADES_UI_gestionar-catalogos.md

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
- Tabla: Código, Nombre, Descripción, Unidades asociadas, Activo (sí/no), Acciones (Editar, Desactivar)
- Botón "+ Nuevo tipo"
- Modal creación: Código (solo letras minúsculas y _), Nombre, Descripción, Orden

**Tab "Estados de unidad":**
- Tabla: Código, Nombre, ¿Permite residentes? (check/cross), Unidades asociadas, Activo, Acciones
- Botón "+ Nuevo estado"
- Modal creación: Código, Nombre, Descripción, ¿Permite residentes? (toggle), Orden



## PROPIEDADES_UI_documentos.md

---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: documentos
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Documentos de Unidad — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Inline / Sección dentro del Drawer de detalle
**Se abre desde:** Drawer de detalle de unidad → sección "Documentos"
**Ruta:** — (no tiene ruta propia)

---

## Qué muestra

- Título: "Documentos ({n})"
- Lista de documentos: cada entry muestra icono por tipo (PDF, imagen), nombre, tipo, tamaño formateado (KB/MB), fecha, botón descargar
- Botón "Subir documento" (solo admin)
- Modal de subida: File picker (PDF, JPEG, PNG, max 20MB), selector de tipo de documento, campo de nombre, notas opcionales, botón "Subir" con barra de progreso
