---
type: meta
status: active
priority: P0
module: mobile
tags: [plan, sessions, mobile]
updated: 2026-06-18
---

# 📋 IMPLEMENTATION_PLAN (App Móvil)
## Plan de Implementación Incremental por Sesiones

> [!info] Consultar
> Antes de cualquier tarea, para identificar la sesión actual y su alcance.

---

## Principios del Plan

1. **Slice vertical primero, ancho después**: la Sesión 1 produce algo ejecutable de punta a punta (app que arranca, llama al `/health` del API, muestra el resultado) antes de construir cualquier feature de negocio completa.
2. **Auth es el único módulo de negocio con contrato de API real hoy.** El resto del plan (Reservas, Visitas, Pagos, Chat) depende de que [[01-api/API_CONTRACT]] del backend incorpore esos módulos — ver [[APP_FEATURE_SCOPE]]. Este plan no asume fechas para eso; cuando el backend defina un módulo nuevo, se agrega una sesión nueva aquí siguiendo el mismo patrón.
3. **No bloquear UI esperando al backend**: las sesiones de infraestructura offline/sync (Sesión 7) se construyen contra un mock server basado en el contrato esperado (ver [[APP_TESTING]] §4), para que el equipo móvil avance en paralelo al de backend.
4. **Seguridad y accesibilidad no son una fase final**: se verifican al cierre de cada sesión que toque UI o datos sensibles, no se acumulan para el final.

---

## Mapa de Sesiones

| # | Nombre | Prioridad | Depende de |
|---|---|---|---|
| 1 | Setup + Design System Base + Slice Vertical Mínimo | P0 | SETUP_GUIDE del backend (API corriendo) |
| 2 | Domain Layer Auth | P0 | Sesión 1 |
| 3 | Data Layer Auth + Cliente HTTP | P0 | Sesión 2, [[01-api/endpoints/AUTH]] |
| 4 | Presentation Layer Auth (Login/Registro/Recuperación) | P0 | Sesión 3 |
| 5 | MFA + Gestión de Sesiones + Biometría | P0 | Sesión 4 |
| 6 | Hardening de Seguridad | P0 | Sesión 5 |
| 7 | Infraestructura de Datos Offline/Sync | P1 | Sesión 3 (cliente HTTP ya existe) |
| 8 | Testing Completo + CI/CD + Observabilidad | P0 | Sesiones 1-6 |
| 9 | Accesibilidad + Polish + Preparación de Release P0 | P0 | Sesión 8 |
| 10+ | Módulos de negocio (Reservas, Visitas, Pagos, Chat) | P1/P2 | Backend define el contrato correspondiente |

---

## Sesión 1: Setup + Design System Base + Slice Vertical Mínimo

### Documentos requeridos
[[APP_SETUP_GUIDE]], [[APP_ARCHITECTURE]], [[APP_DESIGN_SYSTEM]]

### Tareas
- [ ] Crear proyecto Flutter con estructura de carpetas de [[APP_ARCHITECTURE]] §2
- [ ] Configurar flavors (dev/staging/prod)
- [ ] Configurar tokens base de [[APP_DESIGN_SYSTEM]] (`ColorScheme.fromSeed`, espaciado, tipografía)
- [ ] Implementar `core/network/api_client.dart` mínimo (sin auth aún) y consumir `GET /health`
- [ ] Pantalla de splash que muestra el resultado del health check

### Entregable
App que compila en Android e iOS, muestra una pantalla con el estado del health check del backend.

### Checklist de cierre
- [ ] `flutter analyze` sin errores
- [ ] Decisión de flavors documentada en [[APP_DEVELOPMENT_GUIDE]]
- [ ] [[APP_SESSION_MANIFEST]] actualizado

---

## Sesión 2: Domain Layer Auth

### Documentos requeridos
[[APP_ARCHITECTURE]] §6-7, [[01-api/endpoints/AUTH]]

### Tareas
- [ ] `UserEntity`, `SessionEntity` en `features/auth/domain/entities/`
- [ ] `AuthRepository` (interfaz) en `features/auth/domain/`
- [ ] `sealed class Failure` y subtipos en `core/error/failure.dart`
- [ ] Value objects mínimos (`Email`, `UserId`) si aportan validación útil en cliente

### Entregable
Capa de dominio de Auth completa, testeada sin Flutter binding.

