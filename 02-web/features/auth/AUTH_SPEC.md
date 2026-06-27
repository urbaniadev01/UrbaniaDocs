---
type: spec-tecnico
status: active
module: web
feature: auth
tags: [web, auth, spec, seguridad]
updated: 2026-06-22
---

# Spec Técnico Web: Auth

> Panorama global: [[00-shared/features/AUTH]]
> Endpoints: [[01-api/endpoints/AUTH]]
> Implementación auth: [[WEB_AUTH_IMPLEMENTATION]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Login | Página | `/login` | [[02-web/features/auth/AUTH_UI_login]] |
| Verificación MFA | Página | `/login/mfa` | [[02-web/features/auth/AUTH_UI_verificacion-mfa]] |
| Recuperar contraseña | Página | `/forgot-password` | [[02-web/features/auth/AUTH_UI_recuperar-contrasena]] |
| Resetear contraseña | Página | `/reset-password` | [[02-web/features/auth/AUTH_UI_resetear-contrasena]] |

> Todas estas rutas son **públicas** (sin guard). El guard `ProtectedRoute` se aplica al dashboard, no a estas páginas.

---

## Rutas

| Ruta | Componente página | Guard |
|---|---|---|
| `/login` | `LoginPage` | ninguno (público) |
| `/login/mfa` | `MfaPage` | ninguno (público) |
| `/forgot-password` | `ForgotPasswordPage` | ninguno (público) |
| `/reset-password` | `ResetPasswordPage` | ninguno (público) |

> Registrar en `src/app/router.tsx`. Las rutas públicas van fuera del bloque `ProtectedRoute`.
> Si el usuario ya está autenticado (`isAuthenticated === true`) y navega a `/login`, redirigir a `/dashboard`.

---

## Componentes

### Reutilizar existentes

| Componente | Notas de uso |
|---|---|
| `FullPageLoader` | Bootstrap de sesión en `DashboardLayout` — [[WEB_COMPONENTS]] §FullPageLoader |

### Crear nuevos

| Componente | Ubicación | Responsabilidad | Props principales |
|---|---|---|---|
| `LoginForm` | `features/auth/components/` | Formulario email + contraseña con validación Zod | — |
| `MfaVerifyForm` | `features/auth/components/` | Campo de 6 dígitos (TOTP) con auto-submit y enlace a backup | — |
| `ForgotPasswordForm` | `features/auth/components/` | Campo de email + submit | — |
| `ResetPasswordForm` | `features/auth/components/` | Campos nueva contraseña + confirmar con validación | `token: string` (query param) |

### Modificar existentes

| Componente | Qué cambia | Por qué |
|---|---|---|
| `src/app/router.tsx` | Agregar las 4 rutas públicas de auth | Primera configuración del router |
| `DashboardLayout` | Bootstrap de sesión con `silentRefresh()` + `GET /auth/me` | Protege todas las rutas del dashboard |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `useLogin` | `auth.service.login()` | `POST /auth/login` |
| `useMfaVerify` | `auth.service.mfaVerify()` | `POST /auth/mfa/verify` |
| `useMfaVerifyBackup` | `auth.service.mfaVerifyBackup()` | `POST /auth/mfa/verify-backup` |
| `useForgotPassword` | `auth.service.forgotPassword()` | `POST /auth/forgot-password` |
| `useResetPassword` | `auth.service.resetPassword()` | `POST /auth/reset-password` |
| `useLogout` | `auth.service.logout()` | `POST /auth/logout` |

> Servicio en `src/features/auth/api/auth.service.ts` (incluye `silentRefresh()` — ver [[WEB_AUTH_IMPLEMENTATION]] §3).
> Hooks en `src/features/auth/hooks/`.
> Auth no usa TanStack Query para queries — usa `useMutation` para todas las acciones y `silentRefresh()` directamente para el bootstrap.

---

## Estrategia de cache

Auth no cachea datos en TanStack Query. El estado de sesión vive en Zustand (`src/stores/auth.store.ts`):

| Store | Campo | Qué guarda |
|---|---|---|
| `useAuthStore` | `accessToken` | JWT en memoria — se pierde al recargar |
| `useAuthStore` | `user` | `AuthUser` con id, nombre, email, rol |
| `useAuthStore` | `isAuthenticated` | boolean derivado de accessToken !== null |

> Ver [[WEB_AUTH_IMPLEMENTATION]] §2 para la implementación completa del store.

---

## Tipos TypeScript

`src/features/auth/types/auth.types.ts`

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
  token_type: 'bearer';
  expires_in: number;   // 900 segundos = 15 min
  user: AuthUser;
  // refresh_token viaja en cookie httpOnly — nunca aparece en el body
}

export interface LoginInput {
  email: string;
  password: string;
}
```

---

## Cálculos y validaciones frontend

- **Login**: email válido (Zod `z.string().email()`), contraseña mínimo 8 caracteres
- **Reset password**: contraseña mínimo 8 caracteres, al menos 1 mayúscula, 1 número; campo "confirmar" debe coincidir
- **MFA TOTP**: exactamente 6 dígitos numéricos; auto-submit al completar
- **MFA backup**: exactamente 8 caracteres alfanuméricos; auto-submit al completar

---

## Permisos

| Ruta / acción | Rol | Control |
|---|---|---|
| `/login`, `/login/mfa`, `/forgot-password`, `/reset-password` | público | Sin guard |
| Dashboard (cualquier ruta protegida) | admin | `ProtectedRoute` + `AdminOnlyRoute` en `router.tsx` |

> Ver [[WEB_AUTH_IMPLEMENTATION]] §7.1 para la implementación de los guards.

---

## Infraestructura creada por este feature

Estos archivos los crea Auth y los usan **todos los demás features**:

| Archivo | Qué hace |
|---|---|
| `src/stores/auth.store.ts` | Store Zustand de sesión |
| `src/services/api-client.ts` | Cliente Axios con interceptores de token y rate limit |
| `src/features/auth/api/auth.service.ts` | Funciones de API + `silentRefresh()` |
| `src/app/guards/ProtectedRoute.tsx` | Guard de autenticación |
| `src/app/guards/AdminOnlyRoute.tsx` | Guard de rol admin |
| `src/components/layout/DashboardLayout.tsx` | Bootstrap de sesión al cargar el dashboard |
| `src/hooks/use-inactivity-logout.ts` | Logout automático por inactividad (30 min warn, 60 min logout) |

---

## Manejo de errores

| Código API | Dónde se muestra | Mensaje |
|---|---|---|
| `INVALID_CREDENTIALS` | Formulario login | "Correo o contraseña incorrectos" |
| `ACCOUNT_LOCKED` | Formulario login | "Cuenta bloqueada temporalmente por demasiados intentos fallidos" |
| `MFA_REQUIRED` | — | Redirige a `/login/mfa` automáticamente |
| `MFA_INVALID_CODE` | Formulario MFA | "Código incorrecto. Intenta de nuevo." |
| `MFA_BACKUP_USED` | Formulario MFA | "Código de respaldo ya utilizado. Prueba otro o regenera tus códigos." |
| `FORCE_PASSWORD_CHANGE` | — | Redirige a `/change-password` con `limited_token` |
| `RATE_LIMIT_EXCEEDED` | Formulario login | "Demasiados intentos. Espera {Retry-After}s antes de continuar." |

> Ver [[WEB_AUTH_IMPLEMENTATION]] §10 para la tabla completa de errores.

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `POST /auth/login` | [[01-api/endpoints/AUTH]] §1.1 |
| `POST /auth/mfa/verify` | [[01-api/endpoints/AUTH]] §1.16 |
| `POST /auth/mfa/verify-backup` | [[01-api/endpoints/AUTH]] §1.17 |
| `POST /auth/forgot-password` | [[01-api/endpoints/AUTH]] §1.6 |
| `POST /auth/reset-password` | [[01-api/endpoints/AUTH]] §1.7 |
| `POST /auth/logout` | [[01-api/endpoints/AUTH]] §1.3 |
| `POST /auth/refresh` | [[01-api/endpoints/AUTH]] §1.4 |
| `GET /auth/me` | [[01-api/endpoints/AUTH]] §1.5 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-login.test.ts` | Login exitoso, MFA_REQUIRED, FORCE_PASSWORD_CHANGE, ACCOUNT_LOCKED |
| Unit | `hooks/use-logout.test.ts` | Limpieza de store y cache, redirect |
| Unit | `hooks/use-mfa-verify.test.ts` | TOTP válido, inválido, backup |
| Unit | `hooks/use-forgot-password.test.ts` | Envío de email, rate limit |
| Unit | `hooks/use-reset-password.test.ts` | Token válido, expirado, PASSWORD_REUSED |
| Component | `components/LoginForm.test.tsx` | Render, validación, submit, estados de error |
| Component | `components/MfaVerifyForm.test.tsx` | Auto-submit a 6 dígitos, toggle a backup |
| E2E | `tests/e2e/auth.spec.ts` | Flujo completo: login → dashboard; login → MFA → dashboard; logout |

> Ver [[WEB_TESTING]].
