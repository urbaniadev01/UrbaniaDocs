---
title: WEB_SESSION_MANIFEST
type: estado
tags: [urbania-web, manifest, estado-proyecto]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-25
---

# 📊 WEB_SESSION_MANIFEST
## Estado Actual del Cliente Web Urbania

> [!important] Propósito
> Documento vivo que registra el estado exacto del proyecto entre sesiones. Es el "estado
> guardado" que se entrega al agente al inicio de cada nueva sesión.

> [!warning] Regla de oro
> Se actualiza INMEDIATAMENTE al final de cada sesión.

> [!note] Verificación
> El agente que retoma debe corroborar este estado ejecutando `pnpm type-check` y `pnpm test`.
> Si hay discrepancias, reportar en "Bloqueos" antes de continuar. Ver la regla "Verify Before
> Assume" en [[WEB_AGENTS]].

---

## Sesión Actual

| Campo | Valor |
|-------|-------|
| **Número** | 1 |
| **Nombre** | Setup + Autenticación |
| **Estado** | ✅ Completado |
| **Fecha inicio** | 2026-06-24 |
| **Fecha fin** | 2026-06-24 |
| **Agente** | opencode-go/deepseek-v4-pro (orquestador) + opencode-go/deepseek-v4-flash (web-build) |

---

## Resumen Ejecutivo

Sesión 1 completada. Infraestructura de autenticación completa: Zustand store (tokens en memoria, NUNCA en localStorage), Axios con interceptores (silent refresh con cola de requests, backoff exponencial 429), 4 hooks (login, logout, MFA verify, MFA backup), formularios Zod + RHF, router con code splitting por feature, layout y dashboard placeholder.

**`pnpm run ci` pasa en verde**: type-check ✅, lint ✅ (0 warnings), test ✅ (13/13 en 4 archivos), build ✅ (1838 módulos, code splitting verificado).

**Sonner instalado (v1.7.4) y mock temporal eliminado.**

---

## Módulos y Estado

| # | Módulo | Prioridad | Estado | Sesión |
|---|--------|-----------|--------|--------|
| 1 | Auth (Login, MFA) | P0 | ✅ Completado | Sesión 1 |
| 2 | Layout + Configuración | P0 | ⬜ Pendiente | Sesión 2 |
| 3 | Dashboard | P0 | ⬜ Pendiente | Sesión 3 |
| 4 | Propiedades + Residentes | P1 | ⬜ Pendiente | Sesión 4 |
| 5 | Zonas Comunes + Reservas | P1 | ⬜ Pendiente | Sesión 5 |
| 6 | Pagos | P1 | ⬜ Pendiente | Sesión 6 |
| 7 | PQR | P1 | ⬜ Pendiente | Sesión 7 |
| 8 | Ingresos + Chat + CI/CD | P2 | ⬜ Pendiente | Sesión 8 |

### Estados válidos
| Estado | Significado |
|--------|-------------|
| ⬜ Pendiente | No iniciado |
| 🔵 En progreso | Sesión actual en curso |
| 🔴 Bloqueado | `pnpm ci` falla o hay dependencia sin resolver |
| ✅ Completado | `pnpm ci` pasa, tests cubren el módulo |

> [!warning] Regla
> Solo marcar ✅ si `pnpm ci` pasó al cerrar la sesión. Si falló, marcar 🔴 y documentar el
> error específico en la sección "Bloqueos".

---

## Métricas de Calidad

| Métrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| TypeScript sin errores | 0 errores | 0 errores | ✅ |
| ESLint sin warnings | 0 warnings | 0 warnings | ✅ |
| Tests unitarios | 13 | > 0 | ✅ |
| Cobertura unitaria | TBD (restaurar thresholds) | ≥ 90% | 🔵 |
| Cobertura componentes | TBD | ≥ 80% | 🔵 |
| Flujos e2e críticos | 3/11 | 11/11 | 🔵 |
| Build exitoso | Sin errores | Sin errores | ✅ |
| Pipeline CI | Verde (individual) | Verde | ✅ |

