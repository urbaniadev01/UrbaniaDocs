---
type: spec-tecnico
status: active
module: mobile
feature: propiedades
tags: [app, propiedades, spec]
updated: 2026-06-27
---

# Spec Técnico App: Propiedades y Unidades

> [!warning] Solo lectura
> La App móvil ofrece **solo consulta** de propiedades. La administración (crear, editar, eliminar, cambiar estado, subir documentos) se realiza exclusivamente desde la Web.

> Panorama global: [[00-shared/features/PROPIEDADES]]
> Endpoints: [[01-api/endpoints/PROPIEDADES]], [[01-api/endpoints/TOWERS]], [[01-api/endpoints/PROPERTY_CATALOGS]]
> Design System: [[APP_DESIGN_SYSTEM]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de unidades | Screen | `/properties` | [[03-app/features/propiedades/PROPIEDADES_UI_lista-unidades]] |
| Detalle de unidad | BottomSheet | (desde lista) | [[03-app/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |

---

## Estructura de carpetas

```
features/propiedades/
  domain/
    entities/property.dart
    entities/tower.dart
    entities/property_type.dart
    entities/property_status.dart
    repositories/property_repository.dart
  data/
    models/property_model.dart
    models/tower_model.dart
    models/property_type_model.dart
    models/property_status_model.dart
    datasources/property_remote_datasource.dart
    repositories/property_repository_impl.dart
  presentation/
    providers/property_providers.dart
    screens/property_list_screen.dart
    widgets/property_card.dart
    widgets/property_detail_sheet.dart
    widgets/property_status_badge.dart
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `propertyListProvider` | `PropertyRepository.getAll()` | `GET /properties` |
| `propertyDetailProvider` | `PropertyRepository.getById()` | `GET /properties/{id}` |
| `propertyTypesProvider` | `PropertyRepository.getTypes()` | `GET /property-types` |
| `propertyStatusesProvider` | `PropertyRepository.getStatuses()` | `GET /property-statuses` |
| `towerListProvider` | `PropertyRepository.getTowers()` | `GET /condominiums/{id}/towers` |

> Ver [[APP_API_INTEGRATION]] para cliente Dio, interceptores y manejo de errores.
> Ver [[APP_ARCHITECTURE]] §2 para la estructura completa.

---

## Widgets nuevos

| Widget | Ubicación | Responsabilidad |
|---|---|---|
| `PropertyCard` | `presentation/widgets/` | Card de unidad en lista: full_designation, tipo, estado, área |
| `PropertyDetailSheet` | `presentation/widgets/` | BottomSheet con info completa de la unidad |
| `PropertyStatusBadge` | `presentation/widgets/` | Badge coloreado según estado de la unidad |

---

## Estrategia offline

- **Clasificación:** `online-only` — los datos de propiedades cambian con poca frecuencia pero siempre deben reflejar el estado actual del servidor
- **Cache local:** Las listas de propiedades se cachean en Drift por 5 minutos (stale mientras tanto)
- **En logout:** Se limpia todo el cache de propiedades

---

## Permisos

| Pantalla / acción | Rol | Control |
|---|---|---|
| Ver lista de unidades | user, admin | Visible en el bottom nav |
| Ver detalle de unidad | user, admin | Tap en card abre BottomSheet |
| Administrar (crear/editar) | admin | No disponible en App (solo Web) |

> El residente solo ve las unidades donde está asignado (post-MVP). Por ahora ve todas las unidades del conjunto como información general.

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /properties` | [[01-api/API_CONTRACT]] §2.1 | [[01-api/endpoints/PROPIEDADES]] §2.1 |
| `GET /properties/{id}` | [[01-api/API_CONTRACT]] §2.3 | [[01-api/endpoints/PROPIEDADES]] §2.3 |
| `GET /property-types` | [[01-api/API_CONTRACT]] §4.1 | [[01-api/endpoints/PROPERTY_CATALOGS]] §4.1 |
| `GET /property-statuses` | [[01-api/API_CONTRACT]] §4.5 | [[01-api/endpoints/PROPERTY_CATALOGS]] §4.5 |
| `GET /condominiums/{id}/towers` | [[01-api/API_CONTRACT]] §3.1 | [[01-api/endpoints/TOWERS]] §3.1 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `test/features/propiedades/domain/` | Entidades y parsing de modelos |
| Widget | `test/features/propiedades/presentation/` | Render de PropertyCard con datos mock |
| Integration | `integration_test/propiedades_test.dart` | Flujo de navegación: lista → detalle |
