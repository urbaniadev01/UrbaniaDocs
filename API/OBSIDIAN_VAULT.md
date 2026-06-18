---
type: meta
status: active
tags: [obsidian, vault, onboarding]
updated: 2026-06-17
---

# 🗂️ OBSIDIAN_VAULT
## Cómo usar este vault (no es documentación del backend — es documentación del vault)

> [!info] Alcance
> Este documento es para quien abre la carpeta del proyecto en Obsidian. No es parte de la lectura obligatoria del agente de desarrollo ([[AGENTS]] cubre eso). Audiencia: vos, o cualquier humano que retome el proyecto.

---

## 1. Qué cambió respecto a la documentación original

- Los 10 documentos núcleo (AGENTS, ARCHITECTURE, DATABASE, API_CONTRACT, JWT_IMPLEMENTATION, SETUP_GUIDE, TESTING, IMPLEMENTATION_PLAN, SESSION_MANIFEST, DEVELOPMENT_GUIDE) **no cambiaron de ubicación ni de contenido técnico**. Se les agregó:
  - Frontmatter (propiedades YAML) para que Dataview pueda consultarlos.
  - Callouts de Obsidian (`> [!note]`, `> [!warning]`, `> [!danger]`, etc.) en vez de blockquotes planos con texto en negrita.
  - Se corrigieron 6 enlaces rotos (mezcla de wikilink + markdown link) y una referencia inconsistente a `AGENTS_GUIDE.md` (el archivo siempre se llamó `AGENTS.md`).
- Se agregó infraestructura nueva: `_Home.md`, `_templates/`, `docs/adr/`, `docs/log/`.

## 2. Plugins de la comunidad a instalar

Configuración → Plugins de la comunidad → Activar → buscar e instalar:

| Plugin                 | Para qué se usa aquí                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dataview**           | Las tablas de [[_Home]] y las que reemplazan a las tablas manuales de [[SESSION_MANIFEST]]                                                                           |
| **Templater**          | Motor de las plantillas en `_templates/`                                                                                                                             |
| **QuickAdd**           | Comandos de un clic para crear sesión/ADR/decisión/bloqueo/deuda desde cualquier nota. Configurar un "Capture" por plantilla, apuntando a la carpeta correspondiente |
| **Tasks**              | Consulta `tasks` de [[_Home]] — checklists de [[AGENTS]], [[IMPLEMENTATION_PLAN]] y [[SETUP_GUIDE]] quedan visibles en un solo lugar                                 |
| **Kanban**             | Tablero opcional sobre el "Mapa de Sesiones" de [[IMPLEMENTATION_PLAN]] (Pendiente/En progreso/Bloqueado/Completado)                                                 |
| **Excalidraw**         | Opcional, para diagramas que no calzan bien en Mermaid (Mermaid ya funciona nativo para los diagramas existentes)                                                    |
| **Git** (obsidian-git) | Commits/sync sin salir de Obsidian — coherente con las convenciones de commit de [[DEVELOPMENT_GUIDE]] §4                                                            |

## 3. Estructura del vault

```
/
├── _Home.md                 ← punto de entrada, dashboard Dataview
├── OBSIDIAN_VAULT.md        ← este archivo
├── AGENTS.md ... (10 docs núcleo, sin mover)
├── opencode.json
├── _templates/
│   ├── nueva-sesion.md      ← nota nueva (QuickAdd "Capture")
│   ├── nuevo-adr.md         ← nota nueva
│   ├── nueva-decision.md    ← nota nueva
│   ├── nuevo-bloqueo.md     ← nota nueva
│   ├── nueva-deuda.md       ← nota nueva
│   └── nuevo-endpoint.md    ← NO crea nota nueva: usar "Insert Template" de Templater
│                              con el cursor dentro de API_CONTRACT.md
└── docs/
    ├── adr/                 ← una nota por ADR
    └── log/
        ├── sesiones/        ← una nota por sesión completada
        ├── decisiones/      ← una nota por decisión técnica ad-hoc
        ├── bloqueos/        ← una nota por bloqueo/issue
        └── deuda-tecnica/   ← una nota por ítem de deuda técnica
```

> [!warning] Por qué `nuevo-endpoint.md` es distinto
> Los endpoints siguen viviendo únicamente en [[API_CONTRACT]] (regla #12 de [[AGENTS]]: una sola fuente por pieza de información). La plantilla de endpoint no crea una nota nueva — se inserta con Templater ("Insert Template") en el punto del archivo donde va el endpoint.

## 4. Esquema de frontmatter

Documentos núcleo:
```yaml
---
type: meta | architecture | reference | operational
status: active
priority: P0 | P1 | P2     # cuando aplica
module: auth                # cuando aplica
tags: [...]
updated: YYYY-MM-DD
---
```

Notas atómicas (`docs/log/`, `docs/adr/`):
```yaml
---
type: session | adr | decision | issue | debt
status: ...                 # depende del tipo, ver cada plantilla
tags: [...]
updated: YYYY-MM-DD
---
```

## 5. Por qué las tablas de SESSION_MANIFEST ahora son consultas Dataview

Antes, "Deuda Técnica", "Bloqueos" e "Historial de Sesiones" eran tablas que había que actualizar a mano en cada cierre de sesión — con el riesgo que el propio documento ya advertía ("nunca debe quedar desactualizado"). Ahora cada ítem es una nota individual con una propiedad `status`, y la tabla se genera sola con Dataview. El dato vive en un solo lugar (la nota), se ve en muchos lugares (Home, SESSION_MANIFEST, DEVELOPMENT_GUIDE) sin duplicarse — esto refuerza, no rompe, la regla #12 de [[AGENTS]].

## 6. `.obsidian/` y git

Este vault es la raíz del repo del proyecto. `.obsidian/` se va a crear ahí. Recomendado: agregar `.obsidian/` al `.gitignore` del repo (configuración personal de plugins/workspace no debería viajar en el control de versiones del código). Si en algún momento trabajás en equipo y querés que todos tengan los mismos plugins, se puede versionar `.obsidian/community-plugins.json` puntualmente — evaluarlo si llega ese caso.

## 7. Flujo de trabajo resumido

1. Abrís [[_Home]] al empezar.
2. Trabajás según [[IMPLEMENTATION_PLAN]] / [[SESSION_MANIFEST]] como siempre.
3. Al cerrar una sesión: QuickAdd → "Nueva sesión" (o completar la que ya esté en curso), y una nota por cada bloqueo/deuda nuevos.
4. Si tocás un endpoint: Templater "Insert Template" → `nuevo-endpoint` dentro de [[API_CONTRACT]].
5. [[_Home]] siempre refleja el estado real sin que lo actualices a mano.
