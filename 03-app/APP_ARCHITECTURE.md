---
type: architecture
status: active
priority: P0
module: mobile
tags: [flutter, ddd, stack, adr, mobile]
updated: 2026-06-18
---

# 🏗️ ARCHITECTURE (App Móvil)
## Arquitectura de Urbania App (Flutter)

> [!info] Consultar
> Antes de implementar cualquier feature nueva o modificar la estructura del proyecto.

> [!info] Relación con el API
> Este documento describe el cliente móvil que consume [[01-api/API_CONTRACT|API_CONTRACT]] del backend Urbania API. No duplica las reglas de ese proyecto — donde aplique, se referencia en vez de copiar. La app tiene su propia arquitectura porque sus restricciones son distintas: corre en el dispositivo del usuario, debe funcionar con conectividad intermitente, y su superficie de ataque (binario distribuible, almacenamiento local) es diferente a la de un servidor.

---

## 1. Stack Tecnológico

| Componente | Tecnología | Justificación |
|---|---|---|
| Framework | **Flutter** (canal `stable`, última versión al iniciar el proyecto) | Un solo código para iOS/Android, rendimiento cercano a nativo, ecosistema maduro en 2026 |
| Lenguaje | **Dart** (≥3.6, null-safety + sealed classes + patterns) | Sealed classes habilitan manejo de errores tipado sin librerías funcionales externas |
| Gestión de estado | **Riverpod** (`hooks_riverpod` + `riverpod_generator`) | Testeable sin `BuildContext`, DI integrado, soporta `AsyncNotifier` para estados de carga/error/datos de forma nativa |
| Navegación | **go_router** | Recomendado oficialmente por el equipo de Flutter, soporta deep links, guards de redirección (necesarios para proteger rutas según sesión) |
| Cliente HTTP | **Dio** + interceptors propios | Soporta interceptors para inyección de `Authorization`, refresh automático, logging, cancelación de requests |
| Serialización | **freezed** + **json_serializable** | DTOs inmutables generados, reduce errores de mapeo manual |
| Base de datos local | **Drift** (sobre `sqlite3`) | Type-safe, soporta migraciones versionadas, streams reactivos (`watch()`) ideales para UI offline-first |
| Almacenamiento seguro | **flutter_secure_storage** | Wrapper sobre Keychain (iOS) / Keystore (Android) — ver [[APP_SECURITY]] §2 |
| Biometría | **local_auth** | Face ID / Touch ID / huella — ver [[APP_SECURITY]] §3 |
| Push notifications | **Firebase Cloud Messaging (FCM)** | Cubre Android nativo + iOS vía APNs a través de un solo SDK |
| Tiempo real (chat) | **Laravel Reverb** (servidor, lado API) + **pusher_channels_flutter** (cliente, protocolo compatible) | Reverb es la solución WebSocket first-party de Laravel 13; evita depender de un proveedor externo de pago para el MVP |
| Analítica / Crash reporting | **Firebase Crashlytics** + **Firebase Analytics** | Mismo SDK que push (menor footprint), correlacionable con `trace_id` del API — ver [[APP_SECURITY]] §7 |
| Inyección de dependencias | Riverpod (providers) | No se introduce `get_it` adicional; Riverpod ya cubre DI + estado con un solo mental model |
| Generación de código | `build_runner` | Orquesta freezed, json_serializable, riverpod_generator, drift |
| Internacionalización | `flutter_localizations` + `intl` (ARB files) | Español (Colombia) como locale base, inglés como segundo idioma desde el MVP (mercado objetivo puede expandirse) |
| Linting | `flutter_lints` + reglas propias (`analysis_options.yaml`) | Base oficial + reglas estrictas adicionales (ver §10) |
| Testing | `flutter_test`, `mocktail`, `integration_test`, `patrol`, `golden_toolkit` | Ver [[APP_TESTING]] |

> [!tip] Regla de versiones
> Igual que en el API ([[APP_ARCHITECTURE]] del backend §1): siempre la última versión estable de cada paquete al momento de iniciar/retomar el proyecto. Si una versión nueva de Flutter o de un paquete introduce un breaking change, documentarlo en [[APP_DEVELOPMENT_GUIDE]] antes de actualizar, no después.

