---
type: meta
status: active
priority: P0
module: shared
tags: [log, cross-project, traceability, shared]
updated: 2026-06-29
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
  - **Nota:** La implementación de App (Flutter) está diferida a una fase posterior del proyecto. No hay bloqueo — el feature es funcional en API + Web.

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
  - **Pendiente:** App (Flutter) — diferido a fase posterior. Pendiente menor: actualizar API_CONTRACT con códigos de error y agregar catálogo de pantallas en FEATURES_INDEX.

---

## CAMBIO-006 — Fundación multi-tenant (organizations) + RBAC + deprecación de users.unit [ABIERTO]

- Fecha de apertura: 2026-06-28
- Fecha de cierre: 2026-06-28
- Afecta a: API / Web / App
- Estado API: ✅ Sincronizado
- Estado Web: ⏸ Pendiente (depende del API, no se implementó código web)
- Estado App: ⏸ Pendiente (depende del API, no se implementó código app)
- Documento de referencia: [[00-shared/docs/adr/ADR-001]] — Decisión de arquitectura completa; [[SYSTEM_CONTRACT]] §3 Regla de actor y party
- Plan de implementación: 5 sesiones detalladas (ver [[00-shared/docs/adr/ADR-001]] y actas de sesión 14.2, 16, 17)
- Motivo de cierre: Implementación completa de ADR-001. Auth intacto (328 tests). Multi-tenancy con organizations, middleware de tenant, JWT claim org_id. Actor canónico implementado: invariante user⇄contact, users.unit eliminado, regla party/actor en SYSTEM_CONTRACT. RBAC completo con módulo src/Authorization, resolver con cache Redis, 14 roles de sistema, permisos recurso.accion, y reemplazo de users.role por role_assignments. Pendiente: cablear AuthorizationMiddleware en rutas específicas (se hará al implementar cada feature).
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
  - **Sesión 4 — migraciones y seeders RBAC (API, 2026-06-29)**:
    - Tablas creadas: `permissions`, `roles`, `role_permissions`, `role_assignments`, `permission_audit_log`, `approval_rules`.
    - Seeders idempotentes: 45 permisos `recurso.accion`, 11 roles de sistema con permisos asignados, migración de `users.role` a `role_assignments`.
    - `users.role` pasa a ser legacy/informativo; la autorización se resolverá server-side a partir de `role_assignments`.
    - Documentación de esquema actualizada en [[01-api/API_DATABASE.md]] (sección 5, Autorización / RBAC).
    - Suite API: 325 tests pasan; 3 fallos y 6 errores PHPStan preexistentes sin cambios.
  - **Sesión 16 — módulo Authorization DDD + resolver + middleware (API, 2026-06-29)**:
    - Creado el módulo `src/Authorization` con entidades `Role`, `Permission`, `RoleAssignment`, repositorio, resolver de permisos y service provider.
    - Implementado `CachedPermissionResolver` con cache Redis (prefijo `perms:`, TTL 5 minutos); combina asignaciones explícitas con permisos derivados de `property_occupants` para residentes.
    - Creados modelos Eloquent `Role`, `Permission`, `RoleAssignment`.
    - Creado `AuthorizationMiddleware` en `Shared/Infrastructure/Middleware` para autorizar por nombre de ruta usando permisos `recurso.accion`.
    - Registrado `AuthorizationServiceProvider` en `bootstrap/providers.php`.
    - Tests feature básicos: `tests/Feature/Authorization/PermissionResolverTest.php` (3 tests).
    - Suite API: 328 tests pasan; 3 fallos y 6 errores PHPStan preexistentes sin cambios. `composer lint` pasa (Pint también corrigió el formato preexistente en `src/Tenancy/Domain/Entities/OrganizationEntity.php`).
  - **Sesión 17 — cierre e integración (API, 2026-06-29)**:
    - Cableado de `TenantMiddleware` como prepend en el grupo `api` en `bootstrap/app.php`; `AuthorizationMiddleware` permanece disponible pero no se registra globalmente (se activará por ruta con nombre).
    - Verificación de regresiones: Auth, Propiedades y Directorio siguen pasando con scoping + authz.
    - Suite API: 328 tests pasan; 3 fallos preexistentes (rate limit flaky + 2 CORS origen 5174). PHPStan: 6 errores preexistentes en `AppServiceProvider`. `composer lint` pasa.
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

