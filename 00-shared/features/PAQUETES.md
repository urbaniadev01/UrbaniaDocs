---
type: feature-panorama
status: active
module: shared
tags: [paquetes, correspondencia, shared]
updated: 2026-06-23
---

# Feature: Correspondencia y paquetes

## 1. Resumen y motivación

Digitaliza la gestión de correspondencia y paquetes que llegan a portería de una sola torre/bloque. El portero registra lo que llega, el residente recibe una notificación push y confirma la entrega desde la app. Elimina el libro físico de paquetes y el desconocimiento del residente sobre lo que tiene en portería.

## 2. Capas afectadas

- [x] API (origen del contrato)
- [ ] Web
- [x] App

> [!note] Web: N/A en esta versión
> El registro en portería se realizará vía endpoint admin desde el panel web cuando se implemente el feature de Portería. Esta versión solo cubre el flujo del residente en la App.

## 3. Características principales

- Notificación push al residente al llegar un paquete a portería (tipo `paquete_recibido`)
- Lista de paquetes de la unidad del residente, con filtros por estado
- Confirmar entrega desde la app del residente (auto-entrega)

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/NOTIFICACIONES]] (recibe el tipo `paquete_recibido` emitido por §18.4 al notificar)
- Es consumido por: *(ninguno)*

## 5. Inventario de pantallas

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de paquetes | Screen | Paquetes de la unidad del residente con chips de filtro por estado |
| Detalle de paquete | BottomSheet | Info completa + timeline de eventos (received/notified/delivered/returned) |
| Confirmar entrega | Dialog | Nombre de quien recibe + confirmación de entrega |

> [!note] "Registrar paquete recibido" fuera de alcance App
> El listado de [[FEATURES_Y_PANTALLAS]] menciona 3 pantallas (Lista, Registrar, Confirmar entrega). La operación "Registrar paquete recibido en portería" corresponde a rol admin/portero (API §18.2 `POST /packages`) y **queda fuera del alcance App actual**: será cubierta por el panel Web cuando se haga el feature de Portería. La App residente cubre: Lista, Detalle (BottomSheet) y Confirmar entrega (Dialog desde Detalle).

## 6. Mapeo de acciones a endpoints

| Acción | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver lista de paquetes | Lista | GET | `/packages` |
| Ver detalle de paquete | Detalle | GET | `/packages/{id}` |
| Confirmar entrega | Confirmar entrega | POST | `/packages/{id}/deliver` |

## 7. Reglas de negocio globales

- Un paquete solo se puede entregar si está en estado `notified` — no se puede entregar directo sin haber notificado al residente (API retorna `409 PACKAGE_NOT_NOTIFIED`).
- Flujo de estados: `received → notified → delivered | returned`.
- El residente solo ve paquetes de su unidad (filtrado server-side por su `unit_id`); cualquier `id` ajeno retorna `404` (no `403`, para no filtrar existencia).
- Al confirmar entrega desde la app (`role = user`) no se exige `delivered_to_name`; se asume el propio residente.

## 8. Estados del recurso

```
received → notified → delivered | returned
```

## 9. Endpoints

> Ver [[01-api/endpoints/PAQUETES]] para el detalle completo.

| Endpoint | Sección | Tocado por App |
|---|---|---|
| `GET /packages` | §18.1 | Sí — lista del residente |
| `POST /packages` | §18.2 | No — admin (Web) |
| `GET /packages/{id}` | §18.3 | Sí — detalle |
| `POST /packages/{id}/notify` | §18.4 | No — admin (Web) |
| `POST /packages/{id}/deliver` | §18.5 | Sí — confirmar entrega |
| `POST /packages/{id}/return` | §18.6 | No — admin (Web) |
| `GET /packages/stats` | §18.7 | No — admin (Web) |

## 10. Orden de implementación

API ya diseñado (§18 completo). App sigue. Web N/A en esta versión.

## 11. Especificaciones técnicas por proyecto

| Proyecto | Spec técnico | Docs de pantallas |
|---|---|---|
| App | [[03-app/features/paquetes/PAQUETES_SPEC]] | [[03-app/features/paquetes/PAQUETES_UI_lista]], [[03-app/features/paquetes/PAQUETES_UI_detalle]], [[03-app/features/paquetes/PAQUETES_UI_confirmar-entrega]] |

## 12. Estado de sincronización

Enlace a la entrada correspondiente en [[CHANGES_LOG]].

## 13. Checklist de coherencia

- [ ] Nombres de campos consistentes con [[GLOSSARY]]
- [ ] Inventario de pantallas (§5) agregado en [[FEATURES_INDEX]] catálogo de pantallas
- [ ] Mapeo de acciones a endpoints (§6) coherente con [[01-api/API_CONTRACT]]
- [ ] Códigos de error nuevos agregados a [[01-api/API_CONTRACT]] §"Códigos de Error Completos"
- [ ] Cada proyecto afectado tiene una sesión planeada en su `*_IMPLEMENTATION_PLAN.md`
- [ ] Si la feature requiere identidad visual compartida, se revisó con cada `*_DESIGN_SYSTEM.md` afectado

## 14. Checklist de creación

- [ ] Fila agregada en [[FEATURES_INDEX]] tabla de estado
- [ ] Entrada abierta en [[CHANGES_LOG]] con estado "Propuesto"
- [ ] App: creados `PAQUETES_SPEC.md` y `PAQUETES_UI_*.md` en `03-app/features/paquetes/`
- [ ] Cada proyecto afectado tiene una sesión planeada en su `*_IMPLEMENTATION_PLAN.md`
