---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Lista de cuentas de cobro — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Página · **Ruta:** `/cobranza/cuentas` · **Permiso:** `pagos.ver`

## Qué muestra
| Columna | Qué muestra | Notas |
|---|---|---|
| N.º | `numero` | — |
| Unidad | torre + unidad | — |
| Periodo | año/mes | — |
| Valor | `valor_total` | formato COP |
| Saldo | `saldo` | rojo si > 0 |
| Estado | badge | pendiente/parcial/pagada/vencida |
| Vence | `fecha_vencimiento` | — |

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Fila | Click | Abre `COBRANZA_UI_detalle-cuenta` |
| "Registrar pago" | Click | Abre `COBRANZA_UI_registrar-pago` |
| Selección múltiple → "Enviar recordatorio" | Click | Vía Comunicaciones (#6) |

## Estados
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de tabla |
| Vacío | "No hay cuentas en este periodo" |

## Filtros
Estado · Periodo · Torre/unidad · Búsqueda.
