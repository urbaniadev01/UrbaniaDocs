---
type: ui-pantalla
status: active
module: web
feature: comunicados
pantalla: lista
tags: [web, comunicados, ui, lista]
updated: 2026-06-22
---

# Lista — Comunicados (Web)

> Spec: [[02-web/features/comunicados/COMUNICADOS_SPEC]]
> Panorama: [[00-shared/features/COMUNICADOS]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Comunicados'`
**Ruta:** `/comunicados`

---

## Qué muestra

Tabla de comunicados. Columnas: Título, Destinatarios, Estado (badge: borrador/publicado), Fecha publicación, Leídos/Total (ej: '43/67'). Botón 'Nuevo comunicado'. Filtro por estado (borrador/publicado).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay comunicados. Crea el primero." |
| Con datos | Vista normal |
