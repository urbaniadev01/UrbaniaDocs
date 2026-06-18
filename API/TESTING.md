---
type: reference
status: active
tags: [testing, pest, qa]
updated: 2026-06-17
---

# 🧪 TESTING_SPEC
## Especificaciones Técnicas de Pruebas - Urbania API

> [!info] Propósito
> Documento único de verdad para todas las pruebas del proyecto.
> **Audiencia**: Agentes de desarrollo, QA, DevOps.
> **Regla de oro**: Si no está en este documento, no se prueba. Si se prueba, debe estar aquí.



> [!warning] Prohibido
> Usar PHPUnit directamente. Todo test debe usar sintaxis Pest (`it()`, `test()`, `expect()`).
> **Prohibido**: Usar SQLite para testing. PostgreSQL real obligatorio ([[ARCHITECTURE]] Sección 1).

---

## 1. Estructura de Tests (Espejo estricto de `src/`)

```
tests/
├── Pest.php                          # Configuración global
├── TestCase.php                      # Base test case
├── Architecture/                     # Tests de reglas de arquitectura
├── Unit/
│   ├── Shared/
│   │   ├── Domain/
│   │   │   ├── ValueObjects/
│   │   │   └── Exceptions/
│   │   └── Infrastructure/
│   │       └── Persistence/
│   └── Auth/
│       ├── Domain/
│       │   ├── Entities/
│       │   ├── ValueObjects/
│       │   ├── Exceptions/
│       │   └── Events/
│       └── Application/
│           ├── DTOs/
│           └── UseCases/
├── Integration/
│   ├── Auth/
│   │   └── Infrastructure/
│   │       ├── Persistence/
│   │       ├── Services/
│   │       └── Mappers/
│   └── Shared/
│       └── Infrastructure/
├── Feature/
│   ├── Auth/
│   │   └── Http/
│   └── Shared/
│       └── Http/
└── Security/
    ├── Jwt/
    ├── Mfa/
    └── BruteForce/
```

> [!warning] Regla
> Si existe `src/Auth/Domain/Entities/User.php`, debe existir `tests/Unit/Auth/Domain/Entities/UserTest.php`.
> **Regla**: Si un archivo fuente no tiene test correspondiente, el PR no se aprueba.

---

## 2. Configuración de Entorno de Testing

### 2.1 Archivo `phpunit.xml` (o `pest.xml`)

> [!note] Ver configuración completa en
> [[SETUP_GUIDE]] Sección 9.3 (Configuración de Pest)
> 
> **Diferencias clave para testing**:
> - `DB_DATABASE=urbania_test` (aislado de desarrollo/producción)
> - `REDIS_DB=1` (separado de desarrollo DB 0)
> - `QUEUE_CONNECTION=sync` (síncrono para tests)
> - `MAIL_MAILER=array` (no enviar emails reales)
> - `BCRYPT_ROUNDS=4` (reducir para velocidad)
> - `TELESCOPE_ENABLED=false`

### 2.2 Archivo `Pest.php` (Configuración global Pest)

```php
<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

uses(TestCase::class)->in('Feature', 'Integration');
uses(LazilyRefreshDatabase::class)->in('Feature', 'Integration');

// Custom expectations reutilizables en todos los tests
expect()->extend('toBeUuidV7', function () {
    return $this->toMatch('/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i');
});

expect()->extend('toBeJwtStructure', function () {
    return $this->toMatch('/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/');
});

expect()->extend('toHaveExactErrorCode', function (string $code) {
    return $this->json('error.code')->toBe($code);
});

// Helpers globales
function freezeTime(callable $callback): void
{
    \Carbon\Carbon::setTestNow(now());
    $callback();
    \Carbon\Carbon::setTestNow(null);
}

// Helper para sesiones de testing con tiempo congelado
// Uso: freezeTime(function () { ... });
// Documentado en IMPLEMENTATION_PLAN.md Sesion 3 (JWT Service) y Sesion 6 (MFA)
```

