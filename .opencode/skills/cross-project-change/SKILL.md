---
name: cross-project-change
description: Flujo para registrar y coordinar un cambio que afecta más de un proyecto (API + Web + App)
---

## Criterio: ¿es este cambio cross-project?

Un cambio es cross-project si, después de aplicarlo, **otro proyecto necesitaría actualizar su código o documentación** para seguir funcionando correctamente.

| Ejemplo | ¿Cross-project? |
|---|---|
| Cambiar la forma de un campo en una respuesta de la API | Sí |
| Agregar campo opcional que nadie consume todavía | No |
| Cambiar un código de error o su significado | Sí |
| Refactor interno sin cambiar contrato externo | No |
| Cambiar color primario de marca si Web y App deben ser consistentes | Sí |

En caso de duda, tratarlo como cross-project.

## Flujo paso a paso

### 1. Abrir entrada en documentacion/00-shared/CHANGES_LOG.md
```markdown
## CAMBIO-NNN — <título corto>
- Fecha de apertura: YYYY-MM-DD
- Afecta a: API / Web / App (solo los que aplican)
- Estado API: Propuesto | En progreso | Sincronizado | No aplica
- Estado Web: Propuesto | En progreso | Sincronizado | No aplica
- Estado App: Propuesto | En progreso | Sincronizado | No aplica
- Documento de referencia: [[SYSTEM_CONTRACT#1-interfaces-compartidas]]
- Notas: descripción del cambio, decisiones tomadas
```
NNN se incrementa sin reutilizar números.

### 2. Actualizar documentacion/00-shared/SYSTEM_CONTRACT.md §1
Modificar la fila de la interfaz afectada, marcando el cambio "en revisión".

### 3. Referenciar desde cada proyecto afectado
En el SESSION_MANIFEST de cada proyecto que debe implementar su parte, agregar referencia a CAMBIO-NNN en la sección de Notas.

### 4. Actualizar estado a medida que cada proyecto implementa
En CHANGES_LOG.md: `Propuesto → En progreso → Sincronizado` por cada proyecto.

### 5. Cerrar la entrada
Cuando todos los proyectos afectados están "Sincronizado":
- Actualizar SYSTEM_CONTRACT.md §1 a estado estable
- La entrada queda en CHANGES_LOG como registro histórico (no se elimina)
