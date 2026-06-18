---
title: WEB_SESSION_MANIFEST
type: estado
tags: [urbania-web, manifest, estado-proyecto]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-17
---

# 📊 WEB_SESSION_MANIFEST
## Estado Actual del Cliente Web Urbania

> [!important] Propósito
> Documento vivo que registra el estado exacto del proyecto entre sesiones. Es el "estado
> guardado" que se entrega al agente al inicio de cada nueva sesión.

> [!warning] Regla de oro
> Se actualiza INMEDIATAMENTE al final de cada sesión.

> [!note] Verificación
> El agente que retoma debe corroborar este estado ejecutando `pnpm type-check` y `pnpm test`.
> Si hay discrepancias, reportar en "Bloqueos" antes de continuar. Ver la regla "Verify Before
> Assume" en [[WEB_AGENTS_GUIDE]].

---

## Sesión Actual

| Campo | Valor |
|-------|-------|
| **Número** | 0 |
| **Nombre** | Pre-Setup |
| **Estado** | ⬜ No iniciado |
| **Fecha inicio** | — |
| **Fecha fin** | — |
| **Agente** | — |

---

## Resumen Ejecutivo

El cliente web Urbania no ha sido iniciado. Toda la documentación técnica está completa y
revisada. Comenzar por [[WEB_SETUP_GUIDE]] para inicializar el proyecto, luego seguir
[[WEB_IMPLEMENTATION_PLAN]] Sesión 1.

**Prerequisito**: La Urbania API REST debe estar corriendo en `http://localhost:8080`.

---

## Módulos y Estado

| # | Módulo | Prioridad | Estado | Sesión |
|---|--------|-----------|--------|--------|
| 1 | Auth (Login, MFA) | P0 | ⬜ Pendiente | Sesión 1 |
| 2 | Layout + Configuración | P0 | ⬜ Pendiente | Sesión 2 |
| 3 | Dashboard | P0 | ⬜ Pendiente | Sesión 3 |
| 4 | Propiedades + Residentes | P1 | ⬜ Pendiente | Sesión 4 |
| 5 | Zonas Comunes + Reservas | P1 | ⬜ Pendiente | Sesión 5 |
| 6 | Pagos | P1 | ⬜ Pendiente | Sesión 6 |
| 7 | PQR | P1 | ⬜ Pendiente | Sesión 7 |
| 8 | Ingresos + Chat + CI/CD | P2 | ⬜ Pendiente | Sesión 8 |

### Estados válidos
| Estado | Significado |
|--------|-------------|
| ⬜ Pendiente | No iniciado |
| 🔵 En progreso | Sesión actual en curso |
| 🔴 Bloqueado | `pnpm ci` falla o hay dependencia sin resolver |
| ✅ Completado | `pnpm ci` pasa, tests cubren el módulo |

> [!warning] Regla
> Solo marcar ✅ si `pnpm ci` pasó al cerrar la sesión. Si falló, marcar 🔴 y documentar el
> error específico en la sección "Bloqueos".

---

## Métricas de Calidad

| Métrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| TypeScript sin errores | N/A | 0 errores | ⬜ |
| ESLint sin warnings | N/A | 0 warnings | ⬜ |
| Tests unitarios | 0 | > 0 | ⬜ |
| Cobertura unitaria | 0% | ≥ 90% | ⬜ |
| Cobertura componentes | 0% | ≥ 80% | ⬜ |
| Flujos e2e críticos | 0/11 | 11/11 | ⬜ |
| Build exitoso | N/A | Sin errores | ⬜ |
| Pipeline CI | N/A | Verde | ⬜ |

> [!note]
> Umbrales definidos en [[WEB_TESTING]] §4.

---

## Archivos Creados (Acumulado)

> Lista vacía al inicio. Se actualiza sesión por sesión con rutas exactas.

| Ruta | Descripción | Sesión |
|------|-------------|--------|
| — | — | — |

---

## Archivos Modificados (Acumulado)

| Ruta | Cambio | Sesión |
|------|--------|--------|
| — | — | — |

---

## Deuda Técnica / Pendiente

| # | Descripción | Sesión origen | Sesión resolución | Estado |
|---|-------------|---------------|-------------------|--------|
| — | — | — | — | — |

---

## Bloqueos / Issues

| # | Descripción | Severidad | Acción propuesta | Estado |
|---|-------------|-----------|------------------|--------|
| — | — | — | — | — |

---

## Próxima Sesión

**Sesión 1**: Setup + Autenticación
**Objetivo**: El admin puede iniciar sesión (con y sin MFA) y ver el dashboard placeholder.
**Documentos**: [[WEB_SETUP_GUIDE]], [[WEB_ARCHITECTURE]], [[WEB_AUTH_IMPLEMENTATION]],
  [[WEB_VISUAL_STANDARDS]], [[WEB_TESTING]]
**Prerequisito**: Urbania API corriendo en `http://localhost:8080`

---

## Instrucciones de Actualización

Al finalizar cada sesión, el agente DEBE:

1. Actualizar "Sesión Actual" con número, nombre, estado y fechas reales
2. Actualizar estado de módulos en la tabla (⬜/🔵/🔴/✅ según resultado de `pnpm ci`)
3. Agregar archivos creados y modificados con rutas exactas
4. Actualizar métricas con valores reales (ejecutar `pnpm test:coverage`)
5. Documentar deuda técnica identificada
6. Documentar bloqueos encontrados con el error exacto de `pnpm ci`
7. Actualizar "Próxima Sesión" con la siguiente del plan ([[WEB_IMPLEMENTATION_PLAN]])
8. Hacer commit del manifest: `[Sesión N] docs: actualizar WEB_SESSION_MANIFEST.md`

> [!warning]
> **NO** marcar un módulo como ✅ si `pnpm ci` no pasó al cierre de la sesión.
