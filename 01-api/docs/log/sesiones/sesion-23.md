---
type: session
session_number: 23
name: "Directorio — Tests feature faltantes"
status: completed
date_start: 2026-06-30
date_end: 2026-06-30
agent: opencode
tags: [session]
updated: 2026-06-30
---

# Sesion 23: Directorio — Tests feature faltantes

## Documentos consultados
- [[API_AGENTS]]
- [[API_IMPLEMENTATION_PLAN]]
- [[API_SESSION_MANIFEST]]
- [[API_ARCHITECTURE]]
- [[API_TESTING]]
- [[API_CONTRACT]]

## Tareas completadas
- [x] Crear `ContactFactory`, `OccupantTypeFactory` y `PropertyOccupantFactory`.
- [x] Agregar trait `HasFactory` a los modelos `Contact`, `OccupantType` y `PropertyOccupant`.
- [x] Crear `ContactControllerTest` con 10 tests de CRUD de contactos.
- [x] Crear `OccupantTypeControllerTest` con 2 tests del catalogo de tipos de ocupante.
- [x] Crear `PropertyOccupantControllerTest` con 6 tests de gestion de ocupantes por unidad.
- [x] Corregir excepciones de dominio de Directorio para extender `Urbania\Shared\Domain\Exceptions\DomainException` y retornar codigos de error estandar.
- [x] Agregar `organization_id` a la entidad `Contact`, DTOs, mapper y controller para cumplir la restriccion NOT NULL de BD.
- [x] Incluir middleware `api` en las rutas de Directorio para habilitar `TenantMiddleware` (`org_id`).
- [x] Agregar `PropertyExistsCheckerInterface` y `EloquentPropertyExistsChecker` para validar existencia de propiedad al listar ocupantes.
- [x] Ajustar `ContactAuthorizationTest` al nuevo codigo `TENANT_REQUIRED` cuando no hay token.
- [x] Ejecutar `composer lint`.
- [x] Ejecutar `composer test -- tests/Feature/Directorio`.
- [x] Ejecutar `composer stan`.

## Archivos creados
| Ruta | Descripcion |
|------|-------------|
| `API/database/factories/ContactFactory.php` | Factory para modelo Contact |
| `API/database/factories/OccupantTypeFactory.php` | Factory para modelo OccupantType |
| `API/database/factories/PropertyOccupantFactory.php` | Factory para modelo PropertyOccupant |
| `API/tests/Feature/Directorio/Http/ContactControllerTest.php` | Tests CRUD de contactos |
| `API/tests/Feature/Directorio/Http/OccupantTypeControllerTest.php` | Tests de catalogo de tipos de ocupante |
| `API/tests/Feature/Directorio/Http/PropertyOccupantControllerTest.php` | Tests de ocupantes por unidad |
| `API/src/Directorio/Application/Services/PropertyExistsCheckerInterface.php` | Interfaz de verificacion de existencia de propiedad |
| `API/src/Directorio/Infrastructure/Services/EloquentPropertyExistsChecker.php` | Implementacion Eloquent del checker |
| `01-api/docs/log/sesiones/sesion-23.md` | Nota atomica de esta sesion |

## Archivos modificados
| Ruta | Cambio |
|------|--------|
| `API/app/Models/Contact.php` | Agregado `HasFactory` |
| `API/app/Models/OccupantType.php` | Agregado `HasFactory` |
| `API/app/Models/PropertyOccupant.php` | Agregado `HasFactory` |
| `API/src/Directorio/Domain/Entities/Contact.php` | Agregado `organizationId` |
| `API/src/Directorio/Domain/Exceptions/*.php` | Convertidas a `DomainException` de Shared con codigos de error |
| `API/src/Directorio/Application/DTOs/CreateContactDTO.php` | Agregado `organizationId` |
| `API/src/Directorio/Application/DTOs/UpdateContactDTO.php` | Agregado `organizationId` |
| `API/src/Directorio/Application/UseCases/Contacts/CreateContactUseCase.php` | Pasa `organizationId` a la entidad |
| `API/src/Directorio/Application/UseCases/Contacts/UpdateContactUseCase.php` | Preserva `organizationId` |
| `API/src/Directorio/Application/UseCases/Contacts/DeleteContactUseCase.php` | Ajuste de firma de excepciones |
| `API/src/Directorio/Application/UseCases/Occupants/ListUnitOccupantsUseCase.php` | Valida existencia de propiedad via checker |
| `API/src/Directorio/Application/UseCases/Occupants/UnlinkOccupantUseCase.php` | Ajuste de firma de excepciones |
| `API/src/Directorio/Application/UseCases/Occupants/UpdateOccupantUseCase.php` | Ajuste de firma de excepciones |
| `API/src/Directorio/Infrastructure/Http/Controllers/ContactController.php` | Pasa `org_id` del request a los DTOs |
| `API/src/Directorio/Infrastructure/Mappers/ContactMapper.php` | Mapea `organization_id` |
| `API/src/Directorio/Presentation/DirectorioServiceProvider.php` | Registra `PropertyExistsCheckerInterface` |
| `API/src/Directorio/Presentation/routes.php` | Incluye middleware `api` |
| `API/tests/Feature/Directorio/Http/ContactAuthorizationTest.php` | Actualizado a `TENANT_REQUIRED` sin token |
| `01-api/API_SESSION_MANIFEST.md` | Actualizado a sesion 23 |

## Metricas de cierre
- Tests de Directorio: 21 pasados, 127 assertions
- Tests de Propiedades: 50 pasados (validacion de no regresion)
- Tests de Comunicaciones: 18 pasados (validacion de no regresion)
- `composer lint`: 0 archivos con diferencias
- `composer stan`: 6 errores preexistentes en `app/Providers/AppServiceProvider.php`; 0 errores nuevos en codigo creado/modificado

## Checklist de cierre ([[API_AGENTS]])
- [x] Codigo sigue convenciones de nomenclatura
- [x] `composer lint` pasa
- [x] `composer stan` ejecutado (0 errores nuevos en codigo creado)
- [x] Tests feature pasan
- [x] Domain no importa Infrastructure
- [x] DTOs son `final readonly class`
- [x] Formato de error unico respetado
- [x] [[API_SESSION_MANIFEST]] actualizado
- [x] Nota atomica de sesion creada

## Notas
- Los tests de Directorio ahora cubren los 11 endpoints del modulo: 6 de contactos, 1 de catalogo y 4 de ocupantes.
- Se corrigio un bug preexistente: las excepciones de Directorio no extendian `Urbania\Shared\Domain\Exceptions\DomainException`, por lo que el handler retornaba 500 en lugar de los codigos 409/404 esperados.
- Se agrego `organization_id` al flujo de creacion/actualizacion de contactos para cumplir la restriccion NOT NULL de la migracion `2026_06_28_000003_make_organization_id_not_null`.
- Se agrego middleware `api` a las rutas de Directorio para alinearlas con Comunicaciones y habilitar `TenantMiddleware`.

## Proxima sesion
- Por definir — a la espera del orquestador.
