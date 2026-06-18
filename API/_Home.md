---
type: meta
tags: [dashboard]
updated: 2026-06-17
---

# 🏠 Urbania API

Punto de entrada al vault. Las tablas de abajo son consultas en vivo (Dataview) — no se editan a mano, se generan solas a partir de las notas en `docs/log/` y `docs/adr/`.

## 📌 Núcleo de navegación
- [[AGENTS]] — léelo siempre primero
- [[IMPLEMENTATION_PLAN]] — plan de sesiones
- [[SESSION_MANIFEST]] — estado entre sesiones
- [[ARCHITECTURE]] — stack y DDD
- [[OBSIDIAN_VAULT]] — cómo usar este vault

## 📅 Sesiones

```dataview
TABLE session_number AS "#", name AS "Nombre", status AS "Estado", date_start AS "Inicio", date_end AS "Fin", agent AS "Agente"
FROM "docs/log/sesiones"
WHERE type = "session"
SORT session_number ASC
```

## 🔴 Bloqueos abiertos

```dataview
TABLE severity AS "Severidad", session_origin AS "Sesión origen"
FROM "docs/log/bloqueos"
WHERE type = "issue" AND status = "open"
SORT severity DESC
```

## 🚧 Deuda técnica abierta

```dataview
TABLE session_origin AS "Sesión origen"
FROM "docs/log/deuda-tecnica"
WHERE type = "debt" AND status = "open"
```

## 🧱 ADRs

```dataview
TABLE adr_number AS "#", title AS "Título", status AS "Estado", priority AS "Prioridad"
FROM "docs/adr"
WHERE type = "adr"
SORT adr_number ASC
```

## 💡 Decisiones técnicas ad-hoc

```dataview
TABLE status AS "Estado", date AS "Fecha"
FROM "docs/log/decisiones"
WHERE type = "decision"
SORT date DESC
```

## ✅ Tareas pendientes en todo el vault

```tasks
not done
```
