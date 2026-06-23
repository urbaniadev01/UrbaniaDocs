---
type: ui-pantalla
status: active
module: web
feature: auth
pantalla: recuperar-contrasena
tags: [web, auth, ui, forgot-password]
updated: 2026-06-22
---

# Recuperar contraseña — Auth (Web)

> Spec técnico del feature: [[02-web/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** Enlace "¿Olvidaste tu contraseña?" en [[02-web/features/auth/AUTH_UI_login]]
**Ruta:** `/forgot-password`

---

## Qué muestra

Misma estructura visual que `/login`: pantalla centrada sin dashboard. Vista de un solo paso.

- `título` — "Recuperar contraseña", prominente
- `descripción` — "Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña", secundario
- `campo email` — input tipo email, label "Correo electrónico", autoFocus
- `botón "Enviar enlace"` — primario, ancho completo; spinner mientras el request está en curso
- `enlace "Volver al inicio de sesión"` — bajo el botón, navega a `/login`
- `mensaje de éxito` — reemplaza el formulario tras el envío exitoso (ver estado "Enviado")

**Estado "Enviado" (post-submit exitoso):**
- `ícono de check o email` — visual de confirmación
- `mensaje` — "Si ese correo existe en nuestro sistema, recibirás un enlace en los próximos minutos."
- `nota` — "Revisa también tu carpeta de spam."
- `enlace "Volver al inicio de sesión"` — siempre visible

> El mensaje de éxito es intencionalmente vago: no confirma si el correo existe en el sistema (seguridad contra enumeración de usuarios).

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Campo email | Escribir | Actualiza el valor; validación onBlur |
| Botón "Enviar enlace" | Click / Enter | Llama a `useForgotPassword`; muestra spinner |
| Enlace "Volver al inicio de sesión" | Click | Navega a `/login` |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| Exitoso (200) | Muestra el estado "Enviado" — oculta el formulario |
| `RATE_LIMIT_EXCEEDED` | Muestra error inline con el tiempo de espera |
| Cualquier error de red | Muestra error genérico: "Ocurrió un error. Intenta de nuevo." |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial | Formulario con campo email vacío, botón activo |
| Cargando | Botón con spinner, campo deshabilitado |
| Error | Mensaje de error bajo el botón; formulario desbloqueado |
| Enviado | Formulario reemplazado por mensaje de confirmación + ícono |

---

## Elementos condicionales

- `formulario` — visible solo en estados Inicial, Cargando y Error
- `mensaje de éxito` — visible solo en estado Enviado
- `mensaje de error` — visible solo si hay error de la mutación
