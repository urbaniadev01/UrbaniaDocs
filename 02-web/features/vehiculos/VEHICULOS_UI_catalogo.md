---
type: ui-pantalla
status: active
module: web
feature: vehiculos
pantalla: catalogo
tags: [web, vehiculos, ui, catalogo]
updated: 2026-06-22
---

# Catalogo — Vehículos (Web)

> Spec: [[02-web/features/vehiculos/VEHICULOS_SPEC]]
> Panorama: [[00-shared/features/VEHICULOS]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Vehículos'`
**Ruta:** `/vehiculos`

---

## Qué muestra

Tabla de vehículos registrados. Columnas: Tipo (ícono + texto), Placa, Marca/Color, Unidad, Cupo asignado, Estado (Activo/Inactivo). Filtro por tipo, unidad y estado. Botón 'Registrar vehículo'. Resumen en header: total vehículos, cupos ocupados / total disponibles.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay vehículos registrados" |
| Con datos | Vista normal |
