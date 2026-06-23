---
type: spec-tecnico
status: active
module: mobile
feature: propiedades
tags: [app, propiedades, spec]
updated: 2026-06-22
---

# Spec Técnico App: Propiedades y unidades

> Panorama global: [[00-shared/features/PROPIEDADES]]
> Endpoints: [[01-api/endpoints/PROPIEDADES]]
> Design System: [[APP_DESIGN_SYSTEM]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de unidades | Screen | `/propiedades` | [[03-app/features/propiedades/PROPIEDADES_UI_lista]] |
| Detalle de unidad | BottomSheet | — | [[03-app/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |

> En la app, las propiedades son de solo lectura para el residente. El admin gestiona desde la web.

---

## Estructura de carpetas

```
features/propiedades/
  domain/
    entities/unidad.dart
    repositories/propiedades_repository.dart
  data/
    models/unidad_model.dart
    datasources/propiedades_remote_datasource.dart
    repositories/propiedades_repository_impl.dart
  presentation/
    providers/propiedades_providers.dart
    screens/propiedades_list_screen.dart
    widgets/unidad_card.dart
    widgets/unidad_detalle_sheet.dart
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `propiedadesListProvider` | `PropiedadesRepository.getAll()` | `GET /properties` |
| `unidadDetailProvider` | `PropiedadesRepository.getById()` | `GET /properties/{id}` |

---

## Widgets nuevos

| Widget | Ubicación | Responsabilidad |
|---|---|---|
| `UnidadCard` | `presentation/widgets/` | Card de unidad en lista: número, torre, estado, residente |
| `UnidadDetalleSheet` | `presentation/widgets/` | BottomSheet con info completa de la unidad |

---

## Estrategia offline

- **Clasificación:** `híbrido` — la lista se cachea localmente
- **Cache local:** lista de unidades, TTL 24h (datos estables)
- **En logout:** limpiar cache local de unidades

---

## Permisos

| Pantalla / acción | Rol | Control |
|---|---|---|
| Ver lista de unidades | user, admin | Disponible para todos los usuarios autenticados |
| Ver detalle | user, admin | Disponible para todos |

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /properties` | [[01-api/endpoints/PROPIEDADES]] §1 |
| `GET /properties/{id}` | [[01-api/endpoints/PROPIEDADES]] §3 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `test/features/propiedades/domain/` | Entidad Unidad, repositorio |
| Widget | `test/features/propiedades/presentation/` | UnidadCard con datos mock |
| Integration | `integration_test/propiedades_test.dart` | Ver lista, abrir detalle |
