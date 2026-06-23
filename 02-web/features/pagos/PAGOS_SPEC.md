---
type: spec-tecnico
status: active
module: web
feature: pagos
tags: [web, pagos, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Pagos y recibos

> Panorama global: [[00-shared/features/PAGOS]]
> Endpoints: [[01-api/endpoints/PAGOS]]
> Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de pagos | Página | `/pagos` | [[02-web/features/pagos/PAGOS_UI_lista]] |
| Registrar pago | Modal | — | [[02-web/features/pagos/PAGOS_UI_registrar]] |
| Detalle de pago | Drawer | — | [[02-web/features/pagos/PAGOS_UI_detalle]] |
| Anular pago | Modal | — | [[02-web/features/pagos/PAGOS_UI_anular]] |
| Recibo de pago | Inline | — | [[02-web/features/pagos/PAGOS_UI_recibo]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/pagos` | `PagosPage` | `AdminOnlyRoute` |

---

## Servicios y hooks

| Hook | Servicio | Endpoint |
|---|---|---|
| `usePagos` | `pagos.service.list()` | `GET /payments` |
| `usePago` | `pagos.service.getById()` | `GET /payments/{id}` |
| `useRegistrarPago` | `pagos.service.create()` | `POST /payments` |
| `useAnularPago` | `pagos.service.void()` | `POST /payments/{id}/void` |

---

## Estrategia de cache

| Query | staleTime | Cuándo invalidar |
|---|---|---|
| Lista de pagos | 30s | Al registrar o anular un pago |
| Detalle de pago | 60s | Al anular ese pago |

---

## Tipos TypeScript

```ts
export type MetodoPago = 'efectivo' | 'transferencia' | 'pse' | 'tarjeta' | 'consignacion';
export type EstadoPago = 'aplicado' | 'anulado';

export interface Pago {
  id: string;
  unidad: { id: string; torre: string; numero: string; };
  residente: { id: string; nombre: string; };
  monto: number;
  metodo: MetodoPago;
  referencia: string | null;
  fecha_pago: string;
  estado: EstadoPago;
  cuotas_cubiertas: CuotaBasica[];
  comprobante_url: string | null;
  created_by: string;
  created_at: string;
}

export interface RegistrarPagoPayload {
  unidad_id: string;
  monto: number;
  metodo: MetodoPago;
  referencia?: string;
  fecha_pago: string;
  comprobante?: File;
}
```

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /payments` | [[01-api/endpoints/PAGOS]] §1 |
| `POST /payments` | [[01-api/endpoints/PAGOS]] §2 |
| `GET /payments/{id}` | [[01-api/endpoints/PAGOS]] §3 |
| `POST /payments/{id}/void` | [[01-api/endpoints/PAGOS]] §4 |
| `GET /payments/{id}/receipt` | [[01-api/endpoints/PAGOS]] §5 |

---

## Testing

| Tipo | Archivo | Qué cubre |
|---|---|---|
| Unit | `hooks/use-pagos.test.ts` | Listado, filtros por unidad y período |
| Unit | `hooks/use-registrar-pago.test.ts` | Registro exitoso, error NO_PENDING_FEES |
| Unit | `hooks/use-anular-pago.test.ts` | Anulación exitosa, error PAYMENT_ALREADY_VOIDED |
| E2E | `tests/e2e/pagos.spec.ts` | Registrar pago → ver detalle → ver recibo → anular |
