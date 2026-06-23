---
type: ui-pantalla
status: active
module: mobile
feature: pqrs
pantalla: detalle
tags: [app, pqrs, ui, detalle]
updated: 2026-06-22
---

# Detalle — PQRS (App)

> Spec: [[03-app/features/pqrs/PQRS_SPEC]]
> Panorama: [[00-shared/features/PQRS]]

**Tipo:** Screen  |  **Ruta go_router:** `/pqrs/:id`

---

## Qué muestra

Hilo de conversación estilo chat. Mensajes del residente a la derecha, respuestas del admin a la izquierda. Header: número de radicado, estado, tipo. Botón para agregar adjuntos. Input al fondo para agregar comentario (si la PQRS está abierta/en revisión). Si está cerrada, solo lectura.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Aún no has radicado ninguna PQRS" + botón crear |
| Con datos | Vista normal |
