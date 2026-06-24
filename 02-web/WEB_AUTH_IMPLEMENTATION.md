---
title: WEB_AUTH_IMPLEMENTATION
type: especificacion-tecnica
tags: [urbania-web, auth, seguridad, fuente-unica]
status: vigente
fuente_unica: true
ultima_revision: 2026-06-24
---

# 🔐 WEB_AUTH_IMPLEMENTATION
## Implementación de Autenticación JWT en el Cliente Web

> [!important] Propósito
> Define cómo el cliente web gestiona tokens JWT, sesiones y flujos de autenticación. Es la
> fuente única de verdad para auth en el cliente.

> [!note] Relación con el API
> Este documento describe el comportamiento del **cliente**. Los detalles del servidor (claims,
> TTL, rotación) están en [[01-api/API_JWT_IMPLEMENTATION]] — accesible directamente en este vault.

> [!warning] Corrección de stack (2026-06-17)
> La versión anterior de este documento usaba `next/navigation`, `app/(dashboard)/layout.tsx` y
> `next.config.ts` — todo específico de Next.js. El stack real de este proyecto es **Vite +
> React Router**, sin servidor Node propio. Todo el documento ya está actualizado. Ver
> [[WEB_ARCHITECTURE]] §1 para la nota completa.

> [!warning] Corrección crítica de estrategia de tokens (2026-06-24)
> La versión anterior de este documento asumía que el `refresh_token` viajaba en una **cookie
> httpOnly** y que `/auth/refresh` se invocaba con body vacío + `withCredentials: true`. Esto es
> incorrecto: la API retorna el `refresh_token` en el **body** tanto en login como en refresh, y
> espera recibirlo en el **body** de `POST /auth/refresh` — ver [[01-api/endpoints/AUTH]] §1.1 y
> §1.4. Todo el documento ya está actualizado para reflejar el contrato real.

---

## 1. Estrategia de Doble Token en el Cliente

| Token | Cómo llega al cliente | Dónde se guarda | Quién lo gestiona |
|-------|----------------------|-----------------|-------------------|
| **Access Token** (JWT, 15 min) | Body de la respuesta de login/refresh | Memoria: Zustand `auth.store.accessToken` | `useAuthStore` — se pierde al recargar |
| **Refresh Token** (30 días) | Body de la respuesta de login/refresh (`refresh_token`) | Memoria: Zustand `auth.store.refreshToken` | `useAuthStore` — se pierde al recargar |

> [!note] Por qué en memoria y no en cookie httpOnly
> La API devuelve el `refresh_token` en el body (ver [[01-api/endpoints/AUTH]] §1.1 y §1.4) —
> el servidor no establece ninguna cookie. La alternativa segura disponible en el cliente es
> guardarlo en memoria (Zustand). Consecuencia intencional: al recargar la página, ambos tokens
> se pierden y el usuario debe volver a hacer login. Esto es aceptable para un panel
> administrativo donde la seguridad prima sobre la conveniencia.

> [!danger] Nunca hacer esto
> ```ts
> localStorage.setItem('refresh_token', token)   // ❌ Vulnerable a XSS
> sessionStorage.setItem('refresh_token', token) // ❌ Vulnerable a XSS
> document.cookie = `refresh_token=${token}`     // ❌ Accesible por JS = XSS vulnerable
> ```

> [!tip] Siempre hacer esto
> ```ts
> useAuthStore.getState().setTokens(accessToken, refreshToken) // ✅ En memoria — seguro frente a XSS
> ```

---

## 2. Zustand Auth Store

**Ubicación:** `src/stores/auth.store.ts`

```ts
import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken, isAuthenticated: true }),

  setUser: (user) => set({ user }),

  clearSession: () =>
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
}));
```

> [!note] Nota sobre recarga de página
> Al recargar, ambos tokens son `null`. El componente de layout protegido llama a
> `silentRefresh()`, que detecta que no hay `refreshToken` en el store y falla inmediatamente →
> redirige a `/login`. No existe persistencia de Zustand a `localStorage` para este store — es
> intencional (§1). El usuario debe volver a autenticarse tras cada recarga.

---

## 3. Función `silentRefresh` Centralizada

**Ubicación:** `src/features/auth/api/auth.service.ts`

> [!warning] Importante
> Esta función es la **única** forma de renovar el access token. Tanto el interceptor de Axios
> como el bootstrap del layout protegido deben usarla. Nunca llamar a `/auth/refresh`
> directamente con `axios` o `fetch` fuera de esta función.

```ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Renueva el access token enviando el refresh token en el body.
 * La API rota el refresh token en cada uso — ambos tokens se actualizan en el store.
 * Devuelve el nuevo access token o lanza un error si el refresh falló.
 */
export async function silentRefresh(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();

  // Si no hay refresh token en memoria (p.ej. tras recargar la página), falla de inmediato
  // para que el layout protegido redirija al login sin un request innecesario al API.
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    { refresh_token: refreshToken },
  );

  const newAccessToken: string = data.data.access_token;
  const newRefreshToken: string = data.data.refresh_token; // La API rota el refresh token
  useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
  return newAccessToken;
}
```

---

## 4. Cliente Axios: Silent Refresh, Cola de Requests y Rate Limiting

**Ubicación:** `src/services/api-client.ts`

```ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import { silentRefresh } from '@/features/auth/api/auth.service';
import type { ApiErrorResponse } from '@/types/api.types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Necesario para CORS con credenciales (sin efecto sobre el refresh token, que viaja en body)
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 segundos — evitar requests colgados
});

// --- Interceptor de REQUEST: adjunta el access token a cada llamada ---
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Interceptor de RESPONSE: silent refresh en 401 + backoff en 429 ---
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };
    const errorCode = error.response?.data?.error?.code;

    // CRÍTICO: no reintentar en el endpoint de refresh — evita bucle infinito
    if (original.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // --- 429 Rate Limit: backoff exponencial con jitter, máximo 3 reintentos ---
    if (error.response?.status === 429) {
      original._retryCount = (original._retryCount ?? 0) + 1;
      const MAX_RETRIES = 3;

      if (original._retryCount > MAX_RETRIES) {
        return Promise.reject(error);
      }

      const retryAfterHeader = error.response.headers['retry-after'];
      const retryAfterMs = retryAfterHeader
        ? Number(retryAfterHeader) * 1000
        : 2 ** original._retryCount * 1000; // 2s, 4s, 8s
      const jitter = Math.random() * 300;

      await new Promise((resolve) => setTimeout(resolve, retryAfterMs + jitter));
      return apiClient(original);
    }

    // --- 401 TOKEN_EXPIRED: silent refresh con cola de requests pendientes ---
    if (error.response?.status === 401 && errorCode === 'TOKEN_EXPIRED' && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await silentRefresh();

        // Resolver requests encolados con el nuevo token
        pendingRequests.forEach((cb) => cb(newToken));
        pendingRequests = [];

        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        // Refresh falló → sesión expirada completamente
        useAuthStore.getState().clearSession();
        pendingRequests = [];
        // Usar replace para no contaminar el historial de navegación
        window.location.replace('/login');
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Para TOKEN_INVALID o UNAUTHORIZED: limpiar sesión y redirigir
    if (
      error.response?.status === 401 &&
      (errorCode === 'TOKEN_INVALID' || errorCode === 'UNAUTHORIZED')
    ) {
      useAuthStore.getState().clearSession();
      window.location.replace('/login');
    }

    return Promise.reject(error);
  },
);
```

> [!note] Sobre el `typeof window !== 'undefined'` de versiones anteriores
> Ese guard era necesario en Next.js porque el mismo código podía ejecutarse en servidor. En
> este proyecto no hay servidor — `window` siempre existe — por lo que el guard se elimina.

> [!note] ¿Por qué backoff con jitter y no solo el delay fijo?
> El *jitter* (variación aleatoria pequeña) evita que múltiples pestañas/usuarios reintenten
> exactamente al mismo tiempo y vuelvan a saturar el rate limit del API ("efecto manada").

---

## 5. Flujo de Login

**Ubicación:** `src/features/auth/api/auth.service.ts` + `src/features/auth/hooks/use-login.ts`

```ts
// auth.service.ts
export async function login(email: string, password: string) {
  // El API distingue web/móvil por User-Agent (no por campo en el body) — ver [[01-api/API_JWT_IMPLEMENTATION]] §3.3
  const { data } = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', {
    email,
    password,
  });
  return data.data;
}
```

