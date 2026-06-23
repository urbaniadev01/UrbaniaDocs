---
title: WEB_COMPONENTS
type: componentes
tags: [urbania-web, componentes, ui, catalogo]
status: vigente
fuente_unica: false
ultima_revision: 2026-06-17
---

# 🧩 WEB_COMPONENTS
## Sistema de Componentes y Catálogo de UI

> [!info] Propósito
> Catálogo de componentes disponibles y patrones de UI. Antes de crear un componente nuevo,
> verificar si ya existe aquí.

> [!important] Fuente de verdad para tokens
> Los colores, tipografía, espaciado y accesibilidad están definidos en [[WEB_VISUAL_STANDARDS]].
> Este documento los referencia pero no los define. Si hay discrepancia entre ambos,
> [[WEB_VISUAL_STANDARDS]] tiene prioridad.

> [!tip] Regla
> Si el componente es reutilizable entre módulos, documentarlo en este archivo y ubicarlo en
> `src/components/shared/` o `src/components/ui/` según corresponda (ver [[WEB_ARCHITECTURE]] §4).
> Si el componente es específico de un módulo, vive en `src/features/<modulo>/components/` y
> no necesita documentarse aquí.

---

## 1. Fundamentos

El design system usa **shadcn/ui** como base. Los componentes de shadcn se copian al proyecto
en `src/components/ui/` (no se importan como paquete) y pueden modificarse libremente. Los
tokens de color y tipografía están en [[WEB_VISUAL_STANDARDS]] §2 y §3.

### Paleta de colores (resumen)

| Token | Uso |
|-------|-----|
| `primary` | Botones CTA, links activos, indicadores de progreso |
| `secondary` | Botones outline, fondos secundarios |
| `muted` | Texto secundario, placeholders, bordes suaves |
| `destructive` | Acciones destructivas (eliminar, revocar) |
| `success` | Estados pagado, activo, aprobado, confirmado |
| `warning` | Estados pendiente, por vencer, alertas moderadas |
| `info` | Estados en revisión, programado, tooltips |

> [!note]
> Definición completa de tokens, incluyendo valores HSL y variables CSS: [[WEB_VISUAL_STANDARDS]] §2

---

## 2. Componentes Base (shadcn/ui — `src/components/ui/`)

Instalar con `pnpm dlx shadcn@latest add [nombre]`. No modificar sin documentar el cambio en
este archivo.

| Componente | Descripción | Cuándo usar |
|-----------|-------------|-------------|
| `Button` | Botón base con variantes | Toda acción del usuario |
| `Input` | Campo de texto | Formularios |
| `Label` | Etiqueta de campo | Acompañar inputs |
| `Select` | Selector desplegable | Opciones limitadas |
| `Checkbox` | Casilla de verificación | Selección múltiple, filas de tabla |
| `Switch` | Toggle booleano | Activar/desactivar |
| `Textarea` | Campo de texto multilínea | Descripciones, comentarios |
| `Badge` | Etiqueta de estado | **Ver extensión en §2.1** |
| `Card` | Contenedor de sección | Agrupar contenido |
| `Dialog` | Modal | Confirmaciones, formularios secundarios |
| `Sheet` | Panel lateral deslizable | Detalles, filtros |
| `Table` | Tabla base (primitivas) | Usar siempre envuelta en `DataTable` (§4) |
| `Tabs` | Pestañas | Contenido alternativo en la misma página |
| `Toast` / `Sonner` | Notificación temporal | Feedback de acciones |
| `Skeleton` | Placeholder de carga | Loading states |
| `Separator` | Línea divisoria | Separar secciones |
| `Avatar` | Imagen de usuario | Perfil, lista de residentes |
| `DropdownMenu` | Menú contextual | Acciones sobre una fila de tabla |
| `Popover` | Popup de contenido | Date picker, filtros inline |
| `Calendar` | Selector de fecha | Disponibilidad de zonas, reportes |

### 2.1 Extensión del Componente Badge

> [!warning] Obligatorio antes de usar StatusBadge
> shadcn/ui Badge no incluye las variantes `success`, `warning`, `info` ni `muted` por defecto.
> Deben agregarse al archivo `src/components/ui/badge.tsx` según la especificación en
> [[WEB_VISUAL_STANDARDS]] §2.4.
>
> Sin esta extensión, el componente `StatusBadge` (§4) fallará en TypeScript.

