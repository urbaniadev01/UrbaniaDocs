---
type: ui-pantalla
status: active
module: web
feature: pagos
pantalla: anular
tags: [web, pagos, ui, anular]
updated: 2026-06-22
---

# Anular — Pagos y recibos (Web)

> Spec técnico del feature: [[02-web/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Anular' en detalle de pago`


---

## Qué muestra

Modal de confirmación destructiva. Muestra: datos del pago (fecha, monto, unidad). Campo obligatorio: motivo de anulación (textarea). Advertencia: la anulación revertirá el saldo de las cuotas cubiertas.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
