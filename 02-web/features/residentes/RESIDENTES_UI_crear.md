---
type: ui-pantalla
status: active
module: web
feature: residentes
pantalla: crear
tags: [web, residentes, ui, crear]
updated: 2026-06-22
---

# Crear — Residentes y propietarios (Web)

> Spec técnico del feature: [[02-web/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Nuevo residente' en lista`


---

## Qué muestra

Formulario de creación. Campos: nombre completo, tipo de documento + número, email, teléfono (opcional), tipo de residente (propietario/arrendatario/familiar), unidad asignada (selector de unidades disponibles), fecha de ingreso.

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Cancelar" | Click | Cierra el modal |
| Botón "Guardar" | Click | Llama a `useCreateResidente` |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |
