---
type: spec-tecnico
status: active
module: web
feature: presupuesto
tags: [web, presupuesto, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Presupuesto y fondo de reserva

> Panorama global: [[00-shared/features/PRESUPUESTO]]
> Endpoints: [[01-api/endpoints/PRESUPUESTO]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Presupuesto del año | Página | `/presupuesto` | [[02-web/features/presupuesto/PRESUPUESTO_UI_anual]] |
| Crear / editar presupuesto | Modal | — | [[02-web/features/presupuesto/PRESUPUESTO_UI_crear-editar]] |
| Detalle de categoría | Drawer | — | [[02-web/features/presupuesto/PRESUPUESTO_UI_detalle-categoria]] |
| Fondo de reserva | Inline | — | [[02-web/features/presupuesto/PRESUPUESTO_UI_fondo-reserva]] |

> Este feature es solo Web (N/A en App).

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/presupuesto` | `PresupuestoPage` | `AdminOnlyRoute` |

---

## Servicios y hooks

| Hook | Endpoint |
|---|---|
| `usePresupuesto` | `GET /budgets?year=YYYY` |
| `useCreatePresupuesto` | `POST /budgets` |
| `useUpdatePresupuesto` | `PATCH /budgets/{id}` |
| `useCategoriaDetalle` | `GET /budgets/{year}/categories/{id}` |
| `useFondoReserva` | `GET /reserve-fund` |

---

## Tipos TypeScript

```ts
export interface Presupuesto {
  id: string;
  year: number;
  estado: 'borrador' | 'aprobado' | 'en_ejecucion' | 'cerrado';
  total_ingresos: number;
  total_egresos: number;
  categorias_ingreso: CategoriaPresupuesto[];
  categorias_egreso: CategoriaPresupuesto[];
}

export interface CategoriaPresupuesto {
  id: string;
  nombre: string;
  monto_proyectado: number;
  monto_ejecutado: number;
  porcentaje_ejecucion: number;
}
```

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /budgets` | [[01-api/endpoints/PRESUPUESTO]] §1 |
| `POST /budgets` | [[01-api/endpoints/PRESUPUESTO]] §2 |
| `GET /reserve-fund` | [[01-api/endpoints/PRESUPUESTO]] §4 |
