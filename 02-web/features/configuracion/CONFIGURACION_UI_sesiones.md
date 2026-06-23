---
type: ui-pantalla
status: active
module: web
feature: configuracion
pantalla: sesiones
tags: [web, configuracion, ui, sesiones]
updated: 2026-06-22
---

# Sesiones — Configuración (Web)

> Spec técnico del feature: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
> Panorama global: [[00-shared/features/CONFIGURACION]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Inline
**Se abre desde:** `Sección dentro de /settings/security`

---

## Qué muestra

Tabla de sesiones activas. Columnas: Dispositivo (browser + SO), IP, Ubicación aproximada, Última actividad, Sesión actual (badge), Acción (botón 'Revocar'). Sesiones con actividad simultánea desde IPs distintas se marcan con badge 'Sospechosa'. Botón 'Revocar todas las demás sesiones' al pie.

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton de la sección |
| Con datos | Vista normal |
| Guardando | Botón con spinner, campos deshabilitados |
| Error | Mensaje de error inline |
