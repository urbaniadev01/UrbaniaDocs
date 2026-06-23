---
type: ui-pantalla
status: active
module: mobile
feature: mora
pantalla: detalle-unidad
tags: [app, mora, ui, detalle-unidad]
updated: 2026-06-22
---

# Detalle Unidad — Cartera de mora (App)

> Spec técnico del feature: [[03-app/features/mora/MORA_SPEC]]
> Panorama global: [[00-shared/features/MORA]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** BottomSheet
**Se abre desde:** Card en el reporte

---

## Qué muestra

Detalle de la mora: cuotas vencidas individuales con fecha y monto. Acuerdo de pago si existe: cuotas del acuerdo, pagadas y pendientes.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Sin mora | Ilustración + "Estás al día" (verde) |
| Con mora | Vista de alerta con saldo |
