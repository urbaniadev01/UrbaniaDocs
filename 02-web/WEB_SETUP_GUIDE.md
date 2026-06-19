---
title: WEB_SETUP_GUIDE
type: guia-inicializacion
tags: [urbania-web, setup, sesion-0]
status: vigente
ultima_revision: 2026-06-17
---

# 🚀 WEB_SETUP_GUIDE
## Inicialización del Proyecto — Cliente Web Urbania

> [!important]
> Seguir en orden. Este documento se consulta una sola vez, al inicio de la Sesión 1 de
> [[WEB_IMPLEMENTATION_PLAN]]. Para el stack completo y la justificación de cada elección, ver
> [[WEB_ARCHITECTURE]] §2 y §8 (ADRs).

---

## 1. Prerrequisitos

- Node.js ≥ 20.19 o ≥ 22.12 (requerido por Vite 7 — Node 18 llegó a EOL en abril 2025)
- pnpm ≥ 9.x (`corepack enable` o `npm i -g pnpm`)
- Urbania API REST corriendo en `http://localhost:8080`
- Acceso a `API_CONTRACT.md` del repositorio del API

```bash
node -v   # ≥ v20.19 o ≥ v22.12
pnpm -v   # ≥ 9
curl http://localhost:8080/api/v1/health
```

---

## 2. Crear el Proyecto

```bash
pnpm create vite@latest urbania-web -- --template react-ts
cd urbania-web
pnpm install
```

---

## 3. Instalar Dependencias

### 3.1 Routing y estado de servidor

```bash
pnpm add react-router @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools
```

### 3.2 Cliente HTTP

```bash
pnpm add axios
```

### 3.3 Estado de cliente

```bash
pnpm add zustand
```

### 3.4 Formularios y validación

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

### 3.5 Tablas

```bash
pnpm add @tanstack/react-table
```

### 3.6 Estilos y UI

```bash
pnpm add tailwindcss @tailwindcss/vite
pnpm add lucide-react class-variance-authority clsx tailwind-merge
pnpm add next-themes   # framework-agnóstico — funciona en Vite, ver WEB_VISUAL_STANDARDS §14
pnpm dlx shadcn@latest init
```

Durante `shadcn init`, seleccionar:
- Style: `new-york` (o `default`, según preferencia visual — documentar la elección en
  [[WEB_VISUAL_STANDARDS]] §1 si difiere de lo ya definido)
- Base color: el que se aproxime a la paleta `primary` de [[WEB_VISUAL_STANDARDS]] §2
- CSS variables: **sí** (obligatorio para soportar modo oscuro vía clase `.dark`)

### 3.7 Tiempo real (chat — Sesión 8)

```bash
pnpm add laravel-echo pusher-js
```

### 3.8 Sanitización

```bash
pnpm add dompurify
pnpm add -D @types/dompurify
```

### 3.9 Testing

```bash
pnpm add -D vitest @vitest/coverage-v8 jsdom
pnpm add -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
pnpm add -D msw
pnpm add -D @playwright/test
pnpm exec playwright install --with-deps chromium
```

### 3.10 Calidad de código

```bash
pnpm add -D eslint @eslint/js typescript-eslint
pnpm add -D eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-jsx-a11y
pnpm add -D @tanstack/eslint-plugin-query
pnpm add -D prettier eslint-config-prettier
```

> [!note] Alternativa Biome
> Si el equipo prefiere una sola herramienta de lint+format (ver ADR-008 en
> [[WEB_ARCHITECTURE]] §8), reemplazar este paso por `pnpm add -D @biomejs/biome` y
> `pnpm exec biome init`. No mezclar ESLint/Prettier con Biome en el mismo proyecto.

### 3.11 Error tracking (opcional para MVP, recomendado antes de producción)

```bash
pnpm add @sentry/react
```

---

## 4. Configurar Tailwind CSS v4

**`src/index.css`** (o `globals.css` dentro de `src/app/`):

```css
@import "tailwindcss";

/* Tokens del design system — ver WEB_VISUAL_STANDARDS.md §2 para la definición completa */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... resto de tokens, ver WEB_VISUAL_STANDARDS.md §2.1 y §2.2 */
}
```

`@tailwindcss/vite` detecta automáticamente todos los archivos de plantilla — no requiere
configurar `content` manualmente como en Tailwind v3.

---

## 5. Path Aliases

