---
type: ui-pantalla
status: active
module: mobile
feature: residentes
pantalla: lista
tags: [app, residentes, ui, lista]
updated: 2026-06-22
---

# Lista — Residentes y propietarios (App)

> Spec técnico del feature: [[03-app/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Navegación principal
**Ruta go_router:** `/residentes`

---

## Qué muestra

Lista scrolleable de residentes del conjunto. Card por residente: nombre (prominente), tipo (propietario/arrendatario), unidad asignada, badge de estado. SearchBar en AppBar para filtrar por nombre.

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Card de residente | Tap | Navega al perfil |
| Pull down | Pull to refresh | Recarga desde API |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de cards |
| Vacío | Ilustración + texto |
| Error | Mensaje + "Reintentar" |
| Sin conexión | Banner offline; datos en caché |
| Con datos | Lista normal |

---

## Accesibilidad

- Cards con Semantics de nombre y tipo de residente
