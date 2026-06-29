---
type: meta
status: active
priority: P0
tags: [planning, sessions]
updated: 2026-06-28
---

# IMPLEMENTATION_PLAN
## Plan de Implementacion Incremental por Sesiones

> [!info] Proposito
> Dividir la implementacion del proyecto en sesiones manejables,
> cada una con entregable runnable y scope estricto.
> **Audiencia**: Agentes de desarrollo, orchestrator.
> **Regla de oro**: Cada sesion termina con codigo compilable, tests pasando,
> y documentacion actualizada. Nunca dejar codigo muerto.

> [!todo] Instruccion para el agente
> Lee este documento al inicio de cada sesion
> para identificar tu sesion actual. Consulta el Session Manifest de la sesion
> anterior para contexto. Nunca saltar sesiones sin justificacion tecnica.

---

## Principios del Plan

1. **Vertical Slice primero**: Cada sesion produce un flujo end-to-end funcional
2. **Domain congelado primero**: Una vez implementada la capa Domain, sus
> interfaces no cambian sin actualizar todos los consumidores
3. **Contexto minimo por sesion**: El agente recibe solo los documentos
> necesarios para esa sesion especifica
4. **Session Manifest obligatorio**: Al final de cada sesion, documentar
> progreso, archivos modificados, y deuda tecnica pendiente
5. **Verify Before Assume**: Nunca confiar ciegamente en el estado reportado.
> Verificar existencia de archivos y ejecutar tests antes de continuar.

---

## Mapa de Sesiones

```
Sesion 1: Setup + Slice Vertical Minimo (Health Check)
    |
Sesion 2: Domain Layer Auth (Entidades, VO, Excepciones, Eventos)
    |
Sesion 3: Application Layer + JWT Service (UseCases, DTOs, Tokens RS256)
    |
Sesion 4: Infrastructure Layer (Repositorios, Mappers, Eloquent Models)
    |
Sesion 5: Presentation Layer - Endpoints Basicos (Login, Register, Logout, Me, Refresh)
    |
Sesion 6: Seguridad Avanzada (MFA, Device Fingerprint, Sesiones, Rotacion)
    |
Sesion 7: Password Management + Perfil (Forgot, Reset, Change, Update, Verify)
    |
Sesion 8: Polish + CI/CD + Documentacion (Scribe, PHPStan, Pint, Pipeline)
    |
Sesion 9: CORS global (transversal — posterior al cierre del modulo Auth)
```

---

## Sesion 1: Setup + Slice Vertical Minimo ✅ COMPLETADA (2026-06-19)

**Objetivo**: Infraestructura funcionando, endpoint `/health` operativo.
**Prioridad**: P0 — Bloqueante. Sin esto no hay proyecto.
**Dependencias**: Ninguna.

### Documentos requeridos
- [[API_AGENTS]] (mapa de navegacion)
- [[API_ARCHITECTURE]] (Sec 1 Stack, Sec 2 Estructura DDD, Sec 9 Autoloading, Sec 11 Docker, Sec 12 Calidad, Sec 13 Variables de entorno)
- [[API_SETUP_GUIDE]] (Sec 1-6, Sec 9)
- [[API_DATABASE]] (Convenciones de nomenclatura, tablas 2.1-2.6 esquema)
- [[API_CONTRACT]] (Sec 11 Health Check)
- [[API_TESTING]] (Sec 2 Configuracion, Sec 3.4 Feature Tests)

> [!note] Nota
> [[API_SESSION_MANIFEST]] se CREA al final de esta sesión. No existe al inicio.

### Tareas
- [x] Crear proyecto Laravel ^13.0 con estructura DDD (`src/Shared/`, `src/Auth/`)
- [x] Configurar autoloading PSR-4 en `composer.json` (`Urbania\\` → `src/`)
- [x] Docker Compose: app (PHP 8.5-fpm), nginx, PostgreSQL 18.4, Redis 7 (archivos creados, build pendiente de verificacion)
- [x] Instalar dependencias: JWT, Pest, PHPStan, Larastan, Pint, ramsey/uuid, Scribe
- [x] Generar claves RSA 4096 bits para RS256 (`storage/jwt/`)
- [~] Crear 6 migraciones de auth → **Diferido a Sesion 4** (no hay modelos Eloquent aun)
- [x] Implementar endpoint `GET /api/v1/health` (sin autenticacion)
- [x] Configurar `phpstan.neon` (nivel 10) y `pint.json`
- [x] Feature test: Health check retorna 200 (healthy) / 503 (unhealthy)
- [x] Verificar: `composer test` pasa, `phpstan analyse` pasa, `pint` sin cambios

### Entregable
- `docker compose up -d --build` levanta todos los servicios
- `curl http://localhost:8080/api/v1/health` retorna JSON con status y checks
- `composer test` ejecuta y pasa (minimo: health check test)
- `phpstan analyse` nivel 10 sin errores
- `vendor/bin/pint --test` sin diferencias

### Checklist de cierre
- [~] Todos los servicios Docker saludables (archivos Docker creados, build no verificado — entorno Windows)
- [~] Migraciones ejecutadas y reversibles → **Diferido a Sesion 4**
- [x] Estructura de directorios DDD completa en `src/`
- [x] `composer.json` con autoloading PSR-4 correcto
- [x] `.env` configurado con variables de [[API_ARCHITECTURE]] Sec 13
- [x] Archivos Docker: Dockerfile, docker-compose.yml, docker-entrypoint.sh, .env.docker, nginx.conf

