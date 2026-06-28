---
type: session
session_number: 3
name: "Application Layer + JWT Service"
status: completed
date_start: 2026-06-19
date_end: 2026-06-19
agent: opencode
tags: [session]
updated: 2026-06-19
---

# Sesión 3: Application Layer + JWT Service

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]] (Sesión 3)
- [[API_SESSION_MANIFEST]]
- [[API_ARCHITECTURE]]
- [[API_JWT_IMPLEMENTATION]]
- [[API_TESTING]]

## Tareas completadas
- [x] Shared/Application/Bus: CommandBusInterface, QueryBusInterface, EventBusInterface
- [x] Auth/Application/DTOs: 10 Request DTOs + 6 Response DTOs (todos `final readonly class`)
- [x] Auth/Application/Services: JwtServiceInterface
- [x] Auth/Infrastructure/Services: PhpOpenSourceSaverJwtService (RS256, 12 claims, Redis blacklist)
- [x] Auth/Application/UseCases: Login, Register, Logout, RefreshToken, GetCurrentUser
- [x] UrbaniaAuthServiceProvider: binding JwtServiceInterface → PhpOpenSourceSaverJwtService
- [x] Tests unitarios de 5 UseCases con Mockery
- [x] Test de integración de JwtService con claves RSA reales
- [x] Regeneración de claves RSA (private.pem estaba vacía)
- [x] Corrección de script `scripts/generate_jwt_keys.php` para OpenSSL en Windows
- [x] `composer ci` verde

## Archivos creados
| Ruta | Descripción |
|------|-------------|
| `src/Shared/Application/Bus/CommandBusInterface.php` | Contrato de command bus |
| `src/Shared/Application/Bus/QueryBusInterface.php` | Contrato de query bus |
| `src/Shared/Application/Bus/EventBusInterface.php` | Contrato de event bus |
| `src/Auth/Application/DTOs/UserResponseDto.php` | DTO de usuario (base) |
| `src/Auth/Application/DTOs/LoginRequestDto.php` | DTO request login |
| `src/Auth/Application/DTOs/RegisterRequestDto.php` | DTO request registro |
| `src/Auth/Application/DTOs/RefreshTokenRequestDto.php` | DTO request refresh |
| `src/Auth/Application/DTOs/LogoutRequestDto.php` | DTO request logout |
| `src/Auth/Application/DTOs/MfaVerifyRequestDto.php` | DTO request MFA verify |
| `src/Auth/Application/DTOs/MfaSetupRequestDto.php` | DTO request MFA setup |
| `src/Auth/Application/DTOs/ForgotPasswordRequestDto.php` | DTO request forgot password |
| `src/Auth/Application/DTOs/ResetPasswordRequestDto.php` | DTO request reset password |
| `src/Auth/Application/DTOs/ChangePasswordRequestDto.php` | DTO request change password |
| `src/Auth/Application/DTOs/UpdateProfileRequestDto.php` | DTO request update profile |
| `src/Auth/Application/DTOs/LoginResponseDto.php` | DTO response login |
| `src/Auth/Application/DTOs/RegisterResponseDto.php` | DTO response registro |
| `src/Auth/Application/DTOs/TokenResponseDto.php` | DTO response tokens |
| `src/Auth/Application/DTOs/MfaSetupResponseDto.php` | DTO response MFA setup |
| `src/Auth/Application/DTOs/SessionResponseDto.php` | DTO response sesión |
| `src/Auth/Application/Services/JwtServiceInterface.php` | Interfaz del servicio JWT |
| `src/Auth/Infrastructure/Services/PhpOpenSourceSaverJwtService.php` | Implementación JWT RS256 |
| `src/Auth/Application/UseCases/LoginUseCase.php` | Caso de uso login |
| `src/Auth/Application/UseCases/RegisterUseCase.php` | Caso de uso registro |
| `src/Auth/Application/UseCases/LogoutUseCase.php` | Caso de uso logout |
| `src/Auth/Application/UseCases/RefreshTokenUseCase.php` | Caso de uso refresh token |
| `src/Auth/Application/UseCases/GetCurrentUserUseCase.php` | Caso de uso me |
| `tests/Unit/Auth/Application/UseCases/LoginUseCaseTest.php` | Tests login |
| `tests/Unit/Auth/Application/UseCases/RegisterUseCaseTest.php` | Tests registro |
| `tests/Unit/Auth/Application/UseCases/LogoutUseCaseTest.php` | Tests logout |
| `tests/Unit/Auth/Application/UseCases/RefreshTokenUseCaseTest.php` | Tests refresh |
| `tests/Unit/Auth/Application/UseCases/GetCurrentUserUseCaseTest.php` | Tests me |
| `tests/Integration/Auth/Infrastructure/Services/PhpOpenSourceSaverJwtServiceTest.php` | Tests JWT integration |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `src/Auth/Presentation/UrbaniaAuthServiceProvider.php` | Binding de JwtServiceInterface |
| `scripts/generate_jwt_keys.php` | Corrección OPENSSL_CONF en Windows |
| `storage/jwt/private.pem` | Regenerada (estaba vacía) |
| `storage/jwt/public.pem` | Regenerada |
| `.env` | Variables JWT completas |
| `.env.example` | Variables JWT completas |

## Métricas de cierre
- Tests: 111 passed, 1 deprecated (365 assertions)
- Cobertura Application: UseCases cubiertos con mocks
- PHPStan: nivel 10, 0 errores
- Pint: 0 archivos con diferencias

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer ci` verde
- [x] [[API_SESSION_MANIFEST]] actualizado
- [ ] [[API_CONTRACT]] / [[API_DATABASE]] actualizados si aplica (no aplica en esta sesión)
- [x] Deuda técnica documentada

## Notas
- Domain congelado: no se modificaron entidades, value objects, excepciones ni interfaces de repositorio.
- El servicio JWT usa directamente `lcobucci/jwt` (dependencia transitiva de `php-open-source-saver/jwt-auth`) porque el dominio no expone `JWTSubject` de Eloquent.
- Revocación de JWT usa `jwt:blacklist:{jti}` en Redis con TTL fijo de 900s (tiempo máximo de vida de un access token); calcular TTL exacto requeriría el token completo, no solo el JTI.

## Próxima sesión
- Sesión 4: Infrastructure Layer (Repositorios Eloquent + Mappers)
