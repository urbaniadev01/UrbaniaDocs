---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Matriz de permisos — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Página · **Ruta:** `/admin/roles/:id/permisos` · **Permiso:** `roles.editar`

## Qué muestra
Grid **recurso × acción** (el corazón del control):
- Filas = recursos (pagos, directorio, porteria, …); columnas = acciones (ver/crear/editar/eliminar/aprobar/exportar/configurar).
- Celdas = checkbox del permiso `recurso.accion`; encabezado de fila con "seleccionar todo".
- Aviso de **segregación de funciones** (inline) si se marcan combinaciones en conflicto (ej. `pagos.crear` + `pagos.aprobar`).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Checkbox | Toggle | Marca/desmarca permiso (estado local) |
| "Guardar cambios" | Click | `PUT /authorization/roles/:id/permissions`; invalida cache |

## Estados
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de grid |
| Cambios sin guardar | Barra sticky "Tienes cambios sin guardar" |
| Conflicto de segregación | Banner ámbar (no bloquea, advierte) |
