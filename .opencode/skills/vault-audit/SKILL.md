---
name: vault-audit
description: Audita la coherencia del vault Urbania — verifica FEATURES_INDEX, CHANGES_LOG, frontmatter de documentos críticos y consistencia entre proyectos. Produce un reporte con hallazgos y pregunta qué corregir.
---

## Cuándo usar esta skill

Cuando querés saber el estado real del vault: qué docs están desactualizados, qué features tienen información inconsistente entre proyectos, qué cambios cross-project llevan tiempo sin moverse.

Al finalizar, produce un reporte estructurado. **No modifica ningún archivo sin confirmar con el usuario.**

---

## Auditoría en 5 zonas

Ejecutar cada zona en orden. Registrar todos los hallazgos. Presentar el reporte completo al final.

---

### Zona 1 — FEATURES_INDEX

Leer `00-shared/FEATURES_INDEX.md`.

Para cada feature listada:

1. **Verificar que el archivo de panorama existe** (si la feature es cross-project):
   - Buscar `00-shared/features/<NOMBRE>.md`
   - Hallazgo si no existe: `[FALTA DOC] Feature <NOMBRE> listada en FEATURES_INDEX pero no tiene archivo de panorama`

2. **Verificar coherencia de estado**:
   - Si el estado en FEATURES_INDEX dice "Completado" pero algún proyecto tiene `estado: En progreso` en su spec → inconsistencia
   - Si el estado dice "Propuesto" pero ya hay código implementado → posible desactualización

3. **Verificar que cada proyecto afectado tiene su spec**:
   - API: buscar `01-api/endpoints/<NOMBRE>.md` o sección en `API_CONTRACT`
   - Web: buscar `02-web/features/<nombre>/WEB_<NOMBRE>_SPEC.md`
   - App: buscar `03-app/features/<nombre>/APP_<NOMBRE>_SPEC.md`
   - Hallazgo si falta: `[SPEC FALTANTE] Feature <NOMBRE> no tiene spec en <proyecto>`

---

### Zona 2 — CHANGES_LOG

Leer `00-shared/CHANGES_LOG.md`.

Para cada entrada (CAMBIO-NNN):

1. **Identificar entradas "atascadas"**:
   - Cualquier entrada con fecha de apertura mayor a 21 días y al menos un proyecto distinto de "Sincronizado" o "No aplica"
   - Hallazgo: `[ATASCADO] CAMBIO-NNN abierto desde <fecha>, pendiente en <proyectos>`

2. **Verificar referencia cruzada**:
   - Si la entrada referencia un `[[documento]]`, verificar que ese documento existe
   - Hallazgo si no existe: `[LINK ROTO] CAMBIO-NNN referencia [[doc]] que no existe`

3. **Identificar entradas sin documento de referencia**:
   - Hallazgo: `[SIN REF] CAMBIO-NNN no tiene "Documento de referencia" definido`

---

### Zona 3 — Documentos críticos (frontmatter y fecha)

Leer los siguientes documentos en cada proyecto y verificar su frontmatter:

**Documentos a revisar:**
- `00-shared/SYSTEM_CONTRACT.md`
- `01-api/API_SESSION_MANIFEST.md`
- `01-api/API_IMPLEMENTATION_PLAN.md`
- `02-web/WEB_SESSION_MANIFEST.md` (si existe)
- `02-web/WEB_IMPLEMENTATION_PLAN.md` (si existe)
- `03-app/APP_SESSION_MANIFEST.md` (si existe)
- `03-app/APP_IMPLEMENTATION_PLAN.md` (si existe)

Para cada uno verificar:
1. **Tiene frontmatter** con campos `type`, `status`, `updated`
2. **`updated` no es anterior a 30 días** desde hoy:
   - Hallazgo: `[DESACTUALIZADO] <archivo> — última actualización: <fecha>`
3. **`status` es coherente** con el contenido visible:
   - Si `status: active` pero el plan no tiene tareas pendientes → posible cierre sin actualizar

---

### Zona 4 — SESSION_MANIFEST vs IMPLEMENTATION_PLAN

Para cada proyecto (API, Web, App):

1. Leer el SESSION_MANIFEST y el IMPLEMENTATION_PLAN del proyecto.
2. Verificar que la sesión marcada como activa en el MANIFEST existe en el PLAN.
3. Verificar que las tareas marcadas como "completadas" en el MANIFEST están también cerradas en el PLAN.
4. Verificar que los bloqueos abiertos en el MANIFEST tienen una tarea correspondiente en el PLAN.

Hallazgos posibles:
- `[DESFASE] SESSION_MANIFEST dice sesión N está activa pero IMPLEMENTATION_PLAN la tiene cerrada`
- `[BLOQUEO HUÉRFANO] Bloqueo en MANIFEST no tiene tarea en PLAN`

---

### Zona 5 — ADRs referenciados pero sin archivo

Para cada proyecto:

1. Leer el documento de arquitectura principal (`API_ARCHITECTURE.md`, o equivalente).
2. Buscar referencias a `ADR-NNN` en el texto.
3. Verificar que cada ADR referenciado tiene su archivo en `docs/adr/ADR-NNN.md`.
4. Hallazgo: `[ADR FALTANTE] API_ARCHITECTURE referencia ADR-003 pero el archivo no existe`

---

## Formato del reporte

Al completar las 5 zonas, presentar:

```
VAULT AUDIT — <YYYY-MM-DD>
============================

ZONA 1 — FEATURES_INDEX
  ✅ Sin hallazgos   |   ⚠️ <N> hallazgos:
  - [tipo] descripción
  ...

ZONA 2 — CHANGES_LOG
  ✅ Sin hallazgos   |   ⚠️ <N> hallazgos:
  - [tipo] descripción
  ...

ZONA 3 — DOCUMENTOS CRÍTICOS
  ✅ Sin hallazgos   |   ⚠️ <N> hallazgos:
  - [tipo] descripción
  ...

ZONA 4 — MANIFEST vs PLAN
  ✅ Sin hallazgos   |   ⚠️ <N> hallazgos:
  - [tipo] descripción
  ...

ZONA 5 — ADRs
  ✅ Sin hallazgos   |   ⚠️ <N> hallazgos:
  - [tipo] descripción
  ...

RESUMEN
  Total hallazgos: <N>
  Críticos (links rotos, specs faltantes de features en progreso): <N>
  Atención (desactualizados, atascados): <N>
  Menores (sin referencia, desfases menores): <N>
```

---

## Después del reporte

Preguntar al usuario:

> ¿Qué hallazgos querés corregir ahora? Puedo resolverlos en orden de criticidad o los que vos indiques.

No corregir nada sin confirmación explícita. Cada corrección se hace en un paso separado con commit propio.
