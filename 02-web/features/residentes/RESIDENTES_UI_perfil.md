---
type: ui-pantalla
status: active
module: web
feature: residentes
pantalla: perfil
tags: [web, residentes, ui, perfil]
updated: 2026-06-22
---

# Perfil — Residentes y propietarios (Web)

> Spec técnico del feature: [[02-web/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Click en fila de lista o link desde otras pantallas`
**Ruta:** `/residentes/:id`

---

## Qué muestra

**Sección: Datos personales** — nombre, documento, email, teléfono, avatar
**Sección: Unidad actual** — torre, número, tipo de vínculo, fecha de ingreso; link a detalle de unidad
**Sección: Historial de unidades** — lista cronológica de unidades anteriores
**Sección: Vehículos** — vehículos registrados a nombre de este residente
**Sección: Historial financiero** — resumen de cuotas y pagos (link a cuotas/pagos)

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Editar" | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_editar]] |
| Botón "Cambiar unidad" | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_cambiar-unidad]] |
| Botón "Desactivar" | Click | Abre [[02-web/features/residentes/RESIDENTES_UI_desactivar]] |
| Link de unidad | Click | Abre detalle de unidad |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje de error + botón "Reintentar" |