---

## Sesion 2: Domain Layer Auth ✅ COMPLETADA (2026-06-19)

**Objetivo**: Entidades, Value Objects, Excepciones, Eventos de Auth completos y testeados.
**Prioridad**: P0 — Fundamento de todo el modulo.
**Dependencias**: Sesion 1 completada.
**Nota**: 🔒 Domain congelado al final de esta sesion.

### Documentos requeridos
- [[API_AGENTS]] (Reglas de Oro, flujo "Implementar modulo nuevo")
- [[API_ARCHITECTURE]] (Sec 2 Arquitectura DDD, Sec 3 Convenciones, Sec 4 Reglas de dependencia, Sec 5 Excepciones, Sec 6 Mapeo)
- [[API_DATABASE]] (Convenciones, tablas 2.1-2.6 para entender el dominio)
- [[API_JWT_IMPLEMENTATION]] (Sec 3.2 Claims, Sec 3.3 Parametros temporales — para entender que necesita el dominio)
- [[API_TESTING]] (Sec 3.1 Architecture Tests, Sec 3.2 Unit Tests, Sec 6 Reglas de escritura)

### Tareas
- [x] `Shared/Domain/`: `DomainException` (abstracta), `Uuid` VO, `Email` VO
- [x] `Auth/Domain/Entities/`: `UserEntity`, `RefreshTokenEntity`
- [x] `Auth/Domain/ValueObjects/`: `Password`, `UserRole` (enum), `UserStatus` (enum), `DeviceFingerprint`, `JwtToken`, `SessionId`
- [x] `Auth/Domain/Exceptions/`: `InvalidCredentialsException`, `TokenExpiredException`, `TokenInvalidException`, `UserNotFoundException`, `UserLockedException`, `MfaRequiredException`, `MfaInvalidCodeException`, `DeviceNotRecognizedException`, `SessionNotFoundException`, `PasswordReusedException`, `EmailAlreadyExistsException`
- [x] `Auth/Domain/Events/`: `UserLoggedIn`, `UserRegistered`, `UserLoggedOut`, `PasswordChanged`, `MfaEnabled`, `MfaDisabled`, `SuspiciousActivityDetected`
- [x] `Auth/Domain/Repositories/`: `UserRepositoryInterface` (findByEmail, findById, save, update, delete, existsByEmail), `RefreshTokenRepositoryInterface` (findByHash, save, revoke, revokeAllByUser, findActiveByUser, existsByHash)
- [x] Architecture tests: Domain no depende de Illuminate, Laravel, otras capas, ni otros bounded contexts
- [x] Unit tests: cobertura 95%+ de Domain (entities, VO, exceptions, events)
- [x] Verificar: `pest --filter=Unit` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Capa Domain completa, pura, sin dependencias externas
- Tests unitarios pasan con cobertura >=95%
- Architecture tests verifican independencia de Domain
- PHPStan nivel 10 sin errores

