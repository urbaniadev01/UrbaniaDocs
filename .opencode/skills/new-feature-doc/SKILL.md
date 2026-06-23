---
name: new-feature-doc
description: Crea la documentación completa de una feature nueva en el vault Urbania — panorama global, specs por proyecto y entradas en FEATURES_INDEX y CHANGES_LOG
---

## Cuándo usar esta skill

Al documentar una feature nueva **antes o durante** el desarrollo. El objetivo es que antes de que empiece la implementación, todos los proyectos afectados tengan un panorama común escrito.

Seguir los pasos en orden. No pasar al siguiente sin completar el anterior.

---

## Paso 1 — Verificar que la feature no existe ya

Leer `00-shared/FEATURES_INDEX.md` y buscar si ya hay una fila para esta feature.

- Si ya existe: actualizar su estado en vez de crear un documento nuevo. Salir de esta skill.
- Si no existe: continuar al Paso 2.

---

## Paso 2 — Determinar alcance

Antes de escribir nada, responder:

| Pregunta | Respuesta esperada |
|---|---|
| ¿Qué proyectos afecta? | API / Web / App (puede ser uno, dos o los tres) |
| ¿Cambia el contrato REST o el modelo de datos compartido? | Sí → es cross-project. No → puede ser local |
| ¿Depende de otra feature no implementada aún? | Si sí, anotarlo en §4 del panorama |

---

## Paso 3 — Crear el panorama global (si afecta 2+ proyectos)

Solo si la feature afecta más de un proyecto:

1. Copiar `00-shared/FEATURE_PLANNING_TEMPLATE.md` §2 (el bloque de la plantilla) a un archivo nuevo:
   ```
   00-shared/features/<NOMBRE-EN-MAYUSCULAS>.md
   ```
   Usar el mismo nombre en mayúsculas que usará el prefijo en cada proyecto (ej: `PAGOS`, `RESERVAS`).

2. Completar todos los campos de la plantilla:
   - **§1 Resumen y motivación**: qué problema resuelve, por qué ahora.
   - **§2 Capas afectadas**: marcar los proyectos involucrados.
   - **§3 Características principales**: lista de capacidades en lenguaje de dominio (no técnico).
   - **§4 Relaciones**: dependencias de otras features con wikilinks.
   - **§5 Inventario de pantallas**: listar vistas por proyecto con su tipo (Página, Modal, Drawer, Sheet, Inline). Indicar `[PENDIENTE]` si aún no están diseñadas.
   - **§6 Mapeo de acciones a endpoints**: tabla con acción de UI → endpoint → proyecto. Indicar `[PENDIENTE]` si el endpoint no existe aún.
   - **§7 Reglas de negocio derivadas del diseño**: reglas que cruzan capas.
   - **§8 Estado**: `Propuesto | Diseñado | En progreso | Completado`.

3. Frontmatter del archivo:
   ```yaml
   ---
   type: feature
   status: active
   feature: <NOMBRE>
   estado: Propuesto
   prioridad: alta | media | baja
   afecta: [api, web, app]  # solo los que apliquen
   tags: [feature, <nombre-kebab>]
   updated: <YYYY-MM-DD>
   ---
   ```

---

## Paso 4 — Crear specs técnicos por proyecto

Para cada proyecto afectado, crear el spec técnico correspondiente.

### API
Si hay endpoints nuevos: crear `01-api/endpoints/<NOMBRE>.md` usando la plantilla en `01-api/endpoints/_TEMPLATE.md` (si existe) con los campos mínimos:
- Método HTTP, URL, headers requeridos
- Request body (campos y tipos)
- Response exitoso (campos y tipos)
- Códigos de error posibles
- Reglas de negocio y precondiciones
- Estado: `Diseñado` (no `Implementado` — eso lo marca el agente de código)

Agregar la fila correspondiente en `01-api/API_CONTRACT.md` con estado `Diseñado`.

### Web
Crear `02-web/features/<nombre-kebab>/WEB_<NOMBRE>_SPEC.md` con:
- Pantallas involucradas (lista de las del §5 del panorama global)
- Estado de cada pantalla: `Diseñada | En progreso | Completada`
- Dependencias de la API (links a los endpoints)
- Estado general: `Propuesto`

### App
Crear `03-app/features/<nombre-kebab>/APP_<NOMBRE>_SPEC.md` con la misma estructura que el spec de Web.

**Si la feature es de un solo proyecto**, crear solo el spec de ese proyecto. No crear el panorama global del Paso 3.

---

## Paso 5 — Agregar fila en FEATURES_INDEX

Editar `00-shared/FEATURES_INDEX.md` y agregar una fila en la tabla principal:

```markdown
| [[features/<NOMBRE>]] | Propuesto | ⬜ API | ⬜ Web | ⬜ App | <descripción de una línea> |
```

Ajustar los proyectos afectados — los que no aplican se omiten o se marca `N/A`.

---

## Paso 6 — Abrir entrada en CHANGES_LOG (si es cross-project)

Si la feature afecta más de un proyecto, abrir una entrada en `00-shared/CHANGES_LOG.md`:

```markdown
## CAMBIO-NNN — Feature: <NOMBRE>
- Fecha de apertura: YYYY-MM-DD
- Afecta a: API / Web / App
- Estado API: Propuesto
- Estado Web: Propuesto
- Estado App: Propuesto
- Documento de referencia: [[00-shared/features/<NOMBRE>]]
- Notas: Feature nueva. Pendiente de diseño técnico detallado por proyecto.
```

NNN = número siguiente al último registrado en el archivo. No reutilizar números.

---

## Criterios de éxito

- [ ] `00-shared/FEATURES_INDEX.md` tiene la nueva fila
- [ ] Si cross-project: `00-shared/features/<NOMBRE>.md` existe y está completo
- [ ] Si cross-project: `00-shared/CHANGES_LOG.md` tiene la entrada con estado "Propuesto"
- [ ] Specs técnicos creados en cada proyecto afectado
- [ ] Todos los archivos creados tienen frontmatter correcto con `updated` de hoy
