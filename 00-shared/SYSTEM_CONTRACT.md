---
type: reference
status: active
priority: P0
module: shared
tags: [contract, cross-project, shared]
updated: 2026-06-18
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
