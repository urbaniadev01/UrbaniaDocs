---
type: template
status: active
priority: P0
module: shared
tags: [template, feature-planning, cross-project, shared]
updated: 2026-06-22
---

# 🧩 FEATURE_PLANNING_TEMPLATE
## Plantilla para Documento de Feature (Panorama Global)

> [!info] Cómo usar esta plantilla
> 1. Copiar el bloque de la §2 a una nota nueva en `00-shared/features/<NOMBRE>.md` y completarla.
> 2. **Obligatorio**: agregar una fila en [[FEATURES_INDEX]] con el nombre, estado "Propuesto" y los proyectos afectados.
> 3. **Obligatorio**: abrir una entrada en [[CHANGES_LOG]] con estado "Propuesto".
> 4. No editar esta plantilla directamente.

---

## 1. Por Qué Existe esta Plantilla

Cuando una feature nace afectando múltiples capas (API + Web + App), el riesgo más caro no es construir mal una capa — es que cada capa construya **contra una suposición distinta** del contrato, y el desajuste se descubra en integración. Esta plantilla obliga a que el panorama del feature se discuta y se escriba antes de que cualquier capa empiece a implementar.

El documento creado con esta plantilla es **vivo**: existe durante la planificación, la implementación y el mantenimiento del feature. Se actualiza a medida que el feature evoluciona.

> [!important] Qué NO va en este documento
> - No va el detalle técnico de implementación (componentes, hooks, widgets) — eso vive en `02-web/features/<nombre>/<NOMBRE>_SPEC.md` y `03-app/features/<nombre>/<NOMBRE>_SPEC.md`.
> - No va el request/response de los endpoints — eso vive en `01-api/endpoints/<FEATURE>.md`.
> - Aquí va el **panorama y análisis previo a la implementación**: inventario de pantallas, mapeo de acciones a endpoints, lógica de negocio derivada del diseño, reglas globales. Es lo suficiente para entender el feature completo sin tener que leer todo lo demás.

---

## 2. Plantilla

```markdown
# Feature: <nombre>

## 1. Resumen y motivación
¿Qué problema resuelve? ¿Por qué ahora? (2-3 líneas)

## 2. Capas afectadas
- [ ] API (origen del contrato)
- [ ] Web
- [ ] App

## 3. Características principales
- <Capacidad 1>
- <Capacidad 2>
- <Capacidad 3>

## 4. Relaciones con otras features
- Depende de: [[features/<OTRA>]] (¿por qué?)
- Es consumido por: [[features/<OTRA>]] (¿por qué?)

## 5. Inventario de pantallas

> Este es el resultado del análisis de diseño (paso previo a la implementación).
> Listar todas las vistas del feature por proyecto. Tipos: Página, Modal, Drawer, Sheet, Inline.
> El detalle de implementación de cada pantalla vive en el spec técnico del proyecto.

### Web
| Pantalla | Tipo | Descripción breve |
|---|---|---|
| <Nombre de la pantalla> | Página / Modal / Drawer / Sheet / Inline | <qué muestra o hace> |

### App
| Pantalla | Tipo | Descripción breve |
|---|---|---|
| <Nombre de la pantalla> | Página / Modal / BottomSheet / Dialog | <qué muestra o hace> |

> Si el feature aplica a un solo cliente (solo Web o solo App), omitir la sección que no aplica.

---

## 6. Mapeo de acciones a endpoints

> Para cada acción que el usuario puede hacer en las pantallas del §5, indicar el endpoint que la resuelve.
> Esta tabla es el puente entre el diseño visual y el contrato de API.

| Acción del usuario | Pantalla | Verbo | Endpoint |
|---|---|---|---|
| <Descripción de la acción> | <Pantalla donde ocurre> | GET / POST / PATCH / DELETE | /<recurso> |

---

## 7. Reglas de negocio globales
- <Regla 1>
- <Regla 2>
> Reglas que aplican a todos los proyectos. Si una regla solo aplica a un proyecto,
> va en el spec técnico de ese proyecto, no aquí.

## 8. Estados del recurso
<Diagrama Mermaid de estados si aplica, o lista simple>
> Ej: pendiente → confirmada → cancelada

## 9. Endpoints
| Endpoint | Sección en API_CONTRACT | Documento de detalle |
|---|---|---|
| METHOD /ruta | [[01-api/API_CONTRACT]] §N.N | [[01-api/endpoints/<FEATURE>]] §N.N |

> Los endpoints se documentan en `01-api/endpoints/<FEATURE>.md` (detalle) y se registran
> en `01-api/API_CONTRACT.md` (índice). Este documento solo **cita** — nunca duplica
> request/response.

## 10. Orden de implementación
Por defecto: API define y estabiliza el contrato → Web y App implementan
en paralelo contra ese contrato.
> Ajustar si el feature requiere un orden distinto.

## 11. Especificaciones técnicas por proyecto

| Proyecto | Spec técnico | Diseño visual | Archivos adicionales |
|---|---|---|---|
| Web | [[02-web/features/<NOMBRE>_SPEC]] | [[02-web/features/<NOMBRE>_UI]] | `02-web/features/<NOMBRE>_*` |
| App | [[03-app/features/<NOMBRE>_SPEC]] | [[03-app/features/<NOMBRE>_UI]] | `03-app/features/<NOMBRE>_*` |

> Si el feature no aplica a un cliente, eliminar su fila.

## 12. Estado de sincronización
Enlace a la entrada correspondiente en [[CHANGES_LOG]].

## 13. Checklist de coherencia
- [ ] Nombres de campos consistentes con [[GLOSSARY]]
- [ ] Inventario de pantallas (§5) agregado en [[FEATURES_INDEX]] catálogo de pantallas
- [ ] Mapeo de acciones a endpoints (§6) coherente con [[01-api/API_CONTRACT]]
- [ ] Códigos de error nuevos agregados a [[01-api/API_CONTRACT]] §"Códigos de Error Completos"
- [ ] Cada proyecto afectado tiene una sesión planeada en su `*_IMPLEMENTATION_PLAN.md`
- [ ] Si la feature requiere identidad visual compartida, se revisó con
      cada `*_DESIGN_SYSTEM.md` afectado

## 14. Checklist de creación (completar al crear este archivo)
- [ ] Fila agregada en [[FEATURES_INDEX]] tabla de estado
- [ ] Entrada abierta en [[CHANGES_LOG]] con estado "Propuesto"
- [ ] Web: creados `<NOMBRE>_SPEC.md` y `<NOMBRE>_UI.md` en `02-web/features/` (si aplica)
- [ ] App: creados `<NOMBRE>_SPEC.md` y `<NOMBRE>_UI.md` en `03-app/features/` (si aplica)
- [ ] Cada proyecto afectado tiene una sesión planeada en su `*_IMPLEMENTATION_PLAN.md`
```

---

## 3. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[FEATURES_INDEX]] | Diccionario global donde se registra el feature |
| [[CROSS_PROJECT_CHANGES]] | Proceso general del cual esta plantilla es una variante para features planeadas |
| [[SYSTEM_CONTRACT]] | Donde termina el contrato una vez formalizado |
| [[CHANGES_LOG]] | Seguimiento del estado de sincronización |
