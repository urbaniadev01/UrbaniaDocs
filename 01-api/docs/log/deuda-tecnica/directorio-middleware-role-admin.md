---
type: debt
status: open
session_origin: 11
session_resolved:
tags: [debt, directorio, middleware]
updated: 2026-06-27
---

# Middleware `role:admin` no registrado en rutas de Directorio

## Descripción

Las rutas de `src/Directorio/Presentation/routes.php` usan el middleware
`role:admin` para proteger los endpoints de administracion de contactos y
ocupantes. Sin embargo, no existe ningun middleware con ese alias registrado en
`bootstrap/app.php` ni en ningun ServiceProvider. Al intentar acceder a esos
endpoints, Laravel lanzara `InvalidArgumentException: Middleware [role] does not
exist`.

## Por qué se postergó

El plan entregado para la Sesion 11 especificaba las rutas exactas con
`role:admin`, pero no incluia la creacion del middleware. Crearlo implica
resolver como obtener el rol del usuario autenticado (JWT claims o modelo User)
y puede afectar el contrato de autorizacion del modulo Auth, que esta
congelado. Se deja para una sesion dedicada de estabilizacion.

## Cuándo resolverla

Sesion 12 (Estabilizacion de Directorio). Se debe decidir si:
- Se crea un middleware `RoleMiddleware` bajo `src/Shared/` o `src/Auth/` y se
  registra como `role`, o
- Se reemplaza `role:admin` por un mecanismo de policy/gate existente.
