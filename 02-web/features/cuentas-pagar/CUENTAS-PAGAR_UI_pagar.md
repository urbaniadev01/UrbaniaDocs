---
type: ui-pantalla
status: active
module: web
feature: cuentas-pagar
pantalla: pagar
tags: [web, cuentas-pagar, ui, pagar]
updated: 2026-06-22
---

# Pagar — Cuentas por pagar (Web)

> Spec: [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]]
> Panorama: [[00-shared/features/CUENTAS-PAGAR]]

**Tipo:** Modal  |  **Se abre desde:** `Botón 'Registrar pago' en el drawer de detalle`


---

## Qué muestra

Modal de registro de pago. Campos: Fecha de pago (date picker, por defecto hoy), Método de pago (select), Referencia de la transacción (input), Upload del comprobante de pago (PDF o imagen, obligatorio). Al guardar: estado cambia a 'pagada' y afecta la ejecución del presupuesto.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay cuentas por pagar pendientes" |
| Con datos | Vista normal |
