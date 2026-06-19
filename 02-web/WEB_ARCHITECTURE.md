---
title: WEB_ARCHITECTURE
type: arquitectura
tags: [urbania-web, arquitectura, stack, adr]
status: vigente
fuente_unica: true
ultima_revision: 2026-06-17
---

# 🏗️ WEB_ARCHITECTURE
## Stack, Estructura de Carpetas, Principios y ADRs — Cliente Web Urbania

> [!important] Fuente única de verdad
> Este documento define el **stack tecnológico**, la **estructura de carpetas** y los
> **principios de arquitectura** del cliente web. Toda decisión de stack o de organización de
> código se verifica aquí antes de implementar. Ver [[WEB_AGENTS]] para el mapa completo
> de documentación y [[WEB_SETUP_GUIDE]] para la inicialización paso a paso del proyecto.

> [!warning] Corrección de inconsistencia (2026-06-17)
> La versión inicial de esta documentación describía un cliente construido sobre **Next.js**
> (Server Components, `app/` router, `middleware.ts`, `next.config.ts`, `next/navigation`,
> `next/font/google`). Eso entra en conflicto directo con el stack confirmado para este
> proyecto: **Vite + React + TypeScript + React Router**, sin servidor Node propio. Todo este
> documento, y el resto de la documentación enlazada, ya refleja el stack correcto. Si en algún
> punto el agente encuentra un fragmento que mencione Next.js, Server Components, `app/`,
> `middleware.ts` o `next.config.ts`, es un residuo no migrado — repórtalo de inmediato en
> `WEB_SESSION_MANIFEST.md` § Bloqueos antes de continuar.

---

## 1. Tu Rol

Ingeniero senior especializado en React, TypeScript y Vite. Construir el cliente web
administrativo de Urbania (panel de gestión de propiedades horizontales): una **SPA (Single
Page Application) 100% detrás de login**, sin necesidad de SSR ni SEO. El cliente se comunica
exclusivamente con la Urbania API REST — nunca accede a la base de datos directamente.

---

## 2. Stack Tecnológico

> [!note] Criterio de versiones
> Se especifica el **major** (y minor cuando es relevante) de cada paquete, no el patch exacto.
> Los patches cambian con demasiada frecuencia para mantenerlos vigentes en un documento; el
> `pnpm-lock.yaml` es la fuente de verdad del patch instalado. Al iniciar el proyecto
> (`WEB_SETUP_GUIDE.md`), instalar siempre el rango `^major.minor` indicado aquí, y ejecutar
> `pnpm outdated` mensualmente para revisar actualizaciones menores.

