---
type: ui-pantalla
status: active
module: web
feature: pagos
pantalla: registrar
tags: [web, pagos, ui, registrar]
updated: 2026-06-22
---

# Registrar — Pagos y recibos (Web)

> Spec técnico del feature: [[02-web/features/pagos/PAGOS_SPEC]]
> Panorama global: [[00-shared/features/PAGOS]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** `Botón 'Registrar pago' en lista`


---

## Qué muestra

Formulario de registro. Campos: Unidad (selector con búsqueda), Monto (numérico, COP), Método de pago (select), Referencia o número de transacción (opcional), Fecha del pago (date picker, por defecto hoy), Comprobante (upload de imagen o PDF, opcional). Preview de cuotas que cubrirá el monto ingresado.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la vista |
| Con datos | Vista normal |
| Error | Mensaje + "Reintentar" |
