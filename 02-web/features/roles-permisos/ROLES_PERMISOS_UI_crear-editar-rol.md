---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Crear / editar rol — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Modal · **Se abre desde:** Lista de roles

## Qué muestra
- `nombre` (único en la organización).
- `descripcion`.
- `nivel_alcance` (select): organización/conjunto/torre/unidad.
- `base_role_id` (opcional): copiar permisos de un rol existente.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Guardar" | Click | `POST/PATCH /authorization/roles`; pasa a la matriz |
| "Cancelar" | Click | Cierra |

## Estados
| Estado | Cómo se ve |
|---|---|
| Error `SYSTEM_ROLE_LOCKED` | "Los roles de sistema no se editan" |
| Error nombre duplicado | Inline en `nombre` |

## Elementos condicionales
- Selector `base_role_id` visible solo al **crear**.
