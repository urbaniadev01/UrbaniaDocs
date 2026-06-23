---
name: api-close-session
description: Checklist de cierre de sesión de la API — CI, actualización de docs, nota atómica y commit
---

## Ejecutar en orden. No hacer commit si algún paso falla.

### 1. CI completo
```bash
composer ci
```
Si falla: reportar el error exacto y detenerse. NO continuar.

### 2. Actualizar API_SESSION_MANIFEST.md
Archivo: `01-api/API_SESSION_MANIFEST.md`
- Marcar tareas completadas en esta sesión
- Agregar bloqueos encontrados (si los hay)
- Actualizar estado general del proyecto

### 3. Actualizar API_IMPLEMENTATION_PLAN.md
Archivo: `01-api/API_IMPLEMENTATION_PLAN.md`
- Marcar la sesión actual como cerrada con fecha
- Confirmar o ajustar la próxima sesión planificada

### 4. Verificar consistencia de documentación

Si se implementó un endpoint:
- Verificar que `01-api/API_CONTRACT.md` lo marca como "Implementado"

Si se creó o modificó una tabla:
- Verificar que `01-api/API_DATABASE.md` refleja el estado actual

Si había cambio cross-project activo:
- Actualizar estado en `00-shared/CHANGES_LOG.md`

### 5. Crear nota atómica de sesión
Crear archivo en `01-api/docs/log/sesiones/sesion-N.md` usando la plantilla `01-api/_templates/nueva-sesion.md`.

Completar todos los campos de la plantilla.

### 6. Commit
```bash
cd API && git add -A && git commit -m "[API Sesion N] Descripcion breve de lo implementado"
```

## Criterios de éxito
- `composer ci` en verde
- SESSION_MANIFEST refleja el estado real
- IMPLEMENTATION_PLAN tiene la sesión cerrada
- Nota atómica creada
- Commit realizado