### Checklist de cierre
- [ ] Cobertura de `domain/` ≥90% (ver [[APP_TESTING]] §5)
- [ ] Ningún import de Flutter/Dio/Drift en `domain/`

---

## Sesión 3: Data Layer Auth + Cliente HTTP

### Documentos requeridos
[[APP_API_INTEGRATION]], [[APP_SECURITY]] §2

### Tareas
- [ ] DTOs (`freezed`) de login, registro, refresh, me — alineados 1:1 con [[01-api/endpoints/AUTH]]
- [ ] `AuthInterceptor`: inyección de `Authorization`, manejo de `User-Agent` (ver [[APP_API_INTEGRATION]] §2 — **crítico**), silent refresh con mutex (§4)
- [ ] `SecureTokenStorage` (`flutter_secure_storage`)
- [ ] `AuthRepositoryImpl` implementando la interfaz de Sesión 2
- [ ] Mock server de Auth para tests de integración (ver [[APP_TESTING]] §4)

### Entregable
Login funcional contra el backend real (sin UI pulida aún), tokens persistidos correctamente.

### Checklist de cierre
- [ ] Verificado manualmente: el refresh token emitido dura 30 días (no 7) — confirma que el `User-Agent` se está enviando correctamente
- [ ] Tokens nunca aparecen en logs de consola

---

## Sesión 4: Presentation Layer Auth

### Documentos requeridos
[[APP_DESIGN_SYSTEM]], [[APP_ACCESSIBILITY]], [[APP_API_INTEGRATION]] §3

### Tareas
- [ ] `LoginScreen`, `RegisterScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen`
- [ ] `AuthStateProvider` (Riverpod) consumido por `app_router.dart` para redirects
- [ ] Mapeo completo de `error.code` → UI (tabla de [[APP_API_INTEGRATION]] §3)
- [ ] Deep link de verificación de email y de reset de contraseña

### Entregable
Flujo completo de autenticación (sin MFA todavía) navegable de punta a punta.

### Checklist de cierre
- [ ] Checklist de [[APP_DESIGN_SYSTEM]] §6 aplicado a cada pantalla
- [ ] Checklist de [[APP_ACCESSIBILITY]] §8 aplicado a cada pantalla
- [ ] Widget tests de cada pantalla (loading/data/error)

---

## Sesión 5: MFA + Gestión de Sesiones + Biometría

### Documentos requeridos
[[01-api/API_JWT_IMPLEMENTATION]] §7, [[APP_SECURITY]] §3

### Tareas
- [ ] `MfaVerificationScreen` (TOTP + código de respaldo)
- [ ] `ActiveSessionsScreen` (`GET /auth/sessions`, revocar individual y "cerrar todas")
- [ ] Configuración MFA desde `ProfileScreen` (`/auth/mfa/setup`, `/enable`, `/disable`, `/backup-codes`)
- [ ] Desbloqueo biométrico al reabrir la app con sesión existente

### Entregable
Flujo de login con MFA completo; usuario puede gestionar sus dispositivos y biometría.

### Checklist de cierre
- [ ] Probado con al menos 2 apps TOTP distintas (igual exigencia que el backend, [[01-api/API_JWT_IMPLEMENTATION]] §9)
- [ ] Degradación correcta en dispositivo sin hardware biométrico

---

## Sesión 6: Hardening de Seguridad

### Documentos requeridos
[[APP_SECURITY]] completo

### Tareas
- [ ] Certificate pinning en flavors `staging`/`prod`
- [ ] Detección de root/jailbreak + decisión de bloqueo parcial
- [ ] Obfuscation configurado en build de release
- [ ] Redacción de PII en hooks de Crashlytics
- [ ] Firebase App Check habilitado

### Entregable
Checklist OWASP MASVS de [[APP_SECURITY]] §10 completamente marcado.

### Checklist de cierre
- [ ] Build de release generado con `--obfuscate --split-debug-info`
- [ ] Pinning probado: una conexión con certificado distinto al pineado falla como se espera

---

## Sesión 7: Infraestructura de Datos Offline/Sync

### Documentos requeridos
[[APP_DATA_STRATEGY]] completo

### Tareas
- [ ] Esquema Drift base (`local_announcements`, `sync_queue`, etc. — aunque los endpoints reales aún no existan, se construye contra el mock server)
- [ ] `connectivityProvider` + `OfflineBanner`
- [ ] Mecanismo genérico de cola de sincronización con reintento/backoff

