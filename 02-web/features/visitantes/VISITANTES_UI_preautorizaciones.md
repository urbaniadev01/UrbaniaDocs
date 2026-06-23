---
type: ui-pantalla
status: active
module: web
feature: visitantes
pantalla: preautorizaciones
tags: [web, visitantes, ui, preautorizaciones]
updated: 2026-06-22
---

# Preautorizaciones — Visitantes (Web)

> Spec: [[02-web/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Página  |  **Se abre desde:** `Tab o link en la vista de visitantes`
**Ruta:** `/visitantes/preautorizaciones`

---

## Qué muestra

Lista de visitas preautorizadas activas (no vencidas). Card por preautorización: nombre del visitante, unidad, fecha/hora esperada de visita, código QR (botón para ver/descargar). Filtro: unidad, estado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay visitas registradas hoy" |
| Con datos | Vista normal |