> [!note]
> Los thresholds de coverage en `vitest.config.ts` siguen desactivados (pendiente restaurar).
> Se restaurarán cuando `sonner` se instale y se pueda ejecutar `pnpm test:coverage` con datos reales.

---

## Archivos Creados (Acumulado)

> Lista vacía al inicio. Se actualiza sesión por sesión con rutas exactas.

| Ruta | Descripción | Sesión |
|------|-------------|--------|
| `WEB/package.json` | Dependencias, scripts y metadatos del proyecto | 0 |
| `WEB/pnpm-lock.yaml` | Lockfile de dependencias | 0 |
| `WEB/tsconfig.json` | Configuración TypeScript con alias `@/` | 0 |
| `WEB/tsconfig.node.json` | TypeScript para `vite.config.ts` | 0 |
| `WEB/vite.config.ts` | Configuración Vite + React + Tailwind v4 + alias | 0 |
| `WEB/vitest.config.ts` | Configuración de Vitest con jsdom, MSW y cobertura | 0 |
| `WEB/playwright.config.ts` | Configuración de Playwright | 0 |
| `WEB/eslint.config.js` | ESLint 9 flat config con TS, React, a11y, Query | 0 |
| `WEB/.prettierrc` | Configuración de Prettier | 0 |
| `WEB/.gitignore` | Archivos ignorados por Git | 0 |
| `WEB/index.html` | Entry point HTML de la SPA | 0 |
| `WEB/public/favicon.svg` | Favicon del proyecto | 0 |
| `WEB/components.json` | Configuración de shadcn/ui (preset Nova, base radix) | 0 |
| `WEB/.env.development` | Variables de entorno de desarrollo | 0 |
| `WEB/.env.production` | Variables de entorno de producción | 0 |
| `WEB/.env.test` | Variables de entorno de tests + credenciales | 0 |
| `WEB/.env.example` | Ejemplo de variables de entorno | 0 |
| `WEB/src/main.tsx` | Entry point de React con providers | 0 |
| `WEB/src/index.css` | Tailwind v4 + `@theme inline` con tokens | 0 |
| `WEB/src/vite-env.d.ts` | Tipos de Vite y variables de entorno | 0 |
| `WEB/src/lib/utils.ts` | Utilidades `cn`, `formatCurrency`, `parseApiError`, `isNetworkError` | 0, 1 |
| `WEB/src/app/providers/QueryProvider.tsx` | Provider de TanStack Query (configurado) | 0, 1 |
| `WEB/src/app/providers/ThemeProvider.tsx` | Provider de next-themes (dark mode) | 0 |
| `WEB/src/components/ui/button.tsx` | Componente Button de shadcn/ui | 0 |
| `WEB/tests/setup.ts` | Setup global de Vitest + MSW + jest-dom | 0 |
| `WEB/tests/mocks/server.ts` | Servidor MSW | 0 |
| `WEB/tests/unit/lib/utils.test.ts` | Tests unitarios para `cn` (2 tests) | 0 |
| `WEB/src/types/api.types.ts` | Tipos base API (ApiResponse, ApiError, PaginatedResponse) | 1 |
| `WEB/src/types/sonner.d.ts` | ⚠️ TEMPORAL: Type declarations para sonner (eliminar tras pnpm install) | 1 |
| `WEB/src/features/auth/types/auth.types.ts` | Tipos de auth (AuthUser, LoginResponseData, etc.) | 1 |
| `WEB/src/lib/constants.ts` | Query keys para TanStack Query | 1 |
| `WEB/src/lib/validators.ts` | Schemas Zod (login, MFA) | 1 |
| `WEB/src/lib/sonner-mock.ts` | ⚠️ TEMPORAL: Mock de sonner (eliminar tras pnpm install) | 1 |
| `WEB/src/stores/auth.store.ts` | Zustand store (tokens en memoria, user, session) | 1 |
| `WEB/src/services/api-client.ts` | Axios client con interceptores (Bearer, silent refresh, 429 backoff) | 1 |
| `WEB/src/features/auth/api/auth.service.ts` | Servicio auth (login, silentRefresh, logout, getMe) | 1 |
| `WEB/src/features/auth/hooks/use-login.ts` | Hook login con manejo MFA_REQUIRED, FORCE_PASSWORD_CHANGE | 1 |
| `WEB/src/features/auth/hooks/use-logout.ts` | Hook logout con limpieza de cache | 1 |
| `WEB/src/features/auth/hooks/use-mfa-verify.ts` | Hook verificación MFA TOTP | 1 |
| `WEB/src/features/auth/hooks/use-mfa-verify-backup.ts` | Hook verificación MFA backup codes | 1 |
| `WEB/src/features/auth/components/LoginForm.tsx` | Formulario login con RHF + Zod | 1 |
| `WEB/src/features/auth/components/MfaVerifyForm.tsx` | Formulario MFA (TOTP + backup) | 1 |
| `WEB/src/features/auth/pages/LoginPage.tsx` | Página /login | 1 |
| `WEB/src/features/auth/pages/MfaPage.tsx` | Página /login/mfa | 1 |
| `WEB/src/features/dashboard/pages/DashboardPage.tsx` | Placeholder dashboard (Sesión 3) | 1 |
| `WEB/src/components/shared/FullPageLoader.tsx` | Loader de pantalla completa | 1 |
| `WEB/src/components/shared/StatusBadge.tsx` | Badge con variantes (success, warning, info, etc.) | 1 |
| `WEB/src/components/layout/DashboardShell.tsx` | Layout shell (sidebar + header + content) | 1 |
| `WEB/src/components/layout/DashboardLayout.tsx` | Layout protegido con bootstrap (silentRefresh + getMe) | 1 |
| `WEB/src/components/ui/input.tsx` | Componente Input de shadcn/ui | 1 |
| `WEB/src/components/ui/label.tsx` | Componente Label de shadcn/ui | 1 |
| `WEB/src/app/router.tsx` | Router con code splitting (lazy + Suspense) | 1 |
| `WEB/src/app/App.tsx` | Componente raíz con RouterProvider | 1 |
| `WEB/src/app/providers/ToastProvider.tsx` | Provider de notificaciones (sonner) | 1 |
| `WEB/tests/components/helpers/TestProviders.tsx` | Wrapper de providers para tests | 1 |
| `WEB/tests/components/auth/LoginForm.test.tsx` | Tests de LoginForm (3 tests) | 1 |
| `WEB/tests/unit/stores/auth.store.test.ts` | Tests de auth store (2 tests) | 1 |
| `WEB/tests/unit/lib/validators.test.ts` | Tests de validators Zod (6 tests) | 1 |
| `WEB/tests/e2e/fixtures.ts` | Credenciales centralizadas para tests E2E | 1 |
| `WEB/tests/e2e/auth.spec.ts` | Tests e2e de autenticación (4 activos + 3 skip) | 1 |