```ts
// use-login.ts
import { useNavigate, useLocation } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { login } from '../api/auth.service';
import type { ApiError } from '@/types/api.types';

export function useLogin() {
  const { setTokens, setUser, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  // Preservar la URL a la que el usuario intentaba acceder antes de ser redirigido a /login
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  return useMutation({
    mutationFn: ({ email, password }: LoginInput) => login(email, password),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      // Verificar el rol ANTES de redirigir — nunca asumir que el login exitoso implica acceso
      if (data.user.role !== 'admin') {
        clearSession();
        throw new Error('Acceso no autorizado. Solo administradores.');
      }
      navigate(returnTo, { replace: true });
    },
    onError: (error: ApiError) => {
      if (error.code === 'MFA_REQUIRED') {
        navigate('/login/mfa', { state: { from: returnTo } });
        return;
      }

      if (error.code === 'FORCE_PASSWORD_CHANGE') {
        // El API retorna 403 con limited_token en error.data (ver [[01-api/endpoints/AUTH]] §1.1)
        // El limited_token solo es válido para POST /auth/change-password
        const limitedToken = error.data?.limited_token as string | undefined;
        navigate('/change-password', {
          state: { limitedToken, from: returnTo },
          replace: true,
        });
        return;
      }
      // Otros errores (INVALID_CREDENTIALS, ACCOUNT_LOCKED, RATE_LIMIT_EXCEEDED) se muestran en el form
    },
  });
}
```

---

## 6. Flujo MFA

Cuando el API responde `401 MFA_REQUIRED` en el login:

```
Flujo TOTP:
1. useLogin detecta error.code === 'MFA_REQUIRED'
2. Redirige a /login/mfa (preservando el returnTo en location.state)
3. El usuario ingresa el código TOTP (6 dígitos)
4. Se llama POST /auth/mfa/verify con { code }   ← solo el código, sin campo 'type'
5. Si válido → API responde con access_token + refresh_token en body + user
6. Llamar setTokens(access_token, refresh_token) en Zustand → verificar role → navigate(returnTo)

Flujo código de respaldo (alternativa al TOTP):
1-2. Igual que TOTP
3. Usuario pulsa "Usar código de respaldo" → campo cambia a 8 dígitos
4. Se llama POST /auth/mfa/verify-backup con { code }   ← ver §6.1
5-6. Igual que TOTP — misma respuesta con access_token + refresh_token en body + user
```

**Pantalla MFA** (`src/features/auth/pages/MfaPage.tsx`, ruta `/login/mfa`):
- Mostrar campo de 6 dígitos con `autoFocus`
- Enlace "Usar código de respaldo" que alterna a un campo de 8 dígitos y llama a `useMfaVerifyBackup()` en lugar de `useMfaVerify()`
- Mensaje de error claro para `MFA_INVALID_CODE`
- Mensaje específico para `MFA_BACKUP_USED`: "Código de respaldo ya utilizado. Prueba otro o regenera tus códigos."
- Auto-submit cuando se completan los 6 (TOTP) o 8 (respaldo) dígitos
- Botón para regresar al login (en caso de querer usar otra cuenta)

### 6.1 Hook `useMfaVerifyBackup`

**Ubicación:** `src/features/auth/hooks/use-mfa-verify-backup.ts`

```ts
export function useMfaVerifyBackup() {
  const { setTokens, setUser, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  return useMutation({
    mutationFn: (code: string) =>
      apiClient
        .post<ApiResponse<LoginResponseData>>('/auth/mfa/verify-backup', { code })
        .then((r) => r.data.data),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      setUser(data.user);
      if (data.user.role !== 'admin') {
        clearSession();
        throw new Error('Acceso no autorizado. Solo administradores.');
      }
      navigate(returnTo, { replace: true });
    },
  });
}
```

> [!note] Respuesta idéntica a `useMfaVerify`
> `POST /auth/mfa/verify-backup` retorna los mismos tokens que `POST /auth/mfa/verify`. Ver [[01-api/endpoints/AUTH]] §1.17.

---

## 7. Bootstrap de Sesión al Cargar la App (Layout Protegido)

**Ubicación:** `src/components/layout/DashboardLayout.tsx` — componente raíz de las rutas
protegidas dentro de `src/app/router.tsx` (no existe `middleware.ts`: en una SPA sin servidor
propio, la protección de rutas ocurre enteramente en el cliente, ver nota en §7.1).

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Outlet } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';
import { silentRefresh } from '@/features/auth/api/auth.service';  // ← SIEMPRE usar esta función
import { apiClient } from '@/services/api-client';
import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import type { ApiResponse } from '@/types/api.types';
import type { AuthUser } from '@/features/auth/types/auth.types';