| Capa | Elección | Versión mínima | Por qué |
|------|----------|----------------|---------|
| Base / build | **Vite + React + TypeScript** | Vite 7.x · React 19.x · TS 5.7+ | Panel admin 100% detrás de login: no necesita SSR/SEO de Next.js. Vite es más simple de razonar, arranca y compila más rápido. Migrar a SSR en el futuro no es traumático (ver §9). |
| Routing | **React Router** | v7.x (modo *data router*, sin SSR) | Estándar de facto, soporta rutas protegidas, layouts anidados y lazy-loading por feature sin reestructurar nada. |
| Llamadas API + cache | **TanStack Query** | v5.x | Cache, reintentos, invalidación tras mutaciones, loading/error states. Cada recurso nuevo son ~2 hooks, no arquitectura nueva. |
| Cliente HTTP | **Axios** con interceptores | v1.x | Necesita interceptor que detecte `401 TOKEN_EXPIRED`, llame a `/auth/refresh`, reintente la request original, y si el refresh también falla, redirija a login. Ver [[WEB_API_CLIENT]] y [[WEB_AUTH_IMPLEMENTATION]]. |
| Estado de auth/sesión | **Zustand** | v5.x | Guarda `accessToken` en memoria (nunca `localStorage`, por XSS) + datos del usuario. Mucho más liviano que Redux. |
| Formularios + validación | **React Hook Form + Zod** | RHF v7.x · Zod v4.x | Un schema Zod por request, reutilizable como contrato de tipos TS. |
| UI components | **shadcn/ui** (Radix + Tailwind) | CLI `shadcn@latest` | Código que se copia al proyecto, no una dependencia pesada. Evita quedar atado a un design system cuando esto crezca a dashboards/tablas complejas. |
| Estilos | **Tailwind CSS** | v4.x | Motor CSS-first (`@theme` en CSS), zero-config, plugin oficial de Vite (`@tailwindcss/vite`). |
| Tablas | **TanStack Table** | v8.x / v9.x | Combina con TanStack Query. Se usa para `/auth/sessions` y todos los listados (`/properties`, `/payments`, etc.). |
| Iconos | **Lucide React** | última estable | Única librería de iconos aprobada — ver [[WEB_VISUAL_STANDARDS]] §7. |
| Testing unit/componentes | **Vitest + React Testing Library** | Vitest v3.2+ (requerido por Vite 7) | Vitest es nativo de Vite, mismo motor de transformación, cero config extra. |
| Mocking de API en tests | **MSW (Mock Service Worker)** | v2.x | Intercepta a nivel de red — funciona igual en Vitest, Playwright y (si se adopta) Storybook. |
| Testing E2E | **Playwright** | última estable | Trace viewer, fixtures, multi-browser. |
| Lint/format | **ESLint 9 (flat config) + Prettier** | — | Ver ADR-008 (§8) para la alternativa Biome y por qué se mantiene ESLint+Prettier en este proyecto. |
| TypeScript | **strict mode** | 5.7+ | `strict: true`, sin `any` implícito, path aliases (`@/`). |
| Gestor de paquetes | **pnpm** | v9.x / v10.x | Instalaciones rápidas, deduplicadas, buen default. Workspaces disponibles si el proyecto escala a monorepo. |
| Tiempo real | **Laravel Echo + Pusher-js (o Soketi/Reverb en local)** | — | Consumo de eventos de chat del módulo PQR/Chat. Ver [[WEB_API_CLIENT]] §7. |
| Error tracking | **Sentry (`@sentry/react`)** | última estable | Ver [[WEB_DEVELOPMENT_GUIDE]] §6 (DevOps). Opcional para MVP, recomendado antes de producción. |

---

## 3. Principios de Arquitectura

### 3.1 Separación de Responsabilidades de Estado (Regla de Oro #2 del checklist)

Tres tipos de estado, tres herramientas, **nunca mezclados**:

| Tipo de estado | Herramienta | Ejemplos | Regla |
|---------------|-------------|----------|-------|
| **Estado de servidor** (datos que viven en el API) | TanStack Query | Lista de pagos, detalle de residente, sesiones activas | Nunca copiar a Zustand ni a `useState`. Si necesitas el dato en otro componente, usa el mismo `queryKey`. |
| **Estado global de cliente** (no pertenece al servidor, pero sí a toda la app) | Zustand | `accessToken`, `user`, tema oscuro/claro (vía `next-themes`), sidebar colapsado | Solo lo que múltiples componentes no relacionados necesitan leer/escribir. |
| **Estado local de componente** | `useState` / `useReducer` | Texto de un input antes de submit, si un dropdown está abierto, página actual de una tabla (a menos que se sincronice con la URL) | Si solo un componente y sus hijos directos lo usan, no sale del componente. |

> [!tip] Test rápido antes de crear un store nuevo
> ¿El dato puede recalcularse o re-obtenerse desde el API? → TanStack Query.
> ¿El dato es efímero y solo importa mientras el componente está montado? → `useState`.
> ¿Ninguna de las anteriores? → Zustand, y solo entonces.

### 3.2 Feature-Based Structure (Regla de Oro #11 del checklist)

Cada módulo de negocio (`payments`, `residents`, `pqr`, etc.) es una **feature autocontenida**:
su propia capa de API, hooks, componentes, tipos y páginas viven juntos. El código compartido
entre features (UI kit, layout, stores globales, cliente Axios) vive en la raíz de `src/`.

**Por qué**: cuando el proyecto crece a 11 módulos (ver [[WEB_FEATURES_INDEX]]), localizar todo
el código de "Pagos" en una sola carpeta reduce el costo cognitivo de cada sesión y evita que un
cambio en un módulo rompa otro por acoplamiento accidental de carpetas técnicas compartidas.

