---
type: spec
status: draft
module: web
feature: cobranza
tags: [web, spec, cobranza, wip]
updated: 2026-06-28
---

# Spec Técnico Web: Cobranza (Gastos Comunes)

> Panorama: [[00-shared/features/COBRANZA]] · Endpoints: [[01-api/endpoints/COBRANZA]] · Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature
| Pantalla | Tipo | Doc |
|---|---|---|
| Panel de cartera | Página | [[COBRANZA_UI_panel-cartera]] |
| Generar facturación | Asistente | [[COBRANZA_UI_generar-facturacion]] |
| Lista de cuentas de cobro | Página | [[COBRANZA_UI_lista-cuentas]] |
| Detalle de cuenta | Drawer | [[COBRANZA_UI_detalle-cuenta]] |
| Configurar conceptos | Página | [[COBRANZA_UI_configurar-conceptos]] |
| Registrar pago / abono | Modal | [[COBRANZA_UI_registrar-pago]] |
| Generar paz y salvo | Modal | [[COBRANZA_UI_generar-paz-y-salvo]] |
| Acuerdos de pago | Modal | [[COBRANZA_UI_acuerdos-pago]] |
| Cartera por edades | Página | [[COBRANZA_UI_cartera-edades]] |

## Rutas
| Ruta | Componente | Guard |
|---|---|---|
| `/cobranza` | `CarteraDashboardPage` | `Can('pagos.ver')` |
| `/cobranza/facturar` | `BillingWizardPage` | `Can('pagos.crear')` |
| `/cobranza/cuentas` | `InvoicesPage` | `Can('pagos.ver')` |
| `/cobranza/conceptos` | `ChargeConceptsPage` | `Can('pagos.configurar')` |
| `/cobranza/cartera` | `AgingReportPage` | `Can('pagos.ver')` |

## Componentes
### Crear nuevos
| Componente | Responsabilidad |
|---|---|
| `BillingWizard` | Asistente de facturación (periodo→conceptos→preview→confirmar) |
| `InvoiceDetailDrawer` | Conceptos, intereses, abonos, historial |
| `PaymentForm` | Registrar pago + asignación a cuentas |
| `PeaceCertificateModal` | Validar saldo 0 y emitir |
| `MoneyInput` | Input COP con formato/máscara `NUMERIC(15,2)` |
| `AgingChart` | Barras por edades de mora |
### Reutilizar
`DataTable`, `StatusBadge`, `ConfirmDialog`, `EmptyState` — [[WEB_COMPONENTS]]

## Servicios y hooks
| Hook | Endpoint |
|---|---|
| `useCarteraDashboard` | `GET /cobranza/dashboard` |
| `useChargeConcepts` | `* /cobranza/charge-concepts` |
| `useRunBilling` | `POST /cobranza/billing-runs` |
| `useInvoices` / `useInvoice` | `GET /cobranza/invoices[/:id]` |
| `useRegisterPayment` | `POST /cobranza/payments` |
| `useGeneratePeace` | `POST /cobranza/peace-certificates` |
| `usePaymentAgreement` | `POST /cobranza/payment-agreements` |
| `useAgingReport` | `GET /cobranza/aging-report` |

## Estrategia de cache
| Query | staleTime | Invalidar |
|---|---|---|
| dashboard | 30s | al registrar pago / correr facturación |
| invoices lista/detalle | 20s | al pagar, facturar, generar acuerdo |
| billing-run | — | polling de estado (job async) |

## Tipos TypeScript
```ts
export type InvoiceStatus = 'pendiente'|'parcial'|'pagada'|'vencida';
export interface Invoice { id:string; numero:string; unit_id:string; period:string;
  valor_total:string; saldo:string; estado:InvoiceStatus; fecha_vencimiento:string; }
export interface RegisterPaymentPayload { unit_id:string; valor:string; medio:'efectivo'|'banco'|'pse'|'tarjeta';
  referencia?:string; soporte_url?:string; allocations?:{invoice_id:string; valor_aplicado:string}[]; }
```
> Dinero como `string` (decimal) para evitar pérdida de precisión; formatear con `MoneyInput`.

## Cálculos y validaciones frontend
- Preview de prorrateo en el asistente (solo UX; el server recalcula y es la verdad).
- Validar `Σ allocations ≤ valor` antes de enviar.
- Deshabilitar "Generar paz y salvo" si `saldo > 0` (el server revalida con 422 `UNIT_HAS_BALANCE`).

## Permisos
| Acción | Permiso |
|---|---|
| Ver cartera/cuentas | `pagos.ver` |
| Facturar / registrar pago / paz y salvo / acuerdo | `pagos.crear` |
| Configurar conceptos | `pagos.configurar` |
| Aprobar (umbral) | `pagos.aprobar` (segregación, RBAC) |

## Testing
| Tipo | Qué cubre |
|---|---|
| Unit | hooks con MSW; cálculo de prorrateo (preview) |
| Component | `PaymentForm` (asignación), `BillingWizard` (pasos) |
| E2E | facturar periodo → registrar pago → emitir paz y salvo |
