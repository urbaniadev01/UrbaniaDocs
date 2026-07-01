---
type: spec
status: active
module: mobile
tags: [app, spec, directorio, contacts]
updated: 2026-06-27
---

# Spec Técnico App: Directorio (Residentes y Propietarios)

> Panorama global: [[00-shared/features/DIRECTORIO]]
> Endpoints: [[01-api/endpoints/PROPERTY_OCCUPANTS]] | [[01-api/endpoints/CONTACTS]]
> Design System: [[APP_DESIGN_SYSTEM]]

Estado: **Diseñado**

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Mi unidad | Screen | `/mi-unidad` | [[03-app/features/directorio/DIRECTORIO_UI_MI_UNIDAD]] |
| Mi perfil de contacto | Screen | `/mi-perfil` | [[03-app/features/directorio/DIRECTORIO_UI_MI_PERFIL]] |

> La App es solo para residentes (role: `user`). No tiene pantallas de administración del directorio completo — eso es solo Web.

---

## Estructura de carpetas

```
features/directorio/
  domain/
    entities/contact.dart
    entities/property_occupant.dart
    entities/occupant_type.dart
    repositories/directorio_repository.dart
  data/
    models/contact_model.dart
    models/property_occupant_model.dart
    models/occupant_type_model.dart
    datasources/directorio_remote_datasource.dart
    repositories/directorio_repository_impl.dart
  presentation/
    providers/directorio_providers.dart
    screens/mi_unidad_screen.dart
    screens/mi_perfil_screen.dart
    widgets/occupant_card.dart
    widgets/contact_form.dart
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `miUnidadProvider` | `DirectorioRepository.getUnitOccupants(propertyId)` | `GET /properties/{propertyId}/occupants` |
| `miPerfilProvider` | `DirectorioRepository.getMyContact()` | `GET /contacts/by-user` (o filtrar por user_id) |
| `updateMiPerfilProvider` | `DirectorioRepository.updateContact(id)` | `PATCH /contacts/{id}` |

> Ver [[APP_API_INTEGRATION]] para cliente Dio, interceptores y manejo de errores.
> Ver [[APP_ARCHITECTURE]] §2 para la estructura completa.

---

## Widgets nuevos

| Widget | Ubicación | Responsabilidad |
|---|---|---|
| `OccupantCard` | `presentation/widgets/` | Card con info del ocupante (nombre, tipo, teléfono) |
| `ContactForm` | `presentation/widgets/` | Formulario de edición de perfil |

> Todo color, tamaño y texto desde tokens de [[APP_DESIGN_SYSTEM]]. Todo texto en `l10n/`.

---

## Estrategia offline

- **Clasificación:** `online-first` — el directorio se consulta siempre de la API
- **Cache local:** los datos de mi unidad se cachean en Drift por 5 minutos
- **En logout:** limpiar cache

---

## Cálculos y validaciones frontend

- No aplica. La App solo muestra datos del servidor (mi unidad) y permite editar el perfil propio. El server siempre revalida.

---

## Permisos

| Pantalla / acción | Rol | Control |
|---|---|---|
| Ver mi unidad | user | Ruta protegida por AuthGuard |
| Editar mi perfil | user | Solo editar propio perfil |
| Ver directorio completo | admin | No implementado en App (solo Web) |

> Ver [[APP_SECURITY]].

---

## Deep links

| Origen | Destino |
|---|---|
| Push: `nueva_ocupacion` | `/mi-unidad` |

> Ver [[APP_FEATURE_SCOPE]] §6.

---

## Endpoints referenciados

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /properties/{propertyId}/occupants` | [[01-api/API_CONTRACT]] §Ocupantes | [[01-api/endpoints/PROPERTY_OCCUPANTS]] |
| `GET /contacts/by-user` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] |
| `PATCH /contacts/{id}` | [[01-api/API_CONTRACT]] §Contactos | [[01-api/endpoints/CONTACTS]] |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `test/features/directorio/domain/` | Contact entity y DirectorioRepository |
| Widget | `test/features/directorio/presentation/` | MiUnidadScreen y MiPerfilScreen con datos mock |
| Integration | `integration_test/directorio_test.dart` | Flujo completo con Patrol |

> Ver [[APP_TESTING]].
