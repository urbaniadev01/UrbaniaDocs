---
type: meta
status: active
priority: P0
tags: [navigation, rules, agent-instructions]
updated: 2026-06-17
---

# 📚 URBANIA API - AGENTS.md
## Documento Principal de Referencia Rapida para el Backend

> [!todo] Instruccion para el agente
> Lee este documento SIEMPRE al inicio de cada tarea. Es tu mapa de navegacion. Extrae las reglas de oro. Luego consulta la fase especifica segun el tipo de tarea.

> [!warning]
> Esta documentacion contiene TODAS las especificaciones tecnicas del proyecto Urbania-api. Si encuentras una inconsistencia, error o incoherencia en la documentacion debes informarlo para la correccion inmediata. No consultes documentos externos durante la implementacion.

> [!info] Alcance de esta documentacion
> Describe la base tecnica del proyecto y el modulo Auth, exclusivamente. No contiene ni referencia specs de otros modulos de negocio. Cuando se inicie un modulo nuevo, su documentacion se agrega como nuevas secciones de [[API_CONTRACT]] (endpoints) y [[DATABASE]] (esquema), siguiendo el mismo patron usado para Auth.

> [!warning]
> Si necesitas o crees que se debe cambiar algo en la configuracion, deten el proceso y consultalo primero.

---

## Tu Rol

Ingeniero senior especializado en Laravel y PostgreSQL. Construir API RESTful para Urbania (administracion de propiedades horizontales). Escalable, mantenible, modular.

---

## 🗺️ Mapa de Documentacion

### Estructura de Documentos

> Todo agente de desarrollo DEBE seguir esta estructura estrictamente.

```

├── AGENTS.md <- Mapa de navegacion (SIEMPRE primero)
├── ARCHITECTURE.md <- Stack, estructura DDD, principios, ADRs
├── DATABASE.md <- Esquema completo de BD (FUENTE UNICA)
├── API_CONTRACT.md <- Endpoints, request/response, errores (FUENTE UNICA de endpoints)
├── SETUP_GUIDE.md <- Inicializacion paso a paso
├── JWT_IMPLEMENTATION.md <- Seguridad JWT (FUENTE UNICA)
├── TESTING.md <- Especificaciones tecnicas de pruebas
├── IMPLEMENTATION_PLAN.md <- Plan de sesiones (FUENTE UNICA)
├── SESSION_MANIFEST.md <- Estado actual entre sesiones
└── DEVELOPMENT_GUIDE.md <- Troubleshooting, decisiones tecnicas
```

> [!info] Nota sobre el vault de Obsidian
> Ademas de estos 10 documentos, el vault incluye `OBSIDIAN_VAULT.md`, `_Home.md`, `_templates/` y `docs/` (sesiones, decisiones, bloqueos, deuda tecnica, ADRs). Son infraestructura del vault para el uso humano y no forman parte de la lectura obligatoria del agente — la unica excepcion es que el agente SI debe crear/actualizar las notas atomicas de `docs/log/` y `docs/adr/` segun [[SESSION_MANIFEST]] y [[ARCHITECTURE]] §14.

> [!note] Nota
> No existen archivos de "spec" por modulo. Toda la informacion de un
> endpoint (request/response, errores, reglas) vive directamente en [[API_CONTRACT]].
> Esto evita duplicar informacion entre un spec de modulo y el contrato de API.

---

## Flujo de Trabajo por Tipo de Tarea

### 1. Implementar modulo nuevo

**Documentos a consultar (en orden):**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion actual
2. [[SESSION_MANIFEST]] → Verificar estado del proyecto
3. [[AGENTS]] → Navegacion (actual)
4. [[ARCHITECTURE]] → Secciones 2, 3, 4, 9
5. [[DATABASE]] → Esquema completo
6. [[API_CONTRACT]] → Definir endpoints del nuevo modulo
7. [[SETUP_GUIDE]] → Si requiere nuevas dependencias

**Checklist:**
- [ ] Definir prioridad (P0/P1/P2) y dependencias en [[IMPLEMENTATION_PLAN]]
- [ ] Definir tablas en [[DATABASE]] (si aplica)
- [ ] Definir endpoints en [[API_CONTRACT]] (request/response/errores)
- [ ] Verificar reglas de dependencia ([[ARCHITECTURE]] Seccion 4)
- [ ] Crear estructura DDD en `src/[Feature]/`
- [ ] Implementar Domain Layer (entidades, VO, excepciones)
- [ ] Implementar Application Layer (DTOs, UseCases)
- [ ] Implementar Infrastructure Layer (repositories, mappers, controllers)
- [ ] Implementar Presentation Layer (routes, ServiceProvider)
- [ ] Crear tests (segun [[TESTING]])
- [ ] Ejecutar `phpstan analyse` y `pint`
- [ ] Marcar el/los endpoints como "Implementado" en [[API_CONTRACT]]

---

### 2. Modificar modulo existente

**Documentos a consultar:**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[SESSION_MANIFEST]] → Verificar estado
3. [[AGENTS]] → Navegacion
4. [[ARCHITECTURE]] → Secciones 2, 4, 6
5. [[DATABASE]] → Si cambia BD
6. [[API_CONTRACT]] → Si cambia contrato

**Checklist:**
- [ ] Leer el contrato actual del endpoint en [[API_CONTRACT]]
- [ ] Identificar impacto en otros modulos
- [ ] Si cambia BD: actualizar [[DATABASE]] y crear migracion reversible
- [ ] Si cambia API: actualizar [[API_CONTRACT]]
- [ ] Actualizar tests existentes
- [ ] Ejecutar suite completa (`composer test`)
- [ ] Ejecutar `phpstan analyse` y `pint`

---

### 3. Crear endpoint nuevo

**Documentos a consultar:**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[SESSION_MANIFEST]] → Verificar estado
3. [[AGENTS]] → Navegacion
4. [[ARCHITECTURE]] → Secciones 2, 6, 7
5. [[API_CONTRACT]] → Definir request/response
6. [[DATABASE]] → Si requiere nueva tabla/columna
7. [[JWT_IMPLEMENTATION]] → Rate limiting, headers

**Checklist:**
- [ ] Definir metodo HTTP, URL en [[API_CONTRACT]]
- [ ] Definir request body, headers, parametros de ruta
- [ ] Definir response exitoso (200/201/204)
- [ ] Definir responses de error posibles
- [ ] Verificar rate limiting en [[JWT_IMPLEMENTATION]] §4.1
- [ ] Crear Request DTO en `Application/DTOs/`
- [ ] Crear Response DTO en `Application/DTOs/`
- [ ] Crear o modificar UseCase
- [ ] Crear Resource en `Infrastructure/Http/Resources/`
- [ ] Actualizar Controller
- [ ] Registrar ruta en `Presentation/routes.php`
- [ ] Crear Feature Test (segun [[TESTING]])
- [ ] Documentar en Scribe (`php artisan scribe:generate`)
- [ ] Verificar formato de error unico
- [ ] Marcar el endpoint como "Implementado" en el indice de [[API_CONTRACT]]

---

### 4. Modificar esquema de base de datos

**Documentos a consultar:**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[SESSION_MANIFEST]] → Verificar estado
3. [[AGENTS]] → Navegacion
4. [[ARCHITECTURE]] → Seccion 8 (PostgreSQL)
5. [[DATABASE]] → Esquema completo (FUENTE UNICA)
6. [[API_CONTRACT]] → Si el cambio afecta algun endpoint existente

**Checklist:**
- [ ] Verificar convenciones de nomenclatura en [[DATABASE]]
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

### 5. Implementar o modificar seguridad JWT/Auth

**Documentos a consultar:**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[SESSION_MANIFEST]] → Verificar estado
3. [[AGENTS]] → Navegacion
4. [[JWT_IMPLEMENTATION]] → COMPLETO (FUENTE UNICA)
5. [[ARCHITECTURE]] → Secciones 1, 4, 9
6. [[API_CONTRACT]] → Endpoints de auth
7. [[DATABASE]] → Tablas users, refresh_tokens, etc.

**Checklist:**
- [ ] Verificar algoritmo RS256
- [ ] Verificar 12 claims del token
- [ ] Implementar doble token con rotacion
- [ ] Configurar Redis para blacklist
- [ ] Implementar rate limiting (ver [[JWT_IMPLEMENTATION]] §4.1)
- [ ] Implementar deteccion de reutilizacion de refresh token
- [ ] Implementar device fingerprint
- [ ] Implementar revocacion de tokens por evento
- [ ] Configurar headers de seguridad HTTP
- [ ] Implementar logging de eventos de seguridad
- [ ] Ejecutar tests de seguridad

---

### 6. Setup/Inicializacion de proyecto

**Documentos a consultar:**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[SESSION_MANIFEST]] → Verificar estado
3. [[AGENTS]] → Navegacion
4. [[SETUP_GUIDE]] → COMPLETO (paso a paso)
5. [[ARCHITECTURE]] → Stack, estructura DDD
6. [[JWT_IMPLEMENTATION]] → Configuracion seguridad
7. [[DATABASE]] → Esquema inicial

---

### 7. Testing/Pruebas

**Documentos a consultar:**
1. [[IMPLEMENTATION_PLAN]] → Identificar sesion
2. [[SESSION_MANIFEST]] → Verificar estado
3. [[AGENTS]] → Navegacion
4. [[TESTING]] → COMPLETO (estructura, reglas)
5. [[ARCHITECTURE]] → Secciones 10, 4

---

## Reglas de Oro (Nunca violar)

| # | Regla | Consecuencia |
|---|-------|-------------|
| 1 | **Domain NO depende de nada externo** | Clases en `src/*/Domain/` no importan Laravel, Eloquent, ni paquetes externos |
| 2 | **Un bounded context NO importa de otro** | Comunicacion solo via `Shared/` o eventos de dominio |
| 3 | **NUNCA usar Eloquent relationships entre bounded contexts** | Usar IDs y mappers |
| 4 | **NUNCA acceder a `$request->user()` desde Domain** | Domain es agnostica a HTTP |
| 5 | **Toda migracion DEBE implementar `down()`** | Reversibilidad obligatoria |
| 6 | **NUNCA lanzar excepciones crudas** | Siempre usar excepciones de dominio tipadas |
| 7 | **Formato de error UNICO** | `{ error: { code, message, trace_id } }` |
| 8 | **RS256 obligatorio** | Nunca HS256 en produccion |
| 9 | **UUID v7 para PKs** | Nunca auto-increment |
| 10 | **Tests antes de commit** | Unit + Integration + Feature |
| 11 | **Actualizar [[SESSION_MANIFEST]] al final de cada sesion** | Estado guardado entre sesiones |
| 12 | **NO duplicar informacion entre documentos** | Cada pieza de informacion en UN SOLO documento. Usar referencias cruzadas |

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

- [ ] Codigo sigue convenciones de nomenclatura ([[ARCHITECTURE]] Seccion 3)
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
- [ ] Todos los endpoints retornan formato de error unico
- [ ] Rate limiting configurado
- [ ] Eventos de seguridad loggeados
- [ ] [[SESSION_MANIFEST]] actualizado

---

## Referencias Rapidas por Documento

| Documento | Proposito | Cuando consultar |
|-----------|-----------|------------------|
| [[AGENTS]] | Mapa de navegacion | Siempre primero |
| [[IMPLEMENTATION_PLAN]] | Plan de sesiones | Antes de cualquier tarea |
| [[SESSION_MANIFEST]] | Estado actual | Al retomar trabajo |
| [[ARCHITECTURE]] | Stack, DDD, reglas | Antes de implementar modulo |
| [[DATABASE]] | Esquema PostgreSQL | Tareas de BD |
| [[API_CONTRACT]] | Endpoints | Tareas de API |
| [[JWT_IMPLEMENTATION]] | Seguridad JWT | Tareas de auth |
| [[SETUP_GUIDE]] | Inicializacion | Al iniciar proyecto |
| [[TESTING]] | Pruebas | Al crear/modificar tests |
| [[DEVELOPMENT_GUIDE]] | Troubleshooting | Al encontrar problemas |