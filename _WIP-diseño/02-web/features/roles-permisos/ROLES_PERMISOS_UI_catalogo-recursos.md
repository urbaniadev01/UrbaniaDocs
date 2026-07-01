---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Catálogo de recursos y acciones — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Página · **Ruta:** `/admin/recursos` · **Permiso:** `roles.ver` (edición solo operador SaaS)

## Qué muestra
Catálogo `permissions` agrupado por recurso (pagos, directorio, porteria, …) con sus acciones disponibles. Define el **vocabulario** que la matriz puede asignar. Solo lectura para el admin del conjunto; editable por el operador SaaS.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Expandir recurso | Click | Muestra sus acciones y la `clave` (`recurso.accion`) |

## Estados
| Estado | Cómo se ve |
|---|---|
| Solo lectura | Sin controles de edición (admin de conjunto) |
| Operador SaaS | Botón "Agregar recurso/acción" visible |
