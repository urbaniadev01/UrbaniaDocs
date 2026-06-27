---
type: ui-pantalla
status: active
module: mobile
feature: auth
pantalla: resetear-contrasena
tags: [app, auth, ui, reset-password]
updated: 2026-06-23
---

# Resetear contraseña — Auth (App)

> Spec técnico del feature: [[03-app/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Link del email de recuperación (deep link `authreset://...?token=...&email=...`)
**Ruta go_router:** `/reset-password`

---

## Qué muestra

- `título` — "Nueva contraseña", prominente
- `campo nueva contraseña` — TextInput obscure + botón ojo
- `campo confirmar contraseña` — TextInput obscure + botón ojo; validación inline de coincidencia
- `indicador de fortaleza en vivo` — (opcional) barra bajo el campo nueva contraseña
- `botón "Cambiar contraseña"` — fullWidth

> Los query params `token` y `email` llegan vía deep link y se inyectan en el submit.

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Campo nueva contraseña | Escribir | Valida longitud ≥8, 1 mayúscula, 1 número; actualiza indicador de fortaleza |
| Campo confirmar contraseña | Escribir | Valida coincidencia con el campo anterior |
| Botón ojo | Tap | Alterna `obscureText` |
| Botón "Cambiar contraseña" | Tap | → `authResetPasswordProvider` → `POST /auth/reset-password` con `{email, token, password, password_confirmation}` |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| 200 | Snackbar de éxito + navega a `/login` |
| 422 `VALIDATION_ERROR` | Mensaje por campo |
| 401 / 410 token expirado | Mensaje "El enlace expiró, solicita uno nuevo" + link a `/forgot-password` |
| 400 `PASSWORD_REUSED` | Mensaje "Esta contraseña ya fue usada recientemente" |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Inicial | Dos campos vacíos, botón activo |
| Cargando | Botón con spinner, campos deshabilitados |
| Error | Mensaje bajo el botón; formulario desbloqueado |
| Éxito | Snackbar + redirección a `/login` |

---

## Elementos condicionales

- `botón ojo` — toggle por campo
- `mensaje de no coincidencia` — visible solo si confirmar ≠ nueva
- `indicador de fortaleza` — (opcional) visible solo mientras se escribe la nueva contraseña
- `link a /forgot-password` — visible solo si el token expiró

---

## Accesibilidad

- `campo nueva contraseña` — `Semantics(label: 'Nueva contraseña')`
- `campo confirmar contraseña` — `Semantics(label: 'Confirmar contraseña')`
- `botón ojo` — `Semantics(label: 'Mostrar u ocultar contraseña')`

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
