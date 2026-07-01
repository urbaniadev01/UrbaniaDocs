---
type: debt
status: open
session_origin: 17
session_resolved:
tags: [debt, authorization, rbac, middleware]
updated: 2026-06-29
---

# Cablear `AuthorizationMiddleware` en rutas específicas

## Descripción

El `AuthorizationMiddleware` ya está implementado en
`src/Shared/Infrastructure/Middleware/AuthorizationMiddleware.php` y resuelve
permisos `recurso.accion` de forma server-side usando `PermissionResolverInterface`
con cache Redis. No se registró globalmente en `bootstrap/app.php` para evitar
romper los endpoints existentes de Auth, Propiedades y Directorio durante el
cierre de CAMBIO-006.

## Por qué se postergó

La autorización granular requiere que cada endpoint tenga un nombre de ruta que
mapee a un permiso `recurso.accion`. Las rutas actuales de los módulos
congelados (Auth, Propiedades, Directorio) aún usan validaciones basadas en el
claim `role` o middleware `role:admin`. Migrarlos a `can:recurso.accion` implica
revisar feature por feature y sembrar/verificar las asignaciones de rol
necesarias.

## Cuándo resolverla

Al implementar cada feature nuevo que requiera autorización granular, o en una
sesión de estabilización dedicada para migrar los endpoints existentes de
Propiedades/Directorio. En ese momento se debe:

1. Nombrar las rutas con nombres canónicos (ej. `properties.index`).
2. Mapear cada nombre de ruta a un permiso en el `AuthorizationMiddleware` o en
   una configuración centralizada.
3. Reemplazar `role:admin` / `urbania.jwt` por `can:recurso.accion` donde aplique.
4. Agregar feature tests que validen 403 cuando el usuario no tiene el permiso
   en el scope correcto.
