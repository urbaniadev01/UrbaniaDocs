---
type: ui
status: implemented
module: web
feature: configuracion
tags: [web, ui, configuracion]
updated: 2026-06-29
---

# Cambiar contraseña — Configuración (Web)

> Spec técnico: [[02-web/features/configuracion/CONFIGURACION_SPEC]]

**Tipo:** Sheet
**Se abre desde:** `CONFIGURACION_UI_seguridad` → botón "Cambiar contraseña"

---

## Qué muestra
- `current_password` — contraseña actual (obligatoria).
- `new_password` — nueva contraseña, con medidor de fortaleza.
- `confirm_password` — confirmación.
- Nota: "No puede coincidir con tus últimas 12 contraseñas" (regla de `password_history`).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Actualizar" | Click | `POST /auth/change-password`; cierra Sheet + toast |
| Botón "Cancelar" | Click | Cierra Sheet sin guardar |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Validando | Botón en loading |
| Error `PASSWORD_REUSED` | Mensaje inline en `new_password` |
| Error `INVALID_CREDENTIALS` | Mensaje inline en `current_password` |
| Éxito | Toast "Contraseña actualizada"; se invalidan otras sesiones |

## Elementos condicionales
- Botón "Actualizar" deshabilitado hasta que `new_password == confirm_password` y cumpla la política.
