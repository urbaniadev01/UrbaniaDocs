---
type: meta
status: active
priority: P0
module: global
tags: [auditoria, integridad, qa]
updated: 2026-06-27
---

# 🔍 Auditoría de Integridad de la Documentación
## Vault Urbania — 2026-06-27

> [!info] Alcance
> Verificación de que los **registros documentales** (manifests, planes, índices, logs)
> concuerden con las **tareas realmente completadas** (código en `API/` y `WEB/`).
> Método: contraste documento ↔ código fuente, más coherencia interna entre documentos.

---

## 0. Hallazgo de contexto — antes de leer el detalle

> [!success] CONFIRMADO (2026-06-27): API en Sesión 9, Web en Sesión 1, App sin iniciar
> Juan confirmó el estado: **API + Web generados, App aún no iniciada**. El código de `API/` respalda las 9 sesiones (módulo Auth completo + CORS, 259 tests). Todo lo documentado como completado tiene código real detrás. **Todas las inconsistencias de abajo fueron corregidas el 2026-06-27** — ver §1.1.

**Veredicto general:** la documentación **no estaba inventada** — todo lo que se afirma completado tiene código que lo respalda. Los problemas eran de **sincronización/retoque**: registros desfasados respecto al estado real. Se detectaron **15 hallazgos** (3 contradicciones directas, 4 altas, 3 medias, 4 bajas + 1 limpieza estructural mayor descubierta en verificación: C4). **Todos resueltos.**

---

## 1. Resumen por severidad

| ID | Severidad | Archivo | Problema (resumen) |
|----|-----------|---------|--------------------|
| C1 | 🔴 Crítico | `02-web/WEB_FEATURES_INDEX.md` | Auth marcado "⬜ Pendiente" pero está ✅ Completado |
| C2 | 🔴 Crítico | `00-shared/FEATURES_INDEX.md` | Estado "Completado" contradice columnas por proyecto + leyenda |
| C3 | 🔴 Crítico | `_Home.md` | GLOBAL_STATUS de API desfasado (Sesión 8 / 253 tests; real: 9 / 259) |
| H1 | 🟠 Alto | `02-web/WEB_SESSION_MANIFEST.md` | Entradas de `sonner` se contradicen con su propio resumen y con el código |
| H2 | 🟠 Alto | `01-api/API_IMPLEMENTATION_PLAN.md` | Sesión 2 marcada "✅ COMPLETADA" con **todas** las casillas `[ ]` sin marcar |
| H3 | 🟠 Alto | `01-api/API_IMPLEMENTATION_PLAN.md` | Sesión 7 completa (`[x]`) pero sin el marcador "✅ COMPLETADA" del encabezado |
| H4 | 🟠 Alto | `01-api/API_IMPLEMENTATION_PLAN.md` | La Sesión 9 (CORS) no existe en el plan (solo llega a 8) |
| M1 | 🟡 Medio | API (varios) | Conteo de tests inconsistente: 252 / 253 / 259 entre documentos |
| M2 | 🟡 Medio | API (varios) | Cobertura global: 94.1% vs 94.4% según el documento |
| M3 | 🟡 Medio | `02-web/WEB_SESSION_MANIFEST.md` | Métrica e2e "3/11" no coincide con el archivo real (4/7) |
| L1 | 🔵 Bajo | varios | Fechas `updated`/`ultima_revision` anteriores al contenido que describen |
| L2 | 🔵 Bajo | `00-shared/CHANGES_LOG.md` | Wikilink roto: `[[FEATURES_Y_PANTALLAS]]` no existe |
| L3 | 🔵 Bajo | `01-api/docs/log/sesiones/` | Nomenclatura: `sesion-1..8` vs `sesion-09` (cero inconsistente) |
| L4 | 🔵 Bajo | `01-api/API_SESSION_MANIFEST.md` | "Sesion 8 finalizada" y "8 documentos" desfasados |
| C4 | 🔴 Crítico | `API_CONTRACT.md` + `API_DATABASE.md` | Índice §2–§23 y 58 tablas de negocio + ~210 enlaces a `endpoints/*` borrados en CAMBIO-001 |

---

## 1.1 Resolución aplicada (2026-06-27)

Todas las correcciones se aplicaron sobre el vault (reversibles vía git):

