---
type: audit
status: active
priority: P0
tags: [audit, quality, testing, features-1-6]
updated: 2026-06-30
---

# AUDITORÍA DE DESARROLLO — Features 1 al 6
## Urbania API · 2026-06-30

> **Alcance**: Código implementado en `API/src/`, tests en `API/tests/`, y documentación en `01-api/` correspondientes a los features 1 (Auth), 2 (Propiedades), 3 (Configuración), 4 (Directorio), 5 (Roles y Permisos) y 6 (Comunicaciones).

---

## Resumen Ejecutivo

| Área | Estado | Riesgo |
|------|--------|--------|
| Feature 1 — Auth | ✅ Completo y bien cubierto | Bajo |
| Feature 2 — Propiedades | ⚠️ API implementada, sin tests Unit/Integration | Alto |
| Feature 3 — Configuración | ✅ Implementado vía Auth | Bajo |
| Feature 4 — Directorio | 🔴 API implementada, tests casi nulos | Crítico |
| Feature 5 — Roles y Permisos | ⚠️ Implementado, middleware no conectado | Alto |
| Feature 6 — Comunicaciones | ⚠️ API implementada, sin tests Unit/Integration | Alto |
| Tests Architecture | 🔴 Solo cubren Auth/Shared; 5 módulos sin cobertura | Crítico |
| Deuda técnica abierta | ⚠️ 5 ítems documentados pendientes | Medio |
| PHPStan (global) | ⚠️ 6 errores preexistentes en AppServiceProvider | Medio |
| Tests flacos conocidos | ⚠️ 3 fallos preexistentes (rate limiting + CORS) | Medio |

---

## 1. Feature 1 — Auth ✅ BIEN CUBIERTO

### Implementado
Módulo más maduro del sistema. Capas Domain, Application, Infrastructure y Presentation completas con 8 sesiones de desarrollo dedicadas.

### Cobertura de tests
| Tipo | Archivos | Estado |
|------|----------|--------|
| Unit — Domain (Entities, VOs, Exceptions, Events) | 8 archivos | ✅ |
| Unit — Application (UseCases × 18) | 18 archivos | ✅ |
| Unit — Infrastructure (Requests, Resources) | 3 archivos | ✅ |
| Integration — Mappers (User, RefreshToken) | 2 archivos | ✅ |
| Integration — Persistence (EloquentUser, EloquentRefreshToken) | 2 archivos | ✅ |
| Integration — JWT Service | 2 archivos | ✅ |
| Feature — AuthController, MfaController, PasswordManagement, Sessions | 4 archivos | ✅ |
| Security — PasswordSecurity, RotationReplayDetection | 2 archivos | ✅ |
| Architecture — Domain independence, framework isolation | 1 archivo | ✅ |

### Issues conocidos (no bloqueantes)
- **Test flacho**: `it returns 429 after exceeding login rate limit` — falla ocasionalmente por timing.
- **PHPStan**: 6 errores en `app/Providers/AppServiceProvider.php` por llamadas a `env()` fuera de config. No es código del dominio pero sí bloquea CI verde.

### Gaps
- Ningún gap crítico. El único pendiente menor es `ErrorResource` (diferido a Sesión 8, cubierto por el handler global).

---

## 2. Feature 2 — Propiedades y Unidades ⚠️ SIN TESTS UNIT/INTEGRATION

### Implementado
7 sesiones (12-14) produjeron 8 migraciones, Domain con 39 archivos PHP, Application con UseCases para 7 subrecursos, Infrastructure completa con Mappers/Repositories/Controllers, y Presentation con rutas.

### Cobertura de tests
| Tipo | Archivos | Estado |
|------|----------|--------|
| Feature — CondominiumController | 4 tests | ✅ |
| Feature — TowerController | 7 tests | ✅ |
| Feature — PropertyTypeController | 12 tests | ✅ |
| Feature — PropertyStatusController | 10 tests | ✅ |
| Feature — PropertyController | 9 tests | ✅ |
| Feature — PropertyDocumentController | 3 tests | ✅ |
| Feature — PropertyDocumentTypeController | 5 tests | ✅ |
| **Unit — Domain (Entities, VOs, Exceptions)** | **0 archivos** | **❌ FALTA** |
| **Unit — Application (UseCases × 7 grupos)** | **0 archivos** | **❌ FALTA** |
| **Integration — Mappers** | **0 archivos** | **❌ FALTA** |
| **Integration — Persistence (Repositories)** | **0 archivos** | **❌ FALTA** |
| **Architecture — Domain independence** | **0 archivos** | **❌ FALTA** |

### Gaps críticos
1. **Sin tests unitarios de Domain**: Las entidades `Condominium`, `Tower`, `Property`, `PropertyDocument`, `PropertyStatusLog`, `PropertyDocumentType`, `PropertyType`, `PropertyStatus` no tienen pruebas de sus invariantes de negocio.
2. **Sin tests de UseCases**: Los 7 grupos de casos de uso (Condominiums, Towers, Properties, PropertyTypes, PropertyStatuses, PropertyDocuments, PropertyDocumentTypes) no tienen tests con mocks — cualquier regresión en lógica de negocio solo se detecta si hay un test feature que pasa por ese camino.
3. **Sin tests de Mappers**: La conversión bidireccional Eloquent ↔ Domain para cada uno de los 8 recursos no está probada aisladamente.
4. **Sin Architecture tests**: No se verifica que el Domain de Propiedades sea puro (sin imports de Illuminate) ni que no cruce bounded contexts.
5. **Tests feature incompletos**: `PropertyDocumentControllerTest` solo tiene 3 tests — faltan casos de validación, 404 y error de permisos.

---

## 3. Feature 3 — Configuración ✅ CUBIERTO VÍA AUTH

### Estado
Implementado completamente vía los endpoints de Auth (perfil, cambio de contraseña, MFA, sesiones activas). Los tests de Auth cubren estos flujos.

### Gaps
- Ningún gap técnico. La documentación en `00-shared/features/CONFIGURACION.md` refleja el estado correctamente.

---

## 4. Feature 4 — Directorio 🔴 TESTS CASI NULOS

### Implementado
Sesiones 10-11 produjeron Domain (Contact, OccupantType, PropertyOccupant), Application (11 UseCases), Infrastructure (3 Controllers, 3 Repositories, 3 Mappers) y Presentation.

### Cobertura de tests
| Tipo | Archivos | Estado |
|------|----------|--------|
| Feature — ContactAuthorizationTest (3 tests: 401, 403, 200) | 1 archivo | ⚠️ Insuficiente |
| **Feature — Contacts CRUD (list, show, create, update, delete)** | **0 archivos** | **❌ FALTA** |
| **Feature — ContactProperties (GET /contacts/{id}/properties)** | **0 archivos** | **❌ FALTA** |
| **Feature — Occupants (link, unlink, update, list)** | **0 archivos** | **❌ FALTA** |
| **Feature — OccupantTypes (list)** | **0 archivos** | **❌ FALTA** |
| **Unit — Domain** | **0 archivos** | **❌ FALTA** |
| **Unit — Application (UseCases × 11)** | **0 archivos** | **❌ FALTA** |
| **Integration — Mappers (Contact, OccupantType, PropertyOccupant)** | **0 archivos** | **❌ FALTA** |
| **Integration — Persistence** | **0 archivos** | **❌ FALTA** |
| **Architecture — Domain independence** | **0 archivos** | **❌ FALTA** |

### Deuda técnica abierta (documentada)
- **`directorio-middleware-role-admin.md`**: El middleware `role:admin` referenciado en las rutas de Directorio puede no estar registrado — `InvalidArgumentException` en runtime si el middleware no tiene alias. Necesita verificación y registro bajo `src/Shared/` o `src/Auth/`.

### Gaps críticos
Este es el módulo con **mayor riesgo**: tiene 11 UseCases y 3 Controllers sin ningún test que verifique comportamiento funcional. El único test existente (`ContactAuthorizationTest`) solo verifica autenticación/autorización a nivel de ruta, no el comportamiento del CRUD.

---

## 5. Feature 5 — Roles y Permisos ⚠️ MIDDLEWARE NO CONECTADO

### Implementado
Sesiones 15-18 produjeron Domain (Role, Permission, RoleAssignment, Exceptions), Application (11 UseCases), Infrastructure (CachedPermissionResolver, EloquentRoleRepository, 5 Controllers), migraciones RBAC y seeders idempotentes.

### Cobertura de tests
| Tipo | Archivos | Estado |
|------|----------|--------|
| Feature — PermissionResolverTest | 1 archivo | ✅ |
| Feature — RoleManagementTest (11 tests: CRUD roles, permisos, assignments, aprobaciones, audit) | 1 archivo | ✅ |
| **Unit — Authorization Domain (Role, Permission, RoleAssignment, Exceptions)** | **0 archivos** | **❌ FALTA** |
| **Integration — CachedPermissionResolver (Redis, TTL, invalidación)** | **0 archivos** | **❌ FALTA** |
| **Integration — EloquentRoleRepository** | **0 archivos** | **❌ FALTA** |
| **Architecture — Domain independence** | **0 archivos** | **❌ FALTA** |

### Deuda técnica abierta (documentada)
- **`authorization-middleware-rutas.md`**: El `AuthorizationMiddleware` (permisos granulares `recurso.accion`) **no está conectado** a las rutas de Auth, Propiedades y Directorio. Estos módulos siguen usando `role:admin` (claim-based), no RBAC. La migración a `can:recurso.accion` está pendiente para todos los módulos congelados.

### Gaps críticos
1. Sin tests para el Domain de Authorization: las invariantes de `Role` (roles de sistema no editables), `Permission` (códigos únicos) y `RoleAssignment` no están probadas.
2. Sin integration test para `CachedPermissionResolver` — el componente más crítico del RBAC (Redis TTL, invalidación de caché, resolución correcta) no tiene prueba aislada.
3. El RBAC no está activo en los módulos existentes — la autorización granular no funciona en producción para ningún endpoint excepto los de `/authorization`.

---

## 6. Feature 6 — Comunicaciones ⚠️ SIN TESTS UNIT/INTEGRATION

### Implementado
Sesiones 20-22 produjeron Domain (7 Entities, 6 Exceptions, 5 Repositories, 5 ValueObjects), Application (13 UseCases en 4 grupos), Infrastructure completa (4 Controllers + WebhookController, Jobs, Mappers), y Presentation con 13 rutas.

### Cobertura de tests
| Tipo | Archivos | Estado |
|------|----------|--------|
| Feature — AnnouncementTest (5 tests) | 1 archivo | ✅ |
| Feature — TemplateTest (4 tests) | 1 archivo | ✅ |
| Feature — SurveyTest (5 tests) | 1 archivo | ✅ |
| Feature — ChannelTest (3 tests) | 1 archivo | ✅ |
| **Feature — WebhookController** | **0 tests** | **❌ FALTA** |
| **Unit — Comunicaciones Domain (Entities, VOs, Exceptions)** | **0 archivos** | **❌ FALTA** |
| **Unit — Application (UseCases × 13)** | **0 archivos** | **❌ FALTA** |
| **Integration — Mappers (5 mappers)** | **0 archivos** | **❌ FALTA** |
| **Integration — Persistence (5 repositories)** | **0 archivos** | **❌ FALTA** |
| **Architecture — Domain independence** | **0 archivos** | **❌ FALTA** |

### Gaps adicionales
- `SendAnnouncementDeliveriesJob` no tiene tests (job de cola crítico para el envío real).
- `WebhookController` sin tests — endpoint público que actualiza estado de deliveries, sin validación de origen ni autenticación robusta.
- Los tests feature existentes no cubren casos de error (404 para encuesta inexistente, encuesta cerrada, doble respuesta con distinto usuario, etc.).

---

## 7. Gaps Transversales

### 7.1 Architecture Tests — 5 módulos sin cobertura
El único archivo `tests/Architecture/DomainArchitectureTest.php` solo cubre `Auth` y `Shared`. **Faltan architecture tests para**:

```
Directorio   → no se verifica que Domain no use Illuminate
Propiedades  → no se verifica que Domain no use Illuminate
Authorization → no se verifica que Domain no use Illuminate
Comunicaciones → no se verifica que Domain no use Illuminate
Tenancy      → no tiene ningún test de arquitectura
```

Riesgo: un import accidental de un modelo Eloquent dentro del Domain pasaría desapercibido.

### 7.2 Tenancy — Tests insuficientes
El módulo `src/Tenancy/` tiene Domain (OrganizationEntity), Infrastructure (Mapper + Repository) sin ningún test unitario ni de integración. `OrganizationTest` solo prueba creación via modelo Eloquent y aislamiento básico.

Faltan:
- Tests de `OrganizationMapper` (bidireccional)
- Tests de `EloquentOrganizationRepository`
- Tests de aislamiento multi-tenant end-to-end (datos de org A no visibles en org B via API)

### 7.3 PHPStan — Bloquea CI verde
Los 6 errores en `app/Providers/AppServiceProvider.php` (llamadas a `env()` fuera de config) llevan desde la Sesión 8 sin resolverse. Bloquean un CI verde real.

**Fix**: mover los valores de `env()` a `config/rate_limiting.php` y referenciar con `config('rate_limiting.login.max_attempts')`.

### 7.4 Tests flacos — 3 fallos preexistentes
- `it returns 429 after exceeding login rate limit` — timing-sensitive.
- 2 tests de CORS que esperan origen `http://localhost:5173` pero el entorno responde `5174`.

### 7.5 WebhookController sin autenticación
`POST /api/v1/comunicaciones/webhooks/{provider}` solo tiene `throttle:webhooks`. No verifica secreto/firma del proveedor externo (WhatsApp, email). Es un vector de abuso que permite marcar deliveries con estados arbitrarios.

---

## 8. Matriz de Cobertura por Capa y Módulo

| Módulo | Unit Domain | Unit UseCase | Integration | Feature | Architecture | Security |
|--------|:-----------:|:------------:|:-----------:|:-------:|:------------:|:--------:|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Shared | ✅ | — | ❌ | ✅ | ✅ | — |
| Propiedades | ❌ | ❌ | ❌ | ✅ | ❌ | — |
| Directorio | ❌ | ❌ | ❌ | ⚠️ mín | ❌ | — |
| Authorization | ❌ | ❌ | ❌ | ✅ | ❌ | — |
| Comunicaciones | ❌ | ❌ | ❌ | ✅ | ❌ | — |
| Tenancy | ❌ | ❌ | ❌ | ⚠️ mín | ❌ | — |

---

## 9. Lista de Tests Faltantes (Priorizados)

### P0 — Críticos (bloquean confianza en el sistema)

1. **Directorio — Feature tests CRUD completos**
   - `tests/Feature/Directorio/Http/ContactControllerTest.php`
     - list contacts (paginación, filtros)
     - show contact (200 + 404)
     - create contact (201 + validaciones)
     - update contact (200 + 404)
     - delete contact (204 + 404 + protección si tiene ocupantes activos)
   - `tests/Feature/Directorio/Http/OccupantControllerTest.php`
     - link contact to unit (201 + duplicado + regla propietario único)
     - list occupants por propiedad
     - update occupant
     - unlink occupant
   - `tests/Feature/Directorio/Http/OccupantTypeControllerTest.php`
     - list occupant types

2. **Authorization — Integration test para CachedPermissionResolver**
   - `tests/Integration/Authorization/CachedPermissionResolverTest.php`
     - resolución correcta de permisos por rol y scope
     - caché Redis con TTL 5 min
     - invalidación al cambiar asignación
     - fallback sin caché

3. **Architecture — Módulos Directorio, Propiedades, Authorization, Comunicaciones**
   - `tests/Architecture/DomainArchitectureTest.php` (ampliar el existente)

### P1 — Altos (reducen confianza pero hay cobertura feature)

4. **Propiedades — Unit tests Domain**
   - `tests/Unit/Propiedades/Domain/Entities/` — 8 archivos (una entidad por archivo)
   - Invariantes: coeficiente suma 1.0, pisos positivos, estado válido, etc.

5. **Propiedades — Unit tests UseCases**
   - `tests/Unit/Propiedades/Application/UseCases/` — 7 grupos con mocks de repositorios

6. **Comunicaciones — Unit tests Domain**
   - `tests/Unit/Comunicaciones/Domain/` — Entities (Survey lógica de estado, Announcement segmentos) y ValueObjects (Segment, SurveyType, DeliveryChannel)

7. **Comunicaciones — Feature test WebhookController**
   - `tests/Feature/Comunicaciones/WebhookTest.php`
     - proceso de webhook actualiza estado de delivery
     - webhook sin external_id no falla (no hace nada)
     - throttle activo

### P2 — Medios (mejoran cobertura)

8. **Propiedades — Integration tests Mappers**
   - `tests/Integration/Propiedades/Infrastructure/Mappers/`

9. **Comunicaciones — Integration tests Mappers y Repositories**
   - `tests/Integration/Comunicaciones/Infrastructure/`

10. **Tenancy — Unit + Integration tests**
    - `tests/Unit/Tenancy/Domain/OrganizationEntityTest.php`
    - `tests/Integration/Tenancy/Infrastructure/OrganizationMapperTest.php`

11. **PHPStan — Fix AppServiceProvider**
    - Mover `env()` a `config/rate_limiting.php`
    - Desbloquea CI verde real

---

## 10. Deuda Técnica Abierta (documentada)

| Archivo | Descripción | Sesión origen | Impacto |
|---------|-------------|---------------|---------|
| `authorization-middleware-rutas.md` | `AuthorizationMiddleware` no conectado en rutas de Auth, Propiedades, Directorio | 17 | Alto — RBAC no activo |
| `directorio-middleware-role-admin.md` | `role:admin` puede no estar registrado como middleware alias | 11 | Alto — posible 500 en runtime |
| `ttl-blacklist-jwt-exacto.md` | TTL de blacklist JWT puede tener diferencia de 1 segundo | — | Medio |
| `composer-dump-autoload-cuelga.md` | `composer dump-autoload` requiere timeout >= 300s | — | Bajo — solo afecta tooling |
| `deprecacion-reflection-setaccessible-tests.md` | Deprecación de `ReflectionProperty::setAccessible` en tests | — | Bajo |

---

## 11. Recomendaciones de Próxima Sesión

**Prioridad sugerida para la próxima sesión de desarrollo:**

1. **Sesión de tests Directorio** (P0): completar feature tests CRUD para Contacts, Occupants y OccupantTypes. Verificar y registrar el middleware `role:admin`.

2. **Fix PHPStan AppServiceProvider** (P0): mover `env()` a config para desbloquear CI verde.

3. **Architecture tests globales** (P0): ampliar `DomainArchitectureTest.php` para cubrir Directorio, Propiedades, Authorization y Comunicaciones.

4. **Integration test CachedPermissionResolver** (P1): el componente central del RBAC sin prueba aislada es el mayor riesgo técnico oculto.

5. **Unit tests Propiedades y Comunicaciones Domain** (P1): los invariantes de negocio más importantes de estos módulos.
