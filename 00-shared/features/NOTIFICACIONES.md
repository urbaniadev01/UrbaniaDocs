---
type: feature-panorama
status: active
module: shared
tags: [notificaciones, shared]
updated: 2026-06-22
---

# Feature: Notificaciones

## 1. Resumen y motivación

Infraestructura transversal de notificaciones. Todos los demás features pueden emitir notificaciones que llegan al usuario por los canales configurados: in-app, push y email. Este feature gestiona el centro de notificaciones y las preferencias del usuario.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Centro de notificaciones con historial completo y filtros
- Badge en el header con conteo de no leídas, actualizado en tiempo real
- Marcar como leída (individual o todas)
- Preferencias por tipo y canal (push, email, in-app)

## 4. Relaciones con otras features

- Depende de: *(es infraestructura — no depende de features de negocio)*
- Es consumido por: todos los demás features que emiten eventos (PAGOS, CUOTAS, PQRS, COMUNICADOS, ASAMBLEAS, VISITANTES)

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Centro de notificaciones | Página | Lista completa con filtros por tipo y estado leída/no leída |
| Panel de notificaciones (header) | Inline | Dropdown en barra superior con badge de no leídas |
| Detalle de notificación | Modal | Contenido completo + link de acción |
| Preferencias de notificaciones | Página | Qué tipos recibir y por qué canal |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de notificaciones | Screen | Centro de notificaciones en la app |
| Detalle de notificación | BottomSheet | Contenido completo + acción |
| Preferencias | Screen | Configuración de canales y tipos |

---

## 6. Mapeo de acciones a endpoints

| Acción | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver todas las notificaciones | Centro | GET | `/notifications` |
| Marcar una como leída | Detalle | PATCH | `/notifications/{id}` |
| Marcar todas como leídas | Centro | POST | `/notifications/read-all` |
| Ver preferencias | Preferencias | GET | `/notifications/preferences` |
| Guardar preferencias | Preferencias | PATCH | `/notifications/preferences` |

---

## 7. Reglas de negocio globales

- El badge del header muestra el conteo de notificaciones no leídas; se actualiza al marcar como leída.
- Las preferencias se guardan por usuario y canal (push, email, in-app).
- Un click en la notificación navega al recurso relacionado (ej: clic en "Pago registrado" lleva al detalle del pago).
- Las notificaciones push requieren permiso del dispositivo (app) o del navegador (web).

## 8. Estados del recurso

```
no_leida → leida
```

## 9. Endpoints

> Ver [[01-api/endpoints/NOTIFICACIONES]] para el detalle completo.

## 10. Orden de implementación

Infraestructura temprana — implementar antes de COMUNICADOS, PQRS y features que emiten eventos.

## 11. Documentos de implementación

| Proyecto | Spec técnico | Docs de pantallas |
|---|---|---|
| Web | [[02-web/features/notificaciones/NOTIFICACIONES_SPEC]] | [[02-web/features/notificaciones/NOTIFICACIONES_UI_centro]], [[02-web/features/notificaciones/NOTIFICACIONES_UI_panel-header]], [[02-web/features/notificaciones/NOTIFICACIONES_UI_detalle]], [[02-web/features/notificaciones/NOTIFICACIONES_UI_preferencias]] |
| App | [[03-app/features/notificaciones/NOTIFICACIONES_SPEC]] | [[03-app/features/notificaciones/NOTIFICACIONES_UI_lista]], [[03-app/features/notificaciones/NOTIFICACIONES_UI_detalle]], [[03-app/features/notificaciones/NOTIFICACIONES_UI_preferencias]] |