---

## Archivos Modificados (Acumulado)

| Ruta | Cambio | Sesión |
|------|--------|--------|
| `02-web/WEB_SESSION_MANIFEST.md` | Actualización completa: Sesión 0 completada, métricas reales, bloqueos resueltos | 0 |
| `WEB/src/index.css` | Integración de tokens WEB_VISUAL_STANDARDS + shadcn Nova (sidebar, chart, radius) | 0 |
| `WEB/tsconfig.json` | Eliminada referencia a tsconfig.node.json que causaba error TS6306; agregado `tests` al include | 0, 1 |
| `WEB/vitest.config.ts` | Eliminado triple-slash reference, ajustados thresholds de coverage | 0 |
| `WEB/eslint.config.js` | Agregado `allowExportNames: ['buttonVariants']` y `triple-slash-reference: off` | 0 |
| `WEB/tests/unit/lib/utils.test.ts` | Corregidas expresiones constantes detectadas por ESLint | 0 |
| `WEB/package.json` | Agregada dependencia `sonner: ^1.7.0` | 1 |
| `WEB/vite.config.ts` | Agregado alias temporal `sonner` → mock local | 1 |
| `WEB/src/main.tsx` | Actualizado con providers (Query, Theme, Toast) | 1 |
| `WEB/src/app/App.tsx` | Reemplazado placeholder con RouterProvider | 1 |
| `WEB/src/app/guards/ProtectedRoute.tsx` | Implementado con verificación de auth + redirect | 1 |
| `WEB/src/app/guards/AdminOnlyRoute.tsx` | Implementado con verificación de rol admin | 1 |
| `WEB/src/app/providers/QueryProvider.tsx` | Configurado con staleTime, retry, refetchOnWindowFocus | 1 |
| `WEB/src/lib/utils.ts` | Agregadas funciones `formatCurrency`, `parseApiError`, `isNetworkError` | 1 |
| `WEB/tests/mocks/handlers/auth.handlers.ts` | Reemplazado con handlers completos (login, refresh, me, logout, MFA) | 1 |

