---
type: session
session_number: 4
name: "Infrastructure Layer (Repositorios + Mappers)"
status: completed
date_start: 2026-06-19
date_end: 2026-06-19
agent: opencode
tags: [session]
updated: 2026-06-19
---

# Sesión 4: Infrastructure Layer (Repositorios + Mappers)

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]] (Sesión 4)
- [[API_SESSION_MANIFEST]]
- [[API_DATABASE]]
- [[API_ARCHITECTURE]]
- [[API_TESTING]]

## Tareas completadas
- [x] 6 migraciones PostgreSQL: users, refresh_tokens, password_history, login_attempts, security_events, password_reset_tokens
- [x] Todas las migraciones con `down()` reversible verificado (`migrate:rollback` + `migrate`)
- [x] Modelos Eloquent: User (expandido con 19 campos, SoftDeletes, HasUuids) + RefreshToken (nuevo)
- [x] Mappers: UserMapper (toDomain, toPersistence) + RefreshTokenMapper (toDomain, toPersistence)
- [x] Repositorios: EloquentUserRepository + EloquentRefreshTokenRepository (implementan interfaces Domain)
- [x] IlluminateEventBus (implemta EventBusInterface usando dispatcher de Laravel)
- [x] ServiceProvider: bindings UserRepositoryInterface, RefreshTokenRepositoryInterface, EventBusInterface
- [x] UserFactory reescrita para esquema real + RefreshTokenFactory nueva
- [x] 4 tests de integración: repositorios (2) + mappers (2) con PostgreSQL real
- [x] `composer ci` verde (138 tests, 486 assertions)

## Archivos creados
| Ruta | Descripción |
|------|-------------|
| `database/migrations/2026_06_19_000001_create_users_table.php` | Tabla users (19 columnas, 5 índices) |
| `database/migrations/2026_06_19_000002_create_refresh_tokens_table.php` | Tabla refresh_tokens (16 columnas, 6 índices) |
| `database/migrations/2026_06_19_000003_create_password_history_table.php` | Tabla password_history + trigger límite 12 |
| `database/migrations/2026_06_19_000004_create_login_attempts_table.php` | Tabla login_attempts (3 índices) |
| `database/migrations/2026_06_19_000005_create_security_events_table.php` | Tabla security_events + índice GIN |
| `database/migrations/2026_06_19_000006_create_password_reset_tokens_table.php` | Tabla password_reset_tokens |
| `app/Models/RefreshToken.php` | Modelo Eloquent RefreshToken |
| `database/factories/RefreshTokenFactory.php` | Factory RefreshToken |
| `src/Auth/Infrastructure/Mappers/UserMapper.php` | Mapper User Eloquent ↔ UserEntity |
| `src/Auth/Infrastructure/Mappers/RefreshTokenMapper.php` | Mapper RefreshToken Eloquent ↔ RefreshTokenEntity |
| `src/Auth/Infrastructure/Persistence/EloquentUserRepository.php` | Implementa UserRepositoryInterface |
| `src/Auth/Infrastructure/Persistence/EloquentRefreshTokenRepository.php` | Implementa RefreshTokenRepositoryInterface |
| `src/Auth/Infrastructure/Events/IlluminateEventBus.php` | Implementa EventBusInterface |
| `tests/Integration/Auth/Infrastructure/Persistence/EloquentUserRepositoryTest.php` | Tests integración UserRepository |
| `tests/Integration/Auth/Infrastructure/Persistence/EloquentRefreshTokenRepositoryTest.php` | Tests integración RefreshTokenRepository |
| `tests/Integration/Auth/Infrastructure/Mappers/UserMapperTest.php` | Tests mapeo UserMapper |
| `tests/Integration/Auth/Infrastructure/Mappers/RefreshTokenMapperTest.php` | Tests mapeo RefreshTokenMapper |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `app/Models/User.php` | Expandido: HasUuids, SoftDeletes, 19 fillable, casts, authPasswordName |
| `database/factories/UserFactory.php` | Reescrita para esquema real + estados (admin, suspended, locked, withMfa, etc.) |
| `src/Auth/Presentation/UrbaniaAuthServiceProvider.php` | Bindings repositorios + EventBus |
| `phpstan.neon` | Agregada extensión Larastan |

## Métricas de cierre
- Tests: 138 passed, 1 deprecated (486 assertions) — +27 tests vs Sesión 3
- PHPStan: nivel 10, 0 errores
- Pint: 126 archivos, 0 diferencias
- Migraciones: 6 tablas creadas, `migrate:rollback` + `migrate` verificados

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer ci` verde
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] [[API_IMPLEMENTATION_PLAN]] actualizado
- [x] [[API_DATABASE]] — las 6 tablas coinciden con el esquema documentado
- [x] Mappers preservan todos los campos del esquema
- [x] Ninguna relación Eloquent cruza bounded contexts
- [x] UUID v7 asignado correctamente en creación

## No implementado (decisión de diseño)
- `BcryptPasswordHasher` — no necesario: `Password` VO ya maneja Argon2id
- `RedisBlacklistService` — no necesario: `PhpOpenSourceSaverJwtService` ya maneja blacklist Redis

## Notas
- Domain congelado: no se modificaron interfaces ni entidades.
- Application congelado: no se modificaron UseCases ni DTOs.
- Los mappers usan reflexión (`ReflectionProperty::setAccessible()`) para setear propiedades privadas de entidades inmutables — deuda técnica conocida (PHP 8.5 deprecation).
- Columnas `role`, `status`, `severity` como VARCHAR (no ENUM nativo PostgreSQL) — más portable.

## Próxima sesión
- Sesión 5: Presentation Layer — Endpoints Básicos (Login, Register, Logout, Me, Refresh)