export function DashboardLayout() {
  const { setUser, clearSession } = useAuthStore();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        // 1. Renovar el token (falla inmediatamente si no hay refreshToken en memoria → reload)
        await silentRefresh(); // Lee refreshToken del store, actualiza ambos tokens internamente

        // 2. Obtener datos del usuario
        const meRes = await apiClient.get<ApiResponse<AuthUser>>('/auth/me');
        const user = meRes.data.data;

        // 3. Verificar que es admin — rechazar si no lo es
        if (user.role !== 'admin') {
          clearSession();
          navigate('/login', { replace: true });
          return;
        }

        setUser(user);
        setReady(true);
      } catch {
        // silentRefresh falló → no hay refreshToken en memoria (recarga) o token expirado
        clearSession();
        navigate('/login', { replace: true });
      }
    }

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return <FullPageLoader />;
  return (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  );
}
```

### 7.1 Guards de Autenticación

> Checklist #6 del documento de requerimientos: "Guards de autenticación: HOC/Wrapper que
> verifica token en memoria antes de renderizar" y "Redirecciones post-login: Return URL
> preservado".

```tsx
// src/app/guards/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Preservar la ruta original para redirigir tras login exitoso (ver §5)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
```

```tsx
// src/app/guards/AdminOnlyRoute.tsx
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

export function AdminOnlyRoute() {
  const role = useAuthStore((s) => s.user?.role);
  if (role !== 'admin') return <Navigate to="/login" replace />;
  return <Outlet />;
}
```

> [!warning] Límite real de esta protección
> A diferencia del middleware de Next.js (que corre en el edge, antes de enviar HTML), esta
> protección corre **en el navegador**, después de que el bundle JS ya se descargó. Eso es
> aceptable para un panel administrativo (no hay contenido sensible en el HTML/JS estático en
> sí, solo en las respuestas del API, que sí están protegidas en el servidor), pero significa
> que la "protección de rutas" del cliente es una mejora de UX/navegación, no la barrera de
> seguridad real — esa barrera la impone siempre el API rechazando requests sin un access token
> válido.

---

## 8. Logout

```ts
// auth.service.ts
export async function logout() {
  // El API invalida el refresh token en el servidor
  await apiClient.post('/auth/logout');
}
```

```ts
// use-logout.ts
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth.store';
import { logout } from '../api/auth.service';

export function useLogout() {
  const { clearSession } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      // Limpiar siempre, incluso si el API falla (mejor UX)
      clearSession();
      queryClient.clear(); // Limpiar todo el cache de TanStack Query
      navigate('/login', { replace: true });
    },
  });
}
```

---

## 9. Gestión de Sesiones Activas

El panel de seguridad (`/settings/security`) permite al admin ver y revocar sesiones, y detectar
uso concurrente sospechoso.

```ts
// Ver sesiones activas
GET /auth/sessions → useQuery con QUERY_KEYS.SESSIONS

// Revocar sesión específica
DELETE /auth/sessions/{session_id} → useMutation + invalidar QUERY_KEYS.SESSIONS

// Revocar todas excepto la actual
DELETE /auth/sessions → useMutation + logout local posterior
```

### 9.1 Detección de Uso Concurrente Sospechoso

> Checklist #1 del documento de requerimientos: "Sesiones activas: tabla de sesiones con
> revocación remota **y detección de uso concurrente sospechoso**".

El componente `SessionList` (ver [[WEB_COMPONENTS]] §6) marca visualmente una sesión como
sospechosa cuando, comparado con la sesión actual (`is_current: true`):

```ts
// src/features/settings/lib/session-risk.ts
import type { Session } from '@/features/auth/types/auth.types';

export interface SessionRisk {
  isSuspicious: boolean;
  reasons: string[];
}

