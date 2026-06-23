---
type: ui-pantalla
status: active
module: web
feature: proveedores
pantalla: catalogo
tags: [web, proveedores, ui, catalogo]
updated: 2026-06-22
---

# Catalogo — Proveedores (Web)

> Spec: [[02-web/features/proveedores/PROVEEDORES_SPEC]]
> Panorama: [[00-shared/features/PROVEEDORES]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Proveedores'`
**Ruta:** `/proveedores`

---

## Qué muestra

Tabla de proveedores. Columnas: Razón social, NIT, Categoría, Contacto, Estado del contrato activo (badge: Activo/Vencido/Por vencer). Filtro por categoría y estado. Alertas destacadas en rojo para contratos por vencer (<30 días). Botón 'Nuevo proveedor'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay proveedores registrados" |
| Con datos | Vista normal |
