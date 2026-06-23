---
type: spec-tecnico
status: active
module: web
feature: dashboard
tags: [web, dashboard, kpi, spec]
updated: 2026-06-22
---

# Spec Técnico Web: KPI Dashboard

> Panorama global: [[00-shared/features/DASHBOARD]]

> Este feature es solo Web (App N/A).

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Dashboard principal | Página | `/` (home del dashboard) | [[02-web/features/dashboard/DASHBOARD_UI_principal]] |
| Widget financiero | Inline | — | [[02-web/features/dashboard/DASHBOARD_UI_widget-financiero]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/` | `DashboardPage` | `AdminOnlyRoute` |

---

## Servicios y hooks

| Hook | Endpoint | Frecuencia de refresco |
|---|---|---|
| `useDashboardSummary` | `GET /dashboard/summary` | 60s polling |

---

## Tipos TypeScript

```ts
export interface DashboardSummary {
  financiero: {
    recaudo_mes: number;
    recaudo_meta: number;
    porcentaje_recaudo: number;
    cartera_morosa: number;
    unidades_en_mora: number;
    ejecucion_presupuestal: number;   // % del presupuesto ejecutado
  };
  operativo: {
    pqrs_abiertas: number;
    ordenes_pendientes: number;
    reservas_hoy: number;
    visitantes_hoy: number;
  };
  alertas: Alerta[];
}

export interface Alerta {
  tipo: 'cuotas_sin_generar' | 'contrato_por_vencer' | 'asamblea_proxima' | 'mora_alta';
  mensaje: string;
  severidad: 'info' | 'warning' | 'error';
  accion_url: string | null;
}
```

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| `dashboard/summary` | 60s | Polling automático |

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /dashboard/summary` | [[01-api/endpoints/DASHBOARD]] §1 |
