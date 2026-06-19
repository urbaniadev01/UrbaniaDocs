---
title: WEB_DEVELOPMENT_GUIDE
type: guia-operativa
tags: [urbania-web, troubleshooting, devops, calidad]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-17
---

# 🔧 WEB_DEVELOPMENT_GUIDE
## Guía de Desarrollo Diario y Troubleshooting

> [!info] Propósito
> Decisiones técnicas del día a día, solución de problemas comunes y convenciones operativas.
> Si encuentras un problema y lo resuelves, documéntalo aquí.

> [!note]
> Los ADRs de arquitectura (stack, herramientas principales) están en [[WEB_ARCHITECTURE]] §8.
> Este documento contiene decisiones técnicas de implementación, más granulares que los ADRs,
> junto con troubleshooting operativo y las especificaciones de DevOps y calidad de código.

---

## 1. Flujo de Trabajo por Sesión

### Al inicio de cada sesión

```bash
# 1. Verificar que la API está corriendo
curl http://localhost:8080/api/v1/health

# 2. Verificar estado real del proyecto (no confiar solo en el manifest)
pnpm type-check
pnpm test

# 3. Revisar WEB_SESSION_MANIFEST.md
# Si hay discrepancias entre el manifest y el estado real, reportar antes de continuar
```

### Durante la sesión

1. **Scope lock**: No implementar funcionalidades de otras sesiones
2. **Type-first**: Definir tipos TypeScript antes de implementar el servicio o hook
3. **MSW-first para tests**: Crear el handler MSW antes del test del componente
4. **Verificar API_CONTRACT.md** antes de implementar cualquier integración nueva

### Al final de cada sesión

```bash
# Verificar calidad completa
pnpm ci    # type-check + lint + test + build

# Actualizar WEB_SESSION_MANIFEST.md
# Commit: "[Sesión N] feat: descripción breve"
```

> [!warning] Regla
> Si `pnpm ci` falla, no marcar el módulo como completado. Documentar el fallo en la sección
> "Bloqueos" del manifest ([[WEB_SESSION_MANIFEST]]).

---

## 2. Comandos Frecuentes

```bash
# Desarrollo
pnpm dev                   # Servidor de desarrollo Vite (HMR nativo)

# Calidad
pnpm type-check            # TypeScript sin errores (tsc --noEmit)
pnpm lint                  # ESLint
pnpm lint:fix              # ESLint con auto-fix
pnpm format                # Prettier

# Tests
pnpm test                  # Vitest (unit + component)
pnpm test:watch            # Vitest en modo watch
pnpm test:coverage         # Con reporte de cobertura
pnpm test:e2e              # Playwright
pnpm test:e2e:ui           # Playwright con UI interactiva

# CI completo
pnpm ci                    # type-check + lint + test + build

# shadcn/ui
pnpm dlx shadcn@latest add [componente]   # Añadir componente

# Verificar dependencias desactualizadas
pnpm outdated

# Análisis de bundle (ver §5.2)
pnpm build:analyze
```

---

## 3. Troubleshooting Común

### Problema: Silent refresh en bucle infinito
**Síntoma**: El interceptor llama a `/auth/refresh` repetidamente hasta timeout.
**Causa**: El endpoint `/auth/refresh` también devuelve 401, disparando el interceptor de nuevo.
**Solución**: El interceptor tiene una guarda explícita:
```ts
if (original.url?.includes('/auth/refresh')) {
  return Promise.reject(error); // No reintentar en refresh
}
```
Si el bucle persiste, verificar que `silentRefresh()` en `auth.service.ts` usa `axios` directo
(sin interceptores) y NO `apiClient`. Ver [[WEB_AUTH_IMPLEMENTATION]] §3.

---

### Problema: Cookie `refresh_token` no se envía con la request
**Síntoma**: La request a `/auth/refresh` devuelve 401 aunque el admin acaba de iniciar sesión.
**Causa**: Falta `withCredentials: true`.
**Solución**:
- En `apiClient`: configuración base tiene `withCredentials: true` ✓
- En `silentRefresh()`: el axios directo también debe tener `{ withCredentials: true }` ✓
- Verificar en DevTools → Application → Cookies que la cookie existe con nombre exacto `refresh_token`

