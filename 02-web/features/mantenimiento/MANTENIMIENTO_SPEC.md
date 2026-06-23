---
type: spec-tecnico
status: active
module: web
feature: mantenimiento
tags: [web, mantenimiento, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Mantenimiento preventivo

> Panorama global: [[00-shared/features/MANTENIMIENTO]]

> Este feature es solo Web (App N/A).

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Catálogo de activos | Página | `/mantenimiento/activos` | [[02-web/features/mantenimiento/MANTENIMIENTO_UI_activos]] |
| Crear / editar activo | Modal | — | [[02-web/features/mantenimiento/MANTENIMIENTO_UI_crear-activo]] |
| Plan de mantenimiento | Página | `/mantenimiento/plan` | [[02-web/features/mantenimiento/MANTENIMIENTO_UI_plan]] |
| Crear / editar tarea | Modal | — | [[02-web/features/mantenimiento/MANTENIMIENTO_UI_crear-tarea]] |
| Historial | Página | `/mantenimiento/historial` | [[02-web/features/mantenimiento/MANTENIMIENTO_UI_historial]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/mantenimiento/*` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useActivos` | `GET /assets` |
| `useCreateActivo` | `POST /assets` |
| `usePlanMantenimiento` | `GET /maintenance-plans` |
| `useCreateTarea` | `POST /maintenance-plans` |
| `useHistorialMantenimiento` | `GET /maintenance-logs` |
| `useRegistrarMantenimiento` | `POST /maintenance-logs` |

---

## Tipos TypeScript

```ts
export interface Activo {
  id: string;
  nombre: string;
  categoria: string;
  marca: string | null;
  modelo: string | null;
  numero_serie: string | null;
  ubicacion: string;
  fecha_instalacion: string | null;
  vida_util_anos: number | null;
  activo: boolean;
}

export interface TareaMantenimiento {
  id: string;
  activo_id: string;
  descripcion: string;
  frecuencia_dias: number;
  proveedor_id: string | null;
  ultima_fecha: string | null;
  proxima_fecha: string;
  estado: 'programado' | 'en_ejecucion' | 'completado' | 'pospuesto';
}
```
