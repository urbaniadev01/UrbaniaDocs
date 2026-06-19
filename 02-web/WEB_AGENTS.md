---
title: WEB_AGENTS
type: guia-navegacion
tags: [urbania-web, agente, navegacion, fuente-unica]
status: vigente
ultima_revision: 2026-06-17
---

# 📚 URBANIA WEB - AGENTS_GUIDE
## Documento Principal de Referencia para el Cliente Web

> [!important] Instrucción para el agente
> Lee este documento **siempre** al inicio de cada tarea. Es tu mapa de navegación. Extrae las
> reglas de oro. Luego consulta la fase específica según el tipo de tarea.

> [!important] Alcance de la documentación
> Esta documentación contiene **todas** las especificaciones técnicas del cliente web Urbania.
> Si encuentras una inconsistencia, error o incoherencia, repórtalo de inmediato en
> `WEB_SESSION_MANIFEST.md` § Bloqueos. No consultes documentos externos durante la
> implementación — la única excepción es `API_CONTRACT.md` del repositorio del API, para
> verificar contratos de endpoints.

> [!warning] Si necesitas cambiar algo en la configuración o arquitectura, detente y consúltalo primero.

---

## Tu Rol

Ingeniero senior especializado en React, TypeScript y Vite. Construir el cliente web
administrativo de Urbania (panel de gestión de propiedades horizontales): escalable,
mantenible, modular y seguro. El cliente web se comunica exclusivamente con la Urbania API
REST — nunca accede a la base de datos directamente. Stack completo y su justificación en
[[WEB_ARCHITECTURE]] §2.

---

## 🗺️ Mapa de Documentación

```
├── WEB_AGENTS.md          ← Mapa de navegación (SIEMPRE primero)
├── WEB_ARCHITECTURE.md          ← Stack, estructura de carpetas, principios, ADRs (FUENTE ÚNICA)
├── WEB_SETUP_GUIDE.md           ← Inicialización paso a paso
├── WEB_AUTH_IMPLEMENTATION.md   ← Autenticación JWT en el cliente (FUENTE ÚNICA)
├── WEB_API_CLIENT.md            ← Capa de integración con la API REST
├── WEB_COMPONENTS.md            ← Sistema de componentes (catálogo, patrones)
├── WEB_VISUAL_STANDARDS.md      ← Design system: colores, tipografía, espaciado, a11y (FUENTE ÚNICA)
├── WEB_FEATURES_INDEX.md        ← Catálogo de módulos y estado
├── WEB_IMPLEMENTATION_PLAN.md   ← Plan de sesiones (FUENTE ÚNICA)
├── WEB_SESSION_MANIFEST.md      ← Estado actual entre sesiones
├── WEB_TESTING.md               ← Especificaciones de pruebas
└── WEB_DEVELOPMENT_GUIDE.md     ← Troubleshooting y decisiones técnicas del día a día
```

> [!note] Relación con el API
> Este cliente consume la `Urbania API REST`. El contrato de integración está en
> [[WEB_API_CLIENT]]. Ante cualquier duda sobre endpoints, request/response o errores, la
> fuente de verdad es `API_CONTRACT.md` del repositorio del API.

> [!note] Tokens de color y tipografía
> [[WEB_COMPONENTS]] hace referencia a tokens. Los tokens están **definidos** en
> [[WEB_VISUAL_STANDARDS]]. Si hay discrepancia, [[WEB_VISUAL_STANDARDS]] tiene prioridad.

> [!note] Stack y estructura de carpetas
> [[WEB_ARCHITECTURE]] es la fuente única para el stack tecnológico y la organización de
> `src/`. Si cualquier otro documento describe una ruta de archivo o un paquete que contradice
> [[WEB_ARCHITECTURE]], [[WEB_ARCHITECTURE]] tiene prioridad.

---

## Flujo de Trabajo por Tipo de Tarea

### 1. Implementar módulo nuevo (feature)

**Documentos a consultar (en orden):**
1. [[WEB_IMPLEMENTATION_PLAN]] → Identificar sesión actual
2. [[WEB_SESSION_MANIFEST]] → Verificar estado del proyecto
3. `WEB_AGENTS.md` → Navegación (actual)
4. [[WEB_ARCHITECTURE]] → Estructura de carpetas (§4), convenciones (§5)
5. [[WEB_API_CLIENT]] → Endpoints del módulo
6. [[WEB_COMPONENTS]] → Componentes disponibles reutilizables
7. [[WEB_VISUAL_STANDARDS]] → Tokens, patrones visuales
8. [[WEB_FEATURES_INDEX]] → Actualizar estado al terminar

**Checklist:**
- [ ] Verificar que el módulo no existe en [[WEB_FEATURES_INDEX]]
- [ ] Identificar endpoints necesarios en [[WEB_API_CLIENT]] (verificar contra `API_CONTRACT.md`)
- [ ] Crear la carpeta de feature `src/features/<modulo>/{api,hooks,components,pages,types}` según [[WEB_ARCHITECTURE]] §4.1
- [ ] Definir tipos TypeScript del módulo en `src/features/<modulo>/types/`
- [ ] Crear query/mutation hooks con TanStack Query
- [ ] Implementar páginas y componentes siguiendo patrones de [[WEB_COMPONENTS]]
- [ ] Aplicar tokens visuales de [[WEB_VISUAL_STANDARDS]]
- [ ] Conectar formularios con React Hook Form + Zod
- [ ] Registrar la(s) ruta(s) en `src/app/router.tsx` con `lazy()` (code splitting por feature)
- [ ] Envolver con `ProtectedRoute`/`AdminOnlyRoute` si aplica
- [ ] Implementar los tres estados: loading (Skeleton), error (ErrorState), vacío (EmptyState)
- [ ] Crear tests según [[WEB_TESTING]]
- [ ] Ejecutar `pnpm lint`, `pnpm type-check`, `pnpm test`
- [ ] Actualizar [[WEB_FEATURES_INDEX]] a "Completado"

---

### 2. Crear página/ruta nueva

**Documentos a consultar:**
1. [[WEB_ARCHITECTURE]] → Convenciones de rutas y carpetas (§4, §5)
2. [[WEB_API_CLIENT]] → Endpoints necesarios
3. [[WEB_COMPONENTS]] → Componentes a reutilizar
4. [[WEB_VISUAL_STANDARDS]] → Layout, espaciado, responsividad
5. [[WEB_AUTH_IMPLEMENTATION]] → Si la página requiere autenticación o roles

**Checklist:**
- [ ] Crear archivo de página en `src/features/<modulo>/pages/<Nombre>Page.tsx`
- [ ] Registrar la ruta en `src/app/router.tsx` con `lazy: () => import('@/features/.../pages/...')`
- [ ] Mostrar `FullPageLoader`/Skeleton mientras el chunk lazy se descarga (`<Suspense>` o el
      fallback de `lazy` del data router)
- [ ] Conectar con la query/mutation del módulo
- [ ] Proteger con `ProtectedRoute` (sesión) y `AdminOnlyRoute` (rol) si aplica — todo el
      dashboard requiere rol `admin`
- [ ] Verificar responsividad según [[WEB_VISUAL_STANDARDS]] §13

---

### 3. Crear o modificar componente

**Documentos a consultar:**
1. [[WEB_COMPONENTS]] → Catálogo de componentes existentes
2. [[WEB_VISUAL_STANDARDS]] → Design system completo
3. [[WEB_ARCHITECTURE]] → Convenciones de nomenclatura (§5)

**Checklist:**
- [ ] Verificar que el componente no existe en [[WEB_COMPONENTS]]
- [ ] Definir props con interfaz TypeScript explícita (sin `any`)
- [ ] Usar tokens del design system de [[WEB_VISUAL_STANDARDS]]
- [ ] Componente es accesible (ver [[WEB_VISUAL_STANDARDS]] §12)
- [ ] Añadir variantes si aplica
- [ ] Verificar el checklist visual de [[WEB_VISUAL_STANDARDS]] §16
- [ ] Documentar en [[WEB_COMPONENTS]] si es reutilizable entre features
- [ ] Crear test con Vitest + Testing Library

---

### 4. Implementar integración con API

**Documentos a consultar:**
1. [[WEB_API_CLIENT]] → Contrato y cliente Axios
2. [[WEB_AUTH_IMPLEMENTATION]] → Manejo de tokens y errores de auth

**Checklist:**
- [ ] Verificar el endpoint contra `API_CONTRACT.md` antes de implementar
- [ ] Definir tipo de respuesta TypeScript usando `ApiResponse<T>`
- [ ] Crear función en `src/features/<modulo>/api/<modulo>.service.ts`
- [ ] Crear hook TanStack Query (`useQuery` o `useMutation`) en `src/features/<modulo>/hooks/`
- [ ] Manejar errores de API con `ApiError` tipado
- [ ] Agregar el error al mapa de [[WEB_AUTH_IMPLEMENTATION]] §10 si es nuevo
- [ ] Añadir invalidación de cache post-mutación

---

### 5. Modificar autenticación o sesión

**Documentos a consultar:**
1. [[WEB_AUTH_IMPLEMENTATION]] → COMPLETO (FUENTE ÚNICA)
2. [[WEB_API_CLIENT]] → Endpoints de auth

**Checklist:**
- [ ] Verificar flujo de silent refresh (`silentRefresh()` centralizado en `auth.service.ts`)
- [ ] Verificar manejo de `MFA_REQUIRED`
- [ ] Verificar expiración de sesión y redirect a `/login`
- [ ] Access token NUNCA en `localStorage` ni `sessionStorage`
- [ ] El interceptor de Axios excluye el endpoint `/auth/refresh` para evitar bucles
- [ ] El bootstrap del layout protegido usa `silentRefresh()` de `auth.service.ts`
- [ ] Si la cookie de refresh usa `SameSite=Strict`, no se requiere token CSRF adicional para
      mutaciones (ver [[WEB_AUTH_IMPLEMENTATION]] §11.4); si cambia a `Lax` o `None`, agregar CSRF

---

### 6. Testing

**Documentos a consultar:**
1. [[WEB_TESTING]] → COMPLETO
2. [[WEB_COMPONENTS]] → Comportamiento esperado de componentes

**Checklist:**
- [ ] Test unitario para funciones utilitarias y validators
- [ ] Test de componente con Testing Library + MSW
- [ ] Test e2e con Playwright para flujos críticos
- [ ] MSW handlers de error usan `server.use()` por test, no en el array base
- [ ] Cobertura según umbrales de [[WEB_TESTING]] §4

---

## ⚠️ Reglas de Oro (Nunca violar)

| # | Regla | Consecuencia de violar |
|---|-------|----------------------|
| 1 | **Access token NUNCA en localStorage/sessionStorage** | XSS puede robar la sesión |
| 2 | **Refresh token NUNCA manipulado en JS** | Cookie `httpOnly` lo gestiona automáticamente |
| 3 | **Todo fetch autenticado pasa por `apiClient` de Axios** | Se pierde el silent refresh |
| 4 | **TypeScript estricto, sin `any`** | Errores de tipo en runtime |
| 5 | **Nunca mostrar datos de otro rol** | Verificar `role` antes de renderizar |
| 6 | **Formularios siempre con Zod + React Hook Form** | Validación inconsistente |
| 7 | **Code splitting por feature, no por componente individual** | Demasiados chunks pequeños, peor rendimiento |
| 8 | **Manejo de errores en toda llamada al API** | Errores silenciosos sin UI de feedback |
| 9 | **Toda UI usa tokens de [[WEB_VISUAL_STANDARDS]]** | Incoherencia visual entre módulos |
| 10 | **Actualizar [[WEB_SESSION_MANIFEST]] al final de cada sesión** | Estado perdido entre sesiones |
| 11 | **No duplicar información entre documentos** | Divergencia entre versiones |
| 12 | **Un error de API → un mensaje claro al usuario** | Silencio ante fallos rompe la confianza |
| 13 | **El interceptor Axios excluye `/auth/refresh`** | Bucle infinito de refresh |
| 14 | **Echo reconfigura token tras silent refresh** | Headers de WebSocket con token expirado |
| 15 | **Ninguna feature importa archivos internos de otra feature** | Acoplamiento accidental, rompe el modelo feature-based |

---

## ⚠️ Regla Crítica: Verify Before Assume

> [!danger] Nunca confíes ciegamente en el estado reportado de tareas anteriores.

Si continúas una sesión anterior:
1. Verificar que los archivos mencionados en el manifest existen (`bash: ls src/`)
2. Ejecutar `pnpm type-check` y `pnpm test` para confirmar el estado real
3. Reportar discrepancias en la sección "Bloqueos" del manifest antes de continuar

Si `pnpm ci` falla al cerrar una sesión:
- **NO** marcar el módulo como "Completado" en [[WEB_FEATURES_INDEX]]
- Documentar el fallo específico en la sección "Bloqueos" de [[WEB_SESSION_MANIFEST]]
- Indicar el estado como "🔴 Bloqueado" en lugar de "✅ Completado"

---

## Checklist Final antes de Entregar

- [ ] `pnpm type-check` sin errores (TypeScript strict)
- [ ] `pnpm lint` sin warnings (ESLint)
- [ ] `pnpm test` pasa (Vitest unit + component)
- [ ] `pnpm test:e2e` pasa en los flujos críticos (Playwright)
- [ ] `pnpm build` genera `dist/` sin errores
- [ ] No hay `console.log`, `any`, ni código comentado
- [ ] Todos los componentes tienen tipos explícitos
- [ ] Checklist visual de [[WEB_VISUAL_STANDARDS]] §16 verificado
- [ ] Formularios validan con Zod antes de enviar al API
- [ ] Estados de carga, error y vacío en toda vista con datos
- [ ] Rutas protegidas verifican autenticación y rol `admin`
- [ ] [[WEB_SESSION_MANIFEST]] actualizado
- [ ] [[WEB_FEATURES_INDEX]] actualizado

---

## Referencias Rápidas por Documento

| Documento | Propósito | Cuándo consultar |
|-----------|-----------|-----------------|
| `WEB_AGENTS.md` | Mapa de navegación | Siempre primero |
| [[WEB_ARCHITECTURE]] | Stack, estructura, convenciones, ADRs | Antes de implementar cualquier cosa |
| [[WEB_SETUP_GUIDE]] | Inicialización | Al iniciar el proyecto |
| [[WEB_IMPLEMENTATION_PLAN]] | Plan de sesiones | Antes de cualquier tarea |
| [[WEB_SESSION_MANIFEST]] | Estado actual | Al retomar trabajo |
| [[WEB_AUTH_IMPLEMENTATION]] | Autenticación JWT cliente | Tareas de auth/sesión |
| [[WEB_API_CLIENT]] | Integración con API REST | Tareas de integración |
| [[WEB_COMPONENTS]] | Catálogo de componentes, patrones UI | Al crear/modificar UI |
| [[WEB_VISUAL_STANDARDS]] | Design system completo | Cualquier decisión visual |
| [[WEB_FEATURES_INDEX]] | Catálogo de módulos | Al agregar/completar módulo |
| [[WEB_TESTING]] | Especificaciones de pruebas | Al crear/modificar tests |
| [[WEB_DEVELOPMENT_GUIDE]] | Troubleshooting, decisiones técnicas, DevOps | Al encontrar problemas |
