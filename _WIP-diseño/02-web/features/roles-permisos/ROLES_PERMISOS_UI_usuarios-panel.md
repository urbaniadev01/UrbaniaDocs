---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Usuarios del panel — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Página · **Ruta:** `/admin/usuarios` · **Permiso:** `roles.ver`

## Qué muestra
Staff/usuarios con acceso al panel del conjunto/organización:

| Columna | Qué muestra | Notas |
|---|---|---|
| Usuario | nombre + email | avatar |
| Roles | chips de roles asignados | con su alcance |
| Estado | activo/suspendido/invitado | badge |
| Último acceso | relativo | — |
| Acciones | menú | abre detalle |

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Invitar usuario" | Click | Abre `ROLES_PERMISOS_UI_invitar-usuario` |
| Fila | Click | Abre `ROLES_PERMISOS_UI_detalle-usuario` |

## Filtros
| Filtro | Control |
|---|---|
| Rol | Select |
| Estado | Select |
| Búsqueda | Text (nombre/email) |
