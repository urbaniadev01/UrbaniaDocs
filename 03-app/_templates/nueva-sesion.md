---
type: sesion
proyecto: app
fecha: <% tp.date.now("YYYY-MM-DD") %>
sesion: <% tp.system.prompt("Número de sesión") %>
status: cerrada
tags: [sesion, app]
---

# Sesión App <% tp.system.prompt("Número de sesión") %> — <% tp.date.now("YYYY-MM-DD") %>

## Resumen

_Descripción breve de lo que se hizo._

## Features completadas

- [ ] 

## Tareas pendientes para próxima sesión

- [ ] 

## Decisiones técnicas tomadas

## Bloqueos encontrados

_"Ninguno" si no hubo._

## Cambios cross-project generados

_Referencia a CAMBIO-NNN o "Ninguno"._

## Estado de calidad al cierre

- `flutter analyze`: ✅ / ❌
- `flutter test`: ✅ / ❌

## Notas para la próxima sesión
