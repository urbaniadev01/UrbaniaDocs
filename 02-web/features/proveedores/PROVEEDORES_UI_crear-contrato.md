---
type: ui-pantalla
status: active
module: web
feature: proveedores
pantalla: crear-contrato
tags: [web, proveedores, ui, crear-contrato]
updated: 2026-06-22
---

# Crear Contrato — Proveedores (Web)

> Spec: [[02-web/features/proveedores/PROVEEDORES_SPEC]]
> Panorama: [[00-shared/features/PROVEEDORES]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Agregar contrato' en el drawer de detalle`


---

## Qué muestra

Formulario de contrato. Campos: Descripción del servicio, Fecha de inicio y fin (date pickers), Valor mensual (COP), Upload de documentos (PDFs: contrato firmado, otrosí, etc.). Al guardar: aparece en la ficha del proveedor.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay proveedores registrados" |
| Con datos | Vista normal |
