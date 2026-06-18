---
type: operational
status: active
tags: [setup, docker, onboarding]
updated: 2026-06-17
---

# 🚀 SETUP_GUIDE
## Guia de Creacion del Proyecto Urbania API desde Cero

> [!info] Proposito
> Documento paso a paso para inicializar el proyecto base con el modulo de autenticacion.
> **Audiencia**: Agentes de desarrollo, DevOps, nuevos miembros del equipo.


---

## 1. Pre-requisitos del Entorno

Verificar que el entorno cumple con los requisitos del stack definido en **[[ARCHITECTURE]]** seccion 1 (Stack Tecnologico).

Extensiones PHP requeridas: `pgsql`, `pdo_pgsql`, `redis`, `mbstring`, `openssl`, `json`, `xml`, `ctype`, `fileinfo`, `tokenizer`, `bcmath`, `intl`, `zip`.

> [!note] Nota sobre PHP 8.5
> El stack objetivo es PHP ^8.5, pero si no hay release estable o hay incompatibilidad de paquetes, **fallback a PHP 8.4** (LTS, soporte hasta dic 2028). Laravel 13 requiere PHP 8.3+ — 8.4 funciona sin problemas. Verificar compatibilidad de `larastan/larastan` y `php-open-source-saver/jwt-auth` con la versión instalada.

```bash
# Verificar extensiones instaladas
php -m | grep -E "pgsql|pdo_pgsql|redis|mbstring|openssl|json|xml|ctype|fileinfo|tokenizer|bcmath"

# Si falta alguna, instalar (ejemplo Ubuntu/Debian con Ondrej PPA)
# PHP 8.5 requiere Ondrej PPA o compilacion manual (aun no en repos oficiales)
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install php8.5-pgsql php8.5-redis php8.5-mbstring php8.5-xml php8.5-bcmath php8.5-intl php8.5-zip
```

---

## 2. Inicializacion del Proyecto Laravel

### 2.1 Crear Proyecto

```bash
# Version exacta definida en ARCHITECTURE.md
composer create-project laravel/laravel:^13.0 urbania-api --prefer-dist

cd urbania-api

# Verificar version instalada
php artisan --version
```

### 2.2 Configurar Estructura de Directorios DDD

Crear la estructura de bounded contexts segun **[[ARCHITECTURE]]** seccion 2 (Arquitectura: Clean Architecture + DDD).

```bash
mkdir -p src/Shared/{Domain/{ValueObjects,Exceptions,Events,Contracts},Application/{DTOs,Bus},Infrastructure/{Exceptions,Persistence,Bus,Logging,Middleware}}
mkdir -p src/Auth/{Domain/{Entities,ValueObjects,Repositories,Exceptions,Events},Application/{DTOs,UseCases,Services},Infrastructure/{Persistence,Services,Mappers,Http/{Controllers,Requests,Resources}},Presentation}
mkdir -p tests/{Unit/{Shared,Auth},Integration/{Auth/Infrastructure/Persistence},Feature/Auth/Http}
```

### 2.3 Configurar Autoloading PSR-4

Editar `composer.json` segun **[[ARCHITECTURE]]** seccion 9 (Autoloading y Registro de Bounded Contexts).

```bash
composer dump-autoload
```

---

## 3. Configuracion de Dependencias

### 3.1 Instalar Paquetes de Produccion

```bash
# JWT - verificar version en ARCHITECTURE.md seccion 1
composer require php-open-source-saver/jwt-auth

# UUID - verificar version en ARCHITECTURE.md seccion 1
composer require ramsey/uuid

# Validacion de emails (Value Object Email en Shared/Domain)
composer require egulias/email-validator
```

> [!note] Nota sobre UUID v7
> ramsey/uuid ^4.7 soporta UUID v7. Todas las claves primarias usan UUID v7 (ver [[DATABASE]]).
> ```php
> use Ramsey\Uuid\Uuid;
> $uuid = Uuid::uuid7(); // Genera UUID v7 (timestamp + random)
> ```
> En Eloquent migrations: `$table->uuid('id')->primary();` + asignar UUID v7 en el modelo.

### 3.2 Instalar Paquetes de Desarrollo

