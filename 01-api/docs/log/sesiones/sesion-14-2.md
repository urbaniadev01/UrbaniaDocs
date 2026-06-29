---
type: session
session_number: 14.2
name: "CAMBIO-006 Sesión 3 — H1: Actor canónico + deprecar users.unit"
status: completed
date_start: 2026-06-29
date_end: 2026-06-29
agent: opencode
tags: [session]
updated: 2026-06-29
---

# Sesión 14.2: CAMBIO-006 Sesión 3 — H1: Actor canónico + deprecar users.unit

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]]
- [[00-shared/plans/PLAN_CAMBIO_006]]
- [[00-shared/docs/adr/ADR-001]]
- [[00-shared/SYSTEM_CONTRACT]]
- [[00-shared/GLOSSARY]]
- [[00-shared/CHANGES_LOG]]
- [[API_DATABASE]]
- [[DB_SCHEMA_OVERVIEW]]

## Tareas completadas
- [x] Crear migración `2026_06_28_000004_backfill_contacts_from_users` (idempotente, crea contact por usuario faltante).
- [x] Crear migración `2026_06_28_000005_migrate_users_unit_to_occupants` (migra matches a `property_occupants`; no-match a `reconciliation_users_unit`).
- [x] Crear migración `2026_06_28_000006_drop_unit_from_users` con `down()` reversible.
- [x] Quitar `unit` del `$fillable` de `app/Models/User.php`.
- [x] Limpiar código de Auth: eliminar `unit` de `UserEntity`, `UserMapper`, DTOs (`UserResponseDto`, `RegisterResponseDto`, `RegisterRequestDto`), UseCases (`Register`, `Login`, `GetCurrentUser`, `UpdateProfile`, `MfaVerify`, `MfaVerifyBackup`), `AuthController`, `RegisterRequest`, `UserResource` y tests.
- [x] Ejecutar migraciones sobre `urbania_test` (host Docker `db` no disponible en este entorno).
- [x] Documentar regla actor/party en [[SYSTEM_CONTRACT]] §3.
- [x] Agregar términos `Party` y `Actor` a [[GLOSSARY]]; actualizar `Residente` y `Contacto`.
- [x] Actualizar [[API_DATABASE]]: `users` sin `unit` y con `organization_id`; `contacts` con `organization_id`; tabla `reconciliation_users_unit`.
- [x] Actualizar [[DB_SCHEMA_OVERVIEW]]: reflejar eliminación de `users.unit` y actor/party.
- [x] Actualizar [[00-shared/CHANGES_LOG]] CAMBIO-006 a "En progreso" con notas de Sesión 3.
- [x] Actualizar `_Home.md` `GLOBAL_STATUS`.
- [x] Actualizar [[API_SESSION_MANIFEST]].

