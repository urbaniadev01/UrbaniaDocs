---
title: WEB_API_CLIENT
type: especificacion-tecnica
tags: [urbania-web, api, tanstack-query, axios]
status: vigente
ultima_revision: 2026-06-19
---

# 🔌 WEB_API_CLIENT
## Capa de Integración con la Urbania API REST

> [!important] Propósito
> Define cómo el cliente web se comunica con el API. Tipos, patrones de servicio y query hooks.
> Fuente única de verdad para integración.

> [!note] Fuente de verdad de endpoints
> [[01-api/API_CONTRACT]] — accesible directamente en este vault. Este documento define cómo **consumirlos** desde el
> cliente web. Antes de implementar cualquier módulo, verificar los endpoints contra
> [[01-api/API_CONTRACT]].

---

## 1. Tipos Base

**Ubicación:** `src/types/api.types.ts`

```ts
// Wrapper de respuesta exitosa del API
export interface ApiResponse<T> {
  data: T;
  meta: { trace_id: string };
}

// Wrapper de respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    trace_id: string;
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Error tipado del API
// Nota: algunas respuestas de error incluyen un campo `data` adicional (ej: 403 FORCE_PASSWORD_CHANGE
// incluye data.limited_token). Ver [[01-api/endpoints/AUTH]] §1.1 para el shape completo.
export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    trace_id: string;
  };
  /** Presente solo en errores que traen payload adicional (ej: FORCE_PASSWORD_CHANGE) */
  data?: Record<string, unknown>;
}

// Clase de error para manejar en hooks y componentes
export class ApiError extends Error {
  code: ApiErrorCode;
  traceId: string;
  status: number;
  /** Datos adicionales presentes en algunas respuestas de error (ej: limited_token en FORCE_PASSWORD_CHANGE) */
  data?: Record<string, unknown>;

  constructor(response: ApiErrorResponse, status: number) {
    super(response.error.message);
    this.name = 'ApiError';
    this.code = response.error.code;
    this.traceId = response.error.trace_id;
    this.status = status;
    this.data = response.data;
  }
}

// Códigos de error del API (mínimo conocido — ver API_CONTRACT.md para lista completa)
// IMPORTANTE: Esta lista puede estar incompleta. Antes de implementar un módulo,
// verificar en API_CONTRACT.md si hay códigos adicionales específicos del módulo.
export type ApiErrorCode =
  // Auth
  | 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'TOKEN_INVALID' | 'UNAUTHORIZED'
  | 'FORBIDDEN' | 'MFA_REQUIRED' | 'MFA_INVALID_CODE' | 'MFA_BACKUP_USED'
  | 'FORCE_PASSWORD_CHANGE' | 'PASSWORD_REUSED' | 'DEVICE_NOT_RECOGNIZED'
  | 'ACCOUNT_LOCKED' | 'SESSION_NOT_FOUND' | 'RATE_LIMIT_EXCEEDED'
  // Entidades
  | 'USER_NOT_FOUND' | 'PROPERTY_NOT_FOUND' | 'ZONE_NOT_FOUND'
  | 'RESERVATION_NOT_FOUND' | 'PAYMENT_NOT_FOUND' | 'PQR_NOT_FOUND'
  | 'INGRESO_NOT_FOUND'
  // Conflictos de negocio
  | 'RESERVATION_CONFLICT' | 'EMAIL_ALREADY_EXISTS' | 'UNIT_ALREADY_ASSIGNED'
  // Errores de sistema
  | 'VALIDATION_ERROR' | 'DATABASE_ERROR' | 'INTERNAL_ERROR';
  // Si el API devuelve un código no listado aquí, no fallará en runtime
  // (el tipo es string en runtime) pero TypeScript lo reportará en compilación.
  // Agregar el código a esta lista y manejarlo explícitamente.
```

---

## 2. Tipado: Contratos Compartidos entre Zod y TypeScript

> Checklist #3 del documento de requerimientos: "Tipado: Contracts TypeScript generados desde
> OpenAPI/Zod schemas".

