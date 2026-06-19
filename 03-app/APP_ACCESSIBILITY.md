---
type: reference
status: active
priority: P1
module: mobile
tags: [accessibility, a11y, mobile, wcag]
updated: 2026-06-18
---

# ♿ ACCESSIBILITY
## Estándares de Accesibilidad de Urbania App

> [!info] Consultar
> Antes de cerrar (marcar como "Implementado") cualquier pantalla o componente nuevo. No es una fase posterior al desarrollo — se verifica en la misma sesión en que se construye la UI.

> [!info] Marco de referencia
> Estas reglas son la adaptación práctica de **WCAG 2.2 nivel AA** al contexto de una app Flutter nativa (no web), usando las capacidades de accesibilidad propias de Flutter (`Semantics`, `MediaQuery.textScaler`, `ExcludeSemantics`) más las guías específicas de cada plataforma (Android Accessibility, iOS Accessibility / VoiceOver).

---

## 1. Por qué importa en este dominio

La base de usuarios de una app de administración de propiedades horizontales incluye necesariamente un rango amplio de edad y capacidad — residentes mayores, personas con baja visión, usuarios de lectores de pantalla. No es un "nice to have" de marca: es un requisito funcional real para que el producto sea usable por toda la comunidad que administra.

---

## 2. Texto y Escalado

| Regla | Detalle |
|---|---|
| Respetar el escalado de texto del sistema | Nunca fijar tamaños de texto con `fontSize` absoluto que ignore `MediaQuery.textScaler`. Probar la app con el escalado del sistema al 130%-200% y verificar que no se corta ni se superpone texto |
| Tamaño mínimo de texto de cuerpo | 14sp (ver [[APP_DESIGN_SYSTEM]] §1.2) |
| Contraste de color | Mínimo **4.5:1** para texto normal, **3:1** para texto grande (≥18sp) y elementos gráficos — verificar cada combinación de `colorScheme` (claro y oscuro) con una herramienta de contraste antes de aprobar una paleta |
| No usar solo color para transmitir estado | Ej. "pago rechazado" no debe depender solo del color rojo — acompañar siempre con ícono y/o texto |

---

## 3. Touch Targets y Navegación Táctil

- Tamaño mínimo de objetivo táctil: **48x48dp** (estándar Android) — también cumple el mínimo de iOS (44x44pt ≈ equivalente).
- Espaciado mínimo entre objetivos táctiles adyacentes: 8dp, para evitar toques accidentales (relevante para usuarios con temblor o dificultad motriz fina).
- Todo elemento interactivo (botón, ítem de lista, ícono de acción) debe tener un área táctil real de ese tamaño, **aunque el ícono visual sea más pequeño** (usar `padding`/`InkWell` con tamaño mínimo, no confiar en el tamaño visual del ícono).

---

## 4. Lectores de Pantalla (VoiceOver / TalkBack)

| Regla | Implementación Flutter |
|---|---|
| Toda imagen/ícono informativo tiene una descripción | `Semantics(label: '...')` o `Image(semanticLabel: '...')` |
| Imágenes puramente decorativas se excluyen del árbol semántico | `ExcludeSemantics` — evita ruido innecesario al navegar con lector de pantalla |
| Orden de lectura lógico | Verificar que el `Semantics`/orden del widget tree coincide con el orden visual esperado, especialmente en layouts con `Stack` o posicionamiento absoluto |
| Botones con solo ícono tienen `tooltip`/`label` | Ej. el ícono de "cerrar" en un modal debe anunciarse como "Cerrar", no como "botón" sin contexto |
| Formularios anuncian errores de validación | Usar `Semantics(liveRegion: true)` o el manejo nativo de `TextFormField.errorText` (Flutter ya lo expone correctamente al framework de accesibilidad) para que el lector de pantalla anuncie el error sin que el usuario tenga que buscarlo |
| Estados de carga se anuncian | Un skeleton/spinner debe tener `Semantics(label: 'Cargando reservas')`, no quedar mudo para el lector de pantalla |

> [!tip] Verificación obligatoria
> Activar TalkBack (Android) o VoiceOver (iOS) y navegar el flujo completo de **login, MFA y la feature principal en desarrollo** al menos una vez antes de cerrar cada sesión de [[APP_IMPLEMENTATION_PLAN]] que toque UI nueva. No basta con revisar el código — la verificación manual con el lector de pantalla activo es la única forma confiable de detectar problemas de orden de lectura.

---

## 5. Movimiento y Animaciones

- Respetar la preferencia de "reducir movimiento" del sistema (`MediaQuery.disableAnimations` en Flutter refleja esta configuración de accesibilidad del SO) — las transiciones decorativas deben poder desactivarse o simplificarse.
- Ninguna información crítica se transmite **solo** mediante una animación que pueda perderse (ej. un check animado de "guardado" debe ir acompañado de un cambio de estado persistente en la UI, no solo del efecto transitorio).

---

## 6. Formularios y Entrada de Datos

- Etiquetas de campo siempre visibles (no solo placeholder que desaparece al escribir) — mejora tanto accesibilidad como usabilidad general.
- Teclados contextuales correctos: `TextInputType.emailAddress`, `.phone`, `.number` según el campo (reduce errores de entrada para todos los usuarios, crítico para quienes usan switch control o teclados adaptados).
- Mensajes de error específicos y accionables (ver mapeo de `VALIDATION_ERROR` en [[APP_API_INTEGRATION]] §3) — nunca solo "Error" sin indicar qué campo o qué corregir.

---

## 7. Internacionalización como Accesibilidad

- Todo texto de UI vive en archivos `.arb` (`l10n/`), nunca hardcodeado en el widget — esto no es solo para inglés/español, es lo que permite ajustar longitudes de texto sin romper layouts rígidos.
- Layouts deben tolerar textos más largos de lo esperado (el español suele ser ~15-20% más largo que el inglés equivalente) — evitar `Row`s sin `Expanded`/`Flexible` que puedan desbordar.

---

## 8. Checklist de Accesibilidad por Pantalla

- [ ] Contraste de color verificado (≥4.5:1 texto normal)
- [ ] Touch targets ≥48dp con espaciado adecuado
- [ ] Probado con escalado de texto al 200%
- [ ] Probado con TalkBack/VoiceOver activo
- [ ] Iconos informativos tienen `Semantics`/label; decorativos están excluidos
- [ ] Estado de error de formulario se anuncia al lector de pantalla
- [ ] Ninguna información depende solo de color o solo de animación
- [ ] Textos vienen de `l10n/`, no hardcodeados

---

## 9. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_DESIGN_SYSTEM]] | Tokens de color/tipografía/espaciado sobre los que se aplican estas reglas |
| [[APP_TESTING]] | Tests automatizados de accesibilidad (`flutter_test` + `meets_accessibility_guidelines`) |
