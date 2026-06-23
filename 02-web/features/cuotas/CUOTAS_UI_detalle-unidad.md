---
type: ui-pantalla
status: active
module: web
feature: cuotas
pantalla: detalle-unidad
tags: [web, cuotas, ui, detalle-unidad]
updated: 2026-06-22
---

# Detalle Unidad — Cuotas de administración (Web)

> Spec técnico del feature: [[02-web/features/cuotas/CUOTAS_SPEC]]
> Panorama global: [[00-shared/features/CUOTAS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Click en fila de la lista`
**Ruta:** `/cuotas/unidad/:id`

---

## Qué muestra

Header con datos de la unidad. Historial de cuotas en tabla cronológica: Período, Monto, Ajustes, Saldo, Estado, Fecha de pago. Sección de mora si tiene saldo vencido. Botón 'Ajustar cuota' en cada fila pendiente.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No se han generado cuotas para este período" + botón generar |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
