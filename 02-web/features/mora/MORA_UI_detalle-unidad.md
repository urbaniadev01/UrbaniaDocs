---
type: ui-pantalla
status: active
module: web
feature: mora
pantalla: detalle-unidad
tags: [web, mora, ui, detalle-unidad]
updated: 2026-06-22
---

# Detalle Unidad — Cartera de mora (Web)

> Spec técnico del feature: [[02-web/features/mora/MORA_SPEC]]
> Panorama global: [[00-shared/features/MORA]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Drawer
**Se abre desde:** `Click en fila del reporte`


---

## Qué muestra

Panel de detalle de mora de la unidad. Secciones: Resumen (saldo total, intereses, días de mora), Lista de cuotas vencidas (período, monto, días, interés individual), Acuerdo de pago vigente si existe, Historial de gestión (notas de cobro con fecha y usuario). Botón 'Generar acuerdo de pago'.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No hay unidades en mora" con ícono de check |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
