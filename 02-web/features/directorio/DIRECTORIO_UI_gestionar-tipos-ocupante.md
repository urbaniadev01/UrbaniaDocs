---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip]
updated: 2026-06-28
---

# Gestionar tipos de ocupante — Directorio (Web)

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Página
**Ruta:** `/directorio/tipos-ocupante`
**Guard:** permiso `directorio.configurar` (RBAC)

---

## Qué muestra
Catálogo configurable de `occupant_types` (propietario, residente, inquilino, familiar, contacto_emergencia, empleado): nombre, descripción, activo, n.º de ocupantes que lo usan.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Nuevo tipo" | Click | Modal crear |
| Fila → Editar | Click | Modal editar |
| Fila → Desactivar | Click | `ConfirmDialog`; bloquea si está en uso |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton |
| Tipo en uso | "Desactivar" deshabilitado con tooltip |
