---
type: ui-pantalla
status: active
module: web
feature: cuotas
pantalla: generar
tags: [web, cuotas, ui, generar]
updated: 2026-06-22
---

# Generar — Cuotas de administración (Web)

> Spec técnico del feature: [[02-web/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Generar cuotas del mes' en lista`


---

## Qué muestra

Modal de confirmación. Campos: selector de mes/año, input de valor base (COP). Preview calculado: 'Se generarán N cuotas por un total de $X'. Advertencia si el período ya fue generado.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No se han generado cuotas para este período" + botón generar |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
