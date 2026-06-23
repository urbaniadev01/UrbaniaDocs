---
type: spec-tecnico
status: active
module: web
feature: asambleas
tags: [web, asambleas, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Asambleas

> Panorama global: [[00-shared/features/ASAMBLEAS]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de asambleas | Página | `/asambleas` | [[02-web/features/asambleas/ASAMBLEAS_UI_lista]] |
| Crear / editar | Modal | — | [[02-web/features/asambleas/ASAMBLEAS_UI_crear-editar]] |
| Detalle (gestión) | Página | `/asambleas/:id` | [[02-web/features/asambleas/ASAMBLEAS_UI_detalle]] |
| Registro de asistencia | Inline | — | [[02-web/features/asambleas/ASAMBLEAS_UI_asistencia]] |
| Puntos del orden del día | Inline | — | [[02-web/features/asambleas/ASAMBLEAS_UI_puntos]] |
| Publicar acta | Modal | — | [[02-web/features/asambleas/ASAMBLEAS_UI_acta]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/asambleas` | `AdminOnlyRoute` |
| `/asambleas/:id` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useAsambleas` | `GET /assemblies` |
| `useAsamblea` | `GET /assemblies/{id}` |
| `useCreateAsamblea` | `POST /assemblies` |
| `useRegistrarAsistencia` | `POST /assemblies/{id}/attendance` |
| `useUpdatePunto` | `PATCH /assemblies/{id}/agenda-items/{item_id}` |
| `usePublicarActa` | `POST /assemblies/{id}/minutes` |

---

## Tipos TypeScript

```ts
export type EstadoAsamblea = 'convocada' | 'en_curso' | 'finalizada' | 'cancelada';

export interface Asamblea {
  id: string;
  tipo: 'ordinaria' | 'extraordinaria';
  estado: EstadoAsamblea;
  fecha: string;
  hora: string;
  lugar: string;
  descripcion: string;
  quorum_requerido: number;    // coeficiente mínimo
  quorum_alcanzado: number;    // calculado en tiempo real
  asistentes: Asistente[];
  agenda: AgendaItem[];
  acta_url: string | null;
  created_at: string;
}

export interface AgendaItem {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string;
  requiere_votacion: boolean;
  votacion_id: string | null;  // link a VOTACIONES
  estado: 'pendiente' | 'en_discusion' | 'aprobado' | 'rechazado' | 'diferido';
}
```
