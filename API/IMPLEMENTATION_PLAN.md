---
type: meta
status: active
priority: P0
tags: [planning, sessions]
updated: 2026-06-17
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
```

---

## Sesion 1: Setup + Slice Vertical Minimo

**Objetivo**: Infraestructura funcionando, endpoint `/health` operativo.
**Prioridad**: P0 — Bloqueante. Sin esto no hay proyecto.
**Dependencias**: Ninguna.

### Documentos requeridos
- [[AGENTS]] (mapa de navegacion)
- [[ARCHITECTURE]] (Sec 1 Stack, Sec 2 Estructura DDD, Sec 9 Autoloading, Sec 11 Docker, Sec 12 Calidad, Sec 13 Variables de entorno)
- [[SETUP_GUIDE]] (Sec 1-6, Sec 9)
- [[DATABASE]] (Convenciones de nomenclatura, tablas 2.1-2.6 esquema)
- [[API_CONTRACT]] (Sec 11 Health Check)
- [[TESTING]] (Sec 2 Configuracion, Sec 3.4 Feature Tests)

> [!note] Nota
> [[SESSION_MANIFEST]] se CREA al final de esta sesión. No existe al inicio.

### Tareas
- [ ] Crear proyecto Laravel ^13.0 con estructura DDD (`src/Shared/`, `src/Auth/`)
- [ ] Configurar autoloading PSR-4 en `composer.json`
- [ ] Docker Compose: app (PHP 8.5-fpm), nginx, PostgreSQL 18.4, Redis 7
- [ ] Instalar dependencias: JWT, Pest, PHPStan, Larastan, Pint, ramsey/uuid, Scribe
- [ ] Generar claves RSA 4096 bits para RS256 (`storage/jwt/`)
- [ ] Crear 6 migraciones de auth: users, refresh_tokens, password_history, login_attempts, security_events, password_reset_tokens
- [ ] Implementar endpoint `GET /api/v1/health` (sin autenticacion)
- [ ] Configurar `phpstan.neon` (nivel 10) y `pint.json`
- [ ] Feature test: Health check retorna 200 (healthy) / 503 (unhealthy)
- [ ] Verificar: `composer test` pasa, `phpstan analyse` pasa, `pint` sin cambios

### Entregable
- `docker compose up -d --build` levanta todos los servicios
- `curl http://localhost:8080/api/v1/health` retorna JSON con status y checks
- `composer test` ejecuta y pasa (minimo: health check test)
- `phpstan analyse` nivel 10 sin errores
- `vendor/bin/pint --test` sin diferencias

### Checklist de cierre
- [ ] Todos los servicios Docker saludables
- [ ] Migraciones ejecutadas y reversibles (`migrate:rollback` funciona)
- [ ] Estructura de directorios DDD completa en `src/`
- [ ] `composer.json` con autoloading PSR-4 correcto
- [ ] `.env` configurado con variables de [[ARCHITECTURE]] Sec 13
- [ ] Archivos Docker: Dockerfile, docker-compose.yml, docker-entrypoint.sh, .env.docker

---

## Sesion 2: Domain Layer Auth

**Objetivo**: Entidades, Value Objects, Excepciones, Eventos de Auth completos y testeados.
**Prioridad**: P0 — Fundamento de todo el modulo.
**Dependencias**: Sesion 1 completada.

### Documentos requeridos
- [[AGENTS]] (Reglas de Oro, flujo "Implementar modulo nuevo")
- [[ARCHITECTURE]] (Sec 2 Arquitectura DDD, Sec 3 Convenciones, Sec 4 Reglas de dependencia, Sec 5 Excepciones, Sec 6 Mapeo)
- [[DATABASE]] (Convenciones, tablas 2.1-2.6 para entender el dominio)
- [[JWT_IMPLEMENTATION]] (Sec 3.2 Claims, Sec 3.3 Parametros temporales — para entender que necesita el dominio)
- [[TESTING]] (Sec 3.1 Architecture Tests, Sec 3.2 Unit Tests, Sec 6 Reglas de escritura)

