---
type: spec
status: active
module: web
tags: [web, spec, directorio, contacts]
updated: 2026-06-27
---

# Spec Técnico Web: Directorio (Residentes y Propietarios)

> Panorama global: [[00-shared/features/DIRECTORIO]]
> Endpoints: [[01-api/endpoints/CONTACTS]], [[01-api/endpoints/OCCUPANT_CATALOGS]], [[01-api/endpoints/PROPERTY_OCCUPANTS]]
> Componentes: [[WEB_COMPONENTS]]

**Estado:** Diseñado

---

## Pantallas del feature

| Pantalla | Tipo | Doc de diseño |
|---|---|---|
| Directorio general | Página | [[02-web/features/directorio/DIRECTORIO_UI_DIRECTORIO]] |
| Detalle de contacto | Drawer | [[02-web/features/directorio/DIRECTORIO_UI_DETALLE]] |
| Crear/editar contacto | Modal | [[02-web/features/directorio/DIRECTORIO_UI_FORM]] |
| Vincular contacto a unidad | Modal | [[02-web/features/directorio/DIRECTORIO_UI_VINCULAR]] |
| Vista por unidad | Página | [[02-web/features/directorio/DIRECTORIO_UI_UNIDAD]] |
| Historial de ocupantes | Drawer | [[02-web/features/directorio/DIRECTORIO_UI_HISTORIAL]] |

---

## Rutas

| Ruta | Componente página | Guard |
|---|---|---|
| `/directorio` | `DirectorioPage` | `AdminOnlyRoute` |
| `/directorio/:id` | `ContactoDetailPage` | `AdminOnlyRoute` |
| `/unidades/:propertyId/ocupantes` | `UnitOccupantsPage` | `AdminOnlyRoute` |

> Registrar en `src/app/router.tsx` con `lazy()`. Agregar al `Sidebar` si es ruta de primer nivel.

---

## Componentes

### Reutilizar existentes
| Componente | Notas de uso |
|---|---|
| `DataTable` | Listados con paginación server-side — [[WEB_COMPONENTS]] §4 |
| `ConfirmDialog` | Confirmaciones destructivas — [[WEB_COMPONENTS]] §6 |
| `EmptyState` | Estado vacío de listas — [[WEB_COMPONENTS]] §7 |
| `StatusBadge` | Estados (activo/inactivo del vínculo) — [[WEB_COMPONENTS]] §5 |
| `SearchInput` | Búsqueda de contactos — [[WEB_COMPONENTS]] |
| `FilterDropdown` | Filtros por tipo de ocupante — [[WEB_COMPONENTS]] |

### Crear nuevos
| Componente | Ubicación | Responsabilidad | Props principales |
|---|---|---|---|
| `ContactForm` | `features/directorio/components/` | Modal con formulario crear/editar contacto | `onSubmit, onCancel, initialValues?` |
| `ContactTable` | `features/directorio/components/` | Tabla con filtros del directorio | `data, onRowClick, filters` |
| `OccupantLinkForm` | `features/directorio/components/` | Modal para vincular contacto a unidad | `onSubmit, onCancel, propertyId, contactId?` |
| `UnitOccupantList` | `features/directorio/components/` | Lista de ocupantes por unidad | `propertyId, occupants` |
| `OccupantHistory` | `features/directorio/components/` | Timeline de ocupación | `propertyId, history` |

### Modificar existentes
| Componente | Qué cambia | Por qué |
|---|---|---|
| — | — | — |

> Si un componente nuevo lo necesita más de un feature → mover a `src/components/shared/` y documentar en [[WEB_COMPONENTS]].

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `useContactList` | `contacts.service.list()` | `GET /contacts` |
| `useContact` | `contacts.service.getById()` | `GET /contacts/{id}` |
| `useCreateContact` | `contacts.service.create()` | `POST /contacts` |
| `useUpdateContact` | `contacts.service.update()` | `PATCH /contacts/{id}` |
| `useDeleteContact` | `contacts.service.delete()` | `DELETE /contacts/{id}` |
| `useUnitOccupants` | `contacts.service.listByUnit()` | `GET /properties/{propertyId}/occupants` |
| `useLinkContactToUnit` | `contacts.service.linkToUnit()` | `POST /properties/{propertyId}/occupants` |
| `useUpdateOccupant` | `contacts.service.updateOccupant()` | `PATCH /property-occupants/{id}` |
| `useUnlinkOccupant` | `contacts.service.unlinkOccupant()` | `DELETE /property-occupants/{id}` |

