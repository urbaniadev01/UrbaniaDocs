---
type: meta
status: active
priority: P0
module: global
tags: [agents, navigation, global]
updated: 2026-06-28
---

# 🤖 AGENTS — Vault Global Urbania

> [!danger] Leer primero
> Este es el punto de entrada de **todo** el vault (API + Web + App). Antes de tocar cualquier documento o código, leer este archivo completo.
>
> 💡 **¿Usas OpenCode?** El agente `urbania` (router) es el punto de entrada en la TUI — describí tu tarea en lenguaje natural y él te redirige al orquestador correcto.

---

## 1. Qué es este vault

Un solo vault de Obsidian que contiene la documentación técnica de los 3 proyectos del sistema Urbania, organizados en carpetas independientes que comparten un contrato:

```
00-shared/   ← el contrato y los procesos que cruzan proyectos (leer si tu cambio no es 100% local)
01-api/      ← Documentación del API (solo docs, NO código)
02-web/      ← Documentación del Web (solo docs, NO código)
03-app/      ← Documentación del App (solo docs, NO código)
```

### 1.1 Rutas raíz de los proyectos (código fuente)

> [!danger] IMPORTANTE — Separación docs vs código
> Las carpetas `01-api/`, `02-web/`, `03-app/` contienen **SOLO documentación** (markdown, specs, planes).
> El **código fuente** de cada proyecto vive en carpetas separadas en la raíz del vault:

| Proyecto | Carpeta de documentación | Carpeta de código fuente (raíz del proyecto) |
|----------|--------------------------|---------------------------------------------|
| Urbania API (Laravel) | `01-api/` | `API/` |
| Urbania Web (Vite + React) | `02-web/` | `WEB/` |
| Urbania App (Flutter) | `03-app/` | `APP/` |

**Reglas:**
- **NUNCA crear código fuente dentro de `01-api/`, `02-web/` o `03-app/`** — esas carpetas son exclusivas para documentación.
- **Todo comando de build/test/dev se ejecuta desde la raíz del proyecto** (`API/`, `WEB/`, `APP/`), no desde la carpeta de documentación.
- **Los documentos de referencia** (specs, planes, manifests) viven en `01-api/`, `02-web/`, `03-app/` y referencian el código en `API/`, `WEB/`, `APP/` mediante rutas relativas.

### 1.2 Repositorios Git — 4 repos independientes

> [!danger] NO confundir el monorepo de documentation con los repos de código
> El sistema Urbania se compone de **4 repositorios Git separados**:

