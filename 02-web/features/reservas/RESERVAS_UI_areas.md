---
type: ui-pantalla
status: active
module: web
feature: reservas
pantalla: areas
tags: [web, reservas, ui, areas]
updated: 2026-06-22
---

# Areas — Reservas (Web)

> Spec: [[02-web/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Áreas comunes' dentro de Reservas`
**Ruta:** `/reservas/areas`

---

## Qué muestra

Catálogo de áreas comunes. Card por área: imagen, nombre, capacidad, tarifa (o 'Gratuita'), horario, días disponibles, estado (Activa/Inactiva). Botón 'Agregar área'. Acciones por card: editar, activar/desactivar.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
