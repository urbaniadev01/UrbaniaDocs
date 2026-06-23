---
type: feature-panorama
status: active
module: shared
tags: [dashboard, kpi, shared]
updated: 2026-06-22
---

# Feature: KPI Dashboard

## 1. Resumen y motivación

Panel de control principal del administrador. Es la primera pantalla que ve al iniciar sesión: un resumen visual del estado del conjunto con los KPIs más importantes de finanzas, operación y comunicación. No genera datos — los consume de todos los demás features.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(N/A — la app no tiene rol de administrador)*

## 3. Características principales

- Widgets financieros: recaudo del mes, cartera morosa, ejecución presupuestal
- Widgets operativos: PQRS abiertas, órdenes pendientes, reservas del día
- Accesos rápidos a las acciones más frecuentes del administrador
- Alertas proactivas: contratos por vencer, cuotas sin generar, asambleas próximas

## 4. Relaciones con otras features

- Depende de: todos los demás features (es un aggregator)
- Es consumido por: *(ninguno — es el punto de entrada)*

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Dashboard principal | Página | Vista general con KPIs y widgets |
| Widget financiero | Inline | Recaudo, mora, presupuesto (sección del dashboard) |

### App

> N/A — este feature es solo Web.

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Cargar KPIs del dashboard | GET | `/dashboard/summary` |

---

## 7. Reglas de negocio globales

- El dashboard carga todos sus datos en una sola llamada al endpoint `/dashboard/summary` para minimizar el tiempo de carga.
- Los widgets con datos en tiempo real (PQRS abiertas, reservas hoy) se actualizan cada 60s con polling o SSE.
- Las alertas proactivas se calculan en el servidor y se devuelven como lista priorizada.
- El admin puede configurar qué widgets ver y en qué orden (preferencias persistidas por usuario).

## 8. Estados del recurso

```
N/A — el dashboard es una vista calculada, no un recurso persistente.
```

## 9. Endpoints

> Ver [[01-api/endpoints/DASHBOARD]] para el detalle completo.

## 11. Documentos de implementación

> Ver [[02-web/features/dashboard/DASHBOARD_SPEC]] (App N/A).
