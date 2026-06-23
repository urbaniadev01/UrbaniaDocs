---
type: ui-pantalla
status: active
module: web
feature: proveedores
pantalla: crear-editar
tags: [web, proveedores, ui, crear-editar]
updated: 2026-06-22
---

# Crear Editar — Proveedores (Web)

> Spec: [[02-web/features/proveedores/PROVEEDORES_SPEC]]
> Panorama: [[00-shared/features/PROVEEDORES]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Nuevo proveedor' o ícono editar`


---

## Qué muestra

Formulario. Campos: Razón social, NIT (con validación de dígito de verificación), Categoría (select: Aseo, Seguridad, Jardinería, Eléctrico, etc.), Nombre del contacto, Teléfono, Email. Toggle Activo.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay proveedores registrados" |
| Con datos | Vista normal |