---

### Problema: Variables de entorno no se cargan (`undefined` en runtime)
**Síntoma**: `import.meta.env.VITE_API_URL` es `undefined` en el cliente.
**Causa**: Vite solo expone al cliente las variables de entorno con prefijo `VITE_`. Una
variable como `API_URL` (sin el prefijo) queda fuera del bundle por diseño — es una medida de
seguridad para evitar filtrar secretos del servidor al navegador.
**Solución**: Renombrar la variable a `VITE_API_URL` en el archivo `.env.*` correspondiente y
reiniciar `pnpm dev` (Vite no recarga variables de entorno en caliente). Ver
[[WEB_SETUP_GUIDE]] §7 para la plantilla de archivos `.env`.

---

### Problema: 404 al recargar la página en una ruta anidada (p. ej. `/payments/123`)
**Síntoma**: Navegar a `/payments` y hacer clic en un link funciona, pero recargar el navegador
directamente en `/payments/123` o escribir esa URL muestra un 404 del servidor de hosting.
**Causa**: Una SPA de Vite no tiene rutas en el servidor — `index.html` es el único archivo que
existe físicamente. Sin una regla de *rewrite*, el servidor busca un archivo `payments/123` que
no existe.
**Solución**: Configurar el fallback a `index.html` en la capa de hosting. Ver
[[WEB_SETUP_GUIDE]] §11 para ejemplos completos (Nginx `try_files`, Vercel `rewrites`, Netlify
`_redirects`). Este NO es un problema que se resuelva en el código de React Router.

---

### Problema: Errores de CORS en desarrollo local
**Síntoma**: La consola del navegador muestra `blocked by CORS policy` al llamar a la API desde
`pnpm dev` (`http://localhost:5173`).
**Causa**: La API en `http://localhost:8080` no incluye `http://localhost:5173` en sus headers
`Access-Control-Allow-Origin`, o el navegador bloquea la preflight request.
**Solución preferida**: Configurar un proxy de desarrollo en `vite.config.ts` para que las
llamadas a `/api/*` se redirijan internamente sin cruzar orígenes:
```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```
Si se usa el proxy, `VITE_API_URL` en `.env.development` debe apuntar a `/api` (ruta relativa)
en lugar de `http://localhost:8080/api/v1`. Alternativa: configurar CORS correctamente en la
API para el entorno de desarrollo — preferible si varios clientes comparten la misma API.

---

### Problema: `success`/`warning`/`info` no son variantes válidas en Badge
**Síntoma**: Error de TypeScript al usar `<Badge variant="success">`.
**Causa**: shadcn/ui Badge no incluye estas variantes por defecto.
**Solución**: Seguir [[WEB_VISUAL_STANDARDS]] §2.4 para extender el componente Badge.
Verificar que `src/components/ui/badge.tsx` tiene las variantes custom.

---

### Problema: Componente shadcn/ui no aplica estilos correctamente
**Síntoma**: Un componente aparece sin estilos o con estilos del navegador.
**Causa**: En Tailwind v4, el escaneo de clases es automático (zero-config) — no hay un array
`content` que pueda estar mal configurado. Las causas más comunes en su lugar son: el archivo
`src/index.css` no se importa desde `src/main.tsx`, o falta `@import "tailwindcss";` al inicio
del archivo CSS.
**Solución**: Verificar que `src/main.tsx` incluye `import './index.css';` y que
`vite.config.ts` registra el plugin `@tailwindcss/vite`. Ver [[WEB_SETUP_GUIDE]] §5.

---

### Problema: Echo/WebSocket no se reconecta después de silent refresh
**Síntoma**: El chat deja de recibir mensajes en tiempo real después de que el token se renueva.
**Causa**: La instancia de Echo se creó con el token viejo.
**Solución**: `silentRefresh()` en `auth.service.ts` debe llamar a `reconnectEcho()` después de
actualizar el store. Ver [[WEB_API_CLIENT]] §9.

