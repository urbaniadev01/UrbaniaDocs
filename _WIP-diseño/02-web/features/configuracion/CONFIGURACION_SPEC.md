---
type: spec
status: draft
module: web
feature: configuracion
tags: [web, spec, configuracion, wip]
updated: 2026-06-28
---

# Spec Técnico Web: Configuración (Perfil y Seguridad)

> Panorama global: [[00-shared/features/CONFIGURACION]]
> Endpoints: [[01-api/endpoints/CONFIGURACION]] (reusa endpoints de Auth)
> Componentes: [[WEB_COMPONENTS]]
> **WIP** — borrador en `_WIP-diseño/`; promover a `02-web/features/configuracion/` al aprobar.

---

## Pantallas del feature

| Pantalla | Tipo | Doc de diseño |
|---|---|---|
| Perfil | Página | [[02-web/features/configuracion/CONFIGURACION_UI_perfil]] |
| Seguridad | Página | [[02-web/features/configuracion/CONFIGURACION_UI_seguridad]] |
| Cambiar contraseña | Sheet | [[02-web/features/configuracion/CONFIGURACION_UI_cambiar-contrasena]] |
| Setup MFA | Sheet | [[02-web/features/configuracion/CONFIGURACION_UI_setup-mfa]] |
| Sesiones activas | Inline | [[02-web/features/configuracion/CONFIGURACION_UI_sesiones-activas]] |

---

## Rutas

| Ruta | Componente página | Guard |
|---|---|---|
| `/settings/profile` | `ProfilePage` | `ProtectedRoute` (cualquier usuario autenticado) |
| `/settings/security` | `SecurityPage` | `ProtectedRoute` |

> Configuración es **self-service**: opera sobre el usuario autenticado, no requiere rol admin. Registrar en `src/app/router.tsx` con `lazy()`; entrada en el menú de usuario (no en el Sidebar admin).

---

## Componentes

### Reutilizar existentes
| Componente | Notas de uso |
|---|---|
| `DataTable` | Tabla de sesiones activas — [[WEB_COMPONENTS]] §4 |
| `ConfirmDialog` | Confirmar revocación de sesión / desactivar MFA — [[WEB_COMPONENTS]] §6 |
| `Sheet` | Contenedor de "Cambiar contraseña" y "Setup MFA" |

### Crear nuevos
| Componente | Ubicación | Responsabilidad | Props principales |
|---|---|---|---|
| `ProfileForm` | `features/configuracion/components/` | Editar nombre, teléfono, avatar | `initialValues, onSubmit` |
| `ChangePasswordSheet` | `features/configuracion/components/` | Form contraseña actual + nueva + confirmar | `open, onClose` |
| `MfaSetupSheet` | `features/configuracion/components/` | QR + verificación TOTP + códigos de respaldo | `open, onClose` |
| `ActiveSessionsList` | `features/configuracion/components/` | Lista de sesiones con revocación | `sessions, onRevoke` |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `useProfile` | `account.service.me()` | `GET /auth/me` |
| `useUpdateProfile` | `account.service.updateProfile()` | `PATCH /auth/profile` |
| `useChangePassword` | `account.service.changePassword()` | `POST /auth/change-password` |
| `useActiveSessions` | `account.service.sessions()` | `GET /auth/sessions` |
| `useRevokeSession` | `account.service.revokeSession()` | `DELETE /auth/sessions/:id` |
| `useMfaSetup` / `useMfaActivate` / `useMfaDisable` | `account.service.mfa*()` | `POST /auth/mfa/setup` · `/verify` · `/disable` |

> Servicio en `src/features/configuracion/api/account.service.ts`. Ver [[WEB_API_CLIENT]] para patrón y query keys.

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| `profile` (`/auth/me`) | 60s | Al editar perfil, activar/desactivar MFA |
| `sessions` | 15s | Al revocar una sesión o cerrar sesión en otro dispositivo |

---

## Tipos TypeScript

`src/features/configuracion/types/account.types.ts`

```ts
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar_url: string | null;
  mfa_enabled: boolean;
  organization_id: string; // ADR-001: identidad ligada al tenant
}

export interface UpdateProfilePayload { name?: string; phone?: string; avatar_url?: string; }
export interface ChangePasswordPayload { current_password: string; new_password: string; }
export interface ActiveSession {
  id: string; device_name: string | null; ip_address: string;
  last_used_at: string; is_current: boolean;
}
```

---

## Permisos

| Acción | Regla | Control |
|---|---|---|
| Ver/editar perfil y seguridad | **Self** (usuario autenticado sobre sí mismo) | `ProtectedRoute`; el backend ignora cualquier `user_id` ajeno |
| Revocar sesión | Self | Solo lista las sesiones del propio usuario |

> No aplica RBAC de admin: es configuración personal. (Distinto de "Roles y Permisos" #5, que es administración de terceros.)

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /auth/me`, `PATCH /auth/profile` | [[01-api/endpoints/CONFIGURACION]] (vía [[01-api/endpoints/AUTH]]) |
| `POST /auth/change-password` | [[01-api/endpoints/AUTH]] |
| `GET /auth/sessions`, `DELETE /auth/sessions/:id` | [[01-api/endpoints/AUTH]] |
| `POST /auth/mfa/setup` · `/verify` · `/disable` | [[01-api/endpoints/AUTH]] |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-account.test.ts` | Queries/mutaciones con MSW (perfil, sesiones, MFA) |
| Component | `components/ChangePasswordSheet.test.tsx` | Validación de contraseña y submit |
| E2E | `tests/e2e/configuracion.spec.ts` | Editar perfil, activar MFA, revocar sesión |

> Ver [[WEB_TESTING]].
