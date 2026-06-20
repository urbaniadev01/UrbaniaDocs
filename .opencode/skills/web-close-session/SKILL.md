---
name: web-close-session
description: Checklist de cierre de sesión del Web — CI, actualización de docs y commit
---

## Ejecutar en orden. No hacer commit si algún paso falla.

### 1. CI completo
```bash
pnpm ci
```
Si falla: reportar el error exacto y detenerse.

### 2. Actualizar WEB_SESSION_MANIFEST.md
Archivo: `documentacion/02-web/WEB_SESSION_MANIFEST.md`
- Marcar tareas completadas en esta sesión
- Actualizar estado general

### 3. Actualizar WEB_IMPLEMENTATION_PLAN.md
Archivo: `documentacion/02-web/WEB_IMPLEMENTATION_PLAN.md`
- Marcar la sesión actual como cerrada con fecha
- Confirmar o ajustar la próxima sesión

### 4. Verificar consistencia

Si se completó un módulo:
- Verificar que `documentacion/02-web/WEB_FEATURES_INDEX.md` lo marca como "Completado"

Si había cambio cross-project activo:
- Actualizar estado en `documentacion/00-shared/CHANGES_LOG.md`

### 5. Commit
```bash
cd WEB && git add -A && git commit -m "[WEB Sesion N] Descripcion breve"
```
