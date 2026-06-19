---
title: WEB_IMPLEMENTATION_PLAN
type: plan
tags: [urbania-web, sesiones, plan, fuente-unica]
status: vigente
fuente_unica: true
ultima_revision: 2026-06-17
---

# 📅 WEB_IMPLEMENTATION_PLAN
## Plan de Implementación por Sesiones - Cliente Web Urbania

> [!important] Propósito
> Dividir la implementación en sesiones manejables, cada una con entregable funcional y scope
> estricto.

> [!warning] Regla de oro
> Cada sesión termina con `pnpm ci` pasando. Nunca dejar el proyecto roto.

> [!note] Numeración
> Los números de sesión en este plan son la fuente de verdad. El mapa en
> [[WEB_FEATURES_INDEX]] refleja exactamente los mismos números.

---

## Mapa de Sesiones

```
Sesión 1: Setup + Login funcional (el admin puede entrar)
    |
Sesión 2: Layout completo + Perfil + Seguridad (MFA, sesiones)
    |
Sesión 3: Dashboard con métricas reales
    |
Sesión 4: Módulo de Propiedades y Residentes
    |
Sesión 5: Zonas Comunes y Reservas
    |
Sesión 6: Pagos
    |
Sesión 7: PQR
    |
Sesión 8: Registro de Ingresos + Chat + Polish + CI/CD
```

---

## Sesión 1: Setup + Autenticación

**Objetivo**: El admin puede iniciar sesión, pasar por MFA si aplica, y ver el dashboard placeholder.
**Prioridad**: P0 — Bloqueante.
**Dependencias**: API corriendo con módulo Auth completo.

### Documentos requeridos
- [[WEB_SETUP_GUIDE]] (Completo)
- [[WEB_ARCHITECTURE]] (§2 Stack, §4 Estructura)
- [[WEB_AUTH_IMPLEMENTATION]] (Completo)
- [[WEB_VISUAL_STANDARDS]] (§2 Colores, §9 Formularios)
- [[WEB_TESTING]] (§2, §3, §5)

### Tareas
- [ ] Crear proyecto Vite + React + TypeScript y estructura de carpetas ([[WEB_SETUP_GUIDE]] §2-§6)
- [ ] Instalar `next-themes` para modo oscuro ([[WEB_VISUAL_STANDARDS]] §14 — framework-agnóstico)
- [ ] Configurar CSS variables y `@theme inline` de Tailwind v4 ([[WEB_VISUAL_STANDARDS]] §2)
- [ ] Extender Badge con variantes custom ([[WEB_VISUAL_STANDARDS]] §2.4)
- [ ] Configurar Zustand `src/stores/auth.store.ts`
- [ ] Implementar `silentRefresh()` en `src/features/auth/api/auth.service.ts`
- [ ] Configurar Axios `src/services/api-client.ts` con interceptores JWT, silent refresh,
  cola de requests durante refresh y backoff de 429 ([[WEB_AUTH_IMPLEMENTATION]] §3-§4)
- [ ] Documentar headers de seguridad recomendados para la capa de hosting
  ([[WEB_AUTH_IMPLEMENTATION]] §11.1) — no aplica configuración de servidor Node propio
- [ ] Implementar página `/login` con `LoginForm`
- [ ] Implementar flujo MFA: `/login/mfa` con `MfaVerifyForm`
- [ ] Implementar layout protegido con bootstrap y silent refresh
- [ ] Implementar `ProtectedRoute` y `AdminOnlyRoute` en `src/app/guards/`
  ([[WEB_AUTH_IMPLEMENTATION]] §7.1) — reemplaza el middleware de servidor que no existe en una SPA
- [ ] Implementar logout con `useLogout`
- [ ] Placeholder de página `/dashboard` (solo título, sin datos)
- [ ] MSW handlers para auth (solo happy path)
- [ ] Tests de componentes: `LoginForm`, `MfaVerifyForm` (con `server.use()` para errores)
- [ ] Tests e2e: login exitoso, login fallido, login con role 'user' rechazado, MFA, logout

### Entregable
- Admin inicia sesión, pasa MFA, ve dashboard placeholder, cierra sesión
- Silent refresh funciona al recargar la página
- Sesión expirada (cookie eliminada) redirige a login
- `pnpm ci` pasa

### Checklist de cierre de seguridad
- [ ] Access token solo en memoria Zustand (no en localStorage/sessionStorage)
- [ ] Cookie `refresh_token` tiene flags `HttpOnly` y `Secure` (verificar en DevTools)
- [ ] Headers de seguridad documentados para la capa de hosting elegida ([[WEB_SETUP_GUIDE]] §11)
- [ ] Ruta `/dashboard` sin sesión redirige a `/login` (vía `ProtectedRoute`)
- [ ] Usuario con `role !== 'admin'` es rechazado tras login (vía `AdminOnlyRoute`)

---

## Sesión 2: Layout + Perfil + Configuración de Seguridad

**Objetivo**: Layout del dashboard completo. El admin gestiona perfil, contraseña, MFA y sesiones.
**Prioridad**: P0.
**Dependencias**: Sesión 1 completada.

