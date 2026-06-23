---
type: feature-panorama
status: active
module: shared
tags: [cuotas, shared]
updated: 2026-06-22
---

# Feature: Cuotas de administración

## 1. Resumen y motivación

Genera y gestiona las cuotas mensuales de administración por unidad. Calcula el valor individual usando el coeficiente de copropiedad y un valor base definido por el administrador. Es la fuente de los saldos a cobrar que alimenta PAGOS y MORA.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App 

## 3. Características principales

- Generación masiva de cuotas por período (mes/año)
- Cálculo automático por coeficiente: valor_base × coeficiente_unidad
- Ajustes manuales: descuento, recargo o nota de crédito con auditoría
- Historial completo de cuotas por unidad con estado de pago

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PROPIEDADES]], [[00-shared/features/RESIDENTES]]
- Es consumido por: [[00-shared/features/PAGOS]], [[00-shared/features/MORA]], [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de cuotas del período | Página | Tabla por período: cuota por unidad, estado de pago |
| Detalle de cuota por unidad | Página | Historial completo de cuotas, saldo, mora |
| Generar cuotas del mes | Modal | Confirmación de período + valor base |
| Ajuste manual de cuota | Modal | Descuento, recargo o nota de crédito con motivo |
| Detalle de cálculo | Modal | Desglose: coeficiente × base + extras |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Lista de cuotas del período | Screen | Vista de cuotas del mes vigente |
| Detalle de cuota por unidad | Screen | Historial de cuotas de la unidad del residente |

---

## 6. Mapeo de acciones a endpoints

| Acción del usuario | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| Ver cuotas del período | Lista | GET | `/fees?period=YYYY-MM` |
| Generar cuotas | Modal generar | POST | `/fees/generate` |
| Ver historial por unidad | Detalle por unidad | GET | `/fees/unit/{id}` |
| Ajustar cuota | Modal ajuste | PATCH | `/fees/{id}/adjust` |
| Ver desglose | Modal detalle cálculo | GET | `/fees/{id}/breakdown` |

---

## 7. Reglas de negocio globales

- Las cuotas se generan una sola vez por período; el sistema rechaza duplicados.
- El valor base se define manualmente por el admin al momento de generar.
- Cuota unitaria = valor_base × coeficiente_unidad (redondeado a enteros).
- Los ajustes quedan auditados con usuario, fecha y motivo.
- Una cuota en estado 'pagada' no puede ajustarse — solo se puede crear una nota de crédito.

## 8. Estados del recurso

```
pendiente → pagada_parcial → pagada | vencida | ajustada
```

## 9. Endpoints

> Ver [[01-api/endpoints/CUOTAS]] para el detalle completo.

## 10. Orden de implementación

Fase 2. API → Web → App.

## 11. Documentos de implementación

> Ver [[02-web/features/cuotas/CUOTAS_SPEC]] y [[03-app/features/cuotas/CUOTAS_SPEC]] cuando estén disponibles.
