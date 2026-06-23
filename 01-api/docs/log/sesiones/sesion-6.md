---
type: session
session_number: 6
name: "Seguridad Avanzada - MFA + Device + Sesiones + Rotacion"
status: completed
date_start: 2026-06-20
date_end: 2026-06-20
agent: opencode
tags: [session]
updated: 2026-06-20
---

# Sesion 6: Seguridad Avanzada - MFA + Device + Sesiones + Rotacion

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]] (Sesion 6)
- [[API_SESSION_MANIFEST]]
- [[API_CONTRACT]]
- [[API_ARCHITECTURE]]
- [[API_JWT_IMPLEMENTATION]]
- [[API_TESTING]]

## Tareas completadas
- [x] Instalar dependencia `pragmarx/google2fa-laravel` v3.0.1
- [x] Extender `UserEntity` con metodos MFA (`validateBackupCode`, `removeBackupCode`, `setMfaSecret`, `setBackupCodes`)
- [x] Crear DTOs `MfaEnableRequestDto`, `MfaDisableRequestDto`, `MfaVerifyBackupRequestDto`
- [x] Crear UseCases MFA: `MfaSetupUseCase`, `MfaVerifyUseCase`, `MfaVerifyBackupUseCase`, `MfaEnableUseCase`, `MfaDisableUseCase`, `MfaRegenerateBackupUseCase`
- [x] Crear UseCases de sesiones: `ListSessionsUseCase`, `RevokeAllSessionsUseCase`, `RevokeSessionUseCase`
- [x] Modificar `LoginUseCase` para retornar estado `MFA_REQUIRED` con `limited_token`
- [x] Modificar `RefreshTokenUseCase` para heredar claims de rol/MFA, persistir revocacion del token rotado y detectar replay
- [x] Agregar 9 endpoints MFA/sesiones en `AuthController`
- [x] Crear FormRequests `MfaVerifyRequest`, `MfaDisableRequest`, `MfaEnableRequest`
- [x] Registrar rutas MFA y sesiones en `src/Auth/Presentation/routes.php`
- [x] Agregar rate limiter `mfa-verify` en `AppServiceProvider`
- [x] Registrar singleton `Google2FA` en `UrbaniaAuthServiceProvider`
- [x] Crear tests unitarios, feature y de seguridad
- [x] `composer ci` verde

