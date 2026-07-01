---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Reporte de cartera por edades — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Página · **Ruta:** `/cobranza/cartera` · **Permiso:** `pagos.ver`

## Qué muestra
- `AgingChart`: buckets corriente / 1-30 / 31-60 / 61-90 / 90+ (valor y n.º de unidades).
- Tabla por unidad con su edad de mora y saldo.
- Comparativo recaudo vs presupuesto.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Exportar" | Click | Excel/PDF (permiso `pagos.exportar`) |
| Fecha de corte | Cambio | Recalcula el reporte |

## Estados
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de gráfico + tabla |
| Sin mora | "Cartera al día 🎉" |