> [!tip] Patrón estándar para mock de tiempo
> Usar siempre `freezeTime()` definido en `Pest.php`:
> ```php
> freezeTime(function () {
>     // Código que depende del tiempo
> });
> ```
> Solo usar `Carbon::setTestNow()` directamente cuando se necesite manipular 
> el tiempo DENTRO del callback de `freezeTime()`.

### 2.3 Base de datos de testing

| Aspecto | Valor | Justificación |
|---------|-------|---------------|
| Motor | PostgreSQL | Mismo motor que producción (no SQLite) |
| Nombre | `urbania_test` | Aislado de desarrollo/producción |
| Redis DB | `1` | Separado de desarrollo (DB 0) |
| Migrations | `LazilyRefreshDatabase` | Más rápido que `RefreshDatabase` |
| Seeders | No usar en tests | Cada test crea sus propios datos |
| Transactions | Sí, por cada test | Rollback automático |

> [!warning] Prohibido
> Usar `RefreshDatabase` en tests Unit (no tocan BD).
> **Prohibido**: Compartir estado entre tests. Cada test es independiente.

---

## 3. Tipos de Tests y Reglas

### 3.1 Architecture Tests (tests/Architecture/)

**Propósito**: Verificar que la arquitectura Clean/DDD no se viola.

**Reglas a testear** (ver [[ARCHITECTURE]] Sección 3):
- Domain no depende de nada externo (Illuminate, Laravel, otras capas)
- Domain no depende de otros bounded contexts
- Application solo depende de Domain y Shared
- Infrastructure depende de Domain e implementa interfaces
- Presentation solo depende de Application
- Shared no depende de bounded contexts
- Todos los DTOs son readonly
- Repositorios son interfaces en Domain
- Controllers están en Infrastructure

**Ejemplo mínimo**:
```php
arch('Domain no depende de nada externo')
    ->expect('Urbania\Auth\Domain')
    ->not->toDependOn('Illuminate')
    ->not->toDependOn('Urbania\Auth\Infrastructure');

arch('Todos los DTOs son readonly')
    ->expect('Urbania\Auth\Application\DTOs')
    ->classes()->toBeReadonly();
```

> [!note] Ejecución
> `vendor/bin/pest --filter=Architecture`
> **Frecuencia**: En cada push.
> **Documentación completa**: [[ARCHITECTURE]] Sección 3 (Reglas de Dependencia)

### 3.2 Unit Tests (tests/Unit/)

**Propósito**: Probar lógica pura sin dependencias externas. No tocan BD, Redis, ni HTTP.

**Reglas**:
- Mock **todos** los repositorios (interfaces de Domain).
- No usar `RefreshDatabase`.
- Probar casos edge, excepciones, y lógica de negocio.
- Cobertura mínima: 95% de Domain (Entities, VO, Exceptions). Ver [[TESTING]] §6.1.

**Ejemplo mínimo** (User entity + Password VO):
```php
<?php

declare(strict_types=1);

use Urbania\Auth\Domain\Entities\User;
use Urbania\Auth\Domain\ValueObjects\Password;
use Urbania\Auth\Domain\Exceptions\InvalidCredentialsException;

it('validates password with Argon2id hash', function () {
    $password = Password::fromPlainText('SecurePass123!');

    expect($password->verify('SecurePass123!'))->toBeTrue()
        ->and($password->verify('WrongPass'))->toBeFalse();
});

it('throws exception for weak password', function () {
    Password::fromPlainText('123');
})->throws(InvalidCredentialsException::class);

it('locks user after 5 failed attempts', function () {
    $user = User::create(/* ... */);

    foreach (range(1, 5) as $i) {
        $user->recordFailedLogin();
    }

    expect($user->isLocked())->toBeTrue();
});
```

