---
type: session
session_number: <% tp.system.prompt("Número de sesión") %>
name: "<% tp.system.prompt("Nombre de la sesión") %>"
status: in-progress
date_start: <% tp.date.now("YYYY-MM-DD") %>
date_end:
agent: <% tp.system.prompt("Agente/modelo", "opencode") %>
tags: [session]
updated: <% tp.date.now("YYYY-MM-DD") %>
---

# Sesión <% tp.frontmatter.session_number %>: <% tp.frontmatter.name %>

> Crear este archivo en `docs/log/sesiones/sesion-<% tp.frontmatter.session_number %>.md` al iniciar la sesión. Actualizar `status` y `date_end` al cerrarla.

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]] (sección de esta sesión)
-

## Tareas completadas
- [ ]

## Archivos creados
| Ruta | Descripción |
|------|-------------|
|      |             |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
|      |        |

## Métricas de cierre
- Tests:
- Cobertura:
- PHPStan:
- Pint:

## Checklist de cierre ([[API_AGENTS]])
- [ ] `composer ci` verde
- [ ] [[API_SESSION_MANIFEST]] actualizado
- [ ] [[API_CONTRACT]] / [[API_DATABASE]] actualizados si aplica
- [ ] Deuda técnica o bloqueos documentados (ver `_templates/nueva-deuda.md` y `_templates/nuevo-bloqueo.md`)

## Notas

## Próxima sesión
-
