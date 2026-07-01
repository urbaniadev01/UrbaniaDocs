---
type: ui
status: draft
module: web
feature: comunicaciones
tags: [web, ui, comunicaciones, wip]
updated: 2026-06-28
---

# Configurar canales — Comunicaciones (Web)
> Spec: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]

**Tipo:** Página · **Ruta:** `/comunicaciones/canales` · **Permiso:** `comunicaciones.configurar`

## Qué muestra
Tarjetas por canal:
- **WhatsApp** (Meta API / WATI): estado, proveedor, número, botón conectar/probar.
- **Email**: remitente verificado.
- **Push**: estado de la app.
Las credenciales nunca se muestran en claro (solo máscara + estado).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| "Conectar" / "Editar" | Click | Modal de credenciales → `PUT /channels` |
| "Enviar prueba" | Click | Mensaje de prueba al admin |
| Toggle "Activo" | Click | Habilita/inhabilita el canal |

## Estados
| Estado | Cómo se ve |
|---|---|
| No configurado | Badge gris + CTA |
| Conectado | Badge verde + último uso |
| Error de credenciales | Badge rojo + "Revisar" |