```bash
# Testing, analisis estatico, formateo - verificar versiones en ARCHITECTURE.md seccion 1
composer require pestphp/pest --dev
composer require pestphp/pest-plugin-laravel --dev
composer require phpstan/phpstan --dev
composer require larastan/larastan --dev
composer require laravel/pint --dev
composer require knuckleswtf/scribe --dev
```

### 3.3 Publicar Configuraciones

```bash
php artisan vendor:publish --provider="PHPOpenSourceSaver\\JWTAuth\\Providers\\LaravelServiceProvider"
> [!note] Nota
> El provider PHPOpenSourceSaver\\JWTAuth\\Providers\\LaravelServiceProvider es correcto para el fork php-open-source-saver/jwt-auth.
> Si hay error de clase no encontrada, verificar version instalada: composer show php-open-source-saver/jwt-auth
php artisan vendor:publish --tag=scribe-config
```

---

## 4. Configuracion de Base de Datos

### 4.1 Configurar PostgreSQL en Laravel

Editar `config/database.php` segun **[[DATABASE]]** seccion 8 (Configuracion de Base de Datos) y **[[ARCHITECTURE]]** seccion 8.

### 4.2 Configurar Variables de Entorno

Copiar `.env.example` a `.env` y configurar segun **[[ARCHITECTURE]]** seccion 13 (Variables de Entorno Requeridas).

```bash
php artisan key:generate
```


### 4.3 Configurar Redis

Editar `.env`:
```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=null
REDIS_CLIENT=phpredis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

> [!note] Nota
> Redis se usa para: blacklist JWT, sesiones, rate limiting, cache, colas y MFA pending.



### 4.5 Configurar Filesystem

Editar `.env`:
```env
FILESYSTEM_DISK=local
```

Para produccion con S3:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false
```

```bash
php artisan storage:link
```


---

## 5. Configuracion de Seguridad JWT

### 5.1 Generar Par de Claves RSA (RS256)

Requisitos del algoritmo y parametros definidos en **[[JWT_IMPLEMENTATION]]** seccion 3.1.

```bash
mkdir -p storage/jwt

# Generar clave privada (4096 bits, PKCS#8)
openssl genrsa -out storage/jwt/private.pem 4096

# Extraer clave publica
openssl rsa -in storage/jwt/private.pem -pubout -out storage/jwt/public.pem

# Establecer permisos restrictivos
chmod 600 storage/jwt/private.pem
chmod 644 storage/jwt/public.pem
```

### 5.2 Configurar JWT para RS256

Editar `config/jwt.php` con la siguiente configuración mínima:

```php
<?php

return [
    'secret' => env('JWT_SECRET'),
    'keys' => [
        'public' => env('JWT_PUBLIC_KEY_PATH', storage_path('jwt/public.pem')),
        'private' => env('JWT_PRIVATE_KEY_PATH', storage_path('jwt/private.pem')),
        'passphrase' => env('JWT_PASSPHRASE'),
    ],
    'ttl' => env('JWT_TTL', 15), // minutos
    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // 14 días (ajustar según web/móvil)
    'algo' => env('JWT_ALGO', 'RS256'),
    'required_claims' => [
        'iss',
        'iat',
        'exp',
        'nbf',
        'sub',
        'jti',
    ],
    'persistent_claims' => [],
    'lock_subject' => true,
    'leeway' => env('JWT_LEEWAY', 0),
    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),
    'decrypt_cookies' => false,
    'providers' => [
        'jwt' => PHPOpenSourceSaver\\JWTAuth\\Providers\\JWT\\Lcobucci::class,
        'auth' => PHPOpenSourceSaver\JWTAuth\Providers\Auth\Illuminate::class,
        'storage' => PHPOpenSourceSaver\JWTAuth\Providers\Storage\Illuminate::class,
    ],
];
```

> Ver **[[JWT_IMPLEMENTATION]]** sección 3.1 para detalles completos del algoritmo RS256.

---

## 6. Docker Compose (Desarrollo)

### 6.1 Crear Archivos Docker

Crear los siguientes archivos en raiz del proyecto:

#### `Dockerfile`
```dockerfile
FROM php:8.5-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y     libpq-dev     libzip-dev     unzip     git     curl     libpng-dev     libonig-dev     libxml2-dev     && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip opcache     && pecl install redis     && docker-php-ext-enable redis

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias de Composer
RUN composer install --no-dev --optimize-autoloader

# Permisos
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Puerto expuesto
EXPOSE 9000

CMD ["php-fpm"]
```