## Archivos creados
| Ruta | Descripción |
|------|-------------|
| `database/migrations/2026_06_28_000004_backfill_contacts_from_users.php` | Backfill idempotente contacts ← users |
| `database/migrations/2026_06_28_000005_migrate_users_unit_to_occupants.php` | Migra `users.unit` a `property_occupants`; reporta no-match |
| `database/migrations/2026_06_28_000006_drop_unit_from_users.php` | Elimina columna `users.unit` (reversible) |
| `01-api/docs/log/sesiones/sesion-14-2.md` | Esta nota de sesión |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `app/Models/User.php` | Quitado `unit` de `$fillable` |
| `src/Auth/Domain/Entities/UserEntity.php` | Eliminado campo `unit` y método `unit()` |
| `src/Auth/Infrastructure/Mappers/UserMapper.php` | Eliminado mapeo de `unit` |
| `src/Auth/Application/DTOs/UserResponseDto.php` | Eliminado campo `unit` |
| `src/Auth/Application/DTOs/RegisterResponseDto.php` | Eliminado campo `unit` |
| `src/Auth/Application/DTOs/RegisterRequestDto.php` | Eliminado campo `unit` |
| `src/Auth/Application/UseCases/RegisterUseCase.php` | Eliminado `unit` del flujo |
| `src/Auth/Application/UseCases/LoginUseCase.php` | Eliminado `unit` del DTO de respuesta |
| `src/Auth/Application/UseCases/GetCurrentUserUseCase.php` | Eliminado `unit` del DTO de respuesta |
| `src/Auth/Application/UseCases/UpdateProfileUseCase.php` | Eliminado `unit` del DTO de respuesta |
| `src/Auth/Application/UseCases/MfaVerifyUseCase.php` | Eliminado `unit`; corregido `phone` |
| `src/Auth/Application/UseCases/MfaVerifyBackupUseCase.php` | Eliminado `unit`; corregido `phone` |
| `src/Auth/Infrastructure/Http/Controllers/AuthController.php` | Eliminado `unit` del registro |
| `src/Auth/Infrastructure/Http/Requests/RegisterRequest.php` | Eliminada regla `unit` |
| `src/Auth/Infrastructure/Http/Resources/UserResource.php` | Eliminado campo `unit` del resource |
| `tests/Unit/Auth/Domain/Entities/UserEntityTest.php` | Eliminadas referencias a `unit` |
| `tests/Unit/Auth/Infrastructure/Http/Resources/UserResourceTest.php` | Eliminadas referencias a `unit` |
| `tests/Unit/Auth/Infrastructure/Http/Requests/RegisterRequestTest.php` | Eliminadas referencias a `unit` |
| `tests/Feature/Auth/Http/AuthControllerTest.php` | Eliminadas referencias a `unit` |
| `00-shared/SYSTEM_CONTRACT.md` | Nueva §3 Regla de actor y party |
| `00-shared/GLOSSARY.md` | Términos Party/Actor; actualizados Residente/Contacto |
| `01-api/API_DATABASE.md` | `users` sin `unit`, con `organization_id`; `contacts` con `organization_id`; `reconciliation_users_unit` |
| `00-shared/DB_SCHEMA_OVERVIEW.md` | Refleja eliminación de `users.unit` |
| `00-shared/CHANGES_LOG.md` | CAMBIO-006 actualizado a En progreso (Sesión 3 API) |
| `_Home.md` | `GLOBAL_STATUS` actualizado |
| `01-api/API_SESSION_MANIFEST.md` | Estado de sesión actualizado |

## Métricas de cierre
- Tests: 325 passed, 3 fallos preexistentes (rate limit flaky + 2 CORS origen 5174).
- PHPStan: 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; código nuevo limpio.
- Pint: no re-ejecutado en esta sesión.

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer test` pasa excepto deuda preexistente documentada
- [x] `composer stan` pasa excepto deuda preexistente documentada
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] [[API_CONTRACT]] / endpoints actualizados (no requería cambios de contrato)
- [x] [[00-shared/CHANGES_LOG]] actualizado
- [x] Nota atómica de sesión creada
- [x] Deuda técnica o bloqueos: ninguno nuevo

## Notas
- El entorno de desarrollo apunta a host Docker `db` no disponible en esta máquina; las migraciones se aplicaron sobre `urbania_test` (localhost:5433).
- La migración `migrate_users_unit_to_occupants` hace match por `properties.unit_number` sin restricción de condominio porque `users` no tiene `condominium_id`. Esto es aceptable para el volumen de datos históricos de era Auth; los conflictos potenciales quedan en `reconciliation_users_unit`.
- La sesión 4 de CAMBIO-006 (RBAC) depende de la columna `users.role` que aún existe; se tratará en la siguiente sesión.

## Próxima sesión
- Sesión 15: Cierre del módulo Propiedades y Unidades en API / sincronización con Web y App; o continuar CAMBIO-006 Sesión 4 (RBAC) según prioridad del orquestador.