### Documentos requeridos
- [[WEB_ARCHITECTURE]] (§3 Principios de estado, §4.1 Anatomía de feature)
- [[WEB_COMPONENTS]] (§3 Layout, §5 Formularios)
- [[WEB_VISUAL_STANDARDS]] (§4 Layout, §7 Iconos, §9 Formularios, §13 Responsividad)
- [[WEB_API_CLIENT]] (Endpoints Auth: PATCH /me, /mfa/*, /sessions)

### Tareas
- [ ] `DashboardShell`: sidebar colapsable, header con avatar y menú de usuario
- [ ] Sidebar con todos los ítems y estado activo según ruta (`useLocation()`)
- [ ] Iconos asignados por módulo de [[WEB_VISUAL_STANDARDS]] §7.3
- [ ] `PageShell` con título, descripción y slot de acciones
- [ ] `ThemeProvider` y toggle de modo oscuro
- [ ] Hook `useInactivityLogout` (timeout 60min, advertencia a 30min)
- [ ] Página `/settings`: formulario de perfil (nombre, teléfono, avatar)
- [ ] Página `/settings/security`:
  - Cambio de contraseña (`useChangePassword`)
  - Setup/enable/disable MFA (`useMfaSetup`, `useMfaEnable`, `useMfaDisable`)
  - Lista de sesiones activas con revocar (`useSessions`, `useRevokeSession`)
  - Indicador de riesgo por sesión vía `evaluateSessionRisk()` si la API expone geolocalización
    ([[WEB_AUTH_IMPLEMENTATION]] §9.1 — verificar contra `API_CONTRACT.md` primero)
- [ ] Tests de componentes: `SessionList`, `MfaSetupFlow`

### Entregable
- Layout funcional con navegación completa
- Admin gestiona perfil y seguridad desde `/settings`
- `pnpm ci` pasa

### Checklist de cierre
- [ ] Sidebar activo según la ruta actual
- [ ] Sidebar colapsable en md (768px)
- [ ] Inactividad de 60min hace logout automático
- [ ] Al cambiar contraseña, las otras sesiones se revocan (verificar en lista)
- [ ] Backup codes de MFA se muestran solo una vez

---

## Sesión 3: Dashboard

**Objetivo**: El dashboard muestra métricas reales del conjunto.
**Prioridad**: P0.
**Dependencias**: Sesión 2 completada, API Dashboard disponible.

### Documentos requeridos
- [[WEB_COMPONENTS]] (§6 Dashboard)
- [[WEB_API_CLIENT]] (Endpoints de stats, §4 staleTime)
- [[WEB_VISUAL_STANDARDS]] (§2 Colores para charts)

### Tareas
- [ ] Componente `StatsCard` (métrica + tendencia + ícono)
- [ ] Componente `OccupancyChart` (Recharts, barras)
- [ ] Componente `PqrByStatusChart` (Recharts, dona)
- [ ] Componente `RecentPayments` (últimos 5 pagos)
- [ ] Componente `RecentActivity` (últimos eventos)
- [ ] Hook `useDashboardStats` con `staleTime: 60_000` ([[WEB_API_CLIENT]] §4)
- [ ] Skeletons para cada componente
- [ ] Tests de componentes: `StatsCard`, gráficos con datos mock

### Entregable
- Dashboard muestra datos reales
- Todos los componentes tienen loading/error/vacío
- `pnpm ci` pasa

---

## Sesión 4: Propiedades y Residentes

**Objetivo**: El admin gestiona propiedades y residentes.
**Prioridad**: P1.
**Dependencias**: Sesión 3 completada, API Property y User disponibles.

### Documentos requeridos
- [[WEB_COMPONENTS]] (§4 DataTable, ConfirmDialog, StatusBadge, §10 Tablas y bulk actions)
- [[WEB_API_CLIENT]] (Endpoints Properties, Residents)
- [[WEB_VISUAL_STANDARDS]] (§10 Tablas, §9 Formularios)

### Tareas
**Propiedades:**
- [ ] Página `/properties` con `DataTable`
- [ ] Página `/properties/:id` con detalle y lista de unidades
- [ ] `PropertyForm` en Dialog
- [ ] Hooks: `useProperties`, `useProperty`, `useCreateProperty`, `useUpdateProperty`

**Residentes:**
- [ ] Página `/residents` con `DataTable` + filtros, paginación server-side
  ([[WEB_COMPONENTS]] §10.2)
- [ ] Página `/residents/:id` con perfil
- [ ] `ResidentForm` para crear y asignar unidad
- [ ] `StatusBadge` para estados de usuario
- [ ] Hooks: `useResidents`, `useResident`, `useCreateResident`, `useUpdateResident`,
  `useUpdateResidentStatus`
- [ ] Tests de componentes y e2e: crear residente

### Entregable
- Gestión completa de propiedades y residentes
- `pnpm ci` pasa

---

## Sesión 5: Zonas Comunes y Reservas

**Objetivo**: El admin gestiona zonas comunes y reservas.
**Prioridad**: P1.
**Dependencias**: Sesión 4 completada.

### Tareas
**Zonas Comunes:**
- [ ] Página `/common-zones` con listado
- [ ] `ZoneForm` para crear/editar
- [ ] `AvailabilityCalendar`
- [ ] Hooks: `useCommonZones`, `useCreateZone`, `useUpdateZone`, `useZoneAvailability`
  (`staleTime: 10_000` por disponibilidad casi en tiempo real, ver [[WEB_API_CLIENT]] §4)

**Reservas:**
- [ ] Página `/reservations` con tabla + filtros
- [ ] `ReservationForm` para crear a nombre de residente
- [ ] `CancelReservationDialog`
- [ ] `StatusBadge` para estados de reserva
- [ ] Hooks: `useReservations`, `useCreateReservation`, `useUpdateReservationStatus`,
  `useCancelReservation`

### Entregable
- Gestión completa de zonas y reservas
- `pnpm ci` pasa

---

## Sesión 6: Pagos

**Objetivo**: El admin registra y gestiona pagos de cuotas.
**Prioridad**: P1.
**Dependencias**: Sesión 5 completada, API Payment disponible.

### Tareas
- [ ] Página `/payments` con tabla + filtros (estado, mes, año, residente)
- [ ] `PaymentSummaryBar`: recaudado vs pendiente vs vencido del mes
- [ ] `CreatePaymentForm`: registrar cuota
- [ ] Página `/payments/:id`: detalle con cambio de estado
- [ ] `PaymentStatusBadge`
- [ ] Acciones bulk: marcar varios pagos como pagados ([[WEB_COMPONENTS]] §10.3)
- [ ] Print styles para comprobante ([[WEB_VISUAL_STANDARDS]] §15)
- [ ] Hooks: `usePayments`, `usePayment`, `useCreatePayment`, `useUpdatePaymentStatus`,
  `usePaymentSummary`
- [ ] Tests de componentes y e2e: crear pago, cambiar estado, acción bulk

### Entregable
- Gestión completa de pagos
- `pnpm ci` pasa

---

## Sesión 7: PQR

**Objetivo**: El admin gestiona peticiones, quejas y reclamos.
**Prioridad**: P1.
**Dependencias**: Sesión 6 completada, API PQR disponible.

### Tareas
- [ ] Página `/pqr` con tabla + filtros
- [ ] `PqrDetailPanel`: panel lateral con detalle, historial y cambio de estado
- [ ] `PqrTimeline`: historial de cambios
- [ ] `PqrCommentForm`
- [ ] `PqrStatusBadge`
- [ ] Hooks: `usePqrs`, `usePqr`, `useUpdatePqrStatus`, `useAddPqrComment`
- [ ] Tests e2e: cambiar estado de PQR, añadir comentario

### Entregable
- Gestión completa de PQRs
- `pnpm ci` pasa

---

## Sesión 8: Ingresos + Chat + Polish + CI/CD

**Objetivo**: Módulos P2, pulido general y pipeline listo.
**Dependencias**: Sesiones 1-7 completadas.

### Tareas
**Registro de ingresos:**
- [ ] Página `/entry-log` con tabla + filtros
- [ ] `RegisterEntryForm`
- [ ] Tests e2e: registrar ingreso de visitante

**Chat:**
- [ ] Configurar Laravel Echo + Pusher (`src/lib/echo.ts`)
- [ ] Página `/chat` con `ConversationList` + `ChatWindow`
- [ ] Mensajes en tiempo real con `reconnectEcho` tras silent refresh
- [ ] Indicador de mensajes no leídos en sidebar

**Polish:**
- [ ] Revisión de accesibilidad con axe-core en componentes críticos
- [ ] Estados de carga/error en todos los módulos
- [ ] Mobile responsiveness del sidebar y tablas
- [ ] Página de error global y `NotFoundPage` (ruta catch-all `*` en `router.tsx`)
- [ ] Verificar todos los items del checklist visual [[WEB_VISUAL_STANDARDS]] §16

**DevOps / CI/CD:**
- [ ] GitHub Actions: `.github/workflows/ci.yml` ([[WEB_DEVELOPMENT_GUIDE]] §5.3)
  - Jobs: `quality` (type-check, lint, test, build), `e2e` (Playwright), `deploy`
  - Variables de entorno `VITE_*` en secrets de GitHub
- [ ] Configurar SPA fallback en el hosting elegido ([[WEB_SETUP_GUIDE]] §11) — crítico, sin
  esto las rutas anidadas dan 404 al recargar en producción
- [ ] Integrar Sentry si el proyecto pasa a producción ([[WEB_DEVELOPMENT_GUIDE]] §5.4)
- [ ] Cobertura >= umbrales de [[WEB_TESTING]] §4
- [ ] `pnpm ci` pasa localmente
- [ ] Actualizar [[WEB_FEATURES_INDEX]] con todos los módulos en "Completado"
- [ ] [[WEB_SESSION_MANIFEST]] final

### Entregable
- Cliente web completo y funcional
- Pipeline CI verde
- Todos los módulos completados
