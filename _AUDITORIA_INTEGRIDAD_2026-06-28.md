---
type: meta
status: active
priority: P0
module: global
tags: [auditoria, integridad, fundacion, qa]
updated: 2026-06-28
---

# 🔍 Auditoría de Integridad — Fundación pre-features
## Vault Urbania — 2026-06-28 (antes de escalar a las features 5–16)

> [!info] Alcance
> A diferencia de la auditoría del 2026-06-27 (sincronización **documento ↔ código**, ya resuelta), esta revisión es **prospectiva**: ¿está la base lista para diseñar e implementar las siguientes features sin acumular deuda cara? Contrasta el código real (`API/`), el esquema canónico y los planes contra lo que exigen las features 5–16 + capa SaaS + RBAC (ver [[_RESEARCH_pantallas-mvp]] y [[_RESEARCH_modelo-datos]]).

> [!success] Estado: RESUELTO — Todas las correcciones aplicadas el 2026-06-28

---

## 0. Veredicto de contexto

> [!success] La base es sólida
> Arquitectura **DDD consistente** (`src/Auth`, `src/Propiedades`, `src/Directorio`, `src/Shared` + modelos en `app/Models`). Auth robusto (259 tests, PHPStan 10). **Propiedades y Directorio ya están implementados** (migraciones 06-27/06-28, módulos DDD, modelos y tests Feature) y bien scopeados a `condominium_id` con validación de coeficiente. El split `contacts`/`users` está bien razonado (Ley 675). `CHANGES_LOG` está al día (CAMBIO-004/005).

Los hallazgos **no** son de código mal hecho. Son de **dos clases**:
1. **Drift de esquema reaparecido**: el código avanzó (Sesión 14, Propiedades+Directorio) pero el esquema canónico y el estado global no se actualizaron.
2. **Fundación faltante para escalar**: la **multi-tenancy** y el **RBAC** no existen aún, y el modelo de "persona/actor" tiene un cabo legado. Retrofittear esto **ahora** (con solo 3 features) es barato; con 12 features encima, es carísimo.

Se detectaron **8 hallazgos**: 3 bloqueantes (🔴), 3 importantes (🟠), 2 menores (🔵).

---

## 1. Resumen por severidad

| ID | Sev. | Área / Archivo | Problema (resumen) | Estado |
|----|------|----------------|--------------------|--------|
| C1 | 🔴 Bloqueante | `01-api/API_DATABASE.md`, `DB_SCHEMA_OVERVIEW.md` | El esquema canónico no incluye las 11 tablas ya implementadas (Propiedades+Directorio); las marca "pendientes" | ✅ Resuelto — API_DATABASE.md sincronizado con 17 tablas |
| C2 | 🔴 Bloqueante | `API/` (esquema), tenancy | No existe capa multi-tenant (`organizations`); `users` sin `organization_id` ni scoping de conjunto | ✅ Resuelto — organizations + organization_id + middleware tenant + JWT claim org_id |
| C3 | 🔴 Bloqueante | `users.role`, JWT | Roles binarios (`admin`/`user`) incompatibles con el RBAC y los ~14 roles planeados | ✅ Resuelto — RBAC implementado, users.role ya no autoriza |
| H1 | 🟠 Importante | `users.unit`, `contacts`/`property_occupants` | Cabo legado `users.unit` (texto libre) + "actor" de las operaciones (user vs contact) sin definir | ✅ Resuelto — users.unit eliminado, invariante user⇄contact, regla party/actor |
| H2 | 🟠 Importante | `users` ↔ `condominiums` | Staff (admin/vigilante/contador) sin relación con el/los conjunto(s) donde opera (substrato de `role_assignments.scope`) | ✅ Resuelto — scoping vía role_assignments.scope, residente vía property_occupants |
| H3 | 🟠 Importante | `00-shared/GLOSSARY.md` | Términos pendientes sin confirmar + faltan los nuevos (`organization`, `vendor`, `third_party`) | ✅ Resuelto — GLOSSARY actualizado con términos nuevos |
| L1 | 🔵 Menor | `_Home.md` GLOBAL_STATUS | Desfasado: dice "API Sesión 9, 259 tests"; Propiedades se hizo en Sesión 14 | ✅ Resuelto — _Home.md GLOBAL_STATUS actualizado |
| L2 | 🔵 Menor | `FEATURES_INDEX.md` (catálogo) | Wikilinks del catálogo sin resolver (por diseño): `COBRANZA`, `ROLES_PERMISOS`, … | ✅ Resuelto — wikilinks marcados como (por crear) |

---
## 2. Bloqueantes (resolver antes de diseñar la siguiente feature)

