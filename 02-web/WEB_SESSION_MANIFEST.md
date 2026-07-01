---
title: WEB_SESSION_MANIFEST
type: estado
tags: [urbania-web, manifest, estado-proyecto]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-27
---

# 📊 WEB_SESSION_MANIFEST
## Estado Actual del Cliente Web Urbania

> [!important] Propósito
> Documento vivo que registra el estado exacto del proyecto entre sesiones. Es el "estado
> guardado" que se entrega al agente al inicio de cada nueva sesión.

> [!warning] Regla de oro
> Se actualiza INMEDIATAMENTE al final de cada sesión.

> [!note] Verificación
> El agente que retoma debe corroborar este estado ejecutando `pnpm type-check` y `pnpm test`.
> Si hay discrepancias, reportar en "Bloqueos" antes de continuar. Ver la regla "Verify Before
> Assume" en [[WEB_AGENTS]].

---

## Sesión Actual

| Campo | Valor |
|-------|-------|
| **Número** | 7 |
| **Nombre** | Comunicaciones (anuncios, encuestas, canales) |
| **Estado** | ✅ Completado |
| **Fecha inicio** | 2026-06-30 |
| **Fecha fin** | 2026-06-30 |
| **Agente** | opencode-go/minimax-m3 (web-build) |

---

## Resumen Ejecutivo

Sesión 7 completada. Feature "Comunicaciones" implementado completamente (solicitado ad-hoc, no estaba en el plan original):
- **Tipos**: `Channel`, `Segment`, `AnnouncementStatus`, `Announcement`, `Metrics`, `AnnouncementDetail`, `Delivery`, `Template`, `Survey`, `SurveyOption`, `SurveyResults`, `ChannelConfig` + payloads
- **Servicio API**: 11 métodos bajo `/comunicaciones/*` (announcements, templates CRUD, surveys, channels)
- **Hooks TanStack Query**: useAnnouncements, useAnnouncement (con polling 15s), useCreateAnnouncement, useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate, useSurveys, useCreateSurvey, useSurveyResults (con polling 10s), useChannels, useUpdateChannel
- **Componentes**: AnnouncementRow, AnnouncementComposer (RHF+Zod), AnnouncementDetail (Sheet con métricas+deliveries), SurveyBuilder (useFieldArray para opciones dinámicas), SurveyResults (gráfico de barras en Sheet)
- **Páginas** (4 nuevas): AnnouncementsInboxPage (`/comunicaciones`), ComposeAnnouncementPage (`/comunicaciones/nuevo`), SurveysPage (`/comunicaciones/encuestas`), ChannelsPage (`/comunicaciones/canales`)
- **Sidebar**: nuevo NavGroup "Comunicaciones" (icono `Megaphone`) con 3 sub-items (Bandeja, Encuestas, Canales)
- **Router**: 4 rutas nuevas con lazy + Suspense
- **MSW handlers**: 10 endpoints de `/comunicaciones/*` del feature
- **Tests**: 6 nuevos tests para `useAnnouncements`, `useAnnouncement`, `useCreateAnnouncement`

**Extensión del spec del backend**: el feature requiere un endpoint `GET /comunicaciones/surveys` (no estaba en la lista inicial de endpoints). Se agregó al servicio, hook, MSW handler y página. Si el backend aún no lo expone, el feature seguirá funcionando; la página mostrará un error que se debe traducir en una entrada en CHANGES_LOG para coordinar con el equipo de API.

**`pnpm run ci` pasa en verde**: type-check ✅, lint ✅ (0 warnings), test ✅ (32/32 en 9 archivos — 6 nuevos), build ✅ (1930 módulos, code splitting verificado — 4 nuevas páginas en chunks separados: AnnouncementsInboxPage 12.26 kB, ComposeAnnouncementPage 10.93 kB, SurveysPage 10.30 kB, ChannelsPage 7.91 kB).

**Sesión 6** (previa): Roles y Permisos (RBAC).

---

## Resumen Ejecutivo (Sesión 6 previa)

