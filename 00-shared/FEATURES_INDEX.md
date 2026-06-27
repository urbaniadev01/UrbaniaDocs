---
type: index
status: active
priority: P0
module: shared
tags: [features, index, shared]
updated: 2026-06-27
---

# FEATURES_INDEX
## Índice Global de Features — Urbania

> [!info] Propósito
> Índice de referencia rápida. Cada feature se documenta completa (panorama, endpoints, SPEC, UI) **solo cuando se va a implementar**, uno a la vez.

---

## Estado de Features

El orden refleja la secuencia lógica de desarrollo (dependencias primero).

> [!note] Lectura de columnas
> - **Estado (global)**: Propuesto / En progreso / Completado / Bloqueado (ver leyenda inferior).
> - **API**: Implementado (código+tests en main) / Pendiente.
> - **Web**: ✓ Completado (código implementado) / Pendiente.
> - **App**: ✓ Completado (código implementado) / Pendiente / N/A.
> - **Panorama**: enlace a `00-shared/features/<NOMBRE>.md`. "—" significa panorama aún no creado.

| # | Feature | Estado | Nivel | API | Web | App | Panorama |
|---|---------|--------|-------|-----|-----|-----|----------|
| 1 | Auth | Completado | core | Implementado | ✓ | Pendiente | [[00-shared/features/AUTH]] |
| 2 | Propiedades y unidades | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/PROPIEDADES]] |
| 3 | Residentes y propietarios | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/RESIDENTES]] |
| 4 | Cuotas de administración | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/CUOTAS]] |
| 5 | Pagos y recibos | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/PAGOS]] |
| 6 | Cartera de mora | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/MORA]] |
| 7 | Presupuesto y fondo de reserva | Propuesto | core | Pendiente | Pendiente | N/A | [[00-shared/features/PRESUPUESTO]] |
| 8 | Notificaciones | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/NOTIFICACIONES]] |
| 9 | Comunicados y circulares | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/COMUNICADOS]] |
| 10 | PQRS | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/PQRS]] |
| 11 | Órdenes de trabajo | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/ORDENES-TRABAJO]] |
| 12 | Asambleas | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/ASAMBLEAS]] |
| 13 | Votaciones y encuestas | Propuesto | extended | Pendiente | Pendiente | Pendiente | [[00-shared/features/VOTACIONES]] |
| 14 | Control de visitantes | Propuesto | core | Pendiente | Pendiente | Pendiente | [[00-shared/features/VISITANTES]] |
| 15 | Control de vehículos | Propuesto | extended | Pendiente | Pendiente | Pendiente | [[00-shared/features/VEHICULOS]] |
| 16 | Correspondencia y paquetes | Propuesto | extended | Pendiente | Pendiente | Pendiente | [[00-shared/features/PAQUETES]] |
| 17 | Reservas de áreas comunes | Propuesto | extended | Pendiente | Pendiente | Pendiente | [[00-shared/features/RESERVAS]] |
| 18 | Mantenimiento preventivo | Propuesto | extended | Pendiente | Pendiente | N/A | [[00-shared/features/MANTENIMIENTO]] |
| 19 | Proveedores y contratos | Propuesto | extended | Pendiente | Pendiente | N/A | [[00-shared/features/PROVEEDORES]] |
| 20 | Cuentas por pagar | Propuesto | extended | Pendiente | Pendiente | N/A | [[00-shared/features/CUENTAS-PAGAR]] |
| 21 | Informes financieros y de gestión | Propuesto | core | Pendiente | Pendiente | N/A | [[00-shared/features/INFORMES]] |
| 22 | KPI Dashboard | Propuesto | extended | Pendiente | Pendiente | N/A | [[00-shared/features/DASHBOARD]] |
| 23 | Configuración (Perfil y Seguridad) | Completado | core | Implementado vía AUTH | Pendiente | N/A | [[00-shared/features/CONFIGURACION]] |

### Leyenda

| Estado | Significado |
|---|---|
| Propuesto | Planificado, sin diseño ni implementación |
| En progreso | Al menos un proyecto implementando |
| Completado | Todos los proyectos con CI pasando |
| Bloqueado | Dependencia sin resolver o CI falla |

| Estado API | Significado |
|---|---|
| Implementado | Código y tests en `main` |
| Implementado vía AUTH | Reusa endpoints de Auth ya implementados |
| Pendiente | Sin documentar ni implementar |

> [!note] Nivel `core` = esencial para el MVP; `extended` = valor agregado.
> Los features se documentan **uno a la vez** — solo se crean los archivos de diseño del feature que se va a implementar en ese momento.

---

## Docs por feature

Cada feature, **cuando está en implementación activa**, genera los siguientes documentos:

```
00-shared/features/<NOMBRE>.md                        ← Panorama: análisis, reglas de negocio
01-api/endpoints/<FEATURE>.md                         ← Detalle técnico de endpoints
02-web/features/<nombre>/                             ← Carpeta del feature (web)
  <NOMBRE>_SPEC.md                                     ← Implementación técnica web
  <NOMBRE>_UI_<pantalla>.md                            ← Diseño visual (un archivo por pantalla)
03-app/features/<nombre>/                             ← Carpeta del feature (app)
  <NOMBRE>_SPEC.md                                     ← Implementación técnica app
  <NOMBRE>_UI_<pantalla>.md                            ← Diseño visual (un archivo por pantalla)
```

Las plantillas están en `02-web/features/_templates/` y `03-app/features/_templates/`.

---

## Cómo agregar un feature nuevo

1. Crear `00-shared/features/<NOMBRE>.md` desde [[FEATURE_PLANNING_TEMPLATE]]
2. Agregar fila en la tabla de estado arriba
3. Abrir entrada en [[CHANGES_LOG]]
4. API documenta en `01-api/endpoints/<FEATURE>.md`
5. Web crea `02-web/features/<nombre>/` con `<NOMBRE>_SPEC.md` y `<NOMBRE>_UI_<pantalla>.md` desde `_templates/`
6. App crea `03-app/features/<nombre>/` con `<NOMBRE>_SPEC.md` y `<NOMBRE>_UI_<pantalla>.md` desde `_templates/`
7. Al completar: cerrar [[CHANGES_LOG]], actualizar estado en tabla

---

## Documentos relacionados

| Documento | Propósito |
|---|---|
| [[FEATURE_PLANNING_TEMPLATE]] | Template para el panorama de un feature |
| [[CHANGES_LOG]] | Cambios cross-project en curso |
| [[SYSTEM_CONTRACT]] | Contrato formal entre proyectos |