### Tareas
- [ ] `Shared/Domain/`: `DomainException` (abstracta), `Uuid` VO, `Email` VO
- [ ] `Auth/Domain/Entities/`: `UserEntity`, `RefreshTokenEntity`
- [ ] `Auth/Domain/ValueObjects/`: `Password`, `UserRole` (enum), `UserStatus` (enum), `DeviceFingerprint`, `JwtToken`, `SessionId`
- [ ] `Auth/Domain/Exceptions/`: `InvalidCredentialsException`, `TokenExpiredException`, `TokenInvalidException`, `UserNotFoundException`, `UserLockedException`, `MfaRequiredException`, `MfaInvalidCodeException`, `DeviceNotRecognizedException`, `SessionNotFoundException`, `PasswordReusedException`, `EmailAlreadyExistsException`
- [ ] `Auth/Domain/Events/`: `UserLoggedIn`, `UserRegistered`, `UserLoggedOut`, `PasswordChanged`, `MfaEnabled`, `MfaDisabled`, `SuspiciousActivityDetected`
- [ ] `Auth/Domain/Repositories/`: `UserRepositoryInterface` (findByEmail, findById, save, update, delete, existsByEmail), `RefreshTokenRepositoryInterface` (findByHash, save, revoke, revokeAllByUser, findActiveByUser, existsByHash)
- [ ] Architecture tests: Domain no depende de Illuminate, Laravel, otras capas, ni otros bounded contexts
- [ ] Unit tests: cobertura 95%+ de Domain (entities, VO, exceptions, events)
- [ ] Verificar: `pest --filter=Unit` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Capa Domain completa, pura, sin dependencias externas
- Tests unitarios pasan con cobertura >=95%
- Architecture tests verifican independencia de Domain
- PHPStan nivel 10 sin errores

