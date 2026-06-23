---
type: ui-pantalla
status: active
module: mobile
feature: comunicados
pantalla: detalle
tags: [app, comunicados, ui, detalle]
updated: 2026-06-22
---

# Detalle — Comunicados (App)

> Spec: [[03-app/features/comunicados/COMUNICADOS_SPEC]]
> Panorama: [[00-shared/features/COMUNICADOS]]

**Tipo:** Screen  |  **Ruta go_router:** `/comunicados/:id`

---

## Qué muestra

Contenido completo del comunicado. Título, fecha, cuerpo. Adjuntos (imágenes en galería, PDFs con botón de descarga/apertura). Se marca automáticamente como leído al abrir.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay comunicados publicados" |
| Con datos | Lista / contenido normal |
