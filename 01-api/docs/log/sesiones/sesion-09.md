---
type: session
session_number: 9
name: "CORS global para API"
status: completed
date_start: 2026-06-26
date_end: 2026-06-26
agent: opencode
tags: [session]
updated: 2026-06-26
---

# Sesión 9: CORS global para API

## Documentos consultados
- [[API_AGENTS]]
- [[API_SESSION_MANIFEST]]
- [[API_IMPLEMENTATION_PLAN]]

## Tareas completadas
- [x] Crear `src/Shared/Infrastructure/Middleware/CorsMiddleware.php`
- [x] Crear `config/cors.php` para centralizar la configuración de orígenes
- [x] Registrar `CorsMiddleware` como middleware global prepend en `bootstrap/app.php`
- [x] Deshabilitar `Illuminate\Http\Middleware\HandleCors` para evitar conflictos
- [x] Agregar `CORS_ALLOWED_ORIGINS` a `.env.example`, `.env.ci` y `.env.docker`
- [x] Crear tests unitarios del middleware
- [x] Crear tests feature para verificar preflight OPTIONS y headers en respuestas reales
- [x] Ejecutar `composer ci` y confirmar pipeline verde

## Archivos creados
| Ruta | Descripción |
|------|-------------|
| `API/config/cors.php` | Configuración centralizada del origen permitido |
| `API/src/Shared/Infrastructure/Middleware/CorsMiddleware.php` | Middleware CORS con soporte OPTIONS y headers en todas las respuestas |
| `API/tests/Unit/Shared/Infrastructure/Middleware/CorsMiddlewareTest.php` | Tests unitarios del middleware |
| `API/tests/Feature/Shared/Http/CorsMiddlewareTest.php` | Tests feature de preflight e integración con la app |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `API/bootstrap/app.php` | Registro global de CorsMiddleware, remoción de HandleCors |
| `API/.env.example` | Variable `CORS_ALLOWED_ORIGINS` |
| `API/.env.ci` | Variable `CORS_ALLOWED_ORIGINS` |
| `API/.env.docker` | Variable `CORS_ALLOWED_ORIGINS` |
| `01-api/API_SESSION_MANIFEST.md` | Estado de la sesión y métricas |

## Métricas de cierre
- Tests: 259 passed (968 assertions)
- Cobertura: no se midió en esta sesión
- PHPStan: 0 errores nivel 10
- Pint: 0 archivos con diferencias
- `composer ci`: verde

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer ci` verde
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] [[API_CONTRACT]] / [[API_DATABASE]] actualizados si aplica (no aplica)
- [x] Deuda técnica o bloqueos documentados (no se identificaron)

## Notas

> **Corrección al plan original solicitado**: Se intentó registrar `CorsMiddleware` únicamente en el grupo `api`, pero Laravel responde las peticiones OPTIONS a rutas sin método OPTIONS **antes** de que se ejecuten los middlewares de grupo. Por eso el middleware se registró como `prepend` en el stack global, garantizando que atrape el preflight antes de que el router devuelva `200 Allow: GET,HEAD`.

## Próxima sesión
- N/A — módulo Auth completado; esperar planificación de nuevo módulo de negocio.
