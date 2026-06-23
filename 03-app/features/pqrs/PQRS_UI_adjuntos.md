---
type: ui-pantalla
status: active
module: mobile
feature: pqrs
pantalla: adjuntos
tags: [app, pqrs, ui, adjuntos]
updated: 2026-06-22
---

# Adjuntos — PQRS (App)

> Spec: [[03-app/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** BottomSheet  |  **Se abre desde:** tap en icono de adjuntos

---

## Qué muestra

Galería de adjuntos de la PQRS. Imágenes en grid, PDFs en lista con ícono. Botón para agregar más archivos (cámara, galería, documentos).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Aún no has radicado ninguna PQRS" + botón crear |
| Con datos | Vista normal |
