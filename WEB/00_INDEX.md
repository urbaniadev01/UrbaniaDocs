---
title: 00_INDEX
type: moc
tags: [urbania-web, indice, moc]
status: vigente
ultima_revision: 2026-06-17
---

# 🧭 URBANIA WEB — Índice de Documentación
## Mapa de Contenidos (MOC) del Cliente Web Administrativo

> [!important] Punto de entrada
> Esta es la nota raíz de la documentación técnica del cliente web Urbania (panel de
> administración de propiedades horizontales). Si eres un agente de desarrollo, empieza
> siempre en [[WEB_AGENTS_GUIDE]] — esta nota es solo el mapa de navegación para humanos
> usando Obsidian.

> [!warning] Cambio de stack importante
> Esta documentación fue revisada el 2026-06-17 para corregir una inconsistencia crítica:
> la versión inicial estaba escrita para **Next.js**, pero el stack autoritativo del
> proyecto es **Vite + React + TypeScript** (SPA, sin SSR). Todos los documentos fueron
> actualizados. Ver [[WEB_DOCS_CHANGELOG]] para el detalle completo de cambios.

---

## 📍 Empezar aquí

| Orden | Documento | Propósito |
|-------|-----------|-----------|
| 1 | [[WEB_AGENTS_GUIDE]] | Mapa de navegación — leer siempre primero |
| 2 | [[WEB_SESSION_MANIFEST]] | Estado actual del proyecto entre sesiones |
| 3 | [[WEB_IMPLEMENTATION_PLAN]] | Plan de sesiones — identificar sesión actual |

---

## 🏗️ Fundamentos del Proyecto

| Documento | Propósito | Fuente única |
|-----------|-----------|--------------|
| [[WEB_ARCHITECTURE]] | Stack tecnológico, estructura de carpetas, principios, ADRs | ✅ |
| [[WEB_SETUP_GUIDE]] | Inicialización paso a paso del proyecto | ✅ |
| [[WEB_DEVELOPMENT_GUIDE]] | Troubleshooting, decisiones técnicas, DevOps, CI/CD | — |

## 🔐 Autenticación e Integración API

| Documento | Propósito | Fuente única |
|-----------|-----------|--------------|
| [[WEB_AUTH_IMPLEMENTATION]] | Autenticación JWT, sesiones, CSRF, rate limiting | ✅ |
| [[WEB_API_CLIENT]] | Cliente Axios, contratos de endpoints, tipado, staleTime | — |

## 🎨 UI y Componentes

| Documento | Propósito | Fuente única |
|-----------|-----------|--------------|
| [[WEB_VISUAL_STANDARDS]] | Design system: colores, tipografía, espaciado, a11y | ✅ |
| [[WEB_COMPONENTS]] | Catálogo de componentes, tablas, formularios, patrones | — |

## 📋 Gestión del Proyecto

| Documento | Propósito | Fuente única |
|-----------|-----------|--------------|
| [[WEB_FEATURES_INDEX]] | Catálogo de módulos y su estado | — |
| [[WEB_IMPLEMENTATION_PLAN]] | Plan de implementación por sesiones | ✅ |
| [[WEB_SESSION_MANIFEST]] | Estado vivo entre sesiones | — |

## ✅ Calidad

| Documento | Propósito | Fuente única |
|-----------|-----------|--------------|
| [[WEB_TESTING]] | Especificaciones de pruebas (Vitest, RTL, Playwright, MSW) | — |

## 📝 Historial

| Documento | Propósito |
|-----------|-----------|
| [[WEB_DOCS_CHANGELOG]] | Registro de inconsistencias encontradas y cambios aplicados a esta documentación |

---

## 🗺️ Mapa Visual

```
00_INDEX (estás aquí)
│
├── WEB_AGENTS_GUIDE ────────────── mapa de navegación para el agente
│
├── Fundamentos
│   ├── WEB_ARCHITECTURE ─────────── stack, carpetas, ADRs (FUENTE ÚNICA)
│   ├── WEB_SETUP_GUIDE ──────────── inicialización
│   └── WEB_DEVELOPMENT_GUIDE ────── troubleshooting, DevOps, CI/CD
│
├── Auth & API
│   ├── WEB_AUTH_IMPLEMENTATION ──── JWT, sesiones, CSRF (FUENTE ÚNICA)
│   └── WEB_API_CLIENT ───────────── cliente Axios, contratos
│
├── UI
│   ├── WEB_VISUAL_STANDARDS ──────── design system (FUENTE ÚNICA)
│   └── WEB_COMPONENTS ────────────── catálogo de componentes
│
├── Gestión
│   ├── WEB_FEATURES_INDEX ────────── catálogo de módulos
│   ├── WEB_IMPLEMENTATION_PLAN ──── plan de sesiones (FUENTE ÚNICA)
│   └── WEB_SESSION_MANIFEST ─────── estado entre sesiones
│
├── WEB_TESTING ──────────────────── especificaciones de pruebas
│
└── WEB_DOCS_CHANGELOG ───────────── historial de cambios a la documentación
```

---

## 🏷️ Por Tag

- `#urbania-web` — todos los documentos
- `#fuente-unica` — documentos marcados como fuente de verdad para su tema
- `#adr` — decisiones de arquitectura ([[WEB_ARCHITECTURE]], [[WEB_DEVELOPMENT_GUIDE]])
- `#troubleshooting` — [[WEB_DEVELOPMENT_GUIDE]]

---

## Stack Tecnológico (resumen)

> Detalle completo y justificación en [[WEB_ARCHITECTURE]] §2.

Vite + React 19 + TypeScript · React Router v7 · TanStack Query v5 · Axios · Zustand ·
React Hook Form + Zod v4 · shadcn/ui (Radix + Tailwind v4) · TanStack Table · Vitest 4 + RTL +
Playwright · ESLint 9 + Prettier · pnpm

> [!note] Sin Next.js
> El cliente es una SPA pura. No hay Server Components, no hay `middleware.ts`, no hay
> renderizado en servidor. Ver [[WEB_ARCHITECTURE]] §9 para la ruta de migración futura a
> SSR si llegara a ser necesaria.