---

### Problema: MSW no intercepta requests en tests de componentes
**Síntoma**: Los tests hacen requests reales al API (o fallan con `NetworkError`).
**Causa**: El server de MSW no está iniciado o el handler no coincide con la URL.
**Diagnóstico**:
```ts
// En tests/setup.ts, cambiar 'warn' a 'error' para detectar requests no interceptadas
server.listen({ onUnhandledRequest: 'error' });
```

---

### Problema: Build falla en CI por falta de variables de entorno
**Síntoma**: `vite build` falla, o el bundle generado llama a una API en `undefined/api/v1`.
**Causa**: Las variables `VITE_*` no están disponibles en el entorno de CI. A diferencia de un
servidor Next.js, Vite **incrusta** las variables `VITE_*` en el bundle estático durante el
build — si no existen en ese momento, quedan vacías permanentemente en los archivos generados
(no hay forma de inyectarlas después, a diferencia de variables de servidor).
**Solución**: Agregar las variables como secrets/variables del pipeline de CI (ver §5.3,
ejemplo de GitHub Actions) y exportarlas en el paso de build. Verificar con
`echo $VITE_API_URL` en un paso previo si el problema persiste.

---

## 4. Convenciones Operativas

### Commits

```
[Sesión N] feat: descripción breve
[Sesión N] fix: descripción del fix
[Sesión N] test: añadir tests para X
[Sesión N] docs: actualizar WEB_SESSION_MANIFEST.md
[Sesión N] chore: actualizar dependencias
```

### Cuándo crear un nuevo tipo en `src/features/<modulo>/types/` (o `src/types/` si es transversal)

- Si el tipo se usa en más de un archivo
- Si es una respuesta del API (siempre tipada)
- Si es el estado de un formulario complejo

### Cuándo usar `any` (respuesta: nunca)

Si TypeScript no infiere el tipo, investigar la causa. Opciones:
- Añadir tipos genéricos: `ApiResponse<Payment>`
- Usar type guards: `if ('error' in response)`
- Usar `unknown` + aserción tipada con validación Zod

### Manejo de fechas

El API devuelve fechas en ISO 8601 UTC. En el cliente:
```ts
// Mostrar al usuario en zona local colombiana
const formatted = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
}).format(new Date(isoString));

// Enviar al API siempre en ISO 8601
const isoDate = new Date(date).toISOString();
```

### Manejo de montos en pesos colombianos

```ts
// src/lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
// Resultado: "$350.000"
```

---

## 5. DevOps y Despliegue

> [!important] Cobertura de checklist
> Esta sección especifica variables de entorno, optimización de build, CI/CD y monitoreo —
> puntos sin especificación técnica explícita en la versión anterior de la documentación.

### 5.1 Variables de Entorno

Tres archivos en la raíz del proyecto, todos con prefijo `VITE_` para cualquier variable que el
cliente deba leer (ver [[WEB_SETUP_GUIDE]] §7 para las plantillas completas):

| Archivo | Uso | Versionado en git |
|---------|-----|---------------------|
| `.env.development` | Valores para `pnpm dev` (API local) | Sí |
| `.env.production` | Valores de referencia para build de producción | Sí, sin secretos reales |
| `.env.test` | Valores para Vitest/Playwright | Sí |
| `.env.local` | Overrides locales de cualquiera de los anteriores | **No** (`.gitignore`) |

> [!warning]
> Ninguna variable verdaderamente secreta (API keys de servicios de pago, tokens privados) debe
> vivir en variables `VITE_*` — quedan visibles en el bundle JS final, legible por cualquiera.
> `VITE_*` es para configuración pública (URLs de API, claves públicas de Pusher, etc.).

### 5.2 Build Optimizada

- **Code splitting por ruta**: cada página de feature se importa con `React.lazy()` en
  `src/app/router.tsx`, no de forma estática. Esto genera un chunk JS independiente por feature
  que el navegador descarga solo cuando el admin navega a esa sección.
  ```tsx
  const PaymentsPage = lazy(() => import('@/features/payments/pages/PaymentsPage'));
  ```
