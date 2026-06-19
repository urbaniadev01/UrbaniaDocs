---
type: operational
status: active
priority: P1
module: mobile
tags: [cicd, release, observability, mobile]
updated: 2026-06-18
---

# 📦 RELEASE_AND_OBSERVABILITY
## CI/CD, Publicación y Observabilidad de Urbania App

> [!info] Consultar
> Al configurar el pipeline de CI/CD, al preparar un release a las tiendas, o al investigar un incidente en producción.

---

## 1. Versionado

- Semantic Versioning (`MAJOR.MINOR.PATCH`) en `pubspec.yaml`, más build number incremental (`+N`) requerido por ambas tiendas.
- `MAJOR` se incrementa solo ante un cambio que requiera forzar actualización (ej. el backend retira soporte a una versión de API que la app vieja necesita).
- Cada release a `prod` se etiqueta en git (`vX.Y.Z`) y se referencia en la nota de sesión correspondiente ([[APP_SESSION_MANIFEST]]).

---

## 2. Pipeline de CI/CD

```yaml
# .github/workflows/ci.yml (resumen)
on: [pull_request, push]
jobs:
  quality:
    steps:
      - run: flutter pub get
      - run: dart run build_runner build --delete-conflicting-outputs
      - run: flutter analyze
      - run: flutter test --coverage
      - uses: codecov/codecov-action@v4   # o equivalente, ver TESTING §5 para umbrales

  build:
    needs: quality
    strategy:
      matrix: { flavor: [staging] }
    steps:
      - run: flutter build appbundle --flavor ${{ matrix.flavor }} --release
      - run: flutter build ipa --flavor ${{ matrix.flavor }} --release   # solo en runner macOS
```

> [!tip] Codemagic como alternativa
> Para el pipeline de **firma y publicación** específicamente (manejo de certificados iOS, keystores Android, subida a las tiendas), **Codemagic** es una alternativa especializada en Flutter que reduce significativamente la configuración manual de firma comparado con GitHub Actions genérico. Decisión recomendada: GitHub Actions para `quality` (analyze+test, igual stack que el resto del repo si está en GitHub), Codemagic o Fastlane para `build`+`deploy`. Evaluar y documentar la elección final en [[APP_DEVELOPMENT_GUIDE]].

### 2.1 Gates obligatorios antes de merge a `main`

- [ ] `flutter analyze` sin errores ni warnings
- [ ] `flutter test --coverage` en verde, cobertura ≥ umbrales de [[APP_TESTING]] §5
- [ ] Golden tests sin diffs no revisados
- [ ] Build de `staging` exitoso (Android + iOS)

---

## 3. Observabilidad

### 3.1 Crash Reporting (Firebase Crashlytics)

- Todo error no capturado se reporta automáticamente (`FlutterError.onError` + `PlatformDispatcher.instance.onError` conectados a Crashlytics en `main.dart`).
- Errores capturados explícitamente (ej. un `ApiFailure` con código `INTERNAL_ERROR`/`DATABASE_ERROR`) se reportan manualmente con contexto — ver formato exacto en [[APP_SECURITY]] §7 (incluir `trace_id`, nunca PII).
- Alertas configuradas para: tasa de crash-free sessions por debajo de 99% (umbral estándar de mercado para apps de producción establecidas).

### 3.2 Analytics (Firebase Analytics)

- Eventos mínimos a instrumentar desde el MVP: `login_success`, `login_failure`, `mfa_required`, `reservation_created`, `payment_completed`, `chat_message_sent` (sin contenido del mensaje, solo el evento).
- **Nunca** registrar PII como parámetro de evento (email, nombre, número de unidad) — usar el `user_id` (UUID) si se necesita correlación, consistente con la regla de [[APP_SECURITY]] §7.

### 3.3 Performance Monitoring

- Firebase Performance Monitoring (o alternativa) para tiempo de arranque en frío, tiempo de respuesta de pantallas con datos de red, y trazas custom en operaciones críticas (login completo, sincronización de la cola de [[APP_DATA_STRATEGY]] §4).

### 3.4 Correlación con el Backend

- Todo evento de error reportado por la app que se origina en una respuesta del API incluye su `trace_id` ([[APP_API_INTEGRATION]] §7) — esto permite a un agente de backend ubicar el log exacto del lado servidor sin depender de timestamps aproximados, igual que el sistema de auditoría del API ([[01-api/API_JWT_IMPLEMENTATION|JWT_IMPLEMENTATION]] §8).

---

## 4. Publicación en Tiendas

| Plataforma | Checklist mínimo |
|---|---|
| Google Play | App Bundle firmado (`appbundle`), Play App Signing habilitado, política de privacidad publicada, declaración de "Data Safety" completa y consistente con §3 (qué datos se recolectan realmente) |
| App Store | Build firmado vía certificado de distribución, App Privacy ("Nutrition Labels") completo, justificación de permisos sensibles (cámara, notificaciones, biometría) en el formulario de revisión |

> [!warning] Permisos mínimos necesarios
> Solicitar solo los permisos estrictamente necesarios para cada feature en el momento en que se necesitan (permiso de cámara solo al abrir el flujo de QR/avatar, no al iniciar la app) — además de ser buena práctica de seguridad ([[APP_SECURITY]] §10, MASVS-PLATFORM), reduce friction de revisión en ambas tiendas.

---

## 5. Estrategia de Rollout

- Rollout escalonado en Play Store (ej. 10% → 50% → 100%) para releases de `prod`, monitoreando crash-free rate (§3.1) antes de avanzar cada etapa.
- iOS no soporta rollout porcentual nativo de la misma forma — usar TestFlight con un grupo de beta testers internos/residentes voluntarios antes de cada release pública como mitigación equivalente.
- Plan de rollback: mantener la versión `N-1` lista para "expedited review" en caso de incidente crítico post-release — no hay rollback instantáneo real en las tiendas móviles, a diferencia de un backend que puede revertir un deploy en minutos.

---

## 6. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_TESTING]] | Suite que debe pasar antes de cualquier build de release |
| [[APP_SECURITY]] | Configuración de App Check, firma, obfuscation que se verifica en cada release |
| [[APP_IMPLEMENTATION_PLAN]] | Sesión dedicada a CI/CD y polish final |
