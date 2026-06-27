---
type: index
status: active
priority: P0
module: shared
tags: [features, index, screen-catalog, cross-project, shared]
updated: 2026-06-27
---

# 📋 FEATURES_INDEX
## Índice Global de Features — Urbania

> [!info] Propósito
> Índice de referencia rápida. Para el análisis completo de un feature (pantallas, reglas de negocio, endpoints), ver su panorama en `00-shared/features/<NOMBRE>.md`.

> [!warning] Fuente de verdad de endpoints
> `01-api/API_CONTRACT.md` (índice) y `01-api/endpoints/<FEATURE>.md` (detalle). Ningún otro documento duplica request/response.

---

## Estado de Features

El orden refleja la secuencia lógica de desarrollo (dependencias primero).

> [!note] Lectura de columnas
> - **Estado (global)**: Propuesto / En progreso / Completado / Bloqueado (ver leyenda inferior).
> - **API**: Implementado (código+tests en main) / Diseñado (contrato en `01-api/endpoints/<FEATURE>.md`, sin código) / Pendiente.
> - **Web**: número de sesión planificada en `02-web/WEB_IMPLEMENTATION_PLAN` o "✓ Completado" si ya documentada/implementada.
> - **App**: prioridad P0/P1/P2 definida en `03-app/APP_FEATURE_SCOPE` o "✓ Completado". N/A = no aplica.
> - **Panorama**: enlace a `00-shared/features/<NOMBRE>.md`. "—" significa panorama aún no creado.

| #   | Feature                                    | Estado      | Nivel    | API                        | Web                                          | App       | Panorama                               |     |
| --- | ------------------------------------------ | ----------- | -------- | -------------------------- | -------------------------------------------- | --------- | -------------------------------------- | --- |
| 1   | Auth                                       | Completado  | core     | Implementado               | ✓ Sesión 1-2                                 | P0        | [[00-shared/features/AUTH]]            |     |
| 2   | Propiedades y unidades                     | En progreso | core     | Diseñado                   | Sesión 3                                     | Pendiente | [[00-shared/features/PROPIEDADES]]     |     |
| 3   | Residentes y propietarios                  | En progreso | core     | Diseñado                   | Sesión 4                                     | P0        | [[00-shared/features/RESIDENTES]]      |     |
| 4   | Cuotas de administración                   | En progreso | core     | Diseñado                   | Sesión 5                                     | P1        | [[00-shared/features/CUOTAS]]          |     |
| 5   | Pagos y recibos                            | En progreso | core     | Diseñado                   | Sesión 6                                     | P1        | [[00-shared/features/PAGOS]]           |     |
| 6   | Cartera de mora                            | En progreso | core     | Diseñado                   | Sesión 7                                     | P1        | [[00-shared/features/MORA]]            |     |
| 7   | Presupuesto y fondo de reserva             | En progreso | core     | Diseñado                   | Sesión 8                                     | N/A       | [[00-shared/features/PRESUPUESTO]]     |     |
| 8   | Notificaciones                             | En progreso | core     | Diseñado                   | Sesión 9                                     | P0        | [[00-shared/features/NOTIFICACIONES]]  |     |
| 9   | Comunicados y circulares                   | En progreso | core     | Diseñado                   | Sesión 10                                    | P1        | [[00-shared/features/COMUNICADOS]]     |     |
| 10  | PQRS                                       | En progreso | core     | Diseñado                   | Sesión 11                                    | P1        | [[00-shared/features/PQRS]]            |     |
| 11  | Órdenes de trabajo                         | En progreso | core     | Diseñado                   | Sesión 12                                    | P1        | [[00-shared/features/ORDENES-TRABAJO]] |     |
| 12  | Asambleas                                  | En progreso | core     | Diseñado                   | Sesión 13                                    | P1        | [[00-shared/features/ASAMBLEAS]]       |     |
| 13  | Votaciones y encuestas                     | En progreso | extended | Diseñado                   | Sesión 14                                    | P2        | [[00-shared/features/VOTACIONES]]      |     |
| 14  | Control de visitantes                      | En progreso | core     | Diseñado                   | Sesión 15                                    | P1        | [[00-shared/features/VISITANTES]]      |     |
| 15  | Control de vehículos                       | En progreso | extended | Diseñado                   | Sesión 16                                    | P2        | [[00-shared/features/VEHICULOS]]       |     |
| 16  | Correspondencia y paquetes                 | En progreso | extended | Diseñado                   | N/A                                          | P2        | [[00-shared/features/PAQUETES]]        |     |
| 17  | Reservas de áreas comunes                  | En progreso | extended | Diseñado                   | Sesión 17                                    | P1        | [[00-shared/features/RESERVAS]]        |     |
| 18  | Mantenimiento preventivo                   | En progreso | extended | Diseñado                   | Sesión 18                                    | N/A       | [[00-shared/features/MANTENIMIENTO]]   |     |
| 19  | Proveedores y contratos                    | En progreso | extended | Diseñado                   | Sesión 19                                    | N/A       | [[00-shared/features/PROVEEDORES]]     |     |
| 20  | Cuentas por pagar                          | En progreso | extended | Diseñado                   | Sesión 20                                    | N/A       | [[00-shared/features/CUENTAS-PAGAR]]   |     |
| 21  | Informes financieros y asamblea            | En progreso | core     | Diseñado                   | Sesión 21                                    | N/A       | [[00-shared/features/INFORMES]]        |     |
| 22  | KPI Dashboard                              | En progreso | extended | Diseñado                   | Sesión 22                                    | N/A       | [[00-shared/features/DASHBOARD]]       |     |
| 23  | Configuración (Layout, Perfil y Seguridad) | En progreso | core     | Implementado vía AUTH §1.x | ✓ (carpeta `02-web/features/configuracion/`) | N/A       | [[00-shared/features/CONFIGURACION]]   |     |

