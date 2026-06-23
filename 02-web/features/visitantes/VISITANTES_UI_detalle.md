---
type: ui-pantalla
status: active
module: web
feature: visitantes
pantalla: detalle
tags: [web, visitantes, ui, detalle]
updated: 2026-06-22
---

# Detalle — Visitantes (Web)

> Spec: [[02-web/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Drawer  |  **Se abre desde:** `Click en fila del historial`


---

## Qué muestra

Panel de solo lectura. Datos del visitante: nombre, cédula, motivo. Unidad y residente. Hora de ingreso y salida. Si está en estado 'ingresó': botón 'Registrar salida'. Foto del visitante si fue capturada.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay visitas registradas hoy" |
| Con datos | Vista normal |
