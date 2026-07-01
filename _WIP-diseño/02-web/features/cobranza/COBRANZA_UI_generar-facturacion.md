---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Generar facturación del periodo — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Asistente (wizard) · **Ruta:** `/cobranza/facturar` · **Permiso:** `pagos.crear`

## Qué muestra
Asistente en pasos:
1. **Periodo**: año/mes (debe estar `abierto`) + fecha de vencimiento.
2. **Conceptos**: selección de `charge_concepts` a incluir (administración, fondo, etc.).
3. **Previsualización**: tabla unidad × valor prorrateado por coeficiente; total y validación `Σ coeficiente = total_coefficient`.
4. **Confirmar**: emite cuentas (job asíncrono).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Siguiente/Atrás" | Click | Navega pasos |
| "Emitir facturación" | Click | `POST /cobranza/billing-runs`; muestra progreso |

## Estados
| Estado | Cómo se ve |
|---|---|
| `COEFFICIENT_MISMATCH` | Bloquea con detalle del desajuste de coeficientes |
| `PERIOD_ALREADY_BILLED` | Aviso de idempotencia (no duplica) |
| Procesando | Barra de progreso (N de M unidades) |
| Completado | Resumen + enlace a la lista de cuentas |
