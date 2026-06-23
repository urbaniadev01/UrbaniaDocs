---
type: spec-tecnico
status: active
module: web
feature: pqrs
tags: [web, pqrs, spec]
updated: 2026-06-22
---

# Spec Técnico Web: PQRS

> Panorama global: [[00-shared/features/PQRS]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de PQRS | Página | `/pqrs` | [[02-web/features/pqrs/PQRS_UI_lista]] |
| Detalle de PQRS | Página | `/pqrs/:id` | [[02-web/features/pqrs/PQRS_UI_detalle]] |
| Cambiar estado | Modal | — | [[02-web/features/pqrs/PQRS_UI_cambiar-estado]] |
| Asignar responsable | Modal | — | [[02-web/features/pqrs/PQRS_UI_asignar]] |
| Crear PQRS (admin) | Modal | — | [[02-web/features/pqrs/PQRS_UI_crear]] |
| Estadísticas | Inline | — | [[02-web/features/pqrs/PQRS_UI_estadisticas]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/pqrs` | `PqrsPage` | `AdminOnlyRoute` |
| `/pqrs/:id` | `PqrsDetallePage` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `usePqrsList` | `GET /pqrs` |
| `usePqrs` | `GET /pqrs/{id}` |
| `useCreatePqrs` | `POST /pqrs` |
| `useAddComentario` | `POST /pqrs/{id}/comments` |
| `useCambiarEstado` | `PATCH /pqrs/{id}/status` |
| `useAsignarPqrs` | `PATCH /pqrs/{id}/assign` |

---

## Tipos TypeScript

```ts
export type TipoPqrs = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
export type EstadoPqrs = 'abierta' | 'en_revision' | 'respondida' | 'cerrada' | 'rechazada';

export interface Pqrs {
  id: string;
  numero_radicado: string;
  tipo: TipoPqrs;
  estado: EstadoPqrs;
  titulo: string;
  descripcion: string;
  unidad: { id: string; torre: string; numero: string; };
  residente: { id: string; nombre: string; };
  asignado_a: { id: string; nombre: string; } | null;
  comentarios: Comentario[];
  adjuntos: Adjunto[];
  created_at: string;
  updated_at: string;
}

export interface Comentario {
  id: string;
  autor: string;
  rol: 'residente' | 'admin';
  cuerpo: string;
  created_at: string;
}
```
