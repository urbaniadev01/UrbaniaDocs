---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Invitar usuario — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Modal · **Se abre desde:** Usuarios del panel

## Qué muestra
- `email` del invitado.
- `role_id` (select de roles).
- **Alcance** (`ScopePicker`): organización / conjunto(s) / torre / unidad.
- Vigencia opcional (para accesos temporales).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Enviar invitación" | Click | Crea/asocia `user` + `role_assignment`; envía email |
| "Cancelar" | Click | Cierra |

## Estados
| Estado | Cómo se ve |
|---|---|
| Email ya existe | "Ya tiene cuenta — se le agregará el rol/alcance" |
| Éxito | Toast "Invitación enviada" |

## Elementos condicionales
- `ScopePicker` ajusta sus niveles según `nivel_alcance` del rol elegido.
