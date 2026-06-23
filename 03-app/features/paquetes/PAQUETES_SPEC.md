---
type: spec-tecnico
status: active
module: mobile
feature: paquetes
tags: [app, paquetes, spec]
updated: 2026-06-23
---

# Spec Técnico App: Correspondencia y paquetes

> Panorama global: [[00-shared/features/PAQUETES]]
> Endpoints: [[01-api/endpoints/PAQUETES]]
> Design System: [[APP_DESIGN_SYSTEM]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de paquetes | Screen | `/paquetes` | [[03-app/features/paquetes/PAQUETES_UI_lista]] |
| Detalle de paquete | BottomSheet | — | [[03-app/features/paquetes/PAQUETES_UI_detalle]] |
| Confirmar entrega | Dialog | — | [[03-app/features/paquetes/PAQUETES_UI_confirmar-entrega]] |

---

## Estructura de carpetas

```
features/paquetes/
  domain/
    entities/package.dart
    repositories/package_repository.dart
  data/
    models/package_model.dart
    datasources/package_remote_datasource.dart
    repositories/package_repository_impl.dart
  presentation/
    providers/package_providers.dart
    screens/
    widgets/
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `packagesListProvider` | `PackageRepository.getAll()` | `GET /packages` |
| `packageDetailProvider` | `PackageRepository.getById()` | `GET /packages/{id}` |
| `confirmDeliveryProvider` | `PackageRepository.deliver()` | `POST /packages/{id}/deliver` |

> Ver [[APP_API_INTEGRATION]] para cliente Dio, interceptores y manejo de errores.
> Ver [[APP_ARCHITECTURE]] §2 para la estructura completa.

---

## Widgets nuevos

| Widget | Ubicación | Responsabilidad |
|---|---|---|
| `PackageCard` | `presentation/widgets/` | Card de paquete en la lista (ícono, descripción, carrier + tracking, badge de estado) |
| `PackageDetailSheet` | `presentation/widgets/` | BottomSheet con detalle + timeline de eventos |
| `ConfirmDeliveryDialog` | `presentation/widgets/` | Dialog de confirmación de entrega con campo de nombre |

> Todo color, tamaño y texto desde tokens de [[APP_DESIGN_SYSTEM]]. Todo texto en `l10n/`.
> Si un widget lo necesita más de un feature → mover a `shared/widgets/`.

---

## Estrategia offline

- **Clasificación:** `híbrido` — ver [[APP_DATA_STRATEGY]] §1
- **Cache local:** lista de paquetes persistida en Drift con TTL de 1h; detalle no se cachea (siempre fresco al abrir BottomSheet)
- **Invalidación:** push FCM con tipo `paquete_recibido` invalida la cache de lista para forzar refresco al volver a la pantalla
- **En logout:** se limpian paquetes cacheados en Drift

---

## Cálculos y validaciones frontend

- Filtro por `status` en chips: mapea a query param `status` del `GET /packages`
- Tiempo relativo (`received_at`) calculado en cliente con `timeago`
- Badge "Entregar" visible solo si `status == notified`

> El server siempre revalida. Los cálculos frontend son solo para UX.

---

## Permisos

| Pantalla / acción | Rol | Control |
|---|---|---|
| Ver lista | user, admin | Verificar `role` antes de renderizar (user ve solo su unidad, forzado server-side) |
| Ver detalle | user, admin | `role = user`: `id` ajeno retorna `404` (no filtrar existencia) |
| Confirmar entrega | user, admin | `role = user`: auto-entrega de su unidad; `id` ajeno retorna `404` |

> Ver [[APP_SECURITY]].

---

## Deep links

| Origen | Destino |
|---|---|
| Push: `paquete_recibido` | `/paquetes/:id` |

> Ver [[APP_FEATURE_SCOPE]] §6.

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /packages` | [[01-api/API_CONTRACT]] §18.1 | [[01-api/endpoints/PAQUETES]] §18.1 |
| `GET /packages/{id}` | [[01-api/API_CONTRACT]] §18.3 | [[01-api/endpoints/PAQUETES]] §18.3 |
| `POST /packages/{id}/deliver` | [[01-api/API_CONTRACT]] §18.5 | [[01-api/endpoints/PAQUETES]] §18.5 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `test/features/paquetes/domain/` | Entidad `Package`, parseo de timeline |
| Widget | `test/features/paquetes/presentation/` | Render de `PackageCard`, `PackageDetailSheet`, `ConfirmDeliveryDialog` con datos mock |
| Integration | `integration_test/paquetes_test.dart` | Flujo completo con Patrol: abrir lista → detalle → confirmar entrega → snackbar |

> Ver [[APP_TESTING]].
