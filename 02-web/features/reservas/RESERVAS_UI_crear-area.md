---
type: ui-pantalla
status: active
module: web
feature: reservas
pantalla: crear-area
tags: [web, reservas, ui, crear-area]
updated: 2026-06-22
---

# Crear Area — Reservas (Web)

> Spec: [[02-web/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Agregar área' o ícono editar en card`


---

## Qué muestra

Formulario de área común. Campos: Nombre, Descripción, Capacidad (número), Tarifa (COP, 0 = gratuita), Horario de inicio y fin (time pickers), Días disponibles (checkboxes: Lun-Dom), Imagen (upload opcional). Toggle Activa/Inactiva.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