---

## 3. Componentes de Layout (`src/components/layout/`)

### `DashboardShell`
Contenedor principal del dashboard. Incluye sidebar y área de contenido. Se monta una sola vez
en el layout raíz protegido (`src/app/router.tsx`, ruta padre con `<Outlet />`).

```tsx
<DashboardShell>
  <PageShell title="Pagos" description="Gestión de pagos y cuotas">
    <PaymentsPage />
  </PageShell>
</DashboardShell>
```

### `PageShell`
Encabezado estándar de página con título, descripción y área de acciones.

```tsx
<PageShell
  title="Pagos"
  description="Gestión de pagos y cuotas de administración"
  actions={<Button onClick={openCreateModal}>Registrar pago</Button>}
>
  {children}
</PageShell>
```

### `Sidebar`
Navegación lateral. Activa el ítem según la ruta actual (`useLocation()` de React Router).
Colapsable en pantallas medianas. Iconos y orden de navegación: [[WEB_VISUAL_STANDARDS]] §7.3.

Items de navegación (en orden):
1. Dashboard
2. Propiedades
3. Residentes
4. Zonas comunes
5. Reservas
6. Pagos
7. PQR
8. Registro de ingresos
9. Chat
10. Configuración

---

## 4. Componentes Compartidos (`src/components/shared/`)

### `DataTable`
Wrapper de TanStack Table con paginación, filtros, ordenamiento y selección múltiple
integrados. Ver §10 para la especificación completa de configuración base, paginación
server-side y acciones bulk.

```tsx
<DataTable
  columns={paymentColumns}
  data={payments}
  totalCount={total}
  page={page}
  onPageChange={setPage}
  isLoading={isLoading}
  filterPlaceholder="Buscar por residente..."
  onFilterChange={setSearch}
  enableRowSelection
  bulkActions={paymentBulkActions}
/>
```

**Props:**
```ts
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  filterPlaceholder?: string;
  onFilterChange?: (value: string) => void;
  emptyMessage?: string;
  /** Habilita la columna de checkbox de selección. Default: false. */
  enableRowSelection?: boolean;
  /** Acciones disponibles cuando hay filas seleccionadas. Ver §10.3. */
  bulkActions?: BulkAction<T>[];
}
```

> [!note] Detalle completo
> La implementación de `DataTable` (configuración de `useReactTable`, toolbar de selección,
> integración con TanStack Query) está especificada en §10. Esta sección (§4) documenta solo
> la API pública del componente.

### `ConfirmDialog`
Modal de confirmación para acciones destructivas.

```tsx
<ConfirmDialog
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="¿Revocar sesión?"
  description="Esta acción no se puede deshacer. El usuario deberá iniciar sesión de nuevo."
  confirmLabel="Revocar"
  variant="destructive"
  onConfirm={handleRevoke}
  isLoading={revokeSession.isPending}
/>
```

### `EmptyState`
Placeholder cuando una lista está vacía.

```tsx
<EmptyState
  icon={<CreditCard />}
  title="Sin pagos registrados"
  description="Registra el primer pago de administración."
  action={<Button onClick={openCreateModal}>Registrar pago</Button>}
/>
```

### `ErrorBoundary`
Captura errores de renderizado. Usar como wrapper en páginas.

```tsx
<ErrorBoundary fallback={<PageError />}>
  <PaymentsPage />
</ErrorBoundary>
```

### `ErrorState`
Estado de error inline para vistas que fallan al cargar datos.

```tsx
<ErrorState
  message="No se pudieron cargar los pagos."
  onRetry={refetch}
/>
```

### `StatusBadge`
Badge con variantes de color según el estado de la entidad.

> [!warning] Dependencia
> Requiere que el Badge de shadcn/ui esté extendido con variantes custom (§2.1).

```tsx
<StatusBadge status="paid" module="payment" />    // "Pagado" — verde
<StatusBadge status="pending" module="payment" /> // "Pendiente" — ámbar
<StatusBadge status="overdue" module="payment" /> // "Vencido" — rojo
```

