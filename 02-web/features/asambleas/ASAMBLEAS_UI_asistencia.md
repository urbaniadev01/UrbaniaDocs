---
type: ui-pantalla
status: active
module: web
feature: asambleas
pantalla: asistencia
tags: [web, asambleas, ui, asistencia]
updated: 2026-06-22
---

# Asistencia — Asambleas (Web)

> Spec: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Inline  |  **Se abre desde:** `Sección 'Asistencia' dentro del detalle de la asamblea`


---

## Qué muestra

Lista de propietarios y residentes. Columnas: Unidad, Nombre, Coeficiente, Modalidad (Presencial/Virtual), Hora de registro. Toggle o checkbox para marcar asistencia. Buscador de propietario. Totales al pie: asistentes, coeficiente acumulado, % de quórum.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
