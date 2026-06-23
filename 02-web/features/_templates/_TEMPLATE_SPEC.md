---
type: template
status: active
module: web
tags: [web, template, features, spec]
updated: 2026-06-22
---

# Spec Técnico Web: <Nombre>

> Panorama global: [[00-shared/features/<NOMBRE>]]
> Endpoints: [[01-api/endpoints/<FEATURE>]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

> Una fila por cada archivo `_UI_<pantalla>.md` de este feature.

| Pantalla | Tipo | Doc de diseño |
|---|---|---|
| <Nombre pantalla> | Página / Modal / Drawer / Sheet / Inline | [[02-web/features/<NOMBRE>_UI_<pantalla>]] |

---

## Rutas

| Ruta | Componente página | Guard |
|---|---|---|
| `/<feature>` | `<Feature>Page` | `AdminOnlyRoute` |
| `/<feature>/:id` | `<Feature>DetailPage` | `AdminOnlyRoute` |

> Registrar en `src/app/router.tsx` con `lazy()`. Agregar al `Sidebar` si es ruta de primer nivel.

---

## Componentes

### Reutilizar existentes
| Componente | Notas de uso |
|---|---|
| `DataTable` | Listados con paginación server-side — [[WEB_COMPONENTS]] §4 |
| `StatusBadge` | Estados del recurso — [[WEB_COMPONENTS]] §5 |
| `ConfirmDialog` | Confirmaciones destructivas — [[WEB_COMPONENTS]] §6 |
| `EmptyState` | Estado vacío de listas — [[WEB_COMPONENTS]] §7 |

### Crear nuevos
| Componente | Ubicación | Responsabilidad | Props principales |
|---|---|---|---|
| `<Feature>Form` | `features/<feature>/components/` | Formulario crear/editar | `onSubmit, onCancel, initialValues?` |

### Modificar existentes
| Componente | Qué cambia | Por qué |
|---|---|---|
| — | — | — |

> Si un componente nuevo lo necesita más de un feature → mover a `src/components/shared/` y documentar en [[WEB_COMPONENTS]].

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `use<Feature>List` | `<feature>.service.list()` | `GET /<feature>` |
| `use<Feature>` | `<feature>.service.getById()` | `GET /<feature>/:id` |
| `useCreate<Feature>` | `<feature>.service.create()` | `POST /<feature>` |
| `useUpdate<Feature>` | `<feature>.service.update()` | `PATCH /<feature>/:id` |
| `useDelete<Feature>` | `<feature>.service.delete()` | `DELETE /<feature>/:id` |

> Servicio en `src/features/<feature>/api/<feature>.service.ts`.
> Hooks en `src/features/<feature>/hooks/use-<feature>.ts`.
> Ver [[WEB_API_CLIENT]] para patrón, query keys y staleTime.

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Lista | 30s | Al crear, editar o eliminar |
| Detalle | 60s | Al editar o eliminar ese ítem |

---

## Tipos TypeScript

`src/features/<feature>/types/<feature>.types.ts`

```ts
export interface <Feature> {
  id: string;
  // campos del recurso
  created_at: string;
  updated_at: string;
}

export interface Create<Feature>Payload {
  // campos para POST
}

export interface Update<Feature>Payload {
  // campos para PATCH
}
```

---

## Cálculos y validaciones frontend

- `<descripción>`

> El server siempre revalida. Los cálculos frontend son solo para UX (preview, validación temprana).

---

## Permisos

| Ruta / acción | Rol | Control |
|---|---|---|
| Ver lista | admin | `AdminOnlyRoute` |
| Crear / editar / eliminar | admin | Verificar antes de mostrar el control |

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /<feature>` | [[01-api/API_CONTRACT]] §N | [[01-api/endpoints/<FEATURE>]] §1 |
| `POST /<feature>` | [[01-api/API_CONTRACT]] §N | [[01-api/endpoints/<FEATURE>]] §2 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-<feature>.test.ts` | Queries y mutaciones con MSW |
| Component | `components/<Feature>Form.test.tsx` | Render, validación, submit |
| E2E | `tests/e2e/<feature>.spec.ts` | Flujo completo |

> Ver [[WEB_TESTING]].
