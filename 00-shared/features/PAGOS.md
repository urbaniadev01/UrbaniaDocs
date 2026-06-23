---
type: feature-panorama
status: active
module: shared
tags: [pagos, recibos, shared]
updated: 2026-06-22
---

# Feature: Pagos y recibos

## 1. Resumen y motivación

Registra los pagos de cuotas de administración realizados por los residentes. Es el módulo de caja que cierra el ciclo financiero: una cuota generada se convierte en pago registrado, el saldo de mora baja y se genera un recibo. Sin PAGOS, CUOTAS y MORA no tienen cierre.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Registro de pagos con múltiples métodos (efectivo, transferencia, PSE, tarjeta, consignación)
- Aplicación automática del pago a las cuotas pendientes (primero mora, luego cuotas)
- Anulación de pagos con motivo auditado
- Generación de recibo de pago en formato imprimible / PDF

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/CUOTAS]]
- Es consumido por: [[00-shared/features/MORA]], [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de pagos | Página | Tabla: fecha, unidad, monto, método, estado |
| Registrar pago | Modal | Unidad, monto, método, comprobante, fecha |
| Detalle de pago | Drawer | Info completa, comprobante, cuotas que cubre |
| Anular pago | Modal | Confirmación + motivo de anulación |
| Recibo de pago | Inline | Vista imprimible/PDF dentro del detalle |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de pagos | Screen | Historial de pagos de la unidad |
| Detalle de pago | Screen | Info completa y recibo |
| Registrar pago | BottomSheet | Registro de pago desde la app del residente |

---

## 6. Mapeo de acciones a endpoints

| Acción | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver lista | Lista | GET | `/payments` |
| Registrar pago | Modal registrar | POST | `/payments` |
| Ver detalle | Detalle (Drawer) | GET | `/payments/{id}` |
| Anular pago | Modal anular | POST | `/payments/{id}/void` |
| Descargar recibo | Recibo (inline) | GET | `/payments/{id}/receipt` |

---

## 7. Reglas de negocio globales

- El pago se aplica primero a intereses de mora y luego a cuotas, cronológicamente.
- Un pago puede cubrir múltiples cuotas si el monto es suficiente.
- La anulación de un pago requiere motivo y solo puede hacerla el admin.
- El recibo se genera automáticamente tras registrar el pago.
- No se puede registrar un pago a una unidad sin cuotas pendientes.

## 8. Estados del recurso

```
registrado → aplicado | anulado
```

## 9. Endpoints

> Ver [[01-api/endpoints/PAGOS]] para el detalle completo.

## 10. Orden de implementación

Después de CUOTAS.

## 11. Documentos de implementación

| Proyecto | Spec técnico | Docs de pantallas |
|---|---|---|
| Web | [[02-web/features/pagos/PAGOS_SPEC]] | [[02-web/features/pagos/PAGOS_UI_lista]], [[02-web/features/pagos/PAGOS_UI_registrar]], [[02-web/features/pagos/PAGOS_UI_detalle]], [[02-web/features/pagos/PAGOS_UI_anular]], [[02-web/features/pagos/PAGOS_UI_recibo]] |
| App | [[03-app/features/pagos/PAGOS_SPEC]] | [[03-app/features/pagos/PAGOS_UI_lista]], [[03-app/features/pagos/PAGOS_UI_detalle]], [[03-app/features/pagos/PAGOS_UI_registrar]] |
