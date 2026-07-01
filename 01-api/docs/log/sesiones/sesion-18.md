---
type: session
session_number: 18
name: "Feature #5 — Endpoints HTTP de gestion de Roles y Permisos"
status: completed
date_start: 2026-06-29
date_end: 2026-06-29
agent: opencode
tags: [session]
updated: 2026-06-29
---

# Sesion 18: Feature #5 — Endpoints HTTP de gestion de Roles y Permisos

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]]
- [[API_ARCHITECTURE]]
- [[API_CONTRACT]]
- [[API_TESTING]]
- [[API_SESSION_MANIFEST]]

## Tareas completadas
- [x] Agregar permisos `roles.*` y `usuarios.*` a `RbacPermissionSeeder`.
- [x] Actualizar rol `admin` en `RbacRoleSeeder` para incluir `roles.*` y `usuarios.*`.
- [x] Crear modelos Eloquent `ApprovalRule` y `PermissionAuditLog`.
- [x] Crear DTOs de request en `src/Authorization/Application/DTOs/`.
- [x] Crear UseCases de roles, permisos, assignments, approval rules y audit.
- [x] Crear Form Requests en `src/Authorization/Infrastructure/Http/Requests/`.
- [x] Crear API Resources/Collections en `src/Authorization/Infrastructure/Http/Resources/`.
- [x] Crear Controllers en `src/Authorization/Infrastructure/Http/Controllers/`.
- [x] Crear rutas bajo `api/v1/authorization` y provider de presentacion.
- [x] Registrar `AuthorizationPresentationServiceProvider` en `bootstrap/providers.php`.
- [x] Actualizar `AuthorizationMiddleware` con mapeos de rutas y soporte para JWT sin Laravel Auth.
- [x] Crear tests feature `tests/Feature/Authorization/RoleManagementTest.php`.
- [x] Ejecutar `composer dump-autoload`, `php artisan route:list`, `composer test`, `composer stan` y `composer lint`.

