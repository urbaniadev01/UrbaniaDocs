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
- Estado Web: ⏸ Pendiente (specs y UI por diseñar)
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
  - Pendiente: diseño e implementación Web y App.

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

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Flujo que genera estas entradas |
| [[SYSTEM_CONTRACT]] | Destino final del cambio una vez sincronizado |
| [[FEATURES_INDEX]] | Índice global de features con estado por proyecto |
| [[01-api/API_CONTRACT]] | Índice de endpoints (FUENTE ÚNICA en API) |
| [[01-api/API_DATABASE]] | Esquema de BD (FUENTE ÚNICA en API) |
