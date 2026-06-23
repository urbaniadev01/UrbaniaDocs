---
type: spec-tecnico
status: active
module: mobile
feature: residentes
tags: [app, residentes, spec]
updated: 2026-06-22
---

# Spec Técnico App: Residentes y propietarios

> Panorama global: [[00-shared/features/RESIDENTES]]
> Endpoints: [[01-api/endpoints/RESIDENTES]]
> Design System: [[APP_DESIGN_SYSTEM]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de residentes | Screen | `/residentes` | [[03-app/features/residentes/RESIDENTES_UI_lista]] |
| Perfil de residente | Screen | `/residentes/:id` | [[03-app/features/residentes/RESIDENTES_UI_perfil]] |

---

## Estructura de carpetas

```
features/residentes/
  domain/
    entities/residente.dart
    repositories/residentes_repository.dart
  data/
    models/residente_model.dart
    datasources/residentes_remote_datasource.dart
    repositories/residentes_repository_impl.dart
  presentation/
    providers/residentes_providers.dart
    screens/residentes_list_screen.dart
    screens/residente_perfil_screen.dart
    widgets/residente_card.dart
```

---

## Providers y repositorios

| Provider | Repositorio | Endpoint |
|---|---|---|
| `residentesListProvider` | `ResidentesRepository.getAll()` | `GET /residents` |
| `residenteDetailProvider` | `ResidentesRepository.getById()` | `GET /residents/{id}` |

---

## Estrategia offline

- **Clasificación:** `híbrido` — lista cacheada localmente, TTL 1h
- **En logout:** limpiar datos de residentes

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /residents` | [[01-api/endpoints/RESIDENTES]] §1 |
| `GET /residents/{id}` | [[01-api/endpoints/RESIDENTES]] §3 |
