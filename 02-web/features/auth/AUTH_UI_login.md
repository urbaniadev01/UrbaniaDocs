---
type: ui-pantalla
status: active
module: web
feature: auth
pantalla: login
tags: [web, auth, ui, login]
updated: 2026-06-22
---

# Login — Auth (Web)

> Spec técnico del feature: [[02-web/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** URL directa `/login`, o redirect automático desde cualquier ruta protegida cuando no hay sesión activa
**Ruta:** `/login`

---

## Qué muestra

Pantalla centrada, sin sidebar ni navbar del dashboard. Diseño de una sola columna centrada verticalmente en la pantalla.

- `logo` — logotipo de Urbania, prominente, arriba del formulario
- `título` — "Bienvenido" o nombre de la plataforma, secundario bajo el logo
- `campo email` — input tipo email, label "Correo electrónico", autoFocus al cargar
- `campo contraseña` — input tipo password, label "Contraseña", con toggle para mostrar/ocultar
- `enlace "¿Olvidaste tu contraseña?"` — alineado a la derecha del campo de contraseña, lleva a `/forgot-password`
- `botón "Iniciar sesión"` — primario, ancho completo del formulario; muestra spinner mientras el request está en curso
- `mensaje de error` — aparece bajo el botón cuando hay error; no en un toast sino inline en el formulario

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Campo email | Escribir | Actualiza el valor; validación al salir del campo (onBlur) |
| Campo contraseña | Escribir | Actualiza el valor; validación al salir del campo (onBlur) |
| Toggle contraseña | Click | Alterna entre `type="password"` y `type="text"` |
| Enlace "¿Olvidaste tu contraseña?" | Click | Navega a `/forgot-password` |
| Botón "Iniciar sesión" | Click / Enter | Valida el formulario → llama a `useLogin` |
| Formulario | Enter (desde cualquier campo) | Dispara submit |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| Login exitoso (rol admin) | Navega a `/dashboard` (o a la URL original si había `location.state.from`) |
| `MFA_REQUIRED` | Navega a `/login/mfa` preservando el `returnTo` |
| `FORCE_PASSWORD_CHANGE` | Navega a `/change-password` con `limited_token` |
| `INVALID_CREDENTIALS` | Muestra error inline: "Correo o contraseña incorrectos" |
| `ACCOUNT_LOCKED` | Muestra error inline: "Cuenta bloqueada temporalmente..." |
| `RATE_LIMIT_EXCEEDED` | Muestra error inline con tiempo de espera del header `Retry-After` |
| Login exitoso (rol user) | Limpia sesión, muestra error: "Acceso no autorizado. Solo administradores." |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial | Formulario vacío, botón activo, sin errores |
| Cargando | Botón muestra spinner, campos deshabilitados |
| Error de credenciales | Mensaje de error bajo el botón; campos desbloqueados para reintentar |
| Error de cuenta bloqueada | Mensaje de error; botón deshabilitado (no tiene sentido reintentar de inmediato) |
| Rate limit | Mensaje con cuenta regresiva del tiempo de espera |

---

## Elementos condicionales

- `spinner en botón` — visible solo mientras `isPending === true`
- `mensaje de error` — visible solo si hay un error de la mutación
- `campo contraseña en texto plano` — visible solo si el usuario activó el toggle

---

## Archivos de diseño adicionales

> Eliminar si no hay archivos complementarios para esta pantalla.

| Archivo                  | Descripción                   |
| ------------------------ | ----------------------------- |
| `AUTH_mockup_login.html` | Mockup interactivo si se crea |