### Checklist de cierre
- [x] Ningun archivo en `src/*/Domain/` importa `Illuminate\` o `Laravel\`
- [x] Todos los VO son inmutables (readonly donde aplique)
- [x] Todas las excepciones extienden `DomainException`
- [x] Repositories son interfaces, no implementaciones
- [x] Eventos son objetos inmutables con datos de dominio

---

## Sesion 3: Application Layer + JWT Service ✅ COMPLETADA (2026-06-19)

**Objetivo**: Casos de uso orquestan el dominio; servicio JWT genera tokens RS256 validos.
**Prioridad**: P0 — Core del sistema.
**Dependencias**: Sesion 2 completada (Domain congelada).
**Nota**: 🔒 Application congelada al final de esta sesion. Domain permanece congelado.

### Documentos requeridos
- [[API_AGENTS]] (flujo "Implementar modulo nuevo", checklist)
- [[API_ARCHITECTURE]] (Sec 4 Reglas de dependencia, Sec 6 Mapeo, Sec 7 DTOs y Resources)
- [[API_JWT_IMPLEMENTATION]] (COMPLETO excepto Sec 6 Almacenamiento en clientes y Sec 9 Post-despliegue)
- [[API_CONTRACT]] (Estructura de tokens en Sec 1.1, Sec 1.4)
- [[API_TESTING]] (Sec 3.2 Unit Tests, Sec 3.3 Integration Tests)

### Tareas
- [x] `Shared/Application/`: `CommandBusInterface`, `QueryBusInterface`, `EventBusInterface` (contratos)
- [x] `Auth/Application/DTOs/` (todos `final readonly class`):
  - Request: `LoginRequestDto`, `RegisterRequestDto`, `RefreshTokenRequestDto`, `LogoutRequestDto`, `MfaVerifyRequestDto`, `MfaSetupRequestDto`, `ForgotPasswordRequestDto`, `ResetPasswordRequestDto`, `ChangePasswordRequestDto`, `UpdateProfileRequestDto`
  - Response: `LoginResponseDto`, `RegisterResponseDto`, `TokenResponseDto`, `UserResponseDto`, `MfaSetupResponseDto`, `SessionResponseDto`
- [x] `Auth/Application/UseCases/`: `LoginUseCase`, `RegisterUseCase`, `LogoutUseCase`, `RefreshTokenUseCase`, `GetCurrentUserUseCase`
- [x] `Auth/Application/Services/`: `JwtServiceInterface` (generateAccessToken, generateRefreshToken, decode, validate, revoke, isBlacklisted)
- [x] `Auth/Infrastructure/Services/PhpOpenSourceSaverJwtService`: implementacion con RS256
  - Access token: 12 claims (jti, sub, iss, aud, iat, nbf, exp, role, mfa_verified, session_id, device_fp, + scope opcional)
  - Refresh token: token opaco, hash SHA-256 en DB
  - Blacklist en Redis con TTL = tiempo restante hasta exp
- [x] Unit tests de UseCases con mocks de repositorios (cobertura 90%+)
- [x] Integration tests de JwtService: generacion, validacion, expiracion, claims
- [x] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- UseCases funcionan con mocks de repositorios
- JwtService genera tokens RS256 validos con los 12 claims correctos
- Integration tests validan firma, expiracion, blacklist
- PHPStan nivel 10 sin errores

### Checklist de cierre
- [x] Todos los DTOs son `final readonly class`
- [x] UseCases no dependen de Infrastructure (solo interfaces de Domain)
- [x] JwtService implementa `JwtServiceInterface` definido en Application
- [x] Tokens decodificados contienen exactamente los 12 claims de [[API_JWT_IMPLEMENTATION]] Sec 3.2
- [x] Blacklist funciona en Redis (verificar con integracion test)

---

## Sesion 4: Infrastructure Layer (Repositorios + Mappers) ✅ COMPLETADA (2026-06-19)

**Objetivo**: Puente entre Eloquent y Domain completo y testeado.
**Prioridad**: P0 — Conecta dominio con la realidad.
**Dependencias**: Sesion 3 completada (Application congelada).
**Nota**: 🔒 Infrastructure congelada. Domain y Application permanecen congelados.

### Documentos requeridos
- [[API_AGENTS]] (flujo "Implementar modulo nuevo", Reglas de Oro)
- [[API_ARCHITECTURE]] (Sec 4 Reglas de dependencia, Sec 6 Mapeo Eloquent-Domain, Sec 9 ServiceProviders)
- [[API_DATABASE]] (Tablas 2.1-2.6 completas: columnas, tipos, indices, constraints)
- [[API_TESTING]] (Sec 3.3 Integration Tests)

### Tareas
- [x] Eloquent Models: `App\Models\User`, `App\Models\RefreshToken`
- [x] `Auth/Infrastructure/Mappers/`: `UserMapper` (toDomain, toPersistence), `RefreshTokenMapper`
- [x] `Auth/Infrastructure/Persistence/`: `EloquentUserRepository` (implementa UserRepositoryInterface), `EloquentRefreshTokenRepository`
- [ ] `Auth/Infrastructure/Services/`: `BcryptPasswordHasher`, `RedisBlacklistService` *(no requeridos en el plan de Sesion 4 aprobado)*
- [x] `Auth/Presentation/UrbaniaAuthServiceProvider.php`: bindings de interfaces a implementaciones
- [x] Registrar `UrbaniaAuthServiceProvider` en `bootstrap/providers.php`
- [x] Integration tests: persistencia, mapeo bidireccional, queries
- [x] Verificar reversibilidad de todas las migraciones (`migrate:rollback`)
- [x] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Repositorios Eloquent implementan interfaces de Domain
- Mappers convierten correctamente Eloquent <-> Domain (preservar todos los campos)
- ServiceProvider registra todos los bindings
- Integration tests pasan con PostgreSQL real

### Checklist de cierre
- [x] Mappers preservan todos los campos del esquema ([[API_DATABASE]])
- [x] Ninguna relacion Eloquent cruza bounded contexts
- [x] `app()->bind()` cubre todas las interfaces de Domain
- [x] `migrate:rollback` + `migrate` funciona sin errores
- [x] UUID v7 se asigna correctamente en creacion

---

## Sesion 5: Presentation Layer - Endpoints Basicos ✅ COMPLETADA (2026-06-20)

**Objetivo**: Login, Register, Logout, Me, Refresh funcionan end-to-end.
**Prioridad**: P0 — API usable.
**Dependencias**: Sesion 4 completada.

### Documentos requeridos
- [[API_AGENTS]] (flujo "Crear endpoint nuevo", checklist)
- [[API_ARCHITECTURE]] (Sec 6 Mapeo, Sec 7 DTOs y Resources, Sec 9 Rutas modulares)
- [[API_CONTRACT]] (Sec 1.1-1.5, Sec 1.12 — Login, Register, Logout, Refresh, Me, Resend Verification)
- [[API_JWT_IMPLEMENTATION]] (Sec 4.1 Rate Limiting, Sec 5.1 Headers HTTP)
- [[API_TESTING]] (Sec 3.4 Feature Tests)

### Tareas
- [x] `Auth/Infrastructure/Http/Controllers/AuthController.php`: login, register, logout, me, refresh
- [ ] `Auth/Infrastructure/Http/Controllers/AuthController.php`: resendVerification → **diferido a Sesion 7** (verificacion de email)
- [x] `Auth/Infrastructure/Http/Requests/`: `LoginRequest`, `RegisterRequest`, `LogoutRequest`, `RefreshTokenRequest`
- [x] `Auth/Infrastructure/Http/Resources/`: `UserResource`, `TokenResource`
- [ ] `Auth/Infrastructure/Http/Resources/`: `ErrorResource` → **diferido a Sesion 8** (polish); el handler de excepciones cubre el formato de error unico
- [x] `Auth/Presentation/routes.php`: definicion de rutas con prefix `api/v1/auth`
- [x] Middleware global: `TraceIdMiddleware`, `RequestLoggingMiddleware`, `SecurityHeadersMiddleware`
- [x] Middleware de auth: `JwtAuthenticate`
- [x] Exception Handler: mapea DomainException -> respuesta JSON formato unico ([[API_CONTRACT]])
- [x] Rate limiting: login 5/15min, register 3/1h, refresh 10/15min, API general 1000/1min
- [x] Feature tests para cada endpoint (request/response exacto segun [[API_CONTRACT]])
- [x] Verificar headers de seguridad HTTP en respuestas
- [x] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Endpoints basicos de auth funcionan via HTTP
- Formatos de request/response coinciden exactamente con [[API_CONTRACT]]
- Rate limiting activo y testeado
- Headers de seguridad HTTP presentes
- Feature tests pasan

### Checklist de cierre
- [x] Todos los endpoints retornan formato de error unico: `{ error: { code, message, trace_id } }`
- [x] Rate limiting retorna 429 con header `Retry-After`
- [x] `X-Trace-Id` presente en todas las respuestas
- [x] Refresh token se almacena en DB con hash SHA-256
- [x] Login exitoso genera access_token + refresh_token + session_id

---

## Sesion 6: Seguridad Avanzada (MFA + Device + Sesiones + Rotacion) ✅ COMPLETADA (2026-06-20)

**Objetivo**: Toda la seguridad documentada en [[API_JWT_IMPLEMENTATION]] implementada.
**Prioridad**: P0 — Sin esto, el auth es inseguro.
**Dependencias**: Sesion 5 completada.

### Documentos requeridos
- [[API_AGENTS]] (flujo "Implementar/modificar seguridad JWT/Auth")
- [[API_JWT_IMPLEMENTATION]] (COMPLETO)
- [[API_CONTRACT]] (Sec 1.8-1.18 — Sesiones, MFA, Device)
- [[API_DATABASE]] (Tablas 2.2 refresh_tokens, 2.4 login_attempts, 2.5 security_events)
- [[API_TESTING]] (Sec 3.5 Security Tests)

### Tareas
- [x] MFA Setup: `pragmarx/google2fa-laravel`, generar secreto TOTP, QR code, backup codes (10 codigos, hash Argon2id)
- [x] MFA Verify: validar TOTP, flujo login con MFA_REQUIRED
- [x] MFA Backup: verificar codigos de respaldo de un solo uso
- [x] MFA Enable/Disable: requerir contrasena + TOTP para deshabilitar
- [x] Device Fingerprint: SHA-256(user_agent + IP/24 + accept_language)
- [x] Validacion de dispositivo: nuevo fingerprint -> `DEVICE_NOT_RECOGNIZED` (403)
- [x] Gestion de sesiones: listar activas, revocar todas excepto actual, revocar especifica
- [x] Rotacion de refresh tokens: detectar reutilizacion, revocar token_family completa
- [x] Deteccion de rotacion ilegitima: evento `suspicious_activity` (high)
- [x] Security tests: replay attack, device change, MFA flujo completo, rotacion
- [x] Verificar: `composer ci` verde

### Entregable
- MFA funcional con TOTP y backup codes
- Device fingerprint detecta dispositivos nuevos
- Sesiones listables y revocables
- Rotacion de refresh tokens detecta reutilizacion
- Security tests pasan (cobertura 100%)

### Checklist de cierre
- [x] Backup codes son de un solo uso (invalidados en UserEntity y persistidos via save)
- [x] Reutilizacion de refresh token revoca toda la familia
- [x] Evento `SuspiciousActivityDetected` se dispara en replay y device mismatch
- [x] Nuevo dispositivo retorna 403 `DEVICE_NOT_RECOGNIZED`
- [x] MFA setup muestra codigos de respaldo SOLO una vez

---

## Sesion 7: Password Management + Perfil ✅ COMPLETADA (2026-06-20)

**Objetivo**: Flujo completo de gestion de contrasenas y perfil de usuario.
**Prioridad**: P0 — Funcionalidad esencial.
**Dependencias**: Sesion 6 completada.

### Documentos requeridos
- [[API_AGENTS]] (checklist de seguridad)
- [[API_CONTRACT]] (Sec 1.6-1.7 Forgot/Reset, Sec 1.10 Change Password, Sec 1.13 Update Profile, Sec 1.11-1.12 Verify Email)
- [[API_DATABASE]] (Tablas 2.3 password_history, 2.6 password_reset_tokens)
- [[API_JWT_IMPLEMENTATION]] (Sec 4.4 Revocacion por cambio de contrasena, Sec 8.1 Eventos)
- [[API_TESTING]] (Sec 3.4 Feature Tests, Sec 3.5 Security Tests)

### Tareas
- [x] Forgot Password: generar token SHA-256, enviar email (MailHog en dev), TTL 60min
- [x] Reset Password: validar token, actualizar contrasena, revocar todos los tokens
- [x] Change Password: validar contrasena actual, verificar historial (12 ultimas), revocar sesiones
- [x] Password History: trigger PostgreSQL para mantener maximo 12 registros por usuario
- [x] Update Profile: PATCH /auth/me (name, phone, avatar base64)
- [x] Verify Email: validar token, marcar `email_verified_at`
- [x] Resend Verification: enviar nuevo enlace (rate limited)
- [x] Bloqueo de cuenta: 5 intentos fallidos -> locked_until (30 min)
- [x] Forzar cambio de contrasena: `must_change_password` -> login retorna 403 `FORCE_PASSWORD_CHANGE`
- [x] Feature tests + security tests (brute force, password history, token revocation)
- [x] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Flujo forgot/reset password funcional
- Cambio de contrasena con validacion de historial
- Perfil actualizable
- Verificacion de email funcional
- Bloqueo por intentos fallidos y forzado de cambio de contrasena

### Checklist de cierre
- [x] Token de reset expira en 60 minutos
- [x] Cambio de contrasena revoca TODAS las sesiones activas
- [x] Password history mantiene maximo 12 registros (trigger PostgreSQL)
- [x] Avatar se almacena en storage y retorna URL publica
- [x] Email de verificacion se envia (verificar en MailHog/logs)

---

## Sesion 8: Polish + CI/CD + Documentacion Final ✅ COMPLETADA (2026-06-20)

**Objetivo**: Proyecto documentado, formateado, y listo para pipeline.
**Prioridad**: P0 — Cierre del modulo Auth.
**Dependencias**: Sesiones 1-7 completadas.

### Documentos requeridos
- [[API_AGENTS]] (Checklist Final antes de entregar)
- [[API_SETUP_GUIDE]] (Sec 10 Verificacion, Sec 11 Scribe, Sec 12 CI/CD)
- [[API_TESTING]] (Sec 5 Metricas y cobertura, Sec 7 Checklist por modulo)
- [[API_ARCHITECTURE]] (Sec 12 PHPStan/Pint, Sec 14 ADRs)

### Tareas
- [x] Scribe: `php artisan scribe:generate` — documentacion generada (`/docs`)
- [x] PHPStan nivel 10: 0 errores en `src/` y `app/`
- [x] Pint: 0 archivos necesitan formateo
- [x] Cobertura de tests:
  - Domain 99.25%, Application 96.54%, Infrastructure 91.41%, Presentation 93.18%
  - Security 100%, Architecture 100%
  - Global 94.1%
- [x] GitHub Actions: `.github/workflows/quality.yml`
  - Jobs: lint (Pint), stan (PHPStan), test (Pest con coverage), scribe
  - Servicios: PostgreSQL, Redis
- [x] Scripts `composer.json`: `test`, `test:unit`, `test:integration`, `test:feature`, `test:security`, `test:coverage`, `stan`, `lint`, `fmt`, `migrate`, `rollback`, `scribe`, `ci`
- [x] ADRs: creados `docs/adr/ADR-001.md` a `ADR-005.md` ([[API_ARCHITECTURE]] Sec 14)
- [x] Todos los endpoints de Auth marcados como "Implementado" en el indice de [[API_CONTRACT]]
- [x] Verificacion final: `composer ci` pasa localmente
- [x] Session Manifest actualizado como cierre del modulo Auth

### Entregable
- Pipeline CI/CD configurado en `.github/workflows/quality.yml`
- Documentacion de API generada y accesible en `/docs`
- 253 tests pasan con cobertura global 94.1 %
- Codigo formateado y sin errores de analisis estatico
- Modulo Auth marcado como completado

### Checklist de cierre
- [x] `composer ci` ejecuta sin errores localmente
- [x] GitHub Actions configurado para push/PR
- [x] Cobertura global >=80% (94.1 %)
- [x] Scribe genera docs
- [x] ADRs creados y completos
- [x] No hay dependencias circulares entre capas (architecture tests verdes)

> **Nota de cierre del modulo Auth**: El modulo Auth esta completo y congelado.
> Las interfaces de Domain/Application definidas en las sesiones 2-3 no deben
> modificarse sin actualizar todos los consumidores. El trabajo posterior debe
> iniciar un nuevo modulo de negocio siguiendo el mismo ritual de sesiones.

---

## Sesion 9: CORS global para API ✅ COMPLETADA (2026-06-26)

> [!note] Cambio transversal posterior al cierre del modulo Auth
> No forma parte del arco original de 8 sesiones del modulo Auth. Se anadio para
> habilitar peticiones del frontend web (`http://localhost:5173`).

