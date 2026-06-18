---
type: meta
status: active
priority: P0
module: mobile
tags: [home, dashboard, mobile]
updated: 2026-06-18
---

# 🏠 Urbania App — Dashboard

> Cliente móvil (Flutter) de Urbania API. Ver [[AGENTS]] para empezar.

---

## Estado del Proyecto

```dataview
TABLE status, priority, updated
FROM "urbania-app"
WHERE type != "meta"
SORT priority ASC, file.name ASC
```

---

## Acceso Rápido

| 🏗️ Fundación | 🎨 Diseño | 🔌 Integración | 🚀 Operación |
|---|---|---|---|
| [[ARCHITECTURE]] | [[DESIGN_SYSTEM]] | [[API_INTEGRATION]] | [[SETUP_GUIDE]] |
| [[SECURITY]] | [[ACCESSIBILITY]] | [[DATA_STRATEGY]] | [[TESTING]] |
| [[FEATURE_SCOPE]] | | | [[RELEASE_AND_OBSERVABILITY]] |

## Proceso

| | |
|---|---|
| 📋 [[IMPLEMENTATION_PLAN]] | Plan de sesiones |
| 📍 [[SESSION_MANIFEST]] | Estado actual — **leer siempre antes de retomar trabajo** |
| 🛠️ [[DEVELOPMENT_GUIDE]] | Troubleshooting y comandos diarios |
| 🤖 [[AGENTS]] | Reglas de oro |

---

## Tareas Pendientes (Dataview Tasks)

```dataview
TASK
FROM "urbania-app"
WHERE !completed
LIMIT 30
```

---

## Vault Relacionado

Este vault complementa al de **Urbania API** — ver [[../_Home|_Home]] del backend para el estado del servidor.
