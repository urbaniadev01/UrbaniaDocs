---
type: reference
status: active
module: configuracion
scope: api
tags: [api, endpoints, configuracion]
updated: 2026-06-23
---

# Endpoints: Configuración (Layout, Perfil y Seguridad)

> [!info] Consultar
> Documento de **referencia/agrupación** del módulo Configuración (perfil, seguridad y sesiones del usuario autenticado).
> Para el índice general de endpoints, ver [[API_CONTRACT]].
> Para convenciones globales (Base URL, headers, formato de respuesta, códigos de error), ver [[API_CONTRACT]] §Convenciones Generales.

> [!warning] Sin endpoints nuevos
> Este feature **NO introduce endpoints nuevos**. Todos los endpoints usados pertenecen a **Auth** ya implementado (§1.x de [[endpoints/AUTH]]).
> Este documento los **reorganiza desde la perspectiva de las pantallas de Configuración**; es un índice de referencia, no un contrato nuevo.
> Para detalle de **request, response, errores y diseño** de cada endpoint, consultar directamente [[endpoints/AUTH]] en la sección §1.x referenciada. **No se duplican aquí.**

---

## Endpoints usados por este feature

| #    | Método  | Ruta                          | Auth | Rol         | Estado                       |
| ---- | ------- | ----------------------------- | ---- | ----------- | ---------------------------- |
| C.1  | GET     | `/auth/me`                    | Sí   | admin, user | Implementado vía AUTH §1.5   |
| C.1  | PATCH   | `/auth/me`                    | Sí   | admin, user | Implementado vía AUTH §1.14   |
| C.2  | POST    | `/auth/change-password`       | Sí   | admin, user | Implementado vía AUTH §1.11   |
| C.3  | GET     | `/auth/sessions`              | Sí   | admin, user | Implementado vía AUTH §1.8   |
| C.3  | DELETE  | `/auth/sessions/{session_id}` | Sí   | admin, user | Implementado vía AUTH §1.10  |
| C.3  | DELETE  | `/auth/sessions`              | Sí   | admin, user | Implementado vía AUTH §1.9   |
| C.4  | POST    | `/auth/mfa/setup`             | Sí   | admin, user | Implementado vía AUTH §1.15   |
| C.4  | POST    | `/auth/mfa/enable`            | Sí   | admin, user | Implementado vía AUTH §1.18   |
| C.5  | POST    | `/auth/mfa/disable`           | Sí   | admin, user | Implementado vía AUTH §1.19   |
| C.5  | POST    | `/auth/mfa/backup-codes`      | Sí   | admin, user | Implementado vía AUTH §1.20   |

> La numeración **§C.N** (con C de Configuración) distingue este documento de la numeración global reservada. **No se reivindican §N nuevos** — los números reales del contrato viven en [[endpoints/AUTH]] como §1.x.

---

## §C.1 Perfil

Pantalla de datos personales del usuario logueado (nombre, teléfono, avatar). Ruta Web: `/settings`.

### Endpoint(s) usado(s)

| Método | Ruta           | Referencia AUTH |
| ------ | -------------- | --------------- |
| GET    | `/auth/me`     | [[endpoints/AUTH]] §1.5  |
| PATCH  | `/auth/me`     | [[endpoints/AUTH]] §1.14 |

### Notas de diseño

- Al montar la pantalla, el cliente dispara `GET /auth/me` para hidratar el formulario.
- La edición usa `PATCH /auth/me` con PATCH parcial: solo se envían los campos modificados (`name`, `phone`, `avatar`).
- `email`, `role` y `status` no son editables desde esta pantalla (verificado server-side en §1.14). El cambio de email exige verificación fuera del scope actual.
- En Web, `avatar` viaja como base64 — validar en cliente tamaño (máx 2MB) y formato (JPEG/PNG/WebP) antes del envío.

---

## §C.2 Cambiar contraseña

Sheet modal lanzado desde la pantalla de Seguridad (`/settings/security`). Solicita contraseña actual + nueva + confirmación.

### Endpoint(s) usado(s)

| Método | Ruta                    | Referencia AUTH |
| ------ | ----------------------- | --------------- |
| POST   | `/auth/change-password` | [[endpoints/AUTH]] §1.11 |

### Notas de diseño

- Requiere `current_password`, `new_password` y `new_password_confirmation`.
- El servidor valida historial: la nueva contraseña no puede repetir ninguna de las **12 últimas** → error `400 PASSWORD_REUSED`.
- **Comportamiento crítico:** tras éxito, el servidor **revoca TODAS las sesiones, incluida la actual**. El cliente **NO** puede hacer silent refresh — debe redirigir a `/login`.
- El mismo endpoint también acepta el `limited_token` del flujo `FORCE_PASSWORD_CHANGE` (§1.1) — excepción de scope que vive documentada en §1.11.

---

## §C.3 Sesiones activas