### Leyenda

| Estado | Significado |
|---|---|
| Propuesto | Planificado, sin iniciar |
| En progreso | Al menos un proyecto implementando |
| Completado | Todos los proyectos con CI pasando |
| Bloqueado | Dependencia sin resolver o CI falla |

| Estado API | Significado |
|---|---|
| Implementado | Código y tests en `main`, endpoints en `API_CONTRACT` |
| Implementado vía AUTH | No introduce endpoints nuevos; reusa `§1.x` ya implementado (ver [[01-api/endpoints/CONFIGURACION]]) |
| Diseñado | Documentado en `endpoints/` + `API_CONTRACT`, sin implementar |
| Pendiente | Sin documentar |

> [!note] Nivel `core` = esencial para el MVP; `extended` = valor agregado. La columna **Web** muestra el número de sesión planificada en `02-web/WEB_IMPLEMENTATION_PLAN` o "✓" si ya existe carpeta. La columna **App** muestra la prioridad en `03-app/APP_FEATURE_SCOPE`. N/A = no aplica para ese proyecto.

---

## 🖥️ Catálogo Global de Pantallas

> [!info] Mapa único de todas las pantallas del sistema
> Cada fila representa una pantalla documentada. ✅ = archivo `_UI_*.md` existe en disco. — = no aplica para ese proyecto.
> El detalle visual de cada pantalla está en `02-web/features/<feature>/<NOMBRE>_UI_<pantalla>.md` o `03-app/features/<feature>/<NOMBRE>_UI_<pantalla>.md`.

