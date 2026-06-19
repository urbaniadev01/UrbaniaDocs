---
type: meta
status: active
priority: P0
module: shared
tags: [log, cross-project, traceability, shared]
updated: 2026-06-18
---

# 📊 CHANGES_LOG
## Registro de Cambios Cross-Project

> [!info] Consultar
> Para saber el estado de sincronización de cualquier cambio que cruce más de un proyecto. Se actualiza siguiendo el flujo de [[CROSS_PROJECT_CHANGES]].

> [!warning] Disciplina de uso
> Cada entrada nueva incrementa el número (`CAMBIO-001`, `CAMBIO-002`, ...) sin reutilizar números, aunque una entrada se cierre como "no aplicaba". Esto mantiene el historial completo y auditable.

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

### CAMBIO-000 — Ejemplo (eliminar esta entrada al registrar el primer cambio real)
- Fecha de apertura: 2026-06-18
- Afecta a: API, Web, App
- Estado API: Sincronizado
- Estado Web: Pendiente
- Estado App: Pendiente
- Documento de referencia: [[SYSTEM_CONTRACT#1-interfaces-compartidas]]
- Notas: Entrada de ejemplo para mostrar el formato. No representa un cambio real.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Flujo que genera estas entradas |
| [[SYSTEM_CONTRACT]] | Destino final del cambio una vez sincronizado |