Sección inline dentro de Seguridad (`/settings/security`). Lista las sesiones activas del usuario y permite revocarlas.

### Endpoint(s) usado(s)

| Método  | Ruta                          | Referencia AUTH |
| ------- | ----------------------------- | --------------- |
| GET     | `/auth/sessions`              | [[endpoints/AUTH]] §1.8  |
| DELETE  | `/auth/sessions/{session_id}` | [[endpoints/AUTH]] §1.10 |
| DELETE  | `/auth/sessions`              | [[endpoints/AUTH]] §1.9  |

### Notas de diseño

- `GET /auth/sessions` marca `is_current = true` en la sesión del token usado en la request — el UI resalta la actual y **desactiva su botón de revocación individual** (no se puede revocar la sesión actual por §1.10; usar `POST /auth/logout` §1.3).
- `DELETE /auth/sessions/{session_id}` revoca una sesión específica → `404 SESSION_NOT_FOUND` si no existe o no pertenece al usuario.
- `DELETE /auth/sessions` revoca **todas excepto la actual** — tras éxito, el resto de dispositivos queda desconectado pero la sesión del usuario en curso persiste.
- Cache Web: `staleTime: 0` (información sensible, siempre se revalida al entrar).

---

## §C.4 Setup MFA

Sheet modal para activar MFA. Muestra QR + campo para introducir el código TOTP de la app de autenticación.

### Endpoint(s) usado(s)

| Método | Ruta                | Referencia AUTH |
| ------ | ------------------- | --------------- |
| POST   | `/auth/mfa/setup`   | [[endpoints/AUTH]] §1.15 |
| POST   | `/auth/mfa/enable`  | [[endpoints/AUTH]] §1.18 |

### Notas de diseño

- Flujo de **dos pasos**:
  1. `POST /auth/mfa/setup` → genera secreto TOTP + `qr_code_url` + 10 **backup codes** que se muestran **una sola vez**. El usuario debe guardarlos antes de cerrar el sheet.
  2. El usuario escanea el QR en su app de autenticación (Google Authenticator, Authy, etc.).
  3. `POST /auth/mfa/enable {code}` verifica el primer código TOTP y activa `users.mfa_enabled = true`. Si el código es inválido → `401 MFA_INVALID_CODE`.
- `mfa/setup` **no activa MFA** — es solo el paso de generación. La activación real ocurre en `mfa/enable`.
- El secreto y los hashes Argon2id de los backup codes se persisten en `mfa/setup`; si el usuario abandona el flujo antes de `mfa/enable`, el secreto queda almacenado pero MFA permanece inactivo.
- Requiere `mfa_enabled = false` como precondición.

---

## §C.5 Gestionar MFA

Acciones de mantenimiento de MFA una vez activo: desactivar y regenerar backup codes. Se disparan desde la pantalla de Seguridad (`/settings/security`).

### Endpoint(s) usado(s)

| Método | Ruta                     | Referencia AUTH |
| ------ | ------------------------ | --------------- |
| POST   | `/auth/mfa/disable`      | [[endpoints/AUTH]] §1.19 |
| POST   | `/auth/mfa/backup-codes` | [[endpoints/AUTH]] §1.20 |

### Notas de diseño

- **Desactivar MFA (`mfa/disable`)** exige **doble verificación**: `password` + `code` TOTP (no acepta backup codes). Es una acción sensible que requiere reautenticación.
- Tras desactivar: `mfa_enabled = false` y el secreto TOTP se invalida. Para reactivar, debe repetirse el flujo de §C.4 desde `mfa/setup`.
- **Regenerar backup codes (`mfa/backup-codes`)** genera 10 códigos nuevos e **invalida todos los anteriores** — operación destructiva. Los nuevos códigos se muestran **una sola vez** en la respuesta; no son recuperables.
- Ambos endpoints requieren MFA previamente habilitado.

---

## Referencias

- Índice general de endpoints: [[API_CONTRACT]]
- Detalle completo de endpoints (request/response/errores/diseño): [[endpoints/AUTH]] §1.5, §1.8, §1.9, §1.10, §1.11, §1.14, §1.15, §1.18, §1.19, §1.20
- Seguridad JWT (claims, rotación, blacklist, MFA): [[API_JWT_IMPLEMENTATION]]
- Esquema de base de datos (tablas `users`, `refresh_tokens`, MFA): [[API_DATABASE]]
- Spec Web: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
- Docs UI Web: [[02-web/features/configuracion/CONFIGURACION_UI_perfil]], [[02-web/features/configuracion/CONFIGURACION_UI_seguridad]], [[02-web/features/configuracion/CONFIGURACION_UI_cambiar-contrasena]], [[02-web/features/configuracion/CONFIGURACION_UI_setup-mfa]], [[02-web/features/configuracion/CONFIGURACION_UI_sesiones]]
- Panorama global: [[00-shared/features/CONFIGURACION]]