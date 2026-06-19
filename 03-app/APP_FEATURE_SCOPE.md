---
type: reference
status: active
priority: P0
module: mobile
tags: [product, features, scope, mobile]
updated: 2026-06-18
---

# 🧭 FEATURE_SCOPE
## Mapa de Producto y Alcance Funcional de Urbania App

> [!info] Consultar
> Antes de iniciar cualquier sesión nueva de [[APP_IMPLEMENTATION_PLAN]], para confirmar prioridad y dependencias del módulo de negocio que se va a tocar.

> [!warning] Sobre los endpoints de negocio
> Hoy `API_CONTRACT.md` del backend **solo** documenta Auth + Health Check ([[01-api/API_AGENTS|AGENTS]] del API: "Describe la base técnica del proyecto y el módulo Auth, exclusivamente"). Todo lo de este documento que no sea Auth/Perfil es **diseño de producto adelantado** para guiar arquitectura del cliente — el contrato real de cada módulo se define en `API_CONTRACT.md` cuando el backend lo inicie, siguiendo el mismo patrón que ya usa Auth. Este documento no inventa contratos de API; donde se necesite uno para razonar sobre la app, se marca explícitamente como **(propuesto, pendiente de diseño en backend)**.

---

## 1. Visión de Producto

Urbania App es el cliente móvil del sistema Urbania de administración de propiedades horizontales (Colombia). Debe cubrir las funciones operativas básicas de cualquier app de este tipo (autenticación, avisos, reservas, visitas, pagos) y diferenciarse con funciones que generen retención y uso frecuente (chat, comunidad, gamificación ligera) — sin convertir la app en algo más complejo de lo que el dominio justifica.

---

## 2. Priorización (P0 → P3)

| Prioridad | Significado |
|---|---|
| **P0** | Indispensable para lanzar — sin esto la app no es viable |
| **P1** | Funciones operativas centrales del dominio (lo que un usuario espera de cualquier app de administración residencial) |
| **P2** | Diferenciadores de experiencia (tiempo real, conveniencia) |
| **P3** | Funciones de engagement/retención — se evalúan con datos de uso real de P0-P2 antes de invertir esfuerzo completo |

---

## 3. Mapa de Funcionalidades

### P0 — Fundacional

| Feature | Pantallas | Estado del API |
|---|---|---|
| Autenticación (login, registro, MFA, recuperación de contraseña) | `LoginScreen`, `RegisterScreen`, `MfaVerificationScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen` | ✅ Diseñado en `API_CONTRACT.md` §1 |
| Gestión de sesión (ver/revocar dispositivos) | `ActiveSessionsScreen` | ✅ Diseñado (`/auth/sessions`) |
| Perfil de usuario | `ProfileScreen`, `EditProfileScreen`, `ChangePasswordScreen` | ✅ Diseñado (`/auth/me`) |
| Onboarding / Splash con verificación de sesión + biometría | `SplashScreen`, `OnboardingScreen` | N/A (lógica de cliente) |
| Verificación de email | Flujo deep-link desde correo | ✅ Diseñado (`/auth/verify-email`) |

### P1 — Operación Central del Dominio

| Feature | Pantallas | Estado del API |
|---|---|---|
| Avisos / Anuncios de la administración | `AnnouncementsListScreen`, `AnnouncementDetailScreen` | Pendiente de diseño en backend |
| Reservas de zonas comunes | `CommonAreasListScreen`, `ReservationCalendarScreen`, `MyReservationsScreen` | Pendiente de diseño en backend (la tabla `common_zones` ya aparece como ejemplo en `DATABASE.md` del API, sugiere que es el siguiente módulo natural) |
| Registro y control de visitas | `RegisterVisitScreen`, `VisitsHistoryScreen`, vista para portería/seguridad (posible app o rol distinto — a confirmar con negocio si portería usa esta misma app con rol limitado o una app/panel separado) | Pendiente de diseño en backend |
| Pagos de administración | `PaymentsHomeScreen`, `PaymentDetailScreen`, `PaymentHistoryScreen`, `PaymentMethodsScreen` | Pendiente de diseño en backend — ver [[APP_SECURITY]] §6 para restricciones de cumplimiento |
| PQRS (peticiones, quejas, reclamos, sugerencias) | `PqrsListScreen`, `NewPqrsScreen`, `PqrsDetailScreen` | Pendiente de diseño en backend |
| Directorio / Información del conjunto | `BuildingInfoScreen` (reglamento, contactos de administración, horarios) | Pendiente de diseño en backend |

### P2 — Tiempo Real y Conveniencia

| Feature | Pantallas | Notas técnicas |
|---|---|---|
| Notificaciones push centralizadas | `NotificationsCenterScreen` | Ver [[APP_DATA_STRATEGY]] §5 |
| Chat (con administración y/o entre vecinos, a definir alcance) | `ChatListScreen`, `ConversationScreen` | Ver [[APP_DATA_STRATEGY]] §6 — requiere decisión de producto: ¿chat 1:1 con administración únicamente (más simple, menor riesgo de moderación) o también vecino-a-vecino (mayor engagement, requiere moderación/reporte de abuso)? |
| Modo sin conexión visible (banners, indicadores de sincronización) | Transversal | Ver [[APP_DATA_STRATEGY]] §2, §4 |
| Widget de inicio rápido (Android/iOS home screen widget) | N/A | Ej. próximo pago, próxima visita agendada — alto valor percibido de "app que no hay que abrir para saber algo" |

### P3 — Engagement y Retención (evaluar con datos antes de construir completo)

| Idea | Justificación |
|---|---|
| Encuestas / votaciones de la copropiedad | Aumenta participación, dato de valor real para la administración (no es "gamificación vacía") |
| Calendario de eventos comunitarios | Retención mediante utilidad real, no mecánica artificial |
| Marketplace interno (clasificados entre vecinos) | Alto potencial de uso frecuente, pero introduce superficie de riesgo nueva (transacciones entre particulares, moderación de contenido) — evaluar como proyecto independiente, no como "feature más" |
| Indicadores de "buen vecino" (pagos puntuales, sin quejas) | Cuidado: cualquier gamificación que exponga comportamiento de pago de un residente a otros tiene implicaciones de privacidad serias — si se hace, debe ser **opt-in** y nunca comparar usuarios entre sí públicamente |
| Reconocimiento facial / control de acceso vía app (QR dinámico para visitantes) | Diferenciador fuerte de mercado, pero es esencialmente un proyecto de seguridad física — requiere análisis de amenazas propio antes de comprometerse en el roadmap |

> [!warning] Disciplina de alcance
> P3 existe para que el equipo no sienta presión de meter "funciones de engagement" dentro de las sesiones P0/P1 de [[APP_IMPLEMENTATION_PLAN]]. Ninguna idea de P3 se implementa antes de que P0+P1 estén estables en producción con usuarios reales.

---

## 4. Pagos: Consideraciones de Producto

- Pasarela candidata: Wompi o PayU (decisión de negocio, ver [[APP_ARCHITECTURE]] §1 ADR-M006).
- Métodos esperados en el mercado colombiano: tarjeta de crédito/débito, PSE (transferencia bancaria), posiblemente Nequi/Bancolombia a Bancolombia — confirmar con la pasarela elegida cuáles soporta nativamente vía SDK.
- Conciliación: el estado de "pagado" mostrado en la app **siempre** viene de una consulta al backend (online-only, [[APP_DATA_STRATEGY]] §1), nunca del callback del SDK de pago directamente — el backend es quien confirma con la pasarela vía webhook antes de marcar la cuenta como pagada.

---

## 5. Navegación de Alto Nivel (Bottom Nav, P1 en adelante)

```
Home (resumen: próximo pago, próxima visita, últimos avisos)
├── Reservas / Visitas
├── Pagos
├── Chat
└── Perfil (incluye Notificaciones, Sesiones activas, Configuración)
```

---

## 6. Deep Links Requeridos

| Origen | Destino |
|---|---|
| Email de verificación | `RegisterVerifiedScreen` vía `/auth/verify-email?token=...` |
| Email de recuperación de contraseña | `ResetPasswordScreen` vía `/auth/reset-password?token=...` |
| Notificación push de chat | `ConversationScreen` con `conversation_id` |
| Notificación push de pago | `PaymentDetailScreen` con `payment_id` |
| Notificación push de aviso | `AnnouncementDetailScreen` con `announcement_id` |

---

## 7. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_ARCHITECTURE]] | Cómo se estructura cada feature en código |
| [[APP_DATA_STRATEGY]] | Estrategia de datos detrás de cada feature de esta tabla |
| [[APP_DESIGN_SYSTEM]] | Sistema visual con el que se construyen estas pantallas |
| [[APP_IMPLEMENTATION_PLAN]] | Secuenciación real en sesiones de desarrollo |
