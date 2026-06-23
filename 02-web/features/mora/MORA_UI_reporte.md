---
type: ui-pantalla
status: active
module: web
feature: mora
pantalla: reporte
tags: [web, mora, ui, reporte]
updated: 2026-06-22
---

# Reporte — Cartera de mora (Web)

> Spec técnico del feature: [[02-web/features/mora/MORA_SPEC]]
> Panorama global: [[00-shared/features/MORA]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** `Sidebar → 'Mora'`
**Ruta:** `/mora`

---

## Qué muestra

Tabla de unidades en mora. Columnas: Unidad, Residente, Saldo moroso (COP), Días vencidos, Interés acumulado, Cuotas vencidas (#), Acuerdo vigente (badge). Ordenable por saldo o días vencidos. Botón 'Exportar a Excel'. Resumen en header: total de la cartera morosa.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Vacío | Mensaje "No hay unidades en mora" con ícono de check |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