> [!note] Convenciones de excepciones
> [[ARCHITECTURE]] Sección 4
> **Value Objects**: [[ARCHITECTURE]] Sección 2 (Domain/ValueObjects)
> **Entities**: [[ARCHITECTURE]] Sección 2 (Domain/Entities)

### 3.3 Integration Tests (tests/Integration/)

**Propósito**: Probar implementaciones concretas con BD real y servicios reales.

**Reglas**:
- Usar `LazilyRefreshDatabase`.
- PostgreSQL real (no mocks de BD).
- Redis real (DB 1).
- Probar queries, mapeos, y transacciones.

**Ejemplo mínimo** (Repository + Mapper + JWT Service):
```php
<?php

declare(strict_types=1);

it('persists user with UUID v7 primary key', function () {
    $repository = app(EloquentUserRepository::class);
    $user = User::create(id: Uuid::uuid7(), email: Email::fromString('test@example.com'), password: Password::fromPlainText('SecurePass123!'));

    $repository->save($user);
    $found = $repository->findByEmail(Email::fromString('test@example.com'));

    expect($found)->not->toBeNull()
        ->and($found->id()->toString())->toBeUuidV7();
});

it('stores password hash with Argon2id', function () {
    $user = User::factory()->create();
    $dbRecord = DB::table('users')->first();
    expect($dbRecord->password_hash)->toStartWith('$argon2id$');
});

it('mapper converts Eloquent to Domain preserving all fields', function () {
    $eloquent = UserModel::factory()->create(['status' => 'suspended', 'mfa_enabled' => true]);
    $domain = (new UserMapper())->toDomain($eloquent);

    expect($domain->status()->value)->toBe('suspended')
        ->and($domain->isMfaEnabled())->toBeTrue();
});

it('JWT service generates RS256 signed tokens with correct claims', function () {
    $service = app(JwtService::class);
    $token = $service->generateAccessToken(User::factory()->create());

    expect($token)->toBeJwtStructure();

    $decoded = $service->decode($token);
    expect($decoded['jti'])->toBeUuidV7()
        ->and($decoded['alg'])->toBe('RS256')
        ->and($decoded['role'])->toBeIn(['admin', 'user']);
});

it('JWT service validates token expiration', function () {
    freezeTime(function () {
        $token = app(JwtService::class)->generateAccessToken(User::factory()->create());
        \Carbon\Carbon::setTestNow(now()->addMinutes(16));

        expect(fn () => app(JwtService::class)->decode($token))
            ->toThrow(TokenExpiredException::class);
    });
});
```

> [!note] Mapeo Eloquent-Domain
> [[ARCHITECTURE]] Sección 6
> **JWT Claims**: [[JWT_IMPLEMENTATION]] Sección 3.2
> **JWT TTL**: [[JWT_IMPLEMENTATION]] Sección 3.3 (15 minutos)
> **Algoritmo RS256**: [[JWT_IMPLEMENTATION]] Sección 3.1

### 3.4 Feature Tests (tests/Feature/)

**Propósito**: Probar endpoints HTTP completos con request/response real.

**Reglas**:
- Usar `LazilyRefreshDatabase`.
- Validar contra [[API_CONTRACT]] exacto.
- Probar headers, status codes, formato JSON, rate limiting.

**Ejemplo mínimo** (Login + Logout + Refresh):
```php
<?php

declare(strict_types=1);

it('returns 200 with valid credentials and tokens', function () {
    $user = UserModel::factory()->create(['password' => Hash::make('SecurePass123!'), 'status' => 'active']);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => $user->email,
        'password' => 'SecurePass123!',
    ], ['X-Device-Fingerprint' => 'abc123']);

    $response->assertStatus(200)
        ->assertJsonPath('data.expires_in', 900)
        ->assertJsonPath('data.user.role', 'user');

    $this->assertDatabaseHas('refresh_tokens', ['user_id' => $user->id, 'device_fingerprint' => 'abc123']);
});

it('returns 401 for invalid credentials', function () {
    $response = $this->postJson('/api/v1/auth/login', ['email' => 'test@example.com', 'password' => 'wrong']);

    $response->assertStatus(401)
        ->assertJsonPath('error.code', 'INVALID_CREDENTIALS')
        ->assertJsonStructure(['error' => ['code', 'message', 'trace_id']]);
});

it('returns 429 after 5 failed login attempts', function () {
    foreach (range(1, 5) as $i) {
        $this->postJson('/api/v1/auth/login', ['email' => 'test@example.com', 'password' => 'wrong']);
    }

    $this->postJson('/api/v1/auth/login', ['email' => 'test@example.com', 'password' => 'wrong'])
        ->assertStatus(429)
        ->assertHeader('Retry-After');
});
```

