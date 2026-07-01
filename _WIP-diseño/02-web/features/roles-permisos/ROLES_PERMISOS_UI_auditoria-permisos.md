---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Bitácora de auditoría de permisos — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Página · **Ruta:** `/admin/auditoria` · **Permiso:** `roles.ver`

## Qué muestra
Tabla de `permission_audit_log` (requisito de trazabilidad, Ley 675):

| Columna | Qué muestra |
|---|---|
| Fecha | timestamp |
| Actor | quién hizo el cambio |
| Acción | crear/editar rol, asignar/revocar, cambiar matriz |
| Objetivo | rol/usuario afectado |
| Detalle | diff (JSON) en expandible |

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Exportar" | Click | CSV/PDF (permiso `roles.exportar`) |

## Filtros
| Filtro | Control |
|---|---|
| Rango de fechas | Date range |
| Actor | Select |
| Tipo de acción | Select |
