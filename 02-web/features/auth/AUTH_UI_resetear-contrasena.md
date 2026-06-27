---
type: ui-pantalla
status: active
module: web
feature: auth
pantalla: resetear-contrasena
tags: [web, auth, ui, reset-password]
updated: 2026-06-22
---

# Resetear contraseña — Auth (Web)

> Spec técnico del feature: [[02-web/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** Enlace en el email de recuperación (URL con query param `?token=...`)
**Ruta:** `/reset-password`

---

## Qué muestra

Misma estructura visual que `/login`: pantalla centrada sin dashboard.

- `título` — "Nueva contraseña", prominente
- `descripción` — "Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, una mayúscula y un número.", secundario
- `campo "Nueva contraseña"` — input tipo password con toggle para mostrar/ocultar
- `campo "Confirmar contraseña"` — input tipo password con toggle; validación inline de coincidencia
- `botón "Guardar contraseña"` — primario, ancho completo; spinner durante el request
- `mensaje de error inline` — bajo el botón para errores del API

**Estado "Token inválido o expirado" (al cargar la página):**
- Si el token del query param no existe o ya fue usado, mostrar este estado al cargar:
- `mensaje de error` — "Este enlace ha expirado o ya fue utilizado."
- `botón "Solicitar nuevo enlace"` — lleva a `/forgot-password`
- El formulario no se muestra.

**Estado "Éxito" (post-submit):**
- `mensaje` — "Tu contraseña fue actualizada correctamente."
- `botón "Ir al inicio de sesión"` — navega a `/login`

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Campo "Nueva contraseña" | Escribir | Actualiza valor; valida longitud, mayúscula y número onBlur |
| Campo "Confirmar contraseña" | Escribir | Valida coincidencia con el campo anterior onBlur |
| Toggle contraseña | Click | Alterna type="password" / type="text" |
| Botón "Guardar contraseña" | Click / Enter | Valida el formulario → llama a `useResetPassword` con token del query param |
| Botón "Solicitar nuevo enlace" | Click | Navega a `/forgot-password` |
| Botón "Ir al inicio de sesión" | Click | Navega a `/login` |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| Exitoso | Muestra el estado "Éxito" — oculta el formulario |
| `PASSWORD_REUSED` | Error inline: "No puedes reutilizar contraseñas anteriores" |
| Token inválido/expirado (al submit) | Error inline: "Este enlace ha expirado. Solicita uno nuevo." |
| Error de validación | Error inline con el campo específico que falla |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Token válido — inicial | Formulario con los dos campos vacíos |
| Token inválido — al cargar | Mensaje de error + botón para solicitar nuevo enlace; sin formulario |
| Cargando | Botón con spinner, campos deshabilitados |
| Error del API | Mensaje de error bajo el botón; formulario desbloqueado |
| Éxito | Formulario reemplazado por mensaje de confirmación + botón al login |

---

## Elementos condicionales

- `formulario` — visible solo si el token del query param existe al cargar la página
- `estado "token inválido"` — visible si el token no está presente en la URL o si el API lo rechaza al cargar
- `mensaje de éxito` — visible solo tras submit exitoso
- `mensajes de error de campo` — visibles solo si el campo correspondiente tiene error de validación