### 3.3 Code Splitting por Feature, no por Componente (Regla de Oro #11)

El `lazy()` de React Router se aplica a nivel de **página de feature** (`PaymentsPage`,
`ResidentsPage`), no a componentes individuales dentro de la página. Dividir por componente
individual genera demasiados chunks pequeños y empeora el tiempo de carga por overhead de
requests HTTP adicionales.

### 3.4 Server Rendering: No Aplica

> [!note]
> Este proyecto **no usa Server Components ni Server-Side Rendering**. Todo el árbol de
> componentes es client-side. No existe la distinción "Server Component por defecto" de
> Next.js — esa regla queda **eliminada** de este proyecto (ver nota de corrección al inicio del
> documento). Todo componente es, por definición, un componente de cliente; no es necesario ni
> correcto anotar `'use client'` en ningún archivo.

---

## 4. Estructura de Carpetas

```
urbania-web/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                      # Entry point de Vite — monta <App /> en #root
│   ├── app/
│   │   ├── App.tsx                   # Providers globales + <RouterProvider />
│   │   ├── router.tsx                # Definición de rutas (React Router, data router)
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx     # QueryClientProvider + QueryClient config
│   │   │   ├── ThemeProvider.tsx     # next-themes (framework-agnóstico, ver WEB_VISUAL_STANDARDS §14)
│   │   │   └── ToastProvider.tsx     # Sonner / Toast root
│   │   └── guards/
│   │       ├── ProtectedRoute.tsx    # Verifica accessToken en memoria antes de renderizar
│   │       └── AdminOnlyRoute.tsx    # Verifica role === 'admin'
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/auth.service.ts
│   │   │   ├── hooks/ (use-login.ts, use-logout.ts, use-mfa-verify.ts, ...)
│   │   │   ├── components/ (LoginForm.tsx, MfaVerifyForm.tsx, ...)
│   │   │   ├── pages/ (LoginPage.tsx, MfaPage.tsx, ForgotPasswordPage.tsx, ...)
│   │   │   └── types/auth.types.ts
│   │   ├── settings/        (perfil, seguridad, MFA, sesiones — Sesión 2)
│   │   ├── dashboard/       (Sesión 3)
│   │   ├── properties/      (Sesión 4)
│   │   ├── residents/       (Sesión 4)
│   │   ├── common-zones/    (Sesión 5)
│   │   ├── reservations/    (Sesión 5)
│   │   ├── payments/        (Sesión 6)
│   │   ├── pqr/              (Sesión 7)
│   │   ├── entry-log/       (Sesión 8)
│   │   └── chat/            (Sesión 8)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui — copiado, no importado
│   │   ├── layout/                   # DashboardShell, Sidebar, PageShell
│   │   └── shared/                   # DataTable, ConfirmDialog, EmptyState, ErrorState,
│   │                                  # StatusBadge, Pagination, FullPageLoader, skeletons
│   ├── stores/
│   │   ├── auth.store.ts             # Zustand — accessToken + user
│   │   └── ui.store.ts               # Zustand — sidebar colapsado, etc.
│   ├── services/
│   │   └── api-client.ts             # Instancia única de Axios + interceptores
│   ├── lib/
│   │   ├── constants.ts              # QUERY_KEYS centralizados
│   │   ├── utils.ts                  # formatCurrency, parseApiError, isNetworkError...
│   │   ├── validators.ts             # Schemas Zod reutilizables
│   │   ├── status-config.ts          # Configuración de StatusBadge por módulo
│   │   └── echo.ts                   # Laravel Echo singleton
│   ├── types/
│   │   └── api.types.ts              # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   └── hooks/
│       └── use-inactivity-logout.ts  # Hooks transversales (no pertenecen a una sola feature)
├── tests/                            # Ver WEB_TESTING.md §1
├── .env.development
├── .env.production
├── .env.test
├── vite.config.ts
├── vitest.config.ts                  # o sección `test` dentro de vite.config.ts
├── playwright.config.ts
├── tailwind.config.ts                # opcional en Tailwind v4 — ver WEB_VISUAL_STANDARDS §2.1
├── tsconfig.json
├── eslint.config.js                  # flat config (ESLint 9)
└── package.json
```

