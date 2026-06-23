---
type: debt
status: open
session_origin: 3
session_resolved:
tags: [debt]
updated: 2026-06-19
---

# TTL exacto de blacklist de JWT

## Descripción
`PhpOpenSourceSaverJwtService::revoke(string $jti)` almacena el JTI en
Redis bajo la clave `jwt:blacklist:{jti}` con un TTL fijo de 900 segundos
(`DEFAULT_TTL`). La especificación original indica que el TTL debería ser
el tiempo restante hasta la expiración natural del token, pero la interfaz
solo recibe el JTI, no el token completo ni su claim `exp`.

## Por qué se postergó
- La interfaz `JwtServiceInterface` define `revoke(string $jti): void`.
- 900s es el TTL máximo de un access token, por lo que funcionalmente el
  token queda invalidado durante toda su vida útil; el espacio extra en
  Redis es mínimo (tokens access de corta duración).
- Cambiar la firma de la interfaz afectaría todos los consumidores y
  requeriría propagar el token completo hasta la capa de aplicación.

## Cuándo resolverla
- Sesión 6 (Seguridad Avanzada) o Sesión 7 (Password Management), cuando
  se implemente la revocación masiva de tokens por eventos de seguridad.
- Opciones: (a) cambiar la interfaz a `revoke(string $token)`, (b) guardar
  `exp` junto al JTI en Redis y calcular TTL, o (c) mantener el TTL fijo
  si el riesgo/impacto es aceptable.
