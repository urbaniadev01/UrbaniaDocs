---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip]
updated: 2026-06-28
---

# Crear / editar contacto — Directorio (Web)

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Modal
**Se abre desde:** botón "Nuevo contacto" o "Editar" del detalle

---

## Qué muestra
Formulario de datos personales:
- `document_type` (select) + `document_number` (único por conjunto).
- `name` (obligatorio).
- `email`, `phone` (opcionales).
- `emergency_contact` (nombre + teléfono).
- `notes` (texto libre).
- Toggle "Crear cuenta de usuario" — si se activa, se vincula/crea `user` (invariante user⇄contact, ADR-001 H1).

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Guardar" | Click | `POST/PATCH /directorio/contacts`; cierra modal + refresca lista |
| Botón "Cancelar" | Click | Cierra sin guardar |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Validando | Botón loading |
| Error `DOCUMENT_DUPLICATED` | Inline en `document_number` |
| Éxito | Toast + cierre |

## Elementos condicionales
- Bloque "datos de cuenta" — visible solo si el toggle "Crear cuenta de usuario" está activo.
