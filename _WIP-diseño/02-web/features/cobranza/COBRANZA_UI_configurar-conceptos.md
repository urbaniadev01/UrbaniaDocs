---
type: ui
status: draft
module: web
feature: cobranza
tags: [web, ui, cobranza, wip]
updated: 2026-06-28
---

# Configurar conceptos y tarifas — Cobranza (Web)
> Spec: [[02-web/features/cobranza/COBRANZA_SPEC]]

**Tipo:** Página · **Ruta:** `/cobranza/conceptos` · **Permiso:** `pagos.configurar`

## Qué muestra
Tabla de `charge_concepts`: nombre, tipo (administración/fondo_imprevistos/multa/interes/extraordinaria), método de cálculo (coeficiente/fijo/por_area/manual), valor base, activo.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Nuevo concepto" | Click | Modal crear |
| Fila → Editar / Desactivar | Click | Modal / toggle |
| Configurar interés de mora | Click | Modal `late_interest_config` (tasa + días de gracia) |

## Estados
| Estado | Cómo se ve |
|---|---|
| Fondo < 1% | Aviso (Ley 675): "El fondo de imprevistos debe ser ≥ 1% del presupuesto" |
| Concepto en uso | "Desactivar" no lo borra (histórico) |
