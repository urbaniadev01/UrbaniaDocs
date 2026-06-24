---
type: meta
status: active
priority: P0
module: global
tags: [agents, navigation, global]
updated: 2026-06-18
---

# 🤖 AGENTS — Vault Global Urbania

> [!danger] Leer primero
> Este es el punto de entrada de **todo** el vault (API + Web + App). Antes de tocar cualquier documento o código, leer este archivo completo.

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
4. **Un cambio cross-project no se considera terminado hasta que está en `CHANGES_LOG.md` como "Sincronizado" en los 3 proyectos afectados.**
5. **Si encuentras una inconsistencia** entre este vault y el código real de cualquier proyecto, se reporta e informa de inmediato — mismo principio que ya rige en cada proyecto individualmente.

