---
name: db-migration
description: Convenciones y checklist para crear migraciones PostgreSQL en la API Urbania
---

## Convenciones de tipos PostgreSQL

| Dato | Tipo PostgreSQL |
|---|---|
| ID primario | `uuid` (UUID v7, nunca auto-increment) |
| FK | `uuid` |
| Texto corto | `varchar(N)` con límite explícito |
| Texto largo | `text` |
| Monetario | `numeric(12,2)` (nunca `float`) |
| Fecha | `date` |
| Fecha+hora | `timestamptz` (siempre con zona horaria) |
| Booleano | `boolean` |
| JSON | `jsonb` (no `json`) |

## Reglas de índices

- PK: siempre en `uuid` con `->primary()`
- FK: siempre indexar (`->index()`)
- Campos de búsqueda frecuente: `->index()`
- Unicidad: `->unique()`
- Búsqueda full-text: `GIN` index

## Reglas de FK

- Siempre definir `onDelete()` y `onUpdate()` explícitamente
- Preferir `onDelete('restrict')` salvo justificación de negocio
- Nunca FK entre bounded contexts — usar UUID directo sin constraint

## Checklist antes de ejecutar

- [ ] `up()` crea la estructura correcta
- [ ] `down()` revierte COMPLETAMENTE — no dejar estado parcial
- [ ] Tipos PostgreSQL correctos (sin `float`, sin `json`)
- [ ] UUID v7 para PKs
- [ ] Índices definidos para todas las FKs
- [ ] Nombres de tabla en `snake_case` plural
- [ ] Nombres de columna en `snake_case`
- [ ] Esquema actualizado en `documentacion/01-api/API_DATABASE.md`
- [ ] `php artisan migrate` ejecutado
- [ ] `php artisan migrate:rollback` probado (verifica que down() funciona)
