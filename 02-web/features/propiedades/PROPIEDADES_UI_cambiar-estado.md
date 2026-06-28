---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: cambiar-estado
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Cambiar Estado de Unidad — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal (centrado, ~480px)
**Se abre desde:** Botón "Cambiar estado" en Drawer de detalle o menú en lista
**Ruta:** — (no tiene ruta propia)

---

## Qué muestra

- Título: "Cambiar estado de {full_designation}"
- Estado actual: badge grande, no editable (solo informativo)
- Nuevo estado: Select de estados activos, excluyendo el estado actual
- Motivo del cambio: Textarea requerido (placeholder "Ej: Cambio de inquilino, contrato finalizado")
- Badge informativo: si el nuevo estado tiene `allows_residents = false`, mostrar advertencia amarilla: "Este estado no permite residentes. Si la unidad tiene residentes activos, el cambio será rechazado."

**Footer:**
- Botón "Cancelar"
- Botón "Cambiar estado" (primary, disabled si no hay estado seleccionado o motivo vacío)

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Select nuevo estado | Seleccionar | Actualiza badge de advertencia si `allows_residents = false` |
| Botón "Cambiar estado" | Click | PATCH /properties/{id}/status → cierra modal → refetch |
| Botón "Cancelar" | Click | Cierra modal |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial | Select vacío, textarea vacío, botón disabled |
| Error del servidor | Mensaje de error (ej: "STATUS_HAS_ACTIVE_RESIDENTS") |
| Éxito | Modal se cierra, toast "Estado actualizado" |
