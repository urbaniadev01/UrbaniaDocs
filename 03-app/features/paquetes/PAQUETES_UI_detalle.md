---
type: ui-pantalla
status: active
module: mobile
feature: paquetes
pantalla: detalle
tags: [app, paquetes, ui, detalle]
updated: 2026-06-23
---

# Detalle — Paquetes (App)

> Spec técnico del feature: [[03-app/features/paquetes/PAQUETES_SPEC]]
> Panorama global: [[00-shared/features/PAQUETES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** BottomSheet
**Se abre desde:** Tap en card de [[03-app/features/paquetes/PAQUETES_UI_lista]]

---

## Qué muestra

Header con drag-handle. Foto del paquete (`photo_url`) si existe, prominente en la parte superior. Debajo, descripción completa del paquete, `carrier` + `tracking_code`, y unidad destinataria (`recipient_unit`) — siempre la del usuario autenticado. Timeline vertical de eventos con íconos:

- `received` — recibido en portería (`received_at`)
- `notified` — residente notificado (`notified_at`)
- `delivered` — entregado (`delivered_at`) + nombre de quien recibió (`delivered_to_name`)
- `returned` — devuelto (`returned_at`)

Cada evento del `timeline` muestra ícono, etiqueta y timestamp. Botón prominente "Confirmar entrega" al pie del sheet, visible solo si `status == notified`.

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Botón "Confirmar entrega" | Tap | Abre [[03-app/features/paquetes/PAQUETES_UI_confirmar-entrega]] (Dialog) |
| Backdrop | Tap | Cierra el BottomSheet |
| Sheet | Swipe down | Cierra el BottomSheet |
| Drag-handle | Drag | Expande/contrae el sheet |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer del contenido (foto + campos + timeline) |
| Error 404 | "Paquete no encontrado" + botón "Cerrar" |
| Sin conexión | Mensaje "Sin conexión" + datos de la card si vienen del caché de lista |
| Con datos | Sheet normal con foto, campos y timeline |

---

## Elementos condicionales

- Foto del paquete — visible solo si `photo_url != null`
- Botón "Confirmar entrega" — visible solo si `status == notified`
- Bloque `delivered_to_name` — visible solo si `status == delivered`
- Evento `returned` en timeline — visible solo si `status == returned`

---

## Accesibilidad

- Timeline — `Semantics` que lee los eventos en orden con sus timestamps
- Foto del paquete — label descriptivo "Foto del paquete"
- Botón "Confirmar entrega" — label explícito de la acción

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
