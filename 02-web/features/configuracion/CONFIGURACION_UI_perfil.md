---
type: ui-pantalla
status: active
module: web
feature: configuracion
pantalla: perfil
tags: [web, configuracion, ui, perfil]
updated: 2026-06-22
---

# Perfil — Configuración (Web)

> Spec técnico del feature: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
> Panorama global: [[00-shared/features/CONFIGURACION]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Configuración' / Avatar → 'Mi perfil'`

---

## Qué muestra

Formulario con los datos del usuario logueado: `avatar` (subir foto), `nombre` (input), `email` (solo lectura, con nota de que no es editable), `teléfono` (input opcional). Botón 'Guardar cambios'. Tabs o links a la sección de Seguridad.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la sección |
| Con datos | Vista normal |
| Guardando | Botón con spinner, campos deshabilitados |
| Error | Mensaje de error inline |
