---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Detalle de usuario — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Drawer · **Se abre desde:** Usuarios del panel

## Qué muestra
- Datos del usuario + estado.
- **Asignaciones**: lista de `role_assignments` (rol · alcance · vigencia · estado).
- **Permisos efectivos** (solo lectura): resultado del resolver para auditar qué puede hacer.
- Sesiones activas (enlace a Configuración).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Agregar rol" | Click | Modal asignar (rol + alcance) → `POST /authorization/assignments` |
| Asignación → Revocar | Click | `ConfirmDialog` → `DELETE /authorization/assignments/:id` |
| "Delegar temporalmente" | Click | Abre `ROLES_PERMISOS_UI_delegacion-temporal` |
| "Suspender usuario" | Click | Cambia estado |

## Estados
| Estado | Cómo se ve |
|---|---|
| Conflicto de segregación | Banner inline en permisos efectivos |
