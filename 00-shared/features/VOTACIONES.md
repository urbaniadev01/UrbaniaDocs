---
type: feature-panorama
status: active
module: shared
tags: [votaciones, encuestas, gobernanza, shared]
updated: 2026-06-22
---

# Feature: Votaciones y encuestas

## 1. Resumen y motivación

Permite al administrador crear votaciones formales (vinculadas a asambleas) y encuestas informales. Los residentes votan desde la app o el web y los resultados se calculan en tiempo real ponderados por coeficiente de copropiedad.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Votaciones formales vinculadas a asambleas (ponderadas por coeficiente)
- Encuestas informales (un voto por residente, sin ponderación)
- Resultado en tiempo real con porcentaje y coeficiente acumulado
- Cierre manual o automático por fecha límite

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/ASAMBLEAS]], [[00-shared/features/RESIDENTES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de votaciones | Página | Votaciones activas, cerradas y borradores |
| Crear votación | Modal | Tipo, pregunta, opciones, fecha límite |
| Detalle / resultados | Página | Resultados en tiempo real + panel de votos |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de votaciones activas | Screen | Votaciones en las que puede participar |
| Votar | Screen | Pantalla de voto con las opciones |
| Resultados | Screen | Resultado de votaciones cerradas o de su propio voto |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver lista | GET | `/votes` |
| Crear votación | POST | `/votes` |
| Ver detalle / resultados | GET | `/votes/{id}` |
| Emitir voto | POST | `/votes/{id}/cast` |
| Cerrar votación | POST | `/votes/{id}/close` |

---

## 7. Reglas de negocio globales

- En votaciones formales, el voto vale por el coeficiente de la unidad del votante.
- En encuestas, un residente = un voto, sin ponderación.
- Un residente solo puede votar una vez; no puede cambiar su voto.
- Al cerrar, los resultados quedan congelados y se publica el detalle.
- Una votación cerrada puede vincularse a un punto del acta de asamblea.

## 8. Estados del recurso

```
borrador → activa → cerrada
```

## 9. Endpoints

> Ver [[01-api/endpoints/VOTACIONES]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/votaciones/VOTACIONES_SPEC]] |
| App | [[03-app/features/votaciones/VOTACIONES_SPEC]] |
