---
type: ui-pantalla
status: active
module: web
feature: pqrs
pantalla: crear
tags: [web, pqrs, ui, crear]
updated: 2026-06-22
---

# Crear — PQRS (Web)

> Spec: [[02-web/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Nueva PQRS' en lista`


---

## Qué muestra

Formulario para que el admin radique en nombre de un residente. Campos: Unidad/Residente (selector), Tipo, Título, Descripción, Adjuntos. Al crear, el residente recibe notificación con el número de radicado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado al contexto |
| Con datos | Vista normal |
