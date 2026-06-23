---
type: template
status: active
module: web
tags: [web, template, features]
updated: 2026-06-22
---

# Guía de la carpeta `02-web/features/`

## Estructura

```
02-web/features/
  _templates/              ← Plantillas base (no modificar)
  auth/                    ← Un folder por feature (nombre en minúsculas)
    AUTH_SPEC.md
    AUTH_UI_login.md
    AUTH_UI_<pantalla>.md
    logo.jpeg              ← Assets del feature
  propiedades/
    PROPIEDADES_SPEC.md
    PROPIEDADES_UI_lista.md
    PROPIEDADES_UI_<pantalla>.md
  ...
```

## Plantillas disponibles

| Archivo | Cuándo usarlo |
|---|---|
| `_TEMPLATE_SPEC.md` | Spec técnico del feature (hooks, servicios, rutas, tipos, tests) |
| `_TEMPLATE_UI.md` | Diseño visual de una pantalla (qué muestra, acciones, estados) |

## Cómo crear un feature nuevo

1. Crear carpeta `02-web/features/<nombre>/` (nombre en minúsculas, ej: `propiedades`)
2. Copiar `_templates/_TEMPLATE_SPEC.md` → `<nombre>/<NOMBRE>_SPEC.md`
3. Por cada pantalla del feature, copiar `_templates/_TEMPLATE_UI.md` → `<nombre>/<NOMBRE>_UI_<pantalla>.md`
4. Agregar assets adicionales (imágenes, mockups HTML) dentro de la misma carpeta

## Ejemplo: feature NOTIFICACIONES

```
02-web/features/notificaciones/
  NOTIFICACIONES_SPEC.md
  NOTIFICACIONES_UI_centro.md
  NOTIFICACIONES_UI_panel-header.md
  NOTIFICACIONES_UI_detalle.md
  NOTIFICACIONES_UI_preferencias.md
```