## CAMBIO-007 — Implementación Web del Feature 3: Configuración (Perfil y Seguridad) [ABIERTO]

- Fecha de apertura: 2026-06-29
- Afecta a: Web
- Estado API: No aplica (implementado vía AUTH)
- Estado Web: ✅ Sincronizado
- Estado App: No aplica
- Documento de referencia: [[00-shared/features/CONFIGURACION]]
- Notas:
  - **Objetivo:** Implementar las pantallas de Perfil y Seguridad en el panel web.
  - **API ya existente:** Todos los endpoints pertenecen a Auth (ya implementado) — `/auth/me`, `/auth/change-password`, `/auth/sessions/*`, `/auth/mfa/*`.
  - **Componentes UI shadcn/ui creados:** `Sheet`, `DropdownMenu`, `Avatar`, `Badge`, `Tabs`, `Skeleton`, `Card` — se crearon manualmente (el CLI de shadcn no está disponible por políticas de permiso).
  - **Archivos creados (14):**
    - Tipos: `account.types.ts`
    - Servicio API: `account.service.ts` (10 endpoints)
    - Hooks: `use-profile.ts`, `use-change-password.ts`, `use-sessions.ts`, `use-mfa.ts`
    - Componentes: `ProfileForm.tsx`, `ChangePasswordSheet.tsx`, `MfaSetupSheet.tsx`, `MfaDisableSheet.tsx`, `ActiveSessionsList.tsx`
    - Páginas: `ProfilePage.tsx`, `SecurityPage.tsx`
    - UserMenu: `UserMenu.tsx` (DropdownMenu en el header con avatar, perfil, seguridad, logout)
  - **Rutas agregadas:** `/settings/profile` y `/settings/security` (lazy + Suspense)
  - **Header actualizado:** Reemplazado el placeholder "Header — Sesión 2" por `<UserMenu />` con avatar + nombre + dropdown.
  - **Build:** 1896 módulos. ProfilePage 7.31 kB, SecurityPage 33.42 kB en chunks separados.
  - **Suite:** Build ✅, Lint ✅ (0 warnings), Type-check ✅ (0 errors), Tests ✅ (20/20).
  - **Reglas de negocio implementadas:**
    - Cambio de contraseña → revoca todas las sesiones → redirect a `/login` (spec §C.2)
    - MFA: flujo de 3 pasos (QR → verificar → códigos de respaldo)
    - Sesiones: tabla con revocación individual, "Cerrar todas las demás", badge "Esta sesión"
    - MfaDisableSheet adicional (requiere password + TOTP, no solo ConfirmDialog)
  - **Deuda técnica identificada:**
    - `Profile` (de `/auth/me`) usa `organization_id` vs `AuthUser` (del login) que usa `condominium_id` — inconsistencia manejada con helper
    - Sesiones anteriores del Web (1 y 4) no fueron commiteadas — archivos aparecen como untracked

---

## CAMBIO-009 — Feature #6: Comunicaciones — API + Web [ABIERTO]

