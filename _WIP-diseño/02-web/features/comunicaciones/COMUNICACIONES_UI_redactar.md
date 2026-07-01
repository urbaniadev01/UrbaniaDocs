---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Redactar comunicado — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Página · **Ruta:** `/comunicaciones/nuevo` · **Permiso:** `comunicaciones.crear`

## Qué muestra
- `titulo` + editor de `cuerpo` (rich text) con botón **"Asistir con IA"** (redacción).
- `SegmentPicker`: todos / torre (select torre) / morosos / unidad (select unidad).
- `ChannelToggles`: WhatsApp / email / push (deshabilitado el canal sin configurar).
- Opciones: **programar** (date-time) y **fijar en cartelera**.
- Botón "Usar plantilla" (carga una `message_template`).
- Previsualización del mensaje por canal + conteo estimado de destinatarios.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Enviar ahora" | Click | `POST /announcements` (estado enviado) |
| "Programar" | Click | `POST /announcements` con `programado_para` |
| "Guardar borrador" | Click | estado borrador |

## Estados
| Estado | Cómo se ve |
|---|---|
| Sin canal activo | Aviso "Configura un canal" + enlace a Canales |
| Segmento morosos sin Cobranza | Opción deshabilitada con tooltip |
| Enviando | Botón loading; al terminar → detalle con métricas |

## Elementos condicionales
- Selector de torre/unidad visible según `segmento`.
