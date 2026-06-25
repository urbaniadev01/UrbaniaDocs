---
title: WEB_TESTING
type: testing
tags: [urbania-web, testing, vitest, playwright, msw]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-25
---

# 🧪 WEB_TESTING
## Especificaciones de Pruebas - Cliente Web Urbania

> [!important] Propósito
> Documento único de verdad para todas las pruebas del cliente web.

> [!warning] Regla
> Si no está documentado aquí, no se prueba. Si se prueba, debe estar aquí.

---

## 1. Estructura de Tests

```
tests/
├── setup.ts                      # Configuración global (MSW, jest-dom)
├── unit/                         # Funciones utilitarias y lógica pura
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── validators.test.ts
│   └── stores/
│       └── auth.store.test.ts
├── components/                   # Tests de componentes con Testing Library
│   ├── helpers/
│   │   └── TestProviders.tsx     # QueryClient + MemoryRouter
│   ├── auth/
│   │   ├── LoginForm.test.tsx
│   │   └── MfaVerifyForm.test.tsx
│   ├── payments/
│   │   └── PaymentTable.test.tsx
│   ├── shared/
│   │   ├── DataTable.test.tsx
│   │   ├── StatusBadge.test.tsx
│   │   └── ConfirmDialog.test.tsx
│   └── dashboard/
│       └── StatsCard.test.tsx
├── e2e/                          # Tests Playwright (flujos completos)
│   ├── auth.spec.ts
│   ├── payments.spec.ts
│   ├── pqr.spec.ts
│   └── residents.spec.ts
└── mocks/
    ├── server.ts
    └── handlers/
        ├── auth.handlers.ts       # Solo handlers del happy path (respuesta exitosa)
        ├── payments.handlers.ts
        ├── residents.handlers.ts
        └── ...
```

---

## 2. Tipos de Tests y Reglas

### 2.1 Tests Unitarios (`tests/unit/`)

**Qué testear**: Funciones puras — utilidades, validadores, lógica de stores.

**Reglas:**
- Sin renderizado de componentes
- Sin llamadas reales a la API
- Cobertura mínima: **90%**

```ts
// tests/unit/lib/validators.test.ts
import { describe, it, expect } from 'vitest';
import { passwordSchema, emailSchema } from '@/lib/validators';

describe('passwordSchema', () => {
  it('rechaza contraseñas sin mayúscula', () => {
    const result = passwordSchema.safeParse('password123!');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('mayúscula');
  });

  it('acepta contraseña válida', () => {
    const result = passwordSchema.safeParse('Password123!');
    expect(result.success).toBe(true);
  });
});
```

---

### 2.2 Tests de Componentes (`tests/components/`)

**Qué testear**: Componentes React de forma aislada con MSW para simular la API.

**Reglas:**
- Usar `@testing-library/react` con `userEvent`
- Testear COMPORTAMIENTO, no implementación
- Los handlers base del MSW cubren el happy path
- Para testear errores, usar `server.use()` dentro del test para sobreescribir el handler
- Para componentes que usan hooks de React Router (`useNavigate`, `useLocation`, `<Link>`),
  envolver con `MemoryRouter` en lugar de mockear el módulo completo — produce un test más
  realista y evita que el mock se desincronice si cambia la API del router
- Cobertura mínima: **80%**

```tsx
// tests/components/auth/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { TestProviders } from '../helpers/TestProviders';

describe('LoginForm', () => {
  it('redirige al dashboard con credenciales válidas', async () => {
    // El handler base de MSW ya responde con éxito — no necesita override.
    // La navegación se verifica por la URL resultante dentro del MemoryRouter de
    // TestProviders, no mockeando react-router (ver §2.2 TestProviders más abajo).
    render(<LoginForm />, { wrapper: TestProviders });

    await userEvent.type(screen.getByLabelText('Email'), 'admin@urbania.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin2026!');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByTestId('current-location').textContent).toBe('/dashboard');
    });
  });

  it('muestra error para credenciales inválidas', async () => {
    // Sobreescribir el handler base para este test específico
    server.use(
      http.post('*/auth/login', () =>
        HttpResponse.json(
          { error: { code: 'INVALID_CREDENTIALS', message: 'Las credenciales proporcionadas son incorrectas', trace_id: 'test' } },
          { status: 401 }
        )
      )
    );
    // server.resetHandlers() en afterEach (configurado en setup.ts) restaura el handler original

    render(<LoginForm />, { wrapper: TestProviders });

    await userEvent.type(screen.getByLabelText('Email'), 'admin@urbania.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(
        screen.getByText('Las credenciales proporcionadas son incorrectas')
      ).toBeInTheDocument();
    });
  });

  it('deshabilita el botón durante el login', async () => {
    render(<LoginForm />, { wrapper: TestProviders });

    await userEvent.type(screen.getByLabelText('Email'), 'admin@urbania.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Admin2026!');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(screen.getByRole('button', { name: /iniciando/i })).toBeDisabled();
  });
});
```

