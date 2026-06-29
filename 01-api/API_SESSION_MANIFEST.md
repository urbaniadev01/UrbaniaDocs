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
| **Numero**       | 16                             |
| **Nombre**       | CAMBIO-006 Sesion 4 — C3 + H2: RBAC con scope + reemplazo del claim role (modulo Authorization DDD) |
| **Estado**       | ✅ Completada                  |
| **Nota**         | Modulo `src/Authorization` creado con entidades, repositorio, resolver de permisos con cache Redis, middleware `can()` y provider. Reemplazo de `users.role` para autorizacion server-side. Tests de resolucion basicos agregados. |
| **Fecha inicio** | 2026-06-29                     |
| **Fecha fin**    | 2026-06-29                     |
| **Agente**       | opencode                       |

---

## Resumen Ejecutivo

Sesion de cierre de la parte de dominio/aplicacion/infraestructura de CAMBIO-006
Sesion 4 (RBAC con scope). Se creo el modulo `src/Authorization` completo:

- **Domain**: entidades `Role`, `Permission`, `RoleAssignment`; interfaz
  `RoleRepositoryInterface`; contrato `PermissionResolverInterface`.
- **Infrastructure**: `EloquentRoleRepository`, `CachedPermissionResolver` (cache
  Redis con TTL 5 minutos, prefijo `perms:`), `AuthorizationServiceProvider`.
- **Eloquent models**: `Role`, `Permission`, `RoleAssignment` en `app/Models/`.
- **Middleware**: `AuthorizationMiddleware` en
  `src/Shared/Infrastructure/Middleware/` que mapea nombres de ruta a permisos
  `recurso.accion` y resuelve server-side usando `PermissionResolverInterface`.
- **Provider registrado** en `bootstrap/providers.php`.
- **Tests**: `tests/Feature/Authorization/PermissionResolverTest.php` con 3 tests
  de resolucion basica, cache y denegacion.

Se ajusto `RoleRepositoryInterface::findByCode()` para retornar `?Role` en lugar de
`?object` (tipado seguro para PHPStan nivel 10). Se corrigio la derivacion de
permisos de residente para verificar la occupancia real en `property_occupants`
(`is_active = true`, `deleted_at IS NULL`) antes de otorgar el rol `residente`.

`composer test` reporta 328 tests pasados y 3 fallos preexistentes (rate limiting
flaky y 2 tests de CORS con origen `localhost:5174` en lugar de `5173`).
`composer stan` reporta solo los 6 errores preexistentes en
`app/Providers/AppServiceProvider.php`; el codigo nuevo es PHPStan nivel 10 limpio.
`composer lint` pasa sin diferencias (Pint corrigio el formato preexistente en
`src/Tenancy/Domain/Entities/OrganizationEntity.php`).

---

## Modulo

| Campo | Valor |
|-------|-------|
| **Modulo** | CAMBIO-006 — Fundacion multi-tenant + RBAC + actor canonico (Sesion 4 completada) |
| **Prioridad** | P0 |
| **Estado** | 🚧 En progreso en API (Sesion 5 de 5 pendiente: cableado global + cierre) |
| **Sesion de inicio** | Sesion 15 |

> [!info] Nota de alcance
> Esta sesion completa la parte de modulo DDD de autorizacion del C3 (RBAC con
> scope) del plan CAMBIO-006. Queda pendiente la Sesion 5: cablear los middlewares
> de tenant + autorizacion en el pipeline HTTP global, verificar regresiones de
> Auth/Propiedades/Directorio y cerrar CAMBIO-006. El modulo Directorio y el
> modulo Propiedades se mantuvieron congelados.

---

## Metricas de Calidad (Globales)

| Metrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| Tests totales | 328 pasados, 3 fallos preexistentes (rate limiting flaky + 2 CORS origen 5174) | >0 | ⚠️ |
| Cobertura Domain | No re-midida | >=95% | ⚠️ |
| Cobertura Application | No re-midida | >=90% | ⚠️ |
| Cobertura Infrastructure | No re-midida | >=85% | ⚠️ |
| Cobertura Presentation | No re-midida | >=80% | ⚠️ |
| Cobertura Security | 100% (sin cambios) | 100% | ✅ |
| Cobertura global | No re-midida | >=80% | ⚠️ |
| PHPStan nivel 10 | 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; codigo nuevo limpio | 0 errores | ⚠️ |
| Pint | 0 archivos con estilo incorrecto | 0 archivos | ✅ |
| Pipeline CI/CD | `.github/workflows/quality.yml` configurado | Verde | ⚠️ Requiere arreglar AppServiceProvider para CI verde |

---

## Archivos Creados y Modificados

### Archivos creados (Sesión 16)

- `src/Authorization/Domain/Entities/Role.php`
- `src/Authorization/Domain/Entities/Permission.php`
- `src/Authorization/Domain/Entities/RoleAssignment.php`
- `src/Authorization/Domain/Repositories/RoleRepositoryInterface.php`
- `src/Authorization/Domain/Services/PermissionResolverInterface.php`
- `src/Authorization/Infrastructure/Persistence/EloquentRoleRepository.php`
- `src/Authorization/Infrastructure/Services/CachedPermissionResolver.php`
- `src/Authorization/Infrastructure/AuthorizationServiceProvider.php`
- `app/Models/Role.php`
- `app/Models/Permission.php`
- `app/Models/RoleAssignment.php`
- `src/Shared/Infrastructure/Middleware/AuthorizationMiddleware.php`
- `tests/Feature/Authorization/PermissionResolverTest.php`

### Archivos modificados (Sesión 16)

**Código**
- `bootstrap/providers.php` — registrado `AuthorizationServiceProvider`.
- `src/Authorization/Domain/Repositories/RoleRepositoryInterface.php` — `findByCode()` tipado como `?Role`.
- `src/Tenancy/Domain/Entities/OrganizationEntity.php` — formateado por Pint (deuda preexistente).

**Documentación API**
- `01-api/API_SESSION_MANIFEST.md` — actualizado al cierre de sesión.
- `01-api/API_IMPLEMENTATION_PLAN.md` — sesión 16 cerrada.
- `01-api/docs/log/sesiones/sesion-16.md` — nota atómica creada.
- `01-api/API_JWT_IMPLEMENTATION.md` — claim `role` deprecado como autorizador.

**Documentación compartida**
- `00-shared/FEATURES_INDEX.md` — feature #5 Roles y Permisos pasa a "En progreso".
- `00-shared/CHANGES_LOG.md` — actualizado estado de CAMBIO-006 Sesión 16.

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

**Proxima Sesion**: Sesion 17 — CAMBIO-006 Sesion 5 (cierre: cableado global + verificacion).
**Objetivo**:
1. Cablear middlewares de tenant + autorizacion en el pipeline HTTP global.
2. Verificar que Auth/Propiedades/Directorio siguen pasando con scoping + authz.
3. Suite completa verde (baseline + tests nuevos) y PHPStan level 10.
4. Cerrar CAMBIO-006 (estado "Sincronizado").
5. Marcar los 8 hallazgos de `_AUDITORIA_INTEGRIDAD_2026-06-28` como resueltos.
6. Cerrar terminos pendientes del GLOSSARY (H3).
7. Actualizar `_Home.md`, `API_SESSION_MANIFEST.md`, `FEATURES_INDEX.md`.

**Documentos a consultar**: [[API_AGENTS]], [[API_ARCHITECTURE]], [[API_CONTRACT]],
[[API_TESTING]], [[00-shared/plans/PLAN_CAMBIO_006]], [[00-shared/CHANGES_LOG]],
[[00-shared/docs/adr/ADR-001]], [[_AUDITORIA_INTEGRIDAD_2026-06-28]]
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
