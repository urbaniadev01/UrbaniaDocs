---
type: meta
status: active
priority: P2
module: mobile
tags: [obsidian, vault, mobile]
updated: 2026-06-18
---

# 🗂️ OBSIDIAN_VAULT (App Móvil)
## Cómo Usar este Vault

> [!info] Relación con el vault del API
> Este vault reutiliza la misma configuración de plugins y convenciones que el vault de `Urbania API` ([[../OBSIDIAN_VAULT|OBSIDIAN_VAULT]] del backend) — no se repite la explicación de cada plugin aquí, solo lo que es específico de este vault de la app móvil.

---

## 1. Convenciones de este Vault

- **Frontmatter YAML** en todo documento: `type`, `status`, `priority`, `module: mobile`, `tags`, `updated`.
- **Wikilinks** (`[[Documento]]`) para referencias dentro de este vault; `[[../Documento]]` para referenciar el vault del API (asumiendo que ambos vaults viven en carpetas hermanas o que este vault está anidado un nivel bajo la raíz del vault del API — ajustar la profundidad del enlace relativo según la ubicación real elegida al integrar ambos vaults en Obsidian).
- **Callouts**: `[!info]` para contexto, `[!warning]` para advertencias importantes, `[!danger]` para reglas no negociables (seguridad, privacidad), `[!tip]` para recomendaciones, `[!note]` para aclaraciones, `[!todo]` para pendientes explícitos.

---

## 2. Tipos de Documento (`type` en frontmatter)

| Tipo | Significado |
|---|---|
| `meta` | Documentos de navegación y proceso (AGENTS, SESSION_MANIFEST, IMPLEMENTATION_PLAN) |
| `architecture` | Decisiones estructurales (ARCHITECTURE) |
| `reference` | Documentación de consulta estable (SECURITY, DATA_STRATEGY, DESIGN_SYSTEM, ACCESSIBILITY, API_INTEGRATION, FEATURE_SCOPE) |
| `operational` | Guías de uso diario (SETUP_GUIDE, TESTING, RELEASE_AND_OBSERVABILITY, DEVELOPMENT_GUIDE) |

---

## 3. Dataview

Si el vault combinado (API + App) tiene Dataview instalado, [[_Home]] expone una consulta que lista todos los documentos de `module: mobile` junto a los del backend, permitiendo ver el estado de ambos proyectos desde un solo dashboard.

```dataview
TABLE status, priority, updated
FROM "urbania-app"
SORT priority ASC
```

---

## 4. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[AGENTS]] | Punto de entrada real del contenido |
| [[_Home]] | Dashboard visual |
