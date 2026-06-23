---
type: feature-panorama
status: active
module: shared
tags: [vehiculos, control-acceso, shared]
updated: 2026-06-22
---

# Feature: Control de vehículos

## 1. Resumen y motivación

Registro y seguimiento de vehículos residentes y visitantes. Permite saber qué vehículos están autorizados en el conjunto, cuántos parqueaderos están disponibles y el historial de ingresos/salidas vehiculares.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Registro de vehículos por unidad (tipo, placa, marca, color)
- Control de parqueaderos: asignación de cupo y disponibilidad
- Log de ingresos y salidas vehiculares (manual o por cámara/ALPR si aplica)

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/RESIDENTES]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Catálogo de vehículos | Página | Vehículos registrados por unidad con parqueadero asignado |
| Registrar / editar vehículo | Modal | Tipo, placa, marca, color, cupo asignado |
| Log de acceso vehicular | Página | Historial de ingresos y salidas |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Mis vehículos | Screen | Vehículos de la unidad del residente |
| Detalle de vehículo | BottomSheet | Datos del vehículo y cupo asignado |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver catálogo | GET | `/vehicles` |
| Registrar vehículo | POST | `/vehicles` |
| Editar vehículo | PATCH | `/vehicles/{id}` |
| Eliminar vehículo | DELETE | `/vehicles/{id}` |
| Ver log de acceso | GET | `/vehicles/access-log` |
| Registrar ingreso/salida | POST | `/vehicles/access-log` |

---

## 7. Reglas de negocio globales

- El número máximo de vehículos por unidad es configurable (ej: 2 por reglamento).
- Solo el admin puede registrar vehículos; el residente puede ver los de su unidad.
- Un vehículo puede tener un cupo de parqueadero asignado (número de cupo).
- El log de acceso vehicular se puede integrar con cámara ALPR en implementaciones avanzadas.

## 8. Estados del recurso

```
activo | inactivo
```

## 9. Endpoints

> Ver [[01-api/endpoints/VEHICULOS]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/vehiculos/VEHICULOS_SPEC]] |
| App | [[03-app/features/vehiculos/VEHICULOS_SPEC]] |