**Configuración de estados por módulo:**

```ts
// src/lib/status-config.ts — FUENTE ÚNICA de configuración de estados

export const PAYMENT_STATUS_CONFIG = {
  paid:      { label: 'Pagado',    variant: 'success' as const },
  pending:   { label: 'Pendiente', variant: 'warning' as const },
  overdue:   { label: 'Vencido',   variant: 'destructive' as const },
  cancelled: { label: 'Cancelado', variant: 'muted' as const },
} satisfies Record<string, { label: string; variant: BadgeVariant }>;

export const PQR_STATUS_CONFIG = {
  open:        { label: 'Abierto',     variant: 'info' as const },
  in_progress: { label: 'En revisión', variant: 'warning' as const },
  resolved:    { label: 'Resuelto',    variant: 'success' as const },
  closed:      { label: 'Cerrado',     variant: 'muted' as const },
} satisfies Record<string, { label: string; variant: BadgeVariant }>;

export const RESERVATION_STATUS_CONFIG = {
  confirmed: { label: 'Confirmada', variant: 'success' as const },
  pending:   { label: 'Pendiente',  variant: 'warning' as const },
  cancelled: { label: 'Cancelada',  variant: 'destructive' as const },
} satisfies Record<string, { label: string; variant: BadgeVariant }>;

export const USER_STATUS_CONFIG = {
  active:    { label: 'Activo',     variant: 'success' as const },
  suspended: { label: 'Suspendido', variant: 'destructive' as const },
  inactive:  { label: 'Inactivo',   variant: 'muted' as const },
} satisfies Record<string, { label: string; variant: BadgeVariant }>;

export const ENTRY_TYPE_CONFIG = {
  visitor:   { label: 'Visitante', variant: 'info' as const },
  resident:  { label: 'Residente', variant: 'default' as const },
  delivery:  { label: 'Domicilio', variant: 'warning' as const },
} satisfies Record<string, { label: string; variant: BadgeVariant }>;
```

> [!note]
> Esta configuración vive en `src/lib/status-config.ts`, no en este documento. El documento es
> la referencia; el código es la implementación.

### `Pagination`
Controles de paginación estándar (independiente de `DataTable`, usado cuando no se necesita
una tabla completa, p. ej. listas de tarjetas).

```tsx
<Pagination
  currentPage={page}
  totalPages={data?.meta.last_page ?? 1}
  onPageChange={setPage}
/>
```

### `FullPageLoader`
Spinner de carga para el bootstrap del layout protegido.

```tsx
export function FullPageLoader() {
  return (
    <div className="flex h-screen items-center justify-center" aria-label="Cargando aplicación">
      <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
    </div>
  );
}
```

---

## 5. Componentes de Formulario

### Patrón estándar de formulario

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  resident_id: z.string().uuid('Residente inválido'),
  due_date: z.string().min(1, 'La fecha es requerida'),
  description: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