export function evaluateSessionRisk(session: Session, currentSession: Session): SessionRisk {
  const reasons: string[] = [];

  if (session.is_current) return { isSuspicious: false, reasons };

  // Mismo periodo de actividad reciente (< 5 min) en IPs distintas → señal de cuenta compartida
  // o sesión robada
  const activityGapMs =
    Math.abs(new Date(session.last_activity).getTime() - Date.now());
  if (activityGapMs < 5 * 60 * 1000 && session.ip_address !== currentSession.ip_address) {
    reasons.push('Actividad simultánea desde una IP distinta');
  }

  // País/región del IP difiere drásticamente del histórico — requiere que el API exponga
  // geolocalización aproximada del IP en el payload de sesión (ver API_CONTRACT.md)
  if (session.location && currentSession.location && session.location !== currentSession.location) {
    reasons.push(`Ubicación inusual: ${session.location}`);
  }

  return { isSuspicious: reasons.length > 0, reasons };
}
```

> [!note] Dependencia del API
> Este cálculo es heurístico y se hace en el cliente con lo que el endpoint `GET /auth/sessions`
> devuelva. Si [[01-api/API_CONTRACT]] no expone un campo de ubicación/geolocalización por sesión, la
> segunda heurística no aplica — verificar el contrato antes de implementar y documentar la
> limitación en `WEB_SESSION_MANIFEST.md` § Deuda Técnica si el campo no existe todavía.

En la UI, una sesión marcada `isSuspicious` se resalta con `StatusBadge` variante `warning` y un
botón de revocación inmediata destacado (ver [[WEB_VISUAL_STANDARDS]] §2.3 para el uso correcto
del color `warning`).

---

## 10. Manejo de Errores de Autenticación

| Código de error API | Acción del cliente |
|--------------------|-------------------|
| `INVALID_CREDENTIALS` | Mostrar error en formulario de login |
| `ACCOUNT_LOCKED` | Mostrar error: "Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta más tarde." |
| `MFA_REQUIRED` | Redirigir a `/login/mfa` |
| `MFA_INVALID_CODE` | Mostrar error en formulario MFA |
| `MFA_BACKUP_USED` | Mostrar advertencia: "Código de respaldo ya utilizado. Prueba otro o regenera tus códigos." |
| `TOKEN_EXPIRED` | Silent refresh automático (interceptor Axios) |
| `TOKEN_INVALID` | `clearSession()` + `window.location.replace('/login')` |
| `DEVICE_NOT_RECOGNIZED` | Mostrar modal de advertencia de seguridad + logout obligatorio |
| `FORCE_PASSWORD_CHANGE` | Redirigir a `/change-password` con `limited_token` extraído de `error.data.limited_token` (el usuario aún no está autenticado — ver §5 `useLogin.onError` y [[01-api/endpoints/AUTH]] §1.1) |
| `PASSWORD_REUSED` | Mostrar error específico: "No puedes reutilizar contraseñas anteriores" |
| `RATE_LIMIT_EXCEEDED` | Mostrar: "Demasiados intentos. Espera {Retry-After}s antes de continuar" — en endpoints fuera del interceptor de backoff (p. ej. login, donde reintentar automáticamente no es deseable) |
| `UNAUTHORIZED` | `clearSession()` + redirect a `/login` |
| `FORBIDDEN` | Mostrar página 403 en el dashboard (no debería ocurrir para admins) |
| `SESSION_NOT_FOUND` | Informar que la sesión ya no existe, refrescar lista de sesiones |

> [!note] `RATE_LIMIT_EXCEEDED` vs. backoff automático del interceptor (§4)
> El backoff automático del interceptor (429 genérico) es para llamadas de lectura/listados,
> donde reintentar transparentemente mejora la UX. El login **no** debe reintentarse
> automáticamente: un intento de login fallido por rate limit debe comunicarse explícitamente al
> usuario, nunca reintentarse en silencio (eso facilitaría fuerza bruta no intencional desde el
> propio cliente).

### Lectura del header `Retry-After`

```ts
// En el componente LoginForm
if (apiError.code === 'RATE_LIMIT_EXCEEDED') {
  const retryAfter = error.response?.headers['retry-after'];
  const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
  setErrorMessage(`Demasiados intentos. Espera ${seconds} segundos antes de continuar.`);
}
```

---

## 11. Seguridad del Cliente

### 11.1 Content Security Policy (CSP)

> [!warning] Diferencia crítica frente a Next.js
> Next.js puede inyectar headers HTTP en cada response porque tiene un servidor (`next.config.ts`
> → `headers()`). Vite, en producción, genera **archivos estáticos** sin servidor propio — los
> headers HTTP (incluyendo CSP) se configuran en la capa que efectivamente sirve esos archivos:
> Nginx, el panel de Vercel/Netlify, o el CDN. **No existe** un lugar centralizado dentro del
> código del proyecto Vite para esto; debe documentarse en la configuración de infraestructura.

**Ejemplo Nginx** (`nginx.conf` del servidor que sirve `dist/`):
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.urbania.com wss://ws.urbania.com; img-src 'self' data: blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

**Ejemplo Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

> [!note] A diferencia de Next.js en desarrollo, Vite no necesita `'unsafe-eval'` ni
> `'unsafe-inline'` en `script-src` durante desarrollo local — el HMR de Vite no requiere esas
> excepciones. La política de producción puede ser más estricta desde el día uno.

### 11.2 Protección contra Clickjacking

El header `X-Frame-Options: DENY` y `frame-ancestors 'none'` en CSP ya cubren esto (configurado
en la capa de hosting, §11.1).

### 11.3 Sanitización de Inputs (XSS)

- **Validación en cliente**: siempre con Zod antes de enviar al API (ver [[WEB_COMPONENTS]] §5)
- **Validación en servidor**: el API valida independientemente. Nunca asumir que la validación
  del cliente es suficiente.
- **Escape automático**: React escapa por defecto todo valor interpolado en JSX
  (`{variable}`). El riesgo real está en `dangerouslySetInnerHTML`, que **no debe usarse** salvo
  necesidad explícita y sanitizando primero.
- **Sanitización de HTML**: si algún campo muestra HTML del usuario (p. ej. comentarios de PQR
  con formato), usar `DOMPurify` antes de cualquier `dangerouslySetInnerHTML`:
  ```bash
  pnpm add dompurify
  pnpm add -D @types/dompurify
  ```
  ```ts
  import DOMPurify from 'dompurify';
  const safe = DOMPurify.sanitize(userInput);
  ```

### 11.4 CSRF

> Checklist #1 del documento de requerimientos: "Tokens para mutaciones no-GET cuando no uses
> `SameSite=Strict` cookies".

Este proyecto **no es vulnerable a CSRF** porque ningún token viaja en cookie:

- El `access_token` viaja en el header `Authorization: Bearer ...`, que el navegador nunca adjunta automáticamente en requests cross-origin iniciadas por un sitio malicioso.
- El `refresh_token` viaja en el **body** de `POST /auth/refresh` (ver §3) — un sitio malicioso tampoco puede leer ni reenviar ese valor sin acceso al DOM de este origen.

**No se requiere token CSRF adicional.** El modelo de tokens en memoria (§1) elimina por diseño el vector de ataque que hace necesario CSRF.

### 11.5 Tiempo de Inactividad

Si el usuario lleva más de 30 minutos sin interacción, mostrar una advertencia y hacer logout
automático al completarse 60 minutos inactivos:

```ts
// src/hooks/use-inactivity-logout.ts
import { useEffect, useState } from 'react';
import { useLogout } from '@/features/auth/hooks/use-logout';

