---
type: ui
status: draft
module: web
feature: directorio
tags: [web, ui, directorio, wip, post-mvp]
updated: 2026-06-28
---

# Importar directorio — Directorio (Web) *(post-MVP)*

> Spec técnico: [[02-web/features/directorio/DIRECTORIO_SPEC]]

**Tipo:** Página · **Ruta:** `/directorio/importar`

---

## Qué muestra
Carga masiva desde Excel/CSV: subir archivo → mapeo de columnas → previsualización con validación (documentos duplicados, unidades inexistentes) → confirmación.

## Acciones
| Elemento | Acción | Resultado |
|---|---|---|
| Subir archivo | — | Parse y previsualización |
| "Importar" | Click | Crea contactos + vínculos válidos; reporta errores |

## Estados de la vista
| Estado | Cómo se ve |
|---|---|
| Previsualización | Tabla con filas válidas/erróneas marcadas |
| Resultado | Resumen: N importados, M con error (descargable) |

> Nota: la migración de `users.unit` la resuelve la fundación (CAMBIO-006 / H1), no esta pantalla.