### Entregable
Infraestructura offline reutilizable, lista para conectarse a Reservas/Visitas en cuanto el backend defina esos contratos.

### Checklist de cierre
- [ ] Limpieza completa de tablas Drift verificada en logout (test de integración)

---

## Sesión 8: Testing Completo + CI/CD + Observabilidad

### Documentos requeridos
[[APP_TESTING]], [[APP_RELEASE_AND_OBSERVABILITY]]

### Tareas
- [ ] Golden tests de `core/widgets/` y pantallas de Auth
- [ ] Flujos de integración (Patrol) de la lista de [[APP_TESTING]] §3.4
- [ ] Pipeline de CI (`flutter analyze` + `flutter test` + build de `staging`)
- [ ] Firebase Crashlytics/Analytics/Performance verificados en `staging`

### Entregable
Pipeline verde de extremo a extremo, cobertura cumpliendo [[APP_TESTING]] §5.

### Checklist de cierre
- [ ] `composer ci`-equivalente del móvil (`flutter analyze && flutter test && flutter build appbundle --flavor staging`) corre sin intervención manual

---

## Sesión 9: Accesibilidad + Polish + Preparación de Release P0

### Documentos requeridos
[[APP_ACCESSIBILITY]], [[APP_RELEASE_AND_OBSERVABILITY]] §4

### Tareas
- [ ] Auditoría completa con TalkBack y VoiceOver de todos los flujos P0
- [ ] Checklist OWASP MASVS y de diseño revisados una última vez de forma cruzada (no solo por quien implementó)
- [ ] Ficha de privacidad de cada tienda completada (Data Safety / App Privacy)
- [ ] Beta interna vía TestFlight / Play Internal Testing

### Entregable
Build candidato a producción (P0: Auth + Perfil + infraestructura) listo para revisión de tiendas.

### Checklist de cierre
- [ ] [[APP_SESSION_MANIFEST]] actualizado con versión exacta del release candidato
- [ ] Documentar en [[APP_DEVELOPMENT_GUIDE]] cualquier issue encontrado en la auditoría de accesibilidad/seguridad final

---

## Sesiones 10+: Módulos de Negocio

Cada módulo nuevo (Reservas, Visitas, Pagos, Chat, PQRS — ver [[APP_FEATURE_SCOPE]] §3) se planea como una sesión nueva **solo cuando el backend correspondiente esté "Diseñado" en [[01-api/API_CONTRACT]]**, siguiendo esta plantilla:

```
## Sesión N: <Módulo>
### Documentos requeridos
[[01-api/API_CONTRACT]] §<sección del módulo>, [[APP_FEATURE_SCOPE]], [[APP_DATA_STRATEGY]]
### Tareas
- [ ] Domain + Data + Presentation del módulo (mismo patrón de Sesiones 2-4)
- [ ] Clasificar el módulo en la tabla de DATA_STRATEGY §1 si no estaba ya
- [ ] Tests unit/widget/integración del módulo
### Entregable
### Checklist de cierre
```

---

## Session Manifest Template

Ver [[APP_SESSION_MANIFEST]] — se actualiza al cierre de cada sesión con el mismo rigor que exige el backend ([[01-api/API_AGENTS|AGENTS]] del API, Regla de Oro #11).

---

## Reglas de Oro para el Orchestrator

1. No iniciar una sesión de negocio (10+) sin confirmar que el contrato del backend correspondiente ya está "Diseñado", no solo "propuesto" en [[APP_FEATURE_SCOPE]].
2. Verificar antes de asumir: si se retoma una sesión interrumpida, correr `flutter analyze && flutter test` antes de continuar, igual que el backend exige `composer test` ([[01-api/API_AGENTS|AGENTS]] del API, "Regla Crítica: Verify Before Assume").
3. Seguridad y accesibilidad se verifican al cierre de **cada** sesión que toque UI o datos sensibles, no se posponen a la Sesión 9.
4. Si se encuentra una inconsistencia entre este plan y el contrato real del backend, se reporta e informa antes de seguir adelante (mismo principio que [[01-api/API_AGENTS|AGENTS]] del API).

---

## Referencias

| Documento | Propósito |
|---|---|
| [[APP_AGENTS]] | Navegación y reglas de oro |
| [[APP_ARCHITECTURE]] | Stack y estructura |
| [[APP_FEATURE_SCOPE]] | Qué se construye y en qué orden de negocio |
| [[APP_SESSION_MANIFEST]] | Estado actual entre sesiones |