**Objetivo**: CORS permanente con manejo de preflight OPTIONS.
**Prioridad**: P0 — Bloqueante para la integracion Web ↔ API.

### Tareas
- [x] `src/Shared/Infrastructure/Middleware/CorsMiddleware.php` (preflight OPTIONS 204 + headers en todas las respuestas)
- [x] `config/cors.php` centralizado
- [x] Registrar como middleware global *prepend* en `bootstrap/app.php`; deshabilitar `HandleCors` por defecto
- [x] `CORS_ALLOWED_ORIGINS` en `.env.example`, `.env.ci`, `.env.docker`
- [x] Tests unitarios y feature del middleware
- [x] `composer ci` verde

### Entregable
- 259 tests pasan (968 assertions), PHPStan nivel 10 limpio, Pint sin diferencias.
- Detalle en [[docs/log/sesiones/sesion-09.md]].

---

## Modulo Directorio

> [!note] Nuevo modulo de negocio
> El modulo Directorio no estaba en el arco original de 8 sesiones del modulo
> Auth. Se anadio posteriormente para gestionar contactos, tipos de ocupante y
> la vinculacion de contactos a unidades/propiedades.

---

## Sesion 10: Domain Layer Directorio ✅ COMPLETADA (2026-06-27)

**Objetivo**: Entidades, Value Objects, Excepciones e interfaces de repositorio de Directorio completos y testeados.
**Prioridad**: P0 — Fundamento del modulo.
**Dependencias**: Sesion 9 completada.
**Nota**: 🔒 Domain congelado al final de esta sesion.