### Helper `TestProviders`

```tsx
// tests/components/helpers/TestProviders.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router';
import { ReactNode, useState } from 'react';

// Crear un QueryClient nuevo para cada test evita contaminación entre tests
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

// Expone la ruta actual en el DOM para que los tests puedan verificar redirecciones
// sin acoplarse a la implementación interna de useNavigate.
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="current-location" style={{ display: 'none' }}>{location.pathname}</div>;
}

export function TestProviders({
  children,
  initialEntries = ['/login'],
}: {
  children: ReactNode;
  initialEntries?: string[];
}) {
  // useState para que sea estable durante el render del test
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <LocationProbe />
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
}
```

> [!tip] Por qué `MemoryRouter` y no mockear `react-router`
> Mockear `useNavigate` con `vi.mock('react-router', ...)` exige reescribir el mock cada vez
> que cambia cómo el componente navega internamente, y no detecta errores de configuración de
> rutas. `MemoryRouter` ejecuta el código real de React Router en memoria — el test verifica el
> resultado observable (la URL cambió) en lugar de una llamada a función interna.

---

### 2.3 Tests E2E (`tests/e2e/`)

**Qué testear**: Flujos completos de usuario contra el API real (entorno local o staging).

**Reglas:**
- Usar Playwright
- Ejecutar contra `http://localhost:5173` (puerto por defecto del servidor de desarrollo de
  Vite) con la Urbania API en `localhost:8080`
- **La sesión de auth vive 100% en memoria** (Zustand store sin persistencia en cookies/localStorage).
  Recargar la página pierde el estado → el guard de ruta falla el silentRefresh → redirect a `/login`.
  Para simular expiración de sesión en tests: `page.goto()` fuerza recarga completa.
- Si en el futuro se migra la sesión a cookies, usar `context.clearCookies()` de Playwright
  en lugar de manipular `window.*`
- Cobertura: **100% de los flujos críticos listados**

```ts
// tests/e2e/auth.spec.ts — versión real implementada (2026-06-25)
// Selectores verificados contra el código real (no hay data-testid en auth).
// La sesión es 100% en memoria (Zustand) — no usa cookies.
// Flujos pendientes (logout, role=user, MFA) marcados con test.skip documentado.
import { test, expect } from '@playwright/test';
import { TEST_CREDENTIALS } from './fixtures';

const { admin } = TEST_CREDENTIALS;

test.describe('Autenticación', () => {
  test('1. Login válido → redirige al dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill(admin.email);
    await page.locator('#password').fill(admin.password);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('2. Login inválido → muestra mensaje de error en el formulario', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#email').fill('noexiste@urbania.com');
    await page.locator('#password').fill('WrongPass123!');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL('/login');
  });

  test('3. Ruta protegida sin sesión → redirige a /login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login', { timeout: 10_000 });
  });

  test('4. Sesión expirada (recarga de página) → redirige a /login', async ({ page }) => {
    // Login exitoso
    await page.goto('/login');
    await page.locator('#email').fill(admin.email);
    await page.locator('#password').fill(admin.password);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });

    // Recargar página pierde el estado en memoria (Zustand) →
    // DashboardLayout intenta silentRefresh → falla → redirect a /login
    await page.goto('/payments');
    await expect(page).toHaveURL('/login', { timeout: 10_000 });
  });

  // ─── PENDIENTES ──────────────────────────────────────────────────────
  test.skip('5. Logout', async () => {
    // TODO: No hay botón de logout en el UI todavía (useLogout existe pero no conectado).
  });

  test.skip('6. Role=user rechazado', async () => {
    // TODO: Requiere cuenta de residente en la API de desarrollo.
  });

  test.skip('7. Flujo MFA completo', async () => {
    // TODO: Requiere cuenta con MFA activo y secreto TOTP conocido.
  });
});
```

---

## 3. Handlers MSW por Módulo

> [!danger] Regla crítica
> Los handlers base en `tests/mocks/handlers/*.ts` solo cubren el **happy path** (respuesta
> exitosa). Para simular errores o estados alternativos, usar `server.use()` dentro del test
> específico. `afterEach(() => server.resetHandlers())` en `setup.ts` restaura los handlers
> base automáticamente.
>
> **¿Por qué?** MSW usa el primer handler que coincide. Si hay dos handlers para el mismo
> método+URL en el array base, el segundo nunca se ejecuta.

