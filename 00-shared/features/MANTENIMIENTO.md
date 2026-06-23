---
type: feature-panorama
status: active
module: shared
tags: [mantenimiento, preventivo, shared]
updated: 2026-06-22
---

# Feature: Mantenimiento preventivo

## 1. Resumen y motivación

Planifica y hace seguimiento de las actividades de mantenimiento preventivo de la infraestructura del conjunto: ascensores, bombas, zonas verdes, eléctricas, etc. Complementa ORDENES-TRABAJO (correctivo) con la gestión del preventivo.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(N/A — gestión administrativa)*

## 3. Características principales

- Catálogo de activos del conjunto con ficha técnica
- Plan de mantenimiento: frecuencia, responsable y tarea por activo
- Generación automática de órdenes de mantenimiento según calendario
- Historial de mantenimientos realizados con evidencias y costo

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PROVEEDORES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Catálogo de activos | Página | Lista de activos del conjunto |
| Crear / editar activo | Modal | Ficha técnica del activo |
| Plan de mantenimiento | Página | Cronograma visual de tareas preventivas |
| Crear / editar tarea | Modal | Frecuencia, responsable y descripción de la tarea |
| Historial de mantenimientos | Página | Log de mantenimientos realizados |

### App

> N/A — este feature es solo Web.

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver activos | GET | `/assets` |
| Crear activo | POST | `/assets` |
| Ver plan de mantenimiento | GET | `/maintenance-plans` |
| Crear tarea | POST | `/maintenance-plans` |
| Ver historial | GET | `/maintenance-logs` |
| Registrar mantenimiento | POST | `/maintenance-logs` |

---

## 7. Reglas de negocio globales

- El plan genera recordatorios automáticos X días antes de la fecha programada.
- Cada mantenimiento realizado queda en el historial con fecha, proveedor, costo y evidencias.
- Al registrar un mantenimiento, se puede actualizar la próxima fecha automáticamente.

## 8. Estados del recurso

```
programado → en_ejecucion → completado | pospuesto
```

## 9. Endpoints

> Ver [[01-api/endpoints/MANTENIMIENTO]] para el detalle completo.

## 11. Documentos de implementación

> Ver [[02-web/features/mantenimiento/MANTENIMIENTO_SPEC]] (App N/A).
