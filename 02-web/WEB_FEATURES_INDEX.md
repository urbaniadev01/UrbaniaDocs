---
title: WEB_FEATURES_INDEX
type: catalogo
tags: [urbania-web, modulos, estado]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-27
---

# 📋 WEB_FEATURES_INDEX
## Catálogo de Módulos del Cliente Web Urbania

> [!info]
> Consultar al agregar o modificar un módulo. Actualizar cada vez que un módulo cambia de
> estado.

> [!important] Fuente de verdad de sesiones
> Los números de sesión en este documento deben coincidir exactamente con
> [[WEB_IMPLEMENTATION_PLAN]]. Si hay discrepancia, el plan manda.

> [!note] Alcance actual
> Este índice registra los módulos del cliente web. Para el diccionario global de features
> (incluyendo API y App), ver [[00-shared/FEATURES_INDEX]].
> No se agrega un módulo hasta que su feature doc esté completo en `00-shared/features/`
> y el contrato de API esté en estado "Diseñado" o superior en [[01-api/API_CONTRACT]].
> El spec técnico web de cada feature vive en `02-web/features/<nombre>/<NOMBRE>_SPEC.md` (ver [[02-web/features/_templates/_TEMPLATE]]).

---

## Estado de Módulos

| #   | Módulo                      | Ruta                              | Prioridad | Estado      | Sesión   | Depende de              |
| --- | --------------------------- | --------------------------------- | --------- | ----------- | -------- | ----------------------- |
| 1   | Auth (Login, MFA, Logout)   | `/login`, `/login/mfa`            | P0        | ✅ Completado | Sesión 1 | API Auth                |
| 2   | Layout + Perfil + Seguridad | `/settings`, `/settings/security` | P0        | ⬜ Pendiente | Sesión 2 | Sesión 1, API Auth      |
| 3   | Propiedades y Unidades      | `/properties`, `/properties/towers`, `/properties/catalogs` | P0 | 📐 Diseñado | — | API Propiedades (§2-§5) |

### Leyenda de estados
| Ícono | Estado |
|-------|--------|
| ⬜ | Pendiente — no iniciado |
| 🔵 | En progreso — sesión actual |
| 🔴 | Bloqueado — `pnpm ci` falla o hay dependencia sin resolver |
| ✅ | Completado — `pnpm ci` pasa, tests cubren el módulo |
| 📐 | Diseñado — docs listos, pendiente de implementar código |

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
**Hooks**: `useLogin`, `useLogout`, `useMfaVerify`, `useMfaVerifyBackup`, `useForgotPassword`, `useResetPassword`, `useVerifyEmail`, `useResendVerification`
**Servicios**: `src/features/auth/api/auth.service.ts` (incluye `silentRefresh()`)
**Infraestructura**: `src/services/api-client.ts` (interceptores), `src/stores/auth.store.ts`,
  `src/app/guards/ProtectedRoute.tsx`, `src/app/guards/AdminOnlyRoute.tsx`,
  headers de seguridad configurados en la capa de hosting (ver [[WEB_AUTH_IMPLEMENTATION]] §11.1)
**API**: `POST /auth/login`, `POST /auth/mfa/verify`, `POST /auth/mfa/verify-backup`,
  `POST /auth/refresh`, `POST /auth/forgot-password`, `POST /auth/reset-password`,
  `POST /auth/verify-email`, `POST /auth/resend-verification`

---

### Propiedades y Unidades (P0) — Diseñado

**Páginas**: `/properties`, `/properties/towers`, `/properties/catalogs`
**Componentes**: `PropertyFilters`, `PropertyForm`, `PropertyStatusForm`, `PropertyDetail`, `TowerForm`, `CatalogForm`, `DocumentList`, `CoefficientSummary`
**Hooks**: `useProperties`, `useProperty`, `useCreateProperty`, `useUpdateProperty`, `useDeleteProperty`, `useChangePropertyStatus`, `useStatusLog`, `useCoefficientValidation`, `useTowers`, `useCreateTower`, `useUpdateTower`, `useDeleteTower`, `usePropertyTypes`, `usePropertyStatuses`, `usePropertyDocuments`, `useUploadDocument`, `useDeleteDocument`
**API**: `GET /properties`, `POST /properties`, `GET /properties/{id}`, `PATCH /properties/{id}`, `DELETE /properties/{id}`, `PATCH /properties/{id}/status`, `GET /properties/{id}/status-log`, `GET /condominiums/{id}/coefficient-validation`, `GET /properties/{id}/documents`, `POST /properties/{id}/documents`, `DELETE /properties/{id}/documents/{docId}`, `GET /condominiums/{id}/towers`, `POST /towers`, `PATCH /towers/{id}`, `DELETE /towers/{id}`, `GET /property-types`, `GET /property-statuses`, `GET /property-document-types`
**Docs**: [[02-web/features/propiedades/PROPIEDADES_SPEC]], [[00-shared/features/PROPIEDADES]]

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

## Checklist al Agregar/Modificar Módulo

- [ ] Verificar que el módulo no existe en este archivo
- [ ] Confirmar que los endpoints del módulo están en [[01-api/API_CONTRACT]]
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
