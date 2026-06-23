---
type: ui-pantalla
status: active
module: web
feature: proveedores
pantalla: documentos
tags: [web, proveedores, ui, documentos]
updated: 2026-06-22
---

# Documentos — Proveedores (Web)

> Spec: [[02-web/features/proveedores/PROVEEDORES_SPEC]]
> Panorama: [[00-shared/features/PROVEEDORES]]

**Tipo:** Inline  |  **Se abre desde:** `Sección 'Documentos' dentro del drawer de detalle del contrato`


---

## Qué muestra

Lista de PDFs adjuntos al contrato. Cada documento: nombre, fecha de subida, botón para descargar o ver en nueva pestaña. Botón 'Subir documento' para agregar más archivos al contrato.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay proveedores registrados" |
| Con datos | Vista normal |
