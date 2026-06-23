---
type: ui-pantalla
status: active
module: mobile
feature: auth
pantalla: verificacion-mfa
tags: [app, auth, ui, mfa]
updated: 2026-06-23
---

# Verificación MFA — Auth (App)

> Spec técnico del feature: [[03-app/features/auth/AUTH_SPEC]]
> Panorama global: [[00-shared/features/AUTH]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Screen
**Se abre desde:** Login tras respuesta `401 MFA_REQUIRED` (con `mfa_session` o context temporal del login parcial)
**Ruta go_router:** `/login/mfa`

---

## Qué muestra

Pantalla con dos vistas alternables: TOTP (por defecto) y backup.

**Vista TOTP (por defecto):**
- `título` — "Verificación en dos pasos", prominente
- `subtítulo` — "Ingresa el código de tu app autenticadora", secundario
- `campo OTP` — 6 celdas separadas, una por dígito, teclado numérico, auto-advance a la siguiente celda al escribir
- `botón "Verificar"` — fullWidth; el auto-submit al llenar las 6 celdas lo dispara automáticamente
- `texto "¿Sin acceso a tu app? Usa un código de respaldo"` — cambia a vista backup

> El link "Reenviar código" no aplica a TOTP (no hay envío por SMS/email en este flujo) — oculto.

**Vista backup (al activar el toggle):**
- `título` — "Código de respaldo"
- `subtítulo` — "Ingresa uno de tus códigos de respaldo de 8 caracteres"
- `campo backup` — 1 campo de 8 caracteres alfanuméricos
- `botón "Verificar con código de respaldo"` — fullWidth
- `texto "Volver a código TOTP"` — regresa a vista TOTP

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Celda TOTP | Escribir dígito | Auto-advance; al llenar 6 → auto-submit |
| Botón "Verificar" | Tap | Submit manual → `authMfaVerifyProvider` → `POST /auth/mfa/verify` con `{code, mfa_session}` |
| Toggle "Usar código de respaldo" | Tap | Cambia a vista backup, limpia celdas |
| Campo backup | Escribir | Auto-submit al llegar a 8 caracteres |
| Botón "Verificar con código de respaldo" | Tap | → `authMfaVerifyBackupProvider` → `POST /auth/mfa/verify-backup` con `{code, mfa_session}` |

**Flujos post-submit:**

| Resultado del API | Qué hace el cliente |
|---|---|
| 200 | Guarda tokens en secure storage + navega a `/dashboard` |
| 401 `MFA_INVALID_CODE` | Limpia celdas + mensaje "Código incorrecto" |
| 401 `MFA_BACKUP_USED` | Mensaje "Código de respaldo ya utilizado" (vista backup) |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Inicial (TOTP) | 6 celdas vacías con foco en la primera, sin errores |
| Inicial (backup) | Campo backup vacío con foco, sin errores |
| Cargando | Spinner en botón, celdas/campo deshabilitados |
| Error | Mensaje bajo el campo; celdas limpias con foco para reintentar |

---

## Elementos condicionales

- `vista TOTP` — visible solo en modo TOTP
- `vista backup` — visible solo en modo backup
- `link "Reenviar código"` — oculto (TOTP no usa envío por canal)

---

## Accesibilidad

- `celdas TOTP` — `Semantics(label: 'Dígito N de 6')` por celda
- `campo backup` — `Semantics(label: 'Código de respaldo de 8 caracteres')`

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