**Regla del proyecto**: los DTOs de request (lo que el cliente envía) se definen **una sola vez**
como schema Zod en `src/features/<modulo>/types/<modulo>.schema.ts`, y el tipo TypeScript se
infiere del schema con `z.infer<...>` — nunca se escriben dos veces a mano.

```ts
// src/features/payments/types/payment.schema.ts
import { z } from 'zod';
import { currencySchema, uuidSchema, dateIsoSchema } from '@/lib/validators';

export const createPaymentSchema = z.object({
  amount: currencySchema,
  resident_id: uuidSchema,
  due_date: dateIsoSchema,
  description: z.string().max(500).optional(),
});

// Tipo usado tanto por React Hook Form como por el servicio que llama al API —
// una sola fuente de verdad, cero duplicación
export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
```

Los DTOs de **respuesta** (lo que el API devuelve) se tipan como interfaces TypeScript planas en
`<modulo>.types.ts`, reflejando exactamente la forma documentada en [[01-api/API_CONTRACT]] — no se
valida con Zod en runtime por defecto (el costo de parsear cada respuesta no se justifica salvo
en endpoints críticos de seguridad, p. ej. `/auth/me`).

> [!tip] Si el equipo migra a generación automática desde OpenAPI
> Si [[01-api/API_CONTRACT]] se formaliza algún día como spec OpenAPI, evaluar `openapi-typescript`
> para generar los tipos de respuesta automáticamente y reducir el riesgo de desincronización
> manual. Documentar esa decisión como un nuevo ADR en [[WEB_ARCHITECTURE]] §8 si se adopta.

---

## 3. Query Keys Centralizados

**Ubicación:** `src/lib/constants.ts`

```ts
export const QUERY_KEYS = {
  // Auth
  ME: ['auth', 'me'] as const,
  SESSIONS: ['auth', 'sessions'] as const,

  // Properties
  PROPERTIES: ['properties'] as const,
  PROPERTY: (id: string) => ['properties', id] as const,

  // Residents
  RESIDENTS: ['residents'] as const,
  RESIDENT: (id: string) => ['residents', id] as const,

  // Common Zones
  COMMON_ZONES: ['common-zones'] as const,
  COMMON_ZONE: (id: string) => ['common-zones', id] as const,
  ZONE_AVAILABILITY: (id: string, date: string) => ['common-zones', id, 'availability', date] as const,

  // Reservations
  RESERVATIONS: ['reservations'] as const,
  RESERVATION: (id: string) => ['reservations', id] as const,

  // Payments
  PAYMENTS: ['payments'] as const,
  PAYMENT: (id: string) => ['payments', id] as const,
  PAYMENT_SUMMARY: ['payments', 'summary'] as const,

  // PQR
  PQRS: ['pqr'] as const,
  PQR: (id: string) => ['pqr', id] as const,

  // Entry Log
  ENTRY_LOG: ['entry-log'] as const,

  // Chat
  CONVERSATIONS: ['chat', 'conversations'] as const,
  MESSAGES: (conversationId: string) => ['chat', 'messages', conversationId] as const,

  // Dashboard
  DASHBOARD_STATS: ['dashboard', 'stats'] as const,
} as const;
```

---

## 4. Estrategia de Cache por Recurso (`staleTime`)

> Checklist #2 del documento de requerimientos: "TanStack Query: estrategia de cache por
> recurso, invalidación tras mutaciones, `staleTime` configurado por endpoint".

