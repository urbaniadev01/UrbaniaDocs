---
type: ui-pantalla
status: active
module: web
feature: cuotas
pantalla: detalle-calculo
tags: [web, cuotas, ui, detalle-calculo]
updated: 2026-06-22
---

# Detalle Calculo — Cuotas de administración (Web)

> Spec técnico del feature: [[02-web/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Ícono de información en tabla o botón 'Ver cálculo'`


---

## Qué muestra

Modal de solo lectura. Muestra el desglose del cálculo: valor_base, coeficiente, subtotal, ajustes aplicados (+/-), monto final. Historial de ajustes con usuario y fecha.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No se han generado cuotas para este período" + botón generar |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
