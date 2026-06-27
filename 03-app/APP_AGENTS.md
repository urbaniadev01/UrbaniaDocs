---
type: meta
status: active
priority: P0
module: mobile
tags: [agents, navigation, mobile]
updated: 2026-06-19
---

# 🤖 AGENTS (App Móvil)
## Mapa de Navegación y Reglas de Oro — Urbania App

> [!danger] Leer primero
> Este es el punto de entrada de la documentación de la app móvil. Antes de tocar código o cualquier otro documento, leer este archivo completo.

---

## §0. ¿Tu tarea viene de un cambio cross-project?

Antes de continuar, responde esta pregunta:

```
¿Existe una entrada activa en [[00-shared/CHANGES_LOG]] que afecte a la App?

  → Sí: leer esa entrada antes de continuar.
         Verificar que esté referenciada en [[APP_SESSION_MANIFEST]] §Bloqueos.
         Si no está, agregarla ahora — el cambio no puede cerrarse hasta que
         esté enlazado en el manifest del proyecto.

  → No / no sé: continuar desde §1.
```

Si llegas aquí desde [[AGENTS]] (global) en modo cross-project, la entrada ya debería existir en `CHANGES_LOG`. Enlázala en `APP_SESSION_MANIFEST` antes de escribir una sola línea de código.

---

## 1. Mapa de Documentos

| Documento | Cuándo consultarlo |
|---|---|
| [[APP_AGENTS]] | Siempre primero |
| [[APP_ARCHITECTURE]] | Antes de crear/modificar estructura de carpetas, estado, navegación o manejo de errores |
| [[APP_DESIGN_SYSTEM]] | Antes de crear cualquier pantalla o componente visual |
| [[APP_ACCESSIBILITY]] | Antes de cerrar cualquier pantalla con UI |
| [[APP_API_INTEGRATION]] | Antes de tocar cualquier llamada al backend |
| [[APP_SECURITY]] | Antes de tocar tokens, biometría, almacenamiento local, pagos |
| [[APP_DATA_STRATEGY]] | Antes de decidir si un dato es offline-first, híbrido u online-only |
| [[APP_FEATURE_SCOPE]] | Para entender qué se construye, en qué orden, y qué está pendiente del lado backend |
| `03-app/features/<NOMBRE>.md` | Spec técnico del feature (pantallas, widgets, edge cases, offline). Ver [[03-app/features/_TEMPLATE]] |
| [[APP_TESTING]] | Al crear o modificar tests |
| [[APP_SETUP_GUIDE]] | Al iniciar el proyecto o incorporar a alguien nuevo |
| [[APP_RELEASE_AND_OBSERVABILITY]] | Al configurar CI/CD, publicar en tiendas, o investigar un incidente |
| [[APP_IMPLEMENTATION_PLAN]] | Antes de cualquier tarea — identifica la sesión actual |
| [[APP_SESSION_MANIFEST]] | Siempre, para saber el estado real del proyecto |
| [[APP_DEVELOPMENT_GUIDE]] | Comandos diarios, troubleshooting, decisiones ad-hoc |

> [!info] Relación con el vault del API
> Esta app consume la Urbania API REST. El contrato de integración está en [[APP_API_INTEGRATION]]. Ante cualquier duda sobre endpoints, la fuente de verdad es [[01-api/API_CONTRACT]] (diccionario) y `01-api/endpoints/<FEATURE>.md` (detalle), y [[01-api/API_JWT_IMPLEMENTATION]] para JWT — todos accesibles directamente en este vault. NUNCA se duplica request/response en documentos de App.

---

## 2. Inicio de Sesión (siempre, antes de cualquier tarea)

> [!warning] Nunca saltarse este ritual, aunque la sesión parezca una continuación directa.

**Sincronización previa (antes de abrir cualquier archivo):**
```bash
git pull   # en el vault de documentación → memoria del equipo actualizada
git pull   # en APP/ → snapshot del grafo actualizado
```

1. Leer [[APP_SESSION_MANIFEST]] → estado real del proyecto (**fuente de verdad, no la memoria**)
2. Leer [[APP_IMPLEMENTATION_PLAN]] → sesión activa y tarea siguiente
3. Ejecutar `flutter analyze && flutter test` para confirmar el estado reportado
4. Reportar cualquier discrepancia en `APP_SESSION_MANIFEST §Bloqueos` antes de continuar
5. Verificar §0 (¿hay cambio cross-project activo que afecte a la App?)

→ Solo después de estos pasos, ir al flujo de tarea correspondiente.

---

## 3. Stack en una Línea

Flutter + Riverpod + go_router + Dio + Drift + flutter_secure_storage — Clean Architecture feature-first consumiendo Urbania API (Laravel). Detalle completo en [[APP_ARCHITECTURE]].

---

## 3.1 Alcance de Operaciones

| Operación | Rutas permitidas |
|-----------|-----------------|
| **Lectura** | `03-app/`, `APP/`, `00-shared/`, `01-api/API_CONTRACT.md`, `01-api/endpoints/`, `01-api/API_JWT_IMPLEMENTATION.md` |
| **Escritura** | `03-app/`, `APP/` |
| **Lectura cross-project** | `01-api/API_SESSION_MANIFEST.md`, `02-web/WEB_SESSION_MANIFEST.md` solo para verificar impacto de un cambio cross-project |
| **Prohibido** | Crear o modificar archivos en `01-api/`, `API/`, `02-web/`, `WEB/` — derivar cambios cross-project a [[00-shared/CROSS_PROJECT_CHANGES]] |

---

## 4. Flujo de Trabajo por Tipo de Tarea

### 4.1 Implementar feature nueva (módulo de negocio)

> [!warning] No iniciar una feature de negocio (Reservas, Visitas, Pagos, Chat, PQRS) sin confirmar que el contrato del backend correspondiente ya existe en [[01-api/API_CONTRACT]] (estado "Diseñado" o "Implementado") y su detalle en `01-api/endpoints/<FEATURE>.md`, no solo en [[APP_FEATURE_SCOPE]] como "propuesto".

**Documentos a consultar (en orden):**
1. [[APP_IMPLEMENTATION_PLAN]] → Identificar sesión actual
2. [[APP_SESSION_MANIFEST]] → Verificar estado del proyecto
3. [[00-shared/FEATURES_INDEX]] → Verificar que el feature existe y su estado global
4. [[APP_FEATURE_SCOPE]] → Alcance del módulo y estado del contrato backend
5. `01-api/endpoints/<FEATURE>.md` → Confirmar que el contrato existe y ver su detalle (request/response/errores/diseño)
6. `03-app/features/<NOMBRE>.md` → Spec técnico del feature (si existe) o crearlo usando [[03-app/features/_TEMPLATE]]
7. [[APP_ARCHITECTURE]] → Estructura de carpetas feature-first (§2)
8. [[APP_DATA_STRATEGY]] → Clasificar el módulo (offline-first / híbrido / online-only)
9. [[APP_DESIGN_SYSTEM]] → Tokens y patrones visuales
10. [[APP_ACCESSIBILITY]] → Requisitos de accesibilidad

**Checklist:**
- [ ] Contrato del backend confirmado en `01-api/endpoints/<FEATURE>.md` (no solo propuesto en FEATURE_SCOPE)
- [ ] Spec técnico creado/actualizado en `03-app/features/<NOMBRE>.md` (usar [[03-app/features/_TEMPLATE]])
- [ ] Módulo clasificado en tabla de [[APP_DATA_STRATEGY]] §1
- [ ] Estructura de carpetas: `features/<modulo>/{domain,data,presentation}/`
- [ ] Domain Layer: entidades, `Repository` (interfaz), `Failure` types
- [ ] Data Layer: DTOs (`freezed`), `RepositoryImpl`, interceptores necesarios
- [ ] Presentation Layer: pantallas, providers de Riverpod, navegación con go_router
- [ ] Mapeo completo de `error.code` → UI (tabla de [[APP_API_INTEGRATION]] §3)
- [ ] Estados: loading (Skeleton/shimmer), error (ErrorWidget), vacío (EmptyState)
- [ ] Checklist visual de [[APP_DESIGN_SYSTEM]] §6 aplicado a cada pantalla
- [ ] Checklist de [[APP_ACCESSIBILITY]] §8 aplicado a cada pantalla
- [ ] Tests unitarios de domain y data layers
- [ ] Widget tests de cada pantalla (loading/data/error)
- [ ] `flutter analyze` sin errores
- [ ] Actualizar [[APP_SESSION_MANIFEST]]

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.2 Crear o modificar pantalla/widget

**Documentos a consultar (en orden):**
1. [[APP_DESIGN_SYSTEM]] → Tokens de color, tipografía, espaciado (FUENTE ÚNICA)
2. [[APP_ACCESSIBILITY]] → Semántica, contraste, tamaño mínimo de toque
3. [[APP_ARCHITECTURE]] → Convenciones de nomenclatura y estructura (§2, §5)
4. [[APP_COMPONENTS]] → Widgets reutilizables existentes (si el documento existe)

**Checklist:**
- [ ] Todo color, tamaño y texto viene de tokens de [[APP_DESIGN_SYSTEM]] — nada hardcodeado
- [ ] Widget es accesible: `Semantics`, etiquetas, contraste ≥4.5:1 (ver [[APP_ACCESSIBILITY]] §3)
- [ ] Tamaño mínimo de toque: 48×48 dp
- [ ] El widget maneja los tres estados: loading, error, vacío (si aplica datos)
- [ ] Texto internacionalizable en `l10n/` — nunca strings literales en código
- [ ] Checklist visual de [[APP_DESIGN_SYSTEM]] §6 completo
- [ ] Checklist de [[APP_ACCESSIBILITY]] §8 completo
- [ ] Widget test creado (ver [[APP_TESTING]] §3)
- [ ] `flutter analyze` sin errores

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.3 Modificar integración con API (Data Layer)

**Documentos a consultar (en orden):**
1. [[APP_API_INTEGRATION]] → Contrato de integración, cliente Dio, interceptores (FUENTE ÚNICA)
2. [[01-api/API_CONTRACT]] → Verificar endpoint contra la fuente de verdad del backend
3. [[APP_SECURITY]] → Si el cambio toca tokens, headers o almacenamiento de credenciales
4. [[APP_DATA_STRATEGY]] → Si el cambio afecta qué datos van offline vs online

**Checklist:**
- [ ] Endpoint verificado contra [[01-api/API_CONTRACT]] antes de implementar
- [ ] DTO actualizado con `freezed` + `json_serializable`
- [ ] `AuthInterceptor` incluye `User-Agent` correcto (ver [[APP_API_INTEGRATION]] §2 — crítico para refresh token de 30 días)
- [ ] Silent refresh con mutex implementado (ver [[APP_API_INTEGRATION]] §4)
- [ ] Mapeo de errores actualizado en tabla de [[APP_API_INTEGRATION]] §3
- [ ] Tokens nunca aparecen en logs de consola
- [ ] Tests de integración contra mock server actualizados (ver [[APP_TESTING]] §4)
- [ ] `flutter analyze` sin errores

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.4 Tocar seguridad o almacenamiento local

**Documentos a consultar (en orden):**
1. [[APP_SECURITY]] → COMPLETO (FUENTE ÚNICA)
2. [[01-api/API_JWT_IMPLEMENTATION]] → Requisitos de seguridad definidos por el backend
3. [[APP_DATA_STRATEGY]] → Qué datos pueden persistir localmente y cómo

**Checklist:**
- [ ] Tokens solo en `flutter_secure_storage` — nunca en `shared_preferences`, logs o reportes de crash
- [ ] Biometría con degradación correcta en dispositivos sin hardware biométrico
- [ ] Certificate pinning activo en flavors `staging`/`prod`
- [ ] Detección de root/jailbreak evaluada (ver [[APP_SECURITY]] §5)
- [ ] Redacción de PII en hooks de Crashlytics verificada
- [ ] Checklist OWASP MASVS de [[APP_SECURITY]] §10 revisado
- [ ] Tests de seguridad actualizados (ver [[APP_TESTING]] §5)
- [ ] `flutter analyze` sin errores

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.5 Infraestructura offline/sync

**Documentos a consultar (en orden):**
1. [[APP_DATA_STRATEGY]] → COMPLETO (FUENTE ÚNICA para decisiones offline)
2. [[APP_ARCHITECTURE]] → Capa de datos y Drift (§4)
3. [[APP_TESTING]] → Tests de integración con base de datos local (§4)

**Checklist:**
- [ ] Módulo clasificado correctamente en tabla de [[APP_DATA_STRATEGY]] §1 (offline-first / híbrido / online-only)
- [ ] Esquema Drift definido en `core/local/drift/`
- [ ] Cola de sincronización con reintento/backoff implementada
- [ ] `connectivityProvider` integrado
- [ ] Limpieza completa de tablas Drift verificada en logout (test de integración)
- [ ] Sin datos de un usuario que persistan para el siguiente (verificar en test)
- [ ] `flutter analyze` sin errores

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.6 Testing

**Documentos a consultar (en orden):**
1. [[APP_TESTING]] → COMPLETO (estructura, reglas, umbrales de cobertura)
2. [[APP_ARCHITECTURE]] → Capas a testear y sus dependencias (§6-8)

**Checklist:**
- [ ] Tests unitarios de domain (sin Flutter binding, sin mocks de Dio/Drift)
- [ ] Tests de integración de data layer contra mock server (ver [[APP_TESTING]] §4)
- [ ] Widget tests de cada pantalla (loading/data/error) con `ProviderScope` overrides
- [ ] Golden tests para widgets del design system (ver [[APP_TESTING]] §3.3)
- [ ] Cobertura `domain/` ≥90%, `data/` ≥80% (ver [[APP_TESTING]] §5)
- [ ] `flutter test --coverage` genera reporte sin fallos
- [ ] `flutter analyze` sin errores

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.7 Release / CI-CD / Observabilidad

**Documentos a consultar (en orden):**
1. [[APP_RELEASE_AND_OBSERVABILITY]] → COMPLETO (FUENTE ÚNICA)
2. [[APP_SECURITY]] → Build de release, obfuscation, certificate pinning

**Checklist:**
- [ ] Build con `--obfuscate --split-debug-info` (flavors staging/prod)
- [ ] Firebase Crashlytics/Analytics/Performance verificados en staging antes de prod
- [ ] Ficha de privacidad de cada tienda actualizada (Data Safety / App Privacy)
- [ ] Pipeline CI corre `flutter analyze && flutter test && flutter build appbundle --flavor staging` sin intervención manual
- [ ] [[APP_SESSION_MANIFEST]] actualizado con versión exacta del release candidato

→ Al terminar: ejecutar **Checklist Final §6** (al pie de este documento).

---

### 4.8 Setup / Inicialización del proyecto

**Documentos a consultar (en orden):**
1. [[APP_SETUP_GUIDE]] → COMPLETO (paso a paso)
2. [[APP_ARCHITECTURE]] → Stack y estructura de carpetas
3. [[APP_DESIGN_SYSTEM]] → Tokens base
4. [[APP_SECURITY]] → Configuración de flavors y secrets

---

## 4.9 En Caso de Fallo

| Situación | Acción |
|-----------|--------|
| `flutter analyze` falla al inicio de sesión | No continuar. Documentar en `APP_SESSION_MANIFEST §Bloqueos`. Marcar sesión como "🔴 Bloqueado". |
| `flutter test` falla en medio de una implementación | Resolver antes de continuar. No marcar feature como completada. |
| `flutter build appbundle` falla al cerrar sesión | Marcar estado como "⏸️ Interrumpido" en `APP_SESSION_MANIFEST`. No actualizar `APP_IMPLEMENTATION_PLAN` como sesión completada. |
| Inconsistencia detectada entre `APP_API_INTEGRATION` y el endpoint real del backend | Reportar en `APP_SESSION_MANIFEST §Bloqueos`. No implementar contra un contrato que no coincide. |
| Sesión interrumpida sin completar Checklist Final | Marcar estado como "⏸️ Interrumpido" en `APP_SESSION_MANIFEST`. Documentar exactamente dónde quedó el trabajo. |
| Cambio cross-project detectado sin entrada en `CHANGES_LOG` | Crear la entrada antes de continuar. No asumir que API o Web lo sabrán. |

---

## 5. Reglas de Oro (Nunca violar)

| # | Regla | Consecuencia de violar |
|---|-------|------------------------|
| 1 | **No duplicar contenido del vault del API** | Divergencia silenciosa entre contratos — usar solo referencias `[[01-api/...]]` |
| 2 | **Verify before assume** — correr `flutter analyze && flutter test` antes de continuar una sesión | Se construye sobre un estado roto sin saberlo |
| 3 | **El contrato de API es del backend, no se inventa aquí** — confirmar en [[01-api/API_CONTRACT]] antes de implementar | Integración rota en cuanto el backend se formaliza |
| 4 | **Seguridad y accesibilidad se verifican en cada sesión de UI**, no se posponen | La deuda crece de forma exponencial; es más barato verificar en cada sesión |
| 5 | **Ningún secreto en texto plano** — tokens, contraseñas, MFA solo en `flutter_secure_storage` | Exposición en logs, backups o reportes de crash |
| 6 | **Todo color, tamaño y texto viene de tokens** de [[APP_DESIGN_SYSTEM]] y `l10n/` | Incoherencia visual entre pantallas, regresiones al cambiar el design system |
| 7 | **Si se encuentra una inconsistencia** entre vault, código o contrato del backend, se reporta de inmediato | Propagación silenciosa de errores entre sesiones |
| 8 | **Las decisiones de negocio pendientes se marcan explícitamente** — no elegir por el equipo técnico | ADRs incompletos, decisiones asumidas que luego hay que revertir |
| 9 | **No iniciar sesión de negocio (10+)** sin confirmar que el contrato existe en [[01-api/API_CONTRACT]] | Implementar contra un contrato "propuesto" que cambia o nunca llega |
| 10 | **Biometría con degradación correcta** — nunca asumir hardware disponible | Crash en dispositivos sin sensor biométrico |
| 11 | **Actualizar [[APP_SESSION_MANIFEST]] al final de cada sesión** | Estado perdido entre sesiones; la siguiente iteración parte de datos incorrectos |
| 12 | **Si el `flutter analyze` falla, no marcar sesión como completada** | Estado "completado" que en realidad no compila ni pasa análisis estático |
| 13 | **La memoria (agentmemory) es contexto de calentamiento, no fuente de verdad** — si agentmemory dice X y [[APP_SESSION_MANIFEST]] dice Y, gana el manifest. Siempre. | Decisiones incorrectas basadas en estado de memoria obsoleto |

---

## 6. Checklist Final antes de Entregar

- [ ] `flutter analyze` sin errores ni warnings
- [ ] `flutter test` pasa (unit + widget + integración)
- [ ] `flutter build appbundle --flavor staging` genera sin errores
- [ ] Cobertura cumple umbrales de [[APP_TESTING]] §5
- [ ] No hay strings hardcodeados — todo en `l10n/`
- [ ] No hay colores ni tamaños hardcodeados — todo en tokens de [[APP_DESIGN_SYSTEM]]
- [ ] No hay secretos en texto plano ni en logs
- [ ] Checklist visual de [[APP_DESIGN_SYSTEM]] §6 verificado en cada pantalla nueva/modificada
- [ ] Checklist de [[APP_ACCESSIBILITY]] §8 verificado en cada pantalla nueva/modificada
- [ ] Checklist OWASP MASVS de [[APP_SECURITY]] §10 actualizado si se tocó seguridad
- [ ] Estados de carga, error y vacío en toda vista con datos remotos
- [ ] Bloqueos activos en [[APP_SESSION_MANIFEST]] §Bloqueos actualizados
- [ ] [[APP_SESSION_MANIFEST]] actualizado con el estado real al cierre
- [ ] Si agentmemory registró nuevos patrones: `git add 00-shared/.agent-memory/ && git commit -m "memory: <descripción>" && git push` (desde el vault)
- [ ] Si el grafo cambió: `git add .codebase-memory/ && git commit -m "chore: update graph snapshot"` (desde `APP/`)

---

## 7. Primer Paso si Eres Nuevo en el Proyecto

1. Leer este documento completo.
2. Leer [[APP_SESSION_MANIFEST]] para saber el estado real actual.
3. Leer [[APP_IMPLEMENTATION_PLAN]] para saber qué sesión sigue.
4. Ejecutar [[APP_SETUP_GUIDE]] si el entorno no está configurado.
5. Verificar §0 (¿hay cambio cross-project activo que afecte a la App?).
6. No tocar código de una feature sin haber leído el documento correspondiente de la tabla del §1.

---

## 8. Referencias Rápidas por Documento

| Documento | Propósito | Cuándo consultar |
|-----------|-----------|------------------|
| [[APP_AGENTS]] | Mapa de navegación | Siempre primero |
| [[APP_IMPLEMENTATION_PLAN]] | Plan de sesiones | Antes de cualquier tarea |
| [[APP_SESSION_MANIFEST]] | Estado actual | Inicio de sesión + cierre |
| [[APP_ARCHITECTURE]] | Stack, estructura, DI, manejo de errores | Antes de crear estructura nueva |
| [[APP_DESIGN_SYSTEM]] | Tokens visuales, patrones de UI | Cualquier pantalla o widget |
| [[APP_ACCESSIBILITY]] | Semántica, contraste, tamaño de toque | Al cerrar cualquier pantalla |
| [[APP_API_INTEGRATION]] | Cliente Dio, interceptores, errores | Cualquier llamada al backend |
| [[APP_SECURITY]] | Tokens, biometría, certificate pinning | Auth, almacenamiento, release |
| [[APP_DATA_STRATEGY]] | Offline-first, sync, Drift | Decisiones de persistencia |
| [[APP_FEATURE_SCOPE]] | Qué se construye y en qué orden | Al iniciar módulo de negocio |
| [[APP_TESTING]] | Unit, widget, integración, golden | Al crear/modificar tests |
| [[APP_SETUP_GUIDE]] | Inicialización del entorno | Al iniciar o incorporar a alguien |
| [[APP_RELEASE_AND_OBSERVABILITY]] | CI/CD, tiendas, observabilidad | Build, release, incidentes |
| [[APP_DEVELOPMENT_GUIDE]] | Troubleshooting, decisiones ad-hoc | Al encontrar problemas |
| [[01-api/API_CONTRACT]] | Contrato de endpoints del backend | Antes de integrar cualquier endpoint |
| [[01-api/API_JWT_IMPLEMENTATION]] | Requisitos JWT del backend | Tareas de auth y seguridad |

---

## Documentación de Librerías

Cuando necesites documentación actualizada de Flutter, Dart, Riverpod, go_router, Dio, Drift u otro paquete, usa las herramientas de **context7**.