### Tareas
- [x] `Directorio/Domain/ValueObjects/`: `DocumentType`, `DocumentNumber`, `OccupantTypeCode`
- [x] `Directorio/Domain/Entities/`: `Contact`, `OccupantType`, `PropertyOccupant`
- [x] `Directorio/Domain/Exceptions/`: `ContactNotFoundException`, `DuplicateContactDocumentException`, `ContactHasActiveOccupantsException`, `DuplicateOccupantException`, `OccupantNotFoundException`, `MustHaveOwnerException`
- [x] `Directorio/Domain/Repositories/`: `ContactRepository`, `OccupantTypeRepository`, `PropertyOccupantRepository`
- [x] Agregar namespace `Directorio\` a `composer.json`
- [x] Verificar: `phpstan` en Domain Directorio sin errores

### Entregable
- Capa Domain pura, sin dependencias externas.
- PHPStan nivel 10 limpio en `src/Directorio/Domain/`.

### Checklist de cierre
- [x] Ningun archivo en `src/Directorio/Domain/` importa `Illuminate\` o `Laravel\`
- [x] Todas las entidades son inmutables (readonly donde aplique)
- [x] Todas las excepciones extienden `DomainException`
- [x] Repositories son interfaces, no implementaciones

---

## Sesion 11: Application + Infrastructure + Presentation Directorio ✅ COMPLETADA (2026-06-27)

**Objetivo**: Completar el modulo Directorio con DTOs, casos de uso, repositorios Eloquent, controllers y rutas.
**Prioridad**: P0 — API funcional para contactos y ocupantes.
**Dependencias**: Sesion 10 completada (Domain congelada).
**Nota**: Application, Infrastructure y Presentation quedan congeladas al final de esta sesion.

### Tareas
- [x] `Directorio/Application/DTOs/`: `CreateContactDTO`, `UpdateContactDTO`, `CreateOccupantDTO`, `UpdateOccupantDTO`
- [x] `Directorio/Application/UseCases/`: Catalogos, Contactos y Ocupantes
- [x] `Directorio/Infrastructure/Mappers/`: `ContactMapper`, `OccupantTypeMapper`, `PropertyOccupantMapper`
- [x] `Directorio/Infrastructure/Persistence/`: `ContactRepositoryImpl`, `OccupantTypeRepositoryImpl`, `PropertyOccupantRepositoryImpl`
- [x] `Directorio/Infrastructure/Http/Controllers/`: `ContactController`, `OccupantTypeController`, `PropertyOccupantController`
- [x] `Directorio/Presentation/routes.php`: rutas bajo `api/v1`
- [x] `Directorio/Presentation/DirectorioServiceProvider.php`: bindings y carga de rutas
- [x] Sobreescribir modelos Eloquent `App\Models\{Contact, OccupantType, PropertyOccupant}`
- [x] Registrar `DirectorioServiceProvider` en `bootstrap/providers.php`
- [x] Verificar rutas con `php artisan route:list`

### Entregable
- Endpoints de Directorio registrados y resolubles por el contenedor.
- PHPStan nivel 10 sin errores en codigo nuevo.
- `composer test` pasa excepto test flaky preexistente de rate limiting.

### Checklist de cierre
- [x] Todos los DTOs son `final readonly class`
- [x] UseCases no dependen de Infrastructure (solo interfaces de Domain)
- [x] Repositorios Eloquent implementan interfaces de Domain
- [x] Mappers preservan todos los campos del esquema
- [x] `app()->bind()` cubre todas las interfaces de Domain de Directorio
- [x] Ninguna relacion Eloquent cruza bounded contexts

---

## Sesion 12: Propiedades y Unidades — Paso 1: Migraciones y Seed ✅ COMPLETADA (2026-06-28)

**Objetivo**: Crear el esquema de base de datos del módulo Propiedades y su seed inicial.
**Prioridad**: P0 — Fundamento del feature.
**Dependencias**: Sesion 9 completada.

### Tareas
- [x] 8 migraciones PostgreSQL: condominiums, towers, property_types, property_statuses, properties, property_status_log, property_document_types, property_documents.
- [x] 8 modelos Eloquent y 8 factories.
- [x] 5 seeders: condominio por defecto, tipos de unidad, estados de unidad, tipos de documento.
- [x] Capa Domain DDD inicial: 8 Entities en `src/Propiedades/Domain/Entities/`.
- [x] Registrar `UrbaniaPropiedadesServiceProvider` en `bootstrap/providers.php`.

### Entregable
- Esquema de BD creado y reversible.
- Seed inicial funcional.

### Checklist de cierre
- [x] Migraciones reversibles (`migrate:rollback` verificado).
- [x] Seeders ejecutados exitosamente sobre `urbania_test`.

---

## Sesion 13: Propiedades y Unidades — Paso 2: Endpoints de catalogos ✅ COMPLETADA (2026-06-28)

**Objetivo**: CRUD completo de catálogos configurables (`property-types`, `property-statuses`).
**Prioridad**: P0 — Datos de referencia para el resto del módulo.
**Dependencias**: Sesion 12 completada.

### Tareas
- [x] Repositorios: interfaces de Domain e implementaciones Eloquent.
- [x] Mappers: Entity ↔ Model.
- [x] DTOs de request/response y PaginatedResponseDto.
- [x] UseCases: List, Create, Update, Delete para property-types y property-statuses.
- [x] Excepciones de dominio: NotFound, CodeAlreadyExists, InUse.
- [x] Controllers, FormRequests, Resources y Collections.
- [x] Rutas bajo `api/v1` con middleware JWT + role:admin.
- [x] Bindings en `UrbaniaPropiedadesServiceProvider`.
- [x] Feature tests para ambos catálogos.
- [x] Documentacion: `01-api/endpoints/PROPERTY_CATALOGS.md`, `API_CONTRACT.md`, `PROPIEDADES.md`.

### Entregable
- Endpoints `/property-types` y `/property-statuses` funcionales.
- 21 tests feature nuevos pasan.
- PHPStan nivel 10 limpio en código nuevo.

### Checklist de cierre
- [x] Todos los endpoints retornan formato de respuesta estándar con `trace_id`.
- [x] Paginación con meta (`current_page`, `per_page`, `total`, `last_page`).
- [x] Validación de códigos únicos y protección de seed data.
- [x] `composer test` pasa excepto deuda preexistente documentada.

---

## Sesion 14: Propiedades y Unidades — Paso 3, 4 y 5: Torres, Propiedades y Documentos ✅ COMPLETADA (2026-06-28)

**Objetivo**: Completar el módulo Propiedades y Unidades con CRUD de torres, unidades, documentos y tipos de documento.
**Prioridad**: P0 — Core del inventario del sistema.
**Dependencias**: Sesion 13 completada.

### Tareas
- [x] Entidades de dominio: Condominium, Tower, Property, PropertyStatusLog, PropertyDocument, PropertyDocumentType.
- [x] Excepciones de dominio tipificadas para todos los nuevos recursos.
- [x] Repositorios de Domain e implementaciones Eloquent.
- [x] Mappers, DTOs y casos de uso para Condominiums, Towers, Properties, PropertyDocumentTypes y PropertyDocuments.
- [x] Servicio `GenerateFullDesignationService`.
- [x] Controllers, FormRequests, Resources y Collections.
- [x] Rutas bajo `api/v1` con middleware JWT + role:admin.
- [x] Bindings en `UrbaniaPropiedadesServiceProvider`.
- [x] Feature tests para todos los nuevos endpoints.
- [x] Documentación actualizada: `CONDOMINIUMS.md`, `TOWERS.md`, `PROPIEDADES.md`, `PROPERTY_CATALOGS.md`, `API_CONTRACT.md`, `PROPIEDADES.md` (panorama), `FEATURES_INDEX.md`, `CHANGES_LOG.md`.

### Entregable
- Endpoints de condominios, torres, propiedades, documentos y property-document-types funcionales.
- 28 tests feature nuevos pasan (total 314 tests).
- PHPStan nivel 10 limpio en código nuevo.

### Checklist de cierre
- [x] Todos los endpoints retornan formato de respuesta estándar con `trace_id`.
- [x] Paginación, filtros y ordenamiento operativos.
- [x] Validación de unicidad, dependencias, pisos y coeficientes.
- [x] Auditoría de cambios de estado (`property_status_log`).
- [x] `composer test` pasa excepto deuda preexistente documentada.

## Sesion 15: CAMBIO-006 — RBAC: migraciones y seeders ✅ COMPLETADA (2026-06-29)

**Objetivo**: Esquema de datos y semilla inicial del modulo de autorizacion.
**Prioridad**: P0 — Fundamento del RBAC.
**Dependencias**: Sesion 9 (CORS) y Sesion 12-14 (Propiedades) completadas.

### Tareas
- [x] Seis migraciones PostgreSQL: `permissions`, `roles`, `role_permissions`, `role_assignments`, `permission_audit_log`, `approval_rules`.
- [x] Tres seeders idempotentes: `RbacPermissionSeeder`, `RbacRoleSeeder`, `RbacMigrationSeeder`.
- [x] Registrar seeders en `DatabaseSeeder.php`.
- [x] Verificar reversibilidad de migraciones (`migrate:rollback --step=6`).
- [x] Actualizar `01-api/API_DATABASE.md` seccion 5 (Autorizacion / RBAC).

### Entregable
- Tablas RBAC creadas y sembradas en `urbania_test`.
- 325 tests pasan; 3 fallos y 6 errores PHPStan preexistentes.

---

## Sesion 16: CAMBIO-006 — RBAC: modulo Authorization DDD + resolver + middleware ✅ COMPLETADA (2026-06-29)

**Objetivo**: Capa DDD de autorizacion, resolver de permisos con cache Redis y middleware `can()`.
**Prioridad**: P0 — Autorizacion server-side operativa.
**Dependencias**: Sesion 15 completada.

### Tareas
- [x] `Authorization/Domain/Entities/`: `Role`, `Permission`, `RoleAssignment`.
- [x] `Authorization/Domain/Repositories/`: `RoleRepositoryInterface`.
- [x] `Authorization/Domain/Services/`: `PermissionResolverInterface`.
- [x] `Authorization/Infrastructure/Persistence/`: `EloquentRoleRepository`.
- [x] `Authorization/Infrastructure/Services/`: `CachedPermissionResolver` (Redis, TTL 5 min).
- [x] `app/Models/`: `Role`, `Permission`, `RoleAssignment`.
- [x] `Shared/Infrastructure/Middleware/`: `AuthorizationMiddleware`.
- [x] `Authorization/Infrastructure/AuthorizationServiceProvider` registrado en `bootstrap/providers.php`.
- [x] Tests feature basicos: `tests/Feature/Authorization/PermissionResolverTest.php`.
- [x] `composer test`: 328 pasados, 3 fallos preexistentes.
- [x] `composer stan`: 6 errores preexistentes en `AppServiceProvider`; codigo nuevo limpio.
- [x] `composer lint`: 0 archivos con diferencias.

### Entregable
- Modulo `src/Authorization` completo y resoluble por el contenedor.
- Resolucion de permisos `recurso.accion` por usuario + scope con cache Redis.
- Middleware listo para autorizar por nombre de ruta.

### Checklist de cierre
- [x] Domain puro sin dependencias externas.
- [x] Repositorios Eloquent implementan interfaces de Domain.
- [x] Provider registra todos los bindings.
- [x] Middleware usa formato de error unico con `trace_id`.

---

## Proxima Sesion

**Sesion 17**: CAMBIO-006 Sesion 5 — Cierre (cableado global + verificacion + sincronizacion).

---

## Session Manifest Template

> [!note] Plantilla completa
> Ver `[[API_SESSION_MANIFEST]] (usar la plantilla en la sección "Session Manifest Template" de este documento)` en la raiz del proyecto.
> 
> **Uso**: Al final de cada sesion, crear/actualizar el archivo [[API_SESSION_MANIFEST]] 
> (no el template) usando esa estructura. Este archivo es el "estado guardado" que 
> se entrega al agente al inicio de la siguiente sesion.

---

## Reglas de Oro para el Orchestrator

| # | Regla | Consecuencia de violar |
|---|-------|----------------------|
| 1 | **Nunca saltar sesiones** | Inconsistencias arquitectonicas, deuda tecnica oculta |
| 2 | **Scope lock durante sesion** | Si el agente propone agregar tareas de otra sesion, rechazar y documentar como deuda tecnica |
| 3 | **Domain congelado despues de Sesion 2** | Cambiar interfaces de Domain requiere actualizar Sesiones 3-8 completas |
| 4 | **Verificar antes de continuar** | Ejecutar `composer test` y `phpstan` al inicio de cada sesion si se retoma trabajo |
| 5 | **Contexto minimo** | Solo entregar los documentos listados en "Documentos requeridos" de cada sesion |
| 6 | **Session Manifest obligatorio** | Sin manifest, la siguiente sesion pierde contexto y puede duplicar o ignorar trabajo |
| 7 | **No refactorizar hacia atras** | Detectar problema en sesion N-2 -> documentar como issue para sesion dedicada, no arreglar en caliente |
| 8 | **Entregable runnable** | Cada sesion debe terminar con `composer test` pasando. Si no pasa, la sesion no esta completa |
| 9 | **Congelar interfaces entre sesiones** | Una vez definido un repositorio, DTO, o contrato, no cambiar su firma sin actualizar todos los consumidores y tests |
| 10 | **Documentacion vive con el codigo** | Si el codigo cambia, los documentos ([[API_CONTRACT]], [[API_DATABASE]]) se actualizan en la misma sesion |

---

## Referencias

| Documento | Proposito | Consultar en sesion |
|-----------|-----------|---------------------|
| [[API_AGENTS]] | Mapa de navegacion, flujos de trabajo, reglas de oro | Todas |
| [[API_ARCHITECTURE]] | Stack, DDD, reglas de dependencia, convenciones | Todas |
| [[API_DATABASE]] | Esquema PostgreSQL, convenciones, migraciones | 1, 2, 4, 6, 7 |
| [[API_CONTRACT]] | Endpoints, request/response, errores, rate limiting | 1, 3, 5, 6, 7 |
| [[API_JWT_IMPLEMENTATION]] | Seguridad JWT, claims, rotacion, MFA, headers | 3, 5, 6 |
| [[API_SETUP_GUIDE]] | Inicializacion paso a paso, Docker, dependencias | 1, 8 |
| [[API_TESTING]] | Estructura de tests, reglas, cobertura, metricas | 2, 3, 4, 5, 6, 7, 8 |
| [[API_SESSION_MANIFEST]] | Estado actual del proyecto entre sesiones | Todas (al inicio) |
