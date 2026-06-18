---
type: operational
status: active
tags: [troubleshooting, decisions]
updated: 2026-06-17
---

# DEVELOPMENT_GUIDE
## Guia de Desarrollo Diario y Troubleshooting

> [!tip] Proposito
> Decisiones tecnicas del dia a dia, solucion de problemas comunes,
> y convenciones operativas que no caben en los documentos de arquitectura o setup.
> **Audiencia**: Agentes de desarrollo en sesiones activas.
> **Regla de oro**: Si encuentras un problema y lo resuelves, documentalo aqui
> para que el proximo agente no repita el trabajo.

---

## Indice de Contenidos

1. [Flujo de Trabajo por Sesion](#1-flujo-de-trabajo-por-sesion)
2. [Troubleshooting Comun](#2-troubleshooting-comun)
3. [Decisiones Tecnicas Ad-hoc](#3-decisiones-tecnicas-ad-hoc)
4. [Convenciones Operativas](#4-convenciones-operativas)
5. [Comandos de Verificacion Rapida](#5-comandos-de-verificacion-rapida)

---

## 1. Flujo de Trabajo por Sesion

### Al inicio de cada sesion (obligatorio)

```bash
# 1. Verificar estado del entorno
docker compose ps
docker compose exec app php artisan --version

# 2. Verificar estado del codigo (si es sesion de continuacion)
composer test
composer stan
composer lint

# 3. Si hay discrepancias con SESSION_MANIFEST.md, reportar inmediatamente
```

### Durante la sesion

1. **Scope lock**: No salir del scope definido en [[IMPLEMENTATION_PLAN]] para esta sesion
2. **Test-driven**: Escribir test antes o junto al codigo ([[TESTING]] Sec 6.3 FIRST)
3. **Documentacion viva**: Si cambias un contrato (API, DB, arquitectura), actualizar el documento fuente en la misma sesion

### Al final de cada sesion (obligatorio)

```bash
# 1. Verificar calidad
composer ci

# 2. Actualizar SESSION_MANIFEST.md
# 3. Actualizar este archivo si se encontraron problemas nuevos
# 4. Commit con mensaje descriptivo: "[Sesion N] Descripcion breve"
```

---

## 2. Troubleshooting Comun

### Problema: PostgreSQL no inicia en Docker

**Sintoma**: `docker compose up` falla con "database system is starting up" o connection refused.

**Solucion**:
```bash
# Verificar que el healthcheck este configurado (docker-compose.yml)
docker compose logs db

# Si el contenedor reinicia continuamente:
docker compose down -v  # ⚠️ Elimina volumenes (perdera datos)
docker compose up -d --build

# Si persiste, verificar puerto 5433 no este ocupado:
sudo lsof -i :5433
```

**Prevencion**: El docker-compose.yml de [[ARCHITECTURE]] incluye healthcheck. Asegurar que `depends_on` con `condition: service_healthy` este configurado.

---

### Problema: Claves RSA no funcionan (JWT RS256)

**Sintoma**: `openssl_sign(): supplied key param cannot be coerced into a private key`

**Solucion**:
```bash
# Verificar permisos
ls -la storage/jwt/
# Debe ser: private.pem (600), public.pem (644)

# Si las claves estan corruptas, regenerar:
rm storage/jwt/*.pem
openssl genrsa -out storage/jwt/private.pem 4096
openssl rsa -in storage/jwt/private.pem -pubout -out storage/jwt/public.pem
chmod 600 storage/jwt/private.pem
chmod 644 storage/jwt/public.pem

# Verificar formato PKCS#8
openssl rsa -in storage/jwt/private.pem -text -noout
```

**Prevencion**: Generar claves en Sesion 1 y no modificarlas sin documentar.

---

### Problema: PHPStan reporta errores en codigo de terceros

**Sintoma**: `phpstan analyse` falla con errores en `vendor/` o archivos de Laravel.

**Solucion**:
```neon
# phpstan.neon
parameters:
    level: 10
    paths:
        - src
        - app
    excludePaths:
        - vendor
        - bootstrap
        - storage
        - config  # Solo si es necesario
    ignoreErrors:
        # Documentar cada ignore con justificacion tecnica
        - '#PHPDoc tag @var#'
```

**Prevencion**: No ignorar errores sin justificacion. Cada ignore debe tener un comentario explicando por que es seguro ignorar.

---

### Problema: Pint formatea archivos que no deberia

**Sintoma**: `pint` modifica archivos generados automaticamente (migrations, models de vendor).

**Solucion**:
```json
// pint.json
{
    "preset": "laravel",
    "exclude": [
        "vendor",
        "storage",
        "bootstrap",
        "database/migrations/*_create_*_table.php"  # Solo si ya estan en produccion
    ],
    "rules": {
        "ordered_imports": true,
        "declare_strict_types": true
    }
}
```

**Prevencion**: Configurar `pint.json` en Sesion 1.

---

### Problema: Tests fallan por timezone o drift de tiempo

**Sintoma**: Tests de JWT expiracion o TOTP fallan intermitentemente.

**Solucion**:
```php
// En tests, usar ClockMock o Carbon::setTestNow()
use function Tests\freezeTime;

freezeTime(function () {
    // Codigo que depende del tiempo
});

// O con Carbon directamente:
\Carbon\Carbon::setTestNow('2026-06-13 12:00:00');
// ... test ...
\Carbon\Carbon::setTestNow(null);
```

**Prevencion**: Nunca usar `sleep()` en tests. Siempre mockar el tiempo.

---

### Problema: Redis no conecta desde tests

**Sintoma**: `Connection refused` al usar Redis en tests.

**Solucion**:
```bash
# Verificar que Redis este corriendo
docker compose ps redis

# Verificar configuracion en .env.testing
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=1  # Separado de desarrollo (DB 0)

# Si Redis esta en host local (sin Docker):
REDIS_HOST=127.0.0.1
```

**Prevencion**: Usar DB 1 para testing, DB 0 para desarrollo.

---

### Problema: Compatibilidad PHP 8.5 con paquetes

**Sintoma**: `composer install` falla con requisitos de version no satisfechos.

**Solucion**:
```bash
# Verificar versiones disponibles
composer show php-open-source-saver/jwt-auth | grep versions
composer show larastan/larastan | grep versions

# Si hay conflictos, fallback a PHP 8.4:
# Modificar Dockerfile: FROM php:8.4-fpm
# Modificar composer.json: "php": "^8.4"
# Documentar en este archivo y en ARCHITECTURE.md Sec 1
```

**Decision registrada**: Si PHP 8.5 no tiene soporte completo de paquetes principales (jwt-auth, larastan), usar PHP 8.4. Laravel 13 requiere PHP 8.3+, por lo que 8.4 es compatible sin cambios.

---

### Problema: Formato de error de validacion de Laravel no coincide con API_CONTRACT

**Sintoma**: Laravel retorna errores de validacion en formato `{ message: "...", errors: {...} }` 
pero [[API_CONTRACT]] exige `{ error: { code, message, trace_id } }`.

**Solucion**: Sobrescribir el manejo de excepciones de validacion en `app/Exceptions/Handler.php` 
o en el ExceptionHandler del bounded context:

```php
use Illuminate\\Validation\\ValidationException;

public function render($request, Throwable $exception)
{
    if ($exception instanceof ValidationException) {
        return response()->json([
            'error' => [
                'code' => 'VALIDATION_ERROR',
                'message' => 'Error de validacion de campos',
                'trace_id' => $request->header('X-Trace-Id', Str::uuid()->toString()),
                'details' => $exception->errors(), // opcional: incluir detalles de campos
            ]
        ], 422);
    }

    return parent::render($request, $exception);
}
```

**Prevencion**: Implementar esta sobrescritura en la Sesion 5 (Presentation Layer).

---

## 3. Decisiones Tecnicas Ad-hoc

> [!tip] Formato
> Fecha | Decision | Contexto | Consecuencias | Documentos afectados

> [!note] Nota
> Cada decisión es ahora una nota individual en `docs/log/decisiones/` (plantilla `_templates/nueva-decision.md`), no una entrada agregada a este archivo. La lista completa se consulta en [[_Home]].

```dataview
TABLE status AS "Estado", date AS "Fecha"
FROM "docs/log/decisiones"
WHERE type = "decision"
SORT date DESC
```

---

## 4. Convenciones Operativas

### Commits

```
[Sesion N] Descripcion breve en imperativo

- Detalle de cambios
- Referencia a documentos actualizados
```

Ejemplo:
```
[Sesion 2] Implementar Domain Layer Auth

- Entidades: UserEntity, RefreshTokenEntity
- ValueObjects: Password, UserRole, UserStatus, DeviceFingerprint
- Excepciones: 11 excepciones especificas de dominio
- Eventos: 7 eventos de dominio
- Architecture tests: Domain independencia verificada
- Actualizado: DATABASE.md (convenciones), TESTING.md (cobertura)
```

### Branches

```
main          # Produccion estable
develop       # Integracion continua
feature/auth  # Modulo Auth
```

### Pull Requests

- Titulo: `[Sesion N] Modulo - Descripcion`
- Checklist de [[AGENTS]] aplicado
- Todos los tests pasan
- PHPStan nivel 10 sin errores
- Pint sin cambios
- Cobertura minima alcanzada

---

## 5. Comandos de Verificacion Rapida

```bash
# === Calidad ===
composer ci              # Pipeline completo: lint + stan + test
composer test            # Todos los tests
composer test:unit       # Solo unit tests
composer test:integration # Solo integration tests
composer test:feature    # Solo feature tests
composer test:security   # Solo security tests
composer test:coverage   # Tests con cobertura
composer stan            # PHPStan nivel 10
composer lint            # Pint (modo test)
composer fmt             # Pint (modo fix)

# === Laravel ===
php artisan migrate      # Ejecutar migraciones
php artisan migrate:rollback # Revertir ultimo batch
php artisan migrate:status   # Ver estado de migraciones
php artisan scribe:generate  # Generar documentacion API
php artisan route:list       # Listar rutas registradas
php artisan cache:clear      # Limpiar cache
php artisan config:clear     # Limpiar config cache

# === Docker ===
docker compose up -d --build     # Levantar todo
docker compose down -v           # Detener y eliminar volumenes
docker compose logs -f app       # Logs de la app
docker compose exec app bash     # Shell en el contenedor
docker compose exec app php artisan [comando]  # Ejecutar artisan

# === Redis ===
docker compose exec redis redis-cli
> KEYS *                    # Listar todas las claves
> GET jwt:blacklist:{jti}   # Verificar blacklist
> HGETALL session:{id}      # Verificar sesion
> FLUSHDB                   # Limpiar DB (⚠️ cuidado)

# === PostgreSQL ===
docker compose exec db psql -U urbania -d urbania
\dt                         # Listar tablas
\d users                    # Describir tabla users
SELECT * FROM users LIMIT 5; # Ver datos

# === JWT (debug) ===
# Decodificar token sin verificar firma (solo para debug)
echo "TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | jq .

# === Health Check ===
curl -i http://localhost:8080/api/v1/health
curl -I http://localhost:8080/api/v1/health | grep -E "Strict-Transport|X-Content|X-Frame|CSP"
```

---

## Referencias

| Documento | Cuando consultar |
|-----------|------------------|
| [[IMPLEMENTATION_PLAN]] | Plan de sesiones, scope de trabajo |
| [[SESSION_MANIFEST]] | Estado actual del proyecto |
| [[AGENTS]] | Flujos de trabajo, reglas de oro, checklists |
| [[ARCHITECTURE]] | Stack, DDD, convenciones, reglas de dependencia |
| [[SETUP_GUIDE]] | Inicializacion, Docker, dependencias |
| [[TESTING]] | Estructura de tests, reglas, cobertura |
| [[API_CONTRACT]] | Endpoints, request/response, errores |
| [[JWT_IMPLEMENTATION]] | Seguridad JWT, MFA, headers |
| [[DATABASE]] | Esquema, migraciones, convenciones BD |
