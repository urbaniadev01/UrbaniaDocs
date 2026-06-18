---
type: reference
status: active
priority: P0
module: mobile
tags: [security, mobile, owasp, mfa]
updated: 2026-06-18
---

# 🔐 SECURITY (App Móvil)
## Seguridad del Cliente Móvil

> [!info] Consultar
> Antes de tocar tokens, biometría, almacenamiento local, pagos, o cualquier dato sensible.
> **Fuente única para la seguridad del lado servidor**: `JWT_IMPLEMENTATION.md` del API. Este documento cubre exclusivamente lo que es responsabilidad del cliente.

> [!danger] Regla de oro
> Ningún secreto (token, contraseña, código TOTP, datos de tarjeta) se escribe jamás en `shared_preferences`, archivos planos, logs, ni se incluye en reportes de crash. Solo `flutter_secure_storage` (o el SDK de la pasarela de pago, que nunca expone el dato crudo a la app).

---

## 1. Modelo de Amenazas (resumen)

| Amenaza | Vector | Mitigación |
|---|---|---|
| Robo de tokens desde el dispositivo | Dispositivo rooteado/jailbreak, malware, backup inseguro | Secure storage (§2) + detección de root/jailbreak (§4) |
| Interceptación de tráfico (MITM) | Wifi público, proxy malicioso, CA falsa instalada | TLS + certificate pinning (§5) |
| Reutilización de refresh token robado | Captura de tráfico, dispositivo comprometido | El backend ya detecta esto (rotación + token_family, [[../JWT_IMPLEMENTATION|JWT_IMPLEMENTATION]] §4.2); la app debe reaccionar correctamente al `403 DEVICE_NOT_RECOGNIZED` / `401 TOKEN_INVALID` forzando re-login completo |
| Ingeniería inversa del binario | Descompilación de APK/IPA | Obfuscation + tree-shaking en builds release (§8) |
| Datos de tarjeta expuestos | Implementación propia de captura de tarjeta | **Prohibido** — usar siempre el SDK/checkout tokenizado de la pasarela (§6) |
| Fuga de PII en logs/crash reports | Logging de objetos completos en debug que llega a release | Redacción obligatoria antes de Crashlytics (§7) |

---

## 2. Almacenamiento Seguro de Tokens

Implementa exactamente lo definido como requisito del lado cliente en [[../JWT_IMPLEMENTATION|JWT_IMPLEMENTATION]] §6.2:

| Dato | Almacenamiento | Configuración |
|---|---|---|
| Access Token | `flutter_secure_storage` | iOS: Keychain con `KeychainAccessibility.first_unlock_this_device`. Android: Keystore con `EncryptedSharedPreferences` |
| Refresh Token | `flutter_secure_storage` | Mismas opciones — **nunca** en memoria persistente ni en Drift |
| `device_name` (para mostrar al usuario en `/auth/sessions`) | `shared_preferences` (no sensible) | Texto plano, es solo una etiqueta visible |

```dart
const storage = FlutterSecureStorage(
  iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock_this_device),
  aOptions: AndroidOptions(encryptedSharedPreferences: true),
);
```

> [!warning] Nunca en memoria global mutable
> No guardar el access token en una variable estática/singleton de larga vida fuera del provider de Riverpod que gestiona la sesión — minimiza la superficie de exposición en memory dumps.

### 2.1 Limpieza de sesión

Al recibir `TOKEN_INVALID`, `DEVICE_NOT_RECOGNIZED`, o al hacer logout explícito:
- [ ] Borrar ambos tokens de secure storage
- [ ] Limpiar caché local sensible relacionada a la sesión (ver [[DATA_STRATEGY]] §3 — qué se borra vs qué sobrevive un logout)
- [ ] Invalidar el `goRouterProvider` para forzar redirect a `/auth/login`
- [ ] Desuscribir el topic de FCM asociado al `user_id` (ver §9)

---

## 3. Biometría (Face ID / Touch ID / Huella)

