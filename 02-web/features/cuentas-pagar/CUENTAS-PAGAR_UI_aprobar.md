---
type: ui-pantalla
status: active
module: web
feature: cuentas-pagar
pantalla: aprobar
tags: [web, cuentas-pagar, ui, aprobar]
updated: 2026-06-22
---

# Aprobar — Cuentas por pagar (Web)

> Spec: [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]]
> Panorama: [[00-shared/features/CUENTAS-PAGAR]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Aprobar' en el drawer de detalle`


---

## Qué muestra

Modal de aprobación. Resumen de la cuenta. Campo de comentario (opcional). Botón 'Aprobar'. Al aprobar: estado cambia a 'aprobada' y queda lista para pagar.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay cuentas por pagar pendientes" |
| Con datos | Vista normal |
