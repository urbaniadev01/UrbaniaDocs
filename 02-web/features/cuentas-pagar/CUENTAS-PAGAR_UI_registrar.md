---
type: ui-pantalla
status: active
module: web
feature: cuentas-pagar
pantalla: registrar
tags: [web, cuentas-pagar, ui, registrar]
updated: 2026-06-22
---

# Registrar — Cuentas por pagar (Web)

> Spec: [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]]
> Panorama: [[00-shared/features/CUENTAS-PAGAR]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Registrar cuenta'`


---

## Qué muestra

Formulario. Campos: Proveedor (selector del catálogo), Descripción del servicio, Categoría presupuestal (del presupuesto activo), Monto (COP), Fecha de vencimiento, Upload de factura (PDF o imagen, opcional).

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay cuentas por pagar pendientes" |
| Con datos | Vista normal |
