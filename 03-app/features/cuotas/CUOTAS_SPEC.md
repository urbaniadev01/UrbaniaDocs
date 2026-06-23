---
type: spec-tecnico
status: active
module: mobile
feature: cuotas
tags: [app, cuotas, spec]
updated: 2026-06-22
---

# Spec Técnico App: Cuotas de administración

> Panorama global: [[00-shared/features/CUOTAS]]
> Endpoints: [[01-api/endpoints/CUOTAS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta go_router | Doc de diseño |
|---|---|---|---|
| Lista de cuotas | Screen | `/cuotas` | [[03-app/features/cuotas/CUOTAS_UI_lista]] |
| Detalle de cuota | Screen | `/cuotas/:id` | [[03-app/features/cuotas/CUOTAS_UI_detalle-unidad]] |

---

## Estructura de carpetas

```
features/cuotas/
  domain/entities/cuota.dart
  data/models/cuota_model.dart
  presentation/
    providers/cuotas_providers.dart
    screens/cuotas_list_screen.dart
    screens/cuota_detalle_screen.dart
    widgets/cuota_card.dart
```

---

## Estrategia offline

- **Clasificación:** `online-only` — datos financieros sensibles, no se cachean

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /fees/unit/{id}` | [[01-api/endpoints/CUOTAS]] §3 |
