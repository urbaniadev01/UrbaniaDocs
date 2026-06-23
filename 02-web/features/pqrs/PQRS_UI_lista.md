---
type: ui-pantalla
status: active
module: web
feature: pqrs
pantalla: lista
tags: [web, pqrs, ui, lista]
updated: 2026-06-22
---

# Lista — PQRS (Web)

> Spec: [[02-web/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'PQRS'`
**Ruta:** `/pqrs`

---

## Qué muestra

Tabla de gestión. Columnas: Radicado, Tipo (badge color por tipo), Título, Residente/Unidad, Estado (badge), Asignado a, Fecha. Filtros: tipo, estado, asignado, rango de fechas. Panel de estadísticas inline al tope (ver PQRS_UI_estadisticas). Botón 'Nueva PQRS'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado al contexto |
| Con datos | Vista normal |