- Paquete: `local_auth`.
- **No sustituye** al login con email/password — es una capa adicional para desbloquear el acceso a una sesión **ya existente** (access/refresh token ya almacenados), no para crear una sesión nueva.
- Flujo recomendado: si hay tokens válidos en secure storage al abrir la app, exigir biometría (o PIN del dispositivo como fallback) antes de navegar a Home. Si el usuario rechaza o falla, ofrecer login manual.
- Activable/desactivable desde `ProfileScreen` — preferencia guardada en `shared_preferences` (no sensible, es solo un flag de UX).
- Si el dispositivo no tiene biometría configurada, degradar silenciosamente a login normal — nunca bloquear el acceso a la app por falta de hardware biométrico.

---

## 4. Detección de Root / Jailbreak

> [!note] Requisito explícito de [[../JWT_IMPLEMENTATION|JWT_IMPLEMENTATION]] §6.2
> "Invalidar tokens al detectar jailbreak/root."

- Paquete sugerido: `flutter_jailbreak_detection` o `safe_device` (verificar mantenimiento activo al momento de implementar — ver nota de versiones en [[ARCHITECTURE]] §1).
- Comportamiento al detectar el dispositivo comprometido:
  1. Mostrar pantalla de advertencia explicando el motivo (transparencia, no ocultar la razón).
  2. Bloquear el flujo de pagos y de visualización de datos financieros/sensibles como mínimo.
  3. Decisión de producto a confirmar: ¿bloqueo total de la app, o solo de features sensibles (pagos, datos de PQRS)? Recomendación: bloqueo parcial — bloquear totalmente perjudica a usuarios legítimos con dispositivos rooteados por razones no maliciosas (frecuente en LatAm), pero los pagos y MFA deben quedar inhabilitados sin excepción.
- Este check es defensa en profundidad, **no** la única línea de defensa — nunca asumir que un dispositivo "limpio" según el SDK es 100% confiable (estos checks son evadibles por atacantes avanzados).

---

## 5. Certificate Pinning

- Implementar pinning del certificado (o de la clave pública, SPKI pinning — más resiliente a rotaciones de certificado que el pinning de certificado completo) en el cliente Dio para producción.
- Paquete: `dio` ya soporta `HttpClientAdapter` personalizado para esto; alternativa: `http_certificate_pinning`.
- **Estrategia de rotación**: pinnear al menos 2 claves públicas (actual + backup) para poder rotar el certificado del servidor sin requerir una actualización forzada de la app — coordinar con el equipo de backend cuándo rotan certificados.
- Pinning **solo en flavor `prod`/`staging`** — deshabilitado en `dev` para no bloquear desarrollo local con certificados self-signed.

---

## 6. Pagos: Cumplimiento PCI-DSS

> [!danger] Regla no negociable
> La app **nunca** captura, transmite, ni almacena el número completo de tarjeta, CVV, o fecha de expiración en código propio. Esto se delega 100% al SDK/checkout de la pasarela elegida (Wompi o PayU — ver [[ARCHITECTURE]] §1, decisión pendiente de negocio).

- El flujo correcto: la pasarela tokeniza la tarjeta en sus propios servidores (o vía un WebView/SDK que nunca expone el dato a la app) y devuelve un token opaco que es lo único que la app reenvía al backend Urbania.
- Esto reduce el alcance de cumplimiento de la app al nivel **SAQ A** (el más bajo de PCI-DSS) en vez de SAQ D, porque la app nunca "toca" datos de tarjeta.
- [ ] Verificar que el SDK elegido provee un componente de UI propio (no reinventar un formulario de tarjeta custom).
- [ ] No loguear ni el token de pago ni ningún campo del formulario de pago, ni siquiera en debug.

---

## 7. Logging y Reportes de Crash — Redacción de PII

| Dato | ¿Se envía a Crashlytics/Sentry? |
|---|---|
| `trace_id` de una respuesta de error | Sí — es el dato más útil para correlacionar con el backend |
| Email, nombre, teléfono, unidad | No — usar el `user_id` (UUID) como identificador si es necesario, nunca PII directa |
| Access/Refresh token | Nunca, bajo ninguna circunstancia |
| Código TOTP / código de respaldo MFA | Nunca |
| Stack trace de excepción | Sí (es el propósito de la herramienta) |
| Payload completo de un request fallido | No por defecto — solo el `error.code` y `trace_id`. Si se necesita el payload completo para debug, redactar campos sensibles antes de adjuntar |

```dart
// Ejemplo de hook antes de enviar a Crashlytics
FirebaseCrashlytics.instance.recordError(
  failure,
  stackTrace,
  information: ['trace_id: ${failure.traceId}', 'error_code: ${failure.code}'],
);
```

---

## 8. Hardening del Binario (Builds de Release)

- [ ] `flutter build` en modo `--release` con `--obfuscate --split-debug-info=<dir>` para Android/iOS — ofusca nombres de símbolos Dart.
- [ ] Conservar los archivos de símbolos generados (`split-debug-info`) en un almacenamiento seguro propio (no en el repo público) — necesarios para des-ofuscar stack traces de Crashlytics.
- [ ] R8/ProGuard habilitado en Android (`minifyEnabled true`, `shrinkResources true`) en `build.gradle` de release.
- [ ] Verificar que ninguna API key de terceros (Firebase, pasarela de pago) con privilegios de escritura quede embebida sin restricciones — usar siempre las reglas de seguridad del lado servidor de cada SDK (ej. Firebase App Check) en vez de confiar en que la key esté "oculta".
- [ ] Habilitar **Firebase App Check** para evitar que clientes no genuinos (emuladores, scripts) consuman FCM/Firestore si se usan.

---

## 9. Notificaciones Push y Privacidad de Sesión

- El topic/token de FCM se asocia al `user_id`, nunca al email directamente.
- Al hacer logout o detectar `DEVICE_NOT_RECOGNIZED`, desuscribir el token de FCM del backend (evita que un dispositivo perdido siga recibiendo notificaciones de una cuenta que ya no controla).
- El contenido de notificaciones sensibles (ej. "tu pago fue aprobado", mensajes de chat) se trunca/genera con copy genérico en la notificación visible (lock screen) y el detalle completo solo se muestra dentro de la app ya autenticada/desbloqueada — ver [[DATA_STRATEGY]] §5.

---

## 10. Checklist OWASP MASVS (resumen aplicado al MVP)

> Referencia: OWASP Mobile Application Security Verification Standard (MASVS).

| Categoría MASVS | Control aplicado | Estado |
|---|---|---|
| Almacenamiento (MASVS-STORAGE) | Tokens solo en secure storage (§2), sin PII en logs (§7) | ⬜ |
| Criptografía (MASVS-CRYPTO) | TLS 1.2+ obligatorio, sin crypto propio (delegado al SO y a la pasarela de pago) | ⬜ |
| Autenticación (MASVS-AUTH) | MFA soportado, biometría como capa adicional (§3), manejo correcto de expiración/rotación (§4 API_INTEGRATION) | ⬜ |
| Comunicación de red (MASVS-NETWORK) | Certificate pinning en prod (§5), rechazo de tráfico HTTP plano | ⬜ |
| Plataforma (MASVS-PLATFORM) | Detección root/jailbreak (§4), permisos mínimos necesarios (cámara solo para QR/avatar, no "always") | ⬜ |
| Código (MASVS-CODE) | Obfuscation en release (§8), `flutter_lints` estrictos ([[ARCHITECTURE]] §10) | ⬜ |
| Resiliencia (MASVS-RESILIENCE) | App Check, manejo de dispositivos comprometidos sin bloqueo total injustificado | ⬜ |

> [!tip] Cuándo correr esta checklist
> Marcar cada fila al cerrar la sesión de seguridad correspondiente en [[IMPLEMENTATION_PLAN]] — no al final del proyecto. Igual que el backend, "verificar antes de asumir" ([[../AGENTS|AGENTS]] del API).

---

## 11. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[../JWT_IMPLEMENTATION]] (API) | Fuente única de la seguridad del lado servidor |
| [[API_INTEGRATION]] | Flujos de login/MFA/refresh tal como los ejecuta la app |
| [[DATA_STRATEGY]] | Qué datos sensibles persisten localmente y por cuánto tiempo |
| [[RELEASE_AND_OBSERVABILITY]] | Configuración de Crashlytics, App Check, firma de builds |
