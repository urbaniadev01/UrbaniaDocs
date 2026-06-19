---
type: meta
status: active
priority: P0
module: global
tags: [migration, naming, cross-project, global]
updated: 2026-06-18
---

# 🧭 _MIGRATION_GUIDE
## Especificación de Cambios Necesarios (sin ejecutar)

> [!warning] Este documento es temporal
> Solo especifica qué cambios hacer a la documentación existente de API y App (y qué confirmar para Web) para que sean compatibles con el vault unificado. **Ningún archivo real ha sido modificado todavía.** Una vez completada la migración, este archivo se borra — su contenido ya no aplica a partir de ese momento.

---

## 1. Por Qué Hace Falta Renombrar Archivos

Al poner los 3 proyectos en un solo vault, varios nombres de documento se repiten a propósito entre proyectos (es el "esqueleto común" que ya definimos: `ARCHITECTURE.md`, `SECURITY.md`, `TESTING.md`, `SETUP_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `SESSION_MANIFEST.md`, `DEVELOPMENT_GUIDE.md`, `AGENTS.md`).

> [!danger] El problema técnico concreto
> Obsidian resuelve un wikilink como `[[ARCHITECTURE]]` buscando un archivo por **nombre**, no por carpeta. Si existen `01-api/ARCHITECTURE.md` y `03-app/ARCHITECTURE.md` a la vez, cualquier `[[ARCHITECTURE]]` en el vault queda ambiguo — Obsidian elige uno de los dos según su propia heurística interna, no necesariamente el correcto. Esto rompe exactamente lo que la unificación del vault busca arreglar.

**Solución:** todo archivo dentro de `01-api/`, `02-web/` o `03-app/` lleva el prefijo de su proyecto (`API_`, `WEB_`, `APP_`), sin excepción — incluso los que hoy no colisionan con nada, porque podrían colisionar en el futuro (ej. si Web también termina necesitando un `TESTING.md`). Es una regla mecánica y predecible: "todo archivo en `0X-proyecto/` empieza con su prefijo", nadie tiene que verificar caso por caso si colisiona o no.

Los archivos en `00-shared/` **no** llevan prefijo — su nombre ya es único por estar en ese namespace (`SYSTEM_CONTRACT.md`, `GLOSSARY.md`, etc.).

---

## 2. Tabla de Renombres — Urbania API (`01-api/`)

| Nombre actual | Nuevo nombre | Acción |
|---|---|---|
| `AGENTS.md` | `API_AGENTS.md` | Renombrar |
| `ARCHITECTURE.md` | `API_ARCHITECTURE.md` | Renombrar |
| `API_CONTRACT.md` | `API_CONTRACT.md` | Sin cambio — ya cumple la convención |
| `DATABASE.md` | `API_DATABASE.md` | Renombrar |
| `JWT_IMPLEMENTATION.md` | `API_JWT_IMPLEMENTATION.md` | Renombrar |
| `SETUP_GUIDE.md` | `API_SETUP_GUIDE.md` | Renombrar |
| `TESTING.md` | `API_TESTING.md` | Renombrar |
| `IMPLEMENTATION_PLAN.md` | `API_IMPLEMENTATION_PLAN.md` | Renombrar |
| `SESSION_MANIFEST.md` | `API_SESSION_MANIFEST.md` | Renombrar |
| `DEVELOPMENT_GUIDE.md` | `API_DEVELOPMENT_GUIDE.md` | Renombrar |
| `OBSIDIAN_VAULT.md` | — | **Eliminar.** Su contenido (explicación de plugins/convenciones) se consolida en un único documento de vault — ver §5 |
| `_Home.md` | — | **Eliminar.** El dashboard global (`/_Home.md` en la raíz) lo reemplaza; si se quiere un resumen de solo-API, se hace con una query de Dataview filtrada por carpeta desde el dashboard global, no con un archivo propio |
| `opencode.json` | `opencode.json` | Sin cambio (no es documentación de Obsidian) — pero revisar si referencia internamente alguno de los nombres renombrados de esta tabla y actualizarlo |

---

## 3. Tabla de Renombres — Urbania App (`03-app/`)

| Nombre actual | Nuevo nombre | Acción |
|---|---|---|
| `AGENTS.md` | `APP_AGENTS.md` | Renombrar |
| `ARCHITECTURE.md` | `APP_ARCHITECTURE.md` | Renombrar |
| `API_INTEGRATION.md` | `APP_API_INTEGRATION.md` | Renombrar |
| `SECURITY.md` | `APP_SECURITY.md` | Renombrar |
| `DATA_STRATEGY.md` | `APP_DATA_STRATEGY.md` | Renombrar |
| `DESIGN_SYSTEM.md` | `APP_DESIGN_SYSTEM.md` | Renombrar |
| `ACCESSIBILITY.md` | `APP_ACCESSIBILITY.md` | Renombrar |
| `FEATURE_SCOPE.md` | `APP_FEATURE_SCOPE.md` | Renombrar |
| `TESTING.md` | `APP_TESTING.md` | Renombrar |
| `SETUP_GUIDE.md` | `APP_SETUP_GUIDE.md` | Renombrar |
| `RELEASE_AND_OBSERVABILITY.md` | `APP_RELEASE_AND_OBSERVABILITY.md` | Renombrar |
| `IMPLEMENTATION_PLAN.md` | `APP_IMPLEMENTATION_PLAN.md` | Renombrar |
| `SESSION_MANIFEST.md` | `APP_SESSION_MANIFEST.md` | Renombrar |
| `DEVELOPMENT_GUIDE.md` | `APP_DEVELOPMENT_GUIDE.md` | Renombrar |
| `OBSIDIAN_VAULT.md` | — | **Eliminar** — mismo criterio que API, ver §5 |
| `_Home.md` | — | **Eliminar** — mismo criterio que API |

---

## 4. Convención para Urbania Web (`02-web/`)

Aún no tengo la lista real de archivos de Web. Aplicar el mismo principio: **prefijo `WEB_` + mismo nombre que tenga hoy el documento**, ajustando al esqueleto común donde aplique:

| Si Web tiene un documento equivalente a... | Nómbralo |
|---|---|
| El punto de entrada / mapa de navegación | `WEB_AGENTS.md` |
| Arquitectura / stack técnico | `WEB_ARCHITECTURE.md` |
| Seguridad del lado cliente | `WEB_SECURITY.md` |
| Cómo consume el API | `WEB_API_INTEGRATION.md` |
| Sistema de diseño visual | `WEB_DESIGN_SYSTEM.md` |
| Pruebas | `WEB_TESTING.md` |
| Setup del proyecto | `WEB_SETUP_GUIDE.md` |
| Plan de sesiones | `WEB_IMPLEMENTATION_PLAN.md` |
| Estado entre sesiones | `WEB_SESSION_MANIFEST.md` |
| Troubleshooting diario | `WEB_DEVELOPMENT_GUIDE.md` |

Cualquier documento de Web que no encaje en esta lista (algo específico de su stack que API/App no tienen, ej. SEO, SSR/CSR, manejo de caché de navegador) se conserva con su nombre actual + prefijo `WEB_`, sin forzarlo a encajar en el esqueleto común — la independencia de cada proyecto para tener documentos propios sigue vigente (ver `AGENTS.md` global, regla 1).

> [!todo] Pendiente
> Comparte los nombres reales de los archivos de Web para completar esta tabla con renombres exactos en vez de la convención general.

---

## 5. Consolidación de `OBSIDIAN_VAULT.md`

Hoy existe una copia de `OBSIDIAN_VAULT.md` en API y otra en App, ambas explicando configuración de plugins que ahora es **una sola**, a nivel de todo el vault. Acción recomendada:

1. Revisar si alguna de las dos versiones tiene contenido específico de su proyecto que valga la pena conservar (ej. alguna convención propia que no aplique a los otros dos).
2. Crear un único `00-shared/OBSIDIAN_VAULT.md` (o en la raíz, junto a este documento) que describa la configuración de plugins del vault completo — ya quedó cubierto en general por la guía de incorporación que se le envió a tu colega; este nuevo documento sería la versión "interna" más detallada, si se considera necesaria además de esa guía.
3. Eliminar las dos copias por-proyecto una vez consolidado.

---

## 6. Wikilinks que Deben Actualizarse

Renombrar un archivo no actualiza automáticamente los wikilinks que lo mencionan por su nombre viejo — **excepto si usas la función de Obsidian "Renombrar" desde el propio explorador de archivos**, que sí actualiza todos los links automáticamente dentro del mismo vault. Por eso es importante: renombrar **dentro de Obsidian** (clic derecho → Rename) una vez los archivos ya estén en su carpeta final dentro del vault unificado, no renombrar por fuera (Finder/Explorador de archivos/terminal) y luego mover — eso sí dejaría los links rotos.

> [!tip] Orden recomendado para minimizar trabajo manual
> 1. Mover los archivos (sin renombrar) a sus carpetas finales (`01-api/`, `03-app/`) dentro del vault unificado.
> 2. Abrir el vault en Obsidian.
> 3. Renombrar cada archivo **desde el explorador de archivos de Obsidian** (no desde el sistema operativo) — Obsidian actualiza automáticamente todos los wikilinks internos que lo referenciaban.
> 4. Solo quedan por revisar a mano los wikilinks que cruzan de un proyecto a otro (siguiente tabla), porque esos cambian de **ruta relativa**, no solo de nombre, y Obsidian no siempre detecta esto igual de bien según la profundidad del cambio.

### 6.1 Referencias cruzadas conocidas (App → API)

| Antes (vault separado) | Después (vault unificado) |
|---|---|
| `[[../AGENTS\|AGENTS]]` | `[[../01-api/API_AGENTS\|AGENTS]]` |
| `[[../JWT_IMPLEMENTATION\|JWT_IMPLEMENTATION]]` | `[[../01-api/API_JWT_IMPLEMENTATION\|JWT_IMPLEMENTATION]]` |
| `[[../API_CONTRACT\|API_CONTRACT]]` | `[[../01-api/API_CONTRACT\|API_CONTRACT]]` |
| `[[../OBSIDIAN_VAULT\|OBSIDIAN_VAULT]]` | Depende de si se consolida (§5) — si se consolida, apunta al documento único en `00-shared/` o raíz |
| `[[../_Home\|_Home]]` | Apunta al `_Home.md` global de la raíz: `[[../../_Home\|_Home]]` (un nivel más arriba que antes, porque ahora hay un nivel de carpeta de proyecto adicional) |

Estas referencias aparecen principalmente en `APP_API_INTEGRATION.md`, `APP_SECURITY.md`, `APP_ARCHITECTURE.md`, `APP_AGENTS.md` y `APP_OBSIDIAN_VAULT.md` (antes de eliminarse según §5).

---

## 7. Frontmatter: Campo `scope` y Tag `#cross-project`

Agregar `scope: local | cross-project` al frontmatter, y el tag `cross-project` a la lista de `tags`, en los siguientes documentos (el resto se queda con `scope: local` o sin el campo, asumiendo local por defecto):

| Documento | `scope` propuesto | Por qué |
|---|---|---|
| `01-api/API_CONTRACT.md` | `cross-project` | Es la fuente de verdad del contrato REST que Web y App consumen |
| `01-api/API_JWT_IMPLEMENTATION.md` | `cross-project` | Define requisitos de seguridad que cada cliente debe implementar |
| `03-app/APP_API_INTEGRATION.md` | `cross-project` | Espejo del contrato del backend desde la perspectiva del cliente móvil |
| `03-app/APP_DATA_STRATEGY.md` | `cross-project` (parcial — específicamente §6, tiempo real) | El contrato de chat en tiempo real aún no existe formalmente; cuando se formalice, afecta a Web también |
| `03-app/APP_DESIGN_SYSTEM.md` | `local` (por ahora) | Solo pasa a `cross-project` si se decide identidad visual compartida con Web — ver pendiente abierto en la propuesta original |

---

## 8. Checklist de Migración (orden sugerido de ejecución)

- [ ] Crear el vault unificado con la estructura ya entregada en el zip
- [ ] Copiar (no mover aún) los documentos reales de API y App dentro de `01-api/` y `03-app/`
- [ ] Recibir y ubicar los documentos de Web en `02-web/`, completar §4 con nombres reales
- [ ] Abrir el vault en Obsidian
- [ ] Renombrar cada archivo desde el explorador de Obsidian según §2/§3/§4
- [ ] Corregir manualmente las referencias cruzadas de §6.1 (y las que se descubran de Web una vez incorporada)
- [ ] Agregar el campo `scope` y tag `#cross-project` según §7
- [ ] Consolidar `OBSIDIAN_VAULT.md` según §5
- [ ] Eliminar los `_Home.md` por-proyecto (API y App)
- [ ] Verificar en Obsidian (panel de "Archivos no vinculados" / grafo) que no quedaron wikilinks rotos
- [ ] Borrar este archivo (`_MIGRATION_GUIDE.md`) una vez todo lo anterior esté hecho
