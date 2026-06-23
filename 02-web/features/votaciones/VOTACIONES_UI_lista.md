---
type: ui-pantalla
status: active
module: web
feature: votaciones
pantalla: lista
tags: [web, votaciones, ui, lista]
updated: 2026-06-22
---

# Lista — Votaciones (Web)

> Spec: [[02-web/features/votaciones/VOTACIONES_SPEC]]
> Panorama: [[00-shared/features/VOTACIONES]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Votaciones'`
**Ruta:** `/votaciones`

---

## Qué muestra

Tabs: Activas / Cerradas / Borradores. Card por votación: tipo (badge), pregunta (truncada), fecha límite, total de votos, % participación. Botón 'Nueva votación'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay votaciones activas" |
| Con datos | Vista normal |
