---
name: new-endpoint
description: Guía el flujo DDD completo para crear un endpoint nuevo en la API Urbania
---

## Cuándo usar esta skill

Al crear cualquier endpoint nuevo. Sigue los 8 pasos en orden — no saltes ninguno.

## Paso 1 — Documentar en API_CONTRACT

Antes de escribir una sola línea de código:
- Abrir `documentacion/01-api/API_CONTRACT.md`
- Agregar la especificación del endpoint: método HTTP, URL, request body, headers, response exitoso, posibles errores
- Estado inicial: "Especificado"

## Paso 2 — Definir esquema en API_DATABASE (si aplica)

Si el endpoint requiere tabla nueva o columna nueva:
- Actualizar `documentacion/01-api/API_DATABASE.md`
- Crear migración con `up()` y `down()` reversible
- Usar UUID v7 para PKs, convenciones PostgreSQL

## Paso 3 — Domain Layer

Crear en `API/src/<Feature>/Domain/`:
- Entity con reglas de negocio y validaciones
- Value Objects si aplica
- Excepciones de dominio tipadas (nunca excepciones crudas)
- Interface del Repository

**Verificar:** nada en Domain importa Laravel, Eloquent ni paquetes externos.

## Paso 4 — Application Layer

Crear en `API/src/<Feature>/Application/`:
- Request DTO (`final readonly class`)
- Response DTO (`final readonly class`)
- UseCase que orquesta Domain

**Verificar:** UseCase solo depende de Domain interfaces, no de Infrastructure.

## Paso 5 — Infrastructure Layer

Crear en `API/src/<Feature>/Infrastructure/`:
- Repository implementation (implementa la interface de Domain)
- Eloquent Model si aplica (solo en Infrastructure)
- Mapper entre Eloquent Model y Domain Entity
- HTTP Resource (transformación de respuesta)

## Paso 6 — Presentation Layer

Crear en `API/src/<Feature>/Presentation/`:
- Controller (thin — solo valida, delega al UseCase, formatea respuesta)
- Request Form (validación HTTP)
- `routes.php` del feature

Registrar en ServiceProvider.

## Paso 7 — Tests

Crear tests en `API/tests/`:
- Unit test del UseCase
- Integration test del Repository
- Feature test del endpoint completo (request → response)

Ejecutar: `composer test` y `composer stan`.

## Paso 8 — Cierre

- Marcar endpoint como "Implementado" en `documentacion/01-api/API_CONTRACT.md`
- Si afecta a Web o App, verificar si es cambio cross-project con skill `cross-project-change`

## Reglas no negociables

- Domain isolation: nunca romper la dependencia unidireccional
- Un formato de error: `{ error: { code, message, trace_id } }`
- DTOs siempre `final readonly class`
- `down()` siempre implementado en migraciones
