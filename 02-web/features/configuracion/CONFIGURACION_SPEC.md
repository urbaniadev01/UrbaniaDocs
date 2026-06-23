---
type: spec-tecnico
status: active
module: web
feature: configuracion
tags: [web, configuracion, perfil, seguridad, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Configuración

> Panorama global: [[00-shared/features/CONFIGURACION]]
> Endpoints: [[01-api/endpoints/AUTH]]
> Implementación auth: [[WEB_AUTH_IMPLEMENTATION]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Perfil | Página | `/settings` | [[02-web/features/configuracion/CONFIGURACION_UI_perfil]] |
| Seguridad | Página | `/settings/security` | [[02-web/features/configuracion/CONFIGURACION_UI_seguridad]] |
| Cambiar contraseña | Sheet | — | [[02-web/features/configuracion/CONFIGURACION_UI_cambiar-contrasena]] |
| Setup MFA | Sheet | — | [[02-web/features/configuracion/CONFIGURACION_UI_setup-mfa]] |
| Sesiones activas | Inline | (sección en /settings/security) | [[02-web/features/configuracion/CONFIGURACION_UI_sesiones]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/settings` | `PerfilPage` | `ProtectedRoute` |
| `/settings/security` | `SeguridadPage` | `ProtectedRoute` |

---

## Servicios y hooks

| Hook | Endpoint |
|---|---|
| `useMe` (query) | `GET /auth/me` |
| `useUpdateMe` | `PATCH /auth/me` |
| `useChangePassword` | `POST /auth/change-password` |
| `useSessions` (query) | `GET /auth/sessions` |
| `useRevokeSession` | `DELETE /auth/sessions/{id}` |
| `useRevokeAllSessions` | `DELETE /auth/sessions` |
| `useMfaSetup` | `POST /auth/mfa/setup` |
| `useMfaEnable` | `POST /auth/mfa/enable` |
| `useMfaDisable` | `POST /auth/mfa/disable` |
| `useMfaBackupCodes` | `POST /auth/mfa/backup-codes` |

---

## Tipos TypeScript

```ts
export interface Session {
  id: string;
  device_name: string | null;
  ip_address: string | null;
  location: string | null;
  last_activity: string;
  is_current: boolean;
  created_at: string;
}
```

> `AuthUser` definido en [[02-web/features/auth/AUTH_SPEC]] §Tipos TypeScript.

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /auth/me` | [[01-api/endpoints/AUTH]] §1.5 |
| `PATCH /auth/me` | [[01-api/endpoints/AUTH]] §1.14 |
| `POST /auth/change-password` | [[01-api/endpoints/AUTH]] §1.11 |
| `GET /auth/sessions` | [[01-api/endpoints/AUTH]] §1.8 |
| `DELETE /auth/sessions/{id}` | [[01-api/endpoints/AUTH]] §1.10 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-update-me.test.ts` | Actualizar perfil, error de validación |
| Unit | `hooks/use-change-password.test.ts` | Cambio exitoso, PASSWORD_REUSED, contraseña incorrecta |
| Unit | `hooks/use-sessions.test.ts` | Listado, detección de sesión sospechosa |
| E2E | `tests/e2e/settings.spec.ts` | Editar perfil, cambiar contraseña, revocar sesión |
