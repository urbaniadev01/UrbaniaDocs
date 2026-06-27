---
type: ui-pantalla
status: active
module: mobile
feature: auth
pantalla: login
tags: [app, auth, ui, login]
updated: 2026-06-23
---

# Login — Auth (App)

> Spec técnico del feature: [[03-app/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Arranque de la app si no hay sesión guardada, o redirect desde cualquier ruta protegida sin sesión
**Ruta go_router:** `/login`

---

## Qué muestra

Pantalla de entrada, sin AppBar del dashboard. Layout vertical centrado.

- `logo del conjunto` — prominente, arriba de todo
- `saludo de bienvenida` — secundario bajo el logo
- `campo email` — TextInput con ícono mail a la izquierda, teclado `emailAddress`, autocorrect desactivado
- `campo contraseña` — TextInput obscure + botón ojo para mostrar/ocultar
- `botón "Iniciar sesión"` — prominente, fullWidth
- `link "Olvidé mi contraseña"` — secundario, bajo el botón, navega a `/forgot-password`

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Campo email | Escribir / perder foco | Actualiza valor; valida al perder foco |
| Botón ojo | Tap | Alterna `obscureText` true/false |
| Link "Olvidé mi contraseña" | Tap | Navega a `/forgot-password` |
| Botón "Iniciar sesión" | Tap | Valida formulario → `authLoginProvider` → `POST /auth/login` |
| Formulario | Teclado "done" | Dispara submit |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| 200 (login exitoso) | Guarda tokens en secure storage + navega a `/dashboard` |
| 401 `MFA_REQUIRED` | Navega a `/login/mfa` pasando `mfa_session` |
| 401 `INVALID_CREDENTIALS` | Snackbar de error bajo el botón |
| 403 `FORCE_PASSWORD_CHANGE` | Navega a cambio de contraseña con `limited_token` |
| 429 `RATE_LIMIT_EXCEEDED` | Snackbar "Espera N segundos" (header `Retry-After`) |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Inicial | Formulario limpio, botón activo, sin errores |
| Cargando | Botón muestra spinner, campos deshabilitados |
| Error | Snackbar con mensaje; campos desbloqueados |
| Con datos | Formulario limpio tras éxito (previo a navegar) |

---

## Elementos condicionales

- `spinner en botón` — visible solo durante el request
- `texto de contraseña en claro` — visible solo si el botón ojo está activo

---

## Accesibilidad

- `campo email` — `Semantics(label: 'Correo electrónico')`
- `campo contraseña` — `Semantics(label: 'Contraseña')`
- `botón ojo` — `Semantics(label: 'Mostrar u ocultar contraseña')`

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
