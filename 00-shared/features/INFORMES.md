---
type: feature-panorama
status: active
module: shared
tags: [informes, reportes, shared]
updated: 2026-06-22
---

# Feature: Informes financieros y de gestión

## 1. Resumen y motivación

Genera informes exportables para la asamblea y el consejo de administración. Consolida datos de PAGOS, MORA, PRESUPUESTO y CUENTAS-PAGAR en reportes listos para presentar. Es el módulo de reporting y no tiene su propia data — solo consume la de los demás features.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(N/A — generación de informes es tarea administrativa)*

## 3. Características principales

- Informe financiero del período: ingresos vs egresos, saldo de caja
- Informe de cartera: morosos, saldo total, gestión de cobro
- Informe de gestión: PQRS, órdenes de trabajo, reservas
- Exportación a PDF y Excel

## 4. Relaciones con otras features

- Depende de: [[00-shared/features/PAGOS]], [[00-shared/features/MORA]], [[00-shared/features/PRESUPUESTO]], [[00-shared/features/CUENTAS-PAGAR]], [[00-shared/features/PQRS]], [[00-shared/features/ORDENES-TRABAJO]]
- Es consumido por: *(ninguno — es un feature terminal)*

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Centro de informes | Página | Catálogo de informes disponibles |
| Informe financiero | Página | Estado financiero del período |
| Informe de cartera | Página | Morosos y gestión de cobro |
| Informe de gestión | Página | PQRS, órdenes, reservas |

### App

> N/A — este feature es solo Web.

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Informe financiero | GET | `/reports/financial?period=YYYY-MM` |
| Informe de cartera | GET | `/reports/arrears` |
| Informe de gestión | GET | `/reports/management?period=YYYY-MM` |
| Exportar PDF | GET | `/reports/{type}/export?format=pdf` |
| Exportar Excel | GET | `/reports/{type}/export?format=xlsx` |

---

## 7. Reglas de negocio globales

- Los informes son de solo lectura — no generan transacciones.
- La exportación a PDF usa el logo y datos del conjunto configurados en CONFIGURACION.
- El rango del informe puede ser un mes específico, un trimestre o el año en curso.

## 8. Estados del recurso

```
N/A — los informes son vistas calculadas, no recursos persistentes.
```

## 9. Endpoints

> Ver [[01-api/endpoints/INFORMES]] para el detalle completo.

## 11. Documentos de implementación

> Ver [[02-web/features/informes/INFORMES_SPEC]] (App N/A).
