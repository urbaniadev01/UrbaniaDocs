---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: documentos
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Documentos de Unidad — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Inline / Sección dentro del Drawer de detalle
**Se abre desde:** Drawer de detalle de unidad → sección "Documentos"
**Ruta:** — (no tiene ruta propia)

---

## Qué muestra

- Título de sección: "Documentos ({n})" donde n = conteo total
- Lista de documentos con las siguientes columnas:

| Elemento | Qué muestra |
|---|---|
| Icono | Icono según tipo de archivo (PDF, imagen) |
| Nombre | Nombre descriptivo del documento |
| Tipo | Badge del `document_type` (escritura, plano, certificado, etc.) |
| Tamaño | Formateado: "2.4 MB", "180 KB" |
| Subido por | Nombre del admin que lo subió |
| Fecha | Fecha relativa: "hace 2h", "ayer" |
| Acciones | Botón descargar (todos), botón eliminar (solo admin) |

- Botón "Subir documento" (solo admin) — abajo de la lista o como botón secundario

**Modal de subida:**
- File picker: arrastrar y soltar o seleccionar archivo (PDF, JPEG, PNG, max 20MB)
- Tipo de documento: Select con valores: escritura, plano, certificado_libertad, recibo_pago, contrato, otros
- Nombre: Input texto (pre-poblado con nombre del archivo si no se cambia)
- Notas: Textarea opcional
- Barra de progreso durante la subida

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón descargar | Click | Abre `file_url` en nueva pestaña / descarga directa |
| Botón eliminar | Click | ConfirmDialog → DELETE → refetch lista |
| Botón "Subir documento" | Click | Abre modal de subida |
| Botón "Subir" en modal | Click | Valida → POST multipart → cierra modal → refetch |

---

## Elementos condicionales

- Botón "Subir documento" — solo admin
- Botón eliminar — solo admin, con hover "Eliminar"
- Barra de progreso — visible durante la subida