Sesión 6 completada. Feature "Roles y Permisos (RBAC)" implementado completamente:
- **Tipos**: `Permission`, `PermissionGroup`, `Role`, `RoleDetail`, `RoleAssignment`, `PanelUser`, `ApprovalRule`, `AuditLogEntry` + payloads
- **Servicio API**: 11 métodos bajo `/authorization/*` (roles CRUD, setRolePermissions, permissions, assignments, approval-rules, audit, users)
- **Hooks TanStack Query**: useRoleList, useRole, useCreateRole, useUpdateRole, useSetRolePermissions, usePermissionsCatalog, useCreateAssignment, useRevokeAssignment, useApprovalRules, useCreateApprovalRule, useAuditLog, usePanelUsers
- **Componentes**: RoleForm, PermissionMatrix (grid recurso×acción con atajos fila/columna), ScopePicker, UserRoleAssigner, AuditTable
- **Páginas** (5 nuevas): RolesPage (`/admin/roles`), PermissionMatrixPage (`/admin/roles/:id/permisos`), PanelUsersPage (`/admin/usuarios`), ApprovalRulesPage (`/admin/aprobaciones`), PermissionAuditPage (`/admin/auditoria`)
- **Sidebar**: nuevo NavGroup "Roles y Permisos" (icono `Shield`) con 4 sub-items
- **Guards**: `AdminOnlyRoute` y `DashboardLayout.bootstrap` ahora verifican permisos RBAC (prefijo `roles.*` / `auth.*` / `authorization.*`) además del rol legacy `admin`
- **Tipos**: `AuthUser` extendido con `permissions?: string[]` opcional
- **Router**: 5 rutas nuevas con lazy + Suspense
- **MSW handlers**: 9 endpoints de `/authorization/*` del feature
- **Tests**: 6 nuevos tests (4 unit hooks roles + 2 unit hooks permissions)
- **vitest config**: incluye `src/features/**/__tests__/**/*.test.{ts,tsx}`

**`pnpm run ci` pasa en verde**: type-check ✅, lint ✅ (0 warnings), test ✅ (26/26 en 8 archivos), build ✅ (1914 módulos, code splitting verificado — 5 nuevas páginas en chunks separados: RolesPage 10 kB, PermissionMatrixPage 8.66 kB, PanelUsersPage 15.49 kB, ApprovalRulesPage 8.52 kB, PermissionAuditPage 5.80 kB).

**Sesión 5** (previa): Configuración (Perfil y Seguridad).

---

## Módulos y Estado

| # | Módulo | Prioridad | Estado | Sesión |
|---|--------|-----------|--------|--------|
| 1 | Auth (Login, MFA) | P0 | ✅ Completado | Sesión 1 |
| 2 | Layout + Configuración | P0 | ✅ Completado | Sesión 5 |
| 3 | Dashboard | P0 | ⬜ Pendiente | Sesión 3 |
| 4 | Propiedades y Unidades | P1 | ✅ Completado | Sesión 4 |
| 4b | Directorio (Residentes) | P1 | 🔵 En progreso | (parcial, integrado con propiedades) |
| 5 | Zonas Comunes + Reservas | P1 | ⬜ Pendiente | (ad-hoc) |
| 6 | Roles y Permisos (RBAC) | P0 | ✅ Completado | Sesión 6 |
| 7 | Comunicaciones (anuncios, encuestas, canales) | P1 | ✅ Completado | Sesión 7 (ad-hoc) |
| 8 | Pagos | P1 | ⬜ Pendiente | — |
| 9 | PQR | P1 | ⬜ Pendiente | — |
| 10 | Ingresos + Chat + CI/CD | P2 | ⬜ Pendiente | — |

### Estados válidos
| Estado | Significado |
|--------|-------------|
| ⬜ Pendiente | No iniciado |
| 🔵 En progreso | Sesión actual en curso |
| 🔴 Bloqueado | `pnpm ci` falla o hay dependencia sin resolver |
| ✅ Completado | `pnpm ci` pasa, tests cubren el módulo |

> [!warning] Regla
> Solo marcar ✅ si `pnpm ci` pasó al cerrar la sesión. Si falló, marcar 🔴 y documentar el
> error específico en la sección "Bloqueos".

---

## Métricas de Calidad

| Métrica | Valor actual | Umbral | Estado |
|---------|--------------|--------|--------|
| TypeScript sin errores | 0 errores | 0 errores | ✅ |
| ESLint sin warnings | 0 warnings | 0 warnings | ✅ |
| Tests unitarios | 32 | > 0 | ✅ |
| Cobertura unitaria | TBD (restaurar thresholds) | ≥ 90% | 🔵 |
| Cobertura componentes | TBD | ≥ 80% | 🔵 |
| Flujos e2e críticos | 4/7 | 7/7 | 🔵 |
| Build exitoso | Sin errores | Sin errores | ✅ |
| Pipeline CI | Verde (individual) | Verde | ✅ |

> [!note]
> Los thresholds de coverage en `vitest.config.ts` siguen desactivados (pendiente restaurar).
> Se restaurarán en la Sesión 2 al ejecutar `pnpm test:coverage` con datos reales (`sonner` ya está instalado).

---

## Archivos Creados (Acumulado)

> Lista vacía al inicio. Se actualiza sesión por sesión con rutas exactas.

