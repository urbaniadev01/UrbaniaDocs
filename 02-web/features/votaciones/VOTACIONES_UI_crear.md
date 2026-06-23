---
type: ui-pantalla
status: active
module: web
feature: votaciones
pantalla: crear
tags: [web, votaciones, ui, crear]
updated: 2026-06-22
---

# Crear — Votaciones (Web)

> Spec: [[02-web/features/votaciones/VOTACIONES_SPEC]]
> Panorama: [[00-shared/features/VOTACIONES]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Nueva votación'`


---

## Qué muestra

Formulario. Campos: Tipo (Formal/Encuesta), Pregunta, Opciones de respuesta (mínimo 2, máximo 5, con botón 'Agregar opción'). Asamblea vinculada (selector opcional, solo para formales). Fecha límite (opcional). Toggle 'Activar inmediatamente' vs guardar como borrador.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay votaciones activas" |
| Con datos | Vista normal |
