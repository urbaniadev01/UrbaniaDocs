---
type: spec-tecnico
status: active
module: mobile
feature: auth
tags: [app, auth, spec]
updated: 2026-06-23
---

# Spec Técnico App: Auth

> Panorama global: [[00-shared/features/AUTH]]
> Endpoints: [[01-api/endpoints/AUTH]]
> Design System: [[APP_DESIGN_SYSTEM]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Login | Screen | `/login` | [[03-app/features/auth/AUTH_UI_login]] |
| Verificación MFA | Screen | `/login/mfa` | [[03-app/features/auth/AUTH_UI_verificacion-mfa]] |
| Recuperar contraseña | Screen | `/forgot-password` | [[03-app/features/auth/AUTH_UI_recuperar-contrasena]] |
| Resetear contraseña | Screen | `/reset-password` | [[03-app/features/auth/AUTH_UI_resetear-contrasena]] |

> Todas las rutas son **públicas** (sin guard). El guard `AuthGuard` se aplica al dashboard, no a estas pantallas. Si hay sesión válida al navegar a `/login`, redirigir a `/dashboard`.

---

## Estructura de carpetas

```
features/auth/
  domain/
    entities/auth_user.dart
    repositories/auth_repository.dart
  data/
    models/auth_model.dart
    datasources/auth_remote_datasource.dart
    repositories/auth_repository_impl.dart
  presentation/
    providers/auth_providers.dart
    screens/
      login_screen.dart
      mfa_verify_screen.dart
      forgot_password_screen.dart
      reset_password_screen.dart
    widgets/
      login_form.dart
      mfa_verify_form.dart
      forgot_password_form.dart
      reset_password_form.dart
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `authLoginProvider` | `AuthRepository.login()` | `POST /auth/login` |
| `authMfaVerifyProvider` | `AuthRepository.mfaVerify()` | `POST /auth/mfa/verify` |
| `authMfaVerifyBackupProvider` | `AuthRepository.mfaVerifyBackup()` | `POST /auth/mfa/verify-backup` |
| `authForgotPasswordProvider` | `AuthRepository.forgotPassword()` | `POST /auth/forgot-password` |
| `authResetPasswordProvider` | `AuthRepository.resetPassword()` | `POST /auth/reset-password` |
| `authLogoutProvider` | `AuthRepository.logout()` | `POST /auth/logout` |
| `authRefreshProvider` | `AuthRepository.refresh()` | `POST /auth/refresh` |
| `authMeProvider` | `AuthRepository.me()` | `GET /auth/me` |

> Ver [[APP_API_INTEGRATION]] para cliente Dio, interceptores y manejo de errores.
> Ver [[APP_ARCHITECTURE]] §2 para la estructura completa.
> Sesión gestionada con Riverpod + `flutter_secure_storage`. A diferencia de Web (refresh token en cookie httpOnly), la App recibe `refresh_token` en el body y lo persiste en secure storage. Ver [[APP_SECURITY]].

---

## Widgets nuevos

| Widget | Ubicación | Responsabilidad |
|---|---|---|
| `LoginForm` | `presentation/widgets/` | Formulario email + contraseña con validación |
| `MfaVerifyForm` | `presentation/widgets/` | Campo TOTP de 6 celdas (auto-submit) + toggle a vista backup |
| `ForgotPasswordForm` | `presentation/widgets/` | Campo email + submit |
| `ResetPasswordForm` | `presentation/widgets/` | Campos nueva contraseña + confirmar con validación; recibe `token` y `email` del deep link |

> Todo color, tamaño y texto desde tokens de [[APP_DESIGN_SYSTEM]]. Todo texto en `l10n/`.
> Si un widget lo necesita más de un feature → mover a `shared/widgets/`.

---

## Estrategia offline

- **Clasificación:** `online-only` — auth no cachea datos en Drift. Ver [[APP_DATA_STRATEGY]] §1
- **Cache local:** ninguno. Los tokens (access + refresh) se guardan en `flutter_secure_storage`, no en Drift
- **En logout:** se limpian tokens de secure storage y se resetea el estado de sesión en Riverpod

---

## Cálculos y validaciones frontend

- **Login:** email válido (regex), contraseña mínimo 8 caracteres
- **Reset password:** contraseña mínimo 8 caracteres, al menos 1 mayúscula y 1 número; campo "confirmar" debe coincidir
- **MFA TOTP:** exactamente 6 dígitos numéricos; auto-submit al completar las 6 celdas
- **MFA backup:** exactamente 8 caracteres alfanuméricos; auto-submit al completar

> El server siempre revalida. Los cálculos frontend son solo para UX.

---

## Permisos

| Pantalla / acción | Rol | Control |
|---|---|---|
| `/login`, `/login/mfa`, `/forgot-password`, `/reset-password` | público | Sin guard |
| Dashboard (cualquier ruta protegida) | user, admin | `AuthGuard` en go_router |

> Ver [[APP_SECURITY]].

---

## Deep links

| Origen | Destino |
|---|---|
| `authreset://...?token=...&email=...` | `/reset-password?token=...&email=...` |

> Ver [[APP_FEATURE_SCOPE]] §6.

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `POST /auth/login` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.1 |
| `POST /auth/mfa/verify` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.16 |
| `POST /auth/mfa/verify-backup` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.17 |
| `POST /auth/forgot-password` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.6 |
| `POST /auth/reset-password` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.7 |
| `POST /auth/logout` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.3 |
| `POST /auth/refresh` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.4 |
| `GET /auth/me` | [[01-api/API_CONTRACT]] §Auth | [[01-api/endpoints/AUTH]] §1.5 |

---

## Tipos Dart

`features/auth/domain/entities/auth_user.dart`

```dart
class AuthUser {
  final String id;          // UUID
  final String name;
  final String email;
  final String? phone;
  final String? unit;
  final String role;        // 'admin' | 'user'
  final String status;      // 'active' | 'suspended' | 'inactive'
  final String? avatarUrl;
  final bool mfaEnabled;
}

class LoginResponse {
  final String accessToken;
  final String refreshToken;  // App lo recibe en el body y lo guarda en secure storage
  final String tokenType;     // 'bearer'
  final int expiresIn;        // 900 = 15 min
  final AuthUser user;
}
```

---

## Manejo de errores

| Código API | Dónde se muestra | Mensaje |
|---|---|---|
| `INVALID_CREDENTIALS` | Form login | "Correo o contraseña incorrectos" |
| `MFA_REQUIRED` | — | Navega a `/login/mfa` con `mfa_session` |
| `MFA_INVALID_CODE` | Form MFA (TOTP) | "Código incorrecto. Intenta de nuevo." |
| `MFA_BACKUP_USED` | Form MFA (backup) | "Código de respaldo ya utilizado" |
| `FORCE_PASSWORD_CHANGE` | — | Navega a cambio de contraseña con `limited_token` |
| `ACCOUNT_LOCKED` | Form login | "Cuenta bloqueada temporalmente" |
| `RATE_LIMIT_EXCEEDED` | Form login / forgot | "Demasiados intentos. Espera {Retry-After}s" |
| `PASSWORD_REUSED` | Form reset | "Esta contraseña ya fue usada recientemente" |

> Ver [[APP_API_INTEGRATION]] §manejo de errores.

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `test/features/auth/domain/` | Entidades, mapeo de modelos, validaciones |
| Widget | `test/features/auth/presentation/` | Render de formularios, estados de error, auto-submit MFA, toggle backup |
| Integration | `integration_test/auth_test.dart` | Flujo completo con Patrol: login → dashboard; login → MFA → dashboard; forgot → reset |

> Ver [[APP_TESTING]].
