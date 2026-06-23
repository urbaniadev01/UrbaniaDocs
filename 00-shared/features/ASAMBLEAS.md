---
type: feature-panorama
status: active
module: shared
tags: [asambleas, gobernanza, shared]
updated: 2026-06-22
---

# Feature: Asambleas

## 1. Resumen y motivación

Gestiona el ciclo completo de las asambleas de propietarios: convocatoria, asistencia, orden del día, actas y documentos derivados. Digitaliza un proceso que hoy ocurre en papel o en grupos de WhatsApp.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Creación de convocatoria con orden del día, fecha, hora y lugar
- Registro de asistencia (presencial y virtual), con cálculo de quórum en tiempo real
- Gestión de puntos del orden del día con votaciones integradas (link a VOTACIONES)
- Generación y publicación del acta en PDF

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/RESIDENTES]], [[00-shared/features/NOTIFICACIONES]]
- Es consumido por: [[00-shared/features/VOTACIONES]], [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de asambleas | Página | Historial + próximas asambleas |
| Crear / editar asamblea | Modal | Convocatoria con orden del día |
| Detalle de asamblea | Página | Gestión en vivo: asistencia, puntos, votaciones |
| Registro de asistencia | Inline | Tabla de asistentes dentro del detalle |
| Puntos del orden del día | Inline | Lista de puntos con estado y link a votaciones |
| Publicar acta | Modal | Confirmación + upload del PDF del acta |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de asambleas | Screen | Próximas y pasadas asambleas |
| Detalle de asamblea | Screen | Convocatoria, puntos, acta descargable |

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver lista | GET | `/assemblies` |
| Crear asamblea | POST | `/assemblies` |
| Ver detalle | GET | `/assemblies/{id}` |
| Registrar asistencia | POST | `/assemblies/{id}/attendance` |
| Actualizar estado de punto | PATCH | `/assemblies/{id}/agenda-items/{item_id}` |
| Publicar acta | POST | `/assemblies/{id}/minutes` |

---

## 7. Reglas de negocio globales

- El quórum mínimo para deliberar es el 50%+1 del coeficiente total (configurable por reglamento).
- La convocatoria debe publicarse con al menos 15 días de anticipación (configurable).
- Los puntos que requieren votación crean una Votación vinculada automáticamente.
- El acta firmada en PDF es el documento legal; el sistema solo lo almacena y publica.

## 8. Estados del recurso

```
convocada → en_curso → finalizada | cancelada
```

## 9. Endpoints

> Ver [[01-api/endpoints/ASAMBLEAS]] para el detalle completo.

## 11. Documentos de implementación

| Proyecto | Spec técnico |
|---|---|
| Web | [[02-web/features/asambleas/ASAMBLEAS_SPEC]] |
| App | [[03-app/features/asambleas/ASAMBLEAS_SPEC]] |
