---
type: spec-tecnico
status: active
module: web
feature: residentes
tags: [web, residentes, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Residentes y propietarios

> Panorama global: [[00-shared/features/RESIDENTES]]
> Endpoints: [[01-api/endpoints/RESIDENTES]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de residentes | Página | `/residentes` | [[02-web/features/residentes/RESIDENTES_UI_lista]] |
| Perfil de residente | Página | `/residentes/:id` | [[02-web/features/residentes/RESIDENTES_UI_perfil]] |
| Crear residente | Modal | — | [[02-web/features/residentes/RESIDENTES_UI_crear]] |
| Editar residente | Sheet | — | [[02-web/features/residentes/RESIDENTES_UI_editar]] |
| Cambiar unidad | Modal | — | [[02-web/features/residentes/RESIDENTES_UI_cambiar-unidad]] |
| Desactivar | Modal | — | [[02-web/features/residentes/RESIDENTES_UI_desactivar]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/residentes` | `ResidentesPage` | `AdminOnlyRoute` |
| `/residentes/:id` | `ResidentePerfilPage` | `AdminOnlyRoute` |

---

## Componentes

### Crear nuevos
| Componente | Ubicación | Responsabilidad |
|---|---|---|
| `ResidenteForm` | `features/residentes/components/` | Formulario crear/editar con Zod |
| `ResidenteDrawer` | `features/residentes/components/` | Sheet de edición completa |
| `CambiarUnidadModal` | `features/residentes/components/` | Selector de unidad disponible |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `useResidentes` | `residentes.service.list()` | `GET /residents` |
| `useResidente` | `residentes.service.getById()` | `GET /residents/{id}` |
| `useCreateResidente` | `residentes.service.create()` | `POST /residents` |
| `useUpdateResidente` | `residentes.service.update()` | `PATCH /residents/{id}` |
| `useCambiarUnidad` | `residentes.service.changeUnit()` | `PATCH /residents/{id}/unit` |
| `useDesactivarResidente` | `residentes.service.deactivate()` | `PATCH /residents/{id}/status` |

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Lista de residentes | 30s | Al crear, editar, cambiar unidad o desactivar |
| Perfil de residente | 60s | Al editar o cambiar unidad de ese residente |

---

## Tipos TypeScript

```ts
export type TipoResidente = 'propietario' | 'arrendatario' | 'familiar';
export type EstadoResidente = 'activo' | 'inactivo' | 'suspendido';

export interface Residente {
  id: string;
  nombre: string;
  tipo_documento: 'cedula' | 'pasaporte' | 'nit';
  numero_documento: string;
  email: string;
  telefono: string | null;
  tipo: TipoResidente;
  estado: EstadoResidente;
  unidad_actual: UnidadBasica | null;
  fecha_ingreso: string;
  avatar_url: string | null;
  created_at: string;
}

export interface UnidadBasica {
  id: string;
  torre: string;
  numero: string;
}
```

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /residents` | [[01-api/endpoints/RESIDENTES]] §1 |
| `POST /residents` | [[01-api/endpoints/RESIDENTES]] §2 |
| `GET /residents/{id}` | [[01-api/endpoints/RESIDENTES]] §3 |
| `PATCH /residents/{id}` | [[01-api/endpoints/RESIDENTES]] §4 |
| `PATCH /residents/{id}/unit` | [[01-api/endpoints/RESIDENTES]] §5 |
| `PATCH /residents/{id}/status` | [[01-api/endpoints/RESIDENTES]] §6 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-residentes.test.ts` | Listado, filtros por tipo y estado |
| Unit | `hooks/use-create-residente.test.ts` | Crear, error DUPLICATE_DOCUMENT |
| Component | `components/ResidenteForm.test.tsx` | Validación, submit, error de servidor |
| E2E | `tests/e2e/residentes.spec.ts` | Crear → ver perfil → editar → cambiar unidad → desactivar |
