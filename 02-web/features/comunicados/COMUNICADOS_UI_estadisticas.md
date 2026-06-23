---
type: ui-pantalla
status: active
module: web
feature: comunicados
pantalla: estadisticas
tags: [web, comunicados, ui, estadisticas]
updated: 2026-06-22
---

# Estadisticas — Comunicados (Web)

> Spec: [[02-web/features/comunicados/COMUNICADOS_SPEC]]
> Panorama: [[00-shared/features/COMUNICADOS]]

**Tipo:** Inline  |  **Se abre desde:** `Sección en el Drawer de detalle`


---

## Qué muestra

Sección inline dentro del Drawer. Muestra: total de destinatarios, total de lecturas, porcentaje. Lista de residentes que han leído con timestamp. Lista de residentes que aún no han leído. Útil para hacer seguimiento y reenviar a los que no leyeron.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay comunicados. Crea el primero." |
| Con datos | Vista normal |
