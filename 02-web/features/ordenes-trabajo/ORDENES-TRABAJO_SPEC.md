---
type: spec-tecnico
status: active
module: web
feature: ordenes-trabajo
tags: [web, ordenes-trabajo, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Órdenes de trabajo

> Panorama global: [[00-shared/features/ORDENES-TRABAJO]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de órdenes | Página | `/ordenes-trabajo` | [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_lista]] |
| Crear orden | Modal | — | [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_crear]] |
| Detalle de orden | Página | `/ordenes-trabajo/:id` | [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_detalle]] |
| Cambiar estado | Modal | — | [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_cambiar-estado]] |
| Asignar proveedor | Modal | — | [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_asignar]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/ordenes-trabajo` | `AdminOnlyRoute` |
| `/ordenes-trabajo/:id` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useOrdenesTrabajo` | `GET /work-orders` |
| `useOrdenTrabajo` | `GET /work-orders/{id}` |
| `useCreateOrden` | `POST /work-orders` |
| `useCambiarEstadoOrden` | `PATCH /work-orders/{id}/status` |
| `useAsignarOrden` | `PATCH /work-orders/{id}/assign` |
| `useSubirEvidencia` | `POST /work-orders/{id}/evidence` |

---

## Tipos TypeScript

```ts
export type EstadoOrden = 'abierta' | 'asignada' | 'en_ejecucion' | 'cerrada' | 'cancelada';

export interface OrdenTrabajo {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  estado: EstadoOrden;
  area_afectada: string;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  proveedor: { id: string; nombre: string; } | null;
  fecha_limite: string | null;
  costo: number | null;
  evidencias: { url: string; descripcion: string; }[];
  pqrs_id: string | null;    // si viene de una PQRS
  created_at: string;
  updated_at: string;
}
```