#### `docker-entrypoint.sh`
```bash
#!/bin/sh
set -e

# Esperar a que PostgreSQL esté disponible
echo "Esperando a PostgreSQL..."
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
  sleep 1
done
echo "PostgreSQL listo."

# Ejecutar migraciones
echo "Ejecutando migraciones..."
php artisan migrate --force

# Iniciar PHP-FPM
exec php-fpm
```

#### `.dockerignore`
```
/node_modules
/vendor
/.git
/.idea
/.vscode
/.env
/.env.testing
/storage/*.key
/storage/logs/*
/storage/framework/cache/*
/storage/framework/sessions/*
/storage/framework/views/*
/bootstrap/cache/*
.phpunit.result.cache
```

> [!note] Nota
> Puertos alternativos para evitar conflictos: PostgreSQL `5433:5432`, Redis `6380:6379`, API `8080:80`.
> - Puerto interno (contenedor): 5432
> - Puerto externo (host): 5433

### 6.2 Iniciar Entorno Docker

```bash
docker compose up -d --build
```

---

## 7. Migraciones de Base de Datos (Auth)

### 7.1 Crear Migraciones

Basado en **[[DATABASE]]** secciones 2.1-2.5. **Orden de creación obligatorio** (por dependencias de foreign keys):

```bash
# IMPORTANTE: Laravel 13 incluye migracion por defecto de users (0001_01_01_000000_create_users_table.php)
# Eliminar o modificar la migracion por defecto ANTES de crear la propia
rm database/migrations/0001_01_01_000000_create_users_table.php

# 1. users (tabla base, sin dependencias)
php artisan make:migration create_users_table

# 2. password_reset_tokens (depende de users.email conceptualmente)
php artisan make:migration create_password_reset_tokens_table

# 3. password_history (depende de users.id)
php artisan make:migration create_password_history_table

# 4. refresh_tokens (depende de users.id)
php artisan make:migration create_refresh_tokens_table

# 5. login_attempts (depende opcionalmente de users.id)
php artisan make:migration create_login_attempts_table

# 6. security_events (depende opcionalmente de users.id)
php artisan make:migration create_security_events_table
```

> [!warning] Regla
> Ejecutar `php artisan migrate` solo después de crear TODAS las migraciones.
> El orden de ejecución automático de Laravel se basa en el timestamp del nombre del archivo.

### 7.2 Implementar Estructura de Migraciones

El esquema exacto de columnas, tipos, indices y constraints esta definido en **[[DATABASE]]** (secciones 2.1-2.5). Reglas de nomenclatura en **[[DATABASE]]** seccion "Convenciones de Nomenclatura".

Reglas criticas:
- Toda migracion DEBE implementar `down()` (reversible)
- Claves primarias: UUID v7
- Convenciones de indices y constraints segun **[[DATABASE]]**

### 7.3 Ejecutar Migraciones

```bash
# Entorno Docker
docker compose exec app php artisan migrate

# Verificar estado
docker compose exec app php artisan migrate:status
```

---

## 8. Implementacion del Bounded Context Auth

### 8.1 Orden de Implementacion (Respetar Reglas de Dependencia)

Segun **[[ARCHITECTURE]]** seccion 4 (Reglas de Dependencia), el orden es:

1. **Domain** (sin dependencias externas)
2. **Application** (depende de Domain)
3. **Infrastructure** (depende de Domain, implementa interfaces)
4. **Presentation** (depende de Application, expone rutas)

### 8.2 Domain Layer

Crear en `src/Auth/Domain/`. Tipos de componentes y ubicaciones definidos en **[[ARCHITECTURE]]** seccion 2 (Arquitectura) y seccion 6 (Mapeo Eloquent a Entidad de Dominio).

Reglas:
- Sin dependencias de Laravel ni paquetes de terceros
- Entidades puras con logica de negocio
- ValueObjects inmutables
- Excepciones especificas de dominio (ver **[[ARCHITECTURE]]** seccion 5)

### 8.3 Application Layer

Crear en `src/Auth/Application/`. UseCases orquestan entidades del Domain. DTOs deben ser `final readonly class` (PHP 8.2+). Ver **[[ARCHITECTURE]]** seccion 7 (Estado de UI con DTOs y Resources).

### 8.4 Infrastructure Layer