| # | Feature | Pantalla | Web | App | Panorama |
|---|---------|----------|:---:|:---:|----------|
| 1 | Auth | Login | ✅ | ✅ | [[AUTH]] |
| 1 | Auth | Verificación MFA | ✅ | ✅ | [[AUTH]] |
| 1 | Auth | Recuperar contraseña | ✅ | ✅ | [[AUTH]] |
| 1 | Auth | Resetear contraseña | ✅ | ✅ | [[AUTH]] |
| 2 | Propiedades y unidades | Lista de propiedades | ✅ | ✅ | [[PROPIEDADES]] |
| 2 | Propiedades y unidades | Detalle de unidad | ✅ | ✅ | [[PROPIEDADES]] |
| 2 | Propiedades y unidades | Crear / editar unidad | ✅ | — | [[PROPIEDADES]] |
| 2 | Propiedades y unidades | Cambiar estado de unidad | ✅ | — | [[PROPIEDADES]] |
| 2 | Propiedades y unidades | Eliminar unidad | ✅ | — | [[PROPIEDADES]] |
| 3 | Residentes y propietarios | Lista de residentes | ✅ | ✅ | [[RESIDENTES]] |
| 3 | Residentes y propietarios | Perfil de residente | ✅ | ✅ | [[RESIDENTES]] |
| 3 | Residentes y propietarios | Crear residente | ✅ | — | [[RESIDENTES]] |
| 3 | Residentes y propietarios | Editar residente | ✅ | — | [[RESIDENTES]] |
| 3 | Residentes y propietarios | Cambiar unidad asignada | ✅ | — | [[RESIDENTES]] |
| 3 | Residentes y propietarios | Desactivar residente | ✅ | — | [[RESIDENTES]] |
| 4 | Cuotas de administración | Lista de cuotas del período | ✅ | ✅ | [[CUOTAS]] |
| 4 | Cuotas de administración | Detalle de cuota por unidad | ✅ | ✅ | [[CUOTAS]] |
| 4 | Cuotas de administración | Generar cuotas del mes | ✅ | — | [[CUOTAS]] |
| 4 | Cuotas de administración | Ajuste manual de cuota | ✅ | — | [[CUOTAS]] |
| 4 | Cuotas de administración | Detalle de cálculo | ✅ | — | [[CUOTAS]] |
| 5 | Pagos y recibos | Lista de pagos | ✅ | ✅ | [[PAGOS]] |
| 5 | Pagos y recibos | Registrar pago | ✅ | ✅ | [[PAGOS]] |
| 5 | Pagos y recibos | Detalle de pago | ✅ | ✅ | [[PAGOS]] |
| 5 | Pagos y recibos | Anular pago | ✅ | — | [[PAGOS]] |
| 5 | Pagos y recibos | Recibo de pago | ✅ | — | [[PAGOS]] |
| 6 | Cartera de mora | Reporte de mora | ✅ | ✅ | [[MORA]] |
| 6 | Cartera de mora | Detalle de mora por unidad | ✅ | ✅ | [[MORA]] |
| 6 | Cartera de mora | Generar acuerdo de pago | ✅ | — | [[MORA]] |
| 7 | Presupuesto y fondo de reserva | Presupuesto del año | ✅ | — | [[PRESUPUESTO]] |
| 7 | Presupuesto y fondo de reserva | Crear / editar presupuesto | ✅ | — | [[PRESUPUESTO]] |
| 7 | Presupuesto y fondo de reserva | Detalle de categoría | ✅ | — | [[PRESUPUESTO]] |
| 7 | Presupuesto y fondo de reserva | Fondo de reserva | ✅ | — | [[PRESUPUESTO]] |
| 8 | Notificaciones | Centro de notificaciones | ✅ | ✅ | [[NOTIFICACIONES]] |
| 8 | Notificaciones | Panel de notificaciones (header) | ✅ | — | [[NOTIFICACIONES]] |
| 8 | Notificaciones | Detalle de notificación | ✅ | ✅ | [[NOTIFICACIONES]] |
| 8 | Notificaciones | Preferencias de notificaciones | ✅ | ✅ | [[NOTIFICACIONES]] |
| 9 | Comunicados y circulares | Lista de comunicados | ✅ | ✅ | [[COMUNICADOS]] |
| 9 | Comunicados y circulares | Crear / editar comunicado | ✅ | — | [[COMUNICADOS]] |
| 9 | Comunicados y circulares | Detalle de comunicado | ✅ | ✅ | [[COMUNICADOS]] |
| 9 | Comunicados y circulares | Estadísticas de lectura | ✅ | — | [[COMUNICADOS]] |
| 10 | PQRS | Lista de PQRS | ✅ | ✅ | [[PQRS]] |
| 10 | PQRS | Detalle de PQRS | ✅ | ✅ | [[PQRS]] |
| 10 | PQRS | Crear PQRS | ✅ | ✅ | [[PQRS]] |
| 10 | PQRS | Cambiar estado | ✅ | — | [[PQRS]] |
| 10 | PQRS | Asignar responsable | ✅ | — | [[PQRS]] |
| 10 | PQRS | Estadísticas PQRS | ✅ | — | [[PQRS]] |
| 11 | Órdenes de trabajo | Lista de órdenes | ✅ | ✅ | [[ORDENES-TRABAJO]] |
| 11 | Órdenes de trabajo | Crear orden | ✅ | — | [[ORDENES-TRABAJO]] |
| 11 | Órdenes de trabajo | Detalle de orden | ✅ | ✅ | [[ORDENES-TRABAJO]] |
| 11 | Órdenes de trabajo | Cambiar estado | ✅ | — | [[ORDENES-TRABAJO]] |
| 11 | Órdenes de trabajo | Asignar proveedor | ✅ | — | [[ORDENES-TRABAJO]] |
| 12 | Asambleas | Lista de asambleas | ✅ | ✅ | [[ASAMBLEAS]] |
| 12 | Asambleas | Crear / editar asamblea | ✅ | — | [[ASAMBLEAS]] |
| 12 | Asambleas | Detalle de asamblea | ✅ | ✅ | [[ASAMBLEAS]] |
| 12 | Asambleas | Registro de asistencia | ✅ | — | [[ASAMBLEAS]] |
| 12 | Asambleas | Puntos del orden del día | ✅ | — | [[ASAMBLEAS]] |
| 12 | Asambleas | Publicar acta | ✅ | — | [[ASAMBLEAS]] |
| 13 | Votaciones y encuestas | Lista de votaciones | ✅ | ✅ | [[VOTACIONES]] |
| 13 | Votaciones y encuestas | Crear votación | ✅ | — | [[VOTACIONES]] |
| 13 | Votaciones y encuestas | Detalle / resultados | ✅ | ✅ | [[VOTACIONES]] |
| 13 | Votaciones y encuestas | Votar | — | ✅ | [[VOTACIONES]] |
| 14 | Control de visitantes | Historial de visitantes | ✅ | — | [[VISITANTES]] |
| 14 | Control de visitantes | Detalle de visita | ✅ | ✅ | [[VISITANTES]] |
| 14 | Control de visitantes | Crear visita (portero/admin) | ✅ | — | [[VISITANTES]] |
| 14 | Control de visitantes | Preautorizaciones | ✅ | — | [[VISITANTES]] |
| 14 | Control de visitantes | Mis visitantes | — | ✅ | [[VISITANTES]] |
| 14 | Control de visitantes | Preautorizar visita | — | ✅ | [[VISITANTES]] |
| 14 | Control de visitantes | Escaneo QR (portero) | — | ✅ | [[VISITANTES]] |
| 15 | Control de vehículos | Catálogo de vehículos | ✅ | — | [[VEHICULOS]] |
| 15 | Control de vehículos | Registrar / editar vehículo | ✅ | — | [[VEHICULOS]] |
| 15 | Control de vehículos | Log de acceso vehicular | ✅ | — | [[VEHICULOS]] |
| 15 | Control de vehículos | Mis vehículos | — | ✅ | [[VEHICULOS]] |
| 15 | Control de vehículos | Detalle de vehículo | — | ✅ | [[VEHICULOS]] |
| 16 | Correspondencia y paquetes | Lista de paquetes | — | ✅ | [[PAQUETES]] |
| 16 | Correspondencia y paquetes | Detalle de paquete | — | ✅ | [[PAQUETES]] |
| 16 | Correspondencia y paquetes | Confirmar entrega | — | ✅ | [[PAQUETES]] |
| 17 | Reservas de áreas comunes | Gestión de áreas comunes | ✅ | — | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Crear / editar área | ✅ | — | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Gestión de reservas | ✅ | — | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Detalle de reserva | ✅ | — | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Aprobar / rechazar reserva | ✅ | — | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Áreas comunes | — | ✅ | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Calendario de reservas | — | ✅ | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Crear reserva | — | ✅ | [[RESERVAS]] |
| 17 | Reservas de áreas comunes | Mis reservas | — | ✅ | [[RESERVAS]] |
| 18 | Mantenimiento preventivo | Catálogo de activos | ✅ | — | [[MANTENIMIENTO]] |
| 18 | Mantenimiento preventivo | Crear / editar activo | ✅ | — | [[MANTENIMIENTO]] |
| 18 | Mantenimiento preventivo | Plan de mantenimiento | ✅ | — | [[MANTENIMIENTO]] |
| 18 | Mantenimiento preventivo | Crear / editar tarea | ✅ | — | [[MANTENIMIENTO]] |
| 18 | Mantenimiento preventivo | Historial de mantenimientos | ✅ | — | [[MANTENIMIENTO]] |
| 19 | Proveedores y contratos | Catálogo de proveedores | ✅ | — | [[PROVEEDORES]] |
| 19 | Proveedores y contratos | Crear / editar proveedor | ✅ | — | [[PROVEEDORES]] |
| 19 | Proveedores y contratos | Detalle de proveedor | ✅ | — | [[PROVEEDORES]] |
| 19 | Proveedores y contratos | Crear / editar contrato | ✅ | — | [[PROVEEDORES]] |
| 19 | Proveedores y contratos | Documentos del contrato | ✅ | — | [[PROVEEDORES]] |
| 20 | Cuentas por pagar | Lista de cuentas por pagar | ✅ | — | [[CUENTAS-PAGAR]] |
| 20 | Cuentas por pagar | Registrar cuenta | ✅ | — | [[CUENTAS-PAGAR]] |
| 20 | Cuentas por pagar | Detalle de cuenta | ✅ | — | [[CUENTAS-PAGAR]] |
| 20 | Cuentas por pagar | Aprobar cuenta | ✅ | — | [[CUENTAS-PAGAR]] |
| 20 | Cuentas por pagar | Registrar pago de cuenta | ✅ | — | [[CUENTAS-PAGAR]] |
| 21 | Informes financieros y de gestión | Centro de informes | ✅ | — | [[INFORMES]] |
| 21 | Informes financieros y de gestión | Informe financiero | ✅ | — | [[INFORMES]] |
| 21 | Informes financieros y de gestión | Informe de cartera | ✅ | — | [[INFORMES]] |
| 21 | Informes financieros y de gestión | Informe de gestión | ✅ | — | [[INFORMES]] |
| 22 | KPI Dashboard | Dashboard principal | ✅ | — | [[DASHBOARD]] |
| 22 | KPI Dashboard | Widget financiero | ✅ | — | [[DASHBOARD]] |
| 23 | Configuración | Perfil | ✅ | — | [[CONFIGURACION]] |
| 23 | Configuración | Seguridad | ✅ | — | [[CONFIGURACION]] |
| 23 | Configuración | Cambiar contraseña | ✅ | — | [[CONFIGURACION]] |
| 23 | Configuración | Setup MFA | ✅ | — | [[CONFIGURACION]] |
| 23 | Configuración | Sesiones activas | ✅ | — | [[CONFIGURACION]] |

