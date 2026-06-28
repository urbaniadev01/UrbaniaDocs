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

> [!abstract] Sobre Urbania
> **Urbania** es un SaaS colombiano de administración de propiedades horizontales — conjuntos residenciales, edificios y condominios. El objetivo es construir un software que compita al nivel de las plataformas líderes del mercado (BuildingLink, ComunidadFeliz, Yardi Breeze), con un enfoque específico en el mercado latinoamericano y cumplimiento de la normativa colombiana.
>
> El sistema se compone de tres proyectos: **API** (Laravel + DDD), **Web** (React, panel de administración) y **App** (Flutter, experiencia del residente). Los features se diseñan e implementan **uno a la vez**, comenzando por los de nivel `core` (esenciales para el MVP) y avanzando hacia los `extended` (valor agregado).
>
> ### 🇨🇴 Notas clave para el mercado colombiano
> | Ítem | Implicación para el desarrollo |
> |------|-------------------------------|
> | **Ley 675 de 2001** | Exige libro de actas, libro de propietarios y estados financieros auditables — estos features son obligatorios, no opcionales |
> | **PSE (ACH colombiano)** | Pasarela de pagos obligatoria desde el día 1. La integración con Bancolombia y Davivienda es crítica |
> | **WhatsApp** | Canal de comunicación prioritario (vía Meta API o WATI) — email/SMS son secundarios en el mercado colombiano |
> | **Asambleas virtuales** | Reconocidas legalmente desde la pandemia — diferenciador clave frente a competidores locales |
> | **Portería virtual** | Control de acceso y registro de visitas es de los dolores más fuertes en conjuntos colombianos |
> | **Gastos comunes** | El prorrateo por coeficiente de copropiedad es el feature núcleo de facturación, normativo desde el día 1 |

> [!info] Propósito
> Índice de referencia rápida. Cada feature se documenta completa (panorama, endpoints, SPEC, UI) **solo cuando se va a implementar**, uno a la vez.

---

## Estado de Features

El orden refleja la secuencia lógica de desarrollo (dependencias primero).

> [!info] Reinicio de diseños (2026-06-27)
> Se eliminaron los panoramas especulativos de features (ver [[CHANGES_LOG]] CAMBIO-002). Quedan solo los implementados (**Auth**, **Configuración**) y **Propiedades** como ejemplo del método con §6 Modelo de datos. Los demás se rediseñarán **uno a la vez** desde [[FEATURE_PLANNING_TEMPLATE]] cuando se vayan a implementar.

> [!note] Lectura de columnas
> - **Estado (global)**: Propuesto / En progreso / Completado / Bloqueado (ver leyenda inferior).
> - **API**: Implementado (código+tests en main) / Pendiente.
> - **Web**: ✓ Completado (código implementado) / Pendiente.
> - **App**: ✓ Completado (código implementado) / Pendiente / N/A.
> - **Panorama**: enlace a `00-shared/features/<NOMBRE>.md`. "—" significa panorama aún no creado.

| #   | Feature                            | Estado      | Nivel    | API                   | Web       | App       | Panorama                              |
| --- | ---------------------------------- | ----------- | -------- | --------------------- | --------- | --------- | ------------------------------------- |
| 1   | Auth                               | Completado  | core     | Implementado          | ✓         | Pendiente | [[00-shared/features/AUTH]]           |
| 2   | Propiedades y unidades             | En progreso | core     | Pendiente             | Pendiente | Pendiente | [[00-shared/features/PROPIEDADES]]    |
| 3   | Configuración (Perfil y Seguridad) | En progreso | core     | Implementado vía AUTH | Pendiente | N/A       | [[00-shared/features/CONFIGURACION]]  |
| 4   | Directorio (Residentes y Propietarios) | Propuesto | core  | Pendiente             | Pendiente | Pendiente | —                                     |
| 5   | Roles y Permisos                   | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 6   | Comunicaciones                     | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 7   | Cobranza (Gastos Comunes)          | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 8   | Pagos Online (PSE + tarjeta)       | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 9   | Solicitudes de Mantenimiento       | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 10  | Reserva de Amenidades              | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 11  | Proveedores y Contratistas         | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 12  | Control de Acceso / Portería       | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 13  | Portal Residente (web + app)       | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 14  | Incidencias / Cumplimiento         | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 15  | Archivo Documental                 | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 16  | Reportes Básicos (dashboard)       | Propuesto   | core     | Pendiente             | Pendiente | Pendiente | —                                     |
| 17  | Contabilidad                       | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 18  | Presupuestos                       | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 19  | Asambleas y Votaciones             | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 20  | Órdenes de Compra                  | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 21  | Inspecciones                       | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 22  | Administración de Llaves           | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 23  | Portal Propietario                 | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 24  | Seguros                            | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 25  | Onboarding / Migración             | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 26  | Rentas / Alquileres                | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 27  | Chatbot / AI Asistente             | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |
| 28  | Marketplace / Integraciones        | Propuesto   | extended | Pendiente             | Pendiente | Pendiente | —                                     |

### Leyenda

| Estado | Significado |
|---|---|
| Propuesto | Planificado, sin diseño ni implementación |
| En progreso | Al menos un proyecto implementando |
| Completado | Completado en todos los proyectos donde aplica (los marcados N/A, o cuyo proyecto aún no inicia, no bloquean) |
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
