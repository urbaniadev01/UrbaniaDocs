---
type: ui-pantalla
status: active
module: web
feature: asambleas
pantalla: puntos
tags: [web, asambleas, ui, puntos]
updated: 2026-06-22
---

# Puntos — Asambleas (Web)

> Spec: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Inline  |  **Se abre desde:** `Sección 'Orden del día' dentro del detalle`


---

## Qué muestra

Lista de puntos de la agenda en orden. Por punto: número, título, estado (badge). Acciones: marcar como 'En discusión', 'Aprobado', 'Rechazado', 'Diferido'. Si el punto tiene votación: botón 'Ir a votación' con link al detalle de la votación.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
