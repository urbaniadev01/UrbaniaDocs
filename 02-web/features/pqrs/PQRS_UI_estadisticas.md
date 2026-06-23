---
type: ui-pantalla
status: active
module: web
feature: pqrs
pantalla: estadisticas
tags: [web, pqrs, ui, estadisticas]
updated: 2026-06-22
---

# Estadisticas — PQRS (Web)

> Spec: [[02-web/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Inline  |  **Se abre desde:** `Panel al tope del listado /pqrs`


---

## Qué muestra

Cards de resumen: total abiertas, total en revisión, tiempo promedio de resolución (días), PQRS por tipo (mini gráfico de dona). Se actualiza con los filtros activos en el listado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado al contexto |
| Con datos | Vista normal |
