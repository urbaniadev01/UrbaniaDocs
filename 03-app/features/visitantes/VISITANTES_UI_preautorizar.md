---
type: ui-pantalla
status: active
module: mobile
feature: visitantes
pantalla: preautorizar
tags: [app, visitantes, ui, preautorizar]
updated: 2026-06-22
---

# Preautorizar — Visitantes (App)

> Spec: [[03-app/features/visitantes/VISITANTES_SPEC]]
> Panorama: [[00-shared/features/VISITANTES]]

**Tipo:** Screen  |  **Ruta go_router:** `/visitantes/nueva`

---

## Qué muestra

Formulario de preautorización. Campos: Nombre completo, Cédula (opcional), Fecha y hora estimada de visita, Motivo (opcional). Al guardar: se genera un QR que puede compartir con el visitante.

---

## Estados

| Estado | Cómo se ve |
|---|---|
| Cargando | Shimmer |
| Vacío | "Sin visitas registradas" + botón preautorizar |
| Con datos | Vista normal |
