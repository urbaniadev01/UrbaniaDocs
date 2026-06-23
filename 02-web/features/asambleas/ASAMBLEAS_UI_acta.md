---
type: ui-pantalla
status: active
module: web
feature: asambleas
pantalla: acta
tags: [web, asambleas, ui, acta]
updated: 2026-06-22
---

# Acta — Asambleas (Web)

> Spec: [[02-web/features/asambleas/ASAMBLEAS_SPEC]]
> Panorama: [[00-shared/features/ASAMBLEAS]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Publicar acta' en detalle de asamblea finalizada`


---

## Qué muestra

Modal para publicar el acta. Upload del PDF del acta firmada. Vista previa del nombre y tamaño del archivo. Confirmación: 'Al publicar, todos los propietarios serán notificados'. Botón 'Publicar acta'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | Empty state apropiado |
| Con datos | Vista normal |
