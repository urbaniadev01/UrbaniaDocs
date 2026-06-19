---
type: meta
status: active
priority: P0
module: global
tags: [obsidian, vault, onboarding, global]
updated: 2026-06-18
---

# 🗂️ OBSIDIAN_VAULT
## Cómo usar este vault unificado

> [!info] Alcance
> Este documento es para quien abre la carpeta `urbania-vault/` en Obsidian. No es lectura obligatoria del agente de desarrollo — [[AGENTS]] cubre eso. Audiencia: vos, o cualquier humano que retome el proyecto.

---

## 1. Estructura del vault

```
urbania-vault/
├── _Home.md                    ← Dashboard global (punto de entrada en Obsidian)
├── AGENTS.md                   ← Mapa de navegación global para agentes
├── _MIGRATION_GUIDE.md         ← Eliminar una vez completada la migración
│
├── 00-shared/                  ← Contratos y procesos que cruzan proyectos
│   ├── SYSTEM_CONTRACT.md
│   ├── CROSS_PROJECT_CHANGES.md
│   ├── CHANGES_LOG.md
│   ├── FEATURE_PLANNING_TEMPLATE.md
│   ├── GLOSSARY.md
│   └── OBSIDIAN_VAULT.md       ← Este archivo
│
├── 01-api/                     ← Urbania API (Laravel)
│   ├── API_AGENTS.md           ← Punto de entrada del proyecto API
│   ├── API_ARCHITECTURE.md
│   ├── API_CONTRACT.md
│   ├── API_DATABASE.md
│   ├── API_JWT_IMPLEMENTATION.md
│   ├── API_SETUP_GUIDE.md
│   ├── API_TESTING.md
│   ├── API_IMPLEMENTATION_PLAN.md
│   ├── API_SESSION_MANIFEST.md
│   ├── API_DEVELOPMENT_GUIDE.md
│   ├── opencode.json
│   ├── _templates/             ← Plantillas Templater (para todo el vault)
│   └── docs/                   ← Notas atómicas (sesiones, ADRs, decisiones, bloqueos, deuda)
│
├── 02-web/                     ← Urbania Web (Vite + React + TypeScript)
│   ├── WEB_AGENTS.md           ← Punto de entrada del proyecto Web
│   ├── WEB_INDEX.md            ← MOC visual para navegación humana
│   └── WEB_*.md                ← Resto de documentos con prefijo WEB_
│
└── 03-app/                     ← Urbania App (Flutter)
    ├── APP_AGENTS.md           ← Punto de entrada del proyecto App
    └── APP_*.md                ← Resto de documentos con prefijo APP_
```

> [!tip] Convención de nombres
> Todo archivo dentro de `01-api/`, `02-web/` o `03-app/` lleva el prefijo de su proyecto (`API_`, `WEB_`, `APP_`). Los archivos de `00-shared/` no llevan prefijo — su nombre ya es único en ese namespace.

---

## 2. Plugins instalados

| Plugin | Para qué se usa |
|---|---|
| **Dataview** | Tablas dinámicas en `_Home.md` (estado de documentos, tareas pendientes) |
| **Templater** | Motor de las plantillas en `01-api/_templates/` |
| **QuickAdd** | Comandos de un clic para crear sesión / ADR / decisión / bloqueo / deuda técnica |
| **Tasks** | Consulta de checklists pendientes desde `_Home.md` |
| **Kanban** | Tablero opcional sobre el mapa de sesiones de cada `*_IMPLEMENTATION_PLAN.md` |
| **Excalidraw** | Diagramas que no calzan en Mermaid (Mermaid funciona nativo para el resto) |
| **Git** | Commits y sync sin salir de Obsidian |

Para instalarlos: **Configuración → Plugins de la comunidad → Activar → buscar por nombre**.
Los archivos de plugin ya están en `.obsidian/plugins/` — Obsidian solo necesita activarlos.

---

## 3. Esquema de frontmatter

**Documentos núcleo** (los `*_AGENTS.md`, `*_ARCHITECTURE.md`, etc.):

```yaml
---
type: meta | architecture | reference | operational
status: active
priority: P0 | P1 | P2
module: global | api | web | mobile   # según proyecto
scope: local | cross-project           # cross-project si afecta más de un proyecto
tags: [...]
updated: YYYY-MM-DD
---
```

**Notas atómicas** (`docs/log/`, `docs/adr/`):

```yaml
---
type: session | adr | decision | issue | debt
status: ...      # ver cada plantilla
tags: [...]
updated: YYYY-MM-DD
---
```

---

## 4. Plantillas disponibles (`01-api/_templates/`)

| Plantilla | Cómo usarla |
|---|---|
| `nueva-sesion.md` | QuickAdd → "Nueva sesión" → crea nota en `docs/log/sesiones/` |
| `nuevo-adr.md` | QuickAdd → "Nuevo ADR" → crea nota en `docs/adr/` |
| `nueva-decision.md` | QuickAdd → "Nueva decisión" → crea nota en `docs/log/decisiones/` |
| `nuevo-bloqueo.md` | QuickAdd → "Nuevo bloqueo" → crea nota en `docs/log/bloqueos/` |
| `nueva-deuda.md` | QuickAdd → "Nueva deuda" → crea nota en `docs/log/deuda-tecnica/` |
| `nuevo-endpoint.md` | Templater "Insert Template" **dentro** de `API_CONTRACT.md` (no crea nota nueva) |

---

## 5. Flujo de trabajo

1. Abrir `_Home.md` al empezar — muestra el estado de los 3 proyectos de un vistazo.
2. Navegar al proyecto correspondiente via `[[01-api/API_AGENTS]]`, `[[02-web/WEB_AGENTS]]` o `[[03-app/APP_AGENTS]]`.
3. Al cerrar una sesión de trabajo: QuickAdd → "Nueva sesión" + una nota por cada bloqueo o deuda técnica nueva.
4. `_Home.md` refleja el estado real automáticamente sin edición manual.

---

## 6. `.obsidian/` y control de versiones

La carpeta `.obsidian/` está en la raíz del vault. Se recomienda **no versionar** `.obsidian/workspace.json` (estado personal de paneles) pero sí versionar:
- `.obsidian/community-plugins.json` — para que todos tengan los mismos plugins habilitados
- `.obsidian/plugins/*/manifest.json` — para registrar las versiones instaladas
