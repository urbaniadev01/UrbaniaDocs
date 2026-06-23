---
type: ui-pantalla
status: active
module: web
feature: residentes
pantalla: editar
tags: [web, residentes, ui, editar]
updated: 2026-06-22
---

# Editar — Residentes y propietarios (Web)

> Spec técnico del feature: [[02-web/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Sheet
**Se abre desde:** `Botón 'Editar' en lista o perfil`


---

## Qué muestra

Panel lateral con el formulario completo precargado. Todos los campos editables excepto tipo de documento y número (datos sensibles que requieren proceso administrativo aparte).

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Cancelar" | Click | Cierra el Sheet |
| Botón "Guardar cambios" | Click | Llama a `useUpdateResidente` |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |
