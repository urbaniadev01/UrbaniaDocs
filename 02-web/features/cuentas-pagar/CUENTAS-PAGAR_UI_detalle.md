---
type: ui-pantalla
status: active
module: web
feature: cuentas-pagar
pantalla: detalle
tags: [web, cuentas-pagar, ui, detalle]
updated: 2026-06-22
---

# Detalle — Cuentas por pagar (Web)

> Spec: [[02-web/features/cuentas-pagar/CUENTAS-PAGAR_SPEC]]
> Panorama: [[00-shared/features/CUENTAS-PAGAR]]

**Tipo:** Drawer  |  **Se abre desde:** `Click en fila de la lista`


---

## Qué muestra

Panel de detalle. Datos de la cuenta: proveedor, descripción, categoría, monto, vencimiento, estado. Historial: quién registró, quién aprobó, fecha de pago. Documentos: factura, comprobante de pago. Acciones según estado: 'Aprobar', 'Registrar pago'.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Vacío | "No hay cuentas por pagar pendientes" |
| Con datos | Vista normal |
