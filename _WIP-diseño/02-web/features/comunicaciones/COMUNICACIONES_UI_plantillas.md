---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Plantillas — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Página · **Ruta:** `/comunicaciones/plantillas` · **Permiso:** `comunicaciones.crear`

## Qué muestra
Lista de `message_templates` (nombre, tipo, vista previa). Tipos: convocatoria, recordatorio_pago, aviso.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Nueva plantilla" | Click | Modal: nombre + tipo + cuerpo (variables `{nombre}`, `{unidad}`, `{saldo}`) |
| Fila → Editar / Eliminar | Click | Modal / `ConfirmDialog` |
| "Usar" | Click | Abre el editor con la plantilla cargada |

## Estados
| Estado | Cómo se ve |
|---|---|
| Vacío | Plantillas sugeridas por defecto |
