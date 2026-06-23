---
type: feature-panorama
status: active
module: shared
tags: [pqrs, soporte, shared]
updated: 2026-06-22
---

# Feature: PQRS (Peticiones, Quejas, Reclamos y Sugerencias)

## 1. Resumen y motivación

Canal formal para que los residentes radiquen solicitudes y el administrador las gestione con un flujo de estados, comentarios y resolución documentada. Reemplaza el buzón de sugerencias y los mensajes de WhatsApp sin trazabilidad.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Radicación de PQRS por tipo (petición, queja, reclamo, sugerencia) con adjuntos
- Flujo de estados con cambios auditados y notificaciones automáticas al residente
- Hilo de comentarios entre admin y residente en cada PQRS
- Vista de gestión para el admin con filtros por tipo, estado y asignado

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/RESIDENTES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de PQRS | Página | Tabla de gestión con filtros por tipo, estado, responsable |
| Detalle de PQRS | Página | Hilo completo, estado, historial, acciones admin |
| Cambiar estado | Modal | Transición de estado con comentario requerido |
| Asignar responsable | Modal | Asignar a un usuario del admin |
| Crear PQRS (admin) | Modal | El admin puede radicar en nombre de un residente |
| Estadísticas PQRS | Inline | En el listado: resumen de métricas (tiempo promedio, abiertos) |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de PQRS | Screen | PQRS del residente con su estado |
| Crear PQRS | Screen | Formulario de radicación |
| Detalle de PQRS | Screen | Hilo completo con opción de agregar comentario |
| Adjuntos | BottomSheet | Vista y carga de archivos adjuntos |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver lista | GET | `/pqrs` |
| Crear PQRS | POST | `/pqrs` |
| Ver detalle | GET | `/pqrs/{id}` |
| Agregar comentario | POST | `/pqrs/{id}/comments` |
| Cambiar estado | PATCH | `/pqrs/{id}/status` |
| Asignar responsable | PATCH | `/pqrs/{id}/assign` |
| Subir adjunto | POST | `/pqrs/{id}/attachments` |

---

## 7. Reglas de negocio globales

- Toda PQRS tiene un número de radicado único y visible para el residente.
- Los cambios de estado se notifican automáticamente al residente.
- El residente puede agregar comentarios mientras la PQRS está abierta.
- Un residente solo ve sus propias PQRS; el admin ve todas.
- Al cerrar una PQRS, se requiere comentario de resolución.
- Tiempo máximo de respuesta inicial: configurable por el administrador del conjunto.

## 8. Estados del recurso

```
abierta → en_revision → respondida → cerrada | rechazada
```

## 9. Endpoints

> Ver [[01-api/endpoints/PQRS]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/pqrs/PQRS_SPEC]] |
| App | [[03-app/features/pqrs/PQRS_SPEC]] |
