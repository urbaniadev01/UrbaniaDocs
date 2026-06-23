---
type: feature-panorama
status: active
module: shared
tags: [ordenes-trabajo, mantenimiento-correctivo, shared]
updated: 2026-06-22
---

# Feature: Órdenes de trabajo

## 1. Resumen y motivación

Gestiona las solicitudes de mantenimiento correctivo de áreas comunes. Una orden de trabajo nace de un reporte (del residente o del admin), se asigna a un proveedor o empleado, y se cierra cuando el trabajo está completo. Complementa MANTENIMIENTO (preventivo) con el correctivo.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Creación de órdenes desde una PQRS existente o desde cero
- Asignación a proveedor interno o externo con fecha límite
- Flujo de estados con notificaciones al reportante
- Cierre con evidencia fotográfica y costo registrado

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PQRS]], [[00-shared/features/PROVEEDORES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de órdenes | Página | Tablero de órdenes con filtros por estado y proveedor |
| Crear orden | Modal | Nueva orden desde cero o desde PQRS |
| Detalle de orden | Página | Historial completo, asignado, evidencias, costo |
| Cambiar estado | Modal | Transición de estado con comentario |
| Asignar proveedor | Modal | Asignar y definir fecha límite |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de órdenes | Screen | Órdenes reportadas por el residente |
| Detalle de orden | Screen | Estado y actualizaciones de su orden |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver lista | GET | `/work-orders` |
| Crear orden | POST | `/work-orders` |
| Ver detalle | GET | `/work-orders/{id}` |
| Cambiar estado | PATCH | `/work-orders/{id}/status` |
| Asignar proveedor | PATCH | `/work-orders/{id}/assign` |
| Subir evidencia | POST | `/work-orders/{id}/evidence` |

---

## 7. Reglas de negocio globales

- Una orden puede nacer desde una PQRS (heredando su descripción) o crearse manualmente.
- Al asignar, el proveedor recibe notificación si tiene email registrado.
- Al cerrar, se requiere al menos una foto como evidencia y el costo final.
- El residente que reportó recibe notificación al cerrar la orden.

## 8. Estados del recurso

```
abierta → asignada → en_ejecucion → cerrada | cancelada
```

## 9. Endpoints

> Ver [[01-api/endpoints/ORDENES-TRABAJO]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]] |
| App | [[03-app/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC]] |
