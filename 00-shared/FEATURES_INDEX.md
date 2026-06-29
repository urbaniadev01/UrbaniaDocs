---
type: index
status: active
priority: P0
module: shared
tags: [features, index, shared]
updated: 2026-06-29
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
| 2   | Propiedades y unidades             | En progreso | core     | Implementado          | ✓         | Pendiente | [[00-shared/features/PROPIEDADES]]    |
| 3   | Configuración (Perfil y Seguridad) | En progreso | core     | Implementado vía AUTH | Pendiente | N/A       | [[00-shared/features/CONFIGURACION]]  |
| 4   | Directorio (Residentes y Propietarios) | En progreso | core     | Implementado          | ✓         | Pendiente | [[00-shared/features/DIRECTORIO]]     |
| 5   | Roles y Permisos                   | En progreso | core     | Implementado          | Pendiente | Pendiente | —                                     |
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

## Catálogo de pantallas por feature

> Subregistros de pantallas por feature. Cada feature enlaza a su doc en `00-shared/features/`. Mientras una feature no esté diseñada, el detalle de sus pantallas (tipo, descripción, benchmarking, modelo de datos) vive en [[_RESEARCH_pantallas-mvp]] y [[_RESEARCH_modelo-datos]]; al diseñarla, se completa su §5 y el enlace resuelve.

### Núcleo MVP (features 1–16)

- **1 · Auth** — [[00-shared/features/AUTH]]
    - Web: Login · Verificación MFA · Recuperar contraseña · Resetear contraseña
    - App: flujo nativo
- **2 · Propiedades y unidades** — [[00-shared/features/PROPIEDADES]]
    - Web: Dashboard del conjunto · Lista de propiedades · Detalle de unidad · Crear/editar unidad · Cambiar estado · Eliminar unidad · Gestionar torres · Gestionar tipos · Gestionar estados · Documentos de unidad · Mapa del conjunto *(post-MVP)*
    - App: Lista de unidades · Detalle de unidad
- **3 · Configuración (Perfil y Seguridad)** — [[00-shared/features/CONFIGURACION]]
    - Web: Perfil · Seguridad · Cambiar contraseña · Setup MFA · Sesiones activas
    - App: N/A
- **4 · Directorio** — [[00-shared/features/DIRECTORIO]]
    - Web: Directorio general · Detalle de contacto · Crear/editar contacto · Vincular contacto a unidad · Vista por unidad · Historial de ocupantes · Gestionar tipos de ocupante · Importar directorio *(post-MVP)* · Migrar *(post-MVP)*
    - App: Mi unidad — Ocupantes · Mi perfil de contacto · Contacto de emergencia
- **5 · Roles y Permisos** — [[00-shared/features/ROLES_PERMISOS|ROLES_PERMISOS]] *(por crear)*
    - Web: Lista de roles · Crear/editar rol · Matriz de permisos · Reglas de aprobación · Usuarios del panel · Invitar usuario · Detalle de usuario · Delegación temporal · Alertas de conflicto · Catálogo de recursos · Auditoría de permisos
    - App: N/A
- **6 · Comunicaciones** — [[00-shared/features/COMUNICACIONES|COMUNICACIONES]] *(por crear)*
    - Web: Bandeja de comunicados · Redactar comunicado · Detalle de comunicado · Cartelera/muro · Plantillas · Encuestas · Resultados de encuesta · Configurar canales
    - App: Muro/Avisos · Detalle de aviso · Encuestas · Preferencias de notificación
- **7 · Cobranza (Gastos Comunes)** — [[00-shared/features/COBRANZA|COBRANZA]] *(por crear)*
    - Web: Panel de cartera · Generar facturación · Lista de cuentas de cobro · Detalle de cuenta · Configurar conceptos · Registrar pago/abono · Generar paz y salvo · Acuerdos de pago · Cartera por edades
    - App: Mi estado de cuenta · Detalle de cuenta · Mi paz y salvo
- **8 · Pagos Online (PSE + tarjeta)** — [[00-shared/features/PAGOS|PAGOS]] *(por crear)*
    - Web: Configurar pasarela · Transacciones · Detalle de transacción · Conciliación · Reembolsos
    - App: Checkout/pagar · Selección de banco PSE · Resultado del pago · Métodos guardados · Historial de pagos
- **9 · Solicitudes de Mantenimiento** — [[00-shared/features/MANTENIMIENTO|MANTENIMIENTO]] *(por crear)*
    - Web: Tablero de solicitudes · Detalle/orden de trabajo · Crear orden · Asignar técnico/proveedor · Plan preventivo · Activos/equipos · Categorías y SLA
    - App: Reportar daño · Mis solicitudes · Detalle de solicitud
- **10 · Reserva de Amenidades** — [[00-shared/features/RESERVAS|RESERVAS]] *(por crear)*
    - Web: Calendario de reservas · Gestionar zonas comunes · Detalle de zona · Solicitudes por aprobar · Detalle de reserva · Bloqueos
    - App: Explorar amenidades · Disponibilidad · Nueva reserva · Mis reservas · Detalle de reserva
