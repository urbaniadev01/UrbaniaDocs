---
type: ui-pantalla
status: active
module: web
feature: informes
pantalla: financiero
tags: [web, informes, ui, financiero]
updated: 2026-06-22
---

# Financiero — Informes (Web)

> Spec: [[02-web/features/informes/INFORMES_SPEC]]
> Panorama: [[00-shared/features/INFORMES]]

**Tipo:** Página  |  **Se abre desde:** `Card 'Informe financiero' o link directo`
**Ruta:** `/informes/financiero`

---

## Qué muestra

Informe de estado financiero. Selector de período en el header. Secciones: Ingresos del período (cuotas cobradas, desglose), Egresos del período (cuentas pagadas por categoría), Saldo neto, Comparativa vs. presupuesto (tabla + barras). Fondo de reserva al pie. Botones 'Exportar PDF' y 'Exportar Excel'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de secciones |
| Sin datos en el período | "No hay datos para el período seleccionado" |
| Con datos | Vista normal |
