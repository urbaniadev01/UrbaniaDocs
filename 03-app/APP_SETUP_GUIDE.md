---
type: operational
status: active
priority: P0
module: mobile
tags: [setup, flutter, mobile]
updated: 2026-06-18
---

# 🚀 SETUP_GUIDE (App Móvil)
## Guía de Creación del Proyecto Urbania App desde Cero

> [!info] Consultar
> Al iniciar el proyecto o al incorporar un nuevo desarrollador al equipo móvil.

---

## 1. Pre-requisitos del Entorno

```bash
flutter --version        # canal stable, última versión al iniciar — ver ARCHITECTURE §1
dart --version
# Verificar toolchains de plataforma
flutter doctor -v         # debe estar limpio: Android SDK, Xcode (si se compila iOS), CocoaPods
```

| Herramienta | Notas |
|---|---|
| Flutter SDK | Canal `stable` exclusivamente — nunca `beta`/`master` en un proyecto productivo |
| Android Studio / SDK | Para build de Android y emuladores |
| Xcode + CocoaPods | Solo necesario en macOS, para build de iOS |
| FVM (Flutter Version Management) | Recomendado para fijar la versión exacta de Flutter por proyecto y evitar el clásico "funciona en mi máquina" entre miembros del equipo |

---

## 2. Inicialización del Proyecto

```bash
flutter create --org com.urbania --project-name urbania_app urbania_app
cd urbania_app

# Estructura DDD-adaptada (ver ARCHITECTURE §2)
mkdir -p lib/core/{network,storage,error,router,theme,widgets}
mkdir -p lib/features/{auth,reservations,visits,payments,chat,notifications,profile}
mkdir -p lib/l10n
mkdir -p test/{unit,widget,golden,helpers,fixtures}
mkdir -p integration_test
```

### 2.1 Flavors

Configurar 3 flavors (`dev`, `staging`, `prod` — ver [[APP_ARCHITECTURE]] §9) usando `flutter_flavorizr` o `--dart-define-from-file` con un `.env` por entorno. Decisión a tomar y documentar en [[APP_DEVELOPMENT_GUIDE]] en la Sesión 1 según preferencia del equipo (flavorizr automatiza más, `--dart-define` tiene menos dependencias).

---

## 3. Dependencias

### 3.1 Producción

```bash
flutter pub add flutter_riverpod hooks_riverpod riverpod_annotation
flutter pub add go_router
flutter pub add dio pretty_dio_logger
flutter pub add freezed_annotation json_annotation
flutter pub add drift sqlite3_flutter_libs path_provider path
flutter pub add flutter_secure_storage
flutter pub add local_auth
flutter pub add firebase_core firebase_messaging firebase_crashlytics firebase_analytics
flutter pub add pusher_channels_flutter
flutter pub add cached_network_image flutter_svg
flutter pub add connectivity_plus
flutter pub add intl flutter_localizations --sdk=flutter
flutter pub add google_fonts
```

### 3.2 Desarrollo

```bash
flutter pub add -d build_runner riverpod_generator freezed json_serializable drift_dev
flutter pub add -d mocktail
flutter pub add -d golden_toolkit
flutter pub add -d patrol patrol_cli
flutter pub add -d flutter_lints
```

> [!tip] Regla de versiones
> Igual que [[APP_ARCHITECTURE]] §1: última estable de cada paquete al momento de instalar. Si hay conflicto de versiones entre `firebase_*` y otro paquete, priorizar la resolución que mantenga Firebase actualizado (es el paquete con mayor superficie de breaking changes entre versiones mayores) y documentar la decisión en [[APP_DEVELOPMENT_GUIDE]].

---

## 4. Configuración de Firebase

```bash
dart pub global activate flutterfire_cli
flutterfire configure --project=urbania-app-prod
# Repetir o usar flavors separados de Firebase para dev/staging si se requiere aislamiento de datos de analítica/crash entre entornos
```

- [ ] Habilitar Cloud Messaging (FCM)
- [ ] Habilitar Crashlytics
- [ ] Habilitar Analytics
- [ ] Habilitar **App Check** (ver [[APP_SECURITY]] §8) — configurar Play Integrity API (Android) y App Attest (iOS)

---

## 5. Configuración de Red (Dio + Variables de Entorno)

```dart
// lib/core/config/env_config.dart
class EnvConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8080/api/v1',
  );
}
```

```bash
flutter run --dart-define=API_BASE_URL=http://localhost:8080/api/v1
```

> [!warning] Dispositivo físico vs emulador
> `localhost` solo funciona desde el emulador/simulador. Para probar desde un dispositivo físico contra el backend local, usar la IP de la red local o un túnel (`ngrok`) — documentar la IP/túnel vigente en [[APP_SESSION_MANIFEST]] si cambia entre sesiones de desarrollo en equipo.

---

## 6. Generación de Código

```bash
dart run build_runner watch --delete-conflicting-outputs
```

Obligatorio dejarlo corriendo en watch mode durante desarrollo activo — genera los `.freezed.dart`, `.g.dart` (json_serializable, riverpod_generator) y `.drift.dart` automáticamente al guardar.

---

## 7. Certificate Pinning (Producción)

Ver [[APP_SECURITY]] §5 para la estrategia. En setup, generar el hash SPKI del certificado actual del backend:

```bash
openssl s_client -connect api.urbania.com:443 -servername api.urbania.com < /dev/null 2>/dev/null \
  | openssl x509 -pubkey -noout \
  | openssl pkey -pubin -outform der \
  | openssl dgst -sha256 -binary \
  | openssl enc -base64
```

Guardar el hash resultante (y el de backup) en la configuración de pinning del flavor `prod`/`staging` — nunca en `dev`.

---

## 8. Localización (l10n)

```yaml
# l10n.yaml
arb-dir: lib/l10n
template-arb-file: app_es.arb
output-localization-file: app_localizations.dart
```

- `app_es.arb` (español, Colombia) como plantilla base.
- `app_en.arb` desde el MVP (ver [[APP_ARCHITECTURE]] §1).

---

## 9. CI Básico (ver detalle completo en RELEASE_AND_OBSERVABILITY)

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter analyze
flutter test --coverage
```

---

## 10. Verificación Post-Setup

```bash
flutter doctor -v                 # sin errores
flutter analyze                   # sin warnings
flutter test                      # suite vacía pero corre sin errores de configuración
flutter run --flavor dev --dart-define=API_BASE_URL=http://localhost:8080/api/v1
```

- [ ] La app arranca y muestra la pantalla de login (sin backend, debe mostrar error de red manejado correctamente, no un crash)
- [ ] Con el backend local corriendo (ver `SETUP_GUIDE.md` del API), un login real contra `/auth/login` responde y se navega a Home
- [ ] Firebase configurado: un evento de prueba aparece en la consola de Analytics/Crashlytics

---

## 11. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_ARCHITECTURE]] | Estructura y stack que este setup materializa |
| [[APP_SECURITY]] | Configuración de pinning, App Check, secure storage |
| [[APP_IMPLEMENTATION_PLAN]] | Sesión 1 detalla el slice vertical mínimo posterior a este setup |
