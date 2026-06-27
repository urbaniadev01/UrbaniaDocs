---
type: ui-pantalla
status: active
module: web
feature: auth
pantalla: verificacion-mfa
tags: [web, auth, ui, mfa]
updated: 2026-06-22
---

# Verificación MFA — Auth (Web)

> Spec técnico del feature: [[02-web/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Página
**Se abre desde:** Redirect automático desde `/login` cuando el API responde `MFA_REQUIRED`
**Ruta:** `/login/mfa`

---

## Qué muestra

Misma estructura visual que `/login`: pantalla centrada, sin dashboard. Flujo de dos modos que el usuario puede alternar:

**Modo TOTP (por defecto):**
- `título` — "Verificación en dos pasos", prominente
- `descripción` — "Ingresa el código de 6 dígitos de tu aplicación de autenticación", secundario
- `campo de código` — input numérico de 6 dígitos, autoFocus, grande y centrado; auto-submit al completar
- `enlace "Usar código de respaldo"` — bajo el campo, cambia al modo de respaldo
- `botón "Verificar"` — primario; visible pero el auto-submit lo hace innecesario la mayoría del tiempo
- `enlace "Volver al inicio de sesión"` — lleva a `/login`

**Modo backup (al hacer click en "Usar código de respaldo"):**
- `título` — "Código de respaldo"
- `descripción` — "Ingresa uno de tus códigos de respaldo de 8 caracteres"
- `campo de código` — input alfanumérico de 8 caracteres, autoFocus, auto-submit al completar
- `enlace "Usar código TOTP"` — vuelve al modo TOTP
- `mensaje de error inline` — si el código ya fue usado o es inválido

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Campo TOTP (6 dígitos) | Completar los 6 dígitos | Auto-submit: llama a `useMfaVerify` |
| Campo backup (8 caracteres) | Completar los 8 caracteres | Auto-submit: llama a `useMfaVerifyBackup` |
| Botón "Verificar" | Click | Submit manual (mismo resultado que auto-submit) |
| Enlace "Usar código de respaldo" | Click | Cambia a modo backup, limpia el campo, autoFocus |
| Enlace "Usar código TOTP" | Click | Vuelve a modo TOTP, limpia el campo, autoFocus |
| Enlace "Volver al inicio de sesión" | Click | Navega a `/login`, limpia cualquier estado de sesión parcial |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| Verificación exitosa (rol admin) | Guarda token, navega a `/dashboard` (o al `returnTo` original) |
| `MFA_INVALID_CODE` | Muestra error inline: "Código incorrecto. Intenta de nuevo." Limpia el campo |
| `MFA_BACKUP_USED` | Muestra error inline: "Código de respaldo ya utilizado. Prueba otro o regenera tus códigos." |
| Verificación exitosa (rol user) | Limpia sesión, muestra error: "Acceso no autorizado. Solo administradores." |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Inicial (TOTP) | Campo vacío con autoFocus, sin errores |
| Inicial (backup) | Campo vacío con autoFocus, sin errores, descripción diferente |
| Cargando | Campo deshabilitado, botón con spinner |
| Error | Mensaje de error bajo el campo; campo limpio y con foco para reintentar |

---

## Elementos condicionales

- `campo TOTP` — visible solo en modo TOTP
- `campo backup` — visible solo en modo backup
- `enlace "Usar código de respaldo"` — visible solo en modo TOTP
- `enlace "Usar código TOTP"` — visible solo en modo backup
- `mensaje de error` — visible solo si hay error de la mutación

---

## Archivos de diseño adicionales

> Eliminar si no hay archivos complementarios para esta pantalla.

| Archivo | Descripción |
|---|---|
| `AUTH_mockup_verificacion-mfa.html` | Mockup interactivo si se crea |
