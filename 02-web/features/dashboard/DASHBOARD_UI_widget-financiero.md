---
type: ui-pantalla
status: active
module: web
feature: dashboard
pantalla: widget-financiero
tags: [web, dashboard, ui, widget-financiero]
updated: 2026-06-22
---

# Widget financiero — Dashboard (Web)

> Spec: [[02-web/features/dashboard/DASHBOARD_SPEC]]
> Panorama: [[00-shared/features/DASHBOARD]]

**Tipo:** Inline (sección del dashboard principal)

---

## Qué muestra

Sección embebida en el Dashboard principal. Tres cards de KPI financiero:

**Card 1 — Recaudo del mes:**
- Monto cobrado en el mes en curso (suma de pagos aplicados)
- Meta del mes (suma de cuotas generadas)
- Barra de progreso circular o lineal con el porcentaje
- Delta vs. mes anterior (ej: "+12% vs. julio")
- Link "Ver detalle" → `/pagos`

**Card 2 — Cartera morosa:**
- Monto total de cartera morosa
- Número de unidades con mora
- % del total de unidades en mora
- Color rojo si supera el umbral configurado
- Link "Gestionar mora" → `/mora`

**Card 3 — Ejecución presupuestal:**
- % del presupuesto anual ejecutado (egresos reales / presupuesto)
- Monto ejecutado vs. presupuesto total
- Indicador si está sobre o bajo lo planeado
- Link "Ver presupuesto" → `/presupuesto`

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de las 3 cards |
| Sin presupuesto activo | Card 3 muestra "Sin presupuesto configurado" |
| Con datos | Vista normal |
