---
type: ui
status: implemented
module: web
feature: configuracion
tags: [web, ui, configuracion]
updated: 2026-06-29
---

# Setup MFA — Configuración (Web)

> Spec técnico: [[02-web/features/configuracion/CONFIGURACION_SPEC]]

**Tipo:** Sheet
**Se abre desde:** `CONFIGURACION_UI_seguridad` → botón "Activar MFA"

---

## Qué muestra
- Paso 1: **QR** para escanear en la app TOTP + secreto en texto (fallback).
- Paso 2: campo `code` (6 dígitos) para verificar.
- Paso 3: **códigos de respaldo** (10) — descargables/copiables, con aviso de guardarlos.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Al abrir | — | `POST /auth/mfa/setup` → devuelve QR + secreto |
| Botón "Verificar" | Click | `POST /auth/mfa/verify`; si ok, muestra códigos de respaldo |
| Botón "Listo" | Click | Cierra Sheet; `mfa_enabled = true` |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Paso 1 (QR) | QR + secreto |
| Código inválido | Mensaje inline en `code` |
| Paso 3 (respaldo) | Lista de 10 códigos + botones copiar/descargar |

## Elementos condicionales
- Códigos de respaldo — visibles solo tras verificación exitosa.