## Archivos creados
| Ruta | Descripcion |
|------|-------------|
| `src/Auth/Application/DTOs/MfaEnableRequestDto.php` | DTO para habilitar MFA |
| `src/Auth/Application/DTOs/MfaDisableRequestDto.php` | DTO para deshabilitar MFA |
| `src/Auth/Application/DTOs/MfaVerifyBackupRequestDto.php` | DTO para verificar codigo de respaldo |
| `src/Auth/Application/UseCases/MfaSetupUseCase.php` | Genera secreto TOTP y codigos de respaldo |
| `src/Auth/Application/UseCases/MfaVerifyUseCase.php` | Verifica TOTP y emite tokens completos |
| `src/Auth/Application/UseCases/MfaVerifyBackupUseCase.php` | Verifica codigo de respaldo |
| `src/Auth/Application/UseCases/MfaEnableUseCase.php` | Habilita MFA tras verificar primer TOTP |
| `src/Auth/Application/UseCases/MfaDisableUseCase.php` | Deshabilita MFA con password + TOTP |
| `src/Auth/Application/UseCases/MfaRegenerateBackupUseCase.php` | Regenera codigos de respaldo |
| `src/Auth/Application/UseCases/ListSessionsUseCase.php` | Lista sesiones activas agrupadas por session_id |
| `src/Auth/Application/UseCases/RevokeAllSessionsUseCase.php` | Revoca todas las sesiones excepto la actual |
| `src/Auth/Application/UseCases/RevokeSessionUseCase.php` | Revoca una sesion especifica |
| `src/Auth/Infrastructure/Http/Requests/MfaVerifyRequest.php` | Validacion de verificacion MFA |
| `src/Auth/Infrastructure/Http/Requests/MfaDisableRequest.php` | Validacion de deshabilitacion MFA |
| `src/Auth/Infrastructure/Http/Requests/MfaEnableRequest.php` | Validacion de habilitacion MFA |
| `tests/Unit/Auth/Application/UseCases/MfaSetupUseCaseTest.php` | Tests unitarios setup MFA |
| `tests/Unit/Auth/Application/UseCases/MfaVerifyUseCaseTest.php` | Tests unitarios verify MFA |
| `tests/Unit/Auth/Application/UseCases/MfaEnableUseCaseTest.php` | Tests unitarios enable MFA |
| `tests/Unit/Auth/Application/UseCases/MfaDisableUseCaseTest.php` | Tests unitarios disable MFA |
| `tests/Unit/Auth/Application/UseCases/MfaRegenerateBackupUseCaseTest.php` | Tests unitarios regenerate backup codes |
| `tests/Unit/Auth/Application/UseCases/ListSessionsUseCaseTest.php` | Tests unitarios list sessions |
| `tests/Unit/Auth/Application/UseCases/RevokeSessionUseCaseTest.php` | Tests unitarios revoke session |
| `tests/Unit/Auth/Application/UseCases/RevokeAllSessionsUseCaseTest.php` | Tests unitarios revoke all sessions |
| `tests/Feature/Auth/Http/MfaControllerTest.php` | Feature tests endpoints MFA |
| `tests/Feature/Auth/Http/SessionsControllerTest.php` | Feature tests endpoints de sesiones |
| `tests/Security/Auth/RotationReplayDetectionTest.php` | Tests de seguridad rotacion y replay |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `src/Auth/Domain/Entities/UserEntity.php` | Metodos MFA y gestion de backup codes |
| `src/Auth/Application/UseCases/LoginUseCase.php` | Retorna `MFA_REQUIRED` con `limited_token` |
| `src/Auth/Application/UseCases/RefreshTokenUseCase.php` | Rotacion persistente, deteccion replay y device fingerprint |
| `src/Auth/Infrastructure/Http/Controllers/AuthController.php` | Nuevos endpoints MFA y sesiones |
| `src/Auth/Presentation/routes.php` | Rutas MFA y sesiones |
| `src/Auth/Presentation/UrbaniaAuthServiceProvider.php` | Singleton Google2FA |
| `app/Providers/AppServiceProvider.php` | Rate limiter `mfa-verify` |
| `composer.json` / `composer.lock` | Dependencia `pragmarx/google2fa-laravel` |
| `01-api/API_SESSION_MANIFEST.md` | Sesion 6 completada |
| `01-api/API_IMPLEMENTATION_PLAN.md` | Sesion 6 cerrada con fecha |
| `01-api/API_CONTRACT.md` | Endpoints MFA y sesiones marcados como Implementado |

## Metricas de cierre
- Tests: 201 passed, 1 deprecated (741 assertions) — +29 tests vs Sesion 5
- PHPStan: nivel 10, 0 errores
- Pint: 169 archivos, 0 diferencias
- Pipeline: `composer ci` verde

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer ci` verde
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] [[API_IMPLEMENTATION_PLAN]] actualizado
- [x] [[API_CONTRACT]] actualizado (endpoints MFA/sesiones implementados)
- [x] Deuda tecnica/bloqueos documentados en plan (items diferidos)

## Decisiones tecnicas destacadas
- Reemplazadas excepciones crudas del plan original por DomainExceptions tipadas (`MfaAlreadyEnabledException`, `MfaNotConfiguredException`, `MfaNotEnabledException`) para cumplir las Reglas de Oro.
- `RefreshTokenUseCase` ahora persiste la revocacion del token original al rotar (`revoke($tokenHash, 'rotated')`), requisito previo para detectar replay.
- Se alineo el fallback de `deviceName` entre login y refresh (`'Unknown Device'`) para evitar falsos positivos de device mismatch.
- El endpoint de login retorna `data.limited_token` en estado `MFA_REQUIRED` para permitir el flujo `/mfa/verify`.
- Se corrigio un bug preexistente: `RefreshTokenUseCase` no incluia el header `Accept-Language` al calcular fingerprint en refresh, generando mismatch. Se ajustaron tests para usar `Accept-Language: ''` de forma consistente.

## Proxima sesion
- Sesion 7: Verificacion de Email y Recuperacion de Contrasena
