---
type: ui-pantalla
status: active
module: web
feature: informes
pantalla: cartera
tags: [web, informes, ui, cartera]
updated: 2026-06-22
---

# Cartera — Informes (Web)

> Spec: [[02-web/features/informes/INFORMES_SPEC]]
> Panorama: [[00-shared/features/INFORMES]]

**Tipo:** Página  |  **Se abre desde:** `Card 'Informe de cartera' o link directo`
**Ruta:** `/informes/cartera`

---

## Qué muestra

Informe de morosos. Tabla de unidades en mora: nombre, saldo, días de mora, intereses. Resumen: total de cartera, # de morosos, % del total de unidades. Historial de acuerdos de pago vigentes. Botones de exportación.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de secciones |
| Sin datos en el período | "No hay datos para el período seleccionado" |
| Con datos | Vista normal |
