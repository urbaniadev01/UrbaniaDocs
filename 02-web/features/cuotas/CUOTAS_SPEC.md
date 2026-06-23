---
type: spec-tecnico
status: active
module: web
feature: cuotas
tags: [web, cuotas, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Cuotas de administración

> Panorama global: [[00-shared/features/CUOTAS]]
> Endpoints: [[01-api/endpoints/CUOTAS]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de cuotas del período | Página | `/cuotas` | [[02-web/features/cuotas/CUOTAS_UI_lista]] |
| Detalle de cuota por unidad | Página | `/cuotas/unidad/:id` | [[02-web/features/cuotas/CUOTAS_UI_detalle-unidad]] |
| Generar cuotas del mes | Modal | — | [[02-web/features/cuotas/CUOTAS_UI_generar]] |
| Ajuste manual de cuota | Modal | — | [[02-web/features/cuotas/CUOTAS_UI_ajuste-manual]] |
| Detalle de cálculo | Modal | — | [[02-web/features/cuotas/CUOTAS_UI_detalle-calculo]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/cuotas` | `CuotasPage` | `AdminOnlyRoute` |
| `/cuotas/unidad/:id` | `CuotaDetalleUnidadPage` | `AdminOnlyRoute` |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `useCuotasPeriodo` | `cuotas.service.getByPeriod()` | `GET /fees?period=YYYY-MM` |
| `useCuotasUnidad` | `cuotas.service.getByUnit()` | `GET /fees/unit/{id}` |
| `useGenerarCuotas` | `cuotas.service.generate()` | `POST /fees/generate` |
| `useAjustarCuota` | `cuotas.service.adjust()` | `PATCH /fees/{id}/adjust` |
| `useCuotaBreakdown` | `cuotas.service.getBreakdown()` | `GET /fees/{id}/breakdown` |

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Cuotas del período | 30s | Al generar nuevas cuotas |
| Cuotas por unidad | 60s | Al ajustar cuota de esa unidad |

---

## Tipos TypeScript

```ts
export type EstadoCuota = 'pendiente' | 'pagada_parcial' | 'pagada' | 'vencida' | 'ajustada';

export interface Cuota {
  id: string;
  unidad_id: string;
  unidad: { torre: string; numero: string; };
  periodo: string;          // 'YYYY-MM'
  valor_base: number;
  coeficiente: number;
  monto: number;
  saldo_pendiente: number;
  estado: EstadoCuota;
  created_at: string;
}

export interface AjusteCuotaPayload {
  tipo: 'descuento' | 'recargo' | 'nota_credito';
  monto: number;
  motivo: string;
}
```

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /fees` | [[01-api/endpoints/CUOTAS]] §1 |
| `POST /fees/generate` | [[01-api/endpoints/CUOTAS]] §2 |
| `GET /fees/unit/{id}` | [[01-api/endpoints/CUOTAS]] §3 |
| `PATCH /fees/{id}/adjust` | [[01-api/endpoints/CUOTAS]] §4 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-cuotas-periodo.test.ts` | Listado por período, cambio de período |
| Unit | `hooks/use-generar-cuotas.test.ts` | Generar exitoso, error PERIOD_ALREADY_EXISTS |
| Unit | `hooks/use-ajustar-cuota.test.ts` | Ajuste exitoso, error PAID_FEE |
| E2E | `tests/e2e/cuotas.spec.ts` | Ver lista → generar → ver detalle → ajustar |