> [!note] **Total:** 102 pantallas documentadas (✅). 81 Web · 35 App · 14 compartidas (misma pantalla en ambos proyectos).
> Las pantallas marcadas con ✅ tienen su archivo `_UI_<pantalla>.md` en la carpeta correspondiente de `02-web/features/` o `03-app/features/`.

---

## Docs por feature

Cada feature tiene los siguientes documentos cuando está activo:

```
00-shared/features/<NOMBRE>.md                        ← Panorama: análisis, pantallas, reglas, endpoints
01-api/endpoints/<FEATURE>.md                         ← Detalle técnico de endpoints
02-web/features/<nombre>/                             ← Carpeta del feature (nombre en minúsculas)
  <NOMBRE>_SPEC.md                                    ← Implementación técnica web
  <NOMBRE>_UI_<pantalla>.md                           ← Diseño visual (un archivo por pantalla)
  <NOMBRE>_*                                          ← Archivos adicionales (mockups, HTML, imágenes)
03-app/features/<nombre>/                             ← Carpeta del feature (nombre en minúsculas)
  <NOMBRE>_SPEC.md                                    ← Implementación técnica app
  <NOMBRE>_UI_<pantalla>.md                           ← Diseño visual (un archivo por pantalla)
  <NOMBRE>_*                                          ← Archivos adicionales (mockups, imágenes)
02-web/features/_templates/                           ← Plantillas (no modificar directamente)
03-app/features/_templates/                           ← Plantillas (no modificar directamente)
```