> Servicio en `src/features/directorio/api/contacts.service.ts`.
> Hooks en `src/features/directorio/hooks/use-<nombre>.ts`.
> Ver [[WEB_API_CLIENT]] para patrón, query keys y staleTime.

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Contact list | 30s | Al crear, editar o eliminar contacto o vínculo |
| Contact detail | 60s | Al editar o eliminar ese contacto |
| Unit occupants | 30s | Al vincular, actualizar o eliminar ocupante |
| Occupant types | 5min | Rara vez cambian (catálogo) |

---

## Tipos TypeScript

`src/features/directorio/types/directorio.types.ts`

```ts
export interface Contact {
  id: string;
  full_name: string;
  document_type: string;
  document_number: string;
  email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OccupantType {
  id: string;
  code: string;
  name: string;
  sort_order: number;
}

export interface PropertyOccupant {
  id: string;
  property_id: string;
  contact_id: string;
  occupant_type_id: string;
  occupant_type?: OccupantType;
  contact?: Contact;
  is_primary: boolean;
  move_in_date?: string;
  move_out_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateContactPayload {
  full_name: string;
  document_type: string;
  document_number: string;
  email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
}

export interface UpdateContactPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
}

export interface LinkOccupantPayload {
  contact_id: string;
  occupant_type_id: string;
  is_primary?: boolean;
  move_in_date?: string;
  move_out_date?: string;
}

export interface UpdateOccupantPayload {
  occupant_type_id?: string;
  is_primary?: boolean;
  move_in_date?: string;
  move_out_date?: string;
  is_active?: boolean;
}
```

---

## Cálculos y validaciones frontend

- `document_type` debe ser uno de: CC, NIT, CE, Pasaporte, Otro — validación con lista fija
- `document_number` requerido, mínimo 5 caracteres
- `email` con formato email válido si se envía
- `phone` con formato telefónico colombiano si se envía
- `move_out_date` debe ser >= `move_in_date` si ambas se envían
- Al marcar `is_primary = TRUE`, desmarcar los demás primaries del mismo `property_id` + `occupant_type_id` (optimista en frontend, el server revalida)

> El server siempre revalida. Los cálculos frontend son solo para UX (preview, validación temprana).

---

## Permisos

| Ruta / acción | Rol | Control |
|---|---|---|
| Ver listado de contactos | admin | `AdminOnlyRoute` |
| Ver detalle de contacto | admin | `AdminOnlyRoute` |
| Ver ocupantes por unidad | admin | `AdminOnlyRoute` |
| Crear / editar / eliminar contacto | admin | Verificar antes de mostrar el control |
| Vincular / desvincular ocupante | admin | Verificar antes de mostrar el control |

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /contacts` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] §1 |
| `POST /contacts` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] §2 |
| `GET /contacts/{id}` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] §3 |
| `PATCH /contacts/{id}` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] §4 |
| `DELETE /contacts/{id}` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] §5 |
| `GET /properties/{propertyId}/occupants` | [[01-api/API_CONTRACT]] §Ocupantes | [[01-api/endpoints/PROPERTY_OCCUPANTS]] §1 |
| `POST /properties/{propertyId}/occupants` | [[01-api/API_CONTRACT]] §Ocupantes | [[01-api/endpoints/PROPERTY_OCCUPANTS]] §2 |
| `PATCH /property-occupants/{id}` | [[01-api/API_CONTRACT]] §Ocupantes | [[01-api/endpoints/PROPERTY_OCCUPANTS]] §3 |
| `DELETE /property-occupants/{id}` | [[01-api/API_CONTRACT]] §Ocupantes | [[01-api/endpoints/PROPERTY_OCCUPANTS]] §4 |
| `GET /occupant-types` | [[01-api/API_CONTRACT]] §Catálogos | [[01-api/endpoints/OCCUPANT_CATALOGS]] |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-contact-list.test.ts` | Query de listado con MSW |
| Unit | `hooks/use-contact.test.ts` | Query de detalle con MSW |
| Unit | `hooks/use-create-contact.test.ts` | Mutación create con MSW |
| Unit | `hooks/use-unit-occupants.test.ts` | Query de ocupantes con MSW |
| Component | `components/ContactForm.test.tsx` | Render, validación, submit |
| Component | `components/ContactTable.test.tsx` | Render con datos y vacío, filtros |
| Component | `components/OccupantLinkForm.test.tsx` | Render, validación, submit |
| E2E | `tests/e2e/directorio.spec.ts` | Flujo completo: crear contacto, vincular a unidad, ver directorio |

> Ver [[WEB_TESTING]].
