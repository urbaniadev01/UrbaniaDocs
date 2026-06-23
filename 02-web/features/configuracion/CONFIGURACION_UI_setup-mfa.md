---
type: ui-pantalla
status: active
module: web
feature: configuracion
pantalla: setup-mfa
tags: [web, configuracion, ui, setup-mfa]
updated: 2026-06-22
---

# Setup Mfa — Configuración (Web)

> Spec técnico del feature: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
> Panorama global: [[00-shared/features/CONFIGURACION]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Sheet
**Se abre desde:** `Botón 'Activar MFA' en pantalla Seguridad`

---

## Qué muestra

Panel lateral con flujo de dos pasos: **Paso 1** — código QR para escanear con app de autenticación (Google Authenticator, Authy) + clave manual alternativa. **Paso 2** — campo de 6 dígitos para confirmar que el setup funcionó. Al confirmar: lista de 10 códigos de respaldo para guardar.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la sección |
| Con datos | Vista normal |
| Guardando | Botón con spinner, campos deshabilitados |
| Error | Mensaje de error inline |
