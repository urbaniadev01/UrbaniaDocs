---
type: adr
adr_number: <% tp.system.prompt("Número (ej. 001)") %>
title: "<% tp.system.prompt("Título de la decisión") %>"
status: proposed
priority: alta
tags: [adr]
updated: <% tp.date.now("YYYY-MM-DD") %>
---

# ADR-<% tp.frontmatter.adr_number %>: <% tp.frontmatter.title %>

> Crear en `docs/adr/ADR-<% tp.frontmatter.adr_number %>.md`. Cada ADR justifica una decisión técnica fundamental ya aplicada en el código (ver [[ARCHITECTURE]] §14), no una decisión teórica.

## Contexto

## Decisión

## Alternativas consideradas

## Consecuencias

## Documentos afectados
-
