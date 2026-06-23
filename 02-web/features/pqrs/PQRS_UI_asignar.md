---
type: ui-pantalla
status: active
module: web
feature: pqrs
pantalla: asignar
tags: [web, pqrs, ui, asignar]
updated: 2026-06-22
---

# Asignar — PQRS (Web)

> Spec: [[02-web/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Asignar' en detalle`


---

## Qué muestra

Modal simple. Selector de usuario admin para asignar. Opcional: comentario interno. Al asignar, el responsable recibe notificación.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado al contexto |
| Con datos | Vista normal |