| Repositorio | Carpeta local | Contenido |
|---|---|---|
| **Documentation** (este repo) | `D:\Programacion\URBANIA\` | Vault de Obsidian: `00-shared/`, `01-api/`, `02-web/`, `03-app/` |
| **API** (Laravel) | `API/` | Código fuente del backend |
| **Web** (Vite + React) | `WEB/` | Código fuente del frontend web |
| **App** (Flutter) | `APP/` | Código fuente de la app móvil |

**Reglas:**
- Las carpetas `API/`, `WEB/`, `APP/` dentro del vault son **clones de trabajo** de sus respectivos repos. Están aquí por comodidad del agente para leer código fuente durante sesiones de documentación, pero **NO pertenecen al repo de documentation**.
- El `.gitignore` raíz del repo de documentation excluye estas carpetas (`/API/`, `/Web/`, `/App/`) — ningún commit de documentation debe contener archivos de código fuente.
- **Para commitear código fuente** (tests, features, configs, etc.), hacerlo **dentro del repo correspondiente** (`cd API`, `cd WEB`, `cd APP`), nunca desde la raíz del vault.
- Si una carpeta de código fuente no tiene `.git/`, inicializarla con `git init` y configurar su remote antes de commitear.

---

## 1.3 Flujo de trabajo: Documentación → Agentes → Código

> [!important] Filosofía del vault
> Todo el trabajo se define y orquesta **desde el vault de documentación**. Los proyectos de código (`API/`, `WEB/`, `APP/`) se mantienen exclusivamente a través de agentes automatizados, sin intervención humana directa en el código.

```
                    ┌─────────────────────────────────┐
                    │   VAULT (raíz)                   │
                    │                                  │
                    │   AGENTS.md — punto de entrada    │
                    │   FEATURES_INDEX.md — qué hacer   │
                    │   */*.md — specs, planes, ADRs   │
                    │                                  │
                    │   MCPs desde la raíz:             │
                    │   • urbania-db → BD PostgreSQL    │
                    │   • codebase-memory → grafo código│
                    └──────────┬───────────────────────┘
                               │ invoca
                    ┌──────────▼───────────────────────┐
                    │   AGENTE ESPECIALIZADO            │
                    │   @api-build / @web-build /       │
                    │   @app-build                      │
                    │   Lee docs, escribe código,       │
                    │   ejecuta tests, hace commit      │
                    └──────────┬───────────────────────┘
                               │ escribe en
                    ┌──────────▼───────────────────────┐
                    │   PROYECTO DE CÓDIGO             │
                    │   API/ (Laravel)                 │
                    │   WEB/ (React)                    │
                    │   APP/ (Flutter)                  │
                    └──────────────────────────────────┘
```

### Reglas del flujo

| # | Regla | Explicación |
|---|-------|-------------|
| 1 | **Nunca tocar código directamente** | Todo cambio en `API/`, `WEB/`, `APP/` se hace invocando al agente especializado correspondiente (`@api-build`, `@web-build`, `@app-build`) desde la TUI |
| 2 | **Documentación primero** | Si código y docs discrepan, se corrige la docs primero, luego se actualiza el código vía agente |
| 3 | **Los 2 MCPs viven en la raíz** | El `opencode.json` raíz concentra `urbania-db` y `codebase-memory`. También están replicados en los subproyectos por si un agente necesita ejecutarse desde allí |
| 4 | **Subproyecto = contexto específico** | Cada `01-api/`, `02-web/`, `03-app/` tiene su propio `opencode.json` con el mismo set de MCPs, pero apuntando a su proyecto (`CODEBASE_MEMORY_PROJECT` específico) y con rutas relativas ajustadas |
| 5 | **Grafo de código se indexa una vez** | `codebase-memory-mcp` indexó los 3 proyectos. Las DBs están en caché local. Si el código cambia, se actualiza automáticamente con `auto_index: true` |

### ¿Qué MCP usar para qué?

| Necesitas... | Usa este MCP | Disponible desde |
|---|---|---|
| Consultar la BD PostgreSQL | `urbania-db` | Raíz y subproyectos |
| Buscar funciones, clases, rutas en el código | `codebase-memory` | Raíz y subproyectos |
| Documentación de librerías externas | `context7` (skill) | Raíz |

---

## 2. Primera pregunta que debes responder


¿Tu tarea/cambio toca un solo proyecto y nada de lo listado en
00-shared/SYSTEM_CONTRACT.md (contrato REST, tiempo real, glosario,
identidad visual compartida)?

  → Sí, es 100% local: ve directo a
     [[01-api/API_AGENTS]] / [[02-web/WEB_AGENTS]] / [[03-app/APP_AGENTS]]

  → No, o no estás seguro: empieza en
     [[00-shared/CROSS_PROJECT_CHANGES]] §1 (criterio para confirmar)


---

## 3. Mapa de Documentos Compartidos

| Documento | Cuándo consultarlo |
|---|---|
| [[00-shared/SYSTEM_CONTRACT]] | Fuente de verdad de todo lo que cruza capas (contratos, glosario, versionado) |
| [[00-shared/CROSS_PROJECT_CHANGES]] | Antes de iniciar un cambio que podría afectar más de un proyecto |
| [[00-shared/CHANGES_LOG]] | Para ver el estado de sincronización de cambios cross-project en curso |
| [[00-shared/FEATURES_INDEX]] | Diccionario global de features — estado en cada proyecto y enlaces a specs |
| [[00-shared/FEATURE_PLANNING_TEMPLATE]] | Al planear una feature nueva que nace afectando varias capas desde el diseño |
| [[00-shared/GLOSSARY]] | Para confirmar el término correcto de un concepto de dominio antes de nombrarlo distinto en código/docs |

---

## 3.1 Índice de Features

> [!info]
> El diccionario global de features vive en [[00-shared/FEATURES_INDEX]]. Cada feature que afecta más de un proyecto tiene su archivo de panorama en `00-shared/features/<NOMBRE>.md` usando [[00-shared/FEATURE_PLANNING_TEMPLATE]].

> Ver [[00-shared/FEATURES_INDEX]] para la lista completa de features, su estado en cada proyecto y enlaces a specs técnicos.

---

## 4. Reglas de Oro del Vault Global

1. **Independencia primero, conexión cuando se necesita.** Nadie que trabaje solo en un proyecto debe verse obligado a leer los otros dos para hacer su tarea — `00-shared/` solo se consulta cuando el criterio de §2 lo indica.
2. **`00-shared/` nunca es la fuente de verdad de un dato técnico**, solo el índice. Si `SYSTEM_CONTRACT.md` y el documento real del proyecto dicen cosas distintas, gana el documento del proyecto y se corrige el índice.
3. **Todo archivo dentro de `01-api/`, `02-web/` o `03-app/` lleva el prefijo de su proyecto** (`API_`, `WEB_`, `APP_`) — obligatorio para evitar ambigüedad de wikilinks entre proyectos con documentos del mismo tema.
4. **Un cambio cross-project no se considera terminado hasta que está en `CHANGES_LOG.md` como "Sincronizado" en los 3 proyectos afectados.** Si una entrada lleva más de 3 días sin actualizarse, escalarla antes de continuar cualquier otra tarea.
5. **Si encuentras una inconsistencia** entre este vault y el código real de cualquier proyecto, se reporta e informa de inmediato — mismo principio que ya rige en cada proyecto individualmente.
6. **Siempre solución permanente, nunca deuda técnica.** Cuando exista un dilema entre una solución temporal (parche, workaround, config que funcione solo en dev) y una solución permanente que resuelva el problema para todos los entornos (desarrollo, staging, producción), se elige la solución permanente. Queda prohibido dejar deuda técnica a sabiendas — si una solución no puede ser permanente por una razón estrictamente técnica, se documenta el motivo en un ADR y se agenda su resolución. Esta regla aplica a agentes y humanos por igual.
7. **No se implementa código sin diseño aprobado.** Ningún agente puede escribir código (migraciones, endpoints, componentes, pantallas, tests) de un feature, función o cambio que no tenga primero su diseño documentado y aprobado en el vault. El diseño mínimo requerido es:
   - Panorama global en `00-shared/features/<NOMBRE>.md` con §1 a §8 completos, o ADR si es un cambio de arquitectura.
   - Checklist §15 "Checklist de coherencia" del panorama completamente marcado como resuelto o con ítems explícitamente diferidos.
   - Si el diseño no existe, el agente debe detenerse, informar al orquestador y esperar instrucciones. No puede suplir la ausencia de diseño implementando sobre la marcha.
8. **Los checklists se actualizan AL implementar, no después.** Cuando un agente especializado (`@api-build`, `@web-build`, `@app-build`) termina de implementar código, DEBE:
   - Volver al documento de panorama (`00-shared/features/<NOMBRE>.md`) y marcar los ítems de §15 y §16 que correspondan.
   - Si implementó endpoints: marcar el ítem del §15 "Mapeo de acciones a endpoints coherente con API_CONTRACT".
   - Si creó archivos (specs, endpoints, componentes): marcar los ítems del §16 correspondientes.
   - Actualizar §13 "Especificaciones técnicas por proyecto" con el estado real.
   - Si el feature está en una etapa intermedia (API listo, Web pendiente), debe reflejarlo en los checklists — no dejarlo todo sin marcar hasta el final.
   - El orquestador valida esta actualización al recibir el RESULTADO DE SESIÓN antes de cerrar la sesión.

---

## 5. Protocolo de Delegación (Contrato del Router)

Cuando el agente `urbania` delega a un agente de proyecto, ese agente devuelve al finalizar:

```
RESULTADO DE SESIÓN
  proyecto     : [API | WEB | APP]
  tarea        : <descripción en una línea>
  estado       : [✅ Completado | ⚠️ Con observaciones | 🔴 Bloqueado | ⏸️ Interrumpido]
  checklist    : [✅ Pasado | ❌ Falló en: <ítem>]
  cross-project: [Ninguno | Entrada activa en CHANGES_LOG: <id>]
  siguiente    : <próxima tarea o "N/A — módulo cerrado">
```

El router usa este resultado para:
- Determinar si hay una entrada en `CHANGES_LOG` que necesita propagarse a otro proyecto.
- Decidir si la sesión puede cerrarse o si debe escalar un bloqueo.
- Actualizar `00-shared/FEATURES_INDEX` si el estado de una feature cambió.

> [!warning] El router NO cierra una sesión cross-project si algún proyecto reporta estado distinto de "✅ Completado".

### Pasos de sincronización de memoria (toda sesión)

**Al iniciar** (antes de cualquier otra acción):
```
git pull   # en el repo de código activo → obtiene snapshot del grafo actualizado
```

**Al cerrar** (después del Checklist Final del proyecto):
```
# Si el grafo de código cambió (codebase-memory-mcp actualiza .codebase-memory/):
git add .codebase-memory/ && git commit -m "chore: update graph snapshot"
```

> [!note] Herramientas de memoria
> - **codebase-memory-mcp** → grafo estructural del código fuente (call graphs, rutas, clases). Vive en `.codebase-memory/` dentro de cada repo de código.
> - **context7** → documentación de librerías externas. Ya configurado.

