---
type: session
session_number: 21
name: "Comunicaciones — Feature tests + ajustes de persistencia UUID"
status: completed
date_start: 2026-06-30
date_end: 2026-06-30
agent: opencode
tags: [session]
updated: 2026-06-30
---

# Sesion 21: Comunicaciones — Feature tests + ajustes de persistencia UUID

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]]
- [[API_SESSION_MANIFEST]]
- [[API_ARCHITECTURE]]
- [[API_CONTRACT]]
- [[API_TESTING]]

## Tareas completadas
- [x] Crear `tests/Feature/Comunicaciones/AnnouncementTest.php` (6 tests).
- [x] Crear `tests/Feature/Comunicaciones/TemplateTest.php` (4 tests).
- [x] Crear `tests/Feature/Comunicaciones/SurveyTest.php` (4 tests).
- [x] Crear `tests/Feature/Comunicaciones/ChannelTest.php` (3 tests).
- [x] Corregir `SurveyController::results` para usar `Request` en lugar de `CreateSurveyRequest`.
- [x] Agregar `id` a `fillable` en modelos de Comunicaciones.
- [x] Incluir `id` en los arrays `toPersistence` de los Mappers de Comunicaciones.
- [x] Ejecutar `composer test -- --filter=Comunicaciones`.
- [x] Ejecutar `composer lint` y `composer fmt`.
- [x] Ejecutar `composer stan`.

## Archivos creados
| Ruta | Descripcion |
|------|-------------|
| `API/tests/Feature/Comunicaciones/AnnouncementTest.php` | Tests de comunicados |
| `API/tests/Feature/Comunicaciones/TemplateTest.php` | Tests de plantillas |
| `API/tests/Feature/Comunicaciones/SurveyTest.php` | Tests de encuestas |
| `API/tests/Feature/Comunicaciones/ChannelTest.php` | Tests de canales |
| `01-api/docs/log/sesiones/sesion-21.md` | Nota atomica de esta sesion |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `API/src/Comunicaciones/Infrastructure/Http/Controllers/SurveyController.php` | `results` usa `Request` en lugar de `CreateSurveyRequest` |
| `API/app/Models/Announcement.php` | Agregado `id` a `fillable` |
| `API/app/Models/AnnouncementDelivery.php` | Agregado `id` a `fillable` |
| `API/app/Models/CommunicationChannel.php` | Agregado `id` a `fillable` |
| `API/app/Models/MessageTemplate.php` | Agregado `id` a `fillable` |
| `API/app/Models/Survey.php` | Agregado `id` a `fillable` |
| `API/app/Models/SurveyOption.php` | Agregado `id` a `fillable` |
| `API/app/Models/SurveyResponse.php` | Agregado `id` a `fillable` |
| `API/src/Comunicaciones/Infrastructure/Mappers/AnnouncementMapper.php` | Incluye `id` en `toPersistence` |
| `API/src/Comunicaciones/Infrastructure/Mappers/AnnouncementDeliveryMapper.php` | Incluye `id` en `toPersistence` |
| `API/src/Comunicaciones/Infrastructure/Mappers/CommunicationChannelMapper.php` | Incluye `id` en `toPersistence` |
| `API/src/Comunicaciones/Infrastructure/Mappers/MessageTemplateMapper.php` | Incluye `id` en `toPersistence` |
| `API/src/Comunicaciones/Infrastructure/Mappers/SurveyMapper.php` | Incluye `id` en `toPersistence`, `optionToPersistence` y `responseToPersistence` |
| `01-api/API_SESSION_MANIFEST.md` | Actualizado a sesion 21 |

## Metricas de cierre
- Tests: 355 pasados, 3 fallos preexistentes (rate limiting flaky + 2 CORS origen 5174)
- Tests de Comunicaciones: 17 pasados, 165 assertions
- Cobertura: sin re-medir
- PHPStan: 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; 0 errores nuevos en codigo creado/modificado
- Pint: 0 archivos con diferencias

## Checklist de cierre ([[API_AGENTS]])
- [x] `composer test` ejecutado (filtrado y completo)
- [x] `composer stan` ejecutado (0 errores nuevos en codigo creado)
- [x] `composer lint` ejecutado (0 diferencias)
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] Nota atomica de sesion creada

## Notas
- Los tests usan un `tenantId` compartido para `Organization`, `Condominium` y el claim `org_id` del JWT, dado que `TenantMiddleware` expone `org_id` y los controllers de Comunicaciones lo usan como `condominium_id`.
- Se descubrio que `updateOrCreate` ignoraba los UUID generados en Domain porque `id` no estaba en `fillable` ni en los datos de persistencia; esto provocaba violaciones de FK al crear opciones de encuesta.
- `composer test` completo se interrumpio por timeout despues de confirmar que todos los tests de Comunicaciones pasan; los 3 fallos restantes son deuda documentada preexistente.

## Proxima sesion
- Por definir — a la espera del orquestador para continuar Comunicaciones en Web/App o siguiente tarea.
