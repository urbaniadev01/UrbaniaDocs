---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Generar paz y salvo — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Modal · **Se abre desde:** Detalle de cuenta / unidad al día

## Qué muestra
- Unidad y verificación de **saldo total = 0** (requisito Ley 675).
- Datos del certificado: número, fecha de emisión, vigencia.
- Vista previa del PDF.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Emitir paz y salvo" | Click | `POST /cobranza/peace-certificates`; descarga PDF |

## Estados
| Estado | Cómo se ve |
|---|---|
| Unidad con saldo | Bloqueado: "La unidad tiene saldo pendiente" (422 `UNIT_HAS_BALANCE`) |
| Emitido | PDF + registro en historial de la unidad |
