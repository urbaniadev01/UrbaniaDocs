---
type: ui-pantalla
status: active
module: web
feature: informes
pantalla: centro
tags: [web, informes, ui, centro]
updated: 2026-06-22
---

# Centro — Informes (Web)

> Spec: [[02-web/features/informes/INFORMES_SPEC]]
> Panorama: [[00-shared/features/INFORMES]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Informes'`
**Ruta:** `/informes`

---

## Qué muestra

Catálogo de informes disponibles. Cards: Informe financiero, Informe de cartera, Informe de gestión. Cada card: descripción breve, selector de período, botones 'Ver' y 'Exportar PDF / Excel'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de secciones |
| Sin datos en el período | "No hay datos para el período seleccionado" |
| Con datos | Vista normal |
