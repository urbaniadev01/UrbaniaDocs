---
type: session
session_number: 16
name: "CAMBIO-006 Sesion 4 — C3 + H2: RBAC con scope + reemplazo del claim role (modulo Authorization DDD)"
status: completed
date_start: 2026-06-29
date_end: 2026-06-29
agent: opencode
tags: [session]
updated: 2026-06-29
---

# Sesión 16: CAMBIO-006 Sesion 4 — C3 + H2: RBAC con scope + reemplazo del claim role (modulo Authorization DDD)

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]]
- [[API_ARCHITECTURE]]
- [[API_CONTRACT]]
- [[API_TESTING]]
- [[API_JWT_IMPLEMENTATION]]
- Plan CAMBIO-006 (completado — ver actas de sesión)
- [[00-shared/CHANGES_LOG]]
- [[00-shared/docs/adr/ADR-001]]

## Tareas completadas
- [x] Crear entidades de dominio `Role`, `Permission`, `RoleAssignment` en `src/Authorization/Domain/Entities/`.
- [x] Crear `RoleRepositoryInterface` y `PermissionResolverInterface` en Domain.
- [x] Implementar `EloquentRoleRepository` en Infrastructure.
- [x] Implementar `CachedPermissionResolver` con cache Redis (prefijo `perms:`, TTL 300s).
- [x] Crear modelos Eloquent `Role`, `Permission`, `RoleAssignment` en `app/Models/`.
- [x] Crear `AuthorizationMiddleware` en `src/Shared/Infrastructure/Middleware/`.
- [x] Crear `AuthorizationServiceProvider` y registrarlo en `bootstrap/providers.php`.
- [x] Crear tests feature basicos en `tests/Feature/Authorization/PermissionResolverTest.php`.
- [x] Corregir tipado de `RoleRepositoryInterface::findByCode()` a `?Role`.
- [x] Verificar derivacion segura de permisos de residente via `property_occupants`.
- [x] Ejecutar `composer fmt` (Pint corrigio formato preexistente en `OrganizationEntity.php`).

## Archivos creados
| Ruta | Descripción |
|------|-------------|
| `src/Authorization/Domain/Entities/Role.php` | Entidad de dominio Role |
| `src/Authorization/Domain/Entities/Permission.php` | Entidad de dominio Permission |
| `src/Authorization/Domain/Entities/RoleAssignment.php` | Entidad de dominio RoleAssignment |
| `src/Authorization/Domain/Repositories/RoleRepositoryInterface.php` | Interfaz de repositorio de roles |
| `src/Authorization/Domain/Services/PermissionResolverInterface.php` | Contrato de resolucion de permisos |
| `src/Authorization/Infrastructure/Persistence/EloquentRoleRepository.php` | Implementacion Eloquent del repositorio |
| `src/Authorization/Infrastructure/Services/CachedPermissionResolver.php` | Resolver con cache Redis |
| `src/Authorization/Infrastructure/AuthorizationServiceProvider.php` | Service provider del modulo |
| `app/Models/Role.php` | Modelo Eloquent Role |
| `app/Models/Permission.php` | Modelo Eloquent Permission |
| `app/Models/RoleAssignment.php` | Modelo Eloquent RoleAssignment |
| `src/Shared/Infrastructure/Middleware/AuthorizationMiddleware.php` | Middleware de autorizacion por ruta |
| `tests/Feature/Authorization/PermissionResolverTest.php` | Tests feature basicos |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `bootstrap/providers.php` | Registrado `AuthorizationServiceProvider` |
| `src/Authorization/Domain/Repositories/RoleRepositoryInterface.php` | `findByCode()` retorna `?Role` |
| `src/Tenancy/Domain/Entities/OrganizationEntity.php` | Formateado por Pint |
| `01-api/API_SESSION_MANIFEST.md` | Actualizado al cierre |
| `01-api/API_IMPLEMENTATION_PLAN.md` | Sesion 16 cerrada |
| `01-api/API_JWT_IMPLEMENTATION.md` | Claim `role` deprecado como autorizador |
| `00-shared/FEATURES_INDEX.md` | Feature #5 en progreso |
| `00-shared/CHANGES_LOG.md` | Estado CAMBIO-006 actualizado |

## Métricas de cierre
- Tests: 328 pasados, 3 fallos preexistentes (rate limit flaky + 2 CORS origen 5174)
- Cobertura: no re-medida
- PHPStan: 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; codigo nuevo limpio
- Pint: 0 archivos con diferencias

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer ci` ejecutado (falla por errores preexistentes en AppServiceProvider)
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] [[API_CONTRACT]] / [[API_DATABASE]] actualizados si aplica
- [x] Documentacion cross-project actualizada ([[FEATURES_INDEX]], [[CHANGES_LOG]])

## Notas
- El middleware `AuthorizationMiddleware` mapea nombres de ruta a permisos; las rutas actuales de Propiedades/Directorio aun no tienen nombres, por lo que el middleware no intercepta aun. El cableado en pipeline HTTP queda para Sesion 17.
- `composer ci` falla por los 6 errores preexistentes de `env()` en `AppServiceProvider.php`, no por codigo nuevo.

## Próxima sesión
- Sesion 17: CAMBIO-006 Sesion 5 — cableado global de middlewares, verificacion completa y cierre de CAMBIO-006.
