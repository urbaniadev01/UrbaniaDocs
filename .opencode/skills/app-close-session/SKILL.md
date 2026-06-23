---
name: app-close-session
description: Checklist de cierre de sesión de la App — analyze, tests, actualización de docs y commit
---

## Ejecutar en orden. No hacer commit si algún paso falla.

### 1. Verificación de calidad
```bash
flutter analyze
flutter test
```
Si falla: reportar el error exacto y detenerse.

### 2. Actualizar APP_SESSION_MANIFEST.md
Archivo: `03-app/APP_SESSION_MANIFEST.md`
- Marcar tareas completadas
- Agregar bloqueos si los hay
- Actualizar estado general

### 3. Actualizar APP_IMPLEMENTATION_PLAN.md
Archivo: `03-app/APP_IMPLEMENTATION_PLAN.md`
- Marcar la sesión como cerrada con fecha
- Confirmar próxima sesión

### 4. Verificar consistencia

Verificar que `01-api/API_CONTRACT.md` tiene implementados los endpoints consumidos en esta sesión.

Si había cambio cross-project activo:
- Actualizar estado en `00-shared/CHANGES_LOG.md`

### 5. Commit
```bash
cd APP && git add -A && git commit -m "[APP Sesion N] Descripcion breve"
```