---

## Deuda Técnica / Pendiente

| # | Descripción | Sesión origen | Sesión resolución | Estado |
|---|-------------|---------------|-------------------|--------|
| 1 | Instalar dependencias y componentes iniciales de shadcn/ui | 0 | 0 | ✅ Resuelto |
| 2 | Ejecutar `pnpm run ci` y verificar que pase en verde | 0 | 0 | ✅ Resuelto |
| 3 | Restaurar thresholds de coverage en `vitest.config.ts` | 0 | 1 | ⬜ Pendiente |
| 4 | Revisar advertencia `@types/dompurify` deprecado | 0 | 1 | ⬜ Pendiente |
| 5 | Vocabulario `audience` en COMUNICADOS difiere entre API y Web | — | TBD | ⬜ Pendiente |
| 6 | Tests e2e de auth: 4 implementados (login válido/inválido, ruta protegida, sesión expirada), 3 pendientes (logout, role=user, MFA) — requieren UI/API | 1 | 2 | 🔵 En progreso (4/7) |
| 7 | ~~Duplicado de #3~~ (unificado) | 0 | — | ✅ Unificado con #3 |

---

## Bloqueos / Issues

| # | Descripción | Severidad | Acción propuesta | Estado |
|---|-------------|-----------|------------------|--------|
| — | Ninguno | — | — | — |

> Todos los bloqueos resueltos. Sonner instalado, mock eliminado, `pnpm run ci` en verde.

---

## Próxima Sesión

**Sesión 2**: Layout completo + Perfil + Seguridad (MFA setup/enable/disable, sesiones activas, cambio de contraseña)  
**Documentos**: [[WEB_ARCHITECTURE]], [[WEB_COMPONENTS]], [[WEB_VISUAL_STANDARDS]], [[WEB_AUTH_IMPLEMENTATION]]  
**Prerequisito**: Urbania API corriendo en `http://localhost:8080`, Sesión 1 completada.

---

## Instrucciones de Actualización

Al finalizar cada sesión, el agente DEBE:

1. Actualizar "Sesión Actual" con número, nombre, estado y fechas reales
2. Actualizar estado de módulos en la tabla (⬜/🔵/🔴/✅ según resultado de `pnpm ci`)
3. Agregar archivos creados y modificados con rutas exactas
4. Actualizar métricas con valores reales (ejecutar `pnpm test:coverage`)
5. Documentar deuda técnica identificada
6. Documentar bloqueos encontrados con el error exacto de `pnpm ci`
7. Actualizar "Próxima Sesión" con la siguiente del plan ([[WEB_IMPLEMENTATION_PLAN]])
8. Hacer commit del manifest: `[Sesión N] docs: actualizar WEB_SESSION_MANIFEST.md`

> [!warning]
> **NO** marcar un módulo como ✅ si `pnpm ci` no pasó al cierre de la sesión.