export function CreatePaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useCreatePayment();

  const onSubmit = (data: FormData) => {
    mutation.mutate(data, {
      onSuccess,
      onError: (error) => {
        const apiError = parseApiError(error);
        toast.error(apiError.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="amount">
          Monto <span aria-hidden="true" className="text-destructive">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          aria-describedby={errors.amount ? 'amount-error' : undefined}
          aria-invalid={!!errors.amount}
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p id="amount-error" role="alert" className="text-sm text-destructive">
            {errors.amount.message}
          </p>
        )}
      </div>
      {/* ... más campos ... */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="submit" disabled={mutation.isPending} aria-busy={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </form>
  );
}
```

> [!tip] Reutilización de schemas con el API contract
> Cuando un schema Zod de formulario representa exactamente el body de un endpoint, definirlo
> una sola vez en `src/features/<modulo>/types/<modulo>.schema.ts` y reutilizarlo tanto para
> `zodResolver` como para tipar el body del servicio (`z.infer<typeof schema>`). Ver
> [[WEB_API_CLIENT]] §2 para el patrón completo de tipado compartido Zod ↔ TypeScript.

### Reglas de validación Zod comunes

```ts
// src/lib/validators.ts — fuente única de validators reutilizables

export const emailSchema = z
  .string()
  .email('Email inválido')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial');

export const uuidSchema = z.string().uuid('ID inválido');

export const phoneSchema = z
  .string()
  .regex(/^3\d{9}$/, 'Teléfono colombiano inválido (10 dígitos, inicia en 3)');

export const currencySchema = z
  .number({ invalid_type_error: 'Debe ser un número' })
  .positive('Debe ser un valor positivo')
  .multipleOf(0.01, 'Máximo 2 decimales');

export const dateIsoSchema = z
  .string()
  .datetime({ message: 'Fecha inválida' });
```

### Mapeo de errores de campo (Zod → RHF → UI)

`zodResolver` ya traduce los `ZodError.issues` al formato `FieldErrors` de React Hook Form
automáticamente — no se requiere mapeo manual para errores de validación de esquema. El único
mapeo manual necesario es para **errores devueltos por el API** (HTTP 422) que no pasaron por
el schema local (p. ej. "este email ya está registrado"):

```ts
mutation.mutate(data, {
  onError: (error) => {
    const apiError = parseApiError(error);
    if (apiError.code === 'VALIDATION_ERROR' && apiError.fields) {
      // Mapear errores de campo del API a RHF con setError
      Object.entries(apiError.fields).forEach(([field, messages]) => {
        setError(field as keyof FormData, { message: messages[0] });
      });
    } else {
      toast.error(apiError.message);
    }
  },
});
```

### Estados de submit

Todo formulario expone tres estados visibles al usuario, derivados directamente de
`mutation.isPending` / `mutation.isError` / `mutation.isSuccess` (TanStack Query) — nunca un
`useState` paralelo que pueda desincronizarse:

| Estado | Indicador visual | Comportamiento |
|--------|------------------|-----------------|
| Loading | Botón con spinner + `disabled` + `aria-busy="true"` | Bloquear doble submit |
| Error | `toast.error()` con mensaje de `parseApiError` + errores de campo inline si aplica | El formulario permanece editable |
| Success | `toast.success()` + callback `onSuccess` (cerrar modal, redirigir, invalidar queries) | — |

---

## 6. Componentes de Dashboard (`src/features/dashboard/components/`)

### `StatsCard`
Tarjeta de métrica con número destacado y tendencia.

```tsx
<StatsCard
  title="Pagos del mes"
  value={formatCurrency(4200000)}
  trend={{ value: 12, direction: 'up', label: 'vs mes anterior' }}
  icon={<CreditCard className="size-6" aria-hidden="true" />}
/>
```

**Props:**
```ts
interface StatsCardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  icon?: React.ReactNode;
  isLoading?: boolean;
}
```

### `OccupancyChart`
Gráfico de barras (Recharts) con ocupación de unidades por mes.

### `PqrByStatusChart`
Gráfico de dona con distribución de PQRs por estado.

### `RecentActivity`
Lista de los últimos eventos (pagos, ingresos, PQRs) con timestamp.

---

## 7. Estados de UI Obligatorios

Toda vista que carga datos del API debe implementar los tres estados:

```tsx
if (isLoading) return <TableSkeleton rows={5} />;
if (isError) return (
  <ErrorState
    message={isNetworkError(error)
      ? 'No se pudo conectar al servidor. Verifica tu conexión.'
      : parseApiError(error).message}
    onRetry={refetch}
  />
);
if (!data?.data.length) return (
  <EmptyState
    icon={<IconForModule />}
    title="Sin {entidad}"
    description="Registra el primero desde el botón superior."
  />
);

return <DataTable ... />;
```

### Componentes de skeleton disponibles

```tsx
<TableSkeleton rows={5} />          // Para listas y tablas
<CardSkeleton />                    // Para tarjetas de detalle
<StatsSkeleton count={4} />         // Para dashboard metrics
<FormSkeleton fields={4} />         // Para formularios en carga
```

---

## 8. Accesibilidad

> [!note]
> La especificación completa de accesibilidad (contrastes, patrones ARIA, gestión de foco,
> skip links, prefers-reduced-motion) está en [[WEB_VISUAL_STANDARDS]] §12.

Resumen de reglas básicas que aplican en todo componente:

- Todo `<input>` tiene `<Label>` asociado con `htmlFor` + `id` coincidentes
- Los errores de formulario usan `role="alert"` y `aria-describedby` en el input
- Botones con solo íconos tienen `aria-label`
- Los íconos decorativos tienen `aria-hidden="true"`
- Navegación por teclado funcional en todos los componentes interactivos
- Estados de carga con `aria-busy={true}` en botones de submit

---

## 9. Patrones de Composición

- Las páginas (`src/features/<modulo>/pages/`) orquestan: llaman hooks de datos, manejan los
  tres estados de UI (§7) y componen los componentes de presentación del módulo.
- Los componentes de presentación (`src/features/<modulo>/components/`) reciben datos por
  props — no llaman hooks de TanStack Query directamente salvo que sean ellos mismos el punto
  de entrada de una sección independiente (p. ej. `SessionList` dentro de `/settings/security`).
- Ningún componente de `src/components/shared/` importa nada de `src/features/`. La dirección
  de dependencia es siempre `features/* → components/shared`, nunca al revés.

---

## 10. Tablas y Listados (TanStack Table)

> [!important] Cobertura de checklist
> Esta sección especifica la configuración base de TanStack Table, su integración con
> TanStack Query para paginación server-side, y el patrón de acciones bulk con selección
> múltiple — ninguno de estos tres puntos tenía especificación técnica explícita en la versión
> anterior de esta documentación más allá de la mención del componente `DataTable`.

### 10.1 Configuración base

`DataTable` (§4) envuelve `useReactTable` de `@tanstack/react-table` con los siguientes modelos
de fila habilitados:

```tsx
// src/components/shared/DataTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  filterPlaceholder?: string;
  onFilterChange?: (value: string) => void;
  emptyMessage?: string;
  enableRowSelection?: boolean;
  bulkActions?: BulkAction<T>[];
}

export function DataTable<T>({
  columns,
  data,
  totalCount,
  page,
  onPageChange,
  isLoading,
  enableRowSelection = false,
  bulkActions,
  ...rest
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns: enableRowSelection ? [selectionColumn<T>(), ...columns] : columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // El filtrado y la paginación NO se delegan a TanStack Table (getFilteredRowModel /
    // getPaginationRowModel) porque son server-side — ver §10.2. Solo el ordenamiento por
    // columna visible se resuelve client-side sobre la página actual.
    enableRowSelection,
    getRowId: (row) => (row as { id: string }).id,
  });

  const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

  return (
    <div className="space-y-3">
      {bulkActions && selectedRows.length > 0 && (
        <BulkActionsToolbar
          count={selectedRows.length}
          actions={bulkActions}
          selected={selectedRows}
          onDone={() => setRowSelection({})}
        />
      )}
      {/* render de <Table> con table.getHeaderGroups() / table.getRowModel() */}
      {/* ... */}
    </div>
  );
}
```

> [!warning] Filtrado y paginación son server-side
> No usar `getFilteredRowModel()` ni `getPaginationRowModel()` de TanStack Table. Filtrar y
> paginar en el cliente solo tiene sentido cuando todo el dataset ya está en memoria; aquí los
> datos vienen paginados desde el API (§10.2), así que esos row models quedarían operando sobre
> una sola página de datos y producirían resultados incorrectos (p. ej. "ordenar por fecha"
> solo ordenaría los 20 registros visibles, no el dataset completo).

### 10.2 Integración con TanStack Query: paginación server-side

El patrón estándar por módulo (`use-<modulo>.ts`) combina el estado de página/filtro (local,
`useState` en la página) con una query que depende de ese estado como parte de la `queryKey`:

```ts
// src/features/payments/hooks/use-payments.ts
export function usePayments(params: { page: number; search?: string; status?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.PAYMENTS_LIST(params),
    queryFn: () => paymentsService.list(params),
    placeholderData: keepPreviousData, // evita parpadeo de loading al cambiar de página
    staleTime: 30_000,
  });
}
```

```tsx
// src/features/payments/pages/PaymentsPage.tsx
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const { data, isLoading, isError, error, refetch } = usePayments({ page, search });