| ID | Qué se hizo |
|----|-------------|
| C1 | `WEB_FEATURES_INDEX`: Auth → ✅ Completado. |
| C2 | `FEATURES_INDEX`: leyenda "Completado" aclarada (N/A o proyecto no iniciado no bloquean); Configuración → "En progreso". |
| C3 | `_Home`: GLOBAL_STATUS API → Sesión 9, 259 tests. |
| H1 | `WEB_SESSION_MANIFEST`: eliminadas filas de `sonner.d.ts`/`sonner-mock.ts`/alias vite; `sonner ^1.7.4`; nota de coverage actualizada. |
| H2 | `API_IMPLEMENTATION_PLAN`: Sesión 2 con todas las casillas marcadas. |
| H3 | `API_IMPLEMENTATION_PLAN`: Sesión 7 marcada "✅ COMPLETADA (2026-06-20)". |
| H4 | `API_IMPLEMENTATION_PLAN`: añadida Sesión 9 (CORS) al mapa y como sección. |
| M1 | Tests Sesión 8 unificados a 253; total vigente 259. |
| M2 | Cobertura global unificada a 94.1 %. |
| M3 | `WEB_SESSION_MANIFEST`: métrica e2e → 4/7. |
| L1 | Fechas `updated`/`ultima_revision` puestas a 2026-06-27 en los archivos tocados. |
| L2 | Enlace roto `[[FEATURES_Y_PANTALLAS]]` eliminado (CHANGES_LOG, PAQUETES, API_CONTRACT ×2). |
| L3 | Logs de sesión renombrados a `sesion-01..09`; referencia en API_DATABASE ajustada. |
| L4 | `API_SESSION_MANIFEST`: caja de módulo y conteo de documentos corregidos. |
| **C4** | **`API_CONTRACT` 767→285 líneas**: eliminado el índice §2–§10/§12–§23, flujos de negocio y códigos de error de módulos no creados (se conservan §1 Auth, §11 Health, §C Configuración-vía-Auth). **`API_DATABASE` 2253→296 líneas**: eliminadas las 58 tablas de negocio (§3) y "Relaciones entre módulos" (se conservan las 6 tablas de Auth §2.1–§2.6). Cero enlaces colgantes restantes. |

> [!note] Panoramas de dominio + FEATURES_INDEX — resuelto (2026-06-27)
> Los 20+ archivos `00-shared/features/<MÓDULO>.md` se **conservaron** (CAMBIO-001 los mantiene como referencia de dominio, estado "Propuesto"). Tenían **112 enlaces rotos** a specs/UI (`02-web/`, `03-app/`) y docs de endpoint (`01-api/endpoints/`) borrados; se limpiaron: la sección "Documentos de implementación" se reemplazó por un marcador ("se enlazará al implementar") y las referencias en prosa a `[[01-api/endpoints/X]]` se pasaron a texto plano. `FEATURES_INDEX.md` quedó verificado **sin enlaces rotos** (sus 23 enlaces de panorama resuelven). AUTH conserva sus enlaces (specs reales existen). **Resultado: 0 enlaces colgantes en las features.**

---

## 2. Contradicciones directas (corregir primero)

### 🔴 C1 — Web Auth figura como "Pendiente" pero está completado
**Archivo:** `02-web/WEB_FEATURES_INDEX.md`, tabla "Estado de Módulos", fila 1 (línea ~34).
Dice `Auth … ⬜ Pendiente`, pero:
- `WEB_SESSION_MANIFEST.md` → módulo Auth **✅ Completado (Sesión 1)**.
- Código presente: `src/features/auth/` completo, 13 tests verdes.
- `WEB_IMPLEMENTATION_PLAN.md` → Sesión 1 **✅ Completada**.

**Corrección:** cambiar a `✅ Completado`. (El propio doc dice "si hay discrepancia, el plan manda" — y el plan dice completado.)

### 🔴 C2 — "Completado" choca con las columnas por proyecto
**Archivo:** `00-shared/FEATURES_INDEX.md`, tabla "Estado de Features".
La leyenda define **Completado = "Todos los proyectos con CI pasando"**, pero:
- Fila 1 **Auth**: Estado `Completado`, pero **App = Pendiente**.
- Fila 23 **Configuración**: Estado `Completado`, pero **Web = Pendiente** (la UI `/settings` es Sesión 2, aún no hecha) y App = N/A.

Ninguna de las dos cumple "todos los proyectos". El caso de **Configuración es el más claro**: su parte Web no existe todavía.

**Corrección (elige una):** (a) bajar Configuración a `En progreso` y Auth a `En progreso` hasta que App entre; o (b) redefinir la leyenda a "Completado = done en todos los proyectos **en alcance**" y dejar las filas. Recomiendo (b) + revisar Configuración, porque su Web sí está en alcance y pendiente.

