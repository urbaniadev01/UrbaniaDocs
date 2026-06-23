---
type: spec-tecnico
status: active
module: web
feature: propiedades
tags: [web, propiedades, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Propiedades y unidades

> Panorama global: [[00-shared/features/PROPIEDADES]]
> Endpoints: [[01-api/endpoints/PROPIEDADES]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de propiedades | Página | `/propiedades` | [[02-web/features/propiedades/PROPIEDADES_UI_lista]] |
| Detalle de unidad | Drawer | — | [[02-web/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |
| Crear / editar unidad | Modal | — | [[02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad]] |
| Cambiar estado | Modal | — | [[02-web/features/propiedades/PROPIEDADES_UI_cambiar-estado]] |
| Eliminar unidad | Modal | — | [[02-web/features/propiedades/PROPIEDADES_UI_eliminar-unidad]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/propiedades` | `PropiedadesPage` | `AdminOnlyRoute` |

> Registrar en `src/app/router.tsx` con `lazy()`. Agregar al `Sidebar` como ruta de primer nivel.

---

## Componentes

### Reutilizar existentes
| Componente | Notas de uso |
|---|---|
| `DataTable` | Listado de unidades con paginación server-side |
| `StatusBadge` | Estado de la unidad (ocupada / vacía / en venta) |
| `ConfirmDialog` | Confirmación de eliminación |
| `EmptyState` | Estado vacío cuando no hay unidades registradas |

### Crear nuevos
| Componente | Ubicación | Responsabilidad | Props principales |
|---|---|---|---|
| `UnidadForm` | `features/propiedades/components/` | Formulario crear/editar unidad con validación Zod | `onSubmit, onCancel, initialValues?` |
| `UnidadDrawer` | `features/propiedades/components/` | Panel de detalle de unidad | `unidadId, onClose` |
| `CambiarEstadoModal` | `features/propiedades/components/` | Modal para cambiar estado | `unidadId, estadoActual, onSuccess` |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `usePropiedades` | `propiedades.service.list()` | `GET /properties` |
| `usePropiedad` | `propiedades.service.getById()` | `GET /properties/{id}` |
| `useCreatePropiedad` | `propiedades.service.create()` | `POST /properties` |
| `useUpdatePropiedad` | `propiedades.service.update()` | `PATCH /properties/{id}` |
| `useDeletePropiedad` | `propiedades.service.delete()` | `DELETE /properties/{id}` |
| `useChangeEstado` | `propiedades.service.changeStatus()` | `PATCH /properties/{id}/status` |

> Servicio en `src/features/propiedades/api/propiedades.service.ts`.
> Hooks en `src/features/propiedades/hooks/`.

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Lista de unidades | 30s | Al crear, editar, eliminar o cambiar estado |
| Detalle de unidad | 60s | Al editar o cambiar estado de esa unidad |

> Query keys en `QUERY_KEYS.PROPIEDADES`. Ver [[WEB_API_CLIENT]].

---

## Tipos TypeScript

`src/features/propiedades/types/propiedades.types.ts`

```ts
export type EstadoUnidad = 'ocupada' | 'vacia' | 'en_venta';
export type TipoUnidad = 'apartamento' | 'local' | 'parqueadero' | 'deposito';

export interface Unidad {
  id: string;
  torre: string;
  piso: number;
  numero: string;
  area_m2: number;
  coeficiente: number;        // ej: 0.0125 (1.25%)
  tipo: TipoUnidad;
  estado: EstadoUnidad;
  residente_actual: ResidenteBasico | null;
  created_at: string;
  updated_at: string;
}

export interface ResidenteBasico {
  id: string;
  nombre: string;
  tipo: 'propietario' | 'arrendatario';
}

export interface CreateUnidadPayload {
  torre: string;
  piso: number;
  numero: string;
  area_m2: number;
  coeficiente: number;
  tipo: TipoUnidad;
}

export type UpdateUnidadPayload = Partial<CreateUnidadPayload>;
```

---

## Cálculos y validaciones frontend

- El coeficiente debe ser un número entre 0.0001 y 1.0000 (4 decimales)
- Advertencia visual si la suma de coeficientes del conjunto no es 1.0000 (tolerancia ±0.0001)
- El número de unidad es alfanumérico (ej: "101A", "PH2")

---

## Permisos

| Ruta / acción | Rol | Control |
|---|---|---|
| Ver lista | admin | `AdminOnlyRoute` |
| Crear / editar / eliminar / cambiar estado | admin | Botones visibles solo para admin |

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /properties` | [[01-api/endpoints/PROPIEDADES]] §1 |
| `POST /properties` | [[01-api/endpoints/PROPIEDADES]] §2 |
| `GET /properties/{id}` | [[01-api/endpoints/PROPIEDADES]] §3 |
| `PATCH /properties/{id}` | [[01-api/endpoints/PROPIEDADES]] §4 |
| `DELETE /properties/{id}` | [[01-api/endpoints/PROPIEDADES]] §5 |
| `PATCH /properties/{id}/status` | [[01-api/endpoints/PROPIEDADES]] §6 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-propiedades.test.ts` | Listado, paginación, filtros |
| Unit | `hooks/use-create-propiedad.test.ts` | Crear con éxito, validación, error duplicado |
| Unit | `hooks/use-delete-propiedad.test.ts` | Eliminación, error UNIT_HAS_RESIDENT |
| Component | `components/UnidadForm.test.tsx` | Render, validación de coeficiente, submit |
| E2E | `tests/e2e/propiedades.spec.ts` | Flujo completo: ver lista → abrir detalle → crear → editar → cambiar estado |

> Ver [[WEB_TESTING]].