> [!note] Endpoints completos
> [[API_CONTRACT]] Sección 1 (Autenticación)
> **Formato de error**: [[API_CONTRACT]] Sección "Formato de Respuesta de Error"
> **Rate Limiting**: [[API_CONTRACT]] Sección "Rate Limiting" y [[JWT_IMPLEMENTATION]] Sección 3.1
> **Headers de seguridad**: [[JWT_IMPLEMENTATION]] Sección 4.1

> [!warning] Fuente de verdad para tests de seguridad
> [[JWT_IMPLEMENTATION]] (completo).
> Esta sección documenta COMO testear, pero los REQUISITOS (TTL, claims, rotacion, etc.)
> están definidos en el documento de seguridad.

### 3.5 Security Tests (tests/Security/)

**Propósito**: Probar mecanismos de seguridad específicos documentados en [[JWT_IMPLEMENTATION]].

**Áreas críticas a testear**:

#### Token Rotation ([[JWT_IMPLEMENTATION]] Sección 3.2)
```php
it('detects refresh token replay attack and revokes family', function () {
    $user = UserModel::factory()->create();
    $token1 = createRefreshToken($user);

    // Uso legítimo
    $response1 = $this->postJson('/api/v1/auth/refresh', ['refresh_token' => $token1]);
    $token2 = $response1->json('data.refresh_token');

    // Reutilización (ataque)
    $this->postJson('/api/v1/auth/refresh', ['refresh_token' => $token1])->assertStatus(401);

    // Verificar toda la familia revocada
    $this->postJson('/api/v1/auth/refresh', ['refresh_token' => $token2])->assertStatus(401);

    $this->assertDatabaseHas('security_events', [
        'user_id' => $user->id, 'event_type' => 'suspicious_activity', 'severity' => 'high'
    ]);
});
```

#### Device Fingerprint ([[JWT_IMPLEMENTATION]] Sección 3.3)
```php
it('requires re-authentication from new device fingerprint', function () {
    $user = UserModel::factory()->create();
    $token = createRefreshToken($user, fingerprint: 'original-device');

    $this->postJson('/api/v1/auth/refresh', 
        ['refresh_token' => $token],
        ['X-Device-Fingerprint' => 'new-device']
    )->assertStatus(403)->assertJsonPath('error.code', 'DEVICE_NOT_RECOGNIZED');
});
```

#### MFA ([[JWT_IMPLEMENTATION]] Sección 6)
```php
it('validates TOTP code within window and rejects outside', function () {
    $user = UserModel::factory()->create(['mfa_secret' => encrypt('JBSWY3DPEHPK3PXP')]);
    $token = generateTokenForUser($user);

    // Código válido
    $code = (new Google2FA())->getCurrentOtp('JBSWY3DPEHPK3PXP');
    $this->postJson('/api/v1/auth/mfa/verify', ['code' => $code, 'type' => 'login'], ['Authorization' => 'Bearer ' . $token])
        ->assertStatus(200);

    // Código fuera de ventana (mock time)
    freezeTime(function () use ($token) {
        \Carbon\Carbon::setTestNow(now()->addSeconds(60));
        $oldCode = (new Google2FA())->getCurrentOtp('JBSWY3DPEHPK3PXP');

        $this->postJson('/api/v1/auth/mfa/verify', ['code' => $oldCode, 'type' => 'login'], ['Authorization' => 'Bearer ' . $token])
            ->assertStatus(401)->assertJsonPath('error.code', 'MFA_INVALID_CODE');
    });
});
```

