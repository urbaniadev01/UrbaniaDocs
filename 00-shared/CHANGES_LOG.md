---
type: meta
status: active
priority: P0
module: shared
tags: [log, cross-project, traceability, shared]
updated: 2026-06-28
---

# 📊 CHANGES_LOG
## Registro de Cambios Cross-Project

> [!warning] Disciplina de uso
> Cada entrada incrementa el número (`CAMBIO-001`, `CAMBIO-002`, ...) sin reutilizar números, aunque se cierre como "no aplicaba".

---

## Formato de Entrada

```markdown
## CAMBIO-NNN — <título corto>
- Fecha de apertura: AAAA-MM-DD
- Afecta a: API / Web / App (marcar los que correspondan)
- Estado API: Propuesto | En progreso | Sincronizado | No aplica
- Estado Web: Propuesto | En progreso | Sincronizado | No aplica
- Estado App: Propuesto | En progreso | Sincronizado | No aplica
- Documento de referencia: enlace a la sección de SYSTEM_CONTRACT.md correspondiente
- Notas: contexto breve, decisiones tomadas, enlaces a sesiones de IMPLEMENTATION_PLAN
```

---

## Entradas

## CAMBIO-001 — Diseño de endpoints API para todos los features de negocio [CERRADO]

- Fecha de apertura: 2026-06-23
- Fecha de cierre: 2026-06-27
- Afecta a: API / Web / App
- Estado API: ~~En progreso~~ → **Cerrado** (diseños eliminados)
- Estado Web: ~~Sincronizado~~ → **Cerrado** (diseños eliminados)
- Estado App: ~~Sincronizado~~ → **Cerrado** (diseños eliminados)
- Documento de referencia: [[00-shared/SYSTEM_CONTRACT]]
- Motivo de cierre: Decisión de cambio de estrategia — los features se diseñan e implementan **uno a la vez**. Se eliminaron todos los documentos de diseño pendientes de `01-api/endpoints/`, `02-web/features/` y `03-app/features/` (23 features × 3 proyectos ≈ 67 archivos/carpetas). Solo se conserva `00-shared/` (panoramas, índices, contratos) y los templates.
- Notas:
  - Auth (#1) sigue siendo el único feature **Completado** con código implementado.
  - Los panoramas en `00-shared/features/` se mantuvieron como referencia de dominio (⚠ revertido luego en **CAMBIO-002**: se eliminaron los especulativos).
  - Los templates (`_templates/` en cada proyecto) se mantienen para uso futuro.
  - A partir de ahora: **1 feature → 1 ciclo completo de diseño + implementación**, sin acumular documentación anticipada.

---

## CAMBIO-002 — Reinicio de panoramas de feature + §6 Modelo de datos en la plantilla [CERRADO]

- Fecha de apertura: 2026-06-27
- Fecha de cierre: 2026-06-27
- Afecta a: API / Web / App (solo documentación, sin cambios de código)
- Estado API: No aplica
- Estado Web: No aplica
- Estado App: No aplica
- Documento de referencia: [[FEATURE_PLANNING_TEMPLATE]]
- Motivo: Redefinición del método de diseño:
  1. Se eliminaron los 20 panoramas especulativos de `00-shared/features/` (respaldo en `_backup/features_backup.tar.gz`), conservando solo **Auth** y **Configuración** (implementados).
  2. Se agregó a [[FEATURE_PLANNING_TEMPLATE]] la sección **§6 Modelo de datos / diccionario de campos**, que obliga a declarar por cada campo si es **valor** o **referencia** (entidad/catálogo) antes de mapear endpoints — para que el modelo de BD no se decida de forma implícita.
  3. Se recreó [[00-shared/features/PROPIEDADES]] como ejemplo completo del método.
  4. Se reseteó [[DB_SCHEMA_OVERVIEW]] a las tablas implementadas (Auth) + `properties`.
- Notas:
  - Los features se rediseñan **uno a la vez** desde la plantilla cuando se vayan a implementar.
  - Reversible vía git y vía el respaldo `.tar.gz`.

---

## CAMBIO-003 — Catálogo completo de features planificadas [CERRADO]

- Fecha de apertura: 2026-06-27
- Fecha de cierre: 2026-06-27
- Afecta a: API / Web / App (solo documentación — FEATURES_INDEX)
- Estado API: No aplica
- Estado Web: No aplica
- Estado App: No aplica
- Documento de referencia: [[FEATURES_INDEX]]
- Motivo de cierre: Se completó la ampliación del catálogo. El cambio fue puramente documental — no requiere implementación.
- Notas:
  - Se amplió el catálogo de 3 a 28 features, organizados por orden lógico de implementación (dependencias primero).
  - Se agregó contexto del proyecto y «Notas clave para Colombia» en la cabecera de [[FEATURES_INDEX]].
  - Los features se mantienen en estado **Propuesto** — cada uno recibe su diseño **uno a la vez**.

---

## CAMBIO-004 — Rediseño completo de Propiedades y Unidades (Feature #2) [ABIERTO]

- Fecha de apertura: 2026-06-27
- Afecta a: API / Web / App
- Estado API: ✅ Implementado (migraciones + seed, catálogos, torres, propiedades, documentos; tests pasando)
- Estado Web: ✅ Implementado (Sesión 4 — types, services, hooks, 8 componentes, 3 páginas; build + lint + type-check en verde; 13/13 tests pasan)
- Estado App: ⏸ Pendiente (specs y UI por diseñar)
- Documento de referencia: [[00-shared/features/PROPIEDADES]]
- Notas:
  - Se reemplazó el panorama de ejemplo de PROPIEDADES con el diseño definitivo listo para implementar.
  - Decisiones clave del diseño:
    - **Multi-conjunto**: se agrega tabla `condominiums` como raíz del inventario (SaaS multi-tenant desde el día 1)
    - **Torres como entidad**: se promueve `towers` a tabla propia (antes era atributo inline)
    - **Catálogos configurables**: `property_types`, `property_statuses` y `property_document_types` como tablas catálogo (no ENUMs fijos) — el admin puede agregar tipos y estados sin deploy
    - **Auditoría**: `property_status_log` registra cada cambio de estado con motivo obligatorio
    - **Documentos**: `property_documents` para adjuntar escrituras, planos, certificados por unidad
  - Se agregó `allows_residents` a `property_statuses` para proteger la consistencia: si un estado no admite residentes, el sistema rechaza asignaciones
  - Total: 8 tablas nuevas (`condominiums`, `towers`, `property_types`, `property_statuses`, `properties`, `property_status_log`, `property_document_types`, `property_documents`)
  - API completada en Sesión 14 (ver [[API_SESSION_MANIFEST]]). Documentos de endpoints creados: `CONDOMINIUMS.md`, `TOWERS.md`, `PROPERTY_CATALOGS.md`, `PROPIEDADES.md`.
  - Web completada en Sesión 4 (ver [[WEB_SESSION_MANIFEST]]). Implementadas 3 rutas (`/properties`, `/properties/towers`, `/properties/catalogs`), sidebar con submenú, drawer de detalle, modales de crear/editar/cambiar estado, upload de documentos con drag & drop, validación inline de coeficientes, todas las reglas de negocio del spec (piso 0 = sótano, full_designation, motivo obligatorio en cambio de estado, advertencia de allows_residents, etc.).
  - Pendiente: App (Flutter) — pantalla de solo lectura para residentes.

---

## CAMBIO-005 — Directorio (Residentes y Propietarios) [ABIERTO]

- Fecha de apertura: 2026-06-27
- Afecta a: API / Web / App
- Estado API: ✅ Implementado (3 migraciones, 11 endpoints, DDD completo, tests pasando)
- Estado Web: ✅ Implementado (3 páginas, 13 archivos, build + tests OK)
- Estado App: ⏸ Pendiente (spec diseñado)
- Documento de referencia: [[00-shared/features/DIRECTORIO]]
- Notas:
  - **Diseño:** Se creó el panorama completo del Directorio con 3 tablas nuevas (`contacts`, `occupant_types`, `property_occupants`).
  - Decisiones clave del diseño:
    - **Contacts como tabla separada de Users**: las personas en el directorio pueden no tener usuario del sistema (ej: propietarios que no usan la plataforma pero deben estar registrados por Ley 675 de 2001)
    - **Relación opcional contact→users**: `contacts.user_id` FK nullable a `users.id` — cuando la persona se registra en la plataforma, se vincula
    - **Tipos de ocupante configurables**: `occupant_types` como catálogo (no ENUM fijo) — 6 tipos seed
    - **Multi-rol y multi-unidad**: una persona puede tener múltiples roles y pertenecer a varias unidades
    - **Trazabilidad temporal**: fechas de mudanza para historial de ocupación
    - **Deprecación de `users.unit`**: la columna VARCHAR(50) actual se deprecia en favor de la relación formal via `property_occupants`
  - **API implementada:** migraciones, Domain (Entities, VOs, Exceptions, Repositories), Application (DTOs, UseCases), Infrastructure (Models, Mappers, Repositories), Presentation (Controllers, Middleware role), 8 tests pasando.
  - **Web implementada:** types, service API, hooks TanStack Query, 5 componentes (ContactTable, ContactForm, OccupantLinkForm, UnitOccupantList, OccupantHistory), 3 páginas (DirectorioPage, ContactoDetailPage, UnitOccupantsPage), router + sidebar, 13 tests unitarios OK, build OK.
  - **Pendiente:** App (Flutter), actualizar API_CONTRACT con códigos de error, agregar catálogo de pantallas en FEATURES_INDEX.

---

## CAMBIO-006 — Fundación multi-tenant (organizations) + RBAC + deprecación de users.unit [ABIERTO]

- Fecha de apertura: 2026-06-28
- Afecta a: API / Web / App
- Estado API: 🔵 En progreso — Sesión 3 completada (actor canónico + `users.unit` eliminado)
- Estado Web: 🔵 Plan definido — pendiente de implementar (depende del API)
- Estado App: 🔵 Plan definido — pendiente de implementar (depende del API)
- Documento de referencia: [[00-shared/docs/adr/ADR-001]] — Decisión de arquitectura completa; [[SYSTEM_CONTRACT]] §3 Regla de actor y party
- Plan de implementación: [[00-shared/plans/PLAN_CAMBIO_006]] — 5 sesiones detalladas
- Notas:
  - Este cambio agrupa 4 hallazgos de la auditoría de integridad (2026-06-28) resueltos en ADR-001 y planificados en 5 sesiones secuenciales.
  - **Principio rector**: no reescribir Auth. Extender con tenant + montar autorización encima.
  - **Secuencia obligada**: Sesión 1 (docs) → 2 (tenancy) → 3 (actor/users.unit) → 4 (RBAC) → 5 (cierre).
  - **Punto de partida verificado**: Auth + Propiedades + Directorio implementados (17 tablas); ADR-001 Accepted; sin código de tenancy/RBAC; `users.unit` y `users.role` (enum binario) aún vivos.
  - **Sesión 3 completada (API, 2026-06-29)**:
    - Migraciones: `backfill_contacts_from_users`, `migrate_users_unit_to_occupants`, `drop_unit_from_users`.
    - Invariante user⇄contact: todo usuario activo tiene su contact asociado; contacts faltantes creados por backfill.
    - `users.unit` eliminada; los valores migrables pasaron a `property_occupants` (tipo `residente`, primary). Los no-match quedaron en `reconciliation_users_unit`.
    - Regla actor/party documentada en [[SYSTEM_CONTRACT]] §3 y términos `Party`/`Actor` agregados a [[GLOSSARY]].
    - Código de Auth limpiado: `unit` removido de `UserEntity`, DTOs, UseCases, Controller, Request, Resource y tests.
    - Suite API: 325 tests pasan; 3 fallos preexistentes (rate limit flaky + 2 CORS origen 5174). PHPStan: 6 errores preexistentes en `AppServiceProvider`.
  - **Premisas transversales**:
    - Migraciones reversibles (down() real). PK UUID v7, FK {tabla_singular}_id, timestamps, dinero NUMERIC(15,2).
    - Scope-lock por sesión: una sesión = un entregable corrible + tests + docs actualizadas.
    - Al cerrar cada sesión: actualizar API_DATABASE.md, DB_SCHEMA_OVERVIEW.md, GLOSSARY.md, estado de CAMBIO-006 y GLOBAL_STATUS de _Home.md.
  - **Riesgos clave**:
    - Backfills: `organizations` antes de NOT NULL; contacts antes de borrar `users.unit`; roles de sistema sembrados antes de migrar `users.role`.
    - JWT: cada cambio de claim obliga a ajustar tests de Auth — mantenerlos verdes es DoD.
    - RLS: decisión abierta entre activarla en Sesión 2 o como fast-follow (recomendado pronto; retrofittearla después es propenso a errores).

### Sesiones planificadas

| Sesión | Objetivo | DoD |
|--------|----------|-----|
| **1** (docs) | Sincronizar esquema canónico: volcar las 11 tablas ya implementadas a API_DATABASE.md desde migraciones reales. Confirmar DB_SCHEMA_OVERVIEW. Correr `migrate:fresh + pest` para baseline. | API_DATABASE.md con 17 tablas; baseline verde anotado; CAMBIO-006 → "En progreso" |
| **2** (tenancy) | Multi-tenancy: migraciones organizations + organization_id en users/condominiums/contacts. Backfill org por defecto. Middleware de tenant + global scope Eloquent. JWT claim org_id. RLS (opcional, fast-follow). | organizations existe; columnas NOT NULL; aislamiento probado; suite verde |
| **3** (actor) | Actor canónico: backfill contacts faltantes. Migrar users.unit → property_occupants. Drop columna. Regla party/actor documentada. | Invariante user⇄contact; users.unit eliminado; regla en SYSTEM_CONTRACT |
| **4** (RBAC) | Módulo src/Authorization: tablas roles/permissions/role_assignments. Seed de 14 roles + permisos. Resolver server-side con cache Redis. Migrar users.role. Gate can(). | RBAC operativo; users.role ya no autoriza; suite verde |
| **5** (cierre) | Cablear middlewares en pipeline HTTP. Suite completa + PHPStan 10. Cerrar CAMBIO-006. Resolver hallazgos de auditoría. Actualizar todos los docs. | CAMBIO-006 Sincronizado; auditoría 06-28 resuelta; docs al día |

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Flujo que genera estas entradas |
| [[SYSTEM_CONTRACT]] | Destino final del cambio una vez sincronizado |
| [[FEATURES_INDEX]] | Índice global de features con estado por proyecto |
| [[01-api/API_CONTRACT]] | Índice de endpoints (FUENTE ÚNICA en API) |
| [[01-api/API_DATABASE]] | Esquema de BD (FUENTE ÚNICA en API) |
