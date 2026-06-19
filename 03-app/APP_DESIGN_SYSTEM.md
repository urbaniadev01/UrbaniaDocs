---
type: reference
status: active
priority: P1
module: mobile
tags: [design, ui, material3, mobile]
updated: 2026-06-18
---

# 🎨 DESIGN_SYSTEM
## Sistema de Diseño Visual de Urbania App

> [!info] Consultar
> Antes de crear cualquier pantalla, componente o variante visual nueva.

> [!info] Decisión base
> **Material Design 3 como fundación, adaptado a marca propia**, con ajustes puntuales hacia el lenguaje nativo de iOS donde el usuario lo espera (gestos, action sheets). Es la elección estándar para apps Flutter multiplataforma competitivas: M3 ya está integrado nativamente en el framework (`ColorScheme.fromSeed`, `useMaterial3: true`), reduce trabajo de mantenimiento de un sistema 100% custom, y permite *dynamic color* en Android 12+ si se desea más adelante. Un sistema 100% custom se justificaría solo si la marca tiene restricciones visuales muy fuertes ya definidas (no es el caso aún); replicar Cupertino exacto en iOS y Material exacto en Android duplicaría el esfuerzo de diseño y QA visual sin beneficio claro en este dominio (app de gestión, no un juego o producto "showcase" de marca).

---

## 1. Tokens de Diseño

### 1.1 Color

Generado a partir de un **color semilla de marca** con `ColorScheme.fromSeed()`, no colores sueltos hardcodeados:

```dart
final lightScheme = ColorScheme.fromSeed(
  seedColor: const Color(0xFF0B5FFF), // placeholder — color de marca real pendiente de diseño
  brightness: Brightness.light,
);
final darkScheme = ColorScheme.fromSeed(
  seedColor: const Color(0xFF0B5FFF),
  brightness: Brightness.dark,
);
```

| Token semántico | Uso |
|---|---|
| `colorScheme.primary` | Acciones principales, CTA primario (ej. "Reservar", "Pagar") |
| `colorScheme.secondary` | Acciones secundarias, chips de filtro |
| `colorScheme.error` | Estados de error, validaciones fallidas |
| `colorScheme.surface` / `surfaceContainer*` | Fondos de tarjetas, jerarquía de elevación sin sombra dura (estilo M3) |
| Colores custom de dominio (ej. estado "pago pendiente" en ámbar, "visita aprobada" en verde) | Definidos como extensión de `ThemeData` (`ThemeExtension`), **no** como constantes sueltas — así responden a modo claro/oscuro automáticamente |

> [!warning] Prohibido
> Ningún widget usa `Color(0xFF...)` directo fuera de `core/theme/`. Todo color en pantallas/widgets de feature se referencia vía `Theme.of(context).colorScheme.*` o las extensiones custom — esto es lo que permite dark mode y theming de marca sin tocar cada pantalla.

### 1.2 Tipografía

- Familia tipográfica: a definir con diseño (recomendado: una fuente variable vía `google_fonts`, ej. Inter o Manrope — buena legibilidad en pantallas pequeñas y soporte completo de acentos/ñ para español).
- Escala tipográfica M3 estándar (`displayLarge` … `labelSmall`) — no inventar tamaños sueltos por pantalla.
- Tamaño mínimo de texto de cuerpo: 14sp. Nunca por debajo de eso para contenido legible (ver [[APP_ACCESSIBILITY]] §2 sobre escalado dinámico).

### 1.3 Espaciado y Layout

- Sistema de espaciado en múltiplos de **4dp** (`4, 8, 12, 16, 24, 32, 48`) expuesto como constantes (`AppSpacing.sm`, `AppSpacing.md`, etc.) en `core/theme/spacing.dart`.
- Grid de contenido: márgenes laterales de 16dp en móvil; ancho máximo de contenido de 600dp en tablets para evitar líneas de texto excesivamente largas.
- Touch targets mínimos: **48x48dp** sin excepción (ver [[APP_ACCESSIBILITY]] §3).

### 1.4 Elevación y Forma

- Usar elevación M3 basada en `surfaceTint` + tono de superficie en vez de sombras duras tradicionales.
- Radio de esquina estándar: `12dp` para tarjetas, `8dp` para botones, `28dp`/circular para FABs y elementos de navegación inferior — consistente con la guía M3, no valores arbitrarios por componente.

---

## 2. Theming: Claro / Oscuro / Sistema

```dart
MaterialApp.router(
  theme: AppTheme.light,
  darkTheme: AppTheme.dark,
  themeMode: ref.watch(themeModePreferenceProvider), // system | light | dark
);
```

- Modo oscuro es **obligatorio desde el MVP**, no un "nice to have" post-lanzamiento — es un estándar de mercado en 2026 y trivial de soportar correctamente si se respeta la regla de §1.1 (nunca colores hardcodeados).
- Preferencia de tema persistida en `app_preferences` (no sensible, sobrevive logout — ver [[APP_DATA_STRATEGY]] §3).

---

## 3. Componentes Globales (`core/widgets/`)

| Componente | Uso |
|---|---|
| `AppButton` (primary/secondary/destructive/text) | Wrapper sobre `FilledButton`/`OutlinedButton`/`TextButton` con estados de loading integrados (evita que cada feature reimplemente un spinner dentro de un botón) |
| `AppTextField` | Wrapper sobre `TextFormField` con estilo y manejo de error consistente, conectado a los mensajes de §3 de [[APP_API_INTEGRATION]] (`VALIDATION_ERROR` por campo) |
| `AppEmptyState` | Estado vacío reutilizable (sin reservas, sin mensajes, sin notificaciones) — ilustración + texto + CTA opcional |
| `AppErrorView` | Vista de error reutilizable conectada al `Failure` tipado de [[APP_ARCHITECTURE]] §6 — un solo lugar que decide cómo se ve un error de red vs un error de negocio |
| `OfflineBanner` | Banner persistente no intrusivo — ver [[APP_DATA_STRATEGY]] §2 |
| `AppLoadingIndicator` / Skeletons | Loading states — preferir **skeleton screens** (shimmer) sobre spinners genéricos para listas (reservas, avisos, chat) — percepción de velocidad notablemente mejor y es lo esperado en apps competitivas de 2026 |
| `AppBottomSheet` | Wrapper estándar para acciones contextuales (cancelar reserva, opciones de mensaje) |
| `AppAvatar` | Avatar con fallback a iniciales del usuario si no hay `avatar_url` (ver `API_CONTRACT` campo `avatar_url` nullable) |

> [!tip] Catálogo visual
> Mantener una pantalla de desarrollo tipo "component gallery" (accesible solo en flavor `dev`) que renderiza todos los componentes de `core/widgets/` con sus variantes — facilita QA visual y onboarding de nuevos diseñadores/devs sin tener que navegar toda la app para encontrar cada estado.

---

## 4. Navegación Visual

- **Bottom navigation bar** (3-5 destinos principales: Home, Reservas/Visitas, Chat, Notificaciones, Perfil) — patrón estándar y más usado en apps de gestión residencial por su descubribilidad.
- Uso de `Badge` en los íconos de navegación para conteos no leídos (chat, notificaciones) — debe limpiarse optimistamente al entrar a la sección, no esperar al round-trip del API.
- Transiciones de página: usar las transiciones nativas por plataforma que go_router/Flutter ya provee (`CupertinoPage` en iOS, Material en Android) en vez de forzar una transición custom única — coherencia con las expectativas de cada SO sin el costo de un design system 100% nativo por plataforma.

---

## 5. Imágenes e Ilustración

- Set de ilustraciones para estados vacíos/onboarding: SVG vía `flutter_svg`, no PNG (escalabilidad, tamaño de bundle).
- Iconografía: Material Symbols (vía `material_symbols_icons` o el set ya incluido en Flutter) como base; iconos custom de dominio (ej. ícono de "zona común", "portería") como SVG en `assets/icons/`.

---

## 6. Checklist de Diseño antes de Cerrar una Pantalla

- [ ] Usa solo tokens de `core/theme/` (ningún color/tamaño hardcodeado)
- [ ] Tiene estado de carga (skeleton, no solo spinner si es una lista)
- [ ] Tiene estado vacío (`AppEmptyState`)
- [ ] Tiene estado de error (`AppErrorView`) conectado a `Failure`
- [ ] Funciona en modo claro y oscuro
- [ ] Touch targets ≥48dp
- [ ] Revisado contra [[APP_ACCESSIBILITY]] antes de marcar como terminada

---

## 7. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_ACCESSIBILITY]] | Requisitos no negociables que se aplican sobre estos componentes |
| [[APP_ARCHITECTURE]] | Dónde vive `core/theme/` y `core/widgets/` en el proyecto |
| [[APP_FEATURE_SCOPE]] | Inventario de pantallas que deben construirse con este sistema |
