---
type: meta
status: active
priority: P0
module: global
tags: [vault, structure, global]
updated: 2026-06-19
---

# 🗂️ OBSIDIAN_VAULT
## Estructura y Convenciones del Vault

---

## 1. Estructura

```
urbania-vault/
├── _Home.md                    ← Dashboard global (Dataview)
├── AGENTS.md                   ← Punto de entrada global
│
├── 00-shared/                  ← Contratos y procesos cross-project
│   ├── SYSTEM_CONTRACT.md
│   ├── CROSS_PROJECT_CHANGES.md
│   ├── CHANGES_LOG.md
│   ├── FEATURES_INDEX.md       ← Diccionario global de features
│   ├── FEATURE_PLANNING_TEMPLATE.md
│   ├── features/               ← Panorama por feature (un .md por feature)
│   ├── GLOSSARY.md
│   └── OBSIDIAN_VAULT.md
│
├── 01-api/                     ← Urbania API (Laravel)
│   ├── API_AGENTS.md           ← Punto de entrada API
│   ├── API_CONTRACT.md         ← Diccionario de endpoints + convenciones
│   ├── endpoints/              ← Detalle de endpoints por feature
│   │   ├── _TEMPLATE.md
│   │   ├── AUTH.md
│   │   └── HEALTH.md
│   ├── API_*.md
│   ├── _templates/             ← Plantillas Templater
│   └── docs/                   ← Notas atómicas (sesiones, ADRs, decisiones, bloqueos, deuda)
│
├── 02-web/                     ← Urbania Web (Vite + React + TypeScript)
│   ├── WEB_AGENTS.md           ← Punto de entrada Web
│   ├── features/               ← Specs técnicos por feature (un .md por feature)
│   │   └── _TEMPLATE.md
│   └── WEB_*.md
│
└── 03-app/                     ← Urbania App (Flutter)
    ├── APP_AGENTS.md           ← Punto de entrada App
    ├── features/               ← Specs técnicos por feature (un .md por feature)
    │   └── _TEMPLATE.md
    └── APP_*.md
```

**Convención de nombres:** archivos en `01-api/`, `02-web/`, `03-app/` llevan prefijo de proyecto (`API_`, `WEB_`, `APP_`). Archivos en `00-shared/` no llevan prefijo.

---

## 2. Esquema de frontmatter

**Documentos núcleo:**

```yaml
---
type: meta | architecture | reference | operational
status: active
priority: P0 | P1 | P2
module: global | api | web | mobile
scope: local | cross-project
tags: [...]
updated: YYYY-MM-DD
---
```

**Notas atómicas** (`docs/log/`, `docs/adr/`):

```yaml
---
type: session | adr | decision | issue | debt
status: ...
tags: [...]
updated: YYYY-MM-DD
---
```

---

## 3. Plantillas (`01-api/_templates/`)

| Plantilla | Destino |
|---|---|
| `nueva-sesion.md` | `docs/log/sesiones/` |
| `nuevo-adr.md` | `docs/adr/` |
| `nueva-decision.md` | `docs/log/decisiones/` |
| `nuevo-bloqueo.md` | `docs/log/bloqueos/` |
| `nueva-deuda.md` | `docs/log/deuda-tecnica/` |
| `nuevo-endpoint.md` | Se inserta dentro de `01-api/endpoints/<FEATURE>.md` + se agrega fila en `API_CONTRACT.md` |
