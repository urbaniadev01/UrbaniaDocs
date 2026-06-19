---
title: WEB_FEATURES_INDEX
type: catalogo
tags: [urbania-web, modulos, estado]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-17
---

# 📋 WEB_FEATURES_INDEX
## Catálogo de Módulos del Cliente Web Urbania

> [!info]
> Consultar al agregar o modificar un módulo. Actualizar cada vez que un módulo cambia de
> estado.

> [!important] Fuente de verdad de sesiones
> Los números de sesión en este documento deben coincidir exactamente con
> [[WEB_IMPLEMENTATION_PLAN]]. Si hay discrepancia, el plan manda.

---

## Estado de Módulos

| # | Módulo | Ruta | Prioridad | Estado | Sesión | Depende de |
|---|--------|------|-----------|--------|--------|------------|
| 1 | Auth (Login, MFA, Logout) | `/login`, `/login/mfa` | P0 | ⬜ Pendiente | Sesión 1 | API Auth |
| 2 | Layout + Perfil + Seguridad | `/settings`, `/settings/security` | P0 | ⬜ Pendiente | Sesión 2 | Sesión 1, API Auth |
| 3 | Dashboard | `/dashboard` | P0 | ⬜ Pendiente | Sesión 3 | Sesión 2, API Dashboard |
| 4 | Propiedades | `/properties` | P1 | ⬜ Pendiente | Sesión 4 | Sesión 3, API Property |
| 5 | Residentes | `/residents` | P1 | ⬜ Pendiente | Sesión 4 | Sesión 3, API User |
| 6 | Zonas comunes | `/common-zones` | P1 | ⬜ Pendiente | Sesión 5 | Sesión 4, API CommonZone |
| 7 | Reservas | `/reservations` | P1 | ⬜ Pendiente | Sesión 5 | Sesión 4, API Reservation |
| 8 | Pagos | `/payments` | P1 | ⬜ Pendiente | Sesión 6 | Sesión 5, API Payment |
| 9 | PQR | `/pqr` | P1 | ⬜ Pendiente | Sesión 7 | Sesión 6, API PQR |
| 10 | Registro de ingresos | `/entry-log` | P2 | ⬜ Pendiente | Sesión 8 | Sesión 7, API Entry |
| 11 | Chat | `/chat` | P2 | ⬜ Pendiente | Sesión 8 | Sesión 7, API Chat, Pusher |

### Leyenda de estados
| Ícono | Estado |
|-------|--------|
| ⬜ | Pendiente — no iniciado |
| 🔵 | En progreso — sesión actual |
| 🔴 | Bloqueado — `pnpm ci` falla o hay dependencia sin resolver |
| ✅ | Completado — `pnpm ci` pasa, tests cubren el módulo |

---

## Definición de Prioridades

- **P0**: Bloqueante para el MVP. Sin esto no hay cliente funcional.
- **P1**: Core functionality. Necesario para lanzamiento.
- **P2**: Value-add. Puede esperar a post-lanzamiento.

---

## Detalle de Módulos

> [!note] Convención de rutas dinámicas
> Todas las rutas con parámetro usan la notación de React Router `:id`, no la notación de
> Next.js `[id]`. Ver [[WEB_ARCHITECTURE]] §4.

### Auth (P0) — Sesión 1
**Páginas**: `/login`, `/login/mfa`, `/forgot-password`, `/reset-password`
**Componentes**: `LoginForm`, `MfaVerifyForm`, `ForgotPasswordForm`, `ResetPasswordForm`
**Hooks**: `useLogin`, `useLogout`, `useMfaVerify`, `useForgotPassword`, `useResetPassword`
**Servicios**: `src/features/auth/api/auth.service.ts` (incluye `silentRefresh()`)
**Infraestructura**: `src/services/api-client.ts` (interceptores), `src/stores/auth.store.ts`,
  `src/app/guards/ProtectedRoute.tsx`, `src/app/guards/AdminOnlyRoute.tsx`,
  headers de seguridad configurados en la capa de hosting (ver [[WEB_AUTH_IMPLEMENTATION]] §11.1)
**API**: `POST /auth/login`, `POST /auth/mfa/verify`, `POST /auth/refresh`,
  `POST /auth/forgot-password`, `POST /auth/reset-password`

---

### Layout + Configuración (P0) — Sesión 2
**Páginas**: `/settings`, `/settings/security`
**Componentes**: `DashboardShell`, `Sidebar`, `PageShell`, `ProfileForm`, `MfaSetupFlow`,
  `SessionList`, `ChangePasswordForm`, `ThemeProvider`
**Hooks**: `useUpdateProfile`, `useMfaSetup`, `useMfaEnable`, `useMfaDisable`,
  `useSessions`, `useRevokeSession`, `useRevokeAllSessions`, `useChangePassword`,
  `useInactivityLogout`
