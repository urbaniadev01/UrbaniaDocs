---
type: ui-pantalla
status: active
module: web
feature: pagos
pantalla: recibo
tags: [web, pagos, ui, recibo]
updated: 2026-06-22
---

# Recibo — Pagos y recibos (Web)

> Spec técnico del feature: [[02-web/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Inline
**Se abre desde:** `Botón 'Ver recibo' en detalle de pago`


---

## Qué muestra

Vista inline dentro del Drawer. Formato de recibo oficial: logo del conjunto, número de recibo, fecha, datos del residente y unidad, detalle de cuotas cubiertas, monto, método, firma del administrador. Botón 'Imprimir' y 'Descargar PDF'.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
