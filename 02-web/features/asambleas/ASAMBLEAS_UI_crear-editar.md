---
type: ui-pantalla
status: active
module: web
feature: asambleas
pantalla: crear-editar
tags: [web, asambleas, ui, crear-editar]
updated: 2026-06-22
---

# Crear Editar — Asambleas (Web)

> Spec: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Convocar asamblea' o ícono editar`


---

## Qué muestra

Formulario de convocatoria. Campos: Tipo (Ordinaria/Extraordinaria), Fecha (date+time picker), Lugar, Descripción. Sección de Orden del día: lista de puntos con botón 'Agregar punto'. Por punto: título, descripción, toggle '¿Requiere votación?'. Botón 'Guardar y notificar'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
