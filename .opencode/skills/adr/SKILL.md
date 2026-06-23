---
name: adr
description: Crea un Architecture Decision Record (ADR) en el proyecto correcto del vault Urbania. Detecta si es local (un proyecto) o cross-project y determina el número siguiente automáticamente.
---

## Cuándo usar esta skill

Al documentar una decisión de arquitectura ya tomada e implementada (o a punto de implementarse). Los ADRs son retroactivos por diseño — documentan decisiones reales, no hipótesis.

---

## Paso 1 — Determinar el alcance del ADR

| Pregunta | Respuesta → acción |
|---|---|
| ¿La decisión afecta solo la API (Laravel)? | ADR local en `01-api/docs/adr/` |
| ¿La decisión afecta solo la Web (React)? | ADR local en `02-web/docs/adr/` |
| ¿La decisión afecta solo la App (Flutter)? | ADR local en `03-app/docs/adr/` |
| ¿La decisión afecta el contrato entre proyectos, o dos o más proyectos? | ADR cross-project en `00-shared/docs/adr/` |

En caso de duda sobre si es cross-project: si cambia algo que otro proyecto consume o depende, es cross-project.

---

## Paso 2 — Determinar el número siguiente

Listar los ADRs existentes en la carpeta destino:

```
find 0X-proyecto/docs/adr -name "ADR-*.md" | sort
```

El número siguiente es el mayor encontrado + 1, formateado con 3 dígitos (ej: `006`).

Si la carpeta no existe o está vacía: empezar desde `001`.

Si la carpeta `docs/adr/` no existe en el proyecto destino, crearla.

---

## Paso 3 — Crear el archivo ADR

Crear `0X-proyecto/docs/adr/ADR-<NNN>.md` con este formato:

```markdown
---
type: adr
adr_number: <NNN>
title: "<Título corto de la decisión>"
status: accepted
priority: alta
tags: [adr]
updated: <YYYY-MM-DD>
---

# ADR-<NNN>: <Título corto de la decisión>

> Decisión tomada en <YYYY-MM-DD>. Estado: Accepted.

## Contexto

<Describir el problema o situación que motivó la decisión. Qué restricciones existían, qué presiones técnicas o de negocio llevaron a tener que decidir algo. 2-5 párrafos.>

## Decisión

<Describir la decisión tomada de forma clara y directa. Qué se eligió hacer y qué implica concretamente en el código o arquitectura.>

## Alternativas consideradas

| Alternativa | Por qué se descartó |
|---|---|
| <Opción A> | <Razón> |
| <Opción B> | <Razón> |

## Consecuencias

**Positivas:**
- <Consecuencia favorable 1>
- <Consecuencia favorable 2>

**Negativas / trade-offs:**
- <Trade-off 1>
- <Trade-off 2>

**Neutrales / notas:**
- <Nota relevante para quien mantenga esto en el futuro>

## Documentos afectados
- [[<Documento que referencia o implementa esta decisión>]]
```

---

## Paso 4 — Linkear desde documentos relevantes

Según el tipo de ADR, agregar una referencia al nuevo ADR en:

| Tipo de ADR | Dónde agregar link |
|---|---|
| API (arquitectura interna) | `01-api/API_ARCHITECTURE.md` en la sección §ADRs o §Decisiones |
| API (base de datos) | `01-api/API_DATABASE.md` en la sección de decisiones |
| API (autenticación/seguridad) | `01-api/API_JWT_IMPLEMENTATION.md` si aplica |
| Web | `02-web/WEB_AGENTS.md` o el doc de arquitectura correspondiente |
| App | `03-app/APP_AGENTS.md` o el doc de arquitectura correspondiente |
| Cross-project | `00-shared/SYSTEM_CONTRACT.md` §Decisiones de arquitectura |

Formato del link a agregar:
```markdown
- [[docs/adr/ADR-<NNN>]] — <Título corto>
```

---

## Paso 5 — Si es cross-project: abrir entrada en CHANGES_LOG

Si el ADR documenta una decisión que afecta el contrato entre proyectos:

1. Abrir entrada en `00-shared/CHANGES_LOG.md` si no existe una ya abierta para este cambio.
2. Referenciar el ADR desde la entrada: `Documento de referencia: [[00-shared/docs/adr/ADR-NNN]]`.

---

## Criterios de éxito

- [ ] Archivo `ADR-<NNN>.md` creado en la carpeta correcta
- [ ] Todos los campos del frontmatter completos
- [ ] Link al ADR agregado en el documento de arquitectura del proyecto
- [ ] Si cross-project: entrada en CHANGES_LOG con referencia al ADR
- [ ] `updated` con fecha de hoy