Crear en `src/Auth/Infrastructure/`. Implementaciones concretas:

- **Persistence**: Repositories Eloquent, Mappers (Anti-Corruption Layer)
- **Services**: JwtService, HashingService, MfaService
- **Http**: Controllers, Requests, Resources

Reglas de mapeo en **[[ARCHITECTURE]]** seccion 6:
- NUNCA usar Eloquent relationships entre models de diferentes bounded contexts
- NUNCA acceder a `$request->user()` desde Domain
- Mappers son la frontera entre Eloquent y Domain

### 8.5 Presentation Layer

Crear en `src/Auth/Presentation/`:

- `AuthServiceProvider.php` — Registro de bindings y carga de rutas
- `routes.php` — Definicion de rutas del modulo

Registrar provider en `config/app.php` segun **[[ARCHITECTURE]]** seccion 9.

### 8.6 Rutas del Modulo Auth

Definir rutas segun **[[API_CONTRACT]]** seccion 1 (Autenticacion). Endpoints a implementar:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/mfa/verify`
- `POST /api/v1/auth/mfa/verify-backup` (ver [[API_CONTRACT]] §1.15.1)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions` (revocar todas excepto actual)
- `DELETE /api/v1/auth/sessions/{session_id}` (revocar específica)

Formatos de request/response, codigos HTTP y manejo de errores definidos en **[[API_CONTRACT]]**.

---

## 9. Configuracion de Herramientas de Calidad

### 9.1 PHPStan

Crear `phpstan.neon` en raiz segun **[[ARCHITECTURE]]** seccion 12 (Configuracion de Herramientas de Calidad).

```bash
vendor/bin/phpstan analyse
```

### 9.2 Laravel Pint

Crear `pint.json` en raiz segun **[[ARCHITECTURE]]** seccion 12.

```bash
vendor/bin/pint
```

### 9.3 Pest Testing

Crear estructura de tests en `tests/` segun **[[ARCHITECTURE]]** seccion 10 (Testing Obligatorio). Espejo de `src/`:

- `tests/Unit/` — Entities, ValueObjects, UseCases con mocks
- `tests/Integration/` — Repositories con BD real
- `tests/Feature/` — Endpoints HTTP

#### Configuración de Pest (`phpunit.xml` / `pest.xml`)

Crear `phpunit.xml` en raíz del proyecto:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
         cacheDirectory=".phpunit.cache"
>
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
        <testsuite name="Security">
            <directory>tests/Security</directory>
        </testsuite>
        <testsuite name="Architecture">
            <directory>tests/Architecture</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
            <directory>app</directory>
        </include>
    </source>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="pgsql"/>
        <env name="DB_DATABASE" value="urbania_test"/>
        <env name="REDIS_DB" value="1"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="MAIL_MAILER" value="array"/>
        <env name="BCRYPT_ROUNDS" value="4"/>
        <env name="TELESCOPE_ENABLED" value="false"/>
    </php>
</phpunit>
```

> [!note] Nota
> La configuración completa de entorno de testing está en [[TESTING]] §2. Verificar que `DB_DATABASE=urbania_test` esté aislado de desarrollo/producción.

```bash
vendor/bin/pest
```

---

## 10. Verificacion Post-Setup

### 10.1 Checklist de Verificacion

- [ ] Todos los servicios Docker estan healthy (`docker compose ps`)
- [ ] Health check endpoint responde 200
- [ ] PostgreSQL acepta conexiones
- [ ] Redis acepta conexiones
- [ ] JWT keys RSA estan generadas y con permisos correctos
- [ ] `composer test` pasa (minimo: health check test)
- [ ] `phpstan analyse` nivel 10 sin errores
- [ ] `pint --test` sin diferencias
- [ ] Estructura DDD creada en `src/`
- [ ] Autoloading PSR-4 configurado y funcionando
- [ ] Migraciones ejecutadas y reversibles

> [!note] Nota
> Esta verificacion corresponde al entregable de la Sesion 1 del
> [[IMPLEMENTATION_PLAN]]. Al completarla, actualizar [[SESSION_MANIFEST]].

### 10.2 Comandos de Verificacion Rapida

```bash
# Health check
curl -i http://localhost:8080/api/v1/health

# Verificar headers de seguridad
curl -I http://localhost:8080/api/v1/health | grep -E "Strict-Transport|X-Content|X-Frame|CSP"

