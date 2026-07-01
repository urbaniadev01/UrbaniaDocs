---
type: ui
status: implemented
module: web
feature: configuracion
tags: [web, ui, configuracion]
updated: 2026-06-29
---

# Perfil — Configuración (Web)

> Spec técnico: [[02-web/features/configuracion/CONFIGURACION_SPEC]]
> Panorama: [[00-shared/features/CONFIGURACION]]

**Tipo:** Página
**Se abre desde:** Menú de usuario → "Perfil"
**Ruta:** `/settings/profile`

---

## Qué muestra
- `avatar` — foto del usuario, prominente arriba; botón "Cambiar foto".
- `name` — nombre completo (editable).
- `email` — solo lectura (es el identificador de login); badge "verificado" si `email_verified_at`.
- `phone` — teléfono de contacto (editable).
- Pie: "Miembro de {organización}" (contexto de tenant, solo lectura).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Guardar" | Click | `PATCH /auth/profile`; toast de éxito |
| Botón "Cambiar foto" | Click | Selector de archivo → sube avatar |
| Tab "Seguridad" | Click | Navega a `CONFIGURACION_UI_seguridad` |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton del formulario |
| Guardando | Botón en loading, campos deshabilitados |
| Error | Mensaje inline por campo (validación) + toast |
| Éxito | Toast "Perfil actualizado" |

## Elementos condicionales
- Badge "verificado" — visible solo si `email_verified_at != null`.
