---
type: ui-pantalla
status: active
module: web
feature: asambleas
pantalla: lista
tags: [web, asambleas, ui, lista]
updated: 2026-06-22
---

# Lista — Asambleas (Web)

> Spec: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Asambleas'`
**Ruta:** `/asambleas`

---

## Qué muestra

Lista de asambleas ordenadas por fecha. Card por asamblea: tipo (Ordinaria/Extraordinaria), fecha, estado (badge), quórum alcanzado. Sección 'Próximas' separada de 'Pasadas'. Botón 'Convocar asamblea'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
