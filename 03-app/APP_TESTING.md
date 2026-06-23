---
type: operational
status: active
priority: P0
module: mobile
tags: [testing, flutter, qa, mobile]
updated: 2026-06-18
---

# 🧪 TESTING
## Estrategia de Pruebas de Urbania App

> [!info] Consultar
> Al crear o modificar tests, o al diseñar una feature nueva (test-driven, igual que el backend — [[01-api/API_DEVELOPMENT_GUIDE|DEVELOPMENT_GUIDE]] del API §1).

---

## 1. Pirámide de Testing

```
        ▲  Integration / E2E (patrol)         — pocos, flujos críticos completos
       ╱ ╲ Widget tests (flutter_test)         — la mayoría de la cobertura de UI
      ╱   ╲ Golden tests (golden_toolkit)       — regresión visual de componentes core
     ╱     ╲ Unit tests (flutter_test + mocktail) — la base: domain, mappers, providers
    ╱───────╲
```

| Tipo | Ubicación | Herramienta | Qué cubre |
|---|---|---|---|
| Unit | `test/unit/` | `flutter_test`, `mocktail` | Lógica de `domain/`, mappers DTO→Entity, notifiers de Riverpod (vía `ProviderContainer`) |
| Widget | `test/widget/` | `flutter_test` | Comportamiento de un widget/pantalla en aislamiento (estados loading/data/error, interacción) |
| Golden | `test/golden/` | `golden_toolkit` | Regresión visual de `core/widgets/` y pantallas clave en modo claro/oscuro |
| Integración | `integration_test/` | `integration_test`, `patrol` | Flujos completos en un dispositivo/emulador real: login, login+MFA, crear reserva, etc. |
| Accesibilidad | dentro de widget tests | `flutter_test` (`meetsGuideline(textContrastGuideline)`, etc.) | Contraste, tamaño de touch targets — ver [[APP_ACCESSIBILITY]] |

---

## 2. Estructura de Tests (espejo de `lib/`)

```
test/
├── unit/
│   └── features/auth/domain/...
├── widget/
│   └── features/auth/presentation/screens/login_screen_test.dart
├── golden/
│   └── core/widgets/app_button_test.dart
├── helpers/
│   ├── mock_repositories.dart
│   └── pump_app.dart           # helper que envuelve un widget con ProviderScope + MaterialApp + locale
└── fixtures/
    └── auth/login_response.json   # respuestas de ejemplo del API, alineadas con API_CONTRACT.md
integration_test/
└── auth_flow_test.dart
```

> [!note] Fixtures alineados al contrato
> Los JSON de `test/fixtures/` deben mantenerse sincronizados con los ejemplos de [[01-api/API_CONTRACT]]. Si el backend cambia un contrato, el primer síntoma debería ser un test de mapeo DTO fallando contra el fixture desactualizado — no un bug descubierto en producción.

---

## 3. Reglas por Tipo de Test

### 3.1 Unit Tests

- Cualquier clase en `domain/` se testea sin Flutter binding (`flutter_test` puro de Dart, sin `WidgetsFlutterBinding`).
- Repositorios se testean con `mocktail` simulando tanto el caso de éxito como cada `Failure` relevante (`NetworkFailure`, `ApiFailure` con cada código aplicable, `CacheFailure`).
- Notifiers de Riverpod se testean instanciando un `ProviderContainer` con overrides de sus dependencias — nunca levantando la app completa para testear lógica de estado.

### 3.2 Widget Tests

- Todo widget de `core/widgets/` (ver [[APP_DESIGN_SYSTEM]] §3) tiene al menos un test que cubre sus variantes principales.
- Toda pantalla con datos asíncronos testea explícitamente los tres estados: `AsyncLoading`, `AsyncData` (con datos y con lista vacía → `AppEmptyState`), `AsyncError` (→ `AppErrorView`).
- Usar `pumpAndSettle` con cuidado: si una animación o stream no termina nunca (ej. un `StreamProvider` de chat en vivo), usar `pump(duration)` explícito en vez de `pumpAndSettle` para evitar timeouts de test.

### 3.3 Golden Tests

- Cubren: cada componente de `core/widgets/`, las pantallas de `auth/` (alto tráfico, alto impacto si se rompen visualmente), en modo claro y oscuro.
- Se corren en CI sobre una imagen de referencia fija (mismo OS/fuentes) — diffs de golden test que fallan por fuente del sistema entre máquinas son la causa #1 de falsos positivos; documentar el entorno exacto en [[APP_DEVELOPMENT_GUIDE]] si ocurre.

### 3.4 Integration Tests (Patrol)

Flujos mínimos obligatorios antes de cualquier release a producción:

- [ ] Login exitoso sin MFA → Home
- [ ] Login con MFA (TOTP) → Home
- [ ] Login con credenciales inválidas → mensaje de error correcto
- [ ] Token expirado durante uso → silent refresh transparente (ver [[APP_API_INTEGRATION]] §4) sin que el usuario pierda su pantalla actual
- [ ] Logout → sesión y cache local limpiados (ver [[APP_DATA_STRATEGY]] §3, [[APP_SECURITY]] §2.1)
- [ ] Crear una reserva sin conexión → aparece como pendiente → se sincroniza al recuperar conexión (ver [[APP_DATA_STRATEGY]] §4)

> [!tip] Por qué Patrol y no solo `integration_test`
> Patrol permite interactuar con permisos nativos (notificaciones, biometría) y con diálogos del sistema operativo, necesarios para testear de punta a punta el flujo de biometría de [[APP_SECURITY]] §3 — `integration_test` puro de Flutter no tiene acceso a esos diálogos nativos.

---

## 4. Mock del API: Servidor de Pruebas

- Para tests de integración que no deben depender del backend real corriendo: usar un mock server (`json_server`, o un stub propio con `dio_adapter`/`http_mock_adapter`) que replica exactamente las respuestas de [[01-api/API_CONTRACT]].
- Esto desacopla el ciclo de desarrollo de la app del estado del backend — el equipo móvil puede avanzar en paralelo siguiendo el contrato documentado, sin esperar a que cada endpoint esté "Implementado" en el backend.

---

## 5. Cobertura Mínima Requerida

| Capa | Cobertura mínima |
|---|---|
| `domain/` | ≥90% |
| `data/` (repositorios, mappers) | ≥85% |
| `presentation/` (providers) | ≥80% |
| Widgets de UI pura (sin lógica) | No se exige cobertura de línea — se exige al menos 1 widget test por pantalla cubriendo loading/data/error |
| Global | ≥75% |

```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html   # reporte visual
```

---

## 6. Comandos de CI

```bash
flutter analyze                  # estático, debe estar limpio (ver ARCHITECTURE §10)
flutter test --coverage
flutter test --tags=golden       # si se separan goldens del resto para correrlos solo en CI con imagen fija
flutter build apk --release --analyze-size   # detectar regresiones de tamaño de bundle
```

---

## 7. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_ARCHITECTURE]] | Estructura de capas que los tests reflejan |
| [[APP_API_INTEGRATION]] | Contratos contra los que se construyen los fixtures |
| [[APP_ACCESSIBILITY]] | Reglas que los widget tests de accesibilidad verifican |
| [[APP_RELEASE_AND_OBSERVABILITY]] | Dónde corre esta suite en el pipeline de CI/CD |
