---
type: index
status: active
priority: P0
module: shared
tags: [features, index, cross-project, shared]
updated: 2026-06-23
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

| # | Feature | Estado | Nivel | API | Web | App | Panorama |
|---|---|---|---|---|---|---|---|---|
| 1 | Auth | Completado | core | Implementado | ✓ Sesión 1-2 | P0 | [[00-shared/features/AUTH]] |
| 2 | Propiedades y unidades | En progreso | core | Diseñado | Sesión 3 | Pendiente | [[00-shared/features/PROPIEDADES]] |
| 3 | Residentes y propietarios | En progreso | core | Diseñado | Sesión 4 | P0 | [[00-shared/features/RESIDENTES]] |
| 4 | Cuotas de administración | En progreso | core | Diseñado | Sesión 5 | P1 | [[00-shared/features/CUOTAS]] |
| 5 | Pagos y recibos | En progreso | core | Diseñado | Sesión 6 | P1 | [[00-shared/features/PAGOS]] |
| 6 | Cartera de mora | En progreso | core | Diseñado | Sesión 7 | P1 | [[00-shared/features/MORA]] |
| 7 | Presupuesto y fondo de reserva | En progreso | core | Diseñado | Sesión 8 | N/A | [[00-shared/features/PRESUPUESTO]] |
| 8 | Notificaciones | En progreso | core | Diseñado | Sesión 9 | P0 | [[00-shared/features/NOTIFICACIONES]] |
| 9 | Comunicados y circulares | En progreso | core | Diseñado | Sesión 10 | P1 | [[00-shared/features/COMUNICADOS]] |
| 10 | PQRS | En progreso | core | Diseñado | Sesión 11 | P1 | [[00-shared/features/PQRS]] |
| 11 | Órdenes de trabajo | En progreso | core | Diseñado | Sesión 12 | P1 | [[00-shared/features/ORDENES-TRABAJO]] |
| 12 | Asambleas | En progreso | core | Diseñado | Sesión 13 | P1 | [[00-shared/features/ASAMBLEAS]] |
| 13 | Votaciones y encuestas | En progreso | extended | Diseñado | Sesión 14 | P2 | [[00-shared/features/VOTACIONES]] |
| 14 | Control de visitantes | En progreso | core | Diseñado | Sesión 15 | P1 | [[00-shared/features/VISITANTES]] |
| 15 | Control de vehículos | En progreso | extended | Diseñado | Sesión 16 | P2 | [[00-shared/features/VEHICULOS]] |
| 16 | Correspondencia y paquetes | En progreso | extended | Diseñado | N/A | P2 | [[00-shared/features/PAQUETES]] † |
| 17 | Reservas de áreas comunes | En progreso | extended | Diseñado | Sesión 17 | P1 | [[00-shared/features/RESERVAS]] |
| 18 | Mantenimiento preventivo | En progreso | extended | Diseñado | Sesión 18 | N/A | [[00-shared/features/MANTENIMIENTO]] |
| 19 | Proveedores y contratos | En progreso | extended | Diseñado | Sesión 19 | N/A | [[00-shared/features/PROVEEDORES]] |
| 20 | Cuentas por pagar | En progreso | extended | Diseñado | Sesión 20 | N/A | [[00-shared/features/CUENTAS-PAGAR]] |
| 21 | Informes financieros y asamblea | En progreso | core | Diseñado | Sesión 21 | N/A | [[00-shared/features/INFORMES]] |
| 22 | KPI Dashboard | En progreso | extended | Diseñado | Sesión 22 | N/A | [[00-shared/features/DASHBOARD]] |
| 23 | Configuración (Layout, Perfil y Seguridad) | En progreso | core | Implementado vía AUTH §1.x | ✓ (carpeta `02-web/features/configuracion/`) | N/A | [[00-shared/features/CONFIGURACION]] |

> † El panorama `00-shared/features/PAQUETES.md` y los specs de App (`03-app/features/paquetes/`) están pendientes de creación. El contrato de endpoints ya está en `01-api/endpoints/PAQUETES.md`.

> [!note] Actualización 2026-06-23
> Los pendientes anteriores ya están resueltos: panorama `00-shared/features/PAQUETES.md` y `03-app/features/paquetes/` (SPEC + 3 UI) creados. Auth App también completo: `03-app/features/auth/` ahora tiene `AUTH_SPEC.md` + 4 UI (login, verificacion-mfa, recuperar-contrasena, resetear-contrasena).

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
7. Al completar: cerrar [[CHANGES_LOG]], actualizar estado en esta tabla

---

## Documentos relacionados

| Documento | Propósito |
|---|---|
| [[FEATURE_PLANNING_TEMPLATE]] | Template para el panorama de un feature |
| [[CHANGES_LOG]] | Cambios cross-project en curso |
| [[SYSTEM_CONTRACT]] | Contrato formal entre proyectos |