# Verificar estructura JWT (decodificar sin verificar firma)
echo "TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .
# Debe mostrar los 12 claims definidos en JWT_IMPLEMENTATION.md seccion 3.2
```

---

## 11. Documentacion de API con Scribe

```bash
php artisan scribe:generate
```

La documentacion se genera en `public/docs/` y es accesible via `/docs`.

---

## 12. Automatización CI/CD

### 12.1 Pipeline de Calidad (GitHub Actions)

Crear `.github/workflows/quality.yml` con los siguientes jobs:

```yaml
name: Quality Assurance

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:18.4-alpine  # Verificar tag en hub.docker.com/_/postgres
        env:
          POSTGRES_DB: urbania_test
          POSTGRES_USER: urbania
          POSTGRES_PASSWORD: secret
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.5  # Verificar disponibilidad en shivammathur/setup-php
          extensions: pgsql, pdo_pgsql, redis, mbstring, bcmath, intl

      - name: Install dependencies
        run: composer install --prefer-dist --no-interaction

      - name: Laravel Pint
        run: vendor/bin/pint --test

      - name: PHPStan
        run: vendor/bin/phpstan analyse --no-progress

      - name: Pest Tests + Coverage
        run: vendor/bin/pest --coverage --min=80

      - name: Scribe Docs
        run: php artisan scribe:generate
