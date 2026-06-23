---
type: spec-tecnico
status: active
module: web
feature: cuentas-pagar
tags: [web, cuentas-pagar, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Cuentas por pagar

> Panorama global: [[00-shared/features/CUENTAS-PAGAR]]

> Este feature es solo Web (App N/A).

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Lista de cuentas | Página | `/cuentas-pagar` | [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_lista]] |
| Registrar cuenta | Modal | — | [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_registrar]] |
| Detalle de cuenta | Drawer | — | [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_detalle]] |
| Aprobar cuenta | Modal | — | [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_aprobar]] |
| Registrar pago | Modal | — | [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_UI_pagar]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/cuentas-pagar` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useCuentasPagar` | `GET /payables` |
| `useCuenta` | `GET /payables/{id}` |
| `useCreateCuenta` | `POST /payables` |
| `useAprobarCuenta` | `POST /payables/{id}/approve` |
| `usePagarCuenta` | `POST /payables/{id}/pay` |

---

## Tipos TypeScript

```ts
export type EstadoCuenta = 'pendiente' | 'aprobada' | 'pagada' | 'rechazada' | 'vencida';

export interface CuentaPagar {
  id: string;
  proveedor: { id: string; razon_social: string; };
  descripcion: string;
  categoria_presupuesto: string;
  monto: number;
  fecha_vencimiento: string;
  estado: EstadoCuenta;
  factura_url: string | null;
  comprobante_pago_url: string | null;
  aprobado_por: string | null;
  pagado_en: string | null;
  created_at: string;
}
```
