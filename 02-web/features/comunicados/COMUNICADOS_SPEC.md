---
type: spec-tecnico
status: active
module: web
feature: comunicados
tags: [web, comunicados, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Comunicados y circulares

> Panorama global: [[00-shared/features/COMUNICADOS]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de comunicados | Página | `/comunicados` | [[02-web/features/comunicados/COMUNICADOS_UI_lista]] |
| Crear / editar | Modal | — | [[02-web/features/comunicados/COMUNICADOS_UI_crear-editar]] |
| Detalle | Drawer | — | [[02-web/features/comunicados/COMUNICADOS_UI_detalle]] |
| Estadísticas de lectura | Inline | — | [[02-web/features/comunicados/COMUNICADOS_UI_estadisticas]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/comunicados` | `ComunicadosPage` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useComunicados` | `GET /announcements` |
| `useComunicado` | `GET /announcements/{id}` |
| `useCreateComunicado` | `POST /announcements` |
| `usePublicarComunicado` | `POST /announcements/{id}/publish` |
| `useEliminarComunicado` | `DELETE /announcements/{id}` |
| `useEstadisticasLectura` | `GET /announcements/{id}/reads` |

---

## Tipos TypeScript

```ts
export type EstadoComunicado = 'borrador' | 'publicado' | 'eliminado';
export type DestinatariosComunicado = 'todos' | 'por_torre' | 'por_unidad';

export interface Comunicado {
  id: string;
  titulo: string;
  cuerpo: string;
  estado: EstadoComunicado;
  destinatarios: DestinatariosComunicado;
  torres?: string[];
  unidades?: string[];
  adjuntos: { url: string; nombre: string; tipo: 'imagen' | 'pdf'; }[];
  total_destinatarios: number;
  total_leidos: number;
  published_at: string | null;
  created_at: string;
}
```