> [!warning] Convención de rutas dinámicas
> La notación `[id]` (carpetas con corchetes) es una convención del *file-based routing* de
> Next.js y **no aplica aquí**. En React Router, los parámetros dinámicos se declaran en la
> definición de rutas con `:id` (p. ej. `/properties/:id`). Todo el resto de la documentación
> usa `:id`, nunca `[id]`.

### 4.1 Anatomía de una Feature

```
src/features/payments/
├── api/
│   └── payments.service.ts     # Funciones puras que llaman a apiClient
├── hooks/
│   └── use-payments.ts         # Hooks de TanStack Query
├── components/
│   ├── PaymentTable.tsx
│   ├── CreatePaymentForm.tsx
│   └── PaymentSummaryBar.tsx
├── pages/
│   ├── PaymentsPage.tsx        # Ruta /payments — lazy-loaded en router.tsx
│   └── PaymentDetailPage.tsx   # Ruta /payments/:id
└── types/
    └── payment.types.ts
```

Una feature **nunca importa directamente** de la carpeta interna de otra feature
(`features/payments/components/...` no se importa desde `features/residents/`). Si dos features
necesitan compartir algo, ese algo se promueve a `src/components/shared/`, `src/lib/` o
`src/types/`.

---

## 5. Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | `PascalCase.tsx` | `PaymentTable.tsx` |
| Hooks | `kebab-case.ts`, función `camelCase` con prefijo `use` | `use-payments.ts` → `usePayments()` |
| Servicios | `kebab-case.service.ts` | `payments.service.ts` |
| Tipos | `kebab-case.types.ts` | `payment.types.ts` |
| Páginas/rutas | `PascalCase` + sufijo `Page` | `PaymentsPage.tsx`, `PaymentDetailPage.tsx` |
| Stores Zustand | `kebab-case.store.ts` | `auth.store.ts` |
| Tests | mismo nombre + `.test.ts(x)` o `.spec.ts` (e2e) | `PaymentTable.test.tsx`, `payments.spec.ts` |

---

## 6. Path Aliases

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**`vite.config.ts`** (debe coincidir exactamente con `tsconfig.json`)
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

> [!warning] Regla de oro
> Si se agrega o cambia un alias, debe actualizarse en **ambos** archivos (`tsconfig.json` y
> `vite.config.ts`). Si solo se actualiza uno, TypeScript resuelve el import pero Vite falla en
> build (o viceversa) — un error confuso de diagnosticar.

---

## 7. Variables de Entorno

Vite expone al cliente **solo** las variables prefijadas con `VITE_`, vía `import.meta.env`, no
`process.env`. Detalle completo de los archivos `.env.*` y su contenido en
[[WEB_SETUP_GUIDE]] §7 y [[WEB_DEVELOPMENT_GUIDE]] §6.

```ts
// ❌ No existe en Vite — esto es Next.js
const url = process.env.NEXT_PUBLIC_API_URL;

// ✅ Forma correcta en Vite
const url = import.meta.env.VITE_API_URL;
```

---

## 8. Decisiones de Arquitectura (ADRs)

> Decisiones de implementación más granulares (no de stack) están en
> [[WEB_DEVELOPMENT_GUIDE]] §5.