### Checklist de cierre
- [ ] Ningun archivo en `src/*/Domain/` importa `Illuminate\` o `Laravel\`
- [ ] Todos los VO son inmutables (readonly donde aplique)
- [ ] Todas las excepciones extienden `DomainException`
- [ ] Repositories son interfaces, no implementaciones
- [ ] Eventos son objetos inmutables con datos de dominio

---

## Sesion 3: Application Layer + JWT Service

**Objetivo**: Casos de uso orquestan el dominio; servicio JWT genera tokens RS256 validos.
**Prioridad**: P0 — Core del sistema.
**Dependencias**: Sesion 2 completada (Domain congelada).

### Documentos requeridos
- [[AGENTS]] (flujo "Implementar modulo nuevo", checklist)
- [[ARCHITECTURE]] (Sec 4 Reglas de dependencia, Sec 6 Mapeo, Sec 7 DTOs y Resources)
- [[JWT_IMPLEMENTATION]] (COMPLETO excepto Sec 6 Almacenamiento en clientes y Sec 9 Post-despliegue)
- [[API_CONTRACT]] (Estructura de tokens en Sec 1.1, Sec 1.4)
- [[TESTING]] (Sec 3.2 Unit Tests, Sec 3.3 Integration Tests)

### Tareas
- [ ] `Shared/Application/`: `CommandBusInterface`, `QueryBusInterface`, `EventBusInterface` (contratos)
- [ ] `Auth/Application/DTOs/` (todos `final readonly class`):
  - Request: `LoginRequestDto`, `RegisterRequestDto`, `RefreshTokenRequestDto`, `LogoutRequestDto`, `MfaVerifyRequestDto`, `MfaSetupRequestDto`, `ForgotPasswordRequestDto`, `ResetPasswordRequestDto`, `ChangePasswordRequestDto`, `UpdateProfileRequestDto`
  - Response: `LoginResponseDto`, `RegisterResponseDto`, `TokenResponseDto`, `UserResponseDto`, `MfaSetupResponseDto`, `SessionResponseDto`
- [ ] `Auth/Application/UseCases/`: `LoginUseCase`, `RegisterUseCase`, `LogoutUseCase`, `RefreshTokenUseCase`, `GetCurrentUserUseCase`
- [ ] `Auth/Application/Services/`: `JwtServiceInterface` (generateAccessToken, generateRefreshToken, decode, validate, revoke, isBlacklisted)
- [ ] `Auth/Infrastructure/Services/PhpOpenSourceSaverJwtService`: implementacion con RS256
  - Access token: 12 claims (jti, sub, iss, aud, iat, nbf, exp, scope, role, mfa_verified, session_id, device_fp)
  - Refresh token: token opaco, hash SHA-256 en DB
  - Blacklist en Redis con TTL = tiempo restante hasta exp
- [ ] Unit tests de UseCases con mocks de repositorios (cobertura 90%+)
- [ ] Integration tests de JwtService: generacion, validacion, expiracion, claims
- [ ] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- UseCases funcionan con mocks de repositorios
- JwtService genera tokens RS256 validos con los 12 claims correctos
- Integration tests validan firma, expiracion, blacklist
- PHPStan nivel 10 sin errores

### Checklist de cierre
- [ ] Todos los DTOs son `final readonly class`
- [ ] UseCases no dependen de Infrastructure (solo interfaces de Domain)
- [ ] JwtService implementa `JwtServiceInterface` definido en Application
- [ ] Tokens decodificados contienen exactamente los 12 claims de [[JWT_IMPLEMENTATION]] Sec 3.2
- [ ] Blacklist funciona en Redis (verificar con `redis-cli`)

---

## Sesion 4: Infrastructure Layer (Repositorios + Mappers)

**Objetivo**: Puente entre Eloquent y Domain completo y testeado.
**Prioridad**: P0 — Conecta dominio con la realidad.
**Dependencias**: Sesion 3 completada (Application congelada).

### Documentos requeridos
- [[AGENTS]] (flujo "Implementar modulo nuevo", Reglas de Oro)
- [[ARCHITECTURE]] (Sec 4 Reglas de dependencia, Sec 6 Mapeo Eloquent-Domain, Sec 9 ServiceProviders)
- [[DATABASE]] (Tablas 2.1-2.6 completas: columnas, tipos, indices, constraints)
- [[TESTING]] (Sec 3.3 Integration Tests)

### Tareas
- [ ] Eloquent Models: `App\Models\User`, `App\Models\RefreshToken` (o en `src/Auth/Infrastructure/Persistence/` segun decision del proyecto)
- [ ] `Auth/Infrastructure/Mappers/`: `UserMapper` (toDomain, toEloquent), `RefreshTokenMapper`
- [ ] `Auth/Infrastructure/Persistence/`: `EloquentUserRepository` (implementa UserRepositoryInterface), `EloquentRefreshTokenRepository`
- [ ] `Auth/Infrastructure/Services/`: `BcryptPasswordHasher`, `RedisBlacklistService`
- [ ] `Auth/Presentation/AuthServiceProvider.php`: bindings de interfaces a implementaciones
- [ ] Registrar `AuthServiceProvider` en `config/app.php`
- [ ] Integration tests: persistencia, mapeo bidireccional, queries, transacciones
- [ ] Verificar reversibilidad de todas las migraciones (`migrate:rollback`)
- [ ] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Repositorios Eloquent implementan interfaces de Domain
- Mappers convierten correctamente Eloquent <-> Domain (preservar todos los campos)
- ServiceProvider registra todos los bindings
- Integration tests pasan con PostgreSQL real

### Checklist de cierre
- [ ] Mappers preservan todos los campos del esquema ([[DATABASE]])
- [ ] Ninguna relacion Eloquent cruza bounded contexts
- [ ] `app()->bind()` cubre todas las interfaces de Domain
- [ ] `migrate:rollback` + `migrate` funciona sin errores
- [ ] UUID v7 se asigna correctamente en creacion

---

## Sesion 5: Presentation Layer - Endpoints Basicos

**Objetivo**: Login, Register, Logout, Me, Refresh funcionan end-to-end.
**Prioridad**: P0 — API usable.
**Dependencias**: Sesion 4 completada.

### Documentos requeridos
- [[AGENTS]] (flujo "Crear endpoint nuevo", checklist)
- [[ARCHITECTURE]] (Sec 6 Mapeo, Sec 7 DTOs y Resources, Sec 9 Rutas modulares)
- [[API_CONTRACT]] (Sec 1.1-1.5, Sec 1.12 — Login, Register, Logout, Refresh, Me, Resend Verification)
- [[JWT_IMPLEMENTATION]] (Sec 4.1 Rate Limiting, Sec 5.1 Headers HTTP)
- [[TESTING]] (Sec 3.4 Feature Tests)

### Tareas
- [ ] `Auth/Infrastructure/Http/Controllers/AuthController.php`: login, register, logout, me, refresh, resendVerification
- [ ] `Auth/Infrastructure/Http/Requests/`: `LoginRequest`, `RegisterRequest`, `LogoutRequest`, `RefreshTokenRequest`
- [ ] `Auth/Infrastructure/Http/Resources/`: `UserResource`, `TokenResource`, `ErrorResource`
- [ ] `Auth/Presentation/routes.php`: definicion de rutas con prefix `api/v1/auth`
- [ ] Middleware global: `TraceIdMiddleware`, `RequestLoggingMiddleware`
- [ ] Exception Handler: mapea DomainException -> respuesta JSON formato unico ([[API_CONTRACT]])
- [ ] Rate limiting: login 5/15min, register 3/1h, refresh 10/15min, API general 1000/1min
- [ ] Feature tests para cada endpoint (request/response exacto segun [[API_CONTRACT]])
- [ ] Verificar headers de seguridad HTTP en respuestas
- [ ] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Endpoints basicos de auth funcionan via HTTP
- Formatos de request/response coinciden exactamente con [[API_CONTRACT]]
- Rate limiting activo y testeado
- Headers de seguridad HTTP presentes
- Feature tests pasan

### Checklist de cierre
- [ ] Todos los endpoints retornan formato de error unico: `{ error: { code, message, trace_id } }`
- [ ] Rate limiting retorna 429 con header `Retry-After`
- [ ] `X-Trace-Id` presente en todas las respuestas
- [ ] Refresh token se almacena en DB con hash SHA-256
- [ ] Login exitoso genera access_token + refresh_token + session_id

---

## Sesion 6: Seguridad Avanzada (MFA + Device + Sesiones + Rotacion)

**Objetivo**: Toda la seguridad documentada en [[JWT_IMPLEMENTATION]] implementada.
**Prioridad**: P0 — Sin esto, el auth es inseguro.
**Dependencias**: Sesion 5 completada.

### Documentos requeridos
- [[AGENTS]] (flujo "Implementar/modificar seguridad JWT/Auth")
- [[JWT_IMPLEMENTATION]] (COMPLETO)
- [[API_CONTRACT]] (Sec 1.8-1.18 — Sesiones, MFA, Device)
- [[DATABASE]] (Tablas 2.2 refresh_tokens, 2.4 login_attempts, 2.5 security_events)
- [[TESTING]] (Sec 3.5 Security Tests)

### Tareas
- [ ] MFA Setup: `pragmarx/google2fa-laravel`, generar secreto TOTP, QR code, backup codes (10 codigos, hash Argon2id)
- [ ] MFA Verify: validar TOTP (ventana +/-1 periodo = 90s), flujo login con MFA_REQUIRED
- [ ] MFA Backup: verificar codigos de respaldo de un solo uso
- [ ] MFA Enable/Disable: requerir contrasena + TOTP para deshabilitar
- [ ] Device Fingerprint: SHA-256(user_agent + IP/24 + accept_language)
- [ ] Validacion de dispositivo: nuevo fingerprint -> `DEVICE_NOT_RECOGNIZED` (403)
- [ ] Gestion de sesiones: listar activas, revocar todas excepto actual, revocar especifica
- [ ] Rotacion de refresh tokens: detectar reutilizacion, revocar token_family completa
- [ ] Deteccion de rotacion ilegitima: evento `suspicious_activity` (high), notificar usuario
- [ ] Security tests: replay attack, device change, MFA flujo completo, rotacion
- [ ] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- MFA funcional con TOTP y backup codes
- Device fingerprint detecta dispositivos nuevos
- Sesiones listables y revocables
- Rotacion de refresh tokens detecta reutilizacion
- Security tests pasan (cobertura 100%)

### Checklist de cierre
- [ ] Backup codes son de un solo uso (verificar en DB que se invalidan)
- [ ] Reutilizacion de refresh token revoca toda la familia
- [ ] Evento `suspicious_activity` se registra en `security_events` con severity `high`
- [ ] Nuevo dispositivo retorna 403 `DEVICE_NOT_RECOGNIZED`
- [ ] MFA setup muestra codigos de respaldo SOLO una vez

---

## Sesion 7: Password Management + Perfil

**Objetivo**: Flujo completo de gestion de contrasenas y perfil de usuario.
**Prioridad**: P0 — Funcionalidad esencial.
**Dependencias**: Sesion 6 completada.

### Documentos requeridos
- [[AGENTS]] (checklist de seguridad)
- [[API_CONTRACT]] (Sec 1.6-1.7 Forgot/Reset, Sec 1.10 Change Password, Sec 1.13 Update Profile, Sec 1.11-1.12 Verify Email)
- [[DATABASE]] (Tablas 2.3 password_history, 2.6 password_reset_tokens)
- [[JWT_IMPLEMENTATION]] (Sec 4.4 Revocacion por cambio de contrasena, Sec 8.1 Eventos)
- [[TESTING]] (Sec 3.4 Feature Tests, Sec 3.5 Security Tests)

### Tareas
- [ ] Forgot Password: generar token SHA-256, enviar email (MailHog en dev), TTL 60min
- [ ] Reset Password: validar token, actualizar contrasena, revocar todos los tokens
- [ ] Change Password: validar contrasena actual, verificar historial (12 ultimas), revocar sesiones
- [ ] Password History: trigger PostgreSQL para mantener maximo 12 registros por usuario
- [ ] Update Profile: PATCH /auth/me (name, phone, avatar base64)
- [ ] Verify Email: validar token, marcar `email_verified_at`
- [ ] Resend Verification: enviar nuevo enlace (rate limited)
- [ ] Bloqueo de cuenta: 5 intentos fallidos -> locked_until (30 min)
- [ ] Forzar cambio de contrasena: `must_change_password` -> login retorna 403 `FORCE_PASSWORD_CHANGE`
- [ ] Feature tests + security tests (brute force, password history, token revocation)
- [ ] Verificar: `composer test` pasa, `phpstan` pasa, `pint` sin cambios

### Entregable
- Flujo forgot/reset password funcional
- Cambio de contrasena con validacion de historial
- Perfil actualizable
- Verificacion de email funcional
- Bloqueo por intentos fallidos y forzado de cambio de contrasena

### Checklist de cierre
- [ ] Token de reset expira en 60 minutos
- [ ] Cambio de contrasena revoca TODAS las sesiones activas
- [ ] Password history mantiene maximo 12 registros (trigger PostgreSQL)
- [ ] Avatar se almacena en storage y retorna URL publica
- [ ] Email de verificacion se envia (verificar en MailHog/logs)

---

## Sesion 8: Polish + CI/CD + Documentacion Final

**Objetivo**: Proyecto documentado, formateado, y listo para pipeline.
**Prioridad**: P0 — Cierre del modulo Auth.
**Dependencias**: Sesiones 1-7 completadas.

### Documentos requeridos
- [[AGENTS]] (Checklist Final antes de entregar)
- [[SETUP_GUIDE]] (Sec 10 Verificacion, Sec 11 Scribe, Sec 12 CI/CD)
- [[TESTING]] (Sec 5 Metricas y cobertura, Sec 7 Checklist por modulo)
- [[ARCHITECTURE]] (Sec 12 PHPStan/Pint, Sec 14 ADRs)

### Tareas
- [ ] Scribe: `php artisan scribe:generate` — documentacion en `public/docs/`
- [ ] PHPStan nivel 10: 0 errores en `src/` y `app/`
- [ ] Pint: 0 archivos necesitan formateo
- [ ] Cobertura de tests:
  - Domain >=95%, Application >=90%, Infrastructure >=85%, Presentation >=80%
  - Security 100%, Architecture 100%
  - Global >=80%
- [ ] GitHub Actions: `.github/workflows/quality.yml`
  - Jobs: lint (Pint), stan (PHPStan), test (Pest con coverage), scribe
  - Servicios: PostgreSQL, Redis
- [ ] Scripts `composer.json`: `test`, `test:unit`, `test:integration`, `test:feature`, `test:security`, `test:coverage`, `stan`, `lint`, `fmt`, `migrate`, `rollback`, `scribe`, `ci`
- [ ] ADRs: crear `docs/adr/ADR-001.md` a `ADR-005.md` ([[ARCHITECTURE]] Sec 14)
- [ ] Marcar todos los endpoints de Auth como "Implementado" en el indice de [[API_CONTRACT]]
- [ ] Verificacion final: `composer ci` pasa localmente
- [ ] Session Manifest final del modulo Auth

### Entregable
- Pipeline CI/CD verde en GitHub Actions
- Documentacion de API generada y accesible en `/docs`
- Todos los tests pasan con cobertura minima
- Codigo formateado y sin errores de analisis estatico
- Modulo Auth marcado como completado

### Checklist de cierre
- [ ] `composer ci` ejecuta sin errores localmente
- [ ] GitHub Actions pasa en push/PR
- [ ] Cobertura global >=80% (verificar con `--coverage`)
- [ ] Scribe genera docs sin errores
- [ ] ADRs creados y completos
- [ ] No hay dependencias circulares entre capas (verificar con architecture tests)

---

## Session Manifest Template

> [!note] Plantilla completa
> Ver `[[SESSION_MANIFEST]] (usar la plantilla en la sección "Session Manifest Template" de este documento)` en la raiz del proyecto.
> 
> **Uso**: Al final de cada sesion, crear/actualizar el archivo [[SESSION_MANIFEST]] 
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
| 10 | **Documentacion vive con el codigo** | Si el codigo cambia, los documentos ([[API_CONTRACT]], [[DATABASE]]) se actualizan en la misma sesion |

---

## Referencias

| Documento | Proposito | Consultar en sesion |
|-----------|-----------|---------------------|
| [[AGENTS]] | Mapa de navegacion, flujos de trabajo, reglas de oro | Todas |
| [[ARCHITECTURE]] | Stack, DDD, reglas de dependencia, convenciones | Todas |
| [[DATABASE]] | Esquema PostgreSQL, convenciones, migraciones | 1, 2, 4, 6, 7 |
| [[API_CONTRACT]] | Endpoints, request/response, errores, rate limiting | 1, 3, 5, 6, 7 |
| [[JWT_IMPLEMENTATION]] | Seguridad JWT, claims, rotacion, MFA, headers | 3, 5, 6 |
| [[SETUP_GUIDE]] | Inicializacion paso a paso, Docker, dependencias | 1, 8 |
| [[TESTING]] | Estructura de tests, reglas, cobertura, metricas | 2, 3, 4, 5, 6, 7, 8 |
| [[SESSION_MANIFEST]] | Estado actual del proyecto entre sesiones | Todas (al inicio) |