- **Tree shaking**: automático en Vite/Rollup para ESM — no requiere configuración, pero
  depende de que las librerías usadas exporten ESM (la mayoría del stack elegido lo hace).
- **Análisis de bundle**: usar `rollup-plugin-visualizer` para detectar dependencias
  inesperadamente pesadas:
  ```bash
  pnpm add -D rollup-plugin-visualizer
  ```
  ```ts
  // vite.config.ts
  import { visualizer } from 'rollup-plugin-visualizer';

  export default defineConfig({
    plugins: [
      // ...otros plugins
      visualizer({ filename: './dist/stats.html', gzipSize: true }),
    ],
  });
  ```
  ```json
  // package.json
  { "scripts": { "build:analyze": "vite build && open dist/stats.html" } }
  ```

### 5.3 CI/CD

Pipeline de GitHub Actions de referencia — ajustar el runner/secrets según el proveedor real:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm test:coverage
      - run: pnpm build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_PUSHER_APP_KEY: ${{ secrets.VITE_PUSHER_APP_KEY }}

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

  deploy:
    needs: [quality, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Paso de deploy específico del proveedor de hosting (Vercel/Netlify/Nginx
      # vía rsync+ssh, etc.) — ver WEB_SETUP_GUIDE §11 para el fallback de SPA routing
      # que el hosting elegido debe tener configurado.
```

> [!tip]
> Los jobs `quality` y `e2e` corren en paralelo a `deploy`-dependiente; `deploy` solo se ejecuta
> en `main` y después de que ambos pasen. Adaptar el paso final según si el hosting es Vercel
> (deploy automático por integración de Git, este job podría no ser necesario), Netlify
> (similar), o un servidor propio con Nginx.

### 5.4 Monitoreo (Sentry)

Recomendado antes de pasar a producción, opcional durante desarrollo activo:

```bash
pnpm add @sentry/react
```

```ts
// src/main.tsx — antes de montar la app
import * as Sentry from '@sentry/react';

if (import.meta.env.MODE === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE,
  });
}
```

Envolver el árbol raíz con `Sentry.ErrorBoundary` o usar `Sentry.withErrorBoundary` sobre el
`ErrorBoundary` ya definido en [[WEB_COMPONENTS]] §4 para que los errores de renderizado no
capturados también se reporten.

---

## 6. Calidad de Código y Tooling

### 6.1 ESLint (flat config, ESLint 9)

```js
// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import queryPlugin from '@tanstack/eslint-plugin-query';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@tanstack/query': queryPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react-hooks/exhaustive-deps': 'error',
      '@tanstack/query/exhaustive-deps': 'error',
    },
  },
);
```

> [!note] Por qué ESLint en lugar de Biome
> Ver ADR-008 en [[WEB_ARCHITECTURE]] §8: se prioriza ESLint por su ecosistema de plugins más
> maduro para este proyecto (`jsx-a11y` para accesibilidad, `@tanstack/eslint-plugin-query` para
> reglas específicas de TanStack Query). Biome queda documentado como alternativa válida si en
> el futuro se prioriza velocidad de lint sobre cobertura de reglas.

### 6.2 Prettier

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

Integrado en CI dentro del job `quality` (§5.3) vía `pnpm lint`, que debe incluir
`eslint-config-prettier` para evitar conflictos de reglas entre ambas herramientas.

### 6.3 TypeScript Strict Mode

```jsonc
// tsconfig.json (fragmento relevante)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Ver [[WEB_ARCHITECTURE]] §6 para la configuración completa de path aliases (`@/components`,
`@/lib`, `@/features`, etc.) y su contraparte en `vite.config.ts`.

### 6.4 pnpm

El proyecto es un único paquete (no monorepo) — no se requieren `pnpm-workspace.yaml` por
ahora. Si en el futuro se separan apps (p. ej. un paquete de tipos compartido con un backend
TypeScript), evaluar migrar a workspaces en ese momento. El `pnpm-lock.yaml` se versiona en git
y se auditan vulnerabilidades con `pnpm audit` periódicamente.