> [!note] Rotación de tokens
> [[JWT_IMPLEMENTATION]] Sección 3.2
> **Device fingerprint**: [[JWT_IMPLEMENTATION]] Sección 3.3
> **MFA/TOTP**: [[JWT_IMPLEMENTATION]] Sección 6
> **Rate limiting**: [[JWT_IMPLEMENTATION]] Sección 3.1 y [[API_CONTRACT]] Sección "Rate Limiting"
> **Brute force**: [[JWT_IMPLEMENTATION]] Sección 3.1 y [[DATABASE]] (users.failed_login_attempts)
> **Eventos de seguridad**: [[JWT_IMPLEMENTATION]] Sección 6.1

---

## 4. Factories y Fixtures

> [!note] Principio
> Las factories deben reflejar exactamente el esquema de [[DATABASE]].
> No duplicar información del esquema aquí.

### 5.1 Eloquent Factories (database/factories/)

**Factory mínima de ejemplo** (UserFactory):
```php
<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Ramsey\Uuid\Uuid;

class UserFactory extends Factory
{
    protected $model = \App\Models\User::class;

    public function definition(): array
    {
        return [
            'id' => Uuid::uuid7()->toString(),
            'email' => $this->faker->unique()->safeEmail(),
            'password_hash' => Hash::make('SecurePass123!'),
            'email_verified_at' => now(),
            'mfa_secret' => null,
            'mfa_enabled' => false,
            'mfa_backup_codes' => null,
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
            'last_login_ip' => null,
            'password_changed_at' => now(),
            'must_change_password' => false,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }

    // Estados para testing de casos edge
    public function suspended(): static { return $this->state(fn () => ['status' => 'suspended']); }
    public function locked(): static { return $this->state(fn () => ['failed_login_attempts' => 5, 'locked_until' => now()->addMinutes(30)]); }
    public function withMfa(): static { return $this->state(fn () => ['mfa_enabled' => true, 'mfa_secret' => encrypt('JBSWY3DPEHPK3PXP')]); }
    public function softDeleted(): static { return $this->state(fn () => ['deleted_at' => now()]); }
    public function mustChangePassword(): static { return $this->state(fn () => ['must_change_password' => true]); }
}
```

> [!note] Esquema completo de users
> [[DATABASE]] Sección 2.1
> **Esquema de refresh_tokens**: [[DATABASE]] Sección 2.2
> **Esquema de password_history**: [[DATABASE]] Sección 2.3
> **Esquema de login_attempts**: [[DATABASE]] Sección 2.4
> **Esquema de security_events**: [[DATABASE]] Sección 2.5
> **Esquema de password_reset_tokens**: [[DATABASE]] Sección 2.6

### 5.2 Domain Test Helpers (tests/Helpers/)

```php
<?php

declare(strict_types=1);

namespace Tests\Helpers;

class AuthTestHelpers
{
    public static function generateExpiredToken(string $userId): string
    {
        \Carbon\Carbon::setTestNow(now()->subDays(1));
        $token = self::generateAccessToken($userId);
        \Carbon\Carbon::setTestNow(null);
        return $token;
    }

    public static function createRefreshTokenInDb(\App\Models\User $user, ?string $family = null, ?string $fingerprint = null): string
    {
        $token = Str::random(64);
        \App\Models\RefreshToken::factory()->create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $token),
            'token_family' => $family ?? Uuid::uuid7()->toString(),
            'device_fingerprint' => $fingerprint ?? hash('sha256', 'test-device'),
        ]);
        return $token;
    }

    public static function decodeJti(string $token): string
    {
        $parts = explode('.', $token);
        return json_decode(base64_decode($parts[1]), true)['jti'];
    }
}
```

