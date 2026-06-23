---
type: spec-tecnico
status: active
module: web
feature: visitantes
tags: [web, visitantes, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Control de visitantes

> Panorama global: [[00-shared/features/VISITANTES]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Historial de visitantes | Página | `/visitantes` | [[02-web/features/visitantes/VISITANTES_UI_historial]] |
| Detalle de visita | Drawer | — | [[02-web/features/visitantes/VISITANTES_UI_detalle]] |
| Crear visita (portero/admin) | Modal | — | [[02-web/features/visitantes/VISITANTES_UI_crear]] |
| Preautorizaciones | Página | `/visitantes/preautorizaciones` | [[02-web/features/visitantes/VISITANTES_UI_preautorizaciones]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/visitantes` | `AdminOnlyRoute` |
| `/visitantes/preautorizaciones` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useVisitantes` | `GET /visitors` |
| `useVisitante` | `GET /visitors/{id}` |
| `useRegistrarIngreso` | `POST /visitors` |
| `useRegistrarSalida` | `PATCH /visitors/{id}/exit` |
| `usePreautorizaciones` | `GET /visitors/preauth` |

---

## Tipos TypeScript

```ts
export type EstadoVisita = 'preautorizada' | 'ingreso' | 'salida' | 'expirada';

export interface Visita {
  id: string;
  estado: EstadoVisita;
  nombre_visitante: string;
  cedula: string | null;
  unidad: { id: string; torre: string; numero: string; };
  residente: { nombre: string; };
  motivo: string | null;
  hora_ingreso: string | null;
  hora_salida: string | null;
  autorizado_por: string;
  qr_token: string | null;
  created_at: string;
}
```
