---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Panel de cartera — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Página · **Ruta:** `/cobranza` · **Permiso:** `pagos.ver`

## Qué muestra
- KPIs: recaudo del mes, % morosidad, total facturado, **saldo del fondo de imprevistos** (Ley 675).
- Gráfico recaudo vs facturado (últimos meses).
- Top deudores (unidad, saldo, días de mora) con acceso al detalle.
- Accesos rápidos: "Generar facturación", "Registrar pago".

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Generar facturación" | Click | Abre `COBRANZA_UI_generar-facturacion` |
| Deudor | Click | Abre `COBRANZA_UI_detalle-cuenta` de la unidad |

## Estados
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de KPIs + gráfico |
| Periodo sin facturar | Aviso "Aún no has facturado {mes}" + CTA |