---

## 7. Escalabilidad y Mantenimiento

> [!note]
> Esta sección complementa los principios de estructura ya definidos en [[WEB_ARCHITECTURE]]
> §3 (separación de estado) y §3.2-§3.3 (feature-based structure, code splitting). Aquí se
> cubren las prácticas de documentación viva y el path de migración futura.

### 7.1 Documentación Viva: Storybook y READMEs

- **Storybook** (recomendado, no bloqueante para el MVP): instalar para los componentes de
  `src/components/ui/` y `src/components/shared/` — son los que más se reutilizan entre
  features y más se benefician de un catálogo visual navegable. No es necesario crear stories
  para componentes específicos de una sola feature.
  ```bash
  pnpm dlx storybook@latest init
  ```
- **README por feature**: cada carpeta `src/features/<modulo>/` incluye un `README.md` breve
  (3-5 líneas) describiendo qué endpoints consume, qué hooks expone y cualquier decisión no
  obvia. Esto evita que el contexto de una feature dependa únicamente de la memoria del agente
  entre sesiones.

### 7.2 Migración Futura a Next.js / SSR

Ver la tabla de dependencias de migración completa en [[WEB_ARCHITECTURE]] §9. En resumen: si
en algún momento el proyecto necesita SSR (p. ej. una landing pública con SEO, o renderizado
inicial más rápido en redes lentas), la estructura feature-based actual minimiza el costo de
esa migración porque la lógica de negocio (hooks, servicios, schemas Zod) es independiente del
router y no necesita reescribirse — solo las páginas y el árbol de routing.

---

## 8. Decisiones Técnicas Registradas

> [!note]
> Los ADRs de arquitectura (stack, herramientas principales) están en [[WEB_ARCHITECTURE]] §8.
> Este registro cubre decisiones de implementación más granulares.

| # | Decisión | Contexto | Sesión |
|---|----------|----------|--------|
| DTW-001 | No usar `next-auth` | El API tiene JWT propio con cookies httpOnly. Adicionalmente, `next-auth` es específico de Next.js y el proyecto no usa Next.js — la decisión aplica con doble motivo. | Sesión 0 |
| DTW-002 | Access token en Zustand (memoria) | Resistencia a XSS. `localStorage` y `sessionStorage` son accesibles por JS inyectado. | Sesión 0 |
| DTW-003 | MSW handlers base = solo happy path | Un array con handler exitoso Y handler de error hace que el error nunca se ejecute (MSW usa el primero que coincide). Los errores se testean con `server.use()` por test. | Sesión 0 |
| DTW-004 | `silentRefresh()` centralizado en `auth.service.ts` | Tanto el interceptor de Axios como el bootstrap del layout protegido necesitan hacer refresh. Centralizar evita duplicación y garantiza que ambos usen la misma lógica y token. | Sesión 0 |
| DTW-005 | `reconnectEcho()` después de cada silent refresh | La instancia de Echo guarda headers en su configuración interna. Al cambiar el access token, la instancia antigua usa el token expirado en autenticación de canales privados. | Sesión 0 |
| DTW-006 | Badge variantes custom en `badge.tsx` | shadcn/ui Badge no incluye `success`, `warning`, `info`, `muted`. Se extienden en el componente copiado al repo. Los valores siguen los tokens de [[WEB_VISUAL_STANDARDS]]. | Sesión 0 |
| DTW-007 | `next-themes` para modo oscuro | Gestiona la clase `.dark` en `<html>` con persistencia en localStorage y sincronización con preferencia del sistema. Es framework-agnóstico pese al nombre — funciona igual en Vite (ver [[WEB_VISUAL_STANDARDS]] §14). | Sesión 2 |
| DTW-008 | `keepPreviousData` en toda tabla paginada | Sin él, cada cambio de página en `DataTable` muestra el skeleton completo en vez de mantener la tabla anterior visible. Ver [[WEB_COMPONENTS]] §10.2. | Sesión 0 |

> Agregar nuevas decisiones aquí cuando se tomen durante el desarrollo.