**API**: `PATCH /auth/me`, `POST /auth/mfa/setup`, `POST /auth/mfa/enable`,
  `POST /auth/mfa/disable`, `GET /auth/sessions`, `DELETE /auth/sessions/{id}`

---

### Dashboard (P0) — Sesión 3
**Páginas**: `/dashboard`
**Componentes**: `StatsCard`, `OccupancyChart`, `PqrByStatusChart`, `RecentPayments`,
  `RecentActivity`
**Hooks**: `useDashboardStats`
**Datos**: Unidades ocupadas/disponibles, pagos del mes, PQRs por estado, actividad reciente

---

### Propiedades (P1) — Sesión 4
**Páginas**: `/properties`, `/properties/:id`
**Componentes**: `PropertyCard`, `PropertyForm`, `UnitList`, `UnitAssignForm`
**Hooks**: `useProperties`, `useProperty`, `useCreateProperty`, `useUpdateProperty`, `useUnits`

---

### Residentes (P1) — Sesión 4
**Páginas**: `/residents`, `/residents/:id`
**Componentes**: `ResidentTable`, `ResidentForm`, `ResidentDetail`
**Hooks**: `useResidents`, `useResident`, `useCreateResident`, `useUpdateResident`,
  `useUpdateResidentStatus`

---

### Zonas Comunes (P1) — Sesión 5
**Páginas**: `/common-zones`, `/common-zones/:id`
**Componentes**: `ZoneCard`, `ZoneForm`, `AvailabilityCalendar`
**Hooks**: `useCommonZones`, `useCommonZone`, `useCreateZone`, `useUpdateZone`,
  `useZoneAvailability`

---

### Reservas (P1) — Sesión 5
**Páginas**: `/reservations`
**Componentes**: `ReservationTable`, `ReservationForm`, `CancelReservationDialog`
**Hooks**: `useReservations`, `useCreateReservation`, `useUpdateReservationStatus`,
  `useCancelReservation`

---

### Pagos (P1) — Sesión 6
**Páginas**: `/payments`, `/payments/:id`
**Componentes**: `PaymentTable`, `CreatePaymentForm`, `PaymentDetail`, `PaymentSummaryBar`
**Hooks**: `usePayments`, `usePayment`, `useCreatePayment`, `useUpdatePaymentStatus`,
  `usePaymentSummary`
**Funcionalidades adicionales**: Print styles para comprobante ([[WEB_VISUAL_STANDARDS]] §15),
  acciones bulk de cambio de estado ([[WEB_COMPONENTS]] §10.3)

---

### PQR (P1) — Sesión 7
**Páginas**: `/pqr`, `/pqr/:id`
**Componentes**: `PqrTable`, `PqrDetailPanel`, `PqrCommentForm`, `PqrTimeline`
**Hooks**: `usePqrs`, `usePqr`, `useUpdatePqrStatus`, `useAddPqrComment`

---

### Registro de Ingresos (P2) — Sesión 8
**Páginas**: `/entry-log`
**Componentes**: `EntryTable`, `RegisterEntryForm`
**Hooks**: `useEntries`, `useRegisterEntry`

---

### Chat (P2) — Sesión 8
**Páginas**: `/chat`
**Componentes**: `ConversationList`, `ChatWindow`, `MessageBubble`, `MessageInput`
**Hooks**: `useConversations`, `useMessages`, `useSendMessage`
**Integración**: Laravel Echo + Pusher (`src/lib/echo.ts`)
**Funcionalidades**: Tiempo real, indicador mensajes no leídos, historial paginado

---

## Checklist al Agregar/Modificar Módulo

- [ ] Verificar que el módulo no existe en este archivo
- [ ] Confirmar que los endpoints del módulo están en `API_CONTRACT.md`
- [ ] Crear la carpeta `src/features/<modulo>/` con subcarpetas `api/`, `hooks/`,
  `components/`, `pages/`, `types/` (ver [[WEB_ARCHITECTURE]] §4.1)
- [ ] Definir tipos TypeScript en `src/features/<modulo>/types/<modulo>.types.ts`
- [ ] Crear servicio en `src/features/<modulo>/api/<modulo>.service.ts`
- [ ] Crear hooks de TanStack Query en `src/features/<modulo>/hooks/use-<modulo>.ts`
- [ ] Crear componentes en `src/features/<modulo>/components/`
- [ ] Verificar checklist visual de [[WEB_VISUAL_STANDARDS]] §16
- [ ] Crear páginas en `src/features/<modulo>/pages/` y registrarlas con lazy loading en
  `src/app/router.tsx`
- [ ] Añadir ítem al Sidebar si es página de primer nivel
- [ ] Crear tests de componentes y e2e si aplica
- [ ] Ejecutar `pnpm type-check`, `pnpm lint`, `pnpm test`
- [ ] Actualizar este archivo a "✅ Completado" (solo si `pnpm ci` pasa)
- [ ] Actualizar [[WEB_SESSION_MANIFEST]]