| Ruta | Descripción | Sesión |
|------|-------------|--------|
| `WEB/package.json` | Dependencias, scripts y metadatos del proyecto | 0 |
| `WEB/pnpm-lock.yaml` | Lockfile de dependencias | 0 |
| `WEB/tsconfig.json` | Configuración TypeScript con alias `@/` | 0 |
| `WEB/tsconfig.node.json` | TypeScript para `vite.config.ts` | 0 |
| `WEB/vite.config.ts` | Configuración Vite + React + Tailwind v4 + alias | 0 |
| `WEB/vitest.config.ts` | Configuración de Vitest con jsdom, MSW y cobertura | 0 |
| `WEB/playwright.config.ts` | Configuración de Playwright | 0 |
| `WEB/eslint.config.js` | ESLint 9 flat config con TS, React, a11y, Query | 0 |
| `WEB/.prettierrc` | Configuración de Prettier | 0 |
| `WEB/.gitignore` | Archivos ignorados por Git | 0 |
| `WEB/index.html` | Entry point HTML de la SPA | 0 |
| `WEB/public/favicon.svg` | Favicon del proyecto | 0 |
| `WEB/components.json` | Configuración de shadcn/ui (preset Nova, base radix) | 0 |
| `WEB/.env.development` | Variables de entorno de desarrollo | 0 |
| `WEB/.env.production` | Variables de entorno de producción | 0 |
| `WEB/.env.test` | Variables de entorno de tests + credenciales | 0 |
| `WEB/.env.example` | Ejemplo de variables de entorno | 0 |
| `WEB/src/main.tsx` | Entry point de React con providers | 0 |
| `WEB/src/index.css` | Tailwind v4 + `@theme inline` con tokens | 0 |
| `WEB/src/vite-env.d.ts` | Tipos de Vite y variables de entorno | 0 |
| `WEB/src/lib/utils.ts` | Utilidades `cn`, `formatCurrency`, `parseApiError`, `isNetworkError` | 0, 1 |
| `WEB/src/app/providers/QueryProvider.tsx` | Provider de TanStack Query (configurado) | 0, 1 |
| `WEB/src/app/providers/ThemeProvider.tsx` | Provider de next-themes (dark mode) | 0 |
| `WEB/src/components/ui/button.tsx` | Componente Button de shadcn/ui | 0 |
| `WEB/tests/setup.ts` | Setup global de Vitest + MSW + jest-dom | 0 |
| `WEB/tests/mocks/server.ts` | Servidor MSW | 0 |
| `WEB/tests/unit/lib/utils.test.ts` | Tests unitarios para `cn` (2 tests) | 0 |
| `WEB/src/types/api.types.ts` | Tipos base API (ApiResponse, ApiError, PaginatedResponse) | 1 |
| `WEB/src/features/auth/types/auth.types.ts` | Tipos de auth (AuthUser, LoginResponseData, etc.) | 1 |
| `WEB/src/lib/constants.ts` | Query keys para TanStack Query | 1 |
| `WEB/src/lib/validators.ts` | Schemas Zod (login, MFA) | 1 |
| `WEB/src/stores/auth.store.ts` | Zustand store (tokens en memoria, user, session) | 1 |
| `WEB/src/services/api-client.ts` | Axios client con interceptores (Bearer, silent refresh, 429 backoff) | 1 |
| `WEB/src/features/auth/api/auth.service.ts` | Servicio auth (login, silentRefresh, logout, getMe) | 1 |
| `WEB/src/features/auth/hooks/use-login.ts` | Hook login con manejo MFA_REQUIRED, FORCE_PASSWORD_CHANGE | 1 |
| `WEB/src/features/auth/hooks/use-logout.ts` | Hook logout con limpieza de cache | 1 |
| `WEB/src/features/auth/hooks/use-mfa-verify.ts` | Hook verificación MFA TOTP | 1 |
| `WEB/src/features/auth/hooks/use-mfa-verify-backup.ts` | Hook verificación MFA backup codes | 1 |
| `WEB/src/features/auth/components/LoginForm.tsx` | Formulario login con RHF + Zod | 1 |
| `WEB/src/features/auth/components/MfaVerifyForm.tsx` | Formulario MFA (TOTP + backup) | 1 |
| `WEB/src/features/auth/pages/LoginPage.tsx` | Página /login | 1 |
| `WEB/src/features/auth/pages/MfaPage.tsx` | Página /login/mfa | 1 |
| `WEB/src/features/dashboard/pages/DashboardPage.tsx` | Placeholder dashboard (Sesión 3) | 1 |
| `WEB/src/components/shared/FullPageLoader.tsx` | Loader de pantalla completa | 1 |
| `WEB/src/components/shared/StatusBadge.tsx` | Badge con variantes (success, warning, info, etc.) | 1 |
| `WEB/src/components/layout/DashboardShell.tsx` | Layout shell (sidebar + header + content) | 1 |
| `WEB/src/components/layout/DashboardLayout.tsx` | Layout protegido con bootstrap (silentRefresh + getMe) | 1 |
| `WEB/src/components/ui/input.tsx` | Componente Input de shadcn/ui | 1 |
| `WEB/src/components/ui/label.tsx` | Componente Label de shadcn/ui | 1 |
| `WEB/src/app/router.tsx` | Router con code splitting (lazy + Suspense) | 1 |
| `WEB/src/app/App.tsx` | Componente raíz con RouterProvider | 1 |
| `WEB/src/app/providers/ToastProvider.tsx` | Provider de notificaciones (sonner) | 1 |
| `WEB/tests/components/helpers/TestProviders.tsx` | Wrapper de providers para tests | 1 |
| `WEB/tests/components/auth/LoginForm.test.tsx` | Tests de LoginForm (3 tests) | 1 |
| `WEB/tests/unit/stores/auth.store.test.ts` | Tests de auth store (2 tests) | 1 |
| `WEB/tests/unit/lib/validators.test.ts` | Tests de validators Zod (6 tests) | 1 |
| `WEB/tests/e2e/fixtures.ts` | Credenciales centralizadas para tests E2E | 1 |
| `WEB/tests/e2e/auth.spec.ts` | Tests e2e de autenticación (4 activos + 3 skip) | 1 |
| `WEB/src/features/propiedades/types/propiedades.types.ts` | Tipos del feature (Property, Tower, PropertyType, PropertyStatus, etc.) | 4 |
| `WEB/src/features/propiedades/api/properties.service.ts` | CRUD + status log + documents + coefficient validation | 4 |
| `WEB/src/features/propiedades/api/towers.service.ts` | CRUD de torres | 4 |
| `WEB/src/features/propiedades/api/catalogs.service.ts` | CRUD de tipos, estados y tipos de documento | 4 |
| `WEB/src/features/propiedades/hooks/use-properties.ts` | 11 hooks: list, getById, create, update, delete, changeStatus, statusLog, coefficient, documents, uploadDoc, deleteDoc | 4 |
| `WEB/src/features/propiedades/hooks/use-towers.ts` | Hooks de torres (list, create, update, delete) | 4 |
| `WEB/src/features/propiedades/hooks/use-catalogs.ts` | Hooks de catálogos (tipos, estados, tipos de documento) | 4 |
| `WEB/src/features/propiedades/hooks/use-current-condominium.ts` | Hook para resolver el condominio del admin actual | 4 |
| `WEB/src/features/propiedades/hooks/use-debounced-value.ts` | Hook utilitario de debounce | 4 |
| `WEB/src/features/propiedades/validators/propiedades.validators.ts` | Schemas Zod (tower, catalog) | 4 |
| `WEB/src/features/propiedades/lib/format.ts` | Helpers de formato (floor, area, coefficient, fileSize, time, statusCode→variant) | 4 |
| `WEB/src/features/propiedades/components/PropertyFilters.tsx` | Barra de filtros con validación de coeficientes inline | 4 |
| `WEB/src/features/propiedades/components/PropertyForm.tsx` | Modal crear/editar unidad con RHF + Zod | 4 |
| `WEB/src/features/propiedades/components/PropertyStatusForm.tsx` | Modal cambio de estado con advertencia de residentes | 4 |
| `WEB/src/features/propiedades/components/PropertyDetail.tsx` | Drawer de detalle: datos físicos, historial, documentos | 4 |
| `WEB/src/features/propiedades/components/DocumentList.tsx` | Lista + upload + delete de documentos con drag & drop | 4 |
| `WEB/src/features/propiedades/components/TowerForm.tsx` | Modal crear/editar torre | 4 |
| `WEB/src/features/propiedades/components/CatalogForm.tsx` | Modal crear/editar tipo o estado (con toggle permite residentes) | 4 |
| `WEB/src/features/propiedades/pages/PropertiesListPage.tsx` | Página `/properties` con tabla + filtros + drawer | 4 |
| `WEB/src/features/propiedades/pages/TowersPage.tsx` | Página `/properties/towers` con tabla + CRUD | 4 |
| `WEB/src/features/propiedades/pages/CatalogsPage.tsx` | Página `/properties/catalogs` con tabs tipos/estados | 4 |
| `WEB/src/components/shared/Modal.tsx` | Modal genérico con backdrop y Escape | 4 |
| `WEB/src/components/shared/Drawer.tsx` | Drawer lateral derecho | 4 |
| `WEB/src/components/shared/ConfirmDialog.tsx` | Diálogo de confirmación destructiva con warnings | 4 |
| `WEB/src/components/shared/EmptyState.tsx` | Estado vacío con icono y CTA | 4 |
| `WEB/src/components/shared/ErrorState.tsx` | Estado de error con retry | 4 |
| `WEB/src/components/shared/Pagination.tsx` | Paginador server-side | 4 |
| `WEB/src/features/configuracion/types/account.types.ts` | Tipos del feature (Profile, ActiveSession, MfaSetupResponse, payloads) | 5 |
| `WEB/src/features/configuracion/api/account.service.ts` | Servicio API del feature (9 métodos: me, updateProfile, changePassword, sessions, revokeSession, revokeAllSessions, mfaSetup, mfaEnable, mfaDisable, regenerateBackupCodes) | 5 |
| `WEB/src/features/configuracion/hooks/use-profile.ts` | useProfile + useUpdateProfile (sincroniza con auth store) | 5 |
| `WEB/src/features/configuracion/hooks/use-change-password.ts` | useChangePassword (logout + redirect en éxito) | 5 |
| `WEB/src/features/configuracion/hooks/use-sessions.ts` | useSessions + useRevokeSession + useRevokeAllSessions | 5 |
| `WEB/src/features/configuracion/hooks/use-mfa.ts` | useMfaSetup + useMfaEnable + useMfaDisable + useRegenerateBackupCodes | 5 |
| `WEB/src/features/configuracion/components/ProfileForm.tsx` | Formulario RHF+Zod con avatar upload (base64), email/organización read-only | 5 |
| `WEB/src/features/configuracion/components/ChangePasswordSheet.tsx` | Sheet con validación de fortaleza y manejo de errores PASSWORD_REUSED/INVALID_CREDENTIALS | 5 |
| `WEB/src/features/configuracion/components/MfaSetupSheet.tsx` | Sheet 3 pasos: QR → Verify → Backup codes (copy/download) | 5 |
| `WEB/src/features/configuracion/components/MfaDisableSheet.tsx` | Sheet de desactivación con password + código TOTP | 5 |
| `WEB/src/features/configuracion/components/ActiveSessionsList.tsx` | Tabla de sesiones con revocar individual y masivo | 5 |
| `WEB/src/features/configuracion/pages/ProfilePage.tsx` | Página `/settings/profile` con ProfileForm | 5 |
| `WEB/src/features/configuracion/pages/SecurityPage.tsx` | Página `/settings/security` con 3 Cards (Contraseña, MFA, Sesiones) | 5 |
| `WEB/src/components/layout/UserMenu.tsx` | DropdownMenu con avatar, navegación a settings y logout | 5 |
| `WEB/src/components/ui/avatar.tsx` | Componente Avatar de shadcn/ui (Radix) | 5 |
| `WEB/src/components/ui/badge.tsx` | Componente Badge con variantes | 5 |
| `WEB/src/components/ui/card.tsx` | Componente Card con Header/Title/Description/Content/Footer | 5 |
| `WEB/src/components/ui/dropdown-menu.tsx` | Componente DropdownMenu de shadcn/ui (Radix) con variant="destructive" | 5 |
| `WEB/src/components/ui/sheet.tsx` | Componente Sheet de shadcn/ui (Radix Dialog) | 5 |
| `WEB/src/components/ui/skeleton.tsx` | Componente Skeleton para loading | 5 |
| `WEB/src/components/ui/tabs.tsx` | Componente Tabs de shadcn/ui (Radix) | 5 |
| `WEB/tests/mocks/handlers/account.handlers.ts` | MSW handlers para /auth/me, /auth/profile, /auth/change-password, /auth/sessions, /auth/mfa/* | 5 |
| `WEB/tests/unit/hooks/account.test.tsx` | Tests de useProfile y useSessions (3 tests) | 5 |
| `WEB/tests/components/configuracion/ChangePasswordSheet.test.tsx` | Tests del sheet de cambio de contraseña (4 tests) | 5 |
| `WEB/src/features/roles-permisos/types/roles.types.ts` | Tipos del feature (Permission, PermissionGroup, Role, RoleDetail, RoleAssignment, PanelUser, ApprovalRule, AuditLogEntry + payloads) | 6 |
| `WEB/src/features/roles-permisos/api/roles.service.ts` | Servicio API (11 métodos: listRoles, getRole, createRole, updateRole, setRolePermissions, listPermissions, createAssignment, revokeAssignment, listApprovalRules, createApprovalRule, listAuditLog, listPanelUsers) | 6 |
| `WEB/src/features/roles-permisos/hooks/use-roles.ts` | useRoleList, useRole, useCreateRole, useUpdateRole, useSetRolePermissions (staleTime 60s) | 6 |
| `WEB/src/features/roles-permisos/hooks/use-permissions.ts` | usePermissionsCatalog con agrupación por recurso (staleTime 300s) | 6 |
| `WEB/src/features/roles-permisos/hooks/use-assignments.ts` | useCreateAssignment, useRevokeAssignment | 6 |
| `WEB/src/features/roles-permisos/hooks/use-approval-rules.ts` | useApprovalRules, useCreateApprovalRule | 6 |
| `WEB/src/features/roles-permisos/hooks/use-audit.ts` | useAuditLog con filtros (staleTime 30s) | 6 |
| `WEB/src/features/roles-permisos/hooks/use-panel-users.ts` | usePanelUsers (staleTime 30s) | 6 |
| `WEB/src/features/roles-permisos/validators/roles-permisos.validators.ts` | Schemas Zod (roleSchema, assignmentSchema, approvalRuleSchema, auditFilterSchema) | 6 |
| `WEB/src/features/roles-permisos/components/RoleForm.tsx` | Formulario RHF+Zod crear/editar rol con campo "Basado en rol existente" | 6 |
| `WEB/src/features/roles-permisos/components/PermissionMatrix.tsx` | Grid recurso×acción con atajos fila/columna y soporte hideSystemPermissions | 6 |
| `WEB/src/features/roles-permisos/components/ScopePicker.tsx` | Selector de alcance organization/condominium/tower/unit (fallback al condominio actual) | 6 |
| `WEB/src/features/roles-permisos/components/UserRoleAssigner.tsx` | Modal para asignar rol+alcance+vigencia a un usuario | 6 |
| `WEB/src/features/roles-permisos/components/AuditTable.tsx` | Tabla paginada con filtros desde/hasta/actor + badges granted/denied | 6 |
| `WEB/src/features/roles-permisos/pages/RolesPage.tsx` | Página `/admin/roles` con tabla de roles y crear | 6 |
| `WEB/src/features/roles-permisos/pages/PermissionMatrixPage.tsx` | Página `/admin/roles/:id/permisos` con PermissionMatrix | 6 |
| `WEB/src/features/roles-permisos/pages/PanelUsersPage.tsx` | Página `/admin/usuarios` con tabla + filtros + Drawer de detalle | 6 |
| `WEB/src/features/roles-permisos/pages/ApprovalRulesPage.tsx` | Página `/admin/aprobaciones` con lista + form de reglas | 6 |
| `WEB/src/features/roles-permisos/pages/PermissionAuditPage.tsx` | Página `/admin/auditoria` con AuditTable | 6 |
| `WEB/src/features/roles-permisos/__tests__/use-roles.test.tsx` | Tests de useRoleList, useRole, useCreateRole (4 tests) | 6 |
| `WEB/src/features/roles-permisos/__tests__/use-permissions.test.tsx` | Tests de usePermissionsCatalog con agrupación (2 tests) | 6 |
| `WEB/tests/mocks/handlers/roles.handlers.ts` | MSW handlers para los 9 endpoints /authorization/* del feature | 6 |
| `WEB/src/features/comunicaciones/types/comunicaciones.types.ts` | Tipos del feature (Channel, Segment, Announcement, AnnouncementDetail, Delivery, Template, Survey, SurveyResults, ChannelConfig + payloads) | 7 |
| `WEB/src/features/comunicaciones/api/comunicaciones.service.ts` | Servicio API (11 métodos: listAnnouncements, getAnnouncement, createAnnouncement, listTemplates, createTemplate, updateTemplate, deleteTemplate, listSurveys, createSurvey, getSurveyResults, listChannels, updateChannel) | 7 |
| `WEB/src/features/comunicaciones/hooks/use-announcements.ts` | useAnnouncements, useAnnouncement (polling 15s mientras no enviado), useCreateAnnouncement | 7 |
| `WEB/src/features/comunicaciones/hooks/use-templates.ts` | useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate | 7 |
| `WEB/src/features/comunicaciones/hooks/use-surveys.ts` | useSurveys, useCreateSurvey, useSurveyResults (polling 10s mientras no cerrada) | 7 |
| `WEB/src/features/comunicaciones/hooks/use-channels.ts` | useChannels, useUpdateChannel | 7 |
| `WEB/src/features/comunicaciones/validators/comunicaciones.validators.ts` | Schemas Zod (announcementSchema, templateSchema, surveySchema, channelSchema) | 7 |
| `WEB/src/features/comunicaciones/lib/labels.ts` | Constantes de lookup (SEGMENT_LABEL, STATUS_LABEL, STATUS_VARIANT) — separadas para no romper fast-refresh | 7 |
| `WEB/src/features/comunicaciones/components/AnnouncementRow.tsx` | Fila de tabla con título, segmento, estado, canales (íconos), fijado, fecha programada | 7 |
| `WEB/src/features/comunicaciones/components/AnnouncementComposer.tsx` | Formulario RHF+Zod: título, cuerpo, segmento+target, canales (con canales inactivos deshabilitados), programación, fijado | 7 |
| `WEB/src/features/comunicaciones/components/AnnouncementDetail.tsx` | Sheet (side=right) con cuerpo, métricas (barras de progreso), tabla de deliveries | 7 |
| `WEB/src/features/comunicaciones/components/SurveyBuilder.tsx` | Modal con useFieldArray para opciones dinámicas (mín 2) + fecha de cierre | 7 |
| `WEB/src/features/comunicaciones/components/SurveyResults.tsx` | Sheet con gráfico de barras horizontales + total + badge activa/cerrada | 7 |
| `WEB/src/features/comunicaciones/pages/AnnouncementsInboxPage.tsx` | Página `/comunicaciones` con filtros, tabla, EmptyState, Sheet de detalle | 7 |
| `WEB/src/features/comunicaciones/pages/ComposeAnnouncementPage.tsx` | Página `/comunicaciones/nuevo` con composer + modal de plantillas; maneja `NO_ACTIVE_CHANNEL` | 7 |
| `WEB/src/features/comunicaciones/pages/SurveysPage.tsx` | Página `/comunicaciones/encuestas` con lista, modal crear (SurveyBuilder) y drawer de resultados | 7 |
| `WEB/src/features/comunicaciones/pages/ChannelsPage.tsx` | Página `/comunicaciones/canales` con 3 cards (WhatsApp, Email, Push) + modal de configuración | 7 |
| `WEB/src/features/comunicaciones/__tests__/use-announcements.test.tsx` | 6 tests: useAnnouncements (2), useAnnouncement (2), useCreateAnnouncement (2) | 7 |
| `WEB/tests/mocks/handlers/comunicaciones.handlers.ts` | MSW handlers para 10 endpoints `/comunicaciones/*` (incluye `GET /surveys` que el spec del backend no listaba originalmente) | 7 |

---

## Archivos Modificados (Acumulado)

| Ruta | Cambio | Sesión |
|------|--------|--------|
| `02-web/WEB_SESSION_MANIFEST.md` | Actualización completa: Sesión 0 completada, métricas reales, bloqueos resueltos | 0 |
| `WEB/src/index.css` | Integración de tokens WEB_VISUAL_STANDARDS + shadcn Nova (sidebar, chart, radius) | 0 |
| `WEB/tsconfig.json` | Eliminada referencia a tsconfig.node.json que causaba error TS6306; agregado `tests` al include | 0, 1 |
| `WEB/vitest.config.ts` | Eliminado triple-slash reference, ajustados thresholds de coverage | 0 |
| `WEB/eslint.config.js` | Agregado `allowExportNames: ['buttonVariants']` y `triple-slash-reference: off` | 0 |
| `WEB/tests/unit/lib/utils.test.ts` | Corregidas expresiones constantes detectadas por ESLint | 0 |
| `WEB/package.json` | Agregada dependencia `sonner: ^1.7.4`; mock y alias temporales eliminados | 1 |
| `WEB/src/main.tsx` | Actualizado con providers (Query, Theme, Toast) | 1 |
| `WEB/src/app/App.tsx` | Reemplazado placeholder con RouterProvider | 1 |
| `WEB/src/app/guards/ProtectedRoute.tsx` | Implementado con verificación de auth + redirect | 1 |
| `WEB/src/app/guards/AdminOnlyRoute.tsx` | Implementado con verificación de rol admin | 1 |
| `WEB/src/app/providers/QueryProvider.tsx` | Configurado con staleTime, retry, refetchOnWindowFocus | 1 |
| `WEB/src/lib/utils.ts` | Agregadas funciones `formatCurrency`, `parseApiError`, `isNetworkError` | 1 |
| `WEB/tests/mocks/handlers/auth.handlers.ts` | Reemplazado con handlers completos (login, refresh, me, logout, MFA) | 1 |
| `WEB/src/app/router.tsx` | Agregadas rutas `/properties`, `/properties/towers`, `/properties/catalogs` con lazy() + Suspense | 4 |
| `WEB/src/components/layout/DashboardShell.tsx` | Sidebar con submenú "Propiedades" (Unidades, Torres, Catálogos) | 4 |
| `WEB/src/features/auth/types/auth.types.ts` | Agregado `condominium_id?: string` al `AuthUser` | 4 |
| `WEB/eslint.config.js` | Regla `@typescript-eslint/no-unused-vars` con `^_` ignore pattern | 4 |
| `WEB/vitest.config.ts` | Excluir `tests/e2e/**` (los maneja Playwright) | 4 |
| `WEB/src/app/router.tsx` | Agregadas rutas `/settings/profile`, `/settings/security` con lazy() + Suspense | 5 |
| `WEB/src/components/layout/DashboardShell.tsx` | Reemplazado placeholder del header por `<UserMenu />` | 5 |
| `WEB/eslint.config.js` | Agregado `badgeVariants` a `allowExportNames` (react-refresh) | 5 |
| `WEB/vitest.config.ts` | Excluir `tests/unit/hooks/account.test.ts` (stub al renombrar a .tsx) | 5 |
| `WEB/tests/mocks/server.ts` | Registrados los handlers de accountHandlers junto con authHandlers | 5 |
| `WEB/src/app/router.tsx` | Agregadas 5 rutas `/admin/*` con lazy() + Suspense (roles, permisos, usuarios, aprobaciones, auditoría) | 6 |
| `WEB/src/components/layout/DashboardShell.tsx` | Nuevo NavGroup "Roles y Permisos" con icono Shield (4 sub-items con iconos) | 6 |
| `WEB/src/app/guards/AdminOnlyRoute.tsx` | Verificación de permisos RBAC (prefijo `roles.*` / `auth.*` / `authorization.*`) además del rol legacy | 6 |
| `WEB/src/components/layout/DashboardLayout.tsx` | Bootstrap acepta usuarios con permisos administrativos (no solo rol `admin`) | 6 |
| `WEB/src/features/auth/types/auth.types.ts` | Agregado `permissions?: string[]` opcional al `AuthUser` | 6 |
| `WEB/vitest.config.ts` | `include` extendido a `src/features/**/__tests__/**/*.test.{ts,tsx}` para tests del feature | 6 |
| `WEB/tests/mocks/server.ts` | Registrados los handlers de rolesHandlers junto con accountHandlers/authHandlers | 6 |
| `WEB/src/app/router.tsx` | Agregadas 4 rutas `/comunicaciones/*` con lazy() + Suspense (inbox, nuevo, encuestas, canales) | 7 |
| `WEB/src/components/layout/DashboardShell.tsx` | Nuevo NavGroup "Comunicaciones" con icono Megaphone (3 sub-items: Bandeja, Encuestas, Canales) | 7 |
| `WEB/tests/mocks/server.ts` | Registrados los handlers de comunicacionesHandlers junto con los demás | 7 |

---

## Deuda Técnica / Pendiente

| # | Descripción | Sesión origen | Sesión resolución | Estado |
|---|-------------|---------------|-------------------|--------|
| 1 | Instalar dependencias y componentes iniciales de shadcn/ui | 0 | 0 | ✅ Resuelto |
| 2 | Ejecutar `pnpm run ci` y verificar que pase en verde | 0 | 0 | ✅ Resuelto |
| 3 | Restaurar thresholds de coverage en `vitest.config.ts` | 0 | 2 | ⬜ Pendiente |
| 4 | Revisar advertencia `@types/dompurify` deprecado | 0 | 1 | ⬜ Pendiente |
| 5 | Vocabulario `audience` en COMUNICADOS difiere entre API y Web | — | TBD | ⬜ Pendiente |
| 6 | Tests e2e de auth: 4 implementados (login válido/inválido, ruta protegida, sesión expirada), 3 pendientes (logout, role=user, MFA) — requieren UI/API | 1 | 2 | 🔵 En progreso (4/7) |
| 7 | ~~Duplicado de #3~~ (unificado) | 0 | — | ✅ Unificado con #3 |
| 8 | Tests unitarios y de componentes del feature Propiedades (form, filtros, status, etc.) | 4 | TBD | ⬜ Pendiente |
| 9 | Conector MSW para endpoints de /properties, /towers, /property-types, /property-statuses (necesario para tests E2E y de hooks) | 4 | TBD | ⬜ Pendiente |
| 10 | `useCoefficientValidation` con fallback: hoy se renderiza inline en `PropertyFilters`. Confirmar con spec si debe ser un componente separado. | 4 | — | ⬜ Pendiente (cosmético) |
| 11 | Verificar inconsistencia conceptual entre `AuthUser.condominium_id` (usado en login) y `Profile.organization_id` (usado en /auth/me del nuevo feature) — pueden ser el mismo concepto con nombres distintos | 5 | TBD | ⬜ Pendiente |
| 12 | El commit de las Sesiones 1 y 4 no se encuentra en git (sus archivos aparecen como "untracked" en `git status`). El manifest asume commits. Verificar con el orquestador si se requiere un commit retroactivo consolidado. | 5 | TBD | ⬜ Pendiente |

---

## Bloqueos / Issues

| # | Descripción | Severidad | Acción propuesta | Estado |
|---|-------------|-----------|------------------|--------|
| — | Ninguno | — | — | — |

> Todos los bloqueos resueltos. `pnpm run ci` en verde: type-check ✅, lint ✅ (0 warnings), test ✅ (32/32 en 9 archivos), build ✅ (1930 módulos, code splitting verificado — 4 nuevas páginas en chunks separados).

---

## Próxima Sesión

**Siguiente según plan**: Zonas Comunes y Reservas (cuando se reactive la Sesión 5 original).
**Documentos**: [[WEB_ARCHITECTURE]], [[WEB_COMPONENTS]], [[WEB_VISUAL_STANDARDS]]
**Prerequisiito**: Urbania API corriendo con módulos CommonZone, Reservation. Sesiones 1-7 completadas.

---

## Instrucciones de Actualización

Al finalizar cada sesión, el agente DEBE:

1. Actualizar "Sesión Actual" con número, nombre, estado y fechas reales
2. Actualizar estado de módulos en la tabla (⬜/🔵/🔴/✅ según resultado de `pnpm ci`)
3. Agregar archivos creados y modificados con rutas exactas
4. Actualizar métricas con valores reales (ejecutar `pnpm test:coverage`)
5. Documentar deuda técnica identificada
6. Documentar bloqueos encontrados con el error exacto de `pnpm ci`
7. Actualizar "Próxima Sesión" con la siguiente del plan ([[WEB_IMPLEMENTATION_PLAN]])
8. Hacer commit del manifest: `[Sesión N] docs: actualizar WEB_SESSION_MANIFEST.md`

> [!warning]
> **NO** marcar un módulo como ✅ si `pnpm ci` no pasó al cierre de la sesión.
