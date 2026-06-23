---
type: feature-panorama
status: active
module: shared
tags: [mora, shared]
updated: 2026-06-22
---

# Feature: Cartera de mora

## 1. Resumen y motivación

Identifica y gestiona las unidades con cuotas vencidas. Calcula los intereses de mora acumulados y permite generar acuerdos de pago. Es la herramienta de cobranza del administrador.

## 2. Capas afectadas

- [x] API
- [x] Web
- [x] App

## 3. Características principales

- Reporte consolidado de morosos con saldo, días vencidos e interés acumulado
- Detalle por unidad: cuotas vencidas, histórico de gestión de cobro
- Generación de acuerdos de pago con plan de cuotas

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/CUOTAS]], [[00-shared/features/PAGOS]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Reporte de mora | Página | Unidades en mora: saldo, días vencidos, interés |
| Detalle de mora por unidad | Drawer | Cuotas vencidas, intereses, historial de gestión |
| Generar acuerdo de pago | Modal | Plan de pagos con fecha límite |

### App

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Reporte de mora | Screen | Vista de mora de la unidad del residente |
| Detalle de mora | BottomSheet | Cuotas vencidas y acuerdo vigente |

---

## 6. Mapeo de acciones a endpoints

| Acción | Pantalla | Verbo | Endpoint |
|---|---|---|---|

> Ver el mapeo completo en los specs de cada proyecto.

---

## 7. Reglas de negocio globales

- La mora = cuota vencida + (días vencidos × tasa de interés diaria definida en el reglamento).
- Un acuerdo de pago suspende el cobro de nuevos intereses mientras se cumpla.
- Si se incumple el acuerdo, la unidad vuelve a estado normal de mora con intereses.
- Solo el admin puede generar acuerdos de pago.

## 8. Estados del recurso

```
al_dia → en_mora → acuerdo_vigente → al_dia | en_mora
```

## 9. Endpoints

> Ver [[01-api/endpoints/MORA]] para el detalle completo.

| Endpoint | Detalle |
|---|---|
| `GET /arrears` | [[01-api/endpoints/MORA]] §1 |
| `GET /arrears/unit/{id}` | [[01-api/endpoints/MORA]] §2 |
| `POST /arrears/unit/{id}/agreement` | [[01-api/endpoints/MORA]] §3 |

## 10. Orden de implementación

Fase 2. API → Web .

## 11. Documentos de implementación

> Ver [[02-web/features/mora/MORA_SPEC]] y [[03-app/features/mora/MORA_SPEC]].
