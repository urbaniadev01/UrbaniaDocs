---
type: debt
status: open
session_origin: <% tp.system.prompt("Sesión de origen") %>
session_resolved:
tags: [debt]
updated: <% tp.date.now("YYYY-MM-DD") %>
---

# <% tp.system.prompt("Descripción breve de la deuda técnica") %>

> Crear en `docs/log/deuda-tecnica/`. Reemplaza la tabla "Deuda Técnica / Pendiente" de [[API_SESSION_MANIFEST]], que ahora consulta estas notas vía Dataview.

## Descripción

## Por qué se postergó

## Cuándo resolverla
