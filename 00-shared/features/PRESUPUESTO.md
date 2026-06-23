---
type: feature-panorama
status: active
module: shared
tags: [presupuesto, shared]
updated: 2026-06-22
---

# Feature: Presupuesto y fondo de reserva

## 1. Resumen y motivación

Planifica y hace seguimiento del presupuesto anual del conjunto: ingresos proyectados, categorías de gasto y ejecución real vs. lo planeado. También gestiona el fondo de reserva.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(N/A)*

## 3. Características principales

- Definición del presupuesto anual por categorías de ingreso y egreso
- Seguimiento de ejecución en tiempo real vs. proyectado
- Gestión del fondo de reserva: aportes, retiros, saldo actual
- Vista de variaciones: qué categorías están sobre o bajo lo presupuestado

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PAGOS]], [[00-shared/features/CUENTAS-PAGAR]]
- Es consumido por: [[00-shared/features/INFORMES]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Presupuesto del año | Página | Ingresos vs egresos por categoría, barra de ejecución |
| Crear / editar presupuesto | Modal | Categorías de ingreso y egreso para el año |
| Detalle de categoría | Drawer | Movimientos reales vs proyectados en el año |
| Fondo de reserva | Inline | Saldo actual, aportes, retiros (sección en presupuesto) |

### App

> N/A — este feature es solo Web.

---

## 6. Mapeo de acciones a endpoints

| Acción | Pantalla | Verbo | Endpoint |
|---|---|---|---|

> Ver el mapeo completo en los specs de cada proyecto.

---

## 7. Reglas de negocio globales

- Solo un presupuesto activo por año.
- El presupuesto aprobado en asamblea no se modifica sin aprobación del consejo.
- El fondo de reserva es un porcentaje mínimo del presupuesto anual (configurable).
- La ejecución se actualiza automáticamente al registrar pagos o cuentas por pagar.

## 8. Estados del recurso

```
borrador → aprobado → en_ejecucion → cerrado
```

## 9. Endpoints

> Ver [[01-api/endpoints/PRESUPUESTO]] para el detalle completo.

| Endpoint | Detalle |
|---|---|
| `GET /budgets` | [[01-api/endpoints/PRESUPUESTO]] §1 |
| `POST/PATCH /budgets` | [[01-api/endpoints/PRESUPUESTO]] §2 |
| `GET /budgets/{year}/categories/{id}` | [[01-api/endpoints/PRESUPUESTO]] §3 |
| `GET /reserve-fund` | [[01-api/endpoints/PRESUPUESTO]] §4 |

## 10. Orden de implementación

Fase 2. API → Web (App N/A).

## 11. Documentos de implementación

> Ver [[02-web/features/presupuesto/PRESUPUESTO_SPEC]] (App N/A).
