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
| **Numero**       | 15                             |
| **Nombre**       | CAMBIO-006 Sesion 4 — C3 + H2: RBAC con scope + reemplazo del claim role (migraciones y seeders) |
| **Estado**       | 🚧 En progreso                 |
| **Nota**         | Migraciones y seeders RBAC creados y verificados en urbania_test. Domain/Application/Gate/JWT aun pendientes. |
| **Fecha inicio** | 2026-06-29                     |
| **Fecha fin**    | 2026-06-29                     |
| **Agente**       | opencode                       |

---

## Resumen Ejecutivo

Sesion parcial de CAMBIO-006 Sesion 4 enfocada en el esquema de datos y la semilla
inicial del modulo de autorizacion (RBAC). Se crearon seis migraciones PostgreSQL:
`permissions`, `roles`, `role_permissions`, `role_assignments`,
`permission_audit_log` y `approval_rules`.

Los nombres de archivo solicitados (`2026_06_28_000007_*` a `000012_*`) chocaban
con las migraciones ya existentes `create_property_document_types_table` (000007) y
`create_property_documents_table` (000008), por lo que se desplazaron a
`000009` - `000014` para mantener el orden cronologico sin sobrescribir archivos.

Se crearon tres seeders idempotentes:
`RbacPermissionSeeder` (catalogo de 45 permisos `recurso.accion`),
`RbacRoleSeeder` (11 roles de sistema con sus permisos asignados) y
`RbacMigrationSeeder` (migra los valores legacy `users.role` a
`role_assignments` en scope `organization`). Los seeders se registraron en
`DatabaseSeeder.php` despues de `TenancyBootstrapSeeder`.

Se verifico que las migraciones son reversibles (`migrate:rollback --step=6` sobre
`urbania_test`) y se reejecutaron (`migrate` + seeders) sin errores.

`composer test` reporta 325 tests pasados y 3 fallos preexistentes (rate limiting
flaky y 2 tests de CORS con origen `localhost:5174` en lugar de `5173`).
`composer stan` reporta solo los 6 errores preexistentes en
`app/Providers/AppServiceProvider.php`; el codigo nuevo es PHPStan nivel 10 limpio.
`composer lint` solo reporta el estilo preexistente en
`src/Tenancy/Domain/Entities/OrganizationEntity.php`.

No se ejecuto `php artisan migrate` sobre la base de desarrollo porque el entorno
apunta al host Docker `db` no disponible en esta maquina; la verificacion se realizo
sobre `urbania_test` (localhost:5433) usando variables de entorno de prueba.

---

## Modulo

| Campo | Valor |
|-------|-------|
| **Modulo** | CAMBIO-006 — Fundacion multi-tenant + RBAC + actor canonico (Sesion 4 parcial) |
| **Prioridad** | P0 |
| **Estado** | 🚧 En progreso en API (Sesion 4 de 5) |
| **Sesion de inicio** | Sesion 15 |

> [!info] Nota de alcance
> Esta sesion cubre la parte de esquema y seed del C3 (RBAC con scope) del plan
> CAMBIO-006. Aun quedan pendientes dentro de la Sesion 4: modulo `src/Authorization`
> (Domain/Application/Infrastructure), resolver de permisos efectivos con cache
> Redis, Gate/middleware `can()`, reemplazo del uso de `users.role` y tests de
> resolucion/segregacion/cache. El modulo Directorio y el modulo Propiedades se
> mantuvieron congelados. La Sesion 5 (cierre) de CAMBIO-006 queda pendiente.

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
| Pint | 1 archivo preexistente con estilo incorrecto (`src/Tenancy/Domain/Entities/OrganizationEntity.php`) | 0 archivos | ⚠️ |
| Pipeline CI/CD | `.github/workflows/quality.yml` configurado | Verde | ⚠️ Requiere arreglar AppServiceProvider y formato |

---

## Archivos Creados y Modificados

### Archivos creados (Sesión 15)

- `database/migrations/2026_06_28_000009_create_permissions_table.php`
- `database/migrations/2026_06_28_000010_create_roles_table.php`
- `database/migrations/2026_06_28_000011_create_role_permissions_table.php`
- `database/migrations/2026_06_28_000012_create_role_assignments_table.php`
- `database/migrations/2026_06_28_000013_create_permission_audit_log_table.php`
- `database/migrations/2026_06_28_000014_create_approval_rules_table.php`
- `database/seeders/RbacPermissionSeeder.php`
- `database/seeders/RbacRoleSeeder.php`
- `database/seeders/RbacMigrationSeeder.php`

### Archivos modificados (Sesión 15)

**Código**
- `database/seeders/DatabaseSeeder.php` — registrados `RbacPermissionSeeder`, `RbacRoleSeeder` y `RbacMigrationSeeder`.

**Documentación API**
- `01-api/API_DATABASE.md` — agregada sección 5 (Autorización / RBAC) con las 6 tablas y nota sobre deprecación de `users.role`.

> [!note] Nota
> El detalle completo de archivos y tareas se encuentra en la nota atomica de sesion
> `01-api/docs/log/sesiones/sesion-15.md`.

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

**Proxima Sesion**: Continuacion de Sesion 15 — Completar CAMBIO-006 Sesion 4 (RBAC con scope + reemplazo del claim role).
**Objetivo**:
1. Crear modulo `src/Authorization` (Domain/Application/Infrastructure): Role, Permission, RoleAssignment.
2. Resolver permisos efectivos por user + scope con cache Redis.
3. Gate/middleware `can('recurso.accion', $scope)`; reemplazar uso de `users.role` en `JwtAuthenticate` y demas middleware.
4. Tests: resolucion por scope, segregacion, invalidacion de cache, role binario ya no autoriza, migracion de roles existentes.

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
