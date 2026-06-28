---
type: session
session_number: 7
name: "Password Management + Perfil"
status: completed
date_start: 2026-06-20
date_end: 2026-06-20
agent: opencode
tags: [session]
updated: 2026-06-20
---

# Sesion 7: Password Management + Perfil

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]] (Sesion 7)
- [[API_SESSION_MANIFEST]]
- [[API_CONTRACT]]
- [[API_DATABASE]]
- [[API_JWT_IMPLEMENTATION]]
- [[API_TESTING]]

## Tareas completadas
- [x] Crear 3 nuevas excepciones de dominio: `InvalidResetTokenException`, `EmailAlreadyVerifiedException`, `EmailVerificationInvalidException`
- [x] Extender `UserEntity` con campos `phone`, `unit`, `avatarUrl` y seguimiento de `changedFields`
- [x] Crear interfaces de aplicacion `PasswordHistoryServiceInterface` y `MailerServiceInterface`
- [x] Crear implementaciones `EloquentPasswordHistoryService` y `LaravelMailerService`
- [x] Crear repositorio de dominio `PasswordResetTokenRepositoryInterface` e implementacion `EloquentPasswordResetTokenRepository`
- [x] Crear interfaz `AvatarStorageServiceInterface` e implementacion `LocalAvatarStorageService`
- [x] Crear 5 FormRequests: `ForgotPasswordRequest`, `ResetPasswordRequest`, `ChangePasswordRequest`, `UpdateProfileRequest`, `VerifyEmailRequest`
- [x] Crear 6 UseCases: `ForgotPasswordUseCase`, `ResetPasswordUseCase`, `ChangePasswordUseCase`, `UpdateProfileUseCase`, `VerifyEmailUseCase`, `ResendVerificationUseCase`
- [x] Modificar `UserMapper` con `toPersistencePartial()` y preservacion de campos de perfil
- [x] Modificar `EloquentUserRepository::update()` para usar persistencia parcial cuando aplica
- [x] Modificar `AuthController` con 6 nuevos metodos
- [x] Modificar `routes.php` con 6 nuevas rutas
- [x] Agregar rate limiters `forgot-password` y `verification-resend` en `AppServiceProvider`
- [x] Registrar bindings en `UrbaniaAuthServiceProvider`
- [x] Crear tests unitarios, feature y de seguridad
- [x] `composer ci` verde