---

## 5. Métricas y Cobertura

### 5.1 Cobertura mínima requerida

| Capa | Cobertura mínima | Herramienta |
|------|-----------------|-------------|
| Domain (Entities, VO, Exceptions) | 95% | Pest --coverage |
| Application (UseCases, DTOs) | 90% | Pest --coverage |
| Infrastructure (Repositories, Services) | 85% | Pest --coverage |
| Presentation (Controllers, Resources) | 80% | Pest --coverage |
| Security (JWT, MFA, Rate Limiting, Brute Force) | 100% | Pest --coverage |
> [!note] Nota
> El 100% aplica a mecanismos testeables (rotación de tokens, MFA, rate limiting, brute force).
> Aspectos como detección de jailbreak en móvil o cert pinning son documentados pero no requieren cobertura automatizada. |
| Architecture Tests | 100% | Pest |
| **Global** | **80%** | Pest --coverage |

### 5.2 Comando de cobertura

Ver [[SETUP_GUIDE]] §12.2 para la lista completa de scripts de calidad:
- `composer test:coverage` - Ejecuta tests con cobertura
- `composer ci` - Pipeline completo

Para desarrollo local, usar los scripts definidos en `composer.json` según [[SETUP_GUIDE]].

```bash
vendor/bin/pest --coverage --min=80 --coverage-html=coverage-report
```

### 5.3 Exclusiones de cobertura

**Excluir siempre**:
- `Presentation/ServiceProviders` (registro de bindings)
- `Infrastructure/Exceptions/Handler.php` (catch-all)
- `config/` (archivos de configuración)
- `routes/` (definición de rutas)

```php
// En archivo fuente, marcar como no cubrible:
// @codeCoverageIgnoreStart
// @codeCoverageIgnoreEnd
```

---

## 6. Reglas de Escritura de Tests

### 6.1 Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivo de test | PascalCase + `Test.php` | `LoginUseCaseTest.php` |
| Función de test | `it('descripción')` | `it('returns 401 for invalid credentials')` |
| Grupo de tests | `describe('contexto')` | `describe('token rotation')` |
| Hook before | `beforeEach()` | Setup antes de cada test |
| Hook after | `afterEach()` | Cleanup después de cada test |

### 6.2 Estructura de un test (AAA)

```php
describe('login endpoint', function () {
    beforeEach(function () {
        // Setup común
    });

    afterEach(function () {
        Redis::flushdb(); // Limpieza de estado compartido
    });

    it('returns 401 for invalid credentials', function () {
        // Arrange
        $user = UserModel::factory()->create();

        // Act
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'wrong',
        ]);

        // Assert
        $response->assertStatus(401);
    });
});
```

### 6.3 Principios FIRST

- **F**ast: Cada test < 1 segundo. Usar mocks en Unit.
- **I**ndependent: No compartir estado. No depender de orden.
- **R**epeatable: Mismo resultado en cualquier entorno.
- **S**elf-validating: Asserts explícitos, no logs manuales.
- **T**imely: Escribir test antes o junto al código.

### 6.4 Prohibiciones

| Prohibición | Razón |
|-------------|-------|
| `sleep()` en tests | Tests lentos, flaky. Usar `freezeTime()` |
| `dd()` / `dump()` en tests | Rompe el pipeline. Usar asserts |
| Tests que dependen de otros | Orden no garantizado |
| Acceso a APIs externas reales | Usar `Http::fake()` |
| Base de datos en tests Unit | Solo Integration/Feature |
| `env()` directamente en tests | Usar `config()` o `.env.testing` |
| Datos hardcodeados sin faker | Difícil mantener, no realista |

---

## 7. Checklist de Testing por Módulo

Al implementar cualquier bounded context, verificar:

- [ ] Architecture tests creados (reglas de dependencia)
- [ ] Unit tests para todas las entidades de Domain
- [ ] Unit tests para todos los value objects
- [ ] Unit tests para todas las excepciones de dominio
- [ ] Unit tests para todos los use cases (con mocks)
- [ ] Integration tests para todos los repositorios (con BD real)
- [ ] Integration tests para todos los servicios de Infrastructure
- [ ] Integration tests para todos los mappers
- [ ] Feature tests para todos los endpoints HTTP
- [ ] Feature tests para rate limiting de cada endpoint
- [ ] Feature tests para formato de error único ([[API_CONTRACT]])
- [ ] Security tests para JWT (rotación, revocación, blacklist)
- [ ] Security tests para MFA (TOTP, backup codes, flujo completo)
- [ ] Security tests para brute force (login, refresh, password reset)
- [ ] Security tests para device fingerprinting
- [ ] Security tests para headers de seguridad HTTP
- [ ] Factories creadas para todas las entidades
- [ ] Helpers de testing creados para tokens JWT
- [ ] Cobertura global >= 80%
- [ ] Cobertura de Domain >= 95%
- [ ] Cobertura de Security >= 100%
- [ ] PHPStan pasa sin errores
- [ ] Pint formatea sin cambios
- [ ] Todos los tests pasan en el pipeline
- [ ] [[SESSION_MANIFEST]] actualizado con metricas de calidad de esta sesion
- [ ] [[IMPLEMENTATION_PLAN]] verificado (sin cambios si no se modifica el plan)
- [ ] [[DEVELOPMENT_GUIDE]] actualizado si se encontraron problemas de testing

---

## 8. Glosario de Testing

| Término | Definición |
|---------|-----------|
| **Architecture Test** | Test que verifica reglas de código (dependencias, nomenclatura) sin ejecutar lógica de negocio |
| **Unit Test** | Test aislado de una unidad de código con dependencias mockeadas |
| **Integration Test** | Test que verifica interacción entre componentes con infraestructura real (BD, Redis) |
| **Feature Test** | Test de extremo a extremo (HTTP request → HTTP response) |
| **Security Test** | Test especializado que verifica mecanismos de seguridad (JWT, MFA, rate limiting) |
| **Mock** | Objeto simulado que imita el comportamiento de una dependencia real |
| **Factory** | Clase que genera instancias de modelos con datos falsos para testing |
| **Coverage** | Porcentaje de código fuente ejecutado durante la suite de tests |
| **AAA** | Arrange (preparar), Act (ejecutar), Assert (verificar) |
| **FIRST** | Fast, Independent, Repeatable, Self-validating, Timely |

---

## 9. Testing por Sesion (Referencia Rapida)

> [!note] Nota
> Cada sesion del [[IMPLEMENTATION_PLAN]] tiene un scope de testing especifico.
> Esta tabla resume que tipos de tests se enfocan en cada sesion.

| Sesion | Tipos de tests enfocados | Cobertura objetivo | Documentos de testing |
|--------|-------------------------|-------------------|----------------------|
| 1 | Feature (Health Check) | 100% del endpoint | [[TESTING]] Sec 3.4 |
| 2 | Architecture + Unit | Domain >=95% | [[TESTING]] Sec 3.1, 3.2 |
| 3 | Unit (UseCases) + Integration (JWT) | Application >=90% | [[TESTING]] Sec 3.2, 3.3 |
| 4 | Integration (Repositories, Mappers) | Infrastructure >=85% | [[TESTING]] Sec 3.3 |
| 5 | Feature (Endpoints HTTP) | Presentation >=80% | [[TESTING]] Sec 3.4 |
| 6 | Security (JWT, MFA, Device, Rotacion) | Security 100% | [[TESTING]] Sec 3.5 |
| 7 | Feature + Security (Password, Perfil) | Security 100% | [[TESTING]] Sec 3.4, 3.5 |
| 8 | Todos los anteriores + Coverage global | Global >=80% | [[TESTING]] Sec 5 |