---
type: debt
status: open
session_origin: 11
session_resolved:
tags: [debt, composer, autoload]
updated: 2026-06-27
---

# `composer dump-autoload` se cuelga durante `php artisan package:discover`

## Descripción

Al ejecutar `composer dump-autoload`, el proceso se bloquea indefinidamente en
el paso `php artisan package:discover --ansi` (post-autoload-dump). Con
`composer dump-autoload --no-scripts` el autoload se genera correctamente.
Esto indica que algun provider, service o boot listener ejecutado durante
`package:discover` se cuelga, posiblemente por una espera de red/BD/Redis.

## Por qué se postergó

La sesion 11 tenia como objetivo implementar las capas faltantes de Directorio.
El autoload funciona sin scripts y los tests/rutas se verificaron correctamente.
Diagnosticar el cuelgue requiere tiempo y no bloquea el entregable inmediato.

## Cuándo resolverla

Sesion 12 (Estabilizacion de Directorio). Se debe ejecutar
`php artisan package:discover -v` o depurar providers para identificar el punto
de bloqueo.