// data.meta.total → totalCount de DataTable
// data.data       → data de DataTable
```

`keepPreviousData` (TanStack Query v5, importado como `placeholderData: keepPreviousData`) es
obligatorio en toda tabla paginada: sin él, cada cambio de página muestra el `TableSkeleton`
completo en vez de mantener la tabla anterior visible mientras carga la siguiente.

### 10.3 Acciones Bulk (selección múltiple)

Aplica a los módulos que lo requieran según su lógica de negocio (p. ej. Pagos: marcar varios
como pagados; PQR: cerrar varios; Residentes: cambiar estado en lote). No es obligatorio en
todos los módulos — se habilita con `enableRowSelection` solo donde el módulo lo necesite.

**Tipo de acción bulk:**

```ts
// src/components/shared/DataTable.types.ts
export interface BulkAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  /** Si retorna false para algún seleccionado, la acción se deshabilita y muestra el motivo. */
  isAvailable?: (rows: T[]) => boolean;
  unavailableReason?: string;
  onAction: (rows: T[]) => void | Promise<void>;
  /** Si true, pide confirmación con ConfirmDialog antes de ejecutar. */
  requiresConfirmation?: boolean;
  confirmationDescription?: string;
}
```

**Toolbar de selección:**

```tsx
// src/components/shared/BulkActionsToolbar.tsx
export function BulkActionsToolbar<T>({
  count,
  actions,
  selected,
  onDone,
}: {
  count: number;
  actions: BulkAction<T>[];
  selected: T[];
  onDone: () => void;
}) {
  const [pendingAction, setPendingAction] = useState<BulkAction<T> | null>(null);

  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-2">
      <span className="text-sm font-medium">{count} seleccionado(s)</span>
      <div className="flex gap-2">
        {actions.map((action) => {
          const disabled = action.isAvailable ? !action.isAvailable(selected) : false;
          return (
            <Button
              key={action.label}
              size="sm"
              variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
              disabled={disabled}
              title={disabled ? action.unavailableReason : undefined}
              onClick={() =>
                action.requiresConfirmation
                  ? setPendingAction(action)
                  : Promise.resolve(action.onAction(selected)).then(onDone)
              }
            >
              {action.icon}
              {action.label}
            </Button>
          );
        })}
      </div>
      {pendingAction && (
        <ConfirmDialog
          open
          onOpenChange={() => setPendingAction(null)}
          title={`¿${pendingAction.label}?`}
          description={pendingAction.confirmationDescription ?? ''}
          variant={pendingAction.variant === 'destructive' ? 'destructive' : 'default'}
          onConfirm={() =>
            Promise.resolve(pendingAction.onAction(selected)).then(() => {
              setPendingAction(null);
              onDone();
            })
          }
        />
      )}
    </div>
  );
}
```

**Ejemplo de uso (Pagos):**

```tsx
const markAsPaid = useUpdatePaymentStatus();

