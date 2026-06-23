---
type: ui-pantalla
status: active
module: web
feature: votaciones
pantalla: detalle
tags: [web, votaciones, ui, detalle]
updated: 2026-06-22
---

# Detalle — Votaciones (Web)

> Spec: [[02-web/features/votaciones/VOTACIONES_SPEC]]
> Panorama: [[00-shared/features/VOTACIONES]]

**Tipo:** Página  |  **Se abre desde:** `Click en card de la lista`
**Ruta:** `/votaciones/:id`

---

## Qué muestra

Header con la pregunta, tipo, estado, fecha límite. Resultados en tiempo real: barras de progreso por opción con número de votos y coeficiente (para formales). Porcentaje de participación vs total de residentes/coeficiente. Lista de votos (con nombre de votante o anónimo según configuración). Botón 'Cerrar votación' (admin). Si está cerrada: resultado final destacado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay votaciones activas" |
| Con datos | Vista normal |
