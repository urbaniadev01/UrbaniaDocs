---
type: spec-tecnico
status: active
module: web
feature: votaciones
tags: [web, votaciones, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Votaciones y encuestas

> Panorama global: [[00-shared/features/VOTACIONES]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de votaciones | Página | `/votaciones` | [[02-web/features/votaciones/VOTACIONES_UI_lista]] |
| Crear votación | Modal | — | [[02-web/features/votaciones/VOTACIONES_UI_crear]] |
| Detalle / resultados | Página | `/votaciones/:id` | [[02-web/features/votaciones/VOTACIONES_UI_detalle]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/votaciones` | `AdminOnlyRoute` |
| `/votaciones/:id` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useVotaciones` | `GET /votes` |
| `useVotacion` | `GET /votes/{id}` |
| `useCreateVotacion` | `POST /votes` |
| `useCerrarVotacion` | `POST /votes/{id}/close` |

---

## Tipos TypeScript

```ts
export type TipoVotacion = 'formal' | 'encuesta';
export type EstadoVotacion = 'borrador' | 'activa' | 'cerrada';

export interface Votacion {
  id: string;
  tipo: TipoVotacion;
  estado: EstadoVotacion;
  pregunta: string;
  opciones: OpcionVoto[];
  asamblea_id: string | null;
  fecha_limite: string | null;
  total_votantes: number;
  coeficiente_votado: number;
  created_at: string;
}

export interface OpcionVoto {
  id: string;
  texto: string;
  votos: number;
  coeficiente: number;
  porcentaje: number;
}
```