`staleTime` por defecto del `QueryClient` (`src/app/providers/QueryProvider.tsx`):

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,   // 30s por defecto — balance razonable para datos de gestión
      retry: 1,                 // un reintento automático en errores de red
      refetchOnWindowFocus: true,
    },
  },
});
```

Excepciones explícitas por tipo de recurso (sobreescribir en el hook del recurso, no
globalmente):

| Recurso | `staleTime` | Razón |
|---------|------------|-------|
| `DASHBOARD_STATS` | `60 * 1000` (1 min) | Métricas agregadas, no necesitan estar al segundo |
| `SESSIONS` | `0` (siempre `stale`) | Información de seguridad — siempre se revalida al entrar a `/settings/security` |
| `ZONE_AVAILABILITY` | `10 * 1000` (10s) | Disponibilidad cambia rápido cuando hay reservas concurrentes |
| `ME` (perfil propio) | `5 * 60 * 1000` (5 min) | Cambia poco durante una sesión |
| Resto de listados (`PROPERTIES`, `RESIDENTS`, `PAYMENTS`, `PQRS`, etc.) | Heredan el default (30s) | — |

```ts
export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: dashboardService.getStats,
    staleTime: 60 * 1000,
  });
}
```

---

## 5. Patrón de Servicio + Hook

Cada feature sigue el mismo patrón (ver [[WEB_ARCHITECTURE]] §4.1 para la ubicación exacta):

```
src/features/payments/api/payments.service.ts   ← funciones puras que llaman a apiClient
src/features/payments/hooks/use-payments.ts      ← TanStack Query hooks que consumen el servicio
```

### Ejemplo: Módulo de Pagos

```ts
// --- payments.service.ts ---
import { apiClient } from '@/services/api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Payment, PaymentFilters, PaymentStatus } from '../types/payment.types';
import type { CreatePaymentDto } from '../types/payment.schema';

export async function getPayments(filters?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
  const { data } = await apiClient.get<PaginatedResponse<Payment>>('/payments', {
    params: filters,
  });
  return data;
}

export async function getPayment(id: string): Promise<Payment> {
  const { data } = await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`);
  return data.data;
}

export async function createPayment(payload: CreatePaymentDto): Promise<Payment> {
  const { data } = await apiClient.post<ApiResponse<Payment>>('/payments', payload);
  return data.data;
}

export async function updatePaymentStatus(id: string, status: PaymentStatus): Promise<Payment> {
  const { data } = await apiClient.patch<ApiResponse<Payment>>(
    `/payments/${id}/status`,
    { status },
  );
  return data.data;
}
```

```ts
// --- use-payments.ts ---
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import * as paymentsService from '../api/payments.service';
import type { PaymentFilters, PaymentStatus } from '../types/payment.types';

export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PAYMENTS, filters],
    queryFn: () => paymentsService.getPayments(filters),
    placeholderData: keepPreviousData, // Evita flash al cambiar página
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENT(id),
    queryFn: () => paymentsService.getPayment(id),
    enabled: !!id,
  });
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentStatus }) =>
      paymentsService.updatePaymentStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENT(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENT_SUMMARY });
    },
  });
}
```

---

## 6. Manejo Global de Errores de API

**Ubicación:** `src/lib/utils.ts`

```ts
import { AxiosError } from 'axios';
import { ApiError, type ApiErrorResponse } from '@/types/api.types';

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError && error.response?.data) {
    return new ApiError(
      error.response.data as ApiErrorResponse,
      error.response.status,
    );
  }

  return new ApiError(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error inesperado. Por favor intenta de nuevo.',
        trace_id: '',
      },
    },
    500,
  );
}
```

En los componentes, manejar errores de mutaciones con `onError`:

```ts
const mutation = useUpdatePaymentStatus();

mutation.mutate({ id, status }, {
  onSuccess: () => toast.success('Estado actualizado correctamente.'),
  onError: (error) => {
    const apiError = parseApiError(error);
    toast.error(apiError.message, {
      description: apiError.traceId ? `Ref: ${apiError.traceId}` : undefined,
    });
  },
});
```

---

## 7. Endpoints por Módulo

Lista de endpoints consumidos. Para request/response completos, **ver `01-api/endpoints/<FEATURE>.md`** (detalle) o [[01-api/API_CONTRACT]] (índice).

### Auth (`/api/v1/auth`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `POST /auth/login` | `auth.service.login()` | `useLogin()` |
| `POST /auth/logout` | `auth.service.logout()` | `useLogout()` |
| `POST /auth/refresh` | `auth.service.silentRefresh()` | Automático (interceptor + bootstrap) |
| `GET /auth/me` | `auth.service.getMe()` | Query interna en `DashboardLayout` |
| `PATCH /auth/me` | `auth.service.updateProfile()` | `useUpdateProfile()` |
| `POST /auth/change-password` | `auth.service.changePassword()` | `useChangePassword()` |
| `POST /auth/forgot-password` | `auth.service.forgotPassword()` | `useForgotPassword()` |
| `POST /auth/reset-password` | `auth.service.resetPassword()` | `useResetPassword()` |
| `GET /auth/sessions` | `auth.service.getSessions()` | `useSessions()` |
| `DELETE /auth/sessions/{id}` | `auth.service.revokeSession()` | `useRevokeSession()` |
| `DELETE /auth/sessions` | `auth.service.revokeAllSessions()` | `useRevokeAllSessions()` |
| `POST /auth/verify-email` | `auth.service.verifyEmail()` | `useVerifyEmail()` |
| `POST /auth/resend-verification` | `auth.service.resendVerification()` | `useResendVerification()` |
| `POST /auth/mfa/setup` | `auth.service.setupMfa()` | `useMfaSetup()` |
| `POST /auth/mfa/verify` | `auth.service.verifyMfa()` | `useMfaVerify()` |
| `POST /auth/mfa/verify-backup` | `auth.service.verifyMfaBackup()` | `useMfaVerifyBackup()` |
| `POST /auth/mfa/enable` | `auth.service.enableMfa()` | `useMfaEnable()` |
| `POST /auth/mfa/disable` | `auth.service.disableMfa()` | `useMfaDisable()` |
| `POST /auth/mfa/backup-codes` | `auth.service.regenerateBackupCodes()` | `useRegenerateBackupCodes()` |

### Properties (`/api/v1/properties`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /properties` | `properties.service.getProperties()` | `useProperties()` |
| `GET /properties/{id}` | `properties.service.getProperty()` | `useProperty(id)` |
| `POST /properties` | `properties.service.createProperty()` | `useCreateProperty()` |
| `PATCH /properties/{id}` | `properties.service.updateProperty()` | `useUpdateProperty()` |
| `GET /properties/{id}/units` | `properties.service.getUnits()` | `useUnits(propertyId)` |

### Residents (`/api/v1/users`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /users` | `residents.service.getResidents()` | `useResidents()` |
| `GET /users/{id}` | `residents.service.getResident()` | `useResident(id)` |
| `POST /users` | `residents.service.createResident()` | `useCreateResident()` |
| `PATCH /users/{id}` | `residents.service.updateResident()` | `useUpdateResident()` |
| `PATCH /users/{id}/status` | `residents.service.updateStatus()` | `useUpdateResidentStatus()` |
| `DELETE /users/{id}` | `residents.service.deleteResident()` | `useDeleteResident()` |

### Common Zones (`/api/v1/common-zones`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /common-zones` | `commonZones.service.getZones()` | `useCommonZones()` |
| `POST /common-zones` | `commonZones.service.createZone()` | `useCreateZone()` |
| `PATCH /common-zones/{id}` | `commonZones.service.updateZone()` | `useUpdateZone()` |
| `DELETE /common-zones/{id}` | `commonZones.service.deleteZone()` | `useDeleteZone()` |
| `GET /common-zones/{id}/availability` | `commonZones.service.getAvailability()` | `useZoneAvailability(id, date)` |

### Reservations (`/api/v1/reservations`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /reservations` | `reservations.service.getReservations()` | `useReservations()` |
| `GET /reservations/{id}` | `reservations.service.getReservation()` | `useReservation(id)` |
| `POST /reservations` | `reservations.service.createReservation()` | `useCreateReservation()` |
| `PATCH /reservations/{id}/status` | `reservations.service.updateStatus()` | `useUpdateReservationStatus()` |
| `DELETE /reservations/{id}` | `reservations.service.cancelReservation()` | `useCancelReservation()` |

### Payments (`/api/v1/payments`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /payments` | `payments.service.getPayments()` | `usePayments()` |
| `GET /payments/{id}` | `payments.service.getPayment()` | `usePayment(id)` |
| `POST /payments` | `payments.service.createPayment()` | `useCreatePayment()` |
| `PATCH /payments/{id}/status` | `payments.service.updateStatus()` | `useUpdatePaymentStatus()` |
| `GET /payments/summary` | `payments.service.getSummary()` | `usePaymentSummary()` |

### PQR (`/api/v1/pqr`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /pqr` | `pqr.service.getPqrs()` | `usePqrs()` |
| `GET /pqr/{id}` | `pqr.service.getPqr()` | `usePqr(id)` |
| `PATCH /pqr/{id}/status` | `pqr.service.updateStatus()` | `useUpdatePqrStatus()` |
| `POST /pqr/{id}/comments` | `pqr.service.addComment()` | `useAddPqrComment()` |

### Entry Log (`/api/v1/entries`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /entries` | `entryLog.service.getEntries()` | `useEntries()` |
| `POST /entries` | `entryLog.service.registerEntry()` | `useRegisterEntry()` |

### Chat (`/api/v1/chat`)
| Endpoint | Servicio | Hook |
|----------|---------|------|
| `GET /chat/conversations` | `chat.service.getConversations()` | `useConversations()` |
| `GET /chat/conversations/{id}/messages` | `chat.service.getMessages()` | `useMessages(id)` |
| `POST /chat/conversations/{id}/messages` | `chat.service.sendMessage()` | `useSendMessage()` |

---

## 8. Paginación

```ts
export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PAYMENTS, filters],
    queryFn: () => paymentsService.getPayments(filters),
    placeholderData: keepPreviousData, // Evita flash al cambiar página
  });
}

// Uso en componente:
const [page, setPage] = useState(1);
const { data } = usePayments({ page, per_page: 20, status: 'pending' });
```

Integración con server-side pagination de TanStack Table en [[WEB_COMPONENTS]] §4 y §7.

---

## 9. Tiempo Real con Laravel Echo

**Ubicación:** `src/lib/echo.ts`

> [!warning] Importante
> El header de autorización de Echo debe actualizarse cada vez que el access token cambia (tras
> cada silent refresh). No leer el token al nivel de módulo (import time) porque quedaría
> obsoleto. Ver el patrón correcto abajo.

```ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '@/stores/auth.store';

declare global { interface Window { Pusher: typeof Pusher } }
window.Pusher = Pusher;

export function createEcho(): Echo {
  return new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY!,
    // En desarrollo local con Soketi/Laravel Reverb:
    wsHost: import.meta.env.VITE_PUSHER_HOST ?? 'localhost',
    wsPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 6001),
    forceTLS: import.meta.env.VITE_PUSHER_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    // cluster se ignora cuando se usa wsHost personalizado
    cluster: import.meta.env.VITE_PUSHER_CLUSTER ?? 'mt1',
    disableStats: import.meta.env.VITE_APP_ENV !== 'production',
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        // Leer el token en el momento de cada request, no en la creación
        get Authorization() {
          return `Bearer ${useAuthStore.getState().accessToken ?? ''}`;
        },
      },
    },
  });
}

// Instancia singleton — se crea una sola vez cuando se necesita
let echoInstance: Echo | null = null;

export function getEcho(): Echo {
  if (!echoInstance) {
    echoInstance = createEcho();
  }
  return echoInstance;
}

// Llamar cuando el token cambia (después de silentRefresh o login)
export function reconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
  echoInstance = createEcho();
}
```

**Uso en el módulo de chat:**
```ts
useEffect(() => {
  const echo = getEcho();
  const channel = echo.private(`conversation.${conversationId}`);

  channel.listen('MessageSent', () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES(conversationId) });
  });

  return () => {
    channel.stopListening('MessageSent');
  };
}, [conversationId, queryClient]);
```

**Reconexión tras silent refresh:**
```ts
// En auth.service.ts, después de actualizar el token:
export async function silentRefresh(): Promise<string> {
  const { data } = await axios.post(/* ... */);
  const newToken: string = data.data.access_token;
  useAuthStore.getState().setAccessToken(newToken);
  // Reconectar Echo con el nuevo token para canales privados
  reconnectEcho();
  return newToken;
}
```

---

## 10. Manejo de Errores de Red

```ts
// Detectar si el error es de red (sin respuesta del servidor)
export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && !error.response;
}

// En componentes de lista: mostrar error diferenciado
if (isError) {
  const err = parseApiError(error);
  const message = isNetworkError(error)
    ? 'No se pudo conectar al servidor. Verifica tu conexión.'
    : err.message;
  return <ErrorState message={message} onRetry={refetch} />;
}
```