| # | Decisión | Contexto | Alternativa considerada |
|---|----------|----------|--------------------------|
| ADR-001 | Vite + React Router en lugar de Next.js | El cliente es 100% privado (detrás de login), sin necesidad de SEO ni SSR. Vite simplifica el modelo mental (sin Server/Client Components) y acelera el ciclo de desarrollo. | Next.js (descartado — ver §9 para el path de migración si algún día se necesita SSR) |
| ADR-002 | TanStack Query sobre fetch manual + estado propio | Cache, invalidación, reintentos y estados de carga/error "gratis" por cada recurso nuevo. | RTK Query, SWR |
| ADR-003 | Zustand sobre Redux/Context API para auth | Menos boilerplate, sin providers anidados, suficiente para el tamaño de este proyecto. | Redux Toolkit, Context API puro |
| ADR-004 | Axios sobre `fetch` nativo | Interceptores de request/response son imprescindibles para el flujo de silent refresh; `fetch` requeriría un wrapper equivalente hecho a mano. | `fetch` + wrapper custom |
| ADR-005 | shadcn/ui sobre Mantine/Ant Design | El código se copia y se posee — no queda atado a un design system pesado cuando el dashboard crezca a tablas y formularios complejos. Mantine es la alternativa razonable si se prioriza velocidad inicial sobre control total. | Mantine, Ant Design |
| ADR-006 | React Router (modo SPA) sobre TanStack Router | React Router es más estándar y tiene mayor adopción/documentación para el caso de uso (rutas protegidas + lazy loading), sin necesitar el enfoque file-based de TanStack Router. | TanStack Router |
| ADR-007 | No usar `next-auth` | El API tiene JWT propio con cookies `httpOnly`. Tampoco aplica en un proyecto sin Next.js. | next-auth (descartado, doblemente inválido tras la migración de stack) |
| ADR-008 | ESLint 9 (flat config) + Prettier, no Biome | Mayor cantidad de plugins específicos disponibles (`eslint-plugin-jsx-a11y`, `@tanstack/eslint-plugin-query`) que el proyecto necesita para accesibilidad y reglas de Query. Biome es más simple de mantener con una sola herramienta, pero a costa de menos reglas especializadas. Revaluar si el ecosistema de plugins de Biome alcanza paridad. | Biome |
| ADR-009 | pnpm como gestor de paquetes | Instalaciones más rápidas y deduplicadas; soporte nativo de workspaces si el proyecto escala a monorepo (p. ej. separar `ui-kit` como paquete propio). | npm, yarn |
| ADR-010 | Access token en memoria (Zustand), nunca `localStorage`/`sessionStorage` | Resistencia a XSS — ver [[WEB_AUTH_IMPLEMENTATION]] §1. | localStorage (descartado por seguridad) |

---

## 9. Migración Futura a SSR (si se necesita)

> Checklist #11 del documento de requerimientos: "Path a Next.js si se necesita SSR
> (documentar dependencias)".

Si en el futuro el panel necesita SSR (por ejemplo, una landing pública con SEO, o tiempos de
carga inicial críticos en redes lentas), estos son los puntos de acoplamiento a Vite que
deberían revisarse al migrar:

| Dependencia actual (Vite) | Equivalente en Next.js | Esfuerzo estimado |
|---------------------------|------------------------|--------------------|
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` | Bajo — find & replace + revisar build-time vs runtime |
| React Router (`createBrowserRouter`) | App Router de Next.js (`app/`) | Alto — la estructura de carpetas de rutas cambia completamente |
| `ProtectedRoute` / `AdminOnlyRoute` (guards client-side) | Middleware de Next.js (`middleware.ts`, edge) | Medio — la protección de rutas se puede mover al servidor |
| CSP y headers de seguridad configurados en el hosting (Nginx/Vercel/Netlify) | `next.config.ts` → `headers()` | Bajo — Next.js centraliza esto en el framework |
| `next-themes` | Sin cambios — ya es compatible con Next.js | Ninguno |
| Code splitting por feature vía `React.lazy` | Server Components + streaming | Alto — replantear qué se renderiza en servidor |

**Conclusión**: la migración es viable pero no trivial, principalmente por el cambio de modelo
de routing y de protección de rutas. No se recomienda anticipar esta migración con abstracciones
extra "por si acaso" — eso añade complejidad innecesaria hoy a cambio de un beneficio hipotético.

---

## 10. Documentación Viva

- **Componentes reutilizables**: catalogados en [[WEB_COMPONENTS]]. Si se adopta Storybook más
  adelante (ver [[WEB_DEVELOPMENT_GUIDE]] §7), cada componente de `src/components/shared/` y
  `src/components/ui/` debe tener su archivo `.stories.tsx` junto al componente.
- **README por feature**: cada carpeta en `src/features/<modulo>/` debe tener un `README.md`
  breve (3-5 líneas) describiendo qué hace el módulo y qué endpoints consume — evita que el
  agente tenga que inferir el propósito leyendo todos los archivos.
