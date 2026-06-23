---
type: feature-panorama
status: active
module: shared
tags: [comunicados, circulares, shared]
updated: 2026-06-22
---

# Feature: Comunicados y circulares

## 1. Resumen y motivación

Canal oficial de comunicación del administrador hacia los residentes. Reemplaza el tablero de avisos físico y el grupo de WhatsApp por un canal estructurado con historial, confirmaciones de lectura y segmentación por destinatarios.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Redacción y publicación de comunicados con adjuntos (imágenes, PDFs)
- Segmentación de destinatarios: todos, por torre, por unidad específica
- Confirmación de lectura: el sistema registra quién leyó y cuándo
- Notificación push/email automática al publicar

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/RESIDENTES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: *(ninguno)*

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de comunicados | Página | Tabla de comunicados publicados y borradores |
| Crear / editar comunicado | Modal | Editor con adjuntos y segmentación |
| Detalle de comunicado | Drawer | Contenido completo + estadísticas de lectura |
| Estadísticas de lectura | Inline | Dentro del drawer: lista de quién leyó |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de comunicados | Screen | Feed de comunicados para el residente |
| Detalle de comunicado | Screen | Contenido completo + adjuntos |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver lista | GET | `/announcements` |
| Crear comunicado | POST | `/announcements` |
| Editar comunicado | PATCH | `/announcements/{id}` |
| Publicar borrador | POST | `/announcements/{id}/publish` |
| Ver detalle + marcar leído | GET | `/announcements/{id}` |
| Ver estadísticas de lectura | GET | `/announcements/{id}/reads` |
| Eliminar comunicado | DELETE | `/announcements/{id}` |

---

## 7. Reglas de negocio globales

- Solo el admin puede crear y publicar comunicados.
- Un comunicado publicado no puede editarse, solo eliminarse.
- Al publicar, se envía notificación push y email a los destinatarios según sus preferencias.
- La marca de lectura se registra automáticamente cuando el residente abre el detalle.

## 8. Estados del recurso

```
borrador → publicado | eliminado
```

## 9. Endpoints

> Ver [[01-api/endpoints/COMUNICADOS]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/comunicados/COMUNICADOS_SPEC]] |
| App | [[03-app/features/comunicados/COMUNICADOS_SPEC]] |
