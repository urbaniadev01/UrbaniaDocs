---
type: meta
status: active
priority: P0
module: global
tags: [home, dashboard, global]
updated: 2026-06-18
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

## Si Acabas de Migrar a este Vault Unificado

Si todavía existe `_MIGRATION_GUIDE.md` en la raíz, significa que la migración de los documentos existentes de API y App (y la incorporación de Web) **no se ha completado**. Revísalo antes de asumir que las carpetas `01-api/`, `02-web/`, `03-app/` ya tienen su contenido real ubicado y renombrado correctamente.
