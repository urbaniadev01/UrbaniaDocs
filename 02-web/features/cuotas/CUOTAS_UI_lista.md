---
type: ui-pantalla
status: active
module: web
feature: cuotas
pantalla: lista
tags: [web, cuotas, ui, lista]
updated: 2026-06-22
---

# Lista — Cuotas de administración (Web)

> Spec técnico del feature: [[02-web/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Cuotas'`
**Ruta:** `/cuotas`

---

## Qué muestra

Selector de período (mes/año) prominente arriba. Tabla de cuotas: Unidad, Torre, Residente, Coeficiente, Monto, Saldo pendiente, Estado (badge). Botón 'Generar cuotas del mes'. Resumen al pie: total generado, total cobrado, total pendiente.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No se han generado cuotas para este período" + botón generar |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
