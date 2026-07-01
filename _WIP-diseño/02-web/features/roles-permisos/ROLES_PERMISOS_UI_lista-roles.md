---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Lista de roles — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Página · **Ruta:** `/admin/roles` · **Permiso:** `roles.ver`

## Qué muestra
Tabla de roles (sistema + personalizados de la organización):

| Columna | Qué muestra | Notas |
|---|---|---|
| Rol | nombre | badge "Sistema" si `es_sistema` |
| Alcance | `nivel_alcance` | organización/conjunto/torre/unidad |
| Usuarios | `usuarios_count` | enlaza a usuarios con ese rol |
| Acciones | Editar · Permisos · Duplicar | "Editar" oculto en roles de sistema |

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Nuevo rol" | Click | Abre `ROLES_PERMISOS_UI_crear-editar-rol` |
| Fila → "Permisos" | Click | Navega a `ROLES_PERMISOS_UI_matriz-permisos` |
| Fila → "Duplicar" | Click | Crea rol personalizado a partir de uno base |

## Estados
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Solo roles de sistema + CTA "Crear rol personalizado" |
