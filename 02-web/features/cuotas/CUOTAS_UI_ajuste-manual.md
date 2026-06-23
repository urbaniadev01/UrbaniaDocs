---
type: ui-pantalla
status: active
module: web
feature: cuotas
pantalla: ajuste-manual
tags: [web, cuotas, ui, ajuste-manual]
updated: 2026-06-22
---

# Ajuste Manual — Cuotas de administración (Web)

> Spec técnico del feature: [[02-web/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Ajustar cuota' en detalle de unidad`


---

## Qué muestra

Formulario de ajuste. Campos: tipo (descuento/recargo/nota de crédito), monto, motivo (textarea requerido). Preview del nuevo saldo después del ajuste.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No se han generado cuotas para este período" + botón generar |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
