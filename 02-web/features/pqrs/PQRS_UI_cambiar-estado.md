---
type: ui-pantalla
status: active
module: web
feature: pqrs
pantalla: cambiar-estado
tags: [web, pqrs, ui, cambiar-estado]
updated: 2026-06-22
---

# Cambiar Estado — PQRS (Web)

> Spec: [[02-web/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Cambiar estado' en detalle`


---

## Qué muestra

Modal con selector de nuevo estado (solo transiciones válidas). Campo de comentario requerido (razón del cambio). Si se cierra: campo 'resolución' obligatorio. Al confirmar: cambia estado y notifica al residente.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado al contexto |
| Con datos | Vista normal |