const WARN_AFTER = 30 * 60 * 1000;  // 30 min
const LOGOUT_AFTER = 60 * 60 * 1000; // 60 min

export function useInactivityLogout() {
  const logout = useLogout();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    let warnTimer: ReturnType<typeof setTimeout>;
    let logoutTimer: ReturnType<typeof setTimeout>;

    const resetTimers = () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
      setShowWarning(false);
      warnTimer = setTimeout(() => setShowWarning(true), WARN_AFTER);
      logoutTimer = setTimeout(() => logout.mutate(), LOGOUT_AFTER);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimers, { passive: true }));
    resetTimers();

    return () => {
      clearTimeout(warnTimer);
      clearTimeout(logoutTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimers));
    };
  }, []);

  return { showWarning };
}
```

---

## 12. Tipos de Auth

**Ubicación:** `src/features/auth/types/auth.types.ts`

```ts
export interface AuthUser {
  id: string;           // UUID v7
  name: string;
  email: string;
  phone: string | null;
  unit: string | null;
  role: 'admin' | 'user';
  status: 'active' | 'suspended' | 'inactive';
  avatar_url: string | null;
  mfa_enabled: boolean;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string; // Viene en el body — ver [[01-api/endpoints/AUTH]] §1.1
  token_type: 'bearer';
  expires_in: number;   // 900 (segundos = 15 min)
  user: AuthUser;
}

export interface Session {
  id: string;
  device_name: string | null;
  ip_address: string | null;
  location: string | null;  // verificar disponibilidad en API_CONTRACT.md — ver §9.1
  last_activity: string;    // ISO 8601 UTC
  is_current: boolean;
  created_at: string;       // ISO 8601 UTC
}

export interface LoginInput {
  email: string;
  password: string;
}
```
