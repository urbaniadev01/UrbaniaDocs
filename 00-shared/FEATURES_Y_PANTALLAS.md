---
type: referencia
deprecated: true
module: shared
tags: [features, pantallas, prompts, referencia]
updated: 2026-06-27
---

> [!warning] Documento histórico (legacy)
> Este documento fue la guía original de prompts para generar la documentación inicial de los features.
> **Ya no es la fuente de verdad del inventario de pantallas.**
> El catálogo vivo de todas las pantallas ahora vive en [[FEATURES_INDEX#🖥️-catálogo-global-de-pantallas]].
> No agregar nuevas pantallas aquí — agregarlas al catálogo en FEATURES_INDEX y en el panorama correspondiente.

# Features y Pantallas — Referencia y Prompts de Documentación [LEGACY]

Documento de referencia independiente. Lista todos los features del sistema organizados por fase, con sus pantallas y el prompt listo para pedirle al agente que genere la documentación completa de cada feature.

El prompt de cada feature asume que ya tenés la descripción visual de cada pantalla lista para darle al agente cuando te la pida.

---

## Fase 1 — Fundación

---

### Auth

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Login | Página | Email + contraseña, link a recuperar contraseña |
| 2 | Verificación MFA | Página | Código TOTP o código de respaldo |
| 3 | Recuperar contraseña | Página | Email para enviar link de reset |
| 4 | Resetear contraseña | Página | Nueva contraseña + confirmación desde link de email |
| 5 | Confirmación de cierre de sesión | Modal | Confirmación antes de cerrar sesión activa |

**Prompt:**
```
Documenta el feature Auth. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/AUTH.md (panorama global)
- 02-web/features/auth/AUTH_SPEC.md
- 02-web/features/auth/AUTH_UI_login.md
- 02-web/features/auth/AUTH_UI_verificacion-mfa.md
- 02-web/features/auth/AUTH_UI_recuperar-contrasena.md
- 02-web/features/auth/AUTH_UI_resetear-contrasena.md
- 02-web/features/auth/AUTH_UI_confirmar-cierre-sesion.md
- 03-app/features/auth/AUTH_SPEC.md
- 03-app/features/auth/AUTH_UI_login.md
- 03-app/features/auth/AUTH_UI_verificacion-mfa.md
- 03-app/features/auth/AUTH_UI_recuperar-contrasena.md
- 03-app/features/auth/AUTH_UI_resetear-contrasena.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Configuración (Layout, Perfil y Seguridad)

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Perfil | Página | Datos del usuario logueado: nombre, email, teléfono, foto |
| 2 | Seguridad | Página | Cambiar contraseña, gestor de MFA, sesiones activas |
| 3 | Cambiar contraseña | Sheet | Contraseña actual + nueva + confirmación |
| 4 | Setup MFA | Sheet | QR + código de verificación para activar MFA |
| 5 | Sesiones activas | Inline | Tabla de sesiones con revocación (sección dentro de Seguridad) |

> [!note] Sin endpoints propios
> Este feature **no introduce endpoints nuevos** en la API: reorganiza los endpoints de Auth ya implementados (`/auth/me`, `/auth/change-password`, `/auth/sessions`, `/auth/mfa/*`) desde la perspectiva de las pantallas. Ver [[01-api/endpoints/CONFIGURACION]] para el mapeo completo. App es N/A (la app gestiona perfil nativamente).

**Prompt:**
```
Documenta el feature Configuración (Layout, Perfil y Seguridad). Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/CONFIGURACION.md (panorama global)
- 02-web/features/configuracion/CONFIGURACION_SPEC.md
- 02-web/features/configuracion/CONFIGURACION_UI_perfil.md
- 02-web/features/configuracion/CONFIGURACION_UI_seguridad.md
- 02-web/features/configuracion/CONFIGURACION_UI_cambiar-contrasena.md
- 02-web/features/configuracion/CONFIGURACION_UI_setup-mfa.md
- 02-web/features/configuracion/CONFIGURACION_UI_sesiones.md
- 01-api/endpoints/CONFIGURACION.md (documento de referencia que agrupa endpoints Auth ya implementados — sin endpoints nuevos)

App N/A. Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Propiedades y unidades

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de propiedades | Página | Tabla de torres/bloques con filtros y búsqueda |
| 2 | Detalle de unidad | Drawer | Info de la unidad: área, coeficiente, estado, residente actual |
| 3 | Crear / editar unidad | Modal | Formulario: torre, piso, número, área, coeficiente, tipo |
| 4 | Cambiar estado de unidad | Modal | Dropdown: ocupada / vacía / en venta + confirmación |
| 5 | Eliminar unidad | Modal | Confirmación destructiva con advertencia de dependencias |

**Prompt:**
```
Documenta el feature Propiedades y unidades. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/PROPIEDADES.md (panorama global)
- 02-web/features/propiedades/PROPIEDADES_SPEC.md
- 02-web/features/propiedades/PROPIEDADES_UI_lista.md
- 02-web/features/propiedades/PROPIEDADES_UI_detalle-unidad.md
- 02-web/features/propiedades/PROPIEDADES_UI_crear-editar-unidad.md
- 02-web/features/propiedades/PROPIEDADES_UI_cambiar-estado.md
- 02-web/features/propiedades/PROPIEDADES_UI_eliminar-unidad.md
- 03-app/features/propiedades/PROPIEDADES_SPEC.md
- 03-app/features/propiedades/PROPIEDADES_UI_lista.md
- 03-app/features/propiedades/PROPIEDADES_UI_detalle-unidad.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Residentes y propietarios

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de residentes | Página | Tabla: nombre, unidad, tipo (propietario/arrendatario), estado |
| 2 | Perfil de residente | Página | Datos personales, documentos, historial de unidades, vehículos |
| 3 | Crear residente | Modal | Nombre, ID, contacto, tipo, unidad asignada |
| 4 | Editar residente | Sheet | Formulario completo en panel lateral |
| 5 | Cambiar unidad asignada | Modal | Selector de unidad disponible + fecha de inicio |
| 6 | Desactivar residente | Modal | Confirmación + motivo |

**Prompt:**
```
Documenta el feature Residentes y propietarios. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/RESIDENTES.md (panorama global)
- 02-web/features/residentes/RESIDENTES_SPEC.md
- 02-web/features/residentes/RESIDENTES_UI_lista.md
- 02-web/features/residentes/RESIDENTES_UI_perfil.md
- 02-web/features/residentes/RESIDENTES_UI_crear.md
- 02-web/features/residentes/RESIDENTES_UI_editar.md
- 02-web/features/residentes/RESIDENTES_UI_cambiar-unidad.md
- 02-web/features/residentes/RESIDENTES_UI_desactivar.md
- 03-app/features/residentes/RESIDENTES_SPEC.md
- 03-app/features/residentes/RESIDENTES_UI_lista.md
- 03-app/features/residentes/RESIDENTES_UI_perfil.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

## Fase 2 — Finanzas core

---

### Cuotas de administración

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de cuotas del período | Página | Tabla por período: cuota por unidad, estado |
| 2 | Detalle de cuota por unidad | Página | Historial completo de cuotas, saldo, mora |
| 3 | Generar cuotas del mes | Modal | Confirmación de período + valor base |
| 4 | Ajuste manual de cuota | Modal | Descuento, recargo o nota de crédito con motivo |
| 5 | Detalle de cálculo | Modal | Desglose: coeficiente × base + extras |

**Prompt:**
```
Documenta el feature Cuotas de administración. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/CUOTAS.md (panorama global)
- 02-web/features/cuotas/CUOTAS_SPEC.md
- 02-web/features/cuotas/CUOTAS_UI_lista.md
- 02-web/features/cuotas/CUOTAS_UI_detalle-unidad.md
- 02-web/features/cuotas/CUOTAS_UI_generar.md
- 02-web/features/cuotas/CUOTAS_UI_ajuste-manual.md
- 02-web/features/cuotas/CUOTAS_UI_detalle-calculo.md
- 03-app/features/cuotas/CUOTAS_SPEC.md
- 03-app/features/cuotas/CUOTAS_UI_lista.md
- 03-app/features/cuotas/CUOTAS_UI_detalle-unidad.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Pagos y recibos

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de pagos | Página | Tabla: fecha, unidad, monto, método, estado |
| 2 | Registrar pago | Modal | Unidad, monto, método, comprobante adjunto, fecha |
| 3 | Detalle de pago | Drawer | Info completa, comprobante, cuotas que cubre, recibo |
| 4 | Anular pago | Modal | Confirmación + motivo de anulación |
| 5 | Recibo de pago | Inline | Vista imprimible/PDF dentro del detalle |

**Prompt:**
```
Documenta el feature Pagos y recibos. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/PAGOS.md (panorama global)
- 02-web/features/pagos/PAGOS_SPEC.md
- 02-web/features/pagos/PAGOS_UI_lista.md
- 02-web/features/pagos/PAGOS_UI_registrar.md
- 02-web/features/pagos/PAGOS_UI_detalle.md
- 02-web/features/pagos/PAGOS_UI_anular.md
- 02-web/features/pagos/PAGOS_UI_recibo.md
- 03-app/features/pagos/PAGOS_SPEC.md
- 03-app/features/pagos/PAGOS_UI_lista.md
- 03-app/features/pagos/PAGOS_UI_detalle.md
- 03-app/features/pagos/PAGOS_UI_registrar.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Cartera de mora

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Reporte de mora | Página | Unidades en mora: saldo, días vencidos, interés acumulado |
| 2 | Detalle de mora por unidad | Drawer | Cuotas vencidas, intereses, historial de gestión |
| 3 | Generar acuerdo de pago | Modal | Plan de pagos: cuotas del acuerdo + fecha límite |

**Prompt:**
```
Documenta el feature Cartera de mora. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/MORA.md (panorama global)
- 02-web/features/mora/MORA_SPEC.md
- 02-web/features/mora/MORA_UI_reporte.md
- 02-web/features/mora/MORA_UI_detalle-unidad.md
- 02-web/features/mora/MORA_UI_acuerdo-pago.md
- 03-app/features/mora/MORA_SPEC.md
- 03-app/features/mora/MORA_UI_reporte.md
- 03-app/features/mora/MORA_UI_detalle-unidad.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Presupuesto y fondo de reserva

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Presupuesto del año | Página | Ingresos vs egresos por categoría, barra de ejecución |
| 2 | Crear / editar presupuesto | Modal | Categorías de ingreso y egreso para el año |
| 3 | Detalle de categoría | Drawer | Movimientos reales vs proyectados en el año |
| 4 | Fondo de reserva | Inline | Saldo actual, aportes, retiros (sección en presupuesto) |

**Prompt:**
```
Documenta el feature Presupuesto y fondo de reserva. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/PRESUPUESTO.md (panorama global)
- 02-web/features/presupuesto/PRESUPUESTO_SPEC.md
- 02-web/features/presupuesto/PRESUPUESTO_UI_anual.md
- 02-web/features/presupuesto/PRESUPUESTO_UI_crear-editar.md
- 02-web/features/presupuesto/PRESUPUESTO_UI_detalle-categoria.md
- 02-web/features/presupuesto/PRESUPUESTO_UI_fondo-reserva.md

Este feature es solo Web (N/A en App). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

## Fase 3 — Comunicación y operación

---

### Notificaciones

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Centro de notificaciones | Página | Lista completa con filtros por tipo y estado leída/no leída |
| 2 | Panel de notificaciones (header) | Inline | Dropdown en la barra superior con badge de no leídas |
| 3 | Detalle de notificación | Modal | Contenido completo + link de acción |
| 4 | Preferencias de notificaciones | Página | Qué tipos recibir y por qué canal |

**Prompt:**
```
Documenta el feature Notificaciones. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/NOTIFICACIONES.md (panorama global)
- 02-web/features/notificaciones/NOTIFICACIONES_SPEC.md
- 02-web/features/notificaciones/NOTIFICACIONES_UI_centro.md
- 02-web/features/notificaciones/NOTIFICACIONES_UI_panel-header.md
- 02-web/features/notificaciones/NOTIFICACIONES_UI_detalle.md
- 02-web/features/notificaciones/NOTIFICACIONES_UI_preferencias.md
- 03-app/features/notificaciones/NOTIFICACIONES_SPEC.md
- 03-app/features/notificaciones/NOTIFICACIONES_UI_lista.md
- 03-app/features/notificaciones/NOTIFICACIONES_UI_detalle.md
- 03-app/features/notificaciones/NOTIFICACIONES_UI_preferencias.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Comunicados y circulares

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de comunicados | Página | Título, fecha, audiencia, confirmaciones de lectura |
| 2 | Detalle de comunicado | Página | Contenido completo, adjuntos, lista de quién lo leyó |
| 3 | Crear / editar comunicado | Sheet | Editor: título, cuerpo rich text, audiencia, adjuntos, programar envío |
| 4 | Confirmar publicación | Modal | Resumen de audiencia (N residentes) + confirmación |

**Prompt:**
```
Documenta el feature Comunicados y circulares. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/COMUNICADOS.md (panorama global)
- 02-web/features/comunicados/COMUNICADOS_SPEC.md
- 02-web/features/comunicados/COMUNICADOS_UI_lista.md
- 02-web/features/comunicados/COMUNICADOS_UI_detalle.md
- 02-web/features/comunicados/COMUNICADOS_UI_crear-editar.md
- 02-web/features/comunicados/COMUNICADOS_UI_confirmar-publicacion.md
- 03-app/features/comunicados/COMUNICADOS_SPEC.md
- 03-app/features/comunicados/COMUNICADOS_UI_lista.md
- 03-app/features/comunicados/COMUNICADOS_UI_detalle.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### PQRS

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de PQRS | Página | Radicado, tipo, residente, estado, fecha, responsable |
| 2 | Detalle de PQRS | Página | Descripción, adjuntos, timeline de estado, mensajes del hilo |
| 3 | Crear PQRS | Modal | Tipo, residente, unidad, descripción, adjuntos |
| 4 | Asignar responsable | Modal | Selector de usuario interno + comentario |
| 5 | Cambiar estado | Modal | Dropdown de estado + comentario obligatorio |
| 6 | Calificar cierre | Modal | Rating + comentario opcional (desde residente en app) |

**Prompt:**
```
Documenta el feature PQRS. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/PQRS.md (panorama global)
- 02-web/features/pqrs/PQRS_SPEC.md
- 02-web/features/pqrs/PQRS_UI_lista.md
- 02-web/features/pqrs/PQRS_UI_detalle.md
- 02-web/features/pqrs/PQRS_UI_crear.md
- 02-web/features/pqrs/PQRS_UI_asignar-responsable.md
- 02-web/features/pqrs/PQRS_UI_cambiar-estado.md
- 02-web/features/pqrs/PQRS_UI_calificar-cierre.md
- 03-app/features/pqrs/PQRS_SPEC.md
- 03-app/features/pqrs/PQRS_UI_lista.md
- 03-app/features/pqrs/PQRS_UI_detalle.md
- 03-app/features/pqrs/PQRS_UI_crear.md
- 03-app/features/pqrs/PQRS_UI_calificar-cierre.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Órdenes de trabajo

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de órdenes de trabajo | Página | Número, descripción, área, técnico, estado, fecha |
| 2 | Detalle de OT | Página | Descripción, fotos antes/después, timeline, materiales, costo |
| 3 | Crear OT | Modal | Área, descripción, técnico, fecha estimada, prioridad |
| 4 | Asignar técnico / reprogramar | Modal | Selector de técnico o fecha nueva con motivo |
| 5 | Cerrar OT | Modal | Notas de cierre, fotos de resultado, costo final |

**Prompt:**
```
Documenta el feature Órdenes de trabajo. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/ORDENES-TRABAJO.md (panorama global)
- 02-web/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC.md
- 02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_lista.md
- 02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_detalle.md
- 02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_crear.md
- 02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_asignar-reprogramar.md
- 02-web/features/ordenes-trabajo/ORDENES-TRABAJO_UI_cerrar.md
- 03-app/features/ordenes-trabajo/ORDENES-TRABAJO_SPEC.md
- 03-app/features/ordenes-trabajo/ORDENES-TRABAJO_UI_lista.md
- 03-app/features/ordenes-trabajo/ORDENES-TRABAJO_UI_detalle.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

## Fase 4 — Gobierno

---

### Asambleas

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de asambleas | Página | Tipo, fecha, quórum alcanzado, estado |
| 2 | Detalle de asamblea | Página | Convocatoria, agenda, asistentes, actas, votaciones |
| 3 | Crear / editar asamblea | Sheet | Tipo, fecha, lugar, agenda, documentos adjuntos |
| 4 | Registrar asistencia | Modal | Lista de unidades con checkbox de presencia o representación |
| 5 | Cargar acta | Sheet | Upload de PDF + editor de texto para acta digital |
| 6 | Cancelar asamblea | Modal | Motivo + opción de notificar a residentes |

**Prompt:**
```
Documenta el feature Asambleas. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/ASAMBLEAS.md (panorama global)
- 02-web/features/asambleas/ASAMBLEAS_SPEC.md
- 02-web/features/asambleas/ASAMBLEAS_UI_lista.md
- 02-web/features/asambleas/ASAMBLEAS_UI_detalle.md
- 02-web/features/asambleas/ASAMBLEAS_UI_crear-editar.md
- 02-web/features/asambleas/ASAMBLEAS_UI_registrar-asistencia.md
- 02-web/features/asambleas/ASAMBLEAS_UI_cargar-acta.md
- 02-web/features/asambleas/ASAMBLEAS_UI_cancelar.md
- 03-app/features/asambleas/ASAMBLEAS_SPEC.md
- 03-app/features/asambleas/ASAMBLEAS_UI_lista.md
- 03-app/features/asambleas/ASAMBLEAS_UI_detalle.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Votaciones y encuestas

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de votaciones | Página | Pregunta, asamblea relacionada, estado, fecha cierre, resultado |
| 2 | Detalle de votación | Página | Opciones, votos por opción, quórum, resultado final |
| 3 | Crear votación | Modal | Pregunta, opciones de respuesta, tipo de mayoría requerida |
| 4 | Votar | Modal | Opciones disponibles + confirmación del voto (desde app) |

**Prompt:**
```
Documenta el feature Votaciones y encuestas. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/VOTACIONES.md (panorama global)
- 02-web/features/votaciones/VOTACIONES_SPEC.md
- 02-web/features/votaciones/VOTACIONES_UI_lista.md
- 02-web/features/votaciones/VOTACIONES_UI_detalle.md
- 02-web/features/votaciones/VOTACIONES_UI_crear.md
- 03-app/features/votaciones/VOTACIONES_SPEC.md
- 03-app/features/votaciones/VOTACIONES_UI_lista.md
- 03-app/features/votaciones/VOTACIONES_UI_detalle.md
- 03-app/features/votaciones/VOTACIONES_UI_votar.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

## Fase 5 — Control de acceso

---

### Control de visitantes

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Registro de visitas (portería) | Página | Búsqueda de visitante/QR, botón ingreso/salida rápido |
| 2 | Historial de visitas (admin) | Página | Visitante, unidad, entrada, salida, autorizado por |
| 3 | Registrar ingreso manual | Modal | Nombre, documento, unidad destino, foto opcional |
| 4 | Autorizar visitante | Modal | Nombre, fecha/hora autorizada, QR generado (desde app) |
| 5 | Detalle de visita | Drawer | Info completa, foto, quién autorizó, timestamps |

**Prompt:**
```
Documenta el feature Control de visitantes. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/VISITANTES.md (panorama global)
- 02-web/features/visitantes/VISITANTES_SPEC.md
- 02-web/features/visitantes/VISITANTES_UI_porteria.md
- 02-web/features/visitantes/VISITANTES_UI_historial.md
- 02-web/features/visitantes/VISITANTES_UI_registrar-ingreso.md
- 02-web/features/visitantes/VISITANTES_UI_detalle.md
- 03-app/features/visitantes/VISITANTES_SPEC.md
- 03-app/features/visitantes/VISITANTES_UI_porteria.md
- 03-app/features/visitantes/VISITANTES_UI_historial.md
- 03-app/features/visitantes/VISITANTES_UI_autorizar.md
- 03-app/features/visitantes/VISITANTES_UI_detalle.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Control de vehículos

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de vehículos registrados | Página | Placa, tipo, color, unidad, estado autorizado |
| 2 | Registrar / editar vehículo | Modal | Placa, tipo, color, marca, unidad propietaria |
| 3 | Registro de ingreso de vehículos | Página | Portería: búsqueda por placa, entrada/salida, visitantes |

**Prompt:**
```
Documenta el feature Control de vehículos. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/VEHICULOS.md (panorama global)
- 02-web/features/vehiculos/VEHICULOS_SPEC.md
- 02-web/features/vehiculos/VEHICULOS_UI_lista.md
- 02-web/features/vehiculos/VEHICULOS_UI_registrar-editar.md
- 02-web/features/vehiculos/VEHICULOS_UI_porteria.md
- 03-app/features/vehiculos/VEHICULOS_SPEC.md
- 03-app/features/vehiculos/VEHICULOS_UI_lista.md
- 03-app/features/vehiculos/VEHICULOS_UI_porteria.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Correspondencia y paquetes

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de paquetes en portería | Página | Descripción, unidad destinataria, fecha, estado |
| 2 | Registrar paquete recibido | Modal | Descripción, foto, unidad destinataria |
| 3 | Confirmar entrega | Modal | Nombre de quien recibe + confirmación |

**Prompt:**
```
Documenta el feature Correspondencia y paquetes. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/PAQUETES.md (panorama global)
- 03-app/features/PAQUETES_SPEC.md
- 03-app/features/PAQUETES_UI_lista.md
- 03-app/features/PAQUETES_UI_registrar.md
- 03-app/features/PAQUETES_UI_confirmar-entrega.md

Este feature es solo App (N/A en Web). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

## Fase 6 — Valor agregado

---

### Reservas de áreas comunes

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Calendario de disponibilidad | Página | Vista de calendario por área: slots disponibles, ocupados, bloqueados |
| 2 | Lista de reservas (admin) | Página | Área, residente, fecha, estado, depósito pagado |
| 3 | Crear reserva | Sheet | Área, fecha/hora, reglas y depósito |
| 4 | Detalle de reserva | Drawer | Info completa, estado del depósito, cancelar |
| 5 | Cancelar reserva | Modal | Motivo + política de devolución del depósito |

**Prompt:**
```
Documenta el feature Reservas de áreas comunes. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/RESERVAS.md (panorama global)
- 02-web/features/reservas/RESERVAS_SPEC.md
- 02-web/features/reservas/RESERVAS_UI_calendario.md
- 02-web/features/reservas/RESERVAS_UI_lista-admin.md
- 02-web/features/reservas/RESERVAS_UI_crear.md
- 02-web/features/reservas/RESERVAS_UI_detalle.md
- 02-web/features/reservas/RESERVAS_UI_cancelar.md
- 03-app/features/reservas/RESERVAS_SPEC.md
- 03-app/features/reservas/RESERVAS_UI_calendario.md
- 03-app/features/reservas/RESERVAS_UI_crear.md
- 03-app/features/reservas/RESERVAS_UI_detalle.md
- 03-app/features/reservas/RESERVAS_UI_cancelar.md

Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Mantenimiento preventivo

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de activos | Página | Activo, área, último mantenimiento, próximo, técnico |
| 2 | Detalle de activo | Página | Historial de mantenimientos, documentos, proveedor |
| 3 | Registrar / editar activo | Sheet | Nombre, área, tipo, frecuencia, proveedor |
| 4 | Registrar mantenimiento ejecutado | Modal | Fecha, técnico, notas, costo, fotos |
| 5 | Programar próximo mantenimiento | Modal | Fecha estimada + técnico asignado |

**Prompt:**
```
Documenta el feature Mantenimiento preventivo. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/MANTENIMIENTO.md (panorama global)
- 02-web/features/mantenimiento/MANTENIMIENTO_SPEC.md
- 02-web/features/mantenimiento/MANTENIMIENTO_UI_lista-activos.md
- 02-web/features/mantenimiento/MANTENIMIENTO_UI_detalle-activo.md
- 02-web/features/mantenimiento/MANTENIMIENTO_UI_registrar-activo.md
- 02-web/features/mantenimiento/MANTENIMIENTO_UI_registrar-ejecucion.md
- 02-web/features/mantenimiento/MANTENIMIENTO_UI_programar.md

Este feature es solo Web (N/A en App). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Proveedores y contratos

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de proveedores | Página | Nombre, categoría, estado del contrato, vencimiento |
| 2 | Detalle de proveedor | Página | Contacto, contratos activos, historial de OTs y pagos |
| 3 | Crear / editar proveedor | Sheet | Nombre, NIT, categoría, contacto, datos bancarios |
| 4 | Adjuntar contrato | Modal | Upload de PDF + fechas de vigencia |
| 5 | Alerta de vencimiento | Inline | Badge en lista cuando el contrato vence en menos de 30 días |

**Prompt:**
```
Documenta el feature Proveedores y contratos. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/PROVEEDORES.md (panorama global)
- 02-web/features/proveedores/PROVEEDORES_SPEC.md
- 02-web/features/proveedores/PROVEEDORES_UI_lista.md
- 02-web/features/proveedores/PROVEEDORES_UI_detalle.md
- 02-web/features/proveedores/PROVEEDORES_UI_crear-editar.md
- 02-web/features/proveedores/PROVEEDORES_UI_adjuntar-contrato.md
- 02-web/features/proveedores/PROVEEDORES_UI_alerta-vencimiento.md

Este feature es solo Web (N/A en App). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Cuentas por pagar

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Lista de cuentas por pagar | Página | Proveedor, concepto, monto, vencimiento, estado |
| 2 | Detalle de cuenta | Drawer | Info completa, documentos de soporte, historial de aprobaciones |
| 3 | Registrar cuenta por pagar | Modal | Proveedor, concepto, monto, vencimiento, adjuntos |
| 4 | Aprobar / rechazar pago | Modal | Decisión + comentario |
| 5 | Registrar pago ejecutado | Modal | Fecha, método, referencia de transferencia |

**Prompt:**
```
Documenta el feature Cuentas por pagar. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/CUENTAS-PAGAR.md (panorama global)
- 02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC.md
- 02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_lista.md
- 02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_detalle.md
- 02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_registrar.md
- 02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_aprobar-rechazar.md
- 02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_registrar-pago.md

Este feature es solo Web (N/A en App). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### Informes financieros y asamblea

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Informe financiero mensual | Página | Estado de cuenta consolidado, ingresos vs egresos, saldo |
| 2 | Informe de deudores | Página | Morosos: saldo, días vencidos, acciones de cobro |
| 3 | Informe para asamblea | Página | Rendición de cuentas: presupuesto ejecutado, deudores, logros |
| 4 | Exportar a PDF | Inline | Acción presente en cada informe |

**Prompt:**
```
Documenta el feature Informes financieros y asamblea. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/INFORMES.md (panorama global)
- 02-web/features/informes/INFORMES_SPEC.md
- 02-web/features/informes/INFORMES_UI_financiero-mensual.md
- 02-web/features/informes/INFORMES_UI_deudores.md
- 02-web/features/informes/INFORMES_UI_asamblea.md
- 02-web/features/informes/INFORMES_UI_exportar-pdf.md

Este feature es solo Web (N/A en App). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```

---

### KPI Dashboard

| # | Pantalla | Tipo | Descripción |
|---|---|---|---|
| 1 | Dashboard principal | Página | Recaudo del mes, % mora, PQRS abiertas, visitas hoy, próximas asambleas |
| 2 | Widgets de KPI | Inline | Cada métrica como componente independiente con drill-down al módulo |

**Prompt:**
```
Documenta el feature KPI Dashboard. Crea los siguientes archivos usando los templates de la carpeta features/:

- 00-shared/features/DASHBOARD.md (panorama global)
- 02-web/features/dashboard/DASHBOARD_SPEC.md
- 02-web/features/dashboard/DASHBOARD_UI_principal.md
- 02-web/features/dashboard/DASHBOARD_UI_widgets.md

Este feature es solo Web (N/A en App). Para cada archivo de pantalla (_UI_) te voy a dar la descripción visual. Empieza por el panorama y el SPEC, y luego pídeme la descripción de cada pantalla de a una.
```
