---
type: ui-pantalla
status: active
module: web
feature: configuracion
pantalla: seguridad
tags: [web, configuracion, ui, seguridad]
updated: 2026-06-22
---

# Seguridad — Configuración (Web)

> Spec técnico del feature: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
> Panorama global: [[00-shared/features/CONFIGURACION]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Configuración' → tab 'Seguridad'`

---

## Qué muestra

Tres secciones: **Contraseña** — botón 'Cambiar contraseña' → abre Sheet. **Autenticación en dos pasos (MFA)** — estado actual (activo/inactivo), botón de activar/desactivar, link para regenerar códigos de respaldo. **Sesiones activas** — tabla de sesiones (ver [[02-web/features/configuracion/CONFIGURACION_UI_sesiones]]).

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la sección |
| Con datos | Vista normal |
| Guardando | Botón con spinner, campos deshabilitados |
| Error | Mensaje de error inline |
