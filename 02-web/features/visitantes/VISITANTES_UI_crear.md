---
type: ui-pantalla
status: active
module: web
feature: visitantes
pantalla: crear
tags: [web, visitantes, ui, crear]
updated: 2026-06-22
---

# Crear — Visitantes (Web)

> Spec: [[02-web/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Registrar ingreso' en historial`


---

## Qué muestra

Formulario de ingreso manual. Campos: Nombre del visitante (requerido), Cédula (opcional), Unidad destino (selector), Motivo (opcional). Si hay una preautorización activa para este visitante, se autocompleta al escribir el nombre o cédula.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay visitas registradas hoy" |
| Con datos | Vista normal |
