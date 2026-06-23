---
type: ui-pantalla
status: active
module: web
feature: visitantes
pantalla: historial
tags: [web, visitantes, ui, historial]
updated: 2026-06-22
---

# Historial — Visitantes (Web)

> Spec: [[02-web/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Visitantes'`
**Ruta:** `/visitantes`

---

## Qué muestra

Log de ingresos y salidas. Columnas: Nombre del visitante, Cédula, Unidad, Residente, Hora ingreso, Hora salida, Estado (badge). Filtros: unidad, rango de fechas, estado. Botón 'Registrar ingreso'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay visitas registradas hoy" |
| Con datos | Vista normal |
