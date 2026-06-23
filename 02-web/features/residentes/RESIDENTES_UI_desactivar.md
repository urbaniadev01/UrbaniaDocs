---
type: ui-pantalla
status: active
module: web
feature: residentes
pantalla: desactivar
tags: [web, residentes, ui, desactivar]
updated: 2026-06-22
---

# Desactivar — Residentes y propietarios (Web)

> Spec técnico del feature: [[02-web/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Menú contextual o perfil → 'Desactivar'`


---

## Qué muestra

Modal de confirmación. Muestra: nombre del residente, campo de motivo de salida (requerido), campo de fecha de salida (por defecto hoy). Advertencia: la unidad quedará como vacía.

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Campo motivo | Escribir | Actualiza el valor |
| Botón "Cancelar" | Click | Cierra el modal |
| Botón "Desactivar residente" | Click | Llama a `useDesactivarResidente` |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |
