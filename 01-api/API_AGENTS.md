---
type: meta
status: active
priority: P0
tags: [navigation, rules, agent-instructions]
updated: 2026-06-19
---

# 📚 URBANIA API - AGENTS.md
## Documento Principal de Referencia Rapida para el Backend

> [!todo] Instruccion para el agente
> Lee este documento SIEMPRE al inicio de cada tarea. Es tu mapa de navegacion. Extrae las reglas de oro. Luego consulta la fase especifica segun el tipo de tarea.

---

## §0. ¿Tu tarea viene de un cambio cross-project?

Antes de continuar, responde esta pregunta:

```
¿Existe una entrada activa en [[00-shared/CHANGES_LOG]] que afecte a la API?

  → Sí: leer esa entrada antes de continuar.
         Verificar que esté referenciada en [[API_SESSION_MANIFEST]] (sección Notas o Deuda).
         Si no está, agregarla ahora — el cambio no puede cerrarse hasta que
         esté enlazado en el manifest del proyecto.

  → No / no sé: continuar desde el mapa de documentacion.
```

Si llegas aquí en modo cross-project, la entrada ya debería existir en `CHANGES_LOG`. Enlázala en `API_SESSION_MANIFEST` antes de escribir una sola línea de código.

> [!warning]
> Esta documentacion contiene TODAS las especificaciones tecnicas del proyecto Urbania-api. Si encuentras una inconsistencia, error o incoherencia en la documentacion debes informarlo para la correccion inmediata. No consultes documentos externos durante la implementacion.

> [!info] Alcance de esta documentacion
> Describe la base tecnica del proyecto y el modulo Auth, exclusivamente. No contiene ni referencia specs de otros modulos de negocio. Cuando se inicie un modulo nuevo, su documentacion se agrega como nuevas secciones de [[API_CONTRACT]] (endpoints) y [[API_DATABASE]] (esquema), siguiendo el mismo patron usado para Auth.

> [!warning]
> Si necesitas o crees que se debe cambiar algo en la configuracion, deten el proceso y consultalo primero.

---

## Tu Rol

Ingeniero senior especializado en Laravel y PostgreSQL. Construir API RESTful para Urbania (administracion de propiedades horizontales). Escalable, mantenible, modular.

---

## Alcance de Operaciones

| Operación | Rutas permitidas |
|-----------|-----------------|
| **Lectura** | `01-api/`, `API/`, `00-shared/` |
| **Escritura** | `01-api/`, `API/` |
| **Lectura cross-project** | `02-web/WEB_SESSION_MANIFEST.md`, `03-app/APP_SESSION_MANIFEST.md` solo para verificar impacto de un cambio cross-project |
| **Prohibido** | Crear o modificar archivos en `02-web/`, `WEB/`, `03-app/`, `APP/` — derivar cambios cross-project a [[00-shared/CROSS_PROJECT_CHANGES]] |

---

## 🗺️ Mapa de Documentacion

### Estructura de Documentos

> Todo agente de desarrollo DEBE seguir esta estructura estrictamente.

```

├── AGENTS.md <- Mapa de navegacion (SIEMPRE primero)
├── ARCHITECTURE.md <- Stack, estructura DDD, principios, ADRs
├── DATABASE.md <- Esquema completo de BD (FUENTE UNICA)
├── API_CONTRACT.md <- Diccionario de endpoints + convenciones globales (FUENTE UNICA)
├── endpoints/ <- Detalle de endpoints por feature (request/response/errores/diseño/flujo)
│   ├── _TEMPLATE.md <- Plantilla para nuevos documentos de endpoint
│   ├── AUTH.md <- Endpoints de autenticacion
│   └── HEALTH.md <- Endpoint de health check
├── SETUP_GUIDE.md <- Inicializacion paso a paso
├── JWT_IMPLEMENTATION.md <- Seguridad JWT (FUENTE UNICA)
├── TESTING.md <- Especificaciones tecnicas de pruebas
├── IMPLEMENTATION_PLAN.md <- Plan de sesiones (FUENTE UNICA)
├── SESSION_MANIFEST.md <- Estado actual entre sesiones
└── DEVELOPMENT_GUIDE.md <- Troubleshooting, decisiones tecnicas
```

> [!note]
> El agente debe crear/actualizar notas atómicas en `docs/log/` y `docs/adr/` según [[API_SESSION_MANIFEST]] y [[API_ARCHITECTURE]] §14. Plantillas en `_templates/`.
> [[API_CONTRACT]] es el **diccionario** (índice maestro, convenciones globales, códigos de error, rate limiting).
> El **detalle** de cada endpoint (request, response, errores, diseño, flujo) vive en `endpoints/<FEATURE>.md`.
> Al agregar un endpoint: crear/actualizar documento en `endpoints/` + agregar fila en el índice de [[API_CONTRACT]]. Ver [[API_CONTRACT]] §"Cómo Agregar un Endpoint Nuevo".

---

## Inicio de Sesión (siempre, antes de cualquier tarea)

> [!warning] Nunca saltarse este ritual, aunque la sesión parezca una continuación directa.

**Sincronización previa (antes de abrir cualquier archivo):**
```bash
git pull   # en el vault de documentación → memoria del equipo actualizada
git pull   # en API/ → snapshot del grafo actualizado
```

1. Leer [[API_SESSION_MANIFEST]] → estado real del proyecto (**fuente de verdad, no la memoria**)
2. Leer [[API_IMPLEMENTATION_PLAN]] → sesión activa y tarea siguiente
3. Ejecutar `composer test` y `phpstan analyse` para confirmar el estado reportado
4. Reportar cualquier discrepancia antes de continuar
5. Verificar §0 (¿hay cambio cross-project activo que afecte a la API?)

→ Solo después de estos pasos, ir al flujo de tarea correspondiente.

---

## Flujo de Trabajo por Tipo de Tarea

### 1. Implementar modulo nuevo

**Documentos a consultar (en orden):**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion actual
2. [[API_SESSION_MANIFEST]] → Verificar estado del proyecto
3. [[API_AGENTS]] → Navegacion (actual)
4. [[API_ARCHITECTURE]] → Secciones 2, 3, 4, 9
5. [[API_DATABASE]] → Esquema completo
6. [[API_CONTRACT]] → Diccionario de endpoints + convenciones globales
7. `endpoints/<FEATURE>.md` → Documentar detalle del endpoint (usar [[endpoints/_TEMPLATE]])
8. [[API_SETUP_GUIDE]] → Si requiere nuevas dependencias

**Checklist:**
- [ ] Definir prioridad (P0/P1/P2) y dependencias en [[API_IMPLEMENTATION_PLAN]]
- [ ] Definir tablas en [[API_DATABASE]] (si aplica)
- [ ] Crear documento en `endpoints/<FEATURE>.md` con request/response/errores/diseño/flujo
- [ ] Agregar fila en el índice de [[API_CONTRACT]] (estado: "Diseñado")
- [ ] Agregar códigos de error nuevos en [[API_CONTRACT]] §"Códigos de Error Completos"
- [ ] Verificar reglas de dependencia ([[API_ARCHITECTURE]] Seccion 4)
- [ ] Crear estructura DDD en `src/[Feature]/`
- [ ] Implementar Domain Layer (entidades, VO, excepciones)
- [ ] Implementar Application Layer (DTOs, UseCases)
- [ ] Implementar Infrastructure Layer (repositories, mappers, controllers)
- [ ] Implementar Presentation Layer (routes, ServiceProvider)
- [ ] Crear tests (segun [[API_TESTING]])
- [ ] Ejecutar `phpstan analyse` y `pint`
- [ ] Marcar el/los endpoints como "Implementado" en el índice de [[API_CONTRACT]]

---

→ Al terminar: ejecutar **Checklist Final** (al pie de este documento).

---

### 2. Modificar modulo existente

**Documentos a consultar:**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[API_SESSION_MANIFEST]] → Verificar estado
3. [[API_AGENTS]] → Navegacion
4. [[API_ARCHITECTURE]] → Secciones 2, 4, 6
5. [[API_DATABASE]] → Si cambia BD
6. [[API_CONTRACT]] → Si cambia contrato (índice)
7. `endpoints/<FEATURE>.md` → Si cambia detalle del endpoint

**Checklist:**
- [ ] Leer el contrato actual del endpoint en `endpoints/<FEATURE>.md`
- [ ] Identificar impacto en otros modulos
- [ ] Si cambia BD: actualizar [[API_DATABASE]] y crear migracion reversible
- [ ] Si cambia API: actualizar `endpoints/<FEATURE>.md` y el índice en [[API_CONTRACT]]
- [ ] Actualizar tests existentes
- [ ] Ejecutar suite completa (`composer test`)
- [ ] Ejecutar `phpstan analyse` y `pint`

---

→ Al terminar: ejecutar **Checklist Final** (al pie de este documento).

---

### 3. Crear endpoint nuevo

**Documentos a consultar:**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[API_SESSION_MANIFEST]] → Verificar estado
3. [[API_AGENTS]] → Navegacion
4. [[API_ARCHITECTURE]] → Secciones 2, 6, 7
5. [[API_CONTRACT]] → Diccionario (índice + convenciones + códigos de error)
6. `endpoints/<FEATURE>.md` → Documentar detalle del endpoint (usar [[endpoints/_TEMPLATE]])
7. [[API_DATABASE]] → Si requiere nueva tabla/columna
8. [[API_JWT_IMPLEMENTATION]] → Rate limiting, headers

**Checklist:**
- [ ] Crear/actualizar documento en `endpoints/<FEATURE>.md` con request/response/errores
- [ ] Completar sección **Diseño** (precondiciones, reglas, side effects, casos borde)
- [ ] Agregar sección **Flujo** (Mermaid) si el endpoint es complejo
- [ ] Agregar fila en el índice de [[API_CONTRACT]] (estado: "Diseñado")
- [ ] Agregar códigos de error nuevos en [[API_CONTRACT]] §"Códigos de Error Completos"
- [ ] Verificar rate limiting en [[API_JWT_IMPLEMENTATION]] §4.1
- [ ] Crear Request DTO en `Application/DTOs/`
- [ ] Crear Response DTO en `Application/DTOs/`
- [ ] Crear o modificar UseCase
- [ ] Crear Resource en `Infrastructure/Http/Resources/`
- [ ] Actualizar Controller
- [ ] Registrar ruta en `Presentation/routes.php`
- [ ] Crear Feature Test (segun [[API_TESTING]])
- [ ] Documentar en Scribe (`php artisan scribe:generate`)
- [ ] Verificar formato de error unico
- [ ] Marcar el endpoint como "Implementado" en el indice de [[API_CONTRACT]]

---

→ Al terminar: ejecutar **Checklist Final** (al pie de este documento).

---

### 4. Modificar esquema de base de datos

**Documentos a consultar:**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[API_SESSION_MANIFEST]] → Verificar estado
3. [[API_AGENTS]] → Navegacion
4. [[API_ARCHITECTURE]] → Seccion 8 (PostgreSQL)
5. [[API_DATABASE]] → Esquema completo (FUENTE UNICA)
6. [[API_CONTRACT]] → Si el cambio afecta algun endpoint existente

**Checklist:**
- [ ] Verificar convenciones de nomenclatura en [[API_DATABASE]]
- [ ] Definir tipo de dato PostgreSQL apropiado
- [ ] Definir restricciones (NULL/NOT NULL, DEFAULT, CHECK)
- [ ] Definir indices necesarios (UNIQUE, INDEX, GIN)
- [ ] Definir claves foraneas con ON DELETE/UPDATE
- [ ] Crear migracion con `up()` y `down()` reversible
- [ ] Usar UUID v7 para claves primarias
- [ ] Actualizar Eloquent Models
- [ ] Actualizar Domain Entities
- [ ] Actualizar Mappers
- [ ] Ejecutar `migrate` y `migrate:rollback`
- [ ] Actualizar tests de integracion

---

→ Al terminar: ejecutar **Checklist Final** (al pie de este documento).

---

### 5. Implementar o modificar seguridad JWT/Auth

**Documentos a consultar:**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[API_SESSION_MANIFEST]] → Verificar estado
3. [[API_AGENTS]] → Navegacion
4. [[API_JWT_IMPLEMENTATION]] → COMPLETO (FUENTE UNICA)
5. [[API_ARCHITECTURE]] → Secciones 1, 4, 9
6. [[API_CONTRACT]] → Endpoints de auth
7. [[API_DATABASE]] → Tablas users, refresh_tokens, etc.

**Checklist:**
- [ ] Verificar algoritmo RS256
- [ ] Verificar 12 claims del token
- [ ] Implementar doble token con rotacion
- [ ] Configurar Redis para blacklist
- [ ] Implementar rate limiting (ver [[API_JWT_IMPLEMENTATION]] §4.1)
- [ ] Implementar deteccion de reutilizacion de refresh token
- [ ] Implementar device fingerprint
- [ ] Implementar revocacion de tokens por evento
- [ ] Configurar headers de seguridad HTTP
- [ ] Implementar logging de eventos de seguridad
- [ ] Ejecutar tests de seguridad

→ Al terminar: ejecutar **Checklist Final** (al pie de este documento).

---

### 6. Setup/Inicializacion de proyecto

**Documentos a consultar:**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[API_SESSION_MANIFEST]] → Verificar estado
3. [[API_AGENTS]] → Navegacion
4. [[API_SETUP_GUIDE]] → COMPLETO (paso a paso)
5. [[API_ARCHITECTURE]] → Stack, estructura DDD
6. [[API_JWT_IMPLEMENTATION]] → Configuracion seguridad
7. [[API_DATABASE]] → Esquema inicial

---

### 7. Testing/Pruebas

