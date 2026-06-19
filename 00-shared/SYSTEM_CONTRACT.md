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

> [!info] Consultar
> Cada vez que una tarea toca algo que más de un proyecto necesita entender igual: forma de los datos, códigos de error, nombres de dominio, identidad visual compartida.

> [!warning] Regla central
> Este documento **nunca** es la fuente de verdad de un dato — es un índice que apunta a la fuente real. Si algo aquí no coincide con el documento del proyecto correspondiente, gana el documento del proyecto y este índice se corrige.

---

## 1. Interfaces Compartidas

| Interfaz | Fuente de verdad real | Quién la define | Quién la consume |
|---|---|---|---|
| Contrato REST (endpoints, formatos de error, paginación, versionado `/api/v1`) | `01-api/API_CONTRACT.md` | Equipo backend | Web, App |
| Contrato de tiempo real (canales/eventos de Laravel Reverb — chat) | **Propuesto, aún no implementado** — hoy descrito como diseño anticipado en `03-app/APP_DATA_STRATEGY.md` §6 | Equipo backend (pendiente de formalizar) | Web, App |
| Códigos de error y su significado de negocio | `01-api/API_CONTRACT.md` (tabla de errores) | Equipo backend | Web, App — **nunca** redefinen un código con otro significado |
| Requisitos de seguridad del lado cliente (storage de tokens, biometría, rotación) | `01-api/API_JWT_IMPLEMENTATION.md` §6 (definición del backend) implementado en `03-app/APP_SECURITY.md` (App) y pendiente en Web | Equipo backend define el requisito, cada cliente lo implementa a su manera | Web, App |
| Vocabulario de dominio (residente, zona común, PQRS, unidad, etc.) | [[GLOSSARY]] | Compartido — cualquier proyecto puede proponer un término nuevo, se valida antes de adoptarlo | API, Web, App |
| Identidad visual / design tokens | **Pendiente de decisión** — hoy cada proyecto define la suya (`03-app/APP_DESIGN_SYSTEM.md` para App); no hay tokens compartidos todavía | A decidir | Web, App (si se decide compartir marca) |

---

## 2. Política de Cambios sobre este Contrato

- Ningún proyecto modifica unilateralmente una fila de la tabla de §1 sin pasar por el flujo de [[CROSS_PROJECT_CHANGES]].
- Una fila marcada como "Propuesto, aún no implementado" no es un compromiso de API hacia Web/App — es un diseño anticipado documentado para que la arquitectura de los clientes no quede a ciegas, pero el contrato real solo existe cuando el backend lo publica en `API_CONTRACT.md`.

---

## 3. Historial de Versiones de este Contrato

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-06-18 | Versión inicial — captura el estado conocido al momento de unificar el vault. Web aún no incorporada en detalle (pendiente de recibir su documentación). |

---

## 4. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Cómo se propone y sincroniza un cambio a este contrato |
| [[CHANGES_LOG]] | Registro de cambios cross-project en curso |
| [[GLOSSARY]] | Vocabulario referenciado en §1 |