### 🔴 C3 — `_Home.md` GLOBAL_STATUS desfasado para API
**Archivo:** `_Home.md`, bloque GLOBAL_STATUS (línea ~63).
Dice `API | 8 | ✅ Completada | … 253 tests`. El estado real es **Sesión 9 (CORS), 259 tests** (`API_SESSION_MANIFEST.md` + `docs/log/sesiones/sesion-09.md`). El bloque no se actualizó tras la Sesión 9.

**Corrección:** actualizar fila API a `Sesión 9`, `259 tests`, y la "siguiente tarea".

---

## 3. Inconsistencias internas por retoque

### 🟠 H1 — `sonner` quedó a medio limpiar en el manifest Web
**Archivo:** `02-web/WEB_SESSION_MANIFEST.md`.
El resumen (línea ~46) dice correctamente *"Sonner instalado (v1.7.4) y mock temporal eliminado"* — confirmado en código (`package.json` `sonner ^1.7.4`, `ToastProvider` importa `'sonner'`, sin alias en `vite.config.ts`). Pero quedaron registros viejos:
- "Archivos Creados" sigue listando `WEB/src/types/sonner.d.ts` (~línea 130) y `WEB/src/lib/sonner-mock.ts` (~línea 134) como TEMPORALES → **ya no existen** (borrados).
- "Archivos Modificados" (~línea 176): `vite.config.ts | Agregado alias temporal sonner → mock local` → **el alias ya no está**.
- Deuda técnica #3 (~línea 193): "Restaurar thresholds de coverage… *se restaurarán cuando sonner se instale*" → sonner **ya está instalado**; el bloqueo declarado ya no aplica (la deuda puede seguir vigente, pero por otra razón).

**Corrección:** eliminar/anotar como removidos los 2 archivos temporales, quitar la fila del alias de vite, y reescribir la razón de la deuda #3 (thresholds siguen desactivados en `vitest.config.ts`, pero ya no por sonner).

### 🟠 H2 — Sesión 2 del plan API: "completada" pero sin una sola casilla marcada
**Archivo:** `01-api/API_IMPLEMENTATION_PLAN.md`, Sesión 2 (encabezado ~línea 108).
Encabezado: `## Sesion 2: Domain Layer Auth ✅ COMPLETADA (2026-06-19)`. Sin embargo **todas** las tareas (líneas ~123–131) y todo el checklist de cierre (líneas ~140–144) están en `[ ]`. El código confirma que el Domain existe (`src/Auth/Domain/...`), así que la sesión **sí** está hecha; solo faltó marcar las casillas.

**Corrección:** marcar las casillas `[x]` de la Sesión 2 (o, si quieres trazabilidad fiel, dejar constancia de por qué quedaron sin marcar).

### 🟠 H3 — Sesión 7 del plan API sin marcador de completada
**Archivo:** `01-api/API_IMPLEMENTATION_PLAN.md`, Sesión 7 (encabezado ~línea 317).
Todas sus tareas están `[x]` y la Sesión 8 (que depende de 1–7) está completada, pero el encabezado dice solo `## Sesion 7: Password Management + Perfil` — le falta el `✅ COMPLETADA (fecha)` que llevan las demás. Visualmente parece no terminada.

**Corrección:** añadir `✅ COMPLETADA (2026-06-20)` al encabezado de la Sesión 7.

### 🟠 H4 — La Sesión 9 (CORS) no figura en el plan de implementación
**Archivo:** `01-api/API_IMPLEMENTATION_PLAN.md` (`updated: 2026-06-20`).
El "Mapa de Sesiones" y el cuerpo llegan solo a la **Sesión 8**. Pero existe la Sesión 9 (CORS): manifest la marca como actual, hay `sesion-09.md` y hay código (`CorsMiddleware`, `config/cors.php`). Además `API_SESSION_MANIFEST.md` (Notas) sigue diciendo que el plan *"define 8 sesiones"*.

**Corrección:** agregar la Sesión 9 al plan (aunque sea fuera del arco del módulo Auth, como cambio transversal post-cierre) o documentar explícitamente que CORS fue un add-on posterior al cierre del módulo. Actualizar la nota del manifest.

---

## 4. Discrepancias numéricas

### 🟡 M1 — Número de tests API: 252 / 253 / 259
- Plan, Sesión 8 entregable (~línea 391): **252 tests**.
- `docs/log/sesiones/sesion-8.md`: **253 passed**.
- `_Home.md`: **253** (para Sesión 8).
- `API_SESSION_MANIFEST.md` + `sesion-09.md`: **259** (estado actual tras CORS).

