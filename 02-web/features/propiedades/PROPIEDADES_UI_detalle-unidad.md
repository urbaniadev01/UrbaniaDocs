---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: detalle-unidad
tags: [web, propiedades, ui]
updated: 2026-06-27
---

# Detalle de Unidad — Propiedades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Drawer (panel lateral derecho)
**Se abre desde:** Click en fila de tabla o menú "Ver" en [[PROPIEDADES_UI_lista-unidades]]
**Ruta:** — (no tiene ruta propia)

---

## Qué muestra

Drawer de ancho ~480px con scroll. Tres secciones organizadas en tabs o acordeón.

**Header del Drawer:**
- `full_designation` ("T1 - 302") como título principal
- `StatusBadge` del estado actual
- Botón "Cambiar estado" (solo admin)
- Botón "Editar" (solo admin)
- Botón cerrar (X)

**Sección 1 — Datos físicos:**
- Torre: nombre + código
- Piso: número (0 → "Sótano")
- Tipo: nombre con badge de color
- Área: `valor` m²
- Coeficiente: `valor` (tooltip: "Porcentaje de copropiedad")
- Habitaciones: número o "—"
- Baños: número o "—"
- Parqueadero: "Sí (P-12)" o "No"
- Notas: texto en bloque o "Sin notas"

**Sección 2 — Estado y ocupación:**
- Estado actual: badge grande
- Residentes: contador + botón "Ver residentes" (lleva a feature #4, post-MVP)
- Historial de cambios de estado: timeline vertical con entries de `property_status_log` (últimos 10), cada entry muestra: estado anterior → nuevo estado, fecha relativa, nombre de quien cambió, motivo

**Sección 3 — Documentos:**
- Contador de documentos
- Lista de documentos: nombre, tipo, tamaño, fecha, botón descargar, botón eliminar (solo admin)
- Botón "Subir documento" (solo admin)

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Cambiar estado" | Click | Abre `PROPIEDADES_UI_cambiar-estado` |
| Botón "Editar" | Click | Abre `PROPIEDADES_UI_crear-editar-unidad` (modo edición) |
| Botón "Subir documento" | Click | Abre file picker + formulario de tipo/notas |
| Botón eliminar documento | Click | ConfirmDialog → elimina |
| Timeline entry | — | Solo lectura informativa |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton del drawer (3 bloques de contenido) |
| Error | Mensaje "Error al cargar detalle" + botón "Reintentar" |
| Con datos | Drawer con 3 secciones |
| Sin documentos | Sección documentos con EmptyState: "No hay documentos asociados" |

---

## Elementos condicionales

- Botón "Cambiar estado" — solo admin
- Botón "Editar" — solo admin
- Botón "Subir documento" — solo admin
- Botón "Eliminar documento" — solo admin
- Sección "Residentes" — visible post-MVP (feature #4)
