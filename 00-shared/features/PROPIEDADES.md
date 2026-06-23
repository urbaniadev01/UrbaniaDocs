---
type: feature-panorama
status: active
module: shared
tags: [propiedades, unidades, shared]
updated: 2026-06-22
---

# Feature: Propiedades y unidades

## 1. Resumen y motivación

Gestiona el inventario de torres, pisos y unidades del conjunto. Es el catálogo maestro del sistema — residentes, cuotas, pagos, mora y control de acceso dependen de que las unidades estén correctamente registradas. Sin este feature, ningún otro feature puede operar.

## 2. Capas afectadas

- [x] API (origen del contrato)
- [x] Web
- [x] App *(solo lectura para residentes)*

## 3. Características principales

- Registro de la estructura del conjunto: torres → pisos → unidades
- Atributos por unidad: área en m², coeficiente de copropiedad, tipo (apartamento, local, parqueadero, depósito), estado
- Historial de residentes asignados a cada unidad
- Gestión de estados de ocupación: ocupada, vacía, en venta

## 4. Relaciones con otras features

- Depende de: nada — es el feature base del sistema
- Es consumido por: [[00-shared/features/RESIDENTES]] (asignación de unidades), [[00-shared/features/CUOTAS]] (cálculo por coeficiente), [[00-shared/features/PAGOS]] (referencia de unidad), [[00-shared/features/MORA]] (unidades morosas), [[00-shared/features/VISITANTES]] (unidad destino), [[00-shared/features/VEHICULOS]] (unidad propietaria), [[00-shared/features/RESERVAS]] (reservas por unidad)

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de propiedades | Página | Tabla de unidades por torre con filtros y búsqueda |
| Detalle de unidad | Drawer | Info de la unidad: área, coeficiente, estado, residente actual |
| Crear / editar unidad | Modal | Formulario: torre, piso, número, área, coeficiente, tipo |
| Cambiar estado de unidad | Modal | Dropdown: ocupada / vacía / en venta + confirmación |
| Eliminar unidad | Modal | Confirmación destructiva con advertencia de dependencias |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de unidades | Screen | Vista de la lista de unidades del conjunto |
| Detalle de unidad | BottomSheet | Info básica de la unidad |

---

## 6. Mapeo de acciones a endpoints

| Acción del usuario | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver lista de unidades | Lista de propiedades | GET | `/properties` |
| Crear unidad | Modal crear/editar | POST | `/properties` |
| Ver detalle de unidad | Detalle de unidad (Drawer) | GET | `/properties/{id}` |
| Editar unidad | Modal crear/editar | PATCH | `/properties/{id}` |
| Eliminar unidad | Modal eliminar | DELETE | `/properties/{id}` |
| Cambiar estado | Modal cambiar estado | PATCH | `/properties/{id}/status` |

---

## 7. Reglas de negocio globales

- No se puede eliminar una unidad que tenga un residente activo asignado.
- Los coeficientes de todas las unidades de un conjunto deben sumar 1.000 (o el valor base configurado). El sistema advierte si hay desajuste.
- Solo administradores pueden crear, editar o eliminar unidades.
- El estado "en venta" no impide que la unidad tenga un residente asignado — puede estar en venta y habitada simultáneamente.
- El coeficiente determina el valor de la cuota mensual de administración.

## 8. Estados del recurso

```
ocupada ⟷ vacía ⟷ en venta (cualquier transición es válida)
```

## 9. Endpoints

| Endpoint | Índice | Detalle |
|---|---|---|
| `GET /properties` | [[01-api/API_CONTRACT]] §Propiedades | [[01-api/endpoints/PROPIEDADES]] §1 |
| `POST /properties` | [[01-api/API_CONTRACT]] §Propiedades | [[01-api/endpoints/PROPIEDADES]] §2 |
| `GET /properties/{id}` | [[01-api/API_CONTRACT]] §Propiedades | [[01-api/endpoints/PROPIEDADES]] §3 |
| `PATCH /properties/{id}` | [[01-api/API_CONTRACT]] §Propiedades | [[01-api/endpoints/PROPIEDADES]] §4 |
| `DELETE /properties/{id}` | [[01-api/API_CONTRACT]] §Propiedades | [[01-api/endpoints/PROPIEDADES]] §5 |
| `PATCH /properties/{id}/status` | [[01-api/API_CONTRACT]] §Propiedades | [[01-api/endpoints/PROPIEDADES]] §6 |

## 10. Orden de implementación

API define el contrato → Web implementa primero (es panel de admin) → App implementa (solo lectura).

## 11. Documentos de implementación

| Proyecto | Spec técnico | Docs de pantallas |
|---|---|---|
| Web | [[02-web/features/propiedades/PROPIEDADES_SPEC]] | [[02-web/features/propiedades/PROPIEDADES_UI_lista]], [[02-web/features/propiedades/PROPIEDADES_UI_detalle-unidad]], [[02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad]], [[02-web/features/propiedades/PROPIEDADES_UI_cambiar-estado]], [[02-web/features/propiedades/PROPIEDADES_UI_eliminar-unidad]] |
| App | [[03-app/features/propiedades/PROPIEDADES_SPEC]] | [[03-app/features/propiedades/PROPIEDADES_UI_lista]], [[03-app/features/propiedades/PROPIEDADES_UI_detalle-unidad]] |
