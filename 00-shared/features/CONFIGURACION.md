---
type: feature-panorama
status: active
module: shared
tags: [configuracion, perfil, seguridad, shared]
updated: 2026-06-22
---

# Feature: Configuración (Layout, Perfil y Seguridad)

## 1. Resumen y motivación

Permite al administrador gestionar su perfil de usuario, cambiar credenciales, configurar MFA y revisar las sesiones activas. Es el feature de "housekeeping" personal del usuario logueado.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(la app tiene su propia pantalla de perfil nativa)*

## 3. Características principales

- Edición de datos personales (nombre, email, teléfono, foto)
- Cambio de contraseña con validación de contraseña actual
- Setup y gestión de MFA (activar, desactivar, códigos de respaldo)
- Vista y revocación de sesiones activas con detección de uso sospechoso

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/AUTH]] — todas las acciones usan los endpoints de /auth/me y /auth/sessions
- No es consumido por otros features

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Perfil | Página | Nombre, email, foto, teléfono |
| Seguridad | Página | Cambiar contraseña, sesiones activas, MFA |
| Cambiar contraseña | Sheet | Contraseña actual + nueva + confirmar |
| Setup MFA | Sheet | QR + código de verificación para activar MFA |
| Sesiones activas | Inline | Tabla de sesiones con revocación (sección en Seguridad) |

### App

> N/A — la app tiene su propia pantalla de configuración de perfil.

---

## 6. Mapeo de acciones a endpoints

| Acción del usuario | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver / editar perfil | Perfil | GET / PATCH | `/auth/me` |
| Cambiar contraseña | Sheet cambiar contraseña | POST | `/auth/change-password` |
| Ver sesiones activas | Sección sesiones | GET | `/auth/sessions` |
| Revocar sesión específica | Sección sesiones | DELETE | `/auth/sessions/{id}` |
| Revocar todas las sesiones | Sección sesiones | DELETE | `/auth/sessions` |
| Iniciar setup MFA | Sheet setup MFA | POST | `/auth/mfa/setup` |
| Activar MFA (confirmar código) | Sheet setup MFA | POST | `/auth/mfa/enable` |
| Desactivar MFA | Seguridad | POST | `/auth/mfa/disable` |
| Regenerar códigos de respaldo | Seguridad | POST | `/auth/mfa/backup-codes` |

---

## 7. Reglas de negocio globales

- El email no se puede cambiar directamente — requiere verificación (proceso fuera del scope actual).
- Revocar todas las sesiones cierra la sesión actual también → redirige a login.
- El setup de MFA requiere verificar un código antes de activarse.
- Los códigos de respaldo se generan una sola vez y no se pueden recuperar — el usuario debe guardarlos.

## 8. Estados del recurso

```
MFA: desactivado → pendiente_verificacion → activo → desactivado
Sesión: activa → revocada
```

## 9. Endpoints

| Endpoint | Detalle |
|---|---|
| `GET /auth/me` | [[01-api/endpoints/AUTH]] §1.5 |
| `PATCH /auth/me` | [[01-api/endpoints/AUTH]] §1.14 |
| `POST /auth/change-password` | [[01-api/endpoints/AUTH]] §1.11 |
| `GET /auth/sessions` | [[01-api/endpoints/AUTH]] §1.8 |
| `DELETE /auth/sessions/{id}` | [[01-api/endpoints/AUTH]] §1.10 |
| `DELETE /auth/sessions` | [[01-api/endpoints/AUTH]] §1.9 |
| `POST /auth/mfa/setup` | [[01-api/endpoints/AUTH]] §1.15 |
| `POST /auth/mfa/enable` | [[01-api/endpoints/AUTH]] §1.18 |
| `POST /auth/mfa/disable` | [[01-api/endpoints/AUTH]] §1.19 |
| `POST /auth/mfa/backup-codes` | [[01-api/endpoints/AUTH]] §1.20 |

## 10. Orden de implementación

Después de AUTH (sesión 2). API ya implementado.

## 11. Documentos de implementación

> Se enlazarán aquí cuando el feature se diseñe e implemente (uno a la vez).