El "252" del plan contradice su propio log de Sesión 8 (253). El valor **canónico actual es 259**. (Conteo propio: 251 declaraciones `it/test`; con datasets de Pest + tests `arch()` el total 259 es plausible — no se marca como error, pero conviene fijar una sola cifra por sesión.)
**Corrección:** plan Sesión 8 → 253; confirmar 259 como total vigente en todos los docs que citen "total".

### 🟡 M2 — Cobertura global API: 94.1% vs 94.4%
- Plan, Sesión 8 (líneas ~378, 391, 398): **94.4 %**.
- `sesion-8.md` + `API_SESSION_MANIFEST.md`: **94.1 %**.

**Corrección:** unificar (probable correcto: 94.1 %, que es lo que reporta el log y el manifest).

### 🟡 M3 — Métrica e2e Web "3/11" sin sustento
**Archivo:** `02-web/WEB_SESSION_MANIFEST.md`, Métricas (~línea 86): `Flujos e2e críticos | 3/11`.
El archivo real `WEB/tests/e2e/auth.spec.ts` tiene **4 activos + 3 `skip` = 7** (4 implementados). La deuda técnica #6 lo dice bien (**4/7**). La métrica "3/11" no concuerda ni en numerador ni en denominador.
**Corrección:** poner `4/7` (o el objetivo real de flujos), alineado con la deuda #6.

---

## 5. Menores (limpieza)

### 🔵 L1 — Fechas de frontmatter anteriores al contenido
- `02-web/WEB_IMPLEMENTATION_PLAN.md` → `ultima_revision: 2026-06-17`, pero describe Sesión 0 (06-23) y Sesión 1 (06-24).
- `02-web/WEB_FEATURES_INDEX.md` → `ultima_revision: 2026-06-20` (y aún muestra Auth pendiente, ver C1).
- `01-api/API_IMPLEMENTATION_PLAN.md` → `updated: 2026-06-20`, anterior a la Sesión 9 (06-26).

**Corrección:** actualizar fechas al tocar cada archivo.

### 🔵 L2 — Wikilink roto
`00-shared/CHANGES_LOG.md` (Documentos Relacionados, ~línea 60) enlaza `[[FEATURES_Y_PANTALLAS]]`, que **no existe** en el vault. **Corrección:** apuntar a `[[FEATURES_INDEX]]` o eliminar la fila.

### 🔵 L3 — Nomenclatura de notas de sesión API
`sesion-1.md … sesion-8.md` (sin cero) conviven con `sesion-09.md` (con cero). Rompe el orden alfabético del explorador (los dataview ordenan por `session_number`, así que la vista no se ve afectada). **Corrección:** renombrar a `sesion-01..09` para consistencia.

### 🔵 L4 — Frases desfasadas en `API_SESSION_MANIFEST.md`
- Caja "Modulo" (~línea 63): "✅ Completado (**Sesion 8** finalizada)" cuando la sesión actual es 9.
- "Notas Adicionales" (~línea 151): "**8 documentos** en raíz" — hay **10** archivos `API_*.md` (8 técnicos + 2 meta: plan y manifest). Ambiguo; aclarar la cifra.

---

## 6. Lo que SÍ está correcto (verificado)

- **Rutas Auth de la API**: existen y están cableadas en `src/Auth/Presentation/routes.php` vía `UrbaniaAuthServiceProvider` (no solo `/health`). ✔️
- **Tests de arquitectura**: existen (`tests/Architecture/DomainArchitectureTest.php`, `arch()`). ✔️
- **`01-api/endpoints/CONFIGURACION.md`**: es un doc de reagrupación; todas sus referencias `AUTH §1.5/1.8/1.9/1.10/1.11/1.14/1.15/1.18/1.19/1.20` **resuelven correctamente** en `endpoints/AUTH.md`. ✔️
- **Código Web ↔ manifest**: la lista de archivos creados y los 13 tests (4 archivos) coinciden con `WEB/src` y `WEB/tests`. ✔️
- **`CHANGES_LOG` CAMBIO-001**: explica el borrado de los docs de diseño anticipados (cambio de estrategia "1 feature a la vez"), coherente con que `endpoints/` y `features/` solo contengan Auth/Configuración. ✔️

---

## 7. Orden sugerido de corrección
1. **C1, C3** (1 línea cada uno, alto impacto de lectura).
2. **C2** (decidir definición de "Completado").
3. **H1, H2, H3, H4** (retoques de manifests/plan).
4. **M1, M2, M3** (fijar cifras únicas).
5. **L1–L4** (limpieza al pasar por cada archivo).
