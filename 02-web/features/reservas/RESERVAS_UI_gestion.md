---
type: ui-pantalla
status: active
module: web
feature: reservas
pantalla: gestion
tags: [web, reservas, ui, gestion]
updated: 2026-06-22
---

# Gestion — Reservas (Web)

> Spec: [[02-web/features/reservas/RESERVAS_SPEC]]
> Panorama: [[00-shared/features/RESERVAS]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Reservas'`
**Ruta:** `/reservas`

---

## Qué muestra

Vista principal de gestión. Tabs: Pendientes (con contador) / Todas. Vista de lista o calendario (toggle). Lista: Área, Residente/Unidad, Fecha, Horario, Estado (badge), Costo. Calendario: vista mensual con bloques coloreados por estado.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
