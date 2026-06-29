---
type: meta
status: active
priority: P0
module: global
tags: [home, dashboard, global]
updated: 2026-06-28
---

# 🏠 Urbania — Dashboard Global

> Documentación técnica de los 3 proyectos del sistema Urbania. Empieza en [[AGENTS]] si es tu primera vez aquí.

---

## Acceso Rápido por Proyecto

| 🔧 API | 🌐 Web | 📱 App |
|---|---|---|
| [[01-api/API_AGENTS\|Entrar a API]] | [[02-web/WEB_AGENTS\|Entrar a Web]] | [[03-app/APP_AGENTS\|Entrar a App]] |

## Lo Compartido

| | |
|---|---|
| 📜 [[00-shared/SYSTEM_CONTRACT]] | El contrato entre los 3 proyectos |
| 🔀 [[00-shared/CROSS_PROJECT_CHANGES]] | Cómo se gestiona un cambio que cruza proyectos |
| 📊 [[00-shared/CHANGES_LOG]] | Estado de sincronización de cambios en curso |
| 🧩 [[00-shared/FEATURE_PLANNING_TEMPLATE]] | Plantilla para features multi-capa |
| 📖 [[00-shared/GLOSSARY]] | Vocabulario de dominio común |

---

## Estado de los 3 Proyectos

```dataview
TABLE status, priority, updated
FROM "01-api" OR "02-web" OR "03-app"
WHERE type != "meta"
SORT priority ASC, file.folder ASC
```

## Tareas Pendientes (todo el vault)

```dataview
TASK
FROM "00-shared" OR "01-api" OR "02-web" OR "03-app"
WHERE !completed
LIMIT 40
```

## Cambios Cross-Project en Curso

> Ver el detalle completo en [[00-shared/CHANGES_LOG]]. Resumen rápido: cuántas entradas hay con al menos un proyecto en estado distinto de "Sincronizado".

---

<!-- GLOBAL_STATUS — sección legible por agentes. Actualizar al cierre de cada sesión. -->
## 🎯 GLOBAL_STATUS — Estado del sistema

| Proyecto | Sesión | Estado | Siguiente tarea |
|----------|--------|--------|-----------------|
| API      | 14.2   | ✅ Completada | CAMBIO-006 Sesión 3: actor canónico + `users.unit` eliminado; invariante user-contact; 325 tests pasan (3 fallos preexistentes), PHPStan 6 errores preexistentes |
| Web      | 4      | ✅ Completada | Setup + Auth + Propiedades + Directorio — tests pasando |
| App      | 0      | ⏸ No iniciada | Pendiente de kickoff — sesión 1 por planificar |

> [!info] Este bloque se actualiza automáticamente al cerrar cada sesión de desarrollo mediante las skills `close-session`. Si ves datos desactualizados, ejecutá `@test-runner` para verificar el estado real.

