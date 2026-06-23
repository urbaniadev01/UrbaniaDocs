---
type: ui-pantalla
status: active
module: web
feature: comunicados
pantalla: crear-editar
tags: [web, comunicados, ui, crear-editar]
updated: 2026-06-22
---

# Crear Editar — Comunicados (Web)

> Spec: [[02-web/features/comunicados/COMUNICADOS_SPEC]]
> Panorama: [[00-shared/features/COMUNICADOS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Nuevo comunicado' o ícono editar en borradores`


---

## Qué muestra

Editor de comunicado. Campos: Título (input), Cuerpo (área de texto enriquecido o markdown), Destinatarios (selector: Todos / Por torre / Por unidad específica con multiselect), Adjuntos (upload de imágenes o PDFs, máx 5). Botones: 'Guardar borrador' y 'Publicar ahora'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay comunicados. Crea el primero." |
| Con datos | Vista normal |
