---
type: feature-panorama
status: active
module: shared
tags: [configuracion, perfil, seguridad, shared]
updated: 2026-06-29
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

## 11. Especificaciones técnicas por proyecto

| Proyecto | Documento | Estado |
|---|---|---|
| API | [[01-api/endpoints/CONFIGURACION]] (reusa endpoints de Auth) | ✅ Implementado vía AUTH |
| Web | [[02-web/features/configuracion/CONFIGURACION_SPEC]] | ✅ Implementado |
| App | N/A | N/A |

## 12. Estado de sincronización

Ver [[CHANGES_LOG]] — entrada CAMBIO-007 (implementación Web del feature Configuración).

## 13. Checklist de coherencia

- [x] Nombres de campos consistentes con [[GLOSSARY]]
- [x] Inventario de pantallas (§5) agregado en [[FEATURES_INDEX]] catálogo de pantallas
- [ ] Modelo de datos (§6): no aplica — el feature no introduce tablas nuevas, opera sobre `users` existente
- [x] Mapeo de acciones a endpoints (§6/§9) coherente con [[01-api/API_CONTRACT]]
- [x] Códigos de error nuevos: no se introdujeron — todos los errores son heredados de Auth ya documentados en [[01-api/API_CONTRACT]]
- [x] Decisión consciente sobre self-service documentada: todos los endpoints operan sobre el usuario autenticado, sin RBAC de admin
- [x] Cada proyecto afectado tiene una sesión planeada en su `*_IMPLEMENTATION_PLAN.md`

## 14. Checklist de creación / implementación

- [x] Fila presente en [[FEATURES_INDEX]] tabla de estado (actualizado a "En progreso" → Web: ✓)
- [x] Entrada en [[CHANGES_LOG]] (CAMBIO-007)
- [x] Documento de panorama creado: `00-shared/features/CONFIGURACION.md`
- [x] API: endpoints documentados en `01-api/endpoints/CONFIGURACION.md` (reusa Auth)
- [x] Web: creado `CONFIGURACION_SPEC.md` en `02-web/features/configuracion/`
- [x] Web: creados 5 archivos de UI (`CONFIGURACION_UI_perfil.md`, `_seguridad.md`, `_cambiar-contrasena.md`, `_setup-mfa.md`, `_sesiones-activas.md`)
- [x] Web: implementadas 2 páginas (ProfilePage, SecurityPage) + 4 componentes (ProfileForm, ChangePasswordSheet, MfaSetupSheet, ActiveSessionsList)
- [x] Web: build + lint + type-check en verde; 20/20 tests pasan
- [ ] App: N/A