```

### 12.2 Scripts de Calidad (composer.json)

```json
{
    "scripts": {
        "test": "vendor/bin/pest",
        "test:unit": "vendor/bin/pest --filter=Unit",
        "test:integration": "vendor/bin/pest --filter=Integration",
        "test:feature": "vendor/bin/pest --filter=Feature",
        "test:security": "vendor/bin/pest --filter=Security",
        "test:coverage": "vendor/bin/pest --coverage --min=80",
        "stan": "vendor/bin/phpstan analyse",
        "lint": "vendor/bin/pint --test",
        "fmt": "vendor/bin/pint",
        "migrate": "php artisan migrate",
        "rollback": "php artisan migrate:rollback",
        "scribe": "php artisan scribe:generate",
        "ci": [
            "@lint",
            "@stan",
            "@test"
        ]
    }
}
```

> [!note] Uso
> Los checklists de [[AGENTS]] pueden ejecutarse con `composer ci` en lugar de comandos individuales.

---

## Referencias a Documentos del Proyecto

| Documento | Proposito | Ubicacion |
|-----------|-----------|-----------|
| [[AGENTS]] | Mapa de navegacion, flujos de trabajo, reglas de oro | Raiz del proyecto |
| [[ARCHITECTURE]] | Stack tecnologico, DDD, reglas de dependencia, Docker, ADRs | Raiz del proyecto |
| [[DATABASE]] | Esquema PostgreSQL, convenciones de nomenclatura, migraciones | Raiz del proyecto |
| [[API_CONTRACT]] | Endpoints, request/response, autenticacion, errores, rate limiting | Raiz del proyecto |
| [[JWT_IMPLEMENTATION]] | Especificacion de seguridad JWT RS256 | Raiz del proyecto |
| [[TESTING]] | Especificaciones tecnicas de pruebas | Raiz del proyecto |
| [[IMPLEMENTATION_PLAN]] | Plan de sesiones incremental para el modulo Auth y posteriores | Raiz del proyecto |
| [[SESSION_MANIFEST]] | Estado actual del proyecto entre sesiones de desarrollo | Raiz del proyecto |
| [[DEVELOPMENT_GUIDE]] | Troubleshooting, decisiones tecnicas ad-hoc, comandos de verificacion rapida | Raiz del proyecto |

---

## 13. Plan de Implementacion por Sesiones

> [!note] Nota
> Esta seccion referencia el plan detallado en [[IMPLEMENTATION_PLAN]].
> El modulo Auth se implementa en 8 sesiones incrementales. Cada sesion produce
> codigo runnable y actualiza [[SESSION_MANIFEST]].
> **Audiencia**: Orchestrator que coordina las sesiones de desarrollo.

### 13.1 Resumen de Sesiones para Modulo Auth

| Sesion | Nombre | Objetivo | Documentos principales | Prioridad |
|--------|--------|----------|----------------------|-----------|
| 1 | Setup + Health Check | Infraestructura funcionando | [[SETUP_GUIDE]], [[ARCHITECTURE]], [[DATABASE]] | P0 |
| 2 | Domain Layer | Entidades, VO, excepciones, eventos | [[ARCHITECTURE]], [[DATABASE]], [[TESTING]] | P0 |
| 3 | Application + JWT | UseCases, DTOs, tokens RS256 | [[JWT_IMPLEMENTATION]], [[ARCHITECTURE]], [[TESTING]] | P0 |
| 4 | Infrastructure | Repositorios, mappers, Eloquent | [[DATABASE]], [[ARCHITECTURE]], [[TESTING]] | P0 |
| 5 | Presentation Basica | Login, Register, Logout, Me, Refresh | [[API_CONTRACT]], [[JWT_IMPLEMENTATION]], [[TESTING]] | P0 |
| 6 | Seguridad Avanzada | MFA, device fingerprint, sesiones, rotacion | [[JWT_IMPLEMENTATION]] (completo), [[TESTING]] | P0 |
| 7 | Password + Perfil | Forgot, reset, change, update, verify | [[API_CONTRACT]], [[DATABASE]], [[TESTING]] | P0 |
| 8 | Polish + CI/CD | Scribe, PHPStan, Pint, pipeline, ADRs | [[SETUP_GUIDE]], [[TESTING]] | P0 |

### 13.2 Reglas para el Orchestrator

1. **Nunca saltar sesiones** sin justificacion tecnica documentada.
2. **Scope lock**: No agregar tareas de otra sesion durante la sesion actual.
   Si surge la necesidad, documentar como deuda tecnica en [[SESSION_MANIFEST]].
3. **Domain congelado despues de Sesion 2**: Las interfaces de Domain no cambian
   sin actualizar todas las sesiones posteriores (3-8).
4. **Verificar antes de continuar**: Ejecutar `composer test` y `phpstan analyse`
   al inicio de cada sesion si se retoma trabajo despues de una interrupcion.
5. **Actualizar [[SESSION_MANIFEST]]**: Obligatorio al final de cada sesion.
   Incluir: archivos creados/modificados, metricas de calidad, deuda tecnica.
6. **Contexto minimo**: Solo entregar al agente los documentos listados en
   "Documentos requeridos" de cada sesion en [[IMPLEMENTATION_PLAN]].

### 13.3 Versioning de API

La API usa **URL-based versioning**: `/api/v1/...`

**Estrategia**:
- La versión se incrementa solo en cambios breaking (no backward-compatible)
- Cambios aditivos (nuevos campos, nuevos endpoints) no requieren nueva versión
- Mantener máximo 2 versiones activas simultáneamente (v1 actual, v2 en desarrollo)
- Las versiones deprecadas se mantienen por 6 meses con aviso en headers de respuesta

**Headers de respuesta para versiones**:
```
API-Version: v1
API-Deprecation: false
API-Sunset: null
```

### 13.4 Flujo de Lectura para el Agente por Sesion

```
Sesion 1:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> SETUP_GUIDE.md -> ARCHITECTURE.md -> DATABASE.md -> API_CONTRACT.md (Health) -> TESTING.md
Sesion 2:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> ARCHITECTURE.md -> DATABASE.md -> TESTING.md -> JWT_IMPLEMENTATION.md (Sec 3.2, 3.3)
Sesion 3:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> ARCHITECTURE.md -> JWT_IMPLEMENTATION.md (completo) -> API_CONTRACT.md -> TESTING.md
Sesion 4:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> ARCHITECTURE.md -> DATABASE.md (completo) -> TESTING.md
Sesion 5:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> ARCHITECTURE.md -> API_CONTRACT.md -> JWT_IMPLEMENTATION.md (Sec 4.1, 5.1) -> TESTING.md
Sesion 6:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> JWT_IMPLEMENTATION.md (COMPLETO) -> API_CONTRACT.md -> DATABASE.md -> TESTING.md
Sesion 7:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> API_CONTRACT.md -> DATABASE.md -> JWT_IMPLEMENTATION.md (Sec 4.4, 8.1) -> TESTING.md
Sesion 8:  IMPLEMENTATION_PLAN.md -> SESSION_MANIFEST.md -> AGENTS.md -> SETUP_GUIDE.md (Sec 10-12) -> TESTING.md (Sec 5, 7) -> ARCHITECTURE.md (Sec 14)
```