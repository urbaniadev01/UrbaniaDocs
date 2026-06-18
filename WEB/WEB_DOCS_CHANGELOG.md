---
title: WEB_DOCS_CHANGELOG
type: changelog
tags: [urbania-web, changelog, inconsistencias]
status: vigente
ultima_revision: 2026-06-17
---

# 📝 WEB_DOCS_CHANGELOG
## Registro de Inconsistencias Encontradas y Cambios Aplicados

> [!important] Propósito
> Este documento responde a la instrucción explícita en [[WEB_AGENTS_GUIDE]]: *"si encuentras
> una inconsistencia, error o incoherencia, repórtalo de inmediato"*. Aquí se reporta el
> resultado completo de la revisión del 2026-06-17 sobre el set original de 10 documentos.

---

## 1. Hallazgo crítico: desalineación de stack (Next.js vs. Vite)

> [!danger] Esta fue la inconsistencia más grave encontrada
> Los 10 documentos originales estaban escritos **íntegramente para Next.js** (App Router,
> Server Components, `middleware.ts`, `next.config.ts`, `next/navigation`,
> `next/font/google`, variables `NEXT_PUBLIC_*`, rutas dinámicas `[id]`, troubleshooting de
> hidratación). Sin embargo, el stack autoritativo provisto para este proyecto especifica
> **Vite + React + TypeScript**, explícitamente **sin Next.js**.
>
> Un agente siguiendo la documentación original habría generado código que no compila ni
> ejecuta sobre Vite (importaría módulos inexistentes como `next/navigation`, intentaría
> crear `app/` router, configuraría middleware que Vite no soporta, etc.) — el riesgo de
> alucinación y bloqueo era alto.

### Cambios aplicados en todos los documentos

| Concepto Next.js (original) | Reemplazo Vite + React Router | Documentos afectados |
|---|---|---|
| App Router, `src/app/(dashboard)/[modulo]/page.tsx` | Estructura feature-based `src/features/<modulo>/pages/` + React Router | [[WEB_ARCHITECTURE]], [[WEB_AGENTS_GUIDE]], [[WEB_FEATURES_INDEX]] |
| Server Components / Client Components | Todo es cliente (SPA) — no aplica la distinción | [[WEB_AGENTS_GUIDE]], [[WEB_COMPONENTS]] |
| `middleware.ts` para proteger rutas | `ProtectedRoute` / `AdminOnlyRoute` con `<Outlet/>` + `<Navigate/>` de React Router | [[WEB_AUTH_IMPLEMENTATION]], [[WEB_IMPLEMENTATION_PLAN]] |
| Headers de seguridad/CSP en `next.config.ts` | Headers configurados en la capa de hosting (Nginx/Vercel/Netlify) — Vite no tiene servidor | [[WEB_AUTH_IMPLEMENTATION]] §11.1, [[WEB_IMPLEMENTATION_PLAN]] |
| `NEXT_PUBLIC_*` | `import.meta.env.VITE_*` | [[WEB_API_CLIENT]], [[WEB_DEVELOPMENT_GUIDE]], [[WEB_SETUP_GUIDE]] |
| Rutas dinámicas `[id]` | `:id` (sintaxis de React Router) | [[WEB_FEATURES_INDEX]], [[WEB_IMPLEMENTATION_PLAN]] |
| `next/font/google` | `@fontsource/inter` + `@fontsource/jetbrains-mono` (self-hosted) | [[WEB_VISUAL_STANDARDS]] §3.1 |
| Troubleshooting "Hydration mismatch" | Eliminado — no aplica a una SPA sin SSR | [[WEB_DEVELOPMENT_GUIDE]] |
| `next build` / Turbopack | `vite build` / `vite dev` | [[WEB_DEVELOPMENT_GUIDE]] §2 |
| Baseline `localhost:3000` | `localhost:5173` (puerto default de Vite) | [[WEB_TESTING]] §5 (Playwright `baseURL`) |
| `'use client'` directive | Eliminada (no existe el concepto en Vite) | [[WEB_VISUAL_STANDARDS]] §14 |
| `next-auth` descartado (doble motivo) | Se mantiene el ADR pero se añade que `next-auth` ni siquiera aplica fuera de Next.js | [[WEB_DEVELOPMENT_GUIDE]] DTW-001 |
| `next-themes` | Se mantiene (es agnóstico de framework pese al nombre) — se documenta explícitamente para evitar que el agente lo descarte por error | [[WEB_VISUAL_STANDARDS]] §14, [[WEB_DEVELOPMENT_GUIDE]] DTW-007 |

---

## 2. Documentos referenciados como "fuente única" pero nunca provistos

> [!warning] Gap de documentación
> [[WEB_AGENTS_GUIDE]] y otros documentos referencian `WEB_ARCHITECTURE.md` y
> `WEB_SETUP_GUIDE.md` repetidamente como **fuente única** para stack, estructura de carpetas
> e inicialización del proyecto — pero ninguno de los dos archivos estaba en el set original
> de 10 documentos subidos. Sin ellos, el agente no tenía dónde verificar la estructura de
> carpetas real ni los pasos de inicialización, a pesar de que ambos eran citados como
> obligatorios en el flujo de trabajo de [[WEB_AGENTS_GUIDE]].
>
> **Acción**: se crearon ambos documentos desde cero, alineados con el stack Vite + React +
> TypeScript autoritativo.

---

## 3. Estructura por capas → estructura feature-based

> [!note] Checklist punto 11 (Escalabilidad y Mantenimiento)
> La documentación original organizaba el código por **tipo técnico**
> (`src/components/`, `src/hooks/`, `src/services/`, `src/types/` con todos los módulos
> mezclados). Esto no escala bien y dificulta el code-splitting por feature.
>
> **Acción**: se migró a estructura feature-based: `src/features/<modulo>/{api,hooks,
> components,pages,types}/`, con código compartido en `src/components/{ui,layout,shared}/`,
> `src/stores/`, `src/lib/`, `src/hooks/` (genéricos), `src/types/` (genéricos). Documentado
> en [[WEB_ARCHITECTURE]] §4. Todas las referencias a rutas de archivo en
> [[WEB_FEATURES_INDEX]], [[WEB_IMPLEMENTATION_PLAN]] y [[WEB_COMPONENTS]] se actualizaron
> en consecuencia.

---

## 4. Brechas cubiertas según el checklist técnico de 11 puntos

El usuario solicitó verificar 11 categorías técnicas. Resultado de la verificación:

| # | Categoría | Estado original | Acción |
|---|-----------|------------------|--------|
| 1 | Tokens en memoria / httpOnly cookie | ✅ Ya estaba bien especificado | Conservado, ampliado con backoff y detección de sesión concurrente |
| 1 | Interceptor con flujo de refresh 401 | ✅ Ya estaba | Conservado |
| 1 | Sanitización XSS / CSP | ⚠️ CSP estaba atada a `next.config.ts` | Movido a capa de hosting — [[WEB_AUTH_IMPLEMENTATION]] §11.1 |
| 1 | **CSRF tokens** | ❌ No mencionado | **Añadido** — [[WEB_AUTH_IMPLEMENTATION]] §11.4: análisis explícito de por qué no es necesario con `SameSite=Strict` + header `Authorization`, con advertencia de añadir double-submit token si esa política cambia |
| 1 | **Rate limiting / 429 backoff** | ❌ No mencionado | **Añadido** — backoff exponencial con jitter, máx. 3 reintentos, respeta `Retry-After`, en el interceptor de Axios — [[WEB_API_CLIENT]] |
| 1 | **Sesiones concurrentes sospechosas** | ⚠️ Solo listado/revocación, sin detección | **Añadido** — heurística `evaluateSessionRisk()` en `src/features/settings/lib/session-risk.ts` — [[WEB_AUTH_IMPLEMENTATION]] §9.1 (marcado como dependiente de que la API expongA campo de geolocalización; verificar contra `API_CONTRACT.md`) |
| 2 | Zustand en memoria | ✅ Ya estaba | Conservado |
| 2 | staleTime por endpoint | ⚠️ No estaba tabulado | **Añadido** — tabla de staleTime por tipo de recurso — [[WEB_API_CLIENT]] §4 |
| 2 | Separación auth/server/local state | ✅ Implícito | Documentado explícitamente — [[WEB_ARCHITECTURE]] §3 |
| 3 | Axios base config | ✅ Ya estaba | Conservado |
| 3 | **Cola de requests durante refresh** | ⚠️ Mencionado de forma incompleta | Reforzado y documentado como patrón explícito de cola — [[WEB_AUTH_IMPLEMENTATION]] |
| 3 | **Tipado OpenAPI/Zod** | ❌ No mencionado | **Añadido** — estrategia: Zod como fuente de verdad para DTOs de request, interfaces TS planas para responses, `openapi-typescript` anotado como opción futura — [[WEB_API_CLIENT]] §2 |
| 4-5 | RHF + Zod, shadcn, a11y, dark mode | ✅ Ya estaban bien cubiertos | Conservados, solo se corrigieron referencias a Next.js |
| 6 | **Rutas protegidas + return URL** | ⚠️ Dependía de `middleware.ts` (incompatible con Vite) | **Reescrito** — `ProtectedRoute`/`AdminOnlyRoute` con preservación de return URL vía `location.state.from` — [[WEB_AUTH_IMPLEMENTATION]] §7.1 |
| 7 | **TanStack Table: sorting/filtering/pagination** | ⚠️ Mencionado pero sin configuración base | **Añadido** — configuración base completa (sorting solo client-side; filtering/pagination server-side vía Query) — [[WEB_COMPONENTS]] §10 |
| 7 | **Acciones bulk / multi-select** | ❌ No existía | **Añadido** — toolbar de acciones, tipo `BulkAction<T>`, componente `BulkActionsToolbar`, ejemplo con pagos — [[WEB_COMPONENTS]] §10.3 |
| 8 | Vitest, RTL, MSW, cobertura | ✅ Ya estaban bien cubiertos | Conservados, solo se corrigió el mock de `next/navigation` (ver §6 de este changelog) |
| 9 | ESLint/Prettier/TS strict/pnpm | ✅ Ya estaban | Conservados, actualizado a ESLint 9 flat config |
| 10 | **Variables de entorno VITE_** | ⚠️ Usaban `NEXT_PUBLIC_*` | Corregido en todo el set |
| 10 | **CI/CD + Sentry** | ❌ CI/CD solo mencionado superficialmente, Sentry ausente | **Añadido** — pipeline completo de GitHub Actions (jobs quality/e2e/deploy) y snippet de integración de Sentry — [[WEB_DEVELOPMENT_GUIDE]] §5 |
| 11 | **Feature-based structure** | ❌ Era layer-based | Migrado (ver §3 de este changelog) |
| 11 | **Storybook / README por feature** | ❌ No mencionado | **Añadido** como decisión a tomar — [[WEB_ARCHITECTURE]] §10, [[WEB_DEVELOPMENT_GUIDE]] §7 |
| 11 | **Path de migración a Next.js/SSR** | ❌ No existía (la doc ya "era" Next.js) | **Añadido** — tabla de qué cambiaría si se migra a SSR en el futuro — [[WEB_ARCHITECTURE]] §9 |

---

## 5. Actualización de versiones

> [!tip] Se priorizaron versiones estables más recientes de los paquetes principales,
> verificadas contra documentación oficial, evitando incompatibilidades conocidas entre ellos.

| Paquete | Versión documentada ahora | Nota |
|---|---|---|
| React | 19.2 | — |
| Vite | 7 | Requiere Node 20.19+ o 22.12+ |
| React Router | v7 | — |
| TanStack Query | v5 | — |
| Tailwind CSS | v4 | Config CSS-first (`@theme`/`@theme inline`), plugin oficial `@tailwindcss/vite` reemplaza `tailwind.config.ts` |
| Zod | v4 | — |
| React Hook Form | v7 | Compatible con Zod v4 vía `@hookform/resolvers` |
| Vitest | 4.x | — |
| pnpm | v9/10 | — |
| ESLint | 9 (flat config) | Prettier conservado sobre Biome; Biome documentado como alternativa válida |

---

## 6. Otros ajustes menores

- **Playwright**: `baseURL` y `webServer.url` corregidos de `localhost:3000` a `localhost:5173`
  (puerto default de Vite), con nota para mantenerlo sincronizado si se cambia
  `server.port` en `vite.config.ts`. Ver [[WEB_TESTING]] §5.
- **Mocking de navegación en tests**: el patrón original mockeaba `next/navigation`
  (`vi.mock('next/navigation', ...)`), que no existe en este stack. Se reemplazó por un
  wrapper `MemoryRouter` en `TestProviders`, con un componente auxiliar `LocationProbe` para
  verificar navegación a través del pathname renderizado en vez de mockear internals del
  router. Ver [[WEB_TESTING]] §2.3.
- **Formato Obsidian aplicado a los 12 documentos**: frontmatter YAML
  (`title`/`type`/`tags`/`status`/`fuente_unica`/`ultima_revision`), wikilinks `[[Documento]]`
  reemplazando referencias en texto plano, y callouts (`[!important]`, `[!warning]`,
  `[!danger]`, `[!tip]`, `[!note]`) para resaltar advertencias críticas.

---

## 7. Documentos resultantes

| Documento | Estado |
|---|---|
| [[00_INDEX]] | Nuevo — MOC de Obsidian |
| [[WEB_ARCHITECTURE]] | Nuevo (no existía en el set original) |
| [[WEB_SETUP_GUIDE]] | Nuevo (no existía en el set original) |
| [[WEB_AGENTS_GUIDE]] | Reescrito |
| [[WEB_AUTH_IMPLEMENTATION]] | Reescrito |
| [[WEB_API_CLIENT]] | Reescrito |
| [[WEB_COMPONENTS]] | Reescrito |
| [[WEB_VISUAL_STANDARDS]] | Reescrito |
| [[WEB_DEVELOPMENT_GUIDE]] | Reescrito |
| [[WEB_FEATURES_INDEX]] | Reescrito |
| [[WEB_IMPLEMENTATION_PLAN]] | Reescrito |
| [[WEB_SESSION_MANIFEST]] | Reescrito (cambios mínimos de contenido) |
| [[WEB_TESTING]] | Reescrito |
| WEB_DOCS_CHANGELOG | Este documento |

> [!note] Recomendación
> Si en el futuro se sube `API_CONTRACT.md` del repositorio del API, conviene re-verificar
> especialmente los puntos marcados como dependientes de campos de API no confirmados (la
> detección de sesión concurrente en [[WEB_AUTH_IMPLEMENTATION]] §9.1 es el caso principal).
