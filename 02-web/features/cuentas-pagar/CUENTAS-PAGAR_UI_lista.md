---
type: ui-pantalla
status: active
module: web
feature: cuentas-pagar
pantalla: lista
tags: [web, cuentas-pagar, ui, lista]
updated: 2026-06-22
---

# Lista — Cuentas por pagar (Web)

> Spec: [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]]
> Panorama: [[00-shared/features/CUENTAS-PAGAR]]

**Tipo:** Página  |  **Se abre desde:** `Sidebar → 'Cuentas por pagar'`
**Ruta:** `/cuentas-pagar`

---

## Qué muestra

Tabla de cuentas. Columnas: Proveedor, Descripción, Monto, Fecha vencimiento, Estado (badge + alerta si vencida), Categoría presupuestal. Filtros: proveedor, estado, categoría, rango de fechas. Botón 'Registrar cuenta'. Resumen en header: total pendiente, total por vencer esta semana.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay cuentas por pagar pendientes" |
| Con datos | Vista normal |
