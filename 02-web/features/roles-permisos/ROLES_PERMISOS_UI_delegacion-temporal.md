---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Delegación temporal — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Modal · **Se abre desde:** Detalle de usuario

## Qué muestra
- Usuario suplente (a quién se delega).
- Rol/alcance a delegar (típicamente el del titular).
- `vigencia_inicio` y `vigencia_fin` (obligatorias).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Delegar" | Click | Crea `role_assignment` con vigencia → estado "Programada/Activa" |

## Estados
| Estado | Cómo se ve |
|---|---|
| Vigencia inválida | "La fecha de fin debe ser posterior al inicio" |

## Elementos condicionales
- Al expirar `vigencia_fin`, la asignación pasa sola a "Expirada" (no requiere acción).
