---
type: session
session_number: 15
name: CAMBIO-006 Sesion 4 — RBAC con scope + reemplazo del claim role (migraciones y seeders)
status: En progreso
date_start: 2026-06-29
date_end: 2026-06-29
agent: opencode
tags: [cambio-006, rbac, migrations, seeders, session]
---

# Sesión 15 — CAMBIO-006 Sesión 4 (parcial)

## Objetivo
Crear el esquema de datos y la semilla inicial del módulo de autorización (RBAC) de CAMBIO-006.

## Entregable
- 6 migraciones PostgreSQL reversibles para `permissions`, `roles`, `role_permissions`, `role_assignments`, `permission_audit_log` y `approval_rules`.
- 3 seeders idempotentes: `RbacPermissionSeeder`, `RbacRoleSeeder`, `RbacMigrationSeeder`.
- Seeders registrados en `DatabaseSeeder`.
- Documentación del esquema actualizada en `01-api/API_DATABASE.md`.

## Archivos creados
- `database/migrations/2026_06_28_000009_create_permissions_table.php`
- `database/migrations/2026_06_28_000010_create_roles_table.php`
- `database/migrations/2026_06_28_000011_create_role_permissions_table.php`
- `database/migrations/2026_06_28_000012_create_role_assignments_table.php`
- `database/migrations/2026_06_28_000013_create_permission_audit_log_table.php`
- `database/migrations/2026_06_28_000014_create_approval_rules_table.php`
- `database/seeders/RbacPermissionSeeder.php`
- `database/seeders/RbacRoleSeeder.php`
- `database/seeders/RbacMigrationSeeder.php`

## Archivos modificados
- `database/seeders/DatabaseSeeder.php`
- `01-api/API_DATABASE.md`

## Notas técnicas
- Los nombres de archivo solicitados (`000007` - `000012`) chocaron con migraciones existentes de Propiedades, por lo que se desplazaron a `000009` - `000014`.
- `RbacPermissionSeeder` y `RbacRoleSeeder` son idempotentes: actualizan nombres/perfiles pero preservan los UUIDs existentes para no romper claves foráneas.
- `RbacMigrationSeeder` migra `users.role = 'admin'` → rol "administrador" en su organización y `users.role = 'user'` → rol "residente". Solo crea asignaciones si no existen.

## Verificación
- `composer migrate -- --env=testing` ✅
- `composer migrate:rollback -- --step=6 --env=testing` ✅
- Seeders individuales y `DatabaseSeeder` ejecutados exitosamente sobre `urbania_test` ✅
- `composer test`: 325 pasados, 3 fallos preexistentes ⚠️
- `composer stan`: 6 errores preexistentes en `AppServiceProvider` ⚠️
- `composer lint`: 1 archivo preexistente con estilo incorrecto (`OrganizationEntity`) ⚠️

## Pendientes de la Sesión 4
- Módulo `src/Authorization` (Domain/Application/Infrastructure).
- Resolver de permisos efectivos con cache Redis.
- Gate / middleware `can('recurso.accion', $scope)`.
- Reemplazar uso de `users.role` para autorizar.
- Tests de resolución, segregación, invalidación de cache y migración de roles.
