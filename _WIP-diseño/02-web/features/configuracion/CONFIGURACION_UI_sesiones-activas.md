---
type: ui
status: draft
module: web
feature: configuracion
tags: [web, ui, configuracion, wip]
updated: 2026-06-28
---

# Sesiones activas — Configuración (Web)

> Spec técnico: [[02-web/features/configuracion/CONFIGURACION_SPEC]]

**Tipo:** Inline (sección dentro de `CONFIGURACION_UI_seguridad`)

---

## Qué muestra
Tabla de sesiones del propio usuario:

| Columna | Qué muestra | Notas |
|---|---|---|
| Dispositivo | `device_name` (o User-Agent) | — |
| IP / Ubicación | `ip_address` | — |
| Último uso | `last_used_at` (relativo: "hace 2h") | — |
| Estado | Badge "Esta sesión" si `is_current` | 110px |
| Acciones | Botón "Revocar" | oculto en la sesión actual |

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Revocar" | Click | `ConfirmDialog` → `DELETE /auth/sessions/:id`; refresca lista |
| Botón "Cerrar todas las demás" | Click | Revoca todas menos la actual |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tabla (3 filas) |
| Vacío | "Solo tienes esta sesión activa" |
| Revocando | Fila en loading |

## Elementos condicionales
- "Revocar" — oculto en la fila donde `is_current = true`.
