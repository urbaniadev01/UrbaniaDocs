---
type: ui-pantalla
status: active
module: mobile
feature: mora
pantalla: reporte
tags: [app, mora, ui, reporte]
updated: 2026-06-22
---

# Reporte — Cartera de mora (App)

> Spec técnico del feature: [[03-app/features/mora/MORA_SPEC]]
> Panorama global: [[00-shared/features/MORA]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Ruta go_router:** `/mora`

---

## Qué muestra

Lista de cuotas vencidas de la unidad del residente. Muestra el saldo moroso total, los intereses y si existe un acuerdo de pago vigente. Solo lectura — el residente puede ver su situación de mora pero no gestionarla.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Sin mora | Ilustración + "Estás al día" (verde) |
| Con mora | Vista de alerta con saldo |