```ts
// tests/mocks/handlers/auth.handlers.ts — SOLO happy path
import { http, HttpResponse } from 'msw';

export const authHandlers = [
  // Login exitoso (happy path)
  http.post('*/auth/login', () => {
    return HttpResponse.json({
      data: {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 900,
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Admin Urbania',
          email: 'admin@urbania.com',
          role: 'admin',
          status: 'active',
          mfa_enabled: false,
          phone: null,
          unit: null,
          avatar_url: null,
        },
      },
      meta: { trace_id: 'test-trace-id' },
    });
  }),

  // Refresh exitoso
  http.post('*/auth/refresh', () => {
    return HttpResponse.json({
      data: { access_token: 'new-mock-jwt-token', expires_in: 900 },
      meta: { trace_id: 'test-trace-id' },
    });
  }),

  // GET /auth/me
  http.get('*/auth/me', () => {
    return HttpResponse.json({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Admin Urbania',
        email: 'admin@urbania.com',
        role: 'admin',
        status: 'active',
        mfa_enabled: false,
        phone: null,
        unit: null,
        avatar_url: null,
      },
      meta: { trace_id: 'test-trace-id' },
    });
  }),
];
```

```ts
// Ejemplo de test con override de error
it('muestra toast de error cuando el servidor falla', async () => {
  server.use(
    http.post('*/payments', () =>
      HttpResponse.json(
        { error: { code: 'INTERNAL_ERROR', message: 'Error del servidor', trace_id: 'test' } },
        { status: 500 }
      )
    )
  );
  // ... resto del test
  // server.resetHandlers() en afterEach restaura el handler base automáticamente
});
```

```ts
// tests/mocks/handlers/payments.handlers.ts — SOLO happy path
import { http, HttpResponse } from 'msw';

export const paymentsHandlers = [
  http.get('*/payments', () => {
    return HttpResponse.json({
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          amount: 350000,
          status: 'pending',
          due_date: '2026-07-01T00:00:00Z',
          resident: { id: '...', name: 'Juan Pérez', unit: 'Apto 101' },
          created_at: '2026-06-01T00:00:00Z',
        },
      ],
      meta: {
        trace_id: 'test',
        current_page: 1,
        per_page: 20,
        total: 1,
        last_page: 1,
      },
    });
  }),

  http.post('*/payments', () => {
    return HttpResponse.json({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        amount: 350000,
        status: 'pending',
        due_date: '2026-07-01T00:00:00Z',
        resident: { id: '...', name: 'Juan Pérez', unit: 'Apto 101' },
        created_at: '2026-06-01T00:00:00Z',
      },
      meta: { trace_id: 'test' },
    });
  }),
];
```

---

## 4. Cobertura Mínima Requerida

| Tipo | Umbral |
|------|--------|
| Tests unitarios (lib, stores) | ≥ 90% |
| Tests de componentes | ≥ 80% |
| Flujos e2e críticos | 100% (lista definida) |

### Flujos E2E críticos (obligatorios)

- [x] Login con credenciales válidas
- [ ] Login con MFA (TOTP) — pendiente: requiere seed data en API
- [x] Login fallido (credenciales inválidas — mensaje de error en form)
- [ ] Login de usuario con role 'user' — debe ser rechazado — pendiente: requiere cuenta residente en API
- [x] Sesión expirada → redirect a login (por recarga de página; sesión en memoria Zustand)
- [ ] Logout manual → redirect a login + no puede volver al dashboard — pendiente: no hay botón de logout en UI todavía
- [ ] Crear pago de administración
- [ ] Cambiar estado de pago (pendiente → pagado)
- [ ] Cambiar estado de PQR
- [ ] Registrar ingreso de visitante
- [ ] Ver y revocar sesión activa desde `/settings/security`

---

## 5. Configuración Playwright

Crear `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // Captura de pantalla en fallos
    screenshot: 'only-on-failure',
    // Video en CI para debugging
    video: process.env.CI ? 'retain-on-failure' : 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
```

> [!note]
> `5173` es el puerto por defecto del servidor de desarrollo de Vite. Si se cambia en
> `vite.config.ts` (`server.port`), actualizar también aquí — ambos valores deben coincidir.

---

## 6. Variables de Entorno para Tests

```env
# .env.test (no versionar)
TEST_MFA_SECRET=JBSWY3DPEHPK3PXP   # Secreto TOTP de la cuenta de test con MFA
TEST_ADMIN_EMAIL=admin@urbania.com
TEST_ADMIN_PASSWORD=Admin2026!
TEST_RESIDENT_EMAIL=residente@urbania.com
TEST_RESIDENT_PASSWORD=Resident2026!
```

```ts
// tests/e2e/fixtures.ts — credenciales centralizadas para tests E2E
// Las variables de entorno se heredan del proceso (Playwright las expone en process.env).
// Si se necesita cargar desde .env.test, instalar dotenv (`pnpm add -D dotenv`)
// y descomentar la línea `import 'dotenv/config'` al inicio del archivo.

export const TEST_CREDENTIALS = {
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@urbania.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'Admin2026!',
  },
  resident: {
    email: process.env.TEST_RESIDENT_EMAIL || 'residente@urbania.com',
    password: process.env.TEST_RESIDENT_PASSWORD || 'Resident2026!',
  },
  mfaSecret: process.env.TEST_MFA_SECRET || '',
} as const;
```
