---
type: feature-panorama
status: active
module: shared
tags: [reservas, areas-comunes, shared]
updated: 2026-06-22
---

# Feature: Reservas de áreas comunes

## 1. Resumen y motivación

Permite a los residentes reservar áreas comunes del conjunto (salón comunal, BBQ, cancha, piscina, etc.) y al admin gestionar la disponibilidad, tarifas y aprobaciones. Elimina el cuaderno de reservas en portería.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Catálogo de áreas comunes con capacidad, horarios disponibles y tarifa
- Solicitud de reserva por el residente con selección de fecha/hora y bloque
- Aprobación o rechazo por el admin con notificación al residente
- Calendario de disponibilidad visual

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/RESIDENTES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/PAGOS]] *(si la reserva tiene costo)*, [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Gestión de áreas comunes | Página | Catálogo de áreas + reservas pendientes |
| Crear / editar área | Modal | Configurar un área común |
| Gestión de reservas | Página | Calendario y lista de reservas, aprobar/rechazar |
| Detalle de reserva | Drawer | Info de la reserva, acciones admin |
| Aprobar / rechazar | Modal | Confirmación con comentario opcional |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Áreas comunes | Screen | Catálogo con disponibilidad |
| Calendario de reservas | Screen | Vista de disponibilidad del área seleccionada |
| Crear reserva | BottomSheet | Selección de fecha, hora y datos de la reserva |
| Mis reservas | Screen | Historial de reservas del residente |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver áreas | GET | `/amenities` |
| Crear área | POST | `/amenities` |
| Editar área | PATCH | `/amenities/{id}` |
| Ver reservas | GET | `/bookings` |
| Crear reserva | POST | `/bookings` |
| Ver detalle | GET | `/bookings/{id}` |
| Aprobar reserva | POST | `/bookings/{id}/approve` |
| Rechazar reserva | POST | `/bookings/{id}/reject` |
| Cancelar reserva | POST | `/bookings/{id}/cancel` |

---

## 7. Reglas de negocio globales

- Un residente no puede tener más de X reservas activas simultáneas (configurable).
- Las reservas con costo generan automáticamente un cargo a la cuenta de la unidad.
- El admin puede aprobar/rechazar con comentario; el residente recibe notificación en ambos casos.
- Un residente no puede reservar si tiene mora pendiente (configurable).
- La cancelación tiene un plazo mínimo antes del horario reservado (ej: 24h).

## 8. Estados del recurso

```
pendiente → aprobada → en_uso → finalizada | rechazada | cancelada
```

## 9. Endpoints

> Ver [[01-api/endpoints/RESERVAS]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/reservas/RESERVAS_SPEC]] |
| App | [[03-app/features/reservas/RESERVAS_SPEC]] |
