---
type: ui-pantalla
status: active
module: web
feature: proveedores
pantalla: detalle
tags: [web, proveedores, ui, detalle]
updated: 2026-06-22
---

# Detalle — Proveedores (Web)

> Spec: [[02-web/features/proveedores/PROVEEDORES_SPEC]]
> Panorama: [[00-shared/features/PROVEEDORES]]

**Tipo:** Drawer  |  **Se abre desde:** `Click en fila del catálogo`


---

## Qué muestra

Panel de detalle del proveedor. Secciones: Datos de la empresa, Contacto, Contratos (lista de todos los contratos históricos con estado), Servicios prestados (historial de ORDENES-TRABAJO y MANTENIMIENTO asociados). Botones: 'Editar proveedor', 'Agregar contrato'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay proveedores registrados" |
| Con datos | Vista normal |