> [!warning] Decisión pendiente de confirmar con negocio
> La pasarela de pagos (ver [[APP_FEATURE_SCOPE]] §4) no se fija aquí porque es una decisión de negocio, no solo técnica. Candidatas razonables para Colombia/LatAm: **Wompi** (Bancolombia) o **PayU**. Ambas ofrecen SDK/checkout que evita que la app toque datos de tarjeta directamente (ver [[APP_SECURITY]] §6, cumplimiento PCI-DSS SAQ A).

---

## 2. Arquitectura: Clean Architecture *Feature-First*

> A diferencia del backend (bounded contexts DDD estrictos, [[APP_ARCHITECTURE]] del API §2), el cliente móvil usa **feature-first**: cada pantalla/funcionalidad es una carpeta autocontenida con sus tres capas. Es la adaptación pragmática estándar de Clean Architecture en Flutter — el dominio de una app cliente es mucho más delgado que el de un backend (no hay reglas de negocio complejas, en su mayoría se delega al API).

```
lib/
├── main.dart                       # Entry point, configuración de flavor
├── app.dart                        # MaterialApp.router, theming, locale
│
├── core/                           # Equivalente a Shared/ del API
│   ├── network/
│   │   ├── api_client.dart         # Dio configurado + interceptors
│   │   ├── auth_interceptor.dart   # Inyecta Authorization, dispara refresh
│   │   └── error_mapper.dart       # Mapea {error:{code,message,trace_id}} -> Failure
│   ├── storage/
│   │   ├── secure_token_storage.dart
│   │   └── app_database.dart       # Drift database (ver DATA_STRATEGY)
│   ├── error/
│   │   └── failure.dart            # sealed class Failure (ver §6)
│   ├── router/
│   │   └── app_router.dart         # go_router + redirects por sesión
│   ├── theme/                      # Ver DESIGN_SYSTEM
│   └── widgets/                    # Componentes globales reutilizables
│
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   ├── dtos/               # LoginRequestDto, LoginResponseDto (freezed)
│   │   │   └── auth_repository_impl.dart
│   │   ├── domain/
│   │   │   ├── entities/           # UserEntity, SessionEntity
│   │   │   └── auth_repository.dart   # interface
│   │   └── presentation/
│   │       ├── providers/          # auth_provider.dart (Riverpod)
│   │       ├── screens/            # login_screen.dart, mfa_screen.dart...
│   │       └── widgets/
│   ├── reservations/
│   ├── visits/
│   ├── payments/
│   ├── chat/
│   ├── notifications/
│   └── profile/
│
└── l10n/                           # Archivos .arb
```

### Principios

- Cada carpeta en `features/` es **autocontenida**: no importa de otra feature directamente. Comunicación entre features solo vía `core/` (providers compartidos) o navegación (`go_router`).
- `domain/` no importa de Flutter, Dio, Drift ni de ningún paquete de infraestructura — solo Dart puro. Esto permite testear reglas de presentación de datos sin levantar la app.
- `data/` implementa las interfaces de `domain/` usando Dio (red) y/o Drift (local), y es responsable de decidir **de dónde** viene el dato según la estrategia de [[APP_DATA_STRATEGY]].
- `presentation/` no llama a Dio o Drift directamente — siempre a través de un provider que expone un `Repository` de `domain/`.
- **Nunca** un widget de presentación parsea JSON del API directamente: el DTO (`data/dtos/`) es la única capa que conoce la forma exacta del contrato HTTP.

---

## 3. Gestión de Estado (Riverpod)

Patrón estándar para cualquier feature que dependa de datos remotos:

```dart
@riverpod
class ReservationsNotifier extends _$ReservationsNotifier {
  @override
  FutureOr<List<ReservationEntity>> build() {
    return ref.watch(reservationsRepositoryProvider).getUpcoming();
  }

  Future<void> create(ReservationDraft draft) async {
    state = const AsyncLoading();
    final result = await ref.read(reservationsRepositoryProvider).create(draft);
    state = result.fold(
      onFailure: (f) => AsyncError(f, StackTrace.current),
      onSuccess: (_) => AsyncData(await build()),
    );
  }
}
```

- Todo estado asíncrono (llamada al API, lectura de Drift) se modela como `AsyncValue<T>` (`AsyncLoading` / `AsyncData` / `AsyncError`) — la UI siempre maneja los tres casos explícitamente, nunca asume datos presentes.
- Los providers son la única fuente de verdad de UI. Ningún `StatefulWidget` guarda estado de negocio en `setState`; `setState` solo se permite para estado puramente visual y efímero (ej: animación, posición de scroll).
- Code generation (`@riverpod`) es obligatorio para providers nuevos — no usar la sintaxis manual `Provider((ref) => ...)` salvo para casos triviales sin dependencias.

---

## 4. Navegación (go_router)

```dart
final goRouterProvider = Provider((ref) {
  final authState = ref.watch(authStateProvider);
  return GoRouter(
    redirect: (context, state) {
      final loggedIn = authState.valueOrNull?.isAuthenticated ?? false;
      final goingToAuth = state.matchedLocation.startsWith('/auth');
      if (!loggedIn && !goingToAuth) return '/auth/login';
      if (loggedIn && goingToAuth) return '/home';
      return null;
    },
    routes: [...],
  );
});
```

- Rutas protegidas se resuelven con `redirect`, no con checks dispersos en cada pantalla.
- Deep links (ej. abrir la app desde una notificación push de chat o desde el correo de verificación de email) se registran como rutas nombradas — ver [[APP_FEATURE_SCOPE]] §6 y [[APP_DATA_STRATEGY]] §5.

---

## 5. Reglas de Dependencia

```
presentation -> domain (entities, repository interfaces)
data         -> domain (implementa repository interfaces)
core/network -> (nada de features)
features/*   -> core/* (permitido)
features/*   -> features/* (PROHIBIDO, salvo vía core/ o navegación)
domain/*     -> (nada externo: ni Flutter, ni Dio, ni Drift)
```

| Regla | Consecuencia si se viola |
|---|---|
| `domain/` no importa Flutter/Dio/Drift | No se puede testear con `flutter_test` puro de Dart, hay que levantar el binding de Flutter innecesariamente |
| Una feature no importa otra feature | Acoplamiento oculto, imposible eliminar/aislar un feature sin romper otro |
| DTOs nunca se exponen fuera de `data/` | Un cambio de contrato del API (ver [[APP_API_INTEGRATION]]) rompe `presentation/` en cascada |
| `core/widgets/` no conoce ninguna feature | Los componentes globales (ver [[APP_DESIGN_SYSTEM]]) deben ser reutilizables sin acoplarse a reservas, pagos, etc. |

---

## 6. Manejo de Errores: `Failure` tipado (sin librerías funcionales externas)

Dart 3 soporta `sealed class` + pattern matching exhaustivo — no es necesario `dartz`/`fpdart` para un patrón Result/Either:

```dart
sealed class Failure {
  const Failure(this.message, this.traceId);
  final String message;
  final String? traceId;
}

class NetworkFailure extends Failure {
  const NetworkFailure(super.message, super.traceId);
}

class ApiFailure extends Failure {
  const ApiFailure(this.code, super.message, super.traceId);
  final String code; // coincide 1:1 con error.code del API — ver API_INTEGRATION §3
}

class CacheFailure extends Failure {
  const CacheFailure(super.message, super.traceId);
}
```

```dart
final result = switch (failure) {
  ApiFailure(code: 'MFA_REQUIRED') => goToMfaScreen(),
  ApiFailure(code: 'TOKEN_EXPIRED') => triggerSilentRefresh(),
  ApiFailure(code: 'DEVICE_NOT_RECOGNIZED') => forceFullReLogin(),
  NetworkFailure() => showOfflineBanner(),
  _ => showGenericError(failure.message),
};
```

> [!note] Por qué no Either/dartz
> El patrón `sealed class` + `switch` exhaustivo de Dart 3 da exactamente las garantías de exhaustividad de un `Either` funcional, sin curva de aprendizaje adicional para el equipo ni dependencia externa. Si el equipo ya tiene experiencia previa con `fpdart`, es una sustitución válida — documentarlo como decisión ad-hoc en [[APP_DEVELOPMENT_GUIDE]] si se cambia.

---

## 7. Mapeo DTO → Entity → UI

Igual que el backend usa Mappers para ir de Eloquent a Entidad de Dominio ([[APP_ARCHITECTURE]] del API §6), el cliente usa el mismo patrón en `data/mappers/`:

```dart
extension UserDtoMapper on UserResponseDto {
  UserEntity toEntity() => UserEntity(
    id: UserId(id),
    name: name,
    email: Email(email),
    role: UserRole.fromString(role), // 'admin' | 'user' — ver API_CONTRACT §1
    avatarUrl: avatarUrl,
  );
}
```

- Los DTOs reflejan **exactamente** la forma JSON del API ([[APP_API_INTEGRATION]]).
- Las Entities reflejan lo que la UI necesita, con value objects propios donde aporte (ej. `Email`, `UserId`) para evitar primitivos sueltos en la capa de presentación.

---

## 8. Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos | snake_case | `reservation_repository.dart` |
| Clases | PascalCase | `ReservationRepository` |
| Providers generados | camelCase + sufijo `Provider` | `reservationsNotifierProvider` |
| DTOs | PascalCase + sufijo `Dto` | `LoginResponseDto` |
| Entities | PascalCase + sufijo `Entity` | `UserEntity` |
| Carpetas de feature | snake_case, singular o plural según dominio | `features/reservations/` |
| Rutas (go_router) | kebab-case, refleja jerarquía | `/reservations/:id/confirm` |
| Constantes | `lowerCamelCase` con prefijo `k` o `UPPER_SNAKE_CASE` en clases de config | `kAccessTokenTtl` |
| Claves de Drift/tablas locales | snake_case, plural, prefijo `local_` si es cache del API | `local_reservations` |

---

## 9. Flavors / Entornos

| Flavor | API Base URL | Uso |
|---|---|---|
| `dev` | `http://localhost:8080/api/v1` (o túnel ngrok para dispositivo físico) | Desarrollo diario |
| `staging` | `https://staging-api.urbania.com/api/v1` | QA, pruebas de release candidate |
| `prod` | `https://api.urbania.com/api/v1` | Producción, App Store / Play Store |

Configurado vía `flutter_flavorizr` o `--dart-define` (decisión a tomar en Sesión 1, ver [[APP_SETUP_GUIDE]] §2). Cada flavor tiene su propio `applicationId`/`bundleId` para poder instalar `dev` y `prod` en el mismo dispositivo simultáneamente.

---

## 10. Calidad Estática

```yaml
# analysis_options.yaml (extiende flutter_lints)
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - always_use_package_imports
    - avoid_dynamic_calls
    - prefer_final_locals
    - require_trailing_commas
    - unawaited_futures        # crítico: evita fire-and-forget de llamadas al API
```

> [!warning] `unawaited_futures`
> Esta regla es obligatoria, no opcional. Un `Future` de red sin `await` ni manejo de error explícito es la causa más común de bugs silenciosos en apps Flutter que consumen APIs REST (la petición falla y nadie se entera).

---

## 11. Architecture Decision Records (ADR) Propuestos

| ADR | Tema | Prioridad |
|---|---|---|
| ADR-M001 | Feature-first sobre bounded contexts estrictos para el cliente | Alta |
| ADR-M002 | Riverpod sobre Bloc/Provider/GetX | Alta |
| ADR-M003 | Drift sobre Hive/Isar para cache offline relacional | Alta |
| ADR-M004 | sealed class `Failure` sobre `fpdart`/`dartz` | Media |
| ADR-M005 | Laravel Reverb sobre Pusher/Ably para chat en tiempo real | Media |
| ADR-M006 | Pasarela de pagos (Wompi vs PayU) — pendiente de negocio | Alta |

> [!tip] Nota
> Mismo criterio que el backend ([[APP_ARCHITECTURE]] del API §14): cada ADR se crea cuando la decisión ya está aplicada en código, no como ejercicio teórico previo.

---

## 12. Documentos Relacionados

| Documento | Cuándo consultar |
|---|---|
| [[APP_AGENTS]] | Siempre primero |
| [[APP_API_INTEGRATION]] | Antes de tocar cualquier llamada a la API |
| [[APP_SECURITY]] | Antes de tocar tokens, biometría, almacenamiento local |
| [[APP_DATA_STRATEGY]] | Antes de decidir si un dato es offline-first u online-only |
| [[APP_DESIGN_SYSTEM]] | Antes de crear cualquier widget/pantalla nueva |
| [[APP_ACCESSIBILITY]] | Antes de cerrar cualquier feature de UI |
| [[APP_FEATURE_SCOPE]] | Para entender el alcance de producto |
| [[APP_TESTING]] | Al crear/modificar tests |
| [[APP_SETUP_GUIDE]] | Al iniciar el proyecto |
| [[APP_IMPLEMENTATION_PLAN]] | Antes de cualquier tarea, para saber en qué sesión está el proyecto |