## Archivos creados
| Ruta | Descripcion |
|------|-------------|
| `src/Auth/Domain/Exceptions/InvalidResetTokenException.php` | Excepcion para token de reset invalido/expirado |
| `src/Auth/Domain/Exceptions/EmailAlreadyVerifiedException.php` | Excepcion para email ya verificado |
| `src/Auth/Domain/Exceptions/EmailVerificationInvalidException.php` | Excepcion para token de verificacion invalido |
| `src/Auth/Domain/Repositories/PasswordResetTokenRepositoryInterface.php` | Contrato para persistencia de tokens de reset |
| `src/Auth/Application/Services/PasswordHistoryServiceInterface.php` | Contrato para historial de contrasenas |
| `src/Auth/Application/Services/MailerServiceInterface.php` | Contrato para envio de emails |
| `src/Auth/Application/Services/AvatarStorageServiceInterface.php` | Contrato para almacenamiento de avatares |
| `src/Auth/Application/UseCases/ForgotPasswordUseCase.php` | Genera token de reset y envia email |
| `src/Auth/Application/UseCases/ResetPasswordUseCase.php` | Valida token de reset y actualiza contrasena |
| `src/Auth/Application/UseCases/ChangePasswordUseCase.php` | Cambio de contrasena autenticado con historial |
| `src/Auth/Application/UseCases/UpdateProfileUseCase.php` | Actualiza nombre, telefono y avatar |
| `src/Auth/Application/UseCases/VerifyEmailUseCase.php` | Verifica email con token JWT |
| `src/Auth/Application/UseCases/ResendVerificationUseCase.php` | Reenvia email de verificacion |
| `src/Auth/Infrastructure/Persistence/EloquentPasswordResetTokenRepository.php` | Implementacion de tokens de reset |
| `src/Auth/Infrastructure/Persistence/EloquentPasswordHistoryService.php` | Implementacion de historial de contrasenas |
| `src/Auth/Infrastructure/Services/LaravelMailerService.php` | Implementacion de envio de emails |
| `src/Auth/Infrastructure/Services/LocalAvatarStorageService.php` | Almacenamiento local de avatares |
| `src/Auth/Infrastructure/Mail/PasswordResetMail.php` | Mailable para reset de contrasena |
| `src/Auth/Infrastructure/Mail/EmailVerificationMail.php` | Mailable para verificacion de email |
| `src/Auth/Infrastructure/Http/Requests/ForgotPasswordRequest.php` | Validacion forgot password |
| `src/Auth/Infrastructure/Http/Requests/ResetPasswordRequest.php` | Validacion reset password |
| `src/Auth/Infrastructure/Http/Requests/ChangePasswordRequest.php` | Validacion change password |
| `src/Auth/Infrastructure/Http/Requests/UpdateProfileRequest.php` | Validacion update profile |
| `src/Auth/Infrastructure/Http/Requests/VerifyEmailRequest.php` | Validacion verify email |
| `tests/Unit/Auth/Application/UseCases/ForgotPasswordUseCaseTest.php` | Tests unitarios forgot password |
| `tests/Unit/Auth/Application/UseCases/ResetPasswordUseCaseTest.php` | Tests unitarios reset password |
| `tests/Unit/Auth/Application/UseCases/ChangePasswordUseCaseTest.php` | Tests unitarios change password |
| `tests/Unit/Auth/Application/UseCases/UpdateProfileUseCaseTest.php` | Tests unitarios update profile |
| `tests/Unit/Auth/Application/UseCases/VerifyEmailUseCaseTest.php` | Tests unitarios verify email |
| `tests/Unit/Auth/Application/UseCases/ResendVerificationUseCaseTest.php` | Tests unitarios resend verification |
| `tests/Feature/Auth/Http/PasswordManagementControllerTest.php` | Feature tests de los 6 endpoints |
| `tests/Security/Auth/PasswordSecurityTest.php` | Tests de seguridad |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `src/Auth/Domain/Entities/UserEntity.php` | Campos phone/unit/avatarUrl, updateProfile y changedFields |
| `src/Auth/Infrastructure/Mappers/UserMapper.php` | toPersistencePartial y preservacion de campos de perfil |
| `src/Auth/Infrastructure/Persistence/EloquentUserRepository.php` | update() usa persistencia parcial cuando aplica |
| `src/Auth/Application/UseCases/RegisterUseCase.php` | Pasa phone/unit al crear usuario |
| `src/Auth/Application/UseCases/LoginUseCase.php` | Pasa phone/unit/avatarUrl al UserResponseDto |
| `src/Auth/Application/UseCases/GetCurrentUserUseCase.php` | Pasa phone/unit/avatarUrl al UserResponseDto |
| `src/Auth/Infrastructure/Http/Controllers/AuthController.php` | 6 nuevos endpoints |
| `src/Auth/Presentation/routes.php` | 6 nuevas rutas |
| `src/Auth/Presentation/UrbaniaAuthServiceProvider.php` | Bindings de nuevas interfaces |
| `app/Providers/AppServiceProvider.php` | Rate limiters forgot-password y verification-resend |
| `tests/Unit/Auth/Domain/Entities/UserEntityTest.php` | Tests de updateProfile y campos opcionales |
| `tests/Integration/Auth/Infrastructure/Mappers/UserMapperTest.php` | Test de toPersistencePartial |
| `tests/Unit/Auth/Domain/Exceptions/AuthExceptionsTest.php` | Nuevas excepciones |
| `tests/Security/Auth/PasswordSecurityTest.php` | Usa TestCase y LazilyRefreshDatabase |
| `01-api/API_SESSION_MANIFEST.md` | Sesion 7 completada |
| `01-api/API_IMPLEMENTATION_PLAN.md` | Sesion 7 cerrada |
| `01-api/API_CONTRACT.md` | Endpoints de password/profile marcados como Implementado |

## Metricas de cierre
- Tests: 247 passed, 1 deprecated (903 assertions) — +46 tests vs Sesion 6
- PHPStan: nivel 10, 0 errores
- Pint: 201 archivos, 0 diferencias
- Pipeline: `composer ci` verde

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer ci` verde
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] [[API_IMPLEMENTATION_PLAN]] actualizado
- [x] [[API_CONTRACT]] actualizado (endpoints password/profile implementados)
- [x] Deuda tecnica/bloqueos documentados en plan (items diferidos)

## Decisiones tecnicas destacadas
- Se extendio `UserEntity` con `phone`, `unit` y `avatarUrl` (con valores por defecto null) para soportar el perfil sin romper la firma de `UserEntity::create()`. Esto fue necesario porque `toPersistencePartial()` requiere que la entidad exponga los valores a persistir.
- Se agrego seguimiento de `changedFields` en `UserEntity` para que `EloquentUserRepository::update()` decida entre persistencia completa o parcial, evitando sobreescribir campos no modificados en `PATCH /auth/me`.
- Se reutilizo `JwtServiceInterface` para generar tokens de verificacion de email con scope `email-verification`, evitando crear un nuevo servicio de tokens.
- Se creo `PasswordResetTokenRepositoryInterface` en Domain para evitar usar `DB::facade` directamente desde Application, manteniendo la capa Application libre de infraestructura.
- Se inyecto `frontendUrl` a `ForgotPasswordUseCase` y `ResendVerificationUseCase` via contextual binding de Laravel, evitando llamadas a `config()` desde Application.

## Proxima sesion
- Sesion 8: Polish + CI/CD + Documentacion
