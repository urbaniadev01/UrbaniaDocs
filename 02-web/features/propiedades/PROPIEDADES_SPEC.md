---
type: spec-tecnico
status: active
module: web
feature: propiedades
tags: [web, propiedades, spec]
updated: 2026-06-27
---

# Spec Técnico Web: Propiedades y Unidades

> Panorama global: [[00-shared/features/PROPIEDADES]]
> Endpoints: [[01-api/endpoints/PROPIEDADES]], [[01-api/endpoints/TOWERS]], [[01-api/endpoints/PROPERTY_CATALOGS]], [[01-api/endpoints/CONDOMINIUMS]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Dashboard del conjunto | Página | `/dashboard` | — |
| Lista de propiedades | Página | `/properties` | [[02-web/features/propiedades/PROPIEDADES_UI_lista-unidades]] |
| Detalle de unidad | Drawer | (sidebar desde lista) | [[02-web/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |
| Crear / editar unidad | Modal | (desde lista) | [[02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad]] |
| Cambiar estado de unidad | Modal | (desde detalle) | [[02-web/features/propiedades/PROPIEDADES_UI_cambiar-estado]] |
| Gestionar torres | Página | `/properties/towers` | [[02-web/features/propiedades/PROPIEDADES_UI_gestionar-torres]] |
| Gestionar tipos y estados | Página | `/properties/catalogs` | [[02-web/features/propiedades/PROPIEDADES_UI_gestionar-catalogos]] |
| Documentos de unidad | Drawer / Inline | (desde detalle) | [[02-web/features/propiedades/PROPIEDADES_UI_documentos]] |

> Dashboard del conjunto se considera parte del feature de Reportes (#16). Aquí solo se documenta la estructura de propiedades.

---

## Rutas

| Ruta | Componente página | Guard |
|---|---|---|
| `/properties` | `PropertiesListPage` | `AdminOnlyRoute` |
| `/properties/towers` | `TowersPage` | `AdminOnlyRoute` |
| `/properties/catalogs` | `CatalogsPage` | `AdminOnlyRoute` |

> Registrar en `src/app/router.tsx` con `lazy()`. Agregar al `Sidebar` dentro del submenú "Propiedades".

---

## Componentes

### Reutilizar existentes

| Componente | Notas de uso |
|---|---|
| `DataTable` | Listado de unidades con paginación server-side — [[WEB_COMPONENTS]] §4 |
| `StatusBadge` | Estado de la unidad (coloreado por status code) — [[WEB_COMPONENTS]] §5 |
| `ConfirmDialog` | Confirmación de eliminación de unidad/torre — [[WEB_COMPONENTS]] §6 |
| `EmptyState` | Estado vacío de listas — [[WEB_COMPONENTS]] §7 |
| `Drawer` | Detalle de unidad, documentos — [[WEB_COMPONENTS]] §Drawer |
| `Modal` | Formularios crear/editar, cambio de estado — [[WEB_COMPONENTS]] §Modal |
| `SearchInput` | Búsqueda por número de unidad — [[WEB_COMPONENTS]] §Search |

### Crear nuevos

| Componente | Ubicación | Responsabilidad | Props principales |
|---|---|---|---|
| `PropertyFilters` | `features/propiedades/components/` | Barra de filtros (torre, piso, tipo, estado, búsqueda) | `onFilterChange, filters` |
| `PropertyForm` | `features/propiedades/components/` | Formulario crear/editar unidad | `onSubmit, onCancel, initialValues?` |
| `PropertyStatusForm` | `features/propiedades/components/` | Formulario de cambio de estado | `onSubmit, currentStatus, onCancel` |
| `PropertyDetail` | `features/propiedades/components/` | Contenido del drawer de detalle | `propertyId` |
| `TowerForm` | `features/propiedades/components/` | Formulario crear/editar torre | `onSubmit, onCancel, initialValues?` |
| `CatalogForm` | `features/propiedades/components/` | Formulario crear/editar tipo/estado | `onSubmit, onCancel, initialValues?, catalogType` |
| `DocumentList` | `features/propiedades/components/` | Lista de documentos con upload y delete | `propertyId` |
| `CoefficientSummary` | `features/propiedades/components/` | Resumen de validación de coeficientes | `condominiumId` |
| `PropertyMap` | `features/propiedades/components/` | Vista visual de torres y pisos *(post-MVP)* | `condominiumId` |

### Modificar existentes

| Componente | Qué cambia | Por qué |
|---|---|---|
| `Sidebar` | Agregar ítem "Propiedades" con submenú (Torres, Catálogos) | Navegación del nuevo feature |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `useProperties` | `properties.service.list()` | `GET /properties` |
| `useProperty` | `properties.service.getById()` | `GET /properties/{id}` |
| `useCreateProperty` | `properties.service.create()` | `POST /properties` |
| `useUpdateProperty` | `properties.service.update()` | `PATCH /properties/{id}` |
| `useDeleteProperty` | `properties.service.delete()` | `DELETE /properties/{id}` |
| `useChangePropertyStatus` | `properties.service.changeStatus()` | `PATCH /properties/{id}/status` |
| `useStatusLog` | `properties.service.getStatusLog()` | `GET /properties/{id}/status-log` |
| `useCoefficientValidation` | `properties.service.validateCoefficients()` | `GET /condominiums/{id}/coefficient-validation` |
| `useTowers` | `towers.service.list()` | `GET /condominiums/{id}/towers` |
| `useCreateTower` | `towers.service.create()` | `POST /towers` |
| `useUpdateTower` | `towers.service.update()` | `PATCH /towers/{id}` |
| `useDeleteTower` | `towers.service.delete()` | `DELETE /towers/{id}` |
| `usePropertyTypes` | `catalogs.service.getTypes()` | `GET /property-types` |
| `useCreatePropertyType` | `catalogs.service.createType()` | `POST /property-types` |
| `usePropertyStatuses` | `catalogs.service.getStatuses()` | `GET /property-statuses` |
| `useCreatePropertyStatus` | `catalogs.service.createStatus()` | `POST /property-statuses` |
| `usePropertyDocuments` | `properties.service.getDocuments()` | `GET /properties/{id}/documents` |
| `useUploadDocument` | `properties.service.uploadDocument()` | `POST /properties/{id}/documents` |
| `useDeleteDocument` | `properties.service.deleteDocument()` | `DELETE /properties/{id}/documents/{docId}` |

> Servicios en `src/features/propiedades/api/properties.service.ts`, `towers.service.ts`, `catalogs.service.ts`.
> Hooks en `src/features/propiedades/hooks/`.
> Ver [[WEB_API_CLIENT]] para patrón, query keys y staleTime.

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Lista de propiedades | 30s | Al crear, editar, eliminar o cambiar estado de una unidad |
| Detalle de unidad | 60s | Al editar o cambiar estado de esa unidad |
| Status log | 120s | Al cambiar estado de esa unidad |
| Coeficientes | 300s | Al crear, editar o eliminar una unidad |
| Lista de torres | 120s | Al crear, editar o eliminar una torre |
| Catálogos (tipos/estados) | 300s | Al crear, editar o desactivar un catálogo (forzar refetch) |
| Documentos | 60s | Al subir o eliminar un documento |

---

## Tipos TypeScript

`src/features/propiedades/types/propiedades.types.ts`

```ts
// --- Entidades principales ---

export interface Condominium {
  id: string;
  name: string;
  address?: string;
  city?: string;
  department?: string;
  country: string;
  nit?: string;
  phone?: string;
  email?: string;
  legal_representative?: string;
  total_coefficient: string;  // NUMERIC(7,6) → string
  logo_url?: string;
  is_active: boolean;
  stats?: CondominiumStats;
  created_at: string;
  updated_at: string;
}

export interface CondominiumStats {
  total_towers: number;
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupied_percentage?: number;
}

export interface Tower {
  id: string;
  condominium_id: string;
  condominium_name?: string;
  name: string;
  code?: string;
  floor_count: number;
  has_elevator: boolean;
  description?: string;
  sort_order: number;
  stats?: TowerStats;
  created_at: string;
  updated_at: string;
}

export interface TowerStats {
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  occupied_percentage?: number;
}

export interface PropertyType {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  properties_count?: number;
}

export interface PropertyStatus {
  id: string;
  code: string;
  name: string;
  description?: string;
  allows_residents: boolean;
  is_active: boolean;
  sort_order: number;
  properties_count?: number;
}

export interface PropertyDocumentType {
  id: string;
  code: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  documents_count?: number;
}

export interface Property {
  id: string;
  condominium_id: string;
  condominium_name?: string;
  tower: { id: string; name: string; code?: string };
  type: { id: string; code: string; name: string };
  status: { id: string; code: string; name: string };
  floor: number;
  unit_number: string;
  full_designation: string;
  area_m2: string;
  coefficient: string;
  bedrooms?: number;
  bathrooms?: number;
  has_parking: boolean;
  parking_lot?: string;
  notes?: string;
  residents_count: number; // post-MVP: requiere feature #4
  documents_count?: number;
  status_history?: StatusLogEntry[];
  created_at: string;
  updated_at: string;
}

export interface StatusLogEntry {
  id: string;
  from_status?: { id: string; code: string; name: string } | null;
  to_status: { id: string; code: string; name: string };
  changed_by: { id: string; name: string };
  reason: string;
  created_at: string;
}

export interface PropertyDocument {
  id: string;
  document_type: { id: string; code: string; name: string };
  name: string;
  file_url: string;
  file_size_bytes?: number;
  mime_type?: string;
  notes?: string;
  uploaded_by: { id: string; name: string };
  created_at: string;
}

// --- Payloads ---

export interface CreatePropertyPayload {
  condominium_id: string;
  tower_id: string;
  property_type_id: string;
  property_status_id?: string;
  floor: number;
  unit_number: string;
  area_m2: number;
  coefficient: number;
  bedrooms?: number;
  bathrooms?: number;
  has_parking?: boolean;
  parking_lot?: string;
  notes?: string;
}

export interface UpdatePropertyPayload {
  property_type_id?: string;
  tower_id?: string;
  floor?: number;
  unit_number?: string;
  area_m2?: number;
  coefficient?: number;
  bedrooms?: number;
  bathrooms?: number;
  has_parking?: boolean;
  parking_lot?: string;
  notes?: string;
}

export interface ChangeStatusPayload {
  property_status_id: string;
  reason: string;
}

export interface CreateTowerPayload {
  condominium_id: string;
  name: string;
  code?: string;
  floor_count: number;
  has_elevator?: boolean;
  description?: string;
  sort_order?: number;
}

export interface CreateCatalogPayload {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
  allows_residents?: boolean;  // solo para statuses
}

// --- Responses ---

export interface CoefficientValidation {
  condominium_id: string;
  condominium_name: string;
  total_coefficient_expected: string;
  total_coefficient_sum: string;
  difference: string;
  is_balanced: boolean;
  total_units: number;
  units_with_coefficient_zero: number;
  warnings: Array<{ type: string; message: string }>;
  checked_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    trace_id: string;
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
```

---

## Cálculos y validaciones frontend

- **`full_designation`**: el server lo calcula como `"{tower.code} - {unit_number}"`. Si `tower.code` es null, usar `"{tower.name} - {unit_number}"`.
- **Coeficiente en creación**: mostrar advertencia si la suma estimada (coeficiente actual + nuevo) difiere del total esperado. El server retorna `coefficient_changed` warning en meta.
- **Estado con `allows_residents = false`**: antes de mostrar el dropdown de cambio de estado, verificar que la unidad no tenga residentes (el server lo valida igual, pero se evita el error mostrando solo estados permitidos).
- **Piso vs torre**: el selector de piso debe limitarse a `[0, tower.floor_count]`. El piso 0 se muestra como "Sótano".
- **Validación de unicidad**: el server rechaza números de unidad duplicados. El frontend puede mostrar validación inline después del blur llamando a un endpoint de verificación (post-MVP).

---

## Permisos

| Ruta / acción | Rol | Control |
|---|---|---|
| Ver lista de propiedades | admin | `AdminOnlyRoute` en la ruta |
| Ver detalle de unidad | admin | Drawer accesible desde lista |
| Crear / editar / eliminar unidad | admin | Botones y formularios solo visibles para admin |
| Cambiar estado de unidad | admin | Botón en detalle solo visible para admin |
| Gestionar torres | admin | `AdminOnlyRoute` |
| Gestionar catálogos | admin | `AdminOnlyRoute` |
| Subir / eliminar documentos | admin | Botones solo visibles para admin |
| Ver documentos | admin, residente* | Residente ve solo docs de su unidad (post-MVP) |

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /properties` | [[01-api/API_CONTRACT]] §2.1 | [[01-api/endpoints/PROPIEDADES]] §2.1 |
| `POST /properties` | [[01-api/API_CONTRACT]] §2.2 | [[01-api/endpoints/PROPIEDADES]] §2.2 |
| `GET /properties/{id}` | [[01-api/API_CONTRACT]] §2.3 | [[01-api/endpoints/PROPIEDADES]] §2.3 |
| `PATCH /properties/{id}` | [[01-api/API_CONTRACT]] §2.4 | [[01-api/endpoints/PROPIEDADES]] §2.4 |
| `DELETE /properties/{id}` | [[01-api/API_CONTRACT]] §2.5 | [[01-api/endpoints/PROPIEDADES]] §2.5 |
| `PATCH /properties/{id}/status` | [[01-api/API_CONTRACT]] §2.6 | [[01-api/endpoints/PROPIEDADES]] §2.6 |
| `GET /properties/{id}/status-log` | [[01-api/API_CONTRACT]] §2.7 | [[01-api/endpoints/PROPIEDADES]] §2.7 |
| `GET /condominiums/{id}/coefficient-validation` | [[01-api/API_CONTRACT]] §5.4 | [[01-api/endpoints/CONDOMINIUMS]] §5.4 |
| `GET /properties/{id}/documents` | [[01-api/API_CONTRACT]] §2.8 | [[01-api/endpoints/PROPIEDADES]] §2.8 |
| `POST /properties/{id}/documents` | [[01-api/API_CONTRACT]] §2.9 | [[01-api/endpoints/PROPIEDADES]] §2.9 |
| `DELETE /properties/{id}/documents/{docId}` | [[01-api/API_CONTRACT]] §2.10 | [[01-api/endpoints/PROPIEDADES]] §2.10 |
| `GET /condominiums/{id}/towers` | [[01-api/API_CONTRACT]] §3.1 | [[01-api/endpoints/TOWERS]] §3.1 |
| `POST /towers` | [[01-api/API_CONTRACT]] §3.2 | [[01-api/endpoints/TOWERS]] §3.2 |
| `PATCH /towers/{id}` | [[01-api/API_CONTRACT]] §3.4 | [[01-api/endpoints/TOWERS]] §3.4 |
| `DELETE /towers/{id}` | [[01-api/API_CONTRACT]] §3.5 | [[01-api/endpoints/TOWERS]] §3.5 |
| `GET /property-types` | [[01-api/API_CONTRACT]] §4.1 | [[01-api/endpoints/PROPERTY_CATALOGS]] §4.1 |
| `GET /property-statuses` | [[01-api/API_CONTRACT]] §4.5 | [[01-api/endpoints/PROPERTY_CATALOGS]] §4.5 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-properties.test.ts` | Queries y mutaciones con MSW |
| Unit | `hooks/use-towers.test.ts` | CRUD de torres |
| Unit | `hooks/use-catalogs.test.ts` | Catálogos y sus validaciones |
| Component | `components/PropertyForm.test.tsx` | Render, validación, submit |
| Component | `components/PropertyStatusForm.test.tsx` | Cambio de estado con motivo obligatorio |
| Component | `components/PropertyFilters.test.tsx` | Filtros y búsqueda |
| E2E | `tests/e2e/properties.cy.ts` | Flujo completo: crear torre → crear unidad → cambiar estado → eliminar |