## Archivos creados
| Ruta | Descripcion |
|------|-------------|
| `API/app/Models/ApprovalRule.php` | Modelo Eloquent para reglas de aprobacion |
| `API/app/Models/PermissionAuditLog.php` | Modelo Eloquent para bitacora de permisos |
| `API/src/Authorization/Application/DTOs/CreateRoleRequestDto.php` | DTO para crear rol |
| `API/src/Authorization/Application/DTOs/UpdateRoleRequestDto.php` | DTO para actualizar rol |
| `API/src/Authorization/Application/DTOs/SetRolePermissionsRequestDto.php` | DTO para matriz de permisos |
| `API/src/Authorization/Application/DTOs/CreateAssignmentRequestDto.php` | DTO para asignar rol |
| `API/src/Authorization/Application/DTOs/CreateApprovalRuleRequestDto.php` | DTO para regla de aprobacion |
| `API/src/Authorization/Application/UseCases/LogsPermissionAudit.php` | Trait de auditoria compartido |
| `API/src/Authorization/Application/UseCases/InvalidatesPermissionCache.php` | Trait de invalidacion de cache |
| `API/src/Authorization/Application/UseCases/Roles/ListRolesUseCase.php` | Listar roles |
| `API/src/Authorization/Application/UseCases/Roles/CreateRoleUseCase.php` | Crear rol |
| `API/src/Authorization/Application/UseCases/Roles/UpdateRoleUseCase.php` | Actualizar rol |
| `API/src/Authorization/Application/UseCases/Roles/SetRolePermissionsUseCase.php` | Reemplazar permisos de rol |
| `API/src/Authorization/Application/UseCases/Permissions/ListPermissionsUseCase.php` | Listar permisos agrupados |
| `API/src/Authorization/Application/UseCases/Assignments/CreateAssignmentUseCase.php` | Asignar rol a usuario |
| `API/src/Authorization/Application/UseCases/Assignments/RevokeAssignmentUseCase.php` | Revocar asignacion |
| `API/src/Authorization/Application/UseCases/ApprovalRules/CreateApprovalRuleUseCase.php` | Crear regla de aprobacion |
| `API/src/Authorization/Application/UseCases/Audit/ListAuditLogUseCase.php` | Listar bitacora paginada |
| `API/src/Authorization/Domain/Exceptions/RoleNotFoundException.php` | Excepcion de dominio |
| `API/src/Authorization/Domain/Exceptions/RoleNameAlreadyExistsException.php` | Excepcion de dominio |
| `API/src/Authorization/Domain/Exceptions/RoleIsSystemException.php` | Excepcion de dominio |
| `API/src/Authorization/Domain/Exceptions/AssignmentAlreadyExistsException.php` | Excepcion de dominio |
| `API/src/Authorization/Domain/Exceptions/AssignmentNotFoundException.php` | Excepcion de dominio |
| `API/src/Authorization/Domain/Exceptions/ApprovalRuleInvalidApproverException.php` | Excepcion de dominio |
| `API/src/Authorization/Domain/Exceptions/AuthorizationContextException.php` | Excepcion de dominio |
| `API/src/Authorization/Infrastructure/Http/Requests/ListRolesRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/CreateRoleRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/UpdateRoleRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/SetRolePermissionsRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/ListPermissionsRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/CreateAssignmentRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/CreateApprovalRuleRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Requests/ListAuditLogRequest.php` | Form request |
| `API/src/Authorization/Infrastructure/Http/Resources/RoleResource.php` | Resource |
| `API/src/Authorization/Infrastructure/Http/Resources/RoleCollection.php` | Collection |
| `API/src/Authorization/Infrastructure/Http/Resources/PermissionResource.php` | Resource |
| `API/src/Authorization/Infrastructure/Http/Resources/PermissionGroupCollection.php` | Collection agrupada |
| `API/src/Authorization/Infrastructure/Http/Resources/AssignmentResource.php` | Resource |
| `API/src/Authorization/Infrastructure/Http/Resources/ApprovalRuleResource.php` | Resource |
| `API/src/Authorization/Infrastructure/Http/Resources/AuditLogResource.php` | Resource |
| `API/src/Authorization/Infrastructure/Http/Controllers/RoleController.php` | Controller |
| `API/src/Authorization/Infrastructure/Http/Controllers/PermissionController.php` | Controller |
| `API/src/Authorization/Infrastructure/Http/Controllers/AssignmentController.php` | Controller |
| `API/src/Authorization/Infrastructure/Http/Controllers/ApprovalRuleController.php` | Controller |
| `API/src/Authorization/Infrastructure/Http/Controllers/AuditController.php` | Controller |
| `API/src/Authorization/Infrastructure/Http/Controllers/HandlesAuthorizationRequest.php` | Trait para controllers |
| `API/src/Authorization/Presentation/routes.php` | Rutas del modulo |
| `API/src/Authorization/Presentation/AuthorizationPresentationServiceProvider.php` | Provider de presentacion |
| `API/tests/Feature/Authorization/RoleManagementTest.php` | Tests feature |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `API/database/seeders/RbacPermissionSeeder.php` | Nuevos permisos `roles.*` y `usuarios.*` |
| `API/database/seeders/RbacRoleSeeder.php` | Rol `admin` incluye `roles.*` y `usuarios.*` |
| `API/app/Models/RoleAssignment.php` | Relacion `role()` agregada |
| `API/src/Shared/Infrastructure/Middleware/AuthorizationMiddleware.php` | Mapeos de rutas y soporte JWT sin Auth |
| `API/bootstrap/providers.php` | Registro de `AuthorizationPresentationServiceProvider` |

## Metricas de cierre
- Tests: 338 pasados, 3 fallos preexistentes (rate limit flaky + 2 CORS origen 5174)
- Cobertura: no re-medida
- PHPStan: 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; codigo nuevo limpio
- Pint: 0 archivos con diferencias

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer test` ejecutado
- [x] `composer stan` ejecutado (solo deuda preexistente)
- [x] `composer lint` ejecutado (sin diferencias)
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] Nota atomica de sesion creada

## Notas
- Se agrego `AuthorizationMiddleware` a las rutas de autorizacion para activar autorizacion granular; el middleware fue adaptado para leer `auth_user_id` y `org_id` cuando Laravel Auth no tiene usuario autenticado.
- Los 3 fallos y 6 errores de PHPStan son deuda documentada preexistente; no se introdujeron nuevos problemas.

## Proxima sesion
- Por definir — a la espera del orquestador para continuar Feature #5 en Web/App o siguiente tarea.
