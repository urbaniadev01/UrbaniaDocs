---
type: template
status: active
module: mobile
tags: [app, template, features, spec]
updated: 2026-06-22
---

# Spec Técnico App: <Nombre>

> Panorama global: [[00-shared/features/<NOMBRE>]]
> Endpoints: [[01-api/endpoints/<FEATURE>]]
> Design System: [[APP_DESIGN_SYSTEM]]

---

## Pantallas del feature

> Una fila por cada archivo `_UI_<pantalla>.md` de este feature.

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| <Nombre pantalla> | Screen / BottomSheet / Dialog / Inline | `/<feature>` | [[03-app/features/<NOMBRE>_UI_<pantalla>]] |

---

## Estructura de carpetas

```
features/<feature>/
  domain/
    entities/<feature>.dart
    repositories/<feature>_repository.dart
  data/
    models/<feature>_model.dart
    datasources/<feature>_remote_datasource.dart
    repositories/<feature>_repository_impl.dart
  presentation/
    providers/<feature>_providers.dart
    screens/
    widgets/
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `<feature>ListProvider` | `<Feature>Repository.getAll()` | `GET /<feature>` |
| `<feature>DetailProvider` | `<Feature>Repository.getById()` | `GET /<feature>/:id` |
| `create<Feature>Provider` | `<Feature>Repository.create()` | `POST /<feature>` |
| `update<Feature>Provider` | `<Feature>Repository.update()` | `PATCH /<feature>/:id` |

> Ver [[APP_API_INTEGRATION]] para cliente Dio, interceptores y manejo de errores.
> Ver [[APP_ARCHITECTURE]] §2 para la estructura completa.

---

## Widgets nuevos

| Widget | Ubicación | Responsabilidad |
|---|---|---|
| `<Feature>Card` | `presentation/widgets/` | Card de ítem en lista |
| `<Feature>Form` | `presentation/widgets/` | Formulario crear/editar |

> Todo color, tamaño y texto desde tokens de [[APP_DESIGN_SYSTEM]]. Todo texto en `l10n/`.
> Si un widget lo necesita más de un feature → mover a `shared/widgets/`.

---

## Estrategia offline

- **Clasificación:** `online-only` / `híbrido` / `offline-first` — ver [[APP_DATA_STRATEGY]] §1
- **Cache local:** `<qué se persiste en Drift y por cuánto tiempo>`
- **En logout:** `<qué datos locales se limpian>`

---

## Cálculos y validaciones frontend

- `<descripción>`

> El server siempre revalida. Los cálculos frontend son solo para UX.

---

## Permisos

| Pantalla / acción | Rol | Control |
|---|---|---|
| Ver lista | user, admin | Verificar `role` antes de renderizar |
| Crear | user | Mostrar FAB solo si autenticado |
| Administrar | admin | Ocultar sección si no es admin |

> Ver [[APP_SECURITY]].

---

## Deep links

| Origen | Destino |
|---|---|
| Push: `<tipo_evento>` | `/<feature>/:id` |

> Ver [[APP_FEATURE_SCOPE]] §6.

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
| Unit | `test/features/<feature>/domain/` | Entidades y casos de uso |
| Widget | `test/features/<feature>/presentation/` | Render con datos mock |
| Integration | `integration_test/<feature>_test.dart` | Flujo completo con Patrol |

> Ver [[APP_TESTING]].
