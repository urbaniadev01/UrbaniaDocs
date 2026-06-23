---
type: ui-pantalla
status: active
module: web
feature: vehiculos
pantalla: log-acceso
tags: [web, vehiculos, ui, log-acceso]
updated: 2026-06-22
---

# Log Acceso — Vehículos (Web)

> Spec: [[02-web/features/vehiculos/VEHICULOS_SPEC]]
> Panorama: [[00-shared/features/VEHICULOS]]

**Tipo:** Página  |  **Se abre desde:** `Tab 'Acceso' en la vista de vehículos`
**Ruta:** `/vehiculos/acceso`

---

## Qué muestra

Log cronológico de ingresos y salidas. Columnas: Fecha/Hora, Placa, Tipo, Unidad, Movimiento (Ingreso/Salida, badge de color). Filtro por placa, rango de fechas. Botón 'Registrar acceso' (manual).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay vehículos registrados" |
| Con datos | Vista normal |
