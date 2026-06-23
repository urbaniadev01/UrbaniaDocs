---
type: meta
status: active
priority: P0
module: mobile
tags: [manifest, state, mobile]
updated: 2026-06-18
---

# 📍 SESSION_MANIFEST (App Móvil)
## Estado Actual del Proyecto entre Sesiones

> [!info] Consultar
> Siempre al iniciar o retomar trabajo. Este documento responde "¿en qué quedó el proyecto la última vez?" — es la fuente de verdad del estado, no la memoria de quien retoma la sesión.

> [!warning] Disciplina de actualización
> Se actualiza al **cierre** de cada sesión de [[APP_IMPLEMENTATION_PLAN]], no al inicio de la siguiente. Si este documento no refleja la realidad del código, es un bug de proceso que se corrige inmediatamente, no se ignora.

---

## Estado Actual

| Campo | Valor |
|---|---|
| Última sesión completada | _Ninguna — proyecto aún no iniciado_ |
| Sesión en curso | _Sesión 1: Setup + Design System Base + Slice Vertical Mínimo (pendiente de iniciar)_ |
| Versión de Flutter fijada | _Por definir al ejecutar [[APP_SETUP_GUIDE]] §1_ |
| Flavor activo de desarrollo | _Por definir_ |
| URL del backend usada en desarrollo | _Por definir (ver [[APP_SETUP_GUIDE]] §5 — advertencia sobre `localhost` vs dispositivo físico)_ |
| Pasarela de pago elegida | _Pendiente de decisión de negocio (ADR-M006, ver [[APP_ARCHITECTURE]] §11)_ |
| Estrategia de CI/CD de firma | _Pendiente de elegir entre GitHub Actions/Fastlane y Codemagic (ver [[APP_RELEASE_AND_OBSERVABILITY]] §2)_ |

---

## Bitácora de Sesiones

> Formato: una entrada por sesión cerrada, más reciente arriba.

### Plantilla para nueva entrada

```
### Sesión N — <nombre> — <fecha>
- Completado: ...
- Decisiones tomadas: ...
- Pendiente / bloqueado por: ...
- Issues encontrados: ...
- Próxima sesión sugerida: ...
```

_(Aún no hay sesiones cerradas — esta sección se completa progresivamente.)_

---

## Bloqueos Activos

| Bloqueo | Depende de | Afecta a |
|---|---|---|
| Contratos de Reservas/Visitas/Pagos/Chat no existen aún en [[01-api/API_CONTRACT]] | Equipo de backend | Sesiones 10+ de [[APP_IMPLEMENTATION_PLAN]] (no bloquea Sesiones 1-9) |
| Pasarela de pagos sin decidir | Negocio | Sesión de Pagos (10+), [[APP_SECURITY]] §6 |

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[APP_IMPLEMENTATION_PLAN]] | Plan completo de sesiones |
| [[APP_DEVELOPMENT_GUIDE]] | Decisiones ad-hoc y troubleshooting acumulado |
| [[APP_AGENTS]] | Navegación general |
