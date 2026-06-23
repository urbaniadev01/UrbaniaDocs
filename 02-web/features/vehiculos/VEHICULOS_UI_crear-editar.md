---
type: ui-pantalla
status: active
module: web
feature: vehiculos
pantalla: crear-editar
tags: [web, vehiculos, ui, crear-editar]
updated: 2026-06-22
---

# Crear Editar — Vehículos (Web)

> Spec: [[02-web/features/vehiculos/VEHICULOS_SPEC]]
> Panorama: [[00-shared/features/VEHICULOS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Registrar vehículo' o ícono editar`


---

## Qué muestra

Formulario. Campos: Unidad (selector), Tipo (selector con íconos), Placa (uppercase automático), Marca, Modelo (opcional), Color, Cupo de parqueadero (texto libre, ej: 'P-12'). Toggle Activo/Inactivo.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay vehículos registrados" |
| Con datos | Vista normal |
