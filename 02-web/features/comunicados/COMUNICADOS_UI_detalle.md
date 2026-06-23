---
type: ui-pantalla
status: active
module: web
feature: comunicados
pantalla: detalle
tags: [web, comunicados, ui, detalle]
updated: 2026-06-22
---

# Detalle — Comunicados (Web)

> Spec: [[02-web/features/comunicados/COMUNICADOS_SPEC]]
> Panorama: [[00-shared/features/COMUNICADOS]]

**Tipo:** Drawer  |  **Se abre desde:** `Click en fila de la lista`


---

## Qué muestra

Panel de detalle. Header: título, estado, fecha de publicación. Cuerpo completo. Adjuntos descargables. Sección de estadísticas embebida (ver COMUNICADOS_UI_estadisticas). Botones: 'Editar' (solo borradores), 'Eliminar'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay comunicados. Crea el primero." |
| Con datos | Vista normal |
