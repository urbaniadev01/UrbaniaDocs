---
type: ui-pantalla
status: active
module: web
feature: pagos
pantalla: detalle
tags: [web, pagos, ui, detalle]
updated: 2026-06-22
---

# Detalle — Pagos y recibos (Web)

> Spec técnico del feature: [[02-web/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Drawer
**Se abre desde:** `Click en fila de la lista`


---

## Qué muestra

Panel de solo lectura. Secciones: Información del pago (fecha, monto, método, referencia, registrado por), Comprobante (imagen o link al PDF), Cuotas cubiertas (lista de cuotas con período y monto aplicado), Acciones: botón 'Ver recibo' y botón 'Anular' (solo si no está anulado).

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
