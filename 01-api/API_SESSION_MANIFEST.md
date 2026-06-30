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
| **Numero**       | 19                             |
| **Nombre**       | RBAC — Ejecucion de migraciones pendientes y despliegue Docker |
| **Estado**       | ✅ Completada                  |
| **Nota**         | Ejecutadas las 6 migraciones RBAC pendientes (tablas creadas: permissions, roles, role_permissions, role_assignments, permission_audit_log, approval_rules). Ajustado .env para Docker (DB_HOST=db, DB_PORT=5432). Docker Compose iniciado con todos los servicios healthy. Migraciones verificadas dentro del contenedor. |
| **Fecha inicio** | 2026-06-29                     |
| **Fecha fin**    | 2026-06-29                     |
| **Agente**       | opencode                       |

---

## Resumen Ejecutivo

Sesion de ejecucion de migraciones RBAC pendientes y despliegue en Docker:

- **Migraciones**: ejecutadas 6 migraciones de Feature #5 (tablas RBAC: permissions, roles, role_permissions, role_assignments, permission_audit_log, approval_rules) que estaban creadas como archivos pero sin aplicar contra la BD.
- **Housekeeping**: ademas se ejecutaron 3 migraciones de backfill pendientes (backfill_contacts, migrate_users_unit_to_occupants, drop_unit_from_users).
- **.env**: corregido `DB_HOST=db` y `DB_PORT=5432` para conectividad interna de Docker (estaba en localhost:5433 para ejecucion local de artisan).
- **Docker**: `docker compose up -d` levanto los 5 contenedores (app, nginx, db, redis, mailhog). Migraciones ejecutadas automaticamente por el entrypoint dentro del contenedor.
- **API**: sirviendo en `http://localhost:8080`.

---

## Modulo

| Campo | Valor |
|-------|-------|
| **Modulo** | Feature #5 — Roles y Permisos |
| **Prioridad** | P0 |
| **Estado** | ✅ BD migrada + Endpoints HTTP implementados en API; Web/App pendientes |
| **Sesion de inicio** | Sesion 18 |
| **Sesion de migraciones** | Sesion 19 |

> [!info] Nota de alcance
> Feature #5 ahora tiene endpoints HTTP operativos en API. Pendiente implementacion en Web/App y sincronizacion cross-project.

---

## Metricas de Calidad (Globales)

| Metrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| Tests totales | 338 pasados, 3 fallos preexistentes (rate limiting flaky + 2 CORS origen 5174) | >0 | ⚠️ |
| Cobertura Domain | No re-midida | >=95% | ⚠️ |
| Cobertura Application | No re-midida | >=90% | ⚠️ |
| Cobertura Infrastructure | No re-midida | >=85% | ⚠️ |
| Cobertura Presentation | No re-midida | >=80% | ⚠️ |
| Cobertura Security | 100% (sin cambios) | 100% | ✅ |
| Cobertura global | No re-midida | >=80% | ⚠️ |
| PHPStan nivel 10 | 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; codigo nuevo limpio | 0 errores | ⚠️ |
| Pint | 0 archivos con estilo incorrecto | 0 archivos | ✅ |
| Pipeline CI/CD | `.github/workflows/quality.yml` configurado | Verde | ⚠️ Requiere arreglar AppServiceProvider para CI verde |

> Los 3 fallos y los 6 errores de PHPStan son deuda documentada preexistente; no
> se introdujeron nuevos problemas en esta sesion.

---

## Archivos Creados y Modificados

### Archivos creados (Sesion 18)

**Codigo**
- `API/app/Models/ApprovalRule.php`
- `API/app/Models/PermissionAuditLog.php`
- `API/src/Authorization/Application/DTOs/CreateRoleRequestDto.php`
- `API/src/Authorization/Application/DTOs/UpdateRoleRequestDto.php`
- `API/src/Authorization/Application/DTOs/SetRolePermissionsRequestDto.php`
- `API/src/Authorization/Application/DTOs/CreateAssignmentRequestDto.php`
- `API/src/Authorization/Application/DTOs/CreateApprovalRuleRequestDto.php`
- `API/src/Authorization/Application/UseCases/LogsPermissionAudit.php`
- `API/src/Authorization/Application/UseCases/InvalidatesPermissionCache.php`
- `API/src/Authorization/Application/UseCases/Roles/ListRolesUseCase.php`
- `API/src/Authorization/Application/UseCases/Roles/CreateRoleUseCase.php`
- `API/src/Authorization/Application/UseCases/Roles/UpdateRoleUseCase.php`
- `API/src/Authorization/Application/UseCases/Roles/SetRolePermissionsUseCase.php`
- `API/src/Authorization/Application/UseCases/Permissions/ListPermissionsUseCase.php`
- `API/src/Authorization/Application/UseCases/Assignments/CreateAssignmentUseCase.php`
- `API/src/Authorization/Application/UseCases/Assignments/RevokeAssignmentUseCase.php`
- `API/src/Authorization/Application/UseCases/ApprovalRules/CreateApprovalRuleUseCase.php`
- `API/src/Authorization/Application/UseCases/Audit/ListAuditLogUseCase.php`
- `API/src/Authorization/Domain/Exceptions/RoleNotFoundException.php`
- `API/src/Authorization/Domain/Exceptions/RoleNameAlreadyExistsException.php`
- `API/src/Authorization/Domain/Exceptions/RoleIsSystemException.php`
- `API/src/Authorization/Domain/Exceptions/AssignmentAlreadyExistsException.php`
- `API/src/Authorization/Domain/Exceptions/AssignmentNotFoundException.php`
- `API/src/Authorization/Domain/Exceptions/ApprovalRuleInvalidApproverException.php`
- `API/src/Authorization/Domain/Exceptions/AuthorizationContextException.php`
- `API/src/Authorization/Infrastructure/Http/Requests/ListRolesRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/CreateRoleRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/UpdateRoleRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/SetRolePermissionsRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/ListPermissionsRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/CreateAssignmentRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/CreateApprovalRuleRequest.php`
- `API/src/Authorization/Infrastructure/Http/Requests/ListAuditLogRequest.php`
- `API/src/Authorization/Infrastructure/Http/Resources/RoleResource.php`
- `API/src/Authorization/Infrastructure/Http/Resources/RoleCollection.php`
- `API/src/Authorization/Infrastructure/Http/Resources/PermissionResource.php`
- `API/src/Authorization/Infrastructure/Http/Resources/PermissionGroupCollection.php`
- `API/src/Authorization/Infrastructure/Http/Resources/AssignmentResource.php`
- `API/src/Authorization/Infrastructure/Http/Resources/ApprovalRuleResource.php`
- `API/src/Authorization/Infrastructure/Http/Resources/AuditLogResource.php`
- `API/src/Authorization/Infrastructure/Http/Controllers/RoleController.php`
- `API/src/Authorization/Infrastructure/Http/Controllers/PermissionController.php`
- `API/src/Authorization/Infrastructure/Http/Controllers/AssignmentController.php`
- `API/src/Authorization/Infrastructure/Http/Controllers/ApprovalRuleController.php`
- `API/src/Authorization/Infrastructure/Http/Controllers/AuditController.php`
- `API/src/Authorization/Infrastructure/Http/Controllers/HandlesAuthorizationRequest.php`
- `API/src/Authorization/Presentation/routes.php`
- `API/src/Authorization/Presentation/AuthorizationPresentationServiceProvider.php`
- `API/tests/Feature/Authorization/RoleManagementTest.php`

**Documentacion API**
- `01-api/docs/log/sesiones/sesion-18.md` — nota atomica de la sesion.

### Archivos modificados (Sesion 18)

**Codigo**
- `API/database/seeders/RbacPermissionSeeder.php` — nuevos permisos `roles.*` y `usuarios.*`.
- `API/database/seeders/RbacRoleSeeder.php` — rol `admin` incluye `roles.*` y `usuarios.*`.
- `API/app/Models/RoleAssignment.php` — relacion `role()` agregada.
- `API/src/Shared/Infrastructure/Middleware/AuthorizationMiddleware.php` — mapeos de rutas y soporte JWT sin Auth.
- `API/bootstrap/providers.php` — registro de `AuthorizationPresentationServiceProvider`.

**Documentacion API**
- `01-api/API_SESSION_MANIFEST.md` — actualizado al cierre de sesion 18.

### Archivos creados (Sesion 19)

**Documentacion API**
- `01-api/docs/log/sesiones/sesion-19.md` — nota atomica de la sesion.

### Archivos modificados (Sesion 19)

**Configuracion**
- `API/.env` — `DB_HOST=db`, `DB_PORT=5432` para conectividad Docker.

**Documentacion API**
- `01-api/API_SESSION_MANIFEST.md` — actualizado al cierre de sesion 19.
- `01-api/API_IMPLEMENTATION_PLAN.md` — sesion 19 agregada.

> [!note] Nota
> El detalle completo de las sesiones anteriores se encuentra en las notas atomicas
> `01-api/docs/log/sesiones/sesion-15.md` a `sesion-17.md`.

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

**Proxima Sesion**: Por definir — a la espera del orquestador para continuar Feature #5 en Web/App o siguiente tarea.
**Objetivo**: Pendiente de decision del orquestador.

**Documentos a consultar**: [[API_AGENTS]], [[API_ARCHITECTURE]], [[API_CONTRACT]],
[[API_TESTING]], [[00-shared/FEATURES_INDEX]], [[00-shared/CHANGES_LOG]]
**Estado**: ⏸️ Pendiente de decision

> [!note] Sesion 19 completada
> Las 6 migraciones RBAC ahora existen en la BD (no solo como archivos). Docker Compose configurado y funcionando. API sirviendo en `http://localhost:8080`.

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
- Discrepancias preexistentes confirmadas al inicio de la Sesion 18:
  - `composer test`: test flaky de rate limiting en `AuthControllerTest` (`it returns 429 after exceeding login rate limit`).
  - `composer test`: 2 tests de CORS fallan porque el entorno retorna origen `http://localhost:5174` mientras los tests esperan `http://localhost:5173`.
  - `composer stan`: 6 errores preexistentes en `app/Providers/AppServiceProvider.php` por llamadas a `env()` fuera de config.
- Observaciones de la Sesion 12 (aun vigentes):
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