Configurar exactamente como en [[WEB_ARCHITECTURE]] §6: `@/*` → `./src/*` en **ambos**
`tsconfig.json` y `vite.config.ts`.

---

## 6. Estructura Inicial de Carpetas

```bash
mkdir -p src/{app/{providers,guards},features,components/{ui,layout,shared},stores,services,lib,types,hooks}
mkdir -p tests/{unit/{lib,stores},components/helpers,e2e,mocks/handlers}
```

Ver el árbol completo y la justificación en [[WEB_ARCHITECTURE]] §4.

---

## 7. Variables de Entorno

Crear tres archivos (ninguno se versiona excepto un `.env.example` de referencia):

**`.env.development`**
```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_ENV=development
VITE_PUSHER_APP_KEY=local-key
VITE_PUSHER_HOST=localhost
VITE_PUSHER_PORT=6001
VITE_PUSHER_SCHEME=http
VITE_PUSHER_CLUSTER=mt1
```

**`.env.production`**
```env
VITE_API_URL=https://api.urbania.com/api/v1
VITE_APP_ENV=production
VITE_PUSHER_APP_KEY=__SET_IN_CI__
VITE_PUSHER_HOST=ws.urbania.com
VITE_PUSHER_PORT=443
VITE_PUSHER_SCHEME=https
VITE_PUSHER_CLUSTER=mt1
```

**`.env.test`** — ver [[WEB_TESTING]] §6 (incluye credenciales de cuentas de prueba, no solo la
URL del API).

> [!warning] Regla de oro
> Solo las variables prefijadas con `VITE_` quedan expuestas al bundle del cliente
> (`import.meta.env.VITE_*`). Nunca poner un secreto real (API keys privadas, credenciales de
> base de datos) detrás de ese prefijo — terminan visibles en el JavaScript servido al navegador.
> Ver [[WEB_ARCHITECTURE]] §7.

---

## 8. Configurar Vitest

**`vite.config.ts`** (sección `test`, o archivo `vitest.config.ts` separado):

```ts
/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      globals: true,
      coverage: {
        provider: 'v8',
        thresholds: {
          // Ver WEB_TESTING.md §4 para el umbral exacto por tipo de test
          lines: 80,
          statements: 80,
        },
      },
    },
  }),
);
```

**`tests/setup.ts`**:
```ts
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 9. Configurar Playwright

Ver [[WEB_TESTING]] §5 para `playwright.config.ts` completo. El `baseURL` apunta al puerto por
defecto de Vite (`5173`), no al `3000` de Next.js.

---

## 10. Scripts de `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "ci": "pnpm type-check && pnpm lint && pnpm test && pnpm build"
  }
}
```

---

## 11. Despliegue: SPA Fallback de Rutas

> [!warning] Diferencia crítica frente a Next.js
> Vite produce una **SPA estática**: un `index.html` + assets, sin servidor Node propio. Cuando
> el navegador navega del lado del cliente (React Router) todo funciona, pero si alguien
> **recarga** la página en `/payments/123` o entra directo por URL, el servidor que sirve los
> archivos estáticos debe redirigir cualquier ruta desconocida a `index.html` (para que React
> Router la resuelva en el cliente). Esto **no es automático** salvo en `vite dev`/`vite preview`.
> Configurar según el hosting:
>
> - **Nginx**: `try_files $uri $uri/ /index.html;`
> - **Vercel**: archivo `vercel.json` con un rewrite `"source": "/(.*)", "destination": "/index.html"`
> - **Netlify**: archivo `public/_redirects` con `/*  /index.html  200`
>
> Sin esto, cualquier flujo e2e o usuario real que recargue una ruta protegida verá un 404 del
> servidor en producción, aunque funcione perfecto en desarrollo local.

---

## 12. Checklist de Verificación

- [ ] `pnpm dev` levanta el proyecto en `http://localhost:5173`
- [ ] `pnpm type-check` sin errores
- [ ] `pnpm lint` sin warnings
- [ ] `pnpm test` corre (aunque no haya tests aún, no debe fallar la configuración)
- [ ] `pnpm build` genera `dist/` sin errores
- [ ] Alias `@/` resuelve igual en editor, `tsc` y `vite build`
- [ ] Variables `VITE_*` cargan correctamente (`console.log(import.meta.env)` en desarrollo)
- [ ] Continuar con [[WEB_IMPLEMENTATION_PLAN]] → Sesión 1