### 🔴 C1 — El esquema canónico se desincronizó del código (drift reaparecido)
**Archivos:** `01-api/API_DATABASE.md` (`updated: 2026-06-23`), `00-shared/DB_SCHEMA_OVERVIEW.md`.
Propiedades (8 tablas) y Directorio (3 tablas) **ya están implementados** — migraciones `2026_06_27_*` (Directorio) y `2026_06_28_*` (Propiedades), módulos `src/Propiedades` / `src/Directorio`, 13 modelos en `app/Models`, y suites `tests/Feature/Propiedades` y `tests/Feature/Directorio`. `CHANGES_LOG` lo confirma (CAMBIO-004 "API ✅ Implementado, Sesión 14"). Sin embargo:
- `API_DATABASE.md` **solo documenta las 6 tablas de Auth** — faltan `condominiums`, `towers`, `property_types`, `property_statuses`, `property_document_types`, `properties`, `property_status_log`, `property_documents`, `contacts`, `occupant_types`, `property_occupants`.
- `DB_SCHEMA_OVERVIEW.md` (líneas ~19, 52, 72, 124–129) las marca *"diseñadas, pendientes de implementar"*.

**Riesgo:** la feature 7 (Cobranza) y siguientes leen `properties.coefficient` y `contacts`; diseñarlas contra un esquema canónico incompleto reintroduce el desajuste que arregló la auditoría anterior.
**Corrección:** documentar las 11 tablas en `API_DATABASE.md` (desde las migraciones reales) y actualizar `DB_SCHEMA_OVERVIEW.md` a "implementadas".

### 🔴 C2 — No existe la capa multi-tenant (`organizations`)
**Evidencia:** `grep organization|tenant` sobre `API/app` y `API/database` → **sin resultados**. `users` (migración `2026_06_19_000001`) no tiene `organization_id` ni `condominium_id`; `condominiums` es raíz sin entidad propietaria.
**Por qué bloquea:** el modelo de negocio (un edificio **o** una administradora con muchos conjuntos) exige el tenant. Cada tabla operativa nueva necesitará el scoping (`condominium_id` / `organization_id`). Si se difiere, retrofittearlo obliga a migrar todas las tablas posteriores.
**Corrección:** introducir `organizations` y el scoping (ver [[_RESEARCH_modelo-datos]] §2) y añadir `organization_id` a `users` y `condominiums`. Es la **Fase 0.2** del orden de [[_RESEARCH_pantallas-mvp]] §7.

### 🔴 C3 — Modelo de roles binario, incompatible con el RBAC planeado
**Archivo:** `2026_06_19_000001_create_users_table.php` → `$table->string('role', 20)->default('user')`. `API_DATABASE.md` lo refuerza: *"No requieren tabla de roles/permisos separada para el MVP… el claim `role` del JWT se deriva de `users.role`"*.
**Conflicto:** la feature 5 (RBAC) y los clientes por rol necesitan ~14 roles (vigilante, contador, consejo, revisor fiscal, …) con permisos `recurso × acción` y alcance (ver [[_RESEARCH_modelo-datos]] §4 y [[_RESEARCH_pantallas-mvp]] §5). El enum binario actual no lo soporta y el **JWT** tendría que cambiar.
**Corrección:** decidir el RBAC (tablas `roles`, `permissions`, `role_assignments` con scope) **antes** de exponer cualquier cliente por rol. Es la **Fase 0.5** del orden.

---
## 3. Importantes (no bloquean el primer paso, pero resolver pronto)

### 🟠 H1 — `users.unit` legado + "actor" de las operaciones sin definir
**Evidencia:** `users` tiene `$table->string('unit', 50)->nullable()` (texto libre, ej. "Apto 101"), mientras `contacts` + `property_occupants` (ya implementados) son el modelo correcto persona↔unidad. Además, el ejemplo del contrato usa `fk_reservations_user_id` (actor = `user`), pero el modelo nuevo es **contact-céntrico**.
**Por qué importa:** sin una decisión, cada feature elegirá distinto a quién cuelga la acción del residente (reserva, pago, PQRS) — justo el riesgo que la §6 de [[FEATURE_PLANNING_TEMPLATE]] busca evitar.
**Corrección:** (a) fijar el actor canónico (`user_id` vs `contact_id`) para tablas operativas; (b) migrar y **deprecar `users.unit`** hacia `property_occupants`.

### 🟠 H2 — Staff sin scoping a conjunto
**Evidencia:** un `user` con rol admin/staff no tiene hoy relación con el/los `condominium(s)` donde opera (solo el `users.unit` de texto libre). Los residentes sí tienen ruta vía `property_occupants → properties → condominiums`.
**Por qué importa:** el RBAC (`role_assignments.scope`) necesita ese substrato para limitar qué ve cada rol por conjunto/torre. Va de la mano con C2 y C3.
**Corrección:** definir la relación `user ↔ condominium` (directa o vía asignaciones de rol con alcance) al introducir tenancy/RBAC.

### 🟠 H3 — GLOSSARY con términos sin confirmar y sin los nuevos
**Archivo:** `00-shared/GLOSSARY.md`, sección "Términos Pendientes de Confirmar": "Residente vs Usuario" (Web), "Chat vs Mensajería", "Sesión activa".
Además faltan los términos que introducen las features nuevas: `organization`/tenant, `vendor`/proveedor, `third_party`/tercero (contabilidad), y la relación entre `contact`, `vendor` y `third_party`.
**Corrección:** cerrar los pendientes y agregar los nuevos **antes** de Comunicaciones/Portal/Contabilidad, para no nombrar el mismo concepto de dos formas en código.

