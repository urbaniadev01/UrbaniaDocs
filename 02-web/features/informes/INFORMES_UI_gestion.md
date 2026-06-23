---
type: ui-pantalla
status: active
module: web
feature: informes
pantalla: gestion
tags: [web, informes, ui, gestion]
updated: 2026-06-22
---

# Gestion — Informes (Web)

> Spec: [[02-web/features/informes/INFORMES_SPEC]]
> Panorama: [[00-shared/features/INFORMES]]

**Tipo:** Página  |  **Se abre desde:** `Card 'Informe de gestión' o link directo`
**Ruta:** `/informes/gestion`

---

## Qué muestra

Informe de gestión del período. Secciones: PQRS (total, por tipo, tiempo promedio de resolución), Órdenes de trabajo (total, cerradas, pendientes, costo total), Reservas de áreas comunes (total, ingresos generados). Selector de período. Exportar PDF / Excel.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de secciones |
| Sin datos en el período | "No hay datos para el período seleccionado" |
| Con datos | Vista normal |
