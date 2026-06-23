---
type: ui-pantalla
status: active
module: web
feature: reservas
pantalla: aprobar-rechazar
tags: [web, reservas, ui, aprobar-rechazar]
updated: 2026-06-22
---

# Aprobar Rechazar — Reservas (Web)

> Spec: [[02-web/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Modal  |  **Se abre desde:** `Botones 'Aprobar' o 'Rechazar' en el drawer de detalle`


---

## Qué muestra

Modal de confirmación. Muestra el resumen de la reserva. Campo de comentario (opcional para aprobar, recomendado para rechazar). Botón de acción (verde para aprobar, rojo para rechazar). Al confirmar: notificación automática al residente.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
