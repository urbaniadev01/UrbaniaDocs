---
type: ui-pantalla
status: active
module: web
feature: pagos
pantalla: lista
tags: [web, pagos, ui, lista]
updated: 2026-06-22
---

# Lista — Pagos y recibos (Web)

> Spec técnico del feature: [[02-web/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Pagos'`
**Ruta:** `/pagos`

---

## Qué muestra

Tabla de pagos. Columnas: Fecha, Unidad, Residente, Monto, Método (badge), Estado (badge). Botón 'Registrar pago'. Filtros: rango de fechas, unidad/residente, método, estado. Resumen en header: total del período.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
