---
type: ui-pantalla
status: active
module: web
feature: dashboard
pantalla: principal
tags: [web, dashboard, ui, principal]
updated: 2026-06-22
---

# Principal — Dashboard (Web)

> Spec: [[02-web/features/dashboard/DASHBOARD_SPEC]]
> Panorama: [[00-shared/features/DASHBOARD]]

**Tipo:** Página  |  **Ruta:** `/`

---

## Qué muestra

Página de inicio del panel de administración. Layout de grid configurable con widgets:

**Fila 1 — Alertas proactivas (si las hay):** Banner o cards de alerta con severidad (info/warning/error) y botón de acción. Ej: "Las cuotas de julio aún no han sido generadas" → botón "Generar cuotas".

**Fila 2 — KPIs financieros:** Tres cards de métricas: (1) Recaudo del mes — monto cobrado vs. meta con barra de progreso, (2) Cartera morosa — monto total y número de unidades en mora, (3) Ejecución presupuestal — % del presupuesto anual ejecutado.

**Fila 3 — KPIs operativos:** Cards más pequeñas: PQRS abiertas (con link a /pqrs), Órdenes de trabajo pendientes (link a /ordenes-trabajo), Reservas de hoy (link a /reservas), Visitantes hoy (link a /visitantes).

**Fila 4 — Accesos rápidos:** Botones de acciones frecuentes: Registrar pago, Generar cuotas del mes, Nueva PQRS, Comunicado.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de todo el grid de widgets |
| Sin alertas | Fila 1 oculta |
| Con datos | Vista normal |
| Error de carga | Toast de error + widgets vacíos con "Reintentar" |
