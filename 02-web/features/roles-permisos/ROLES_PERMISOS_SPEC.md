---
type: spec
status: draft
module: web
feature: roles-permisos
tags: [web, spec, rbac, wip]
updated: 2026-06-28
---

# Spec Técnico Web: Roles y Permisos

> Panorama: [[00-shared/features/ROLES_PERMISOS]] · Endpoints: [[01-api/endpoints/ROLES_PERMISOS]] · Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature
| Pantalla | Tipo | Doc |
|---|---|---|
| Lista de roles | Página | [[ROLES_PERMISOS_UI_lista-roles]] |
| Crear / editar rol | Modal | [[ROLES_PERMISOS_UI_crear-editar-rol]] |
| Matriz de permisos | Página | [[ROLES_PERMISOS_UI_matriz-permisos]] |
| Reglas de aprobación | Página | [[ROLES_PERMISOS_UI_reglas-aprobacion]] |
| Usuarios del panel | Página | [[ROLES_PERMISOS_UI_usuarios-panel]] |
| Invitar usuario | Modal | [[ROLES_PERMISOS_UI_invitar-usuario]] |
| Detalle de usuario | Drawer | [[ROLES_PERMISOS_UI_detalle-usuario]] |
| Delegación temporal | Modal | [[ROLES_PERMISOS_UI_delegacion-temporal]] |
| Catálogo de recursos | Página | [[ROLES_PERMISOS_UI_catalogo-recursos]] |
| Auditoría de permisos | Página | [[ROLES_PERMISOS_UI_auditoria-permisos]] |

## Rutas
| Ruta | Componente | Guard |
|---|---|---|
| `/admin/roles` | `RolesPage` | `Can('roles.ver')` |
| `/admin/roles/:id/permisos` | `PermissionMatrixPage` | `Can('roles.editar')` |
| `/admin/usuarios` | `PanelUsersPage` | `Can('roles.ver')` |
| `/admin/aprobaciones` | `ApprovalRulesPage` | `Can('roles.configurar')` |
| `/admin/auditoria` | `PermissionAuditPage` | `Can('roles.ver')` |

> **Guard nuevo `Can`**: reemplaza `AdminOnlyRoute` por verificación de permiso efectivo (ADR-001). Documentar en [[WEB_AUTH_IMPLEMENTATION]].

## Componentes
### Crear nuevos
| Componente | Ubicación | Responsabilidad |
|---|---|---|
| `RoleForm` | `features/roles-permisos/components/` | Crear/editar rol + alcance |
| `PermissionMatrix` | idem | Grid recurso×acción con checkboxes |
| `ScopePicker` | idem | Selector de alcance (org/conjunto/torre/unidad) |
| `UserRoleAssigner` | idem | Asignar rol+alcance a un usuario |
| `AuditTable` | idem | Bitácora paginada |
### Reutilizar
| `DataTable`, `ConfirmDialog`, `Drawer`, `EmptyState` | [[WEB_COMPONENTS]] |

## Servicios y hooks
| Hook | Endpoint |
|---|---|
| `useRoles` / `useRole` | `GET /authorization/roles[/:id]` |
| `useCreateRole` / `useUpdateRole` | `POST/PATCH /authorization/roles` |
| `useSetRolePermissions` | `PUT /authorization/roles/:id/permissions` |
| `usePermissionsCatalog` | `GET /authorization/permissions` |
| `useAssignRole` / `useRevokeAssignment` | `POST/DELETE /authorization/assignments` |
| `useApprovalRules` | `GET/POST /authorization/approval-rules` |
| `useAuditLog` | `GET /authorization/audit` |

## Estrategia de cache
| Query | staleTime | Invalidar |
|---|---|---|
| roles / permisos del rol | 60s | al editar rol o su matriz |
| usuarios+asignaciones | 30s | al asignar/revocar |
| **permisos del usuario actual** | sesión | al cambiar sus asignaciones (refrescar gate) |

## Tipos TypeScript
```ts
export type Action = 'ver'|'crear'|'editar'|'eliminar'|'aprobar'|'exportar'|'configurar';
export interface Role { id: string; nombre: string; es_sistema: boolean;
  nivel_alcance: 'organizacion'|'conjunto'|'torre'|'unidad'; usuarios_count: number; }
export interface Assignment { id: string; user_id: string; role_id: string;
  scope_type: string; scope_id: string; vigencia_inicio: string|null; vigencia_fin: string|null; }
```

## Permisos
| Acción | Permiso |
|---|---|
| Ver roles/usuarios/auditoría | `roles.ver` |
| Crear/editar rol y matriz | `roles.crear` / `roles.editar` |
| Asignar/revocar | `roles.asignar` |
| Umbrales | `roles.configurar` |

## Testing
| Tipo | Qué cubre |
|---|---|
| Unit | hooks RBAC con MSW |
| Component | `PermissionMatrix` (toggle, guardado) |
| E2E | crear rol → asignar a usuario → el usuario ve/oculta acciones |