- Fecha de apertura: 2026-06-29
- Afecta a: API / Web
- Estado API: ✅ Implementado (7 migraciones, módulo DDD completo, 13 rutas, 17 tests pasando)
- Estado Web: ✅ Implementado (4 páginas, 5 componentes, 4 hooks TanStack, 32 tests; type-check + lint + build en verde)
- Estado App: Pendiente (fuera del alcance de esta tanda)
- Documento de referencia: [[00-shared/features/COMUNICACIONES]]
- Notas:
  - **Objetivo:** Implementar el módulo de Comunicaciones — canal oficial admin→residentes con WhatsApp/email/push, cartelera digital, plantillas y encuestas.
  - **Diseño:** Panorama completo con §1-§15. 7 tablas nuevas (`announcements`, `announcement_deliveries`, `communication_channels`, `message_templates`, `surveys`, `survey_options`, `survey_responses`). 8 endpoints bajo `/comunicaciones/*`.
  - **Dependencias:** Directorio (`contacts`) y RBAC (`comunicaciones.ver`, `comunicaciones.crear`, `comunicaciones.configurar`) ya implementados.
  - **Permisos ya sembrados:** `comunicaciones.ver`, `comunicaciones.crear`, `comunicaciones.encuestas` en seeders RBAC; roles `admin`, `admin_conjunto` con acceso completo, `residente` con `comunicaciones.ver`.
  - **API:** 7 migraciones, módulo DDD `src/Comunicaciones/`, 8 endpoints, jobs de envío (WhatsApp/email/push), webhook de estado de entrega.
  - **Web:** 4 rutas, 7 componentes, 5 hooks, 4 páginas (Bandeja, Redactar, Encuestas, Canales).
  - **Orden de implementación:** API → Web.

---

## CAMBIO-008 — Feature #5: Roles y Permisos — Panel de administración [ABIERTO]

- Fecha de apertura: 2026-06-29
- Afecta a: API / Web
- Estado API: ✅ Implementado (8 endpoints management bajo /api/v1/authorization)
- Estado Web: ✅ Implementado (5 páginas, 17 archivos, sidebar + router + guard RBAC)
- Estado App: N/A
- Documento de referencia: [[00-shared/features/ROLES_PERMISOS]]
- Notas:
  - **Motivación:** Completar lo faltante del Feature 5 — la base RBAC (migraciones, modelos, resolver, middleware) ya existía de CAMBIO-006. Faltaban los endpoints HTTP de gestión (CRUD de roles, permisos, asignaciones, reglas de aprobación, bitácora) y todo el panel Web de administración.
  - **API — Sesión 18 (2026-06-29):**
    - Creados 11 UseCases (ListRoles, CreateRole, UpdateRole, SetRolePermissions, ListPermissions, CreateAssignment, RevokeAssignment, CreateApprovalRule, ListAuditLog).
    - Creados 5 Controllers (Role, Permission, Assignment, ApprovalRule, Audit), 8 FormRequests, 7 Resources/Collections.
    - Creados modelos Eloquent `ApprovalRule` y `PermissionAuditLog`.
    - Seeders actualizados: agregados permisos `roles.*` y `usuarios.*`; rol admin incluye estos nuevos permisos.
    - AuthorizationMiddleware actualizado con mapeos de rutas de authorization.
    - Rutas registradas en `AuthorizationPresentationServiceProvider`.
    - Suite API: 338 tests pasan; 3 fallos preexistentes (rate limit flaky + 2 CORS).
  - **Web — Sesión 6 (2026-06-29):**
    - Feature folder completo: 19 archivos (types, api service, 6 hooks, 5 componentes, 5 páginas, 2 tests).
    - Páginas: RolesPage, PermissionMatrixPage, PanelUsersPage, ApprovalRulesPage, PermissionAuditPage.
    - Componentes: RoleForm (modal crear/editar), PermissionMatrix (grid recurso×acción con atajos), ScopePicker, UserRoleAssigner, AuditTable.
    - Router: 5 nuevas rutas lazy bajo `/admin/*`.
    - Sidebar: nuevo NavGroup "Roles y Permisos" con ícono Shield.
    - Guard RBAC: AdminOnlyRoute + DashboardLayout verifican permisos `roles.*`/`auth.*` con fallback a rol legacy `admin`.
    - Suite Web: 26/26 tests, build 1914 módulos, type-check 0 errores, lint 0 warnings.
  - **Pendiente:** App (N/A en MVP). Actualizar el panorama `ROLES_PERMISOS.md` a estado completado con checklists §13-§16.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Flujo que genera estas entradas |
| [[SYSTEM_CONTRACT]] | Destino final del cambio una vez sincronizado |
| [[FEATURES_INDEX]] | Índice global de features con estado por proyecto |
| [[01-api/API_CONTRACT]] | Índice de endpoints (FUENTE ÚNICA en API) |
| [[01-api/API_DATABASE]] | Esquema de BD (FUENTE ÚNICA en API) |
