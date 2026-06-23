---
type: ui-pantalla
status: active
module: mobile
feature: comunicados
pantalla: lista
tags: [app, comunicados, ui, lista]
updated: 2026-06-22
---

# Lista — Comunicados (App)

> Spec: [[03-app/features/comunicados/COMUNICADOS_SPEC]]
> Panorama: [[00-shared/features/COMUNICADOS]]

**Tipo:** Screen  |  **Ruta go_router:** `/comunicados`

---

## Qué muestra

Feed de comunicados publicados, ordenados por fecha descendente. Card por comunicado: título prominente, fecha, badge de leído/no leído. Notificación si hay nuevos desde la última visita.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "No hay comunicados publicados" |
| Con datos | Lista / contenido normal |