const paymentBulkActions: BulkAction<Payment>[] = [
  {
    label: 'Marcar como pagado',
    variant: 'default',
    isAvailable: (rows) => rows.every((r) => r.status !== 'paid'),
    unavailableReason: 'Algunos pagos seleccionados ya están pagados',
    requiresConfirmation: true,
    confirmationDescription: 'Se marcarán todos los pagos seleccionados como pagados.',
    onAction: async (rows) => {
      await Promise.all(rows.map((r) => markAsPaid.mutateAsync({ id: r.id, status: 'paid' })));
      toast.success(`${rows.length} pago(s) actualizados`);
    },
  },
];
```

> [!tip] Invalidación tras acción bulk
> Cada acción bulk dispara mutaciones individuales reutilizando los hooks ya existentes del
> módulo (`useUpdatePaymentStatus`, etc.), por lo que la invalidación de cache (`onSuccess` →
> `invalidateQueries`) ya está cubierta por esos hooks sin lógica adicional. No crear un
> endpoint ni hook "bulk" en el API a menos que [[01-api/API_CONTRACT]] ya lo defina explícitamente.

### 10.4 Columnas con acciones de fila

Las acciones individuales de fila (editar, ver detalle, eliminar) se definen como una columna
final sin `accessorKey`, usando `DropdownMenu`:

```tsx
{
  id: 'actions',
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Acciones para ${row.original.id}`}>
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/payments/${row.original.id}`)}>
          Ver detalle
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => setToDelete(row.original)}
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
```
