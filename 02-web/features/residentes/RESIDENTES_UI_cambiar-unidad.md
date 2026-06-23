---
type: ui-pantalla
status: active
module: web
feature: residentes
pantalla: cambiar-unidad
tags: [web, residentes, ui, cambiar-unidad]
updated: 2026-06-22
---

# Cambiar Unidad — Residentes y propietarios (Web)

> Spec técnico del feature: [[02-web/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Menú contextual o perfil → 'Cambiar unidad'`


---

## Qué muestra

Modal con selector de unidad disponible. Muestra: unidad actual, selector de nueva unidad (solo unidades vacías), campo de fecha de inicio del nuevo vínculo.

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Select de unidad | Cambio | Actualiza la selección |
| Botón "Cancelar" | Click | Cierra el modal |
| Botón "Confirmar cambio" | Click | Llama a `useCambiarUnidad` |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |
