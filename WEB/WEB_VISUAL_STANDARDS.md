---
title: WEB_VISUAL_STANDARDS
type: design-system
tags: [urbania-web, design-system, visual, accesibilidad]
status: vigente
fuente_unica: true
ultima_revision: 2026-06-17
---

# 🎨 WEB_VISUAL_STANDARDS
## Estándares Visuales del Cliente Web Urbania

> [!important] Fuente única de verdad
> Este documento es la fuente única de verdad para toda decisión visual del cliente web. Define
> paleta, tipografía, espaciado, iconografía, patrones de interacción y estándares de
> accesibilidad. Antes de crear cualquier componente visual, consultar este documento. Los
> tokens referenciados en [[WEB_COMPONENTS]] son referencias a este documento, no definiciones —
> si hay discrepancia, este documento manda.

---

## 1. Identidad Visual

Urbania es un panel de administración para conjuntos residenciales. La identidad visual comunica:

- **Confianza y precisión**: datos financieros, gestión de personas y propiedades
- **Claridad**: el admin trabaja con información densa; la UI debe reducir carga cognitiva
- **Profesionalismo moderado**: no es un banco ni una startup; es una herramienta de gestión

**Principio de diseño**: Información primero. La UI no compite con los datos — los enmarca.
Cada elemento decorativo que no sirve a la lectura o acción se elimina.

---

## 2. Paleta de Colores

> [!warning] Tailwind v4: configuración CSS-first
> Esta documentación usa **Tailwind CSS v4**, que reemplaza `tailwind.config.ts` por
> configuración declarada directamente en CSS mediante el bloque `@theme`. No crear
> `tailwind.config.ts` para los tokens de color — todo se declara en `src/index.css` como se
> muestra en §2.1 y §2.2. Ver [[WEB_ARCHITECTURE]] §2 para la justificación de versión.

### 2.1 Paleta Base (CSS variables + `@theme inline`)

Configuración en `src/index.css` (entry point de estilos, importado una sola vez desde
`src/main.tsx`). Usar **modo claro** como base, con soporte a modo oscuro mediante la clase
`.dark` en `<html>`.

```css
/* src/index.css */
@import "tailwindcss";

@layer base {
  :root {
    /* Fondo y superficies */
    --background: 0 0% 100%;          /* #FFFFFF — fondo principal */
    --foreground: 222 47% 11%;        /* #0F172A — texto principal */

    --card: 0 0% 100%;                /* #FFFFFF — tarjetas */
    --card-foreground: 222 47% 11%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* Acciones principales — azul pizarra */
    --primary: 221 83% 53%;           /* #2563EB */
    --primary-foreground: 0 0% 100%;  /* #FFFFFF */

    /* Acciones secundarias */
    --secondary: 210 40% 96%;         /* #F1F5F9 */
    --secondary-foreground: 222 47% 11%;

    /* Elementos atenuados */
    --muted: 210 40% 96%;             /* #F1F5F9 */
    --muted-foreground: 215 16% 47%;  /* #64748B */

    /* Acentos interactivos */
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;

    /* Acciones destructivas */
    --destructive: 0 84% 60%;         /* #EF4444 */
    --destructive-foreground: 0 0% 100%;

    /* Bordes y separadores */
    --border: 214 32% 91%;            /* #E2E8F0 */
    --input: 214 32% 91%;
    --ring: 221 83% 53%;              /* Igual a primary */

    --radius: 0.5rem;                 /* 8px — radio de borde global */
  }

  .dark {
    --background: 222 47% 7%;         /* #0B1120 */
    --foreground: 213 31% 91%;        /* #E2E8F0 */
    --card: 222 47% 10%;
    --card-foreground: 213 31% 91%;
    --popover: 222 47% 10%;
    --popover-foreground: 213 31% 91%;
    --primary: 221 83% 60%;           /* Ligeramente más brillante en dark */
    --primary-foreground: 0 0% 100%;
    --secondary: 222 47% 15%;
    --secondary-foreground: 213 31% 91%;
    --muted: 222 47% 15%;
    --muted-foreground: 215 16% 57%;
    --accent: 222 47% 15%;
    --accent-foreground: 213 31% 91%;
    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 222 47% 18%;
    --input: 222 47% 18%;
    --ring: 221 83% 60%;
  }
}

/* Puente entre las variables HSL crudas y los nombres de color que Tailwind v4 expone
   como utilidades (bg-primary, text-foreground, border-border, etc.) */
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

> [!note] Por qué HSL y no oklch
> Algunos registros recientes de shadcn/ui usan `oklch()` para los valores de color en lugar de
> HSL. Este documento mantiene HSL porque son los valores ya validados y usados en el resto de
> la documentación (§2.3 con sus equivalentes hex). Si en el futuro se decide migrar a oklch,
> actualizar este documento primero — no convertir los valores manualmente sin verificar el
> resultado visual.

### 2.2 Colores Semánticos (Extensiones Custom)

Estos colores NO existen en shadcn/ui por defecto. Se agregan junto a los anteriores en
`src/index.css`, dentro de los mismos bloques `:root` / `.dark` y `@theme inline` — no en un
archivo separado.

```css
:root {
  /* Estados positivos */
  --success: 142 71% 45%;           /* #22C55E — verde */
  --success-foreground: 0 0% 100%;
  --success-muted: 142 76% 95%;     /* #F0FDF4 — fondo suave */

  /* Estados de alerta */
  --warning: 38 92% 50%;            /* #F59E0B — ámbar */
  --warning-foreground: 0 0% 100%;
  --warning-muted: 48 100% 95%;     /* #FFFBEB — fondo suave */

  /* Estados informativos */
  --info: 199 89% 48%;              /* #0EA5E9 — azul claro */
  --info-foreground: 0 0% 100%;
  --info-muted: 204 100% 95%;       /* #F0F9FF — fondo suave */
}
```

```css
/* Agregar al mismo bloque @theme inline de §2.1 */
@theme inline {
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-success-muted: hsl(var(--success-muted));
  --color-warning: hsl(var(--warning));
  --color-warning-foreground: hsl(var(--warning-foreground));
  --color-warning-muted: hsl(var(--warning-muted));
  --color-info: hsl(var(--info));
  --color-info-foreground: hsl(var(--info-foreground));
  --color-info-muted: hsl(var(--info-muted));
}
```

> [!tip] Zero-config content detection
> Tailwind v4 detecta automáticamente los archivos que usan sus clases (no requiere el array
> `content: [...]` de v3). No es necesario configurar rutas de escaneo para que `bg-success` o
> `text-warning` funcionen en componentes de `src/components/ui/`.

### 2.3 Tabla de Uso de Colores

| Token | Hex (light) | Cuándo usar | Cuándo NO usar |
|-------|-------------|-------------|----------------|
| `primary` | `#2563EB` | Botón CTA principal, link activo, indicador de progreso | Texto de cuerpo, fondos amplios |
| `destructive` | `#EF4444` | Eliminar, revocar, acciones irreversibles | Errores de validación de formulario |
| `success` | `#22C55E` | Estado "pagado", "activo", "aprobado", "confirmado" | Botones primarios |
| `warning` | `#F59E0B` | Estado "pendiente", "por vencer", alertas moderadas | Errores críticos |
| `info` | `#0EA5E9` | Estado "en revisión", "programado", tooltips informativos | Alertas de acción requerida |
| `muted-foreground` | `#64748B` | Texto secundario, placeholders, timestamps | Texto que requiere alta legibilidad |
| `border` | `#E2E8F0` | Separadores, bordes de card, dividers | Subrayados de texto |

### 2.4 Variantes de Badge Custom

Agregar en `src/components/ui/badge.tsx`:

```tsx
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        // Variantes custom para estados de negocio:
        success: 'border-transparent bg-success-muted text-success',
        warning: 'border-transparent bg-warning-muted text-warning',
        info: 'border-transparent bg-info-muted text-info',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);
```

> [!note]
> Ver [[WEB_COMPONENTS]] §2 para el uso de `StatusBadge` con estas variantes.

---

## 3. Tipografía

### 3.1 Fuentes

> [!warning] Sin `next/font` en Vite
> `next/font/google` es una API de Next.js sin equivalente en Vite. El enfoque idiomático y de
> mejores prácticas en un proyecto Vite es **self-host** las fuentes vía paquetes
> [Fontsource](https://fontsource.org/), que empaqueta los archivos `.woff2` como módulos npm
> versionados (sin llamadas a Google Fonts en runtime, mejor privacidad y rendimiento).

```bash
pnpm add @fontsource/inter @fontsource/jetbrains-mono
```

```ts
// src/main.tsx — importar los pesos necesarios una sola vez, antes de montar la app
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
```

```css
/* src/index.css */
@theme inline {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

| Rol | Fuente | Variable CSS | Uso |
|-----|--------|-------------|-----|
| Sans-serif (UI) | Inter | `--font-sans` | Todo el UI: etiquetas, botones, cuerpo, tablas |
| Monospace | JetBrains Mono | `--font-mono` | Código, UUIDs, trace IDs, valores técnicos |

**Justificación**: Inter es la fuente estándar de industria para dashboards de gestión por su
excelente legibilidad en tamaños pequeños y su soporte a caracteres latinos (números, tildes).
JetBrains Mono diferencia visualmente los valores técnicos del contenido de UI.

### 3.2 Escala Tipográfica

| Clase Tailwind | Tamaño | Peso | Line-height | Uso |
|---------------|--------|------|-------------|-----|
| `text-2xl font-semibold tracking-tight` | 24px | 600 | 1.3 | Título de página (`<h1>`) |
| `text-xl font-semibold` | 20px | 600 | 1.4 | Título de sección (`<h2>`), encabezado de card |
| `text-lg font-medium` | 18px | 500 | 1.5 | Subtítulos, ítems destacados |
| `text-base` | 16px | 400 | 1.5 | Cuerpo de texto, valores de formulario |
| `text-sm font-medium` | 14px | 500 | 1.5 | Labels de formulario, encabezados de tabla |
| `text-sm` | 14px | 400 | 1.5 | Cuerpo secundario, descripciones |
| `text-xs` | 12px | 400 | 1.5 | Metadata, timestamps, tooltips |
| `text-xs font-mono` | 12px | 400 | 1.5 | UUIDs, trace IDs, valores de código |

### 3.3 Reglas de Uso

- **Nunca usar font-size menor a 12px** (accesibilidad)
- **Máximo 3 niveles jerárquicos** por página para no saturar la escala
- **Números y montos en `font-variant-numeric: tabular-nums`** para que las tablas de pagos
  se alineen correctamente:
  ```css
  .tabular { font-variant-numeric: tabular-nums; }
  ```
- **Montos en pesos colombianos**: usar `font-mono text-sm` para cantidades en tablas

---

## 4. Espaciado y Layout

### 4.1 Sistema de Espaciado

Urbania usa exclusivamente el sistema de espaciado de Tailwind (base 4px). Los valores aprobados:

| Token | px | Uso |
|-------|----|-----|
| `gap-1` / `p-1` | 4px | Micro-espacios: icono + label |
| `gap-2` / `p-2` | 8px | Espaciado interno de badges, chips |
| `gap-3` / `p-3` | 12px | Padding de inputs, espaciado en listas densas |
| `gap-4` / `p-4` | 16px | Padding estándar de card, espaciado entre form fields |
| `gap-6` / `p-6` | 24px | Padding de secciones, espaciado entre grupos de contenido |
| `gap-8` / `p-8` | 32px | Padding de páginas en desktop, separación entre módulos |
| `gap-12` | 48px | Separación entre secciones de página |

> [!warning] Regla
> No mezclar valores fuera de esta lista sin justificación documentada.

### 4.2 Grid y Layout de Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Sidebar (240px fijo / 64px colapsado)  │  Main Content         │
│  ─────────────────────────────────────  │  ─────────────────    │
│  Logo + nombre                          │  Header (64px alto)   │
│  ─────────────────────────────────────  │  ─────────────────    │
│  Nav items                              │                       │
│    • Ícono + label (240px)              │  PageShell            │
│    • Solo ícono (64px)                  │  ┌────────────────┐  │
│                                         │  │ título + accns │  │
│  ─────────────────────────────────────  │  └────────────────┘  │
│  Avatar + nombre + logout               │  Contenido (scroll)   │
└─────────────────────────────────────────────────────────────────┘
```

```tsx
// Ancho máximo del contenido principal
<main className="flex-1 overflow-auto">
  <div className="mx-auto max-w-7xl px-6 py-8">
    {children}
  </div>
</main>
```

### 4.3 Breakpoints

| Nombre | px | Comportamiento |
|--------|-----|---------------|
| `sm` | 640px | Layout de mobile stack |
| `md` | 768px | Sidebar colapsado a iconos |
| `lg` | 1024px | Sidebar expandido (240px) |
| `xl` | 1280px | Contenido a max-width |
| `2xl` | 1536px | Sin cambios adicionales |

> [!note] Regla
> El sidebar debe ser completamente funcional en `md` (768px). Las tablas deben tener scroll
> horizontal en pantallas menores a `lg`.

---

## 5. Sombras y Elevación

Sistema de tres niveles de elevación:

| Nivel | Clase Tailwind | Uso |
|-------|---------------|-----|
| 0 — Plano | Sin sombra / `border` | Filas de tabla, inputs, dividers |
| 1 — Superficie | `shadow-sm` | Cards, sidebars, panels |
| 2 — Flotante | `shadow-md` | Dropdowns, popovers, toasts |
| 3 — Modal | `shadow-xl` | Dialogs, sheets, drawers |

> [!warning] Regla
> No usar `shadow-lg` ni `shadow-2xl` en componentes de UI — rompen la coherencia.

---

## 6. Radio de Borde

| Token | px | Componente |
|-------|----|-----------|
| `rounded-sm` | 4px | Badges, chips pequeños |
| `rounded-md` | 6px | Inputs, botones |
| `rounded-lg` | 8px | Cards, modales (= `--radius` global) |
| `rounded-xl` | 12px | Toasts, alertas prominentes |
| `rounded-full` | 9999px | Avatares, badges de conteo |

---

## 7. Iconografía

### 7.1 Librería: Lucide React

**Única librería de iconos aprobada.** No mezclar con `heroicons`, `react-icons` u otras.
Ver documentación en: https://lucide.dev

### 7.2 Tamaños Estándar

| Contexto | Prop `size` | Clase Tailwind |
|----------|------------|---------------|
| Ícono en nav (sidebar) | 20 | `size-5` |
| Ícono en botón | 16 | `size-4` |
| Ícono en input (prefijo/sufijo) | 16 | `size-4` |
| Ícono en badge | 12 | `size-3` |
| Ícono decorativo grande (EmptyState) | 48 | `size-12` |
| Ícono en StatsCard | 24 | `size-6` |

### 7.3 Iconos Asignados por Módulo

| Módulo | Ícono | Nombre Lucide |
|--------|-------|--------------|
| Dashboard | `LayoutDashboard` | `layout-dashboard` |
| Propiedades | `Building2` | `building-2` |
| Residentes | `Users` | `users` |
| Zonas comunes | `MapPin` | `map-pin` |
| Reservas | `CalendarCheck` | `calendar-check` |
| Pagos | `CreditCard` | `credit-card` |
| PQR | `MessageSquareWarning` | `message-square-warning` |
| Registro ingresos | `ClipboardList` | `clipboard-list` |
| Chat | `MessageCircle` | `message-circle` |
| Configuración | `Settings` | `settings` |
| Seguridad | `Shield` | `shield` |
| Cerrar sesión | `LogOut` | `log-out` |

### 7.4 Reglas de Uso

- Los iconos siempre usan `aria-hidden="true"` cuando van acompañados de texto
- Los iconos solos (sin texto visible) requieren `aria-label` en su contenedor o `sr-only` span
- No animar iconos salvo en estados de carga (spinner)
- Color del ícono: heredar del texto (`currentColor`) — no hardcodear colores en iconos

---

## 8. Componentes de Estado

### 8.1 Estados de Feedback al Usuario

| Acción | Componente | Duración |
|--------|-----------|---------|
| Éxito de mutación | `toast` (variante success) | 4 seg |
| Error de mutación (recuperable) | `toast` (variante destructive) | 6 seg |
| Error de red/fatal | `ErrorState` inline | Persistente |
| Operación en progreso | `Button` deshabilitado + spinner | Durante pending |
| Datos cargando | Skeleton component | Hasta isLoading = false |
| Lista vacía | `EmptyState` component | Persistente |
| Confirmación de acción destructiva | `ConfirmDialog` | Interacción requerida |

### 8.2 Mensajes de Estado Estándar

Los textos de UI deben usar estas frases canónicas (en español colombiano):

| Contexto | Texto |
|----------|-------|
| Carga genérica | "Cargando..." |
| Sin resultados | "No se encontraron resultados" |
| Error de conexión | "No se pudo conectar al servidor. Verifica tu conexión." |
| Error de permisos | "No tienes permisos para realizar esta acción." |
| Éxito al guardar | "{Entidad} guardado correctamente." |
| Éxito al eliminar | "{Entidad} eliminado correctamente." |
| Confirmación destructiva | "Esta acción no se puede deshacer. ¿Deseas continuar?" |
| Botón de carga | "{Verbo}ando..." (ej: "Guardando...", "Enviando...") |
| Sesión expirada | "Tu sesión ha expirado. Por favor inicia sesión nuevamente." |
| Demasiadas solicitudes | "Demasiados intentos. Espera un momento antes de volver a intentarlo." |

> [!note]
> El mensaje "Demasiadas solicitudes" corresponde al manejo de HTTP 429 especificado en
> [[WEB_API_CLIENT]] §3 y [[WEB_AUTH_IMPLEMENTATION]] §4.

### 8.3 Toast Notification

```tsx
// Uso correcto de toast en mutaciones
const mutation = useCreatePayment();

mutation.mutate(data, {
  onSuccess: () => toast.success('Pago registrado correctamente.'),
  onError: (error) => {
    const apiError = parseApiError(error);
    toast.error(apiError.message, {
      description: `Código: ${apiError.code} · Trace: ${apiError.traceId}`,
    });
  },
});
```

---

## 9. Formularios

### 9.1 Layout de Formulario

```
┌─────────────────────────────────────────┐
│ Label *                                  │
│ ┌─────────────────────────────────────┐ │
│ │ Input / Select / Textarea           │ │
│ └─────────────────────────────────────┘ │
│ Mensaje de error o descripción           │
└─────────────────────────────────────────┘
```

- **Label sobre input** (nunca placeholder-only)
- **Asterisco `*`** para campos requeridos, con leyenda "Campos obligatorios" visible
- **Mensaje de error** inmediatamente debajo del campo, en rojo (`text-destructive text-sm`)
- **Descripción/hint** inmediatamente debajo del campo, en gris (`text-muted-foreground text-xs`)
- **Spacing entre campos**: `space-y-4` dentro del formulario
- **Grupos de campos relacionados**: envolver en `<fieldset>` con `<legend>` visible

### 9.2 Ancho de Formularios

| Contexto | Ancho |
|----------|-------|
| Formulario en Dialog/Sheet | 100% del contenedor modal |
| Formulario en página standalone | `max-w-lg` |
| Formulario en panel lateral | 100% del panel |
| Campos cortos (código, teléfono) | `max-w-xs` |
| Campos de texto largo | 100% |

### 9.3 Botones de Acción de Formulario

```tsx
// Alineación de botones — siempre al final, justificados a la derecha
<div className="flex items-center justify-end gap-3 pt-4 border-t">
  <Button variant="outline" onClick={onCancel} type="button">
    Cancelar
  </Button>
  <Button type="submit" disabled={mutation.isPending}>
    {mutation.isPending ? (
      <>
        <Loader2 className="mr-2 size-4 animate-spin" />
        Guardando...
      </>
    ) : (
      'Guardar'
    )}
  </Button>
</div>
```

---

## 10. Tablas de Datos

> [!note] Especificación funcional completa
> Esta sección cubre la estructura visual de las tablas. La especificación funcional completa
> (configuración de TanStack Table, paginación server-side, acciones bulk con selección
> múltiple) está en [[WEB_COMPONENTS]] §10.

### 10.1 Estructura de Tabla

```tsx
// Columnas estándar en tablas Urbania
// 1. Selección (checkbox) — opcional, ver WEB_COMPONENTS §10.1
// 2. Identificador principal (nombre, ID corto)
// 3. Datos secundarios
// 4. Estado (StatusBadge)
// 5. Fecha (timestamp)
// 6. Acciones (DropdownMenu con acciones contextuales)

// Las columnas de acción siempre van al final y tienen ancho fijo
{
  id: 'actions',
  cell: ({ row }) => <PaymentRowActions payment={row.original} />,
  header: '',
  size: 48,      // px — solo icono de menú
}
```

### 10.2 Densidad de Tabla

| Modo | Clase de fila | Cuándo |
|------|--------------|--------|
| Normal | `h-14` | Tablas con 1-2 líneas de datos por fila |
| Compacto | `h-10` | Tablas con muchas filas o pantallas pequeñas |

### 10.3 Estados de Tabla

```tsx
// Siempre implementar los tres estados
if (isLoading) return <TableSkeleton rows={8} />;
if (isError) return (
  <ErrorState
    message="No se pudieron cargar los datos."
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

---

## 11. Animaciones y Transiciones

### 11.1 Valores Aprobados

| Elemento | Propiedad | Valor |
|---------|-----------|-------|
| Hover en botones | `transition-colors` | `duration-150` |
| Sidebar collapse | `transition-[width]` | `duration-200 ease-in-out` |
| Dialog/Sheet open | Animación de shadcn (Radix) | No modificar |
| Toast slide-in | Animación de shadcn/sonner | No modificar |
| Skeleton shimmer | `animate-pulse` | Tailwind default |
| Spinner de carga | `animate-spin` | Tailwind default, `Loader2` de Lucide |

### 11.2 Política de Reducción de Movimiento

```css
/* En src/index.css — respetar preferencia del usuario */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Accesibilidad (A11y)

### 12.1 Estándares Mínimos

| Estándar | Nivel | Descripción |
|---------|-------|-------------|
| WCAG 2.1 Contrast | AA | Relación mínima 4.5:1 para texto normal, 3:1 para texto grande |
| Navegación por teclado | AA | Todo elemento interactivo alcanzable con Tab |
| Focus visible | AA | Nunca `outline: none` sin reemplazo visual |
| Textos alternativos | AA | Todo ícono funcional tiene `aria-label` |
| Roles ARIA | AA | Landmarks: `main`, `nav`, `header`, `aside` |

### 12.2 Patrones ARIA Obligatorios

```tsx
// Errores de formulario — usar role="alert" para screen readers
{errors.email && (
  <p role="alert" className="text-sm text-destructive">
    {errors.email.message}
  </p>
)}

// Botones con solo ícono
<Button variant="ghost" aria-label="Ver opciones de Juan Pérez">
  <MoreHorizontal className="size-4" aria-hidden="true" />
</Button>

// Loading state accesible
<Button disabled aria-busy={true}>
  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
  <span>Guardando...</span>
</Button>

// Tabla con caption
<Table>
  <caption className="sr-only">Lista de pagos pendientes</caption>
  ...
</Table>

// Skip link (en el layout principal)
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
>
  Saltar al contenido principal
</a>
```

### 12.3 Gestión de Foco en Modales

```tsx
// Los Dialog de shadcn/ui gestionan el foco automáticamente
// pero se debe verificar:
// 1. Al abrir: foco va al primer elemento interactivo
// 2. Al cerrar: foco regresa al elemento disparador
// 3. Tab queda atrapado dentro del modal (focus trap)
// 4. Escape cierra el modal

// En formularios modales, hacer foco en el primer input:
<DialogContent>
  <Input
    autoFocus  // Poner en el primer campo relevante
    ...
  />
</DialogContent>
```

---

## 13. Responsividad

### 13.1 Comportamiento por Breakpoint

| Componente | Mobile (< md) | Tablet (md) | Desktop (lg+) |
|-----------|--------------|-------------|---------------|
| Sidebar | Oculto (drawer off-canvas) | Colapsado (solo iconos) | Expandido (label + icono) |
| DataTable | Scroll horizontal | Scroll horizontal | Ancho completo |
| Dashboard grid | 1 columna | 2 columnas | 4 columnas (StatsCards) |
| Dialog | Full screen | Centered modal | Centered modal |
| PageShell actions | Bajo del título | Junto al título | Junto al título |

### 13.2 Tablas en Mobile

```tsx
// Las tablas en mobile deben tener scroll horizontal
<div className="overflow-x-auto rounded-lg border">
  <Table>
    ...
  </Table>
</div>

// Columnas a ocultar en mobile:
// - Timestamps secundarios
// - Columnas de metadata
// NUNCA ocultar: nombre/identificador, estado, acciones
```

---

## 14. Modo Oscuro

El cliente web debe soportar modo oscuro usando la clase `.dark` en el elemento `<html>`.
Seguir la preferencia del sistema operativo por defecto.

> [!note] `next-themes` es framework-agnóstico a pesar del nombre
> El paquete `next-themes` gestiona la clase `.dark` en `<html>` con persistencia en
> `localStorage` y sincronización con la preferencia del sistema, sin ninguna dependencia real
> de Next.js — funciona igual en cualquier app de React, incluyendo una SPA de Vite. Se mantiene
> como dependencia aprobada por esa razón. La directiva `'use client'` de la versión anterior de
> este documento se elimina: es exclusiva del App Router de Next.js y no tiene efecto (ni es
> válida) en un proyecto Vite — todo el árbol de componentes es ya "cliente".

```tsx
// src/app/providers/ThemeProvider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

**Dependencia**: `pnpm add next-themes`

---

## 15. Print Styles

Para la exportación de comprobantes de pago desde `/payments/:id` (ver convención de rutas en
[[WEB_ARCHITECTURE]] §4):

```css
/* En src/index.css */
@media print {
  /* Ocultar elementos de navegación */
  aside, header, .no-print { display: none !important; }

  /* Expandir contenido al 100% */
  main { margin: 0; padding: 0; }

  /* Mostrar URLs de links */
  a[href]::after { content: " (" attr(href) ")"; }

  /* Colores de impresión */
  * {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
  }

  /* Evitar cortes en secciones */
  .print-avoid-break { break-inside: avoid; }
}
```

---

## 16. Checklist Visual por Componente

Antes de dar por terminado cualquier componente de UI, verificar:

- [ ] Los colores usados están en la paleta definida en §2
- [ ] La tipografía usa la escala de §3
- [ ] El espaciado usa valores de §4
- [ ] Los iconos son de Lucide y tienen el tamaño correcto de §7
- [ ] Estados de loading/error/vacío implementados (§8)
- [ ] Contraste AA verificado (§12.1)
- [ ] Focus visible implementado (§12.1)
- [ ] Etiquetas ARIA correctas (§12.2)
- [ ] Comportamiento responsive definido (§13)
- [ ] `prefers-reduced-motion` respetado (§11.2)
- [ ] Compatible con modo oscuro (§14)
