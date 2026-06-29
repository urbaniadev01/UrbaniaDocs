---
type: reference
status: active
priority: P0
module: shared
tags: [contract, cross-project, shared]
updated: 2026-06-28
---

# 📜 SYSTEM_CONTRACT
## El Contrato entre API, Web y App

> [!warning] Regla central
> Este documento es un índice, no una fuente de verdad. Si hay discrepancia con el documento del proyecto, gana el documento del proyecto y este índice se corrige.

---

## 1. Interfaces Compartidas

| Interfaz | Fuente de verdad real | Quién la define | Quién la consume |
|---|---|---|---|
| Contrato REST (endpoints, formatos de error, paginación, versionado `/api/v1`) | `01-api/API_CONTRACT.md` (diccionario) + `01-api/endpoints/<FEATURE>.md` (detalle) | Equipo backend | Web, App |
| Contrato de tiempo real (canales/eventos de Laravel Reverb — chat) | **Propuesto, aún no implementado** — hoy descrito como diseño anticipado en `03-app/APP_DATA_STRATEGY.md` §6 | Equipo backend (pendiente de formalizar) | Web, App |
| Códigos de error y su significado de negocio | `01-api/API_CONTRACT.md` §"Códigos de Error Completos" (tabla maestra) | Equipo backend | Web, App — **nunca** redefinen un código con otro significado |
| Requisitos de seguridad del lado cliente (storage de tokens, biometría, rotación) | `01-api/API_JWT_IMPLEMENTATION.md` §6 (definición del backend) implementado en `03-app/APP_SECURITY.md` (App) y pendiente en Web | Equipo backend define el requisito, cada cliente lo implementa a su manera | Web, App |
| Vocabulario de dominio (residente, zona común, PQRS, unidad, etc.) | [[GLOSSARY]] | Compartido — cualquier proyecto puede proponer un término nuevo, se valida antes de adoptarlo | API, Web, App |
| Identidad visual / design tokens | **Pendiente de decisión** — hoy cada proyecto define la suya (`03-app/APP_DESIGN_SYSTEM.md` para App); no hay tokens compartidos todavía | A decidir | Web, App (si se decide compartir marca) |

---

## 2. Política de Cambios sobre este Contrato

- Ningún proyecto modifica unilateralmente una fila de la tabla de §1 sin pasar por el flujo de [[CROSS_PROJECT_CHANGES]].
- Una fila marcada como "Propuesto, aún no implementado" no es un compromiso de API hacia Web/App — es un diseño anticipado documentado para que la arquitectura de los clientes no quede a ciegas, pero el contrato real solo existe cuando el backend lo publica en `API_CONTRACT.md`.

---

## 3. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Cómo se propone y sincroniza un cambio a este contrato |
| [[CHANGES_LOG]] | Registro de cambios cross-project en curso |
| [[GLOSSARY]] | Vocabulario referenciado en §1 |

---

## 2. Decisiones de Arquitectura Cross-Project

| ADR | Título | Estado |
|-----|--------|--------|
| [[00-shared/docs/adr/ADR-001\|ADR-001]] | Fundación multi-tenant + RBAC + actor canónico para Urbania SaaS | ✅ Accepted |

## 3. Regla de actor y party (actor canónico)

> [!info] Aprobada en ADR-001 / implementada en CAMBIO-006 Sesión 3
> Separar estrictamente la **identidad de cuenta** del **rol de pertenencia a unidad**.

| Concepto | Representación técnica | Cuándo se usa |
|----------|------------------------|---------------|
| **Actor** | `user_id` (tabla `users`) | Autoría y autorización: quién ejecutó una acción (created_by, aprobó un pago, registró un cambio de estado). |
| **Party** | `contact_id` (tabla `contacts`) + `property_id` vía `property_occupants` | Pertenencia a un conjunto/unidad: dueño de cuenta, residente de una reserva, radicante de una PQRS, copropietario en libro de propietarios. |

### Invariantes

1. Todo `user` activo tiene **al menos un** `contact` asociado (`contacts.user_id` es UNIQUE y NOT NULL para usuarios autenticados). El backfill de Sesión 3 crea contacts faltantes copiando nombre/email/teléfono del usuario.
2. La asociación de una persona a una unidad pasa obligatoriamente por `property_occupants` (contact + property + occupant_type). La columna `users.unit` fue eliminada.
3. Un `contact` puede existir sin `user` (persona en directorio sin cuenta de sistema); un `user` no puede existir sin `contact`.

### Implicaciones para nuevos features

- Los endpoints de **autenticación/perfil** usan `user_id`.
- Los endpoints de **residentes, propietarios, PQRS, reservas, visitas, cobranza** usan `contact_id`/`property_id` para identificar al party afectado.
- El `created_by` de cualquier registro de negocio usa `user_id` (actor), no `contact_id`.

## 4. Documentos Relacionados

> Los ADRs cross-project documentan decisiones que afectan el contrato entre dos o más proyectos y deben ser consultados antes de implementar cambios en las interfaces compartidas.
