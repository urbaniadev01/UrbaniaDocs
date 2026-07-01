---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Detalle de cuenta de cobro — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Drawer · **Se abre desde:** Lista de cuentas / Panel

## Qué muestra
- Cabecera: unidad, periodo, estado, valor total, **saldo**, vencimiento.
- `invoice_items`: cada concepto con su valor y `base_calculo` (coeficiente aplicado).
- Intereses de mora calculados al día (si vencida).
- Abonos aplicados (`payment_allocations`) e historial.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Registrar pago" | Click | Abre `COBRANZA_UI_registrar-pago` precargado |
| "Acuerdo de pago" | Click | Abre `COBRANZA_UI_acuerdos-pago` |
| "Descargar PDF" | Click | Cuenta de cobro en PDF |

## Estados
| Estado | Cómo se ve |
|---|---|
| Vencida | Badge rojo + intereses resaltados |
| Pagada | Badge verde + "Paz y salvo disponible" si la unidad está al día |
