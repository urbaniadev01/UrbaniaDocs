---
type: meta
status: active
priority: P0
tags: [state, sessions]
updated: 2026-06-17
---

# SESSION_MANIFEST
## Estado Actual del Proyecto Urbania API

> [!info] Proposito
> Documento vivo que registra el estado exacto del proyecto
> entre sesiones de desarrollo. Es el "estado guardado" que se entrega al
> agente al inicio de cada nueva sesion.
> **Audiencia**: Agente de desarrollo que retoma el trabajo.
> **Regla de oro**: Este archivo se actualiza INMEDIATAMENTE al final de cada
> sesion. Nunca debe quedar desactualizado.

> [!todo] Instruccion para el agente
> Lee este documento PRIMERO al retomar trabajo.
> Verifica la existencia de los archivos listados. Ejecuta `composer test` y
> `phpstan analyse` para confirmar el estado reportado. Reporta discrepancias.

---

## Sesion Actual

| Campo            | Valor         |
| ---------------- | ------------- |
| **Numero**       | 0             |
| **Nombre**       | Pre-Setup     |
| **Estado**       | ⬜ No iniciado |
| **Fecha inicio** | —             |
| **Fecha fin**    | —             |
| **Agente**       | —             |

---

## Resumen Ejecutivo

El proyecto Urbania API no ha sido iniciado. Todos los modulos estan en estado
"Pendiente". La documentacion tecnica esta completa y lista para comenzar la
implementacion segun el plan definido en [[IMPLEMENTATION_PLAN]].

---

## Modulo

| Campo | Valor |
|-------|-------|
| **Modulo** | Auth |
| **Prioridad** | P0 |
| **Estado** | ⬜ Pendiente |
| **Sesion de inicio** | Sesion 1 |

> [!info] Nota de alcance
> Este documento y el resto de la documentacion tecnica
> describen unicamente la base del proyecto y el modulo Auth. No se listan
> modulos futuros aqui; cuando se inicie uno nuevo, se agrega como fila a
> esta tabla en ese momento.

---

## Metricas de Calidad (Globales)

| Metrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| Tests totales | 0 | >0 | ⬜ |
| Cobertura Domain | 0% | >=95% | ⬜ |
| Cobertura Application | 0% | >=90% | ⬜ |
| Cobertura Infrastructure | 0% | >=85% | ⬜ |
| Cobertura Presentation | 0% | >=80% | ⬜ |
| Cobertura Security | 0% | 100% | ⬜ |
| Cobertura global | 0% | >=80% | ⬜ |
| PHPStan nivel 10 | N/A | 0 errores | ⬜ |
| Pint | N/A | 0 archivos | ⬜ |
| Pipeline CI/CD | N/A | Verde | ⬜ |

---

## Archivos Creados y Modificados

> [!note] Nota
> Ya no se acumulan en tablas manuales aquí — desde la adopción del vault de Obsidian, cada sesión registra sus propios archivos creados/modificados en su nota individual (`docs/log/sesiones/`, plantilla `_templates/nueva-sesion.md`). Ver la lista de sesiones en [[_Home]].

---

## Deuda Tecnica / Pendiente

> [!note] Nota
> Cada ítem es una nota individual en `docs/log/deuda-tecnica/` (plantilla `_templates/nueva-deuda.md`). La tabla siguiente se genera sola.

```dataview
TABLE session_origin AS "Sesión origen", session_resolved AS "Sesión resolución", status AS "Estado"
FROM "docs/log/deuda-tecnica"
WHERE type = "debt"
```

---

## Bloqueos / Issues Encontrados

> [!note] Nota
> Cada ítem es una nota individual en `docs/log/bloqueos/` (plantilla `_templates/nuevo-bloqueo.md`). La tabla siguiente se genera sola.

```dataview
TABLE severity AS "Severidad", session_origin AS "Sesión origen", status AS "Estado"
FROM "docs/log/bloqueos"
WHERE type = "issue"
SORT severity DESC
```

---

## Proxima Sesion

**Sesion 1**: Setup + Slice Vertical Minimo
**Objetivo**: Infraestructura funcionando, endpoint `/health` operativo.
**Documentos a consultar**: [[AGENTS]], [[ARCHITECTURE]], [[SETUP_GUIDE]], [[DATABASE]], [[API_CONTRACT]], [[TESTING]]
**Riesgos identificados**:
- Compatibilidad de PHP 8.5 con paquetes (fallback a 8.4 si es necesario)
- Disponibilidad de imagen PostgreSQL 18.4 en Docker Hub (verificar tag exacto)
- Compatibilidad de larastan con Laravel 13

---

## Historial de Sesiones

> [!note] Nota
> Cada sesión es una nota individual en `docs/log/sesiones/` (plantilla `_templates/nueva-sesion.md`). La tabla siguiente se genera sola.

```dataview
TABLE session_number AS "Sesión", name AS "Nombre", status AS "Estado", date_end AS "Fecha fin"
FROM "docs/log/sesiones"
WHERE type = "session"
SORT session_number ASC
```

---

## Notas Adicionales

- Documentacion tecnica completa: 8 documentos en raiz del proyecto.
- Plan de implementacion: [[IMPLEMENTATION_PLAN]] define 8 sesiones para el modulo Auth.
- Estructura DDD propuesta en [[ARCHITECTURE]] Sec 2.
- Stack tecnologico definido en [[ARCHITECTURE]] Sec 1.

---

## Instrucciones de Actualizacion

Al finalizar cada sesion, el agente DEBE:

1. **Actualizar la seccion "Sesion Actual"** con los datos reales de la sesion completada
2. **Crear/cerrar la nota de sesión** en `docs/log/sesiones/` con sus archivos creados/modificados (`_templates/nueva-sesion.md`)
3. **Actualizar metricas de calidad** con valores reales (ejecutar `composer test`, `phpstan`, `pint`)
4. **Crear una nota por cada ítem de deuda tecnica** identificado (`_templates/nueva-deuda.md`)
5. **Crear una nota por cada bloqueo/issue** encontrado (`_templates/nuevo-bloqueo.md`)
6. **Actualizar "Proxima Sesion"** con la siguiente del plan
7. **Guardar este archivo** en la ubicacion correcta del proyecto

> [!danger] Regla critica
> Si la sesion se interrumpe sin completar, marcar estado como
> "⏸️ Interrumpido" y documentar exactamente donde quedo el trabajo.
