---
type: meta
status: active
priority: P0
module: mobile
tags: [agents, navigation, mobile]
updated: 2026-06-18
---

# 🤖 AGENTS (App Móvil)
## Mapa de Navegación y Reglas de Oro — Urbania App

> [!danger] Leer primero
> Este es el punto de entrada de la documentación de la app móvil. Antes de tocar código o cualquier otro documento, leer este archivo completo.

> [!info] Relación con el vault del API
> Este vault de la app móvil es un set de documentación **independiente y complementario** al de `Urbania API` ([[01-api/API_AGENTS|AGENTS]] del backend) — no un espejo. La app tiene su propia arquitectura, su propio sistema de diseño, su propia estrategia de seguridad y de datos, porque corre en un contexto distinto (dispositivo del usuario, conectividad intermitente, distribución vía tiendas). Donde la app necesita algo que el backend ya define (contratos de API, JWT del lado servidor), se referencia el documento del backend en vez de duplicarlo.

---

## 1. Mapa de Documentos

| Documento | Cuándo consultarlo |
|---|---|
| [[APP_AGENTS]] | Siempre primero |
| [[APP_ARCHITECTURE]] | Antes de crear/modificar estructura de carpetas, estado, navegación o manejo de errores |
| [[APP_DESIGN_SYSTEM]] | Antes de crear cualquier pantalla o componente visual |
| [[APP_ACCESSIBILITY]] | Antes de cerrar cualquier pantalla con UI |
| [[APP_API_INTEGRATION]] | Antes de tocar cualquier llamada al backend |
| [[APP_SECURITY]] | Antes de tocar tokens, biometría, almacenamiento local, pagos |
| [[APP_DATA_STRATEGY]] | Antes de decidir si un dato es offline-first, híbrido u online-only |
| [[APP_FEATURE_SCOPE]] | Para entender qué se construye, en qué orden, y qué está pendiente del lado backend |
| [[APP_TESTING]] | Al crear o modificar tests |
| [[APP_SETUP_GUIDE]] | Al iniciar el proyecto o incorporar a alguien nuevo |
| [[APP_RELEASE_AND_OBSERVABILITY]] | Al configurar CI/CD, publicar en tiendas, o investigar un incidente |
| [[APP_IMPLEMENTATION_PLAN]] | Antes de cualquier tarea — identifica la sesión actual |
| [[APP_SESSION_MANIFEST]] | Siempre, para saber el estado real del proyecto |
| [[APP_DEVELOPMENT_GUIDE]] | Comandos diarios, troubleshooting, decisiones ad-hoc |
| [[OBSIDIAN_VAULT]] | Cómo está organizado y se usa este vault |
| [[_Home]] | Dashboard/entrada visual del vault |

---

## 2. Reglas de Oro

1. **No es un espejo del API.** Cada documento de este vault existe porque la app tiene una necesidad técnica propia (UI, almacenamiento local, distribución en tiendas, biometría) que el backend no tiene. Si una sección empieza a duplicar contenido del vault del API palabra por palabra, es una señal de que debería ser una referencia (`[[../Doc]]`), no una copia.

2. **Verify before assume.** Igual que en el backend ([[01-api/API_AGENTS|AGENTS]] del API): antes de continuar una sesión interrumpida, correr `flutter analyze && flutter test` y revisar [[APP_SESSION_MANIFEST]] — nunca asumir el estado del proyecto por memoria.

3. **El contrato de API es del backend, no se inventa aquí.** [[APP_FEATURE_SCOPE]] propone diseño de producto adelantado para módulos que el backend aún no ha definido (Reservas, Visitas, Pagos, Chat), pero deja explícito qué está "Diseñado" vs "propuesto". Nunca implementar contra un contrato propuesto como si fuera definitivo sin confirmarlo en `API_CONTRACT.md` del backend primero.

4. **Seguridad y accesibilidad se verifican en cada sesión de UI**, no se posponen a una fase final — ver [[APP_SECURITY]] §10 y [[APP_ACCESSIBILITY]] §8.

5. **Ningún secreto en texto plano.** Tokens, contraseñas, códigos MFA: solo en `flutter_secure_storage`, nunca en `shared_preferences`, logs, o reportes de crash — ver [[APP_SECURITY]] §1-2.

6. **Todo color, tamaño y texto viene de los tokens centralizados** ([[APP_DESIGN_SYSTEM]], `l10n/`) — nunca hardcodeado en un widget de feature.

7. **Si se encuentra una inconsistencia** entre este vault, el código, o el contrato del backend (ej. un endpoint que cambió y este documento no se actualizó), se reporta e informa de inmediato para corregirlo — mismo principio que el backend.

8. **Las decisiones de negocio pendientes se marcan explícitamente** (pasarela de pago, alcance exacto del chat, estrategia de CI de firma) — no se elige por el equipo técnico sin involucrar a negocio donde corresponda (ver [[APP_ARCHITECTURE]] §11, [[APP_SESSION_MANIFEST]]).

---

## 3. Stack en una Línea

Flutter + Riverpod + go_router + Dio + Drift + flutter_secure_storage — Clean Architecture feature-first consumiendo Urbania API (Laravel 13). Detalle completo en [[APP_ARCHITECTURE]].

---

## 4. Primer Paso si Eres Nuevo en el Proyecto

1. Leer este documento completo.
2. Leer [[APP_SESSION_MANIFEST]] para saber el estado real actual.
3. Leer [[APP_IMPLEMENTATION_PLAN]] para saber qué sesión sigue.
4. Ejecutar [[APP_SETUP_GUIDE]] si el entorno no está configurado.
5. No tocar código de una feature sin haber leído el documento correspondiente de la tabla de §1.
