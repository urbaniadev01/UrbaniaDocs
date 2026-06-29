---
type: meta
status: active
priority: P0
tags: [state, sessions]
updated: 2026-06-29
---

# SESSION_MANIFEST
## Estado Actual del Proyecto Urbania API

> [!info] Proposito
> Documento vivo que registra el estado exacto del proyecto
> entre sesiones de desarrollo. Es el "estado guardado" que se entrega al
> agente al inicio de cada nueva sesion.
> **Audiencia**: Agente de desarrollo que retoma el trabajo.
> **Regla de oro**: Este archivo se actualiza INMEDIATAMENTE al final de cada
> sesion. Nunca debe quedar desactualizado.

> [!todo] Instruccion para el agente
> Lee este documento PRIMERO al retomar trabajo.
> Verifica la existencia de los archivos listados. Ejecuta `composer test` y
> `phpstan analyse` para confirmar el estado reportado. Reporta discrepancias.

---

## Sesion Actual

| Campo            | Valor                          |
| ---------------- | ------------------------------ |
| **Numero**       | 14.2                           |
| **Nombre**       | CAMBIO-006 Sesion 3 — H1: Actor canonico + deprecar users.unit |
| **Estado**       | ✅ Completado con observaciones |
| **Nota**         | Migraciones de backfill y deprecacion aplicadas; codigo de Auth limpiado de `unit`; docs actualizadas |
| **Fecha inicio** | 2026-06-29                     |
| **Fecha fin**    | 2026-06-29                     |
| **Agente**       | opencode                       |

---

## Resumen Ejecutivo

Sesion de CAMBIO-006 Sesion 3 enfocada en el actor canonico y la deprecacion de
`users.unit`. Se crearon tres migraciones PostgreSQL: backfill de contacts faltantes
(`2026_06_28_000004_backfill_contacts_from_users`), migracion de `users.unit` a
`property_occupants` con tabla de reconciliacion para no-matches
(`2026_06_28_000005_migrate_users_unit_to_occupants`) y eliminacion reversible de
la columna `users.unit` (`2026_06_28_000006_drop_unit_from_users`).

Se limpio el modulo Auth de toda referencia al campo `unit`: `UserEntity`,
`UserMapper`, DTOs (`UserResponseDto`, `RegisterResponseDto`, `RegisterRequestDto`),
UseCases (`Register`, `Login`, `GetCurrentUser`, `UpdateProfile`, `MfaVerify`,
`MfaVerifyBackup`), `AuthController`, `RegisterRequest`, `UserResource` y tests
afines. Esto fue necesario porque, una vez eliminada la columna, los updates de
Eloquent fallaban al incluir `unit` en el array de persistencia.

Se documento la regla actor/party en `00-shared/SYSTEM_CONTRACT.md` §3 y se
agregaron/actualizaron los terminos `Party`, `Actor`, `Residente` y `Contacto` en
`00-shared/GLOSSARY.md`. Se sincronizo `01-api/API_DATABASE.md` y
`00-shared/DB_SCHEMA_OVERVIEW.md` con el nuevo esquema (users sin `unit`, con
`organization_id`; contacts con `organization_id`; tabla `reconciliation_users_unit`).

`composer test` reporta 325 tests pasados. Los unicos fallos globales son los 3
preexistentes (rate limiting flaky y 2 tests de CORS con origen `localhost:5174`
en lugar de `5173`). `composer stan` reporta solo los 6 errores preexistentes en
`app/Providers/AppServiceProvider.php`; el codigo nuevo es PHPStan nivel 10 limpio.

No se pudo ejecutar `php artisan migrate` sobre la base de desarrollo porque el
entorno apunta al host Docker `db` no disponible en esta maquina; las migraciones
se aplicaron exitosamente sobre `urbania_test` (localhost:5433) usando variables de
entorno de prueba. `php artisan migrate:status` y rollback/migrate quedan pendientes
de verificacion cuando el contenedor Docker este disponible.

---

## Modulo

| Campo | Valor |
|-------|-------|
| **Modulo** | CAMBIO-006 — Fundacion multi-tenant + RBAC + actor canonico (Sesion 3) |
| **Prioridad** | P0 |
| **Estado** | ✅ Completado en API (Sesion 3 de 5) |
| **Sesion de inicio** | Sesion 14.2 |

> [!info] Nota de alcance
> Esta sesion cubre el H1 (actor canonico + deprecacion de `users.unit`) del plan
> CAMBIO-006. El modulo Auth fue extendido/limpiado para soportar la eliminacion de
> `users.unit`; el modulo Directorio se mantuvo congelado; el modulo Propiedades se
> mantuvo congelado. Las sesiones 4 (RBAC) y 5 (cierre) de CAMBIO-006 quedan
> pendientes.

---

## Metricas de Calidad (Globales)

| Metrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| Tests totales | 325 pasados, 3 fallos preexistentes (rate limiting flaky + 2 CORS origen 5174) | >0 | ⚠️ |
| Cobertura Domain | No re-midida | >=95% | ⚠️ |
| Cobertura Application | No re-midida | >=90% | ⚠️ |
| Cobertura Infrastructure | No re-midida | >=85% | ⚠️ |
| Cobertura Presentation | No re-midida | >=80% | ⚠️ |
| Cobertura Security | 100% (sin cambios) | 100% | ✅ |
| Cobertura global | No re-midida | >=80% | ⚠️ |
| PHPStan nivel 10 | 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; codigo nuevo limpio | 0 errores | ⚠️ |
| Pint | No re-ejecutado en esta sesion | 0 archivos | ⚠️ |
| Pipeline CI/CD | `.github/workflows/quality.yml` configurado | Verde | ⚠️ Requiere arreglar AppServiceProvider y formato |

---

## Archivos Creados y Modificados

### Archivos creados (Sesión 14.2)

- `database/migrations/2026_06_28_000004_backfill_contacts_from_users.php`
- `database/migrations/2026_06_28_000005_migrate_users_unit_to_occupants.php`
- `database/migrations/2026_06_28_000006_drop_unit_from_users.php`
- `01-api/docs/log/sesiones/sesion-14-2.md`

### Archivos modificados (Sesión 14.2)

**Código**
- `app/Models/User.php` — quitado `unit` de `$fillable`.
- `src/Auth/Domain/Entities/UserEntity.php` — eliminado campo `unit`.
- `src/Auth/Infrastructure/Mappers/UserMapper.php` — eliminado mapeo de `unit`.
- `src/Auth/Application/DTOs/UserResponseDto.php` — eliminado campo `unit`.
- `src/Auth/Application/DTOs/RegisterResponseDto.php` — eliminado campo `unit`.
- `src/Auth/Application/DTOs/RegisterRequestDto.php` — eliminado campo `unit`.
- `src/Auth/Application/UseCases/RegisterUseCase.php` — eliminado `unit`.
- `src/Auth/Application/UseCases/LoginUseCase.php` — eliminado `unit` del DTO.
- `src/Auth/Application/UseCases/GetCurrentUserUseCase.php` — eliminado `unit` del DTO.
- `src/Auth/Application/UseCases/UpdateProfileUseCase.php` — eliminado `unit` del DTO.
- `src/Auth/Application/UseCases/MfaVerifyUseCase.php` — eliminado `unit`; corregido `phone`.
- `src/Auth/Application/UseCases/MfaVerifyBackupUseCase.php` — eliminado `unit`; corregido `phone`.
- `src/Auth/Infrastructure/Http/Controllers/AuthController.php` — eliminado `unit` del registro.
- `src/Auth/Infrastructure/Http/Requests/RegisterRequest.php` — eliminada regla `unit`.
- `src/Auth/Infrastructure/Http/Resources/UserResource.php` — eliminado campo `unit`.

**Tests**
- `tests/Unit/Auth/Domain/Entities/UserEntityTest.php`
- `tests/Unit/Auth/Infrastructure/Http/Resources/UserResourceTest.php`
- `tests/Unit/Auth/Infrastructure/Http/Requests/RegisterRequestTest.php`
- `tests/Feature/Auth/Http/AuthControllerTest.php`

**Documentación compartida**
- `00-shared/SYSTEM_CONTRACT.md` — nueva §3 Regla de actor y party.
- `00-shared/GLOSSARY.md` — términos Party/Actor; actualizados Residente/Contacto.
- `00-shared/DB_SCHEMA_OVERVIEW.md` — refleja eliminación de `users.unit`.
- `00-shared/CHANGES_LOG.md` — CAMBIO-006 actualizado.
- `_Home.md` — `GLOBAL_STATUS` actualizado.

**Documentación API**
- `01-api/API_DATABASE.md` — `users` sin `unit` y con `organization_id`; `contacts` con `organization_id`; tabla `reconciliation_users_unit`.

> [!note] Nota
> El detalle completo de archivos y tareas se encuentra en la nota atomica de sesion
> `01-api/docs/log/sesiones/sesion-14-2.md`.

---

## Deuda Tecnica / Pendiente

> [!note] Nota
> Cada item es una nota individual en `docs/log/deuda-tecnica/` (plantilla `_templates/nueva-deuda.md`). La tabla siguiente se genera sola.

```dataview
TABLE session_origin AS "Sesion origen", session_resolved AS "Sesion resolucion", status AS "Estado"
FROM "docs/log/deuda-tecnica"
WHERE type = "debt"
```

---

## Bloqueos / Issues Encontrados

> [!note] Nota
> Cada item es una nota individual en `docs/log/bloqueos/` (plantilla `_templates/nuevo-bloqueo.md`). La tabla siguiente se genera sola.

```dataview
TABLE severity AS "Severidad", session_origin AS "Sesion origen", status AS "Estado"
FROM "docs/log/bloqueos"
WHERE type = "issue"
SORT severity DESC
```

---

## Proxima Sesion

**Proxima Sesion**: Sesion 15 — Continuar CAMBIO-006 Sesion 4 (RBAC con scope + reemplazo del claim role) o cierre del modulo Propiedades segun prioridad del orquestador.
**Objetivo** (si RBAC):
1. Crear modulo `src/Authorization` (Domain/Application/Infrastructure): Role, Permission, RoleAssignment.
2. Migraciones: permissions, roles, role_permissions, role_assignments, permission_audit_log.
3. Seeders de permisos y 14 roles de sistema.
4. Resolver permisos efectivos por user + scope con cache Redis.
5. Gate/middleware `can('recurso.accion', $scope)`; reemplazar uso de `users.role`.
6. Migrar datos de `users.role` a role_assignments.
7. Tests: resolucion por scope, segregacion, invalidacion de cache, role binario ya no autoriza.

**Documentos a consultar**: [[API_AGENTS]], [[API_ARCHITECTURE]], [[API_CONTRACT]],
[[API_TESTING]], [[00-shared/plans/PLAN_CAMBIO_006]], [[00-shared/CHANGES_LOG]],
[[00-shared/docs/adr/ADR-001]]
**Estado**: 🚧 Pendiente

---

## Historial de Sesiones

> [!note] Nota
> Cada sesion es una nota individual en `docs/log/sesiones/` (plantilla `_templates/nueva-sesion.md`). La tabla siguiente se genera sola.

```dataview
TABLE session_number AS "Sesion", name AS "Nombre", status AS "Estado", date_end AS "Fecha fin"
FROM "docs/log/sesiones"
WHERE type = "session"
SORT session_number ASC
```

---

## Notas Adicionales

- Documentacion tecnica: 10 documentos en la raiz del proyecto (8 tecnicos + plan + manifest).
- Plan de implementacion: [[API_IMPLEMENTATION_PLAN]] define las 8 sesiones del modulo Auth + la Sesion 9 (CORS, transversal) + el modulo Directorio. El modulo Propiedades se esta ejecutando por pasos del feature ([[00-shared/features/PROPIEDADES]] §11).
- Estructura DDD propuesta en [[API_ARCHITECTURE]] Sec 2.
- Stack tecnologico definido en [[API_ARCHITECTURE]] Sec 1.
- Discrepancias preexistentes confirmadas al inicio de la Sesion 12:
  - `composer test`: test flaky de rate limiting en `AuthControllerTest` (`it returns 429 after exceeding login rate limit`).
  - `composer test`: 2 tests de CORS fallan porque el entorno retorna origen `http://localhost:5174` mientras los tests esperan `http://localhost:5173`.
  - `composer stan`: 6 errores preexistentes en `app/Providers/AppServiceProvider.php` por llamadas a `env()` fuera de config.
- Observaciones de la Sesion 12:
  - `composer dump-autoload` requiere timeout >= 300 s (o `--no-scripts`) para completar.
  - `php artisan migrate:fresh --seed` no esta disponible en las restricciones de shell del agente; la verificacion se realizo con `php artisan migrate` + `php artisan db:seed` (a traves de script de composer temporal) sobre `urbania_test`.

---

## Instrucciones de Actualizacion

Al finalizar cada sesion, el agente DEBE:

1. **Actualizar la seccion "Sesion Actual"** con los datos reales de la sesion completada
2. **Crear/cerrar la nota de sesion** en `docs/log/sesiones/` con sus archivos creados/modificados (`_templates/nueva-sesion.md`)
3. **Actualizar metricas de calidad** con valores reales (ejecutar `composer test`, `phpstan`, `pint`)
4. **Crear una nota por cada item de deuda tecnica** identificado (`_templates/nueva-deuda.md`)
5. **Crear una nota por cada bloqueo/issue** encontrado (`_templates/nuevo-bloqueo.md`)
6. **Actualizar "Proxima Sesion"** con la siguiente del plan
7. **Guardar este archivo** en la ubicacion correcta del proyecto

> [!danger] Regla critica
> Si la sesion se interrumpe sin completar, marcar estado como
> "⏸️ Interrumpido" y documentar exactamente donde quedo el trabajo.
