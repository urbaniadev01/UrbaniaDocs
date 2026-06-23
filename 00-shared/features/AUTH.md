---
type: feature-panorama
status: active
module: auth
scope: cross-project
tags: [auth, seguridad, sesion, shared]
updated: 2026-06-22
---

# Feature: Auth

## 1. Resumen y motivación

Gestiona la identidad y el acceso al sistema: login con credenciales, verificación en dos pasos (MFA), recuperación de contraseña y mantenimiento de sesión mediante tokens JWT. Es la puerta de entrada a toda la plataforma — ningún otro feature funciona sin esto.

## 2. Capas afectadas

- [x] API (origen del contrato)
- [x] Web
- [ ] App *(login en app es feature separado — App usa el mismo API pero con flujo nativo)*

## 3. Características principales

- Login con email + contraseña; detección automática de web/móvil por User-Agent
- MFA con TOTP (6 dígitos) y códigos de respaldo (8 dígitos)
- Sesión mantenida con doble token: access token en memoria (Zustand) + refresh token en cookie httpOnly
- Silent refresh automático vía interceptor Axios al expirar el access token (15 min)
- Recuperación de contraseña por email con token de un solo uso (15 min)
- Logout que invalida el refresh token en el servidor

## 4. Relaciones con otras features

- Es consumido por: **todos los features** — Auth define los guards `ProtectedRoute` y `AdminOnlyRoute` que envuelven cada ruta del dashboard
- Relacionado con: [[00-shared/features/CONFIGURACION]] — la pantalla de seguridad (sesiones activas, cambio de contraseña, setup MFA) vive en ese feature

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Login | Página | Formulario de email + contraseña; punto de entrada al panel |
| Verificación MFA | Página | Ingreso de código TOTP o código de respaldo tras login exitoso |
| Recuperar contraseña | Página | Formulario para solicitar el email de reset |
| Resetear contraseña | Página | Formulario para establecer la nueva contraseña con el token del email |

> Las pantallas de gestión de sesiones, cambio de contraseña y setup/desactivación de MFA viven en [[00-shared/features/CONFIGURACION]].

### App

> Auth en la app móvil tiene su propio flujo nativo. Ver [[03-app/features/auth/AUTH_SPEC]] cuando esté disponible.

---

## 6. Mapeo de acciones a endpoints

| Acción del usuario | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ingresar email + contraseña | Login | POST | `/auth/login` |
| Ingresar código TOTP (6 dígitos) | Verificación MFA | POST | `/auth/mfa/verify` |
| Ingresar código de respaldo (8 dígitos) | Verificación MFA | POST | `/auth/mfa/verify-backup` |
| Solicitar email de recuperación | Recuperar contraseña | POST | `/auth/forgot-password` |
| Establecer nueva contraseña con token | Resetear contraseña | POST | `/auth/reset-password` |
| Cerrar sesión | Cualquier pantalla del dashboard | POST | `/auth/logout` |
| Renovar access token silencioso | Automático (interceptor) | POST | `/auth/refresh` |
| Verificar identidad al recargar la app | Bootstrap de layout protegido | GET | `/auth/me` |

---

## 7. Reglas de negocio globales

- El access token dura **15 minutos**; el refresh token dura **7 días**.
- El access token **nunca se persiste en localStorage ni sessionStorage** — vive solo en memoria (Zustand). Si se pierde (recarga), se renueva con el refresh token via cookie httpOnly antes de renderizar el dashboard.
- Solo usuarios con `role: 'admin'` pueden acceder al panel web. Un login exitoso con `role: 'user'` es rechazado en cliente con `clearSession()`.
- Tras 3 intentos fallidos consecutivos, la cuenta queda bloqueada temporalmente (el API responde `ACCOUNT_LOCKED`).
- El token de reset de contraseña tiene vigencia de **15 minutos** y es de un solo uso.
- La cookie del refresh token es `httpOnly; Secure; SameSite=Strict` — inaccesible para JS.

## 8. Estados del recurso

```
Sesión: no iniciada → autenticada → expirada → renovada | terminada
Contraseña: activa → cambio pendiente (FORCE_PASSWORD_CHANGE) → actualizada
```

## 9. Endpoints

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

## 10. Orden de implementación

API ya implementado y estable. Web implementa contra el contrato existente.
Pantallas en orden: Login → MFA → Recuperar contraseña → Resetear contraseña.

## 11. Documentos de implementación

| Proyecto | Spec técnico | Docs de pantallas |
|---|---|---|
| Web | [[02-web/features/auth/AUTH_SPEC]] | [[02-web/features/auth/AUTH_UI_login]], [[02-web/features/auth/AUTH_UI_verificacion-mfa]], [[02-web/features/auth/AUTH_UI_recuperar-contrasena]], [[02-web/features/auth/AUTH_UI_resetear-contrasena]] |
| App | [[03-app/features/auth/AUTH_SPEC]] *(pendiente)* | — |

## 12. Notas de seguridad

La implementación completa de seguridad del cliente web (CSP, CSRF, XSS, inactividad, silent refresh, cola de requests) está documentada en [[WEB_AUTH_IMPLEMENTATION]]. Este panorama solo describe el qué; ese documento describe el cómo.