- **11 · Proveedores y Contratistas** — [[00-shared/features/PROVEEDORES|PROVEEDORES]] *(por crear)*
    - Web: Directorio de proveedores · Ficha de proveedor · Crear/editar proveedor · Documentos y vencimientos · Contratos · Detalle de contrato · Evaluar proveedor
    - App: N/A (ver Portal del Proveedor en clientes)
- **12 · Control de Acceso / Portería** — [[00-shared/features/PORTERIA|PORTERIA]] *(por crear)*
    - Web: Tablero de portería · Registro de visitantes (minuta) · Registrar ingreso/salida · Validar QR · Correspondencia · Registrar paquete · Minuta de turno · Parqueo de visitantes · Listas de acceso
    - App: Autorizar visita · Mis visitas · Minuta de mi unidad · Mi correspondencia · Citofonía virtual · Botón de pánico
- **13 · Portal Residente** — [[00-shared/features/PORTAL_RESIDENTE|PORTAL_RESIDENTE]] *(por crear)*
    - Web: Inicio del residente · Mi unidad · Mi cuenta · Documentos del conjunto · Mi perfil
    - App: Home/dashboard · Menú principal · Centro de notificaciones · Mi perfil
- **14 · Incidencias / Cumplimiento** — [[00-shared/features/CUMPLIMIENTO|CUMPLIMIENTO]] *(por crear)*
    - Web: Tablero de PQRS · Detalle de PQRS · Tablero de infracciones · Detalle de caso (debido proceso) · Registrar infracción · Catálogo de faltas · Comité de convivencia
    - App: Crear PQRS · Mis PQRS · Mis llamados de atención · Presentar descargos
- **15 · Archivo Documental** — [[00-shared/features/ARCHIVO|ARCHIVO]] *(por crear)*
    - Web: Biblioteca de documentos · Subir documento · Visor de documento · Gestionar carpetas · Libro de actas · Repositorio legal
    - App: Documentos · Visor de documento · Buscar documento
- **16 · Reportes Básicos** — [[00-shared/features/REPORTES|REPORTES]] *(por crear)*
    - Web: Dashboard general · Reporte de cartera · Reporte financiero · Reporte de operaciones · Informe de gestión · Exportar/programar · Constructor de reportes *(post-MVP)*
    - App: Mi resumen

### Capa SaaS (propuesta — ver [[_RESEARCH_pantallas-mvp]] §3)

- **S1 · Operador SaaS** — [[00-shared/features/SAAS_OPERADOR|SAAS_OPERADOR]] *(por crear)*
    - Web: Dashboard del operador · Tenants/organizaciones · Detalle de tenant · Planes y precios · Módulos por plan · Suscripciones y facturación · Provisionar tenant · Soporte/tickets · Config multi-país · Auditoría global
- **S2 · Portafolio multi-conjunto** — [[00-shared/features/PORTAFOLIO|PORTAFOLIO]] *(por crear)*
    - Web: Portafolio de copropiedades · Selector de conjunto · Dashboard consolidado · Cartera consolidada · Equipo y asignaciones · Reportes multi-conjunto · Configuración de la empresa
    - App: Selector de conjunto

### Clientes especializados por rol (propuesta — ver [[_RESEARCH_pantallas-mvp]] §6)

- **Vigilante (portería + rondas)** — extiende [[00-shared/features/PORTERIA]]
    - App: Inicio/cierre de turno · Registrar visitante/validar QR · Correspondencia · Minuta (DAR) · Control de rondas · Escanear punto · Reportar incidente · Pánico/SOS · Directorio de emergencia
    - Web (supervisor): Configurar rondas · Monitoreo en vivo · Programación de turnos · Reportes DAR
- **Mantenimiento (técnico)** — extiende [[00-shared/features/MANTENIMIENTO]]
    - App: Mis órdenes · Detalle + checklist · Actualizar estado · Preventivos del día · Reportar hallazgo · Consumo de materiales
- **Aseo / Servicios** — extiende [[00-shared/features/MANTENIMIENTO]]
    - App: Rutinas del día · Checklist de zona · Confirmar finalización · Reportar faltante · Inventario de insumos
- **Contabilidad (contador)** — [[00-shared/features/CONTABILIDAD|CONTABILIDAD]] *(por crear)*
    - Web: PUC · Terceros · Comprobantes · Registrar comprobante · Libro auxiliar · Conciliación bancaria · Estados financieros · Ejecución presupuestal · Fondo de imprevistos · Cierre de periodo · Exportar revisor fiscal
- **Consejo de administración** — [[00-shared/features/CONSEJO|CONSEJO]] *(por crear)*
    - Web: Tablero del consejo · Aprobaciones · Documentos de sesión · Decisiones/actas · Reportes ejecutivos
    - App: Aprobaciones (opcional)
- **Revisor fiscal** — [[00-shared/features/REVISOR_FISCAL|REVISOR_FISCAL]] *(por crear)*
    - Web: Acceso de auditoría · Libros y auxiliares · Estados financieros · Observaciones/dictamen
- **Proveedor (portal externo)** — extiende [[00-shared/features/PROVEEDORES]]
    - Web: Mis órdenes · Actualizar avance · Mis documentos · Mis facturas/pagos

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
