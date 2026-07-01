---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Registrar pago / abono — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Modal · **Se abre desde:** Lista/Detalle de cuenta o Panel

## Qué muestra
- Unidad (preseleccionada o buscador).
- `valor` (MoneyInput), `medio` (efectivo/banco/pse/tarjeta), `referencia`, adjuntar `soporte`.
- **Asignación**: cuentas pendientes de la unidad con el monto a aplicar a cada una (auto: más antigua primero / intereses antes que capital), editable.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Registrar" | Click | `POST /cobranza/payments`; actualiza saldos |
| "Auto-asignar" | Click | Distribuye el valor por antigüedad |

## Estados
| Estado | Cómo se ve |
|---|---|
| Σ asignación > valor | Error inline "La asignación supera el valor del pago" |
| Sobrepago | Aviso "Queda saldo a favor de la unidad" |
| Éxito | Toast + cuenta(s) actualizada(s) |

## Elementos condicionales
- Si `medio = pse/tarjeta`, sugiere usar Pagos Online (#8) en vez de registro manual.
