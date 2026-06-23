---
type: debt
status: open
session_origin: 3
session_resolved:
tags: [debt]
updated: 2026-06-19
---

# Deprecación ReflectionProperty::setAccessible() en tests de LoginUseCase

## Descripción
El test `it returns FORCE_PASSWORD_CHANGE status with limited token` en
`tests/Unit/Auth/Application/UseCases/LoginUseCaseTest.php` usa
`ReflectionProperty::setAccessible()` para mutar la propiedad privada
`mustChangePassword` de `UserEntity` y simular un usuario que debe cambiar
su contraseña. A partir de PHP 8.5 este método está deprecado y emite una
advertencia en la salida de Pest.

## Por qué se postergó
`UserEntity` es `final` y no expone un constructor/fábrica pública que
permita crear una entidad con `mustChangePassword = true`. Agregar uno
solo para tests contaminaría la capa Domain, que está congelada. Resolver
esto requiere o bien un mecanismo de fábrica de test en el dominio, o
replantear el test para evitar la mutación reflexiva.

## Cuándo resolverla
- Antes de Sesión 8 (Polish + CI/CD final) si se quiere una salida de
  tests 100% limpia sin advertencias.
- Idealmente en Sesión 7 (Password Management) cuando se trabaje en el
  flujo de `must_change_password`, momento oportuno para agregar una
  fábrica de dominio adecuada o ajustar los tests.
