---
type: ui-pantalla
status: active
module: web
feature: configuracion
pantalla: cambiar-contrasena
tags: [web, configuracion, ui, cambiar-contrasena]
updated: 2026-06-22
---

# Cambiar Contrasena — Configuración (Web)

> Spec técnico del feature: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
> Panorama global: [[00-shared/features/CONFIGURACION]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Sheet
**Se abre desde:** `Botón 'Cambiar contraseña' en pantalla Seguridad`

---

## Qué muestra

Panel lateral con formulario: `Contraseña actual` (input password), `Nueva contraseña` (input password con toggle), `Confirmar nueva contraseña` (input password). Validación: mínimo 8 caracteres, 1 mayúscula, 1 número, no reutilizar contraseñas anteriores.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la sección |
| Con datos | Vista normal |
| Guardando | Botón con spinner, campos deshabilitados |
| Error | Mensaje de error inline |
