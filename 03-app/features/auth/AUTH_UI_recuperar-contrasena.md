---
type: ui-pantalla
status: active
module: mobile
feature: auth
pantalla: recuperar-contrasena
tags: [app, auth, ui, forgot-password]
updated: 2026-06-23
---

# Recuperar contraseña — Auth (App)

> Spec técnico del feature: [[03-app/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Link "Olvidé mi contraseña" en [[03-app/features/auth/AUTH_UI_login]]
**Ruta go_router:** `/forgot-password`

---

## Qué muestra

- `título` — "Recuperar contraseña", prominente
- `subtítulo` — "Te enviaremos un enlace a tu correo", secundario
- `campo email` — TextInput con ícono mail, teclado `emailAddress`
- `botón "Enviar enlace"` — fullWidth
- `link "Volver a iniciar sesión"` — secundario, navega a `/login`

**Estado "Enviado" (tras submit exitoso):**
- `mensaje de éxito` — "Revisa tu correo" con ícono de confirmación
- `nota` — "Revisa también tu carpeta de spam"
- `botón "Volver a login"` — navega a `/login`

> El server responde **200 genérico** siempre, incluso si el email no existe (evita filtrar qué correos están registrados). No mostrar mensaje de "usuario no encontrado".

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Campo email | Escribir / perder foco | Actualiza valor; valida al perder foco |
| Botón "Enviar enlace" | Tap | → `authForgotPasswordProvider` → `POST /auth/forgot-password` con `{email}` |
| Link "Volver a iniciar sesión" | Tap | Navega a `/login` |
| Botón "Volver a login" (estado enviado) | Tap | Navega a `/login` |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| 200 | Muestra estado "Enviado" (oculta formulario) |
| 429 `RATE_LIMIT_EXCEEDED` | Snackbar "Demasiadas solicitudes, espera N segundos" |

> `404 USER_NOT_FOUND` no se maneja: el server responde 200 genérico para no filtrar emails.

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Inicial | Formulario con campo email vacío, botón activo |
| Cargando | Botón con spinner, campo deshabilitado |
| Error | Snackbar de error; formulario desbloqueado |
| Enviado | Formulario reemplazado por mensaje de confirmación + botón "Volver a login" |

---

## Elementos condicionales

- `formulario` — visible solo en estados Inicial, Cargando y Error
- `mensaje de éxito` — visible solo en estado Enviado

---

## Accesibilidad

- `campo email` — `Semantics(label: 'Correo electrónico')`

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
