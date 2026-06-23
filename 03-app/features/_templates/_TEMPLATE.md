---
type: template
status: active
module: mobile
tags: [app, template, features]
updated: 2026-06-22
---

# Guía de la carpeta `03-app/features/`

## Estructura

```
03-app/features/
  _templates/              ← Plantillas base (no modificar)
  auth/                    ← Un folder por feature (nombre en minúsculas)
    AUTH_SPEC.md
    AUTH_UI_login.md
    AUTH_UI_<pantalla>.md
  propiedades/
    PROPIEDADES_SPEC.md
    PROPIEDADES_UI_lista.md
    PROPIEDADES_UI_<pantalla>.md
  ...
```

## Plantillas disponibles

| Archivo | Cuándo usarlo |
|---|---|
| `_TEMPLATE_SPEC.md` | Spec técnico del feature (providers, repositorios, offline, tests) |
| `_TEMPLATE_UI.md` | Diseño visual de una pantalla (qué muestra, gestos, estados, accesibilidad) |

## Cómo crear un feature nuevo

1. Crear carpeta `03-app/features/<nombre>/` (nombre en minúsculas, ej: `propiedades`)
2. Copiar `_templates/_TEMPLATE_SPEC.md` → `<nombre>/<NOMBRE>_SPEC.md`
3. Por cada pantalla del feature, copiar `_templates/_TEMPLATE_UI.md` → `<nombre>/<NOMBRE>_UI_<pantalla>.md`
4. Agregar assets adicionales (imágenes, wireframes) dentro de la misma carpeta

## Ejemplo: feature NOTIFICACIONES

```
03-app/features/notificaciones/
  NOTIFICACIONES_SPEC.md
  NOTIFICACIONES_UI_centro.md
  NOTIFICACIONES_UI_detalle.md
  NOTIFICACIONES_UI_preferencias.md
```