---

## Cómo agregar un feature nuevo

1. Crear `00-shared/features/<NOMBRE>.md` desde [[FEATURE_PLANNING_TEMPLATE]]
2. Agregar fila en la tabla de estado arriba
3. Abrir entrada en [[CHANGES_LOG]]
4. API documenta en `01-api/endpoints/<FEATURE>.md` + `01-api/API_CONTRACT.md`
5. Web crea `02-web/features/<nombre>/` con `<NOMBRE>_SPEC.md` y `<NOMBRE>_UI_<pantalla>.md` desde `_templates/`
6. App crea `03-app/features/<nombre>/` con `<NOMBRE>_SPEC.md` y `<NOMBRE>_UI_<pantalla>.md` desde `_templates/`
7. Agregar filas en el **Catálogo Global de Pantallas** (arriba, §"Catálogo Global de Pantallas")
8. Al completar: cerrar [[CHANGES_LOG]], actualizar estado en tabla y catálogo

---

## Documentos relacionados

| Documento | Propósito |
|---|---|
| [[FEATURE_PLANNING_TEMPLATE]] | Template para el panorama de un feature |
| [[FEATURES_Y_PANTALLAS]] | Documento histórico de prompts para generación inicial de features |
| [[CHANGES_LOG]] | Cambios cross-project en curso |
| [[SYSTEM_CONTRACT]] | Contrato formal entre proyectos |
