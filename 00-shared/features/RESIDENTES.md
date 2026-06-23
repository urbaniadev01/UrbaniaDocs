---
type: feature-panorama
status: active
module: shared
tags: [residentes, propietarios, shared]
updated: 2026-06-22
---

# Feature: Residentes y propietarios

## 1. Resumen y motivación

Gestiona las personas que habitan o son propietarias de las unidades del conjunto. Define los datos de contacto, el tipo de vínculo con la unidad y el historial de ocupación. Es el directorio de personas que alimenta la facturación, las comunicaciones y el control de acceso.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Registro de residentes con datos personales y de contacto
- Tipos de vínculo: propietario, arrendatario, familiar a cargo
- Asignación a unidad con fecha de inicio y fin
- Historial de unidades por residente
- Desactivación con motivo y fecha de salida

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PROPIEDADES]]
- Es consumido por: [[00-shared/features/CUOTAS]], [[00-shared/features/PAGOS]], [[00-shared/features/COMUNICADOS]], [[00-shared/features/PQRS]], [[00-shared/features/VISITANTES]], [[00-shared/features/VEHICULOS]], [[00-shared/features/RESERVAS]], [[00-shared/features/VOTACIONES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de residentes | Página | Tabla: nombre, unidad, tipo, estado |
| Perfil de residente | Página | Datos personales, documentos, historial de unidades, vehículos |
| Crear residente | Modal | Nombre, ID, contacto, tipo, unidad asignada |
| Editar residente | Sheet | Formulario completo en panel lateral |
| Cambiar unidad asignada | Modal | Selector de unidad disponible + fecha de inicio |
| Desactivar residente | Modal | Confirmación + motivo |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de residentes | Screen | Directorio del conjunto |
| Perfil de residente | Screen | Vista completa del residente |

---

## 6. Mapeo de acciones a endpoints

| Acción del usuario | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver lista | Lista | GET | `/residents` |
| Crear residente | Modal crear | POST | `/residents` |
| Ver perfil | Perfil | GET | `/residents/{id}` |
| Editar datos | Sheet editar | PATCH | `/residents/{id}` |
| Cambiar unidad | Modal cambiar unidad | PATCH | `/residents/{id}/unit` |
| Desactivar | Modal desactivar | PATCH | `/residents/{id}/status` |

---

## 7. Reglas de negocio globales

- Un residente solo puede tener una unidad activa asignada a la vez.
- El tipo "arrendatario" no puede firmar actas de asamblea ni votar (solo el propietario o su representante).
- Desactivar un residente requiere fecha de salida; la unidad queda en estado vacía automáticamente.
- Un residente desactivado mantiene acceso de solo lectura a su historial financiero.
- El documento de identidad (cédula, NIT) debe ser único en el sistema.

## 8. Estados del recurso

```
activo → inactivo (desactivado por salida) | suspendido
```

## 9. Endpoints

| Endpoint | Detalle |
|---|---|
| `GET /residents` | [[01-api/endpoints/RESIDENTES]] §1 |
| `POST /residents` | [[01-api/endpoints/RESIDENTES]] §2 |
| `GET /residents/{id}` | [[01-api/endpoints/RESIDENTES]] §3 |
| `PATCH /residents/{id}` | [[01-api/endpoints/RESIDENTES]] §4 |
| `PATCH /residents/{id}/unit` | [[01-api/endpoints/RESIDENTES]] §5 |
| `PATCH /residents/{id}/status` | [[01-api/endpoints/RESIDENTES]] §6 |

## 10. Orden de implementación

Después de PROPIEDADES. API → Web → App.

## 11. Documentos de implementación

| Proyecto | Spec técnico | Docs de pantallas |
|---|---|---|
| Web | [[02-web/features/residentes/RESIDENTES_SPEC]] | [[02-web/features/residentes/RESIDENTES_UI_lista]], [[02-web/features/residentes/RESIDENTES_UI_perfil]], [[02-web/features/residentes/RESIDENTES_UI_crear]], [[02-web/features/residentes/RESIDENTES_UI_editar]], [[02-web/features/residentes/RESIDENTES_UI_cambiar-unidad]], [[02-web/features/residentes/RESIDENTES_UI_desactivar]] |
| App | [[03-app/features/residentes/RESIDENTES_SPEC]] | [[03-app/features/residentes/RESIDENTES_UI_lista]], [[03-app/features/residentes/RESIDENTES_UI_perfil]] |
