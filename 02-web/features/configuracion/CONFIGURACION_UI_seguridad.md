---
type: ui
status: implemented
module: web
feature: configuracion
tags: [web, ui, configuracion]
updated: 2026-06-29
---

# Seguridad — Configuración (Web)

> Spec técnico: [[02-web/features/configuracion/CONFIGURACION_SPEC]]

**Tipo:** Página
**Se abre desde:** Menú de usuario → "Seguridad" / tab desde Perfil
**Ruta:** `/settings/security`

---

## Qué muestra
- Sección **Contraseña**: fecha de último cambio + botón "Cambiar contraseña".
- Sección **Autenticación de dos factores (MFA)**: estado (Activado/Desactivado) + botón "Activar"/"Desactivar".
- Sección **Sesiones activas**: tabla embebida (ver `CONFIGURACION_UI_sesiones-activas`).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Cambiar contraseña" | Click | Abre `CONFIGURACION_UI_cambiar-contrasena` (Sheet) |
| Botón "Activar MFA" | Click | Abre `CONFIGURACION_UI_setup-mfa` (Sheet) |
| Botón "Desactivar MFA" | Click | `ConfirmDialog` → `POST /auth/mfa/disable` |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de las 3 secciones |
| MFA activado | Badge verde "Activado" + botón "Desactivar" |
| MFA desactivado | Badge gris "Desactivado" + botón "Activar" (CTA) |

## Elementos condicionales
- Botón "Desactivar MFA" — visible solo si `mfa_enabled = true`.
- Aviso "Recomendamos activar MFA" — visible solo si `mfa_enabled = false`.
