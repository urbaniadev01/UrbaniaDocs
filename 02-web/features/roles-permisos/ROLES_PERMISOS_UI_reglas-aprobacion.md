---
type: ui
status: draft
module: web
feature: roles-permisos
tags: [web, ui, rbac, wip]
updated: 2026-06-28
---

# Reglas de aprobación / umbrales — Roles y Permisos (Web)
> Spec: [[02-web/features/roles-permisos/ROLES_PERMISOS_SPEC]]

**Tipo:** Página · **Ruta:** `/admin/aprobaciones` · **Permiso:** `roles.configurar`

## Qué muestra
Tabla de reglas de `approval_rules`: recurso (ej. pagos, ordenes_compra), monto umbral, rol aprobador, conjunto.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Nueva regla" | Click | Modal: recurso + monto + rol aprobador |
| Fila → Eliminar | Click | `ConfirmDialog` |

## Estados
| Estado | Cómo se ve |
|---|---|
| Vacío | "Sin umbrales: las acciones no requieren aprobación adicional" |

## Elementos condicionales
- Muestra solo recursos que soportan aprobación (pagos, órdenes de compra, gastos).