---

## 4. Menores (limpieza / consistencia)

### 🔵 L1 — `_Home.md` GLOBAL_STATUS desfasado
**Archivo:** `_Home.md` (línea ~63). Dice `API | 9 | ✅ Completada | … 259 tests | Auth (8 sesiones) + CORS`. Pero Propiedades se implementó en **Sesión 14** (CAMBIO-004 / `API_SESSION_MANIFEST`). La fila no refleja Propiedades+Directorio ni el número de sesión real.
**Corrección:** actualizar la fila API (sesión, tests, "siguiente tarea") tras resolver C1.

### 🔵 L2 — Wikilinks del catálogo sin resolver (por diseño)
**Archivo:** `FEATURES_INDEX.md`, sección "Catálogo de pantallas por feature". Los enlaces a docs aún no creados (`COBRANZA`, `ROLES_PERMISOS`, `PORTERIA`, …) aparecen como wikilinks sin resolver. Es **intencional** (resuelven al diseñar cada feature), pero relaja la propiedad "0 enlaces rotos" que dejó la auditoría del 06-27.
**Corrección:** ninguna urgente; tener presente que cada enlace resuelve al crear `00-shared/features/<NOMBRE>.md`. Opcional: marcarlos como *(por crear)* si se quiere distinguir de un enlace roto real.

---
## 5. Lo que SÍ está correcto (verificado)

- **Arquitectura DDD consistente**: `src/` contiene `Auth`, `Directorio`, `Propiedades`, `Shared`; los Eloquent en `app/Models` son la capa de persistencia. No hay divergencia de patrón entre Auth y las features nuevas. ✔️
- **Propiedades scopeada y normativa**: `properties.condominium_id` + `coefficient NUMERIC(7,6)` con `CHECK > 0`; validación de suma contra `condominiums.total_coefficient`. ✔️
- **Split `contacts` / `users` bien razonado**: `contacts.user_id` es FK nullable (`ON DELETE SET NULL`) — personas sin usuario del sistema (propietarios registrados por Ley 675). ✔️
- **`CHANGES_LOG` al día**: CAMBIO-004 (Propiedades, Sesión 14) y CAMBIO-005 (Directorio) reflejan el avance real — la trazabilidad de cambios funciona. ✔️
- **Auth robusto**: 259 tests, PHPStan level 10, rotación de refresh tokens, MFA, auditoría de seguridad. ✔️

> El problema no es el código construido, sino lo que **falta de fundación** (C2, C3, H2) y la **doc de esquema** que no siguió al código (C1, L1).

---

## 6. Orden sugerido de corrección (para la sesión nueva)

1. **C1** — sincronizar `API_DATABASE.md` + `DB_SCHEMA_OVERVIEW.md` con las 11 tablas implementadas (mecánico, bajo riesgo, desbloquea diseñar sobre el esquema real). Cerrar con L1 (`_Home`).
2. **C2 + H2** — decidir e introducir `organizations` (tenancy) y el scoping `user ↔ condominium`. Abrir un `CAMBIO-00X` cross-project (toca `users` y `condominiums`).
3. **C3** — decidir el RBAC (`roles`, `permissions`, `role_assignments` con scope) y el impacto en el JWT. Sustituye el enum `users.role`.
4. **H1** — fijar el actor canónico (`user_id` vs `contact_id`) y migrar/deprecar `users.unit`.
5. **H3** — cerrar términos del GLOSSARY y agregar los nuevos.
6. **L2** — opcional; tener presente la convención de wikilinks del catálogo.

> Racional de secuencia: C1 desbloquea el diseño; C2/C3/H1/H2 son **retrofits sobre `users`/el esquema** y conviene hacerlos juntos **ahora** (3 features) y no luego (15+). Coincide con la **Fase 0** de [[_RESEARCH_pantallas-mvp]] §7: `Tenancy → RBAC → Cobranza → …`.

---

## 7. Documentos relacionados

| Documento | Relación |
|---|---|
| [[_AUDITORIA_INTEGRIDAD_2026-06-27]] | Auditoría previa (doc ↔ código), ya resuelta |
| [[_RESEARCH_pantallas-mvp]] | Pantallas + orden de desarrollo (§7) y RBAC (§5) |
| [[_RESEARCH_modelo-datos]] | Modelo propuesto: tenancy (§2), RBAC (§4) |
| [[01-api/API_DATABASE]] | Esquema canónico a actualizar (C1) |
| [[DB_SCHEMA_OVERVIEW]] | Resumen de esquema a actualizar (C1) |
| [[CHANGES_LOG]] | Abrir aquí el/los CAMBIO para C2/C3 |
| [[GLOSSARY]] | Términos a cerrar (H3) |
