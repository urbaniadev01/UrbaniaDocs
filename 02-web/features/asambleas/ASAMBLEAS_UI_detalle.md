---
type: ui-pantalla
status: active
module: web
feature: asambleas
pantalla: detalle
tags: [web, asambleas, ui, detalle]
updated: 2026-06-22
---

# Detalle — Asambleas (Web)

> Spec: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Página  |  **Se abre desde:** `Click en card de la lista`
**Ruta:** `/asambleas/:id`

---

## Qué muestra

Vista de gestión en vivo de la asamblea. Header: tipo, fecha, estado, quórum en tiempo real (barra de progreso con el % del coeficiente total). Dos secciones inline embebidas: Asistencia (ver ASAMBLEAS_UI_asistencia) y Orden del día (ver ASAMBLEAS_UI_puntos). Botón 'Publicar acta' al finalizar.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
