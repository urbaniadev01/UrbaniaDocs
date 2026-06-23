---
type: feature-panorama
status: active
module: shared
tags: [cuentas-pagar, egresos, shared]
updated: 2026-06-22
---

# Feature: Cuentas por pagar

## 1. Resumen y motivación

Gestiona los pagos que el conjunto debe realizar a sus proveedores y terceros: servicios públicos, nómina de vigilancia, honorarios del administrador, etc. Cierra el ciclo de egresos junto con PRESUPUESTO.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(N/A — gestión administrativa)*

## 3. Características principales

- Registro de facturas/cuentas por pagar con proveedor, monto, fecha de vencimiento
- Aprobación de cuentas antes de pagar (flujo de doble validación)
- Registro del pago con comprobante
- Conciliación con el presupuesto: cada cuenta afecta a una categoría presupuestaria

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PROVEEDORES]], [[00-shared/features/PRESUPUESTO]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de cuentas por pagar | Página | Tabla con filtros por estado, proveedor, fecha |
| Registrar cuenta | Modal | Nueva factura/cuenta por pagar |
| Detalle de cuenta | Drawer | Info completa, historial de aprobación |
| Aprobar cuenta | Modal | Aprobación con comentario |
| Registrar pago de cuenta | Modal | Pago con comprobante |

### App

> N/A — este feature es solo Web.

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver lista | GET | `/payables` |
| Registrar cuenta | POST | `/payables` |
| Ver detalle | GET | `/payables/{id}` |
| Aprobar cuenta | POST | `/payables/{id}/approve` |
| Registrar pago | POST | `/payables/{id}/pay` |

---

## 7. Reglas de negocio globales

- Una cuenta por pagar debe ser aprobada por el admin antes de pagarse.
- Al registrar el pago: afecta la ejecución del presupuesto en la categoría correspondiente.
- Las cuentas vencidas sin pagar generan una alerta visible en el dashboard.
- El comprobante de pago (PDF o imagen) es obligatorio al registrar el pago.

## 8. Estados del recurso

```
pendiente → aprobada → pagada | rechazada | vencida
```

## 9. Endpoints

> Ver [[01-api/endpoints/CUENTAS-PAGAR]] para el detalle completo.

## 11. Documentos de implementación

> Ver [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]] (App N/A).
