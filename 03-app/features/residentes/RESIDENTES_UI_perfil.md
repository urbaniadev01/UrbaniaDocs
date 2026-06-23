---
type: ui-pantalla
status: active
module: mobile
feature: residentes
pantalla: perfil
tags: [app, residentes, ui, perfil]
updated: 2026-06-22
---

# Perfil — Residentes y propietarios (App)

> Spec técnico del feature: [[03-app/features/residentes/RESIDENTES_SPEC]]
> Panorama global: [[00-shared/features/RESIDENTES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Navegación principal
**Ruta go_router:** `/residentes/:id`

---

## Qué muestra

Datos completos del residente: avatar, nombre, documento, contacto, unidad actual, tipo de vínculo. Sección de vehículos registrados. Solo lectura para el usuario de la app.

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
