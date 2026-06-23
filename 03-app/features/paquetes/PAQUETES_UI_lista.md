---
type: ui-pantalla
status: active
module: mobile
feature: paquetes
pantalla: lista
tags: [app, paquetes, ui, lista]
updated: 2026-06-23
---

# Lista — Paquetes (App)

> Spec técnico del feature: [[03-app/features/paquetes/PAQUETES_SPEC]]
> Panorama global: [[00-shared/features/PAQUETES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Tab de inicio o push `paquete_recibido` (deep link a `/paquetes/:id` abre directo el detalle)
**Ruta go_router:** `/paquetes`

---

## Qué muestra

AppBar con título "Paquetes". Debajo, fila de chips de filtro por `status`: Todos / En portería (`received` + `notified`) / Entregados / Devueltos. Lista scrolleable de cards, una por paquete.

### Card de cada paquete

| Campo en card | Qué muestra | Posición |
|---|---|---|
| Ícono paquete | Ícono representativo del paquete | Izquierda, alineado al centro |
| Descripción | Texto del campo `description`, truncado a 2 líneas | Línea 1, prominente |
| Carrier + tracking | `carrier` + `tracking_code` (ej: "DHL · JD0012345678"), muted | Línea 2, secundario |
| Badge de estado | Estado con color por `status` (received/notified = ámbar, delivered = verde, returned = gris) | Derecha, alineado al centro |
| Tiempo relativo | `received_at` en formato "hace 2h" / "lun 22 jun" | Debajo del carrier, muted |
| Botón "Entregar" | Acción rápida de entrega | Extremo derecho, solo si `status == notified` |

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Card de paquete | Tap | Abre [[03-app/features/paquetes/PAQUETES_UI_detalle]] (BottomSheet) |
| Botón "Entregar" en card | Tap | Abre [[03-app/features/paquetes/PAQUETES_UI_confirmar-entrega]] (Dialog) |
| Chip de filtro | Tap | Refiltrar lista por `status` (re-ejecuta `GET /packages`) |
| Pull down | Pull to refresh | Recarga la lista (`GET /packages`) |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer de 4-6 cards |
| Vacío | Ilustración + "No tienes paquetes" + texto "Cuando llegue algo a portería te avisaremos" |
| Error | Mensaje + botón "Reintentar" |
| Sin conexión | Banner de offline; datos en caché Drift si disponibles (TTL 1h) |
| Con datos | Lista normal |

---

## Elementos condicionales

- Botón "Entregar" en card — visible solo si `status == notified`
- Badge de estado — color depende del `status` (ámbar / verde / gris)

---

## Filtros y búsqueda

| Filtro | Control | Opciones |
|---|---|---|
| Estado | Chips horizontales | Todos / En portería / Entregados / Devueltos |

> "En portería" agrupa `received` + `notified` (dos llamadas o filtro client-side sobre la página cargada).

---

## Accesibilidad

- Card de paquete — `Semantics` con label "Paquete <descripción>, estado <estado>, <tiempo>" para lector de pantalla
- Chips de filtro — label claro del filtro activo
- Botón "Entregar" — label "Confirmar entrega del paquete <descripción>"

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
