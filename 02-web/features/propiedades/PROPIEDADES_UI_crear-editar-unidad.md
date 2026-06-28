---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: crear-editar-unidad
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Crear / Editar Unidad — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal (centrado, ~560px)
**Se abre desde:** FAB "+ Nueva unidad" o menú "Editar" en lista/detalle
**Ruta:** — (no tiene ruta propia)

---

## Qué muestra

Formulario organizado en secciones con scroll interno.

**Sección 1 — Ubicación:**
- Torre: Select requerido (carga torres activas del condominio)
- Piso: Input numérico requerido (0 = Sótano; validar ≤ floor_count de torre)
- Número de unidad: Input texto requerido (placeholder "302", "101A")

**Sección 2 — Datos físicos:**
- Tipo: Select requerido (carga tipos activos)
- Área (m²): Input numérico requerido (placeholder "65.50")
- Coeficiente: Input numérico requerido (placeholder "0.008333"; tooltip "Coeficiente de copropiedad")
- Habitaciones: Input numérico opcional
- Baños: Input numérico opcional
- Tiene parqueadero: Toggle
- N° de parqueadero: Input texto (visible solo si toggle activo)

**Sección 3 — Notas:**
- Notas: Textarea opcional

**Footer del modal:**
- Botón "Cancelar" (secondary)
- Botón "Guardar" (primary, disabled hasta que formulario sea válido)

> En modo edición: todos los campos vienen pre-poblados. El título del modal cambia a "Editar unidad {full_designation}".

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Guardar" | Click | Valida → POST/PATCH → cierra modal → refetch lista |
| Botón "Cancelar" | Click | Cierra modal sin guardar |
| Escape key | Press | Cierra modal sin guardar (con confirmación si hay cambios) |
| Click fuera del modal | Click | Cierra modal sin guardar (con confirmación si hay cambios) |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial (crear) | Campos vacíos, botón Guardar disabled |
| Inicial (editar) | Campos pre-poblados, botón Guardar disabled hasta que haya cambios |
| Cargando torres/tipos | Selectores en estado skeleton |
| Guardando | Botón "Guardar" muestra spinner, campos deshabilitados |
| Error de validación | Mensajes inline bajo cada campo inválido |
| Error de servidor | Toast/alert con mensaje de error |

---

## Validaciones frontend

| Campo | Regla |
|---|---|
| Torre | Requerido |
| Piso | Requerido, ≥ 0, ≤ torre.floor_count |
| Número de unidad | Requerido, max 20 chars |
| Tipo | Requerido |
| Área | Requerido, > 0 |
| Coeficiente | Requerido, > 0 |