**Documentos a consultar:**
1. [[API_IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[API_SESSION_MANIFEST]] → Verificar estado
3. [[API_AGENTS]] → Navegacion
4. [[API_TESTING]] → COMPLETO (estructura, reglas)
5. [[API_ARCHITECTURE]] → Secciones 10, 4

→ Al terminar: ejecutar **Checklist Final** (al pie de este documento).

---

## En Caso de Fallo

| Situación | Acción |
|-----------|--------|
| `composer test` falla al inicio de sesión | No continuar. Documentar en `API_SESSION_MANIFEST §Bloqueos` con el error exacto. Marcar sesión como "🔴 Bloqueado". |
| `phpstan` falla en medio de una implementación | Resolver antes de continuar. No commitear con errores PHPStan. |
| Migración falla al ejecutar `migrate:rollback` | Revertir manualmente, registrar como deuda técnica en `docs/log/deuda-tecnica/`. |
| Inconsistencia detectada entre `API_CONTRACT` y el código real | Corregir la documentación primero, luego el código. Nunca corregir en silencio. |
| Sesión interrumpida sin completar Checklist Final | Marcar estado como "⏸️ Interrumpido" en `API_SESSION_MANIFEST`. Documentar exactamente dónde quedó el trabajo. |
| Cambio cross-project detectado sin entrada en `CHANGES_LOG` | Crear la entrada antes de continuar. No asumir que el otro proyecto lo sabrá. |

---

## Reglas de Oro (Nunca violar)

| # | Regla | Consecuencia |
|---|-------|-------------|
| 1 | **Domain NO depende de framework ni infraestructura** | Clases en `src/*/Domain/` no importan Laravel, Eloquent, ni paquetes de infraestructura. **Permitido**: librerias de utilidad pura sin acoplamiento a framework (ej: `ramsey/uuid`, `egulias/email-validator`, `DateTimeImmutable`). **Prohibido**: `Illuminate\*`, `Predis\*`, HTTP clients, ORMs |
| 2 | **Un bounded context NO importa de otro** | Comunicacion solo via `Shared/` o eventos de dominio |
| 3 | **NUNCA usar Eloquent relationships entre bounded contexts** | Usar IDs y mappers |
| 4 | **NUNCA acceder a `$request->user()` desde Domain** | Domain es agnostica a HTTP |
| 5 | **Toda migracion DEBE implementar `down()`** | Reversibilidad obligatoria |
| 6 | **NUNCA lanzar excepciones crudas** | Siempre usar excepciones de dominio tipadas |
| 7 | **Formato de error UNICO** | `{ error: { code, message, trace_id } }` para errores de dominio/negocio. **Excepcion**: `GET /health` en estado unhealthy responde `{ data: { status: "unhealthy", ... } }` con HTTP 503 — ver [[endpoints/HEALTH]] §11.1 |
| 8 | **RS256 obligatorio** | Nunca HS256 en produccion |
| 9 | **UUID v7 para PKs** | Nunca auto-increment |
| 10 | **Tests antes de commit** | Unit + Integration + Feature |
| 11 | **Actualizar [[API_SESSION_MANIFEST]] al final de cada sesion** | Estado guardado entre sesiones |
| 12 | **NO duplicar informacion entre documentos** | Cada pieza de informacion en UN SOLO documento. Usar referencias cruzadas |
| 13 | **[[API_SESSION_MANIFEST]] es la única fuente de verdad del estado de sesión** — cualquier otra referencia de estado debe considerarse desactualizada hasta confirmarse contra el manifest. | Decisiones incorrectas basadas en estado obsoleto |

---

## ⚠️ Regla Critica: Verify Before Assume

> [!danger]
> NUNCA confies ciegamente en el estado reportado de tareas anteriores.

Si continuas una sesion anterior:
1. **Verificar existencia de archivos** mencionados en el estado reportado
2. **Ejecutar tests** (`composer test`) para confirmar funcionalidad
3. **Reportar discrepancias** inmediatamente

---

## Checklist Final antes de Entregar

- [ ] Codigo sigue convenciones de nomenclatura ([[API_ARCHITECTURE]] Seccion 3)
- [ ] PHPStan nivel 10 pasa (`composer stan`)
- [ ] Laravel Pint formatea sin cambios (`composer lint`)
- [ ] Tests unitarios pasan (`composer test:unit`)
- [ ] Tests de integracion pasan (`composer test:integration`)
- [ ] Tests de feature pasan (`composer test:feature`)
- [ ] Tests de seguridad pasan (`composer test:security`)
- [ ] Migraciones son reversibles
- [ ] Documentacion Scribe actualizada
- [ ] API Contract actualizado
- [ ] Database Schema actualizado
- [ ] No hay dependencias circulares
- [ ] Domain no importa Infrastructure
- [ ] Todos los DTOs son `final readonly class`
- [ ] Todos los endpoints de dominio/negocio retornan formato de error unico (`{ error: { code, message, trace_id } }`). Excepcion: `GET /health` unhealthy usa `{ data: { status: "unhealthy", ... } }` (ver [[endpoints/HEALTH]] §11.1)
- [ ] Rate limiting configurado
- [ ] Eventos de seguridad loggeados
- [ ] [[API_SESSION_MANIFEST]] actualizado
- [ ] Si el grafo cambió: `git add .codebase-memory/ && git commit -m "chore: update graph snapshot"` (desde `API/`)

---

## Documentacion de Librerias

Cuando necesites documentacion actualizada de Laravel, PHP, PHPStan, Pint u otro paquete, usa las herramientas de **context7**.

---

## Referencias Rapidas por Documento

| Documento | Proposito | Cuando consultar |
|-----------|-----------|------------------|
| [[API_AGENTS]] | Mapa de navegacion | Siempre primero |
| [[API_IMPLEMENTATION_PLAN]] | Plan de sesiones | Antes de cualquier tarea |
| [[API_SESSION_MANIFEST]] | Estado actual | Al retomar trabajo |
| [[API_ARCHITECTURE]] | Stack, DDD, reglas | Antes de implementar modulo |
| [[API_DATABASE]] | Esquema PostgreSQL | Tareas de BD |
| [[API_CONTRACT]] | Endpoints | Tareas de API |
| [[API_JWT_IMPLEMENTATION]] | Seguridad JWT | Tareas de auth |
| [[API_SETUP_GUIDE]] | Inicializacion | Al iniciar proyecto |
| [[API_TESTING]] | Pruebas | Al crear/modificar tests |
| [[API_DEVELOPMENT_GUIDE]] | Troubleshooting | Al encontrar problemas |