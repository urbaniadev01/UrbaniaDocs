---
type: ui-pantalla
status: active
module: mobile
feature: pagos
pantalla: registrar
tags: [app, pagos, ui, registrar]
updated: 2026-06-22
---

# Registrar — Pagos y recibos (App)

> Spec técnico del feature: [[03-app/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** BottomSheet
**Ruta go_router:** `Botón en lista de cuotas o pagos`

---

## Qué muestra

Formulario simplificado para registrar pago. Campos: monto, método, referencia (opcional), comprobante (foto o PDF). Para residentes que paguen por transferencia o PSE.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Con datos | Vista normal |
| Sin conexión | Datos en caché (online-only para mutaciones) |
