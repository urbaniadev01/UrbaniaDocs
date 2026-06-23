---
type: ui-pantalla
status: active
module: web
feature: mora
pantalla: acuerdo-pago
tags: [web, mora, ui, acuerdo-pago]
updated: 2026-06-22
---

# Acuerdo Pago — Cartera de mora (Web)

> Spec técnico del feature: [[02-web/features/mora/MORA_SPEC]]
> Panorama global: [[00-shared/features/MORA]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Generar acuerdo de pago' en detalle`


---

## Qué muestra

Modal de creación de acuerdo. Campos: número de cuotas del acuerdo (slider 1-12), fecha límite del acuerdo, monto de cada cuota del acuerdo (calculado automáticamente: saldo_total / n_cuotas). Preview del plan de pagos en tabla. Opción de enviar el acuerdo por email al residente.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No hay unidades en mora" con ícono de check |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
