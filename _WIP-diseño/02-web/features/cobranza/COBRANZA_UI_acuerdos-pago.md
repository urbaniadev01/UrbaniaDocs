---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Acuerdos de pago — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Modal · **Se abre desde:** Detalle de cuenta de unidad morosa

## Qué muestra
- Saldo total de la unidad.
- `num_cuotas` + fecha de primera cuota → genera plan de `payment_agreement_installments` (preview).
- Resumen del plan (cuotas, montos, vencimientos).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Crear acuerdo" | Click | `POST /cobranza/payment-agreements` |
| "Imprimir acuerdo" | Click | PDF del acuerdo |

## Estados
| Estado | Cómo se ve |
|---|---|
| Activo | Plan con cuotas y estado de cada una |
| Incumplido | Aviso: se reactiva la mora del saldo |
