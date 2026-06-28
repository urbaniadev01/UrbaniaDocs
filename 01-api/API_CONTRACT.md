---
type: reference
status: active
module: contract
scope: cross-project
tags: [api, endpoints, rest, cross-project, dictionary]
updated: 2026-06-28
---

# 🔌 API_CONTRACT
## Diccionario de Endpoints de Urbania API

> [!info] Propósito
> **Fuente única de endpoints**: Este es el documento índice de TODOS los endpoints del proyecto.
> Contiene el índice maestro, convenciones globales, flujos comunes, códigos de error y rate limiting.
> El **detalle** de cada endpoint (request, response, errores, diseño, flujo) vive en `01-api/endpoints/<FEATURE>.md`.

> [!warning] Regla de fuente de verdad
> NINGÚN documento fuera de `01-api/` contiene request/response de un endpoint.
> Todos los documentos que necesiten referenciar un endpoint citan este documento o el documento
> de detalle correspondiente en `01-api/endpoints/`.
> Ver [[00-shared/SYSTEM_CONTRACT]] §1 para el contrato formal entre proyectos.

> [!note] Alcance actual
> Endpoints **implementados**: Auth (`/auth/*`, §1.x) + Health Check (`/health`, §11.1) + Propiedades y Unidades (`/properties`, `/towers`, `/condominiums`, `/property-document-types`, `/property-types`, `/property-statuses`, §2-§5). Módulo Auth cerrado y congelado (ver [[API_SESSION_MANIFEST]]).
> Los demás módulos de negocio se diseñarán e implementarán uno a la vez (ver [[00-shared/FEATURES_INDEX]]).

---

## Índice de Endpoints

> [!info] Convención de numeración
> El primer número de cada `§N.M` identifica el módulo al que pertenece un endpoint. Actualmente solo existen §1 (Auth) y §11 (Health Check, infraestructura, no negocio). Los módulos de negocio recibirán su número cuando se diseñen.

### §1 — Auth (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|--------|------|------|--------|-----------|
| 1.1 | POST | `/auth/login` | No | Implementado | [[endpoints/AUTH]] §1.1 |
| 1.2 | POST | `/auth/register` | No | Implementado | [[endpoints/AUTH]] §1.2 |
| 1.3 | POST | `/auth/logout` | Sí | Implementado | [[endpoints/AUTH]] §1.3 |
| 1.4 | POST | `/auth/refresh` | No (refresh_token en body) | Implementado | [[endpoints/AUTH]] §1.4 |
| 1.5 | GET | `/auth/me` | Sí | Implementado | [[endpoints/AUTH]] §1.5 |
| 1.6 | POST | `/auth/forgot-password` | No | Implementado | [[endpoints/AUTH]] §1.6 |
| 1.7 | POST | `/auth/reset-password` | No | Implementado | [[endpoints/AUTH]] §1.7 |
| 1.8 | GET | `/auth/sessions` | Sí | Implementado | [[endpoints/AUTH]] §1.8 |
| 1.9 | DELETE | `/auth/sessions` | Sí | Implementado | [[endpoints/AUTH]] §1.9 |
| 1.10 | DELETE | `/auth/sessions/{session_id}` | Sí | Implementado | [[endpoints/AUTH]] §1.10 |
| 1.11 | POST | `/auth/change-password` | Sí | Implementado | [[endpoints/AUTH]] §1.11 |
| 1.12 | POST | `/auth/verify-email` | No | Implementado | [[endpoints/AUTH]] §1.12 |
| 1.13 | POST | `/auth/resend-verification` | Sí | Implementado | [[endpoints/AUTH]] §1.13 |
| 1.14 | PATCH | `/auth/me` | Sí | Implementado | [[endpoints/AUTH]] §1.14 |
| 1.15 | POST | `/auth/mfa/setup` | Sí | Implementado | [[endpoints/AUTH]] §1.15 |
| 1.16 | POST | `/auth/mfa/verify` | No* | Implementado | [[endpoints/AUTH]] §1.16 |
| 1.17 | POST | `/auth/mfa/verify-backup` | No* | Implementado | [[endpoints/AUTH]] §1.17 |
| 1.18 | POST | `/auth/mfa/enable` | Sí | Implementado | [[endpoints/AUTH]] §1.18 |
| 1.19 | POST | `/auth/mfa/disable` | Sí | Implementado | [[endpoints/AUTH]] §1.19 |
| 1.20 | POST | `/auth/mfa/backup-codes` | Sí | Implementado | [[endpoints/AUTH]] §1.20 |

> `*` `/auth/mfa/verify` y `/auth/mfa/verify-backup` se usan tanto durante login (sin token, tras credenciales válidas) como ya autenticado; ver [[endpoints/AUTH]] §1.16-§1.17.

### §11 — Health Check (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|--------|------|------|--------|-----------|
| 11.1 | GET | `/health` | No | Implementado | [[endpoints/HEALTH]] §11.1 |

### §C — Configuración (Implementado vía AUTH)

> [!note] Sin endpoints nuevos
> El feature **Configuración** no introduce endpoints propios: reorganiza los endpoints de Auth ya implementados (§1.x) desde la perspectiva de las pantallas de "Perfil / Seguridad / MFA / Sesiones". Ver [[CONFIGURACION]] para el mapeo pantalla → endpoint Auth.

| Pantalla | Endpoint(s) usado(s) | Estado | Documento |
|----------|----------------------|--------|-----------|
| Perfil | `GET /auth/me`, `PATCH /auth/me` (§1.5, §1.14) | Implementado | [[endpoints/CONFIGURACION]] §C.1 |
| Cambiar contraseña | `POST /auth/change-password` (§1.11) | Implementado | [[endpoints/CONFIGURACION]] §C.2 |
| Sesiones activas | `GET/DELETE /auth/sessions` (§1.8, §1.9, §1.10) | Implementado | [[endpoints/CONFIGURACION]] §C.3 |
| Setup MFA | `POST /auth/mfa/setup`, `POST /auth/mfa/enable` (§1.15, §1.18) | Implementado | [[endpoints/CONFIGURACION]] §C.4 |
| Gestionar MFA | `POST /auth/mfa/disable`, `POST /auth/mfa/backup-codes` (§1.19, §1.20) | Implementado | [[endpoints/CONFIGURACION]] §C.5 |

> Todas las rutas llevan el prefijo `/api/v1` (omitido aquí por brevedad). Base URL en Convenciones Generales.
> `user*` = el residente (`role = user`) puede acceder solo a sus propios recursos (no listado completo en ese endpoint).
> **Estado**: "Implementado" = código y tests en `main`; "Diseñado" = documentado, pendiente de codificar.

### §2 — Propiedades (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|---|--------|------|------|--------|-----------|
| 2.1 | GET | `/properties` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.1 |
| 2.2 | POST | `/properties` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.2 |
| 2.3 | GET | `/properties/{id}` | Sí | Implementado | [[endpoints/PROPIEDADES]] §2.3 |
| 2.4 | PATCH | `/properties/{id}` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.4 |
| 2.5 | DELETE | `/properties/{id}` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.5 |
| 2.6 | PATCH | `/properties/{id}/status` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.6 |
| 2.7 | GET | `/properties/{id}/status-log` | Sí | Implementado | [[endpoints/PROPIEDADES]] §2.7 |
| 2.8 | GET | `/properties/{id}/documents` | Sí | Implementado | [[endpoints/PROPIEDADES]] §2.8 |
| 2.9 | POST | `/properties/{id}/documents` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.9 |
| 2.10 | DELETE | `/properties/{id}/documents/{docId}` | Sí (admin) | Implementado | [[endpoints/PROPIEDADES]] §2.10 |

### §3 — Torres (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|---|--------|------|------|--------|-----------|
| 3.1 | GET | `/condominiums/{condominium_id}/towers` | Sí (admin) | Implementado | [[endpoints/TOWERS]] §3.1 |
| 3.2 | POST | `/towers` | Sí (admin) | Implementado | [[endpoints/TOWERS]] §3.2 |
| 3.3 | GET | `/towers/{id}` | Sí (admin) | Implementado | [[endpoints/TOWERS]] §3.3 |
| 3.4 | PATCH | `/towers/{id}` | Sí (admin) | Implementado | [[endpoints/TOWERS]] §3.4 |
| 3.5 | DELETE | `/towers/{id}` | Sí (admin) | Implementado | [[endpoints/TOWERS]] §3.5 |

### §4 — Catálogos de Propiedades (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|---|--------|------|------|--------|-----------|
| 4.1 | GET | `/property-types` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.1 |
| 4.2 | POST | `/property-types` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.2 |
| 4.3 | PATCH | `/property-types/{id}` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.3 |
| 4.4 | DELETE | `/property-types/{id}` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.4 |
| 4.5 | GET | `/property-statuses` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.5 |
| 4.6 | POST | `/property-statuses` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.6 |
| 4.7 | PATCH | `/property-statuses/{id}` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.7 |
| 4.8 | DELETE | `/property-statuses/{id}` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.8 |
| 4.9 | GET | `/property-document-types` | Sí | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.9 |
| 4.10 | POST | `/property-document-types` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.10 |
| 4.11 | PATCH | `/property-document-types/{id}` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.11 |
| 4.12 | DELETE | `/property-document-types/{id}` | Sí (admin) | Implementado | [[endpoints/PROPERTY_CATALOGS]] §4.12 |

### §5 — Condominiums (Implementado)

| # | Método | Ruta | Auth | Estado | Documento |
|---|---|--------|------|------|--------|-----------|
| 5.1 | GET | `/condominiums` | Sí (admin) | Implementado | [[endpoints/CONDOMINIUMS]] §5.1 |
| 5.2 | GET | `/condominiums/{id}` | Sí (admin) | Implementado | [[endpoints/CONDOMINIUMS]] §5.2 |
| 5.3 | PATCH | `/condominiums/{id}` | Sí (admin) | Implementado | [[endpoints/CONDOMINIUMS]] §5.3 |
| 5.4 | GET | `/condominiums/{id}/coefficient-validation` | Sí (admin) | Implementado | [[endpoints/CONDOMINIUMS]] §5.4 |

---

## Flujos Comunes (referencia rápida para integración)

> Notación compacta para que un cliente (web, móvil, u otro servicio) sepa
> encadenar llamadas sin tener que leer cada sección. `Bearer` = requiere
> `Authorization: Bearer <access_token>`.

| Flujo | Secuencia |
|-------|-----------|
| Login simple | `POST /auth/login {email,password}` → `200 {access_token,refresh_token,user}` |
| Login con MFA | `POST /auth/login {email,password}` → `401 MFA_REQUIRED` → `POST /auth/mfa/verify {code}` → `200 {access_token,refresh_token,user}` |
| Sesión expirada | `401 TOKEN_EXPIRED` en cualquier endpoint Bearer → `POST /auth/refresh {refresh_token}` → `200 {access_token,refresh_token}` → reintentar request original |
| Logout | `POST /auth/logout` (Bearer) → `204` (revoca el refresh_token de la sesión actual) |
| Registro | `POST /auth/register {...}` → `201 {user}` (sin tokens) → `POST /auth/login` para obtener tokens |
| Olvido de contraseña | `POST /auth/forgot-password {email}` → `200` → usuario recibe email → `POST /auth/reset-password {email,token,password,password_confirmation}` → `200` |
| Cambio de contraseña autenticado | `POST /auth/change-password {current_password,new_password,new_password_confirmation}` (Bearer) → `200` (revoca TODAS las sesiones, incl. la actual: requiere nuevo login) |
| Activar MFA | `POST /auth/mfa/setup` (Bearer) → `200 {secret,qr_code_url,backup_codes}` → `POST /auth/mfa/enable {code}` (Bearer) → `200` |
| Desactivar MFA | `POST /auth/mfa/disable {password,code}` (Bearer) → `200` |
| Login con código de respaldo | `POST /auth/login {email,password}` → `401 MFA_REQUIRED` → `POST /auth/mfa/verify-backup {code}` → `200 {access_token,refresh_token,user}` |
| Verificar email | Usuario hace click en link del email → `POST /auth/verify-email {token}` → `200` |
| Forzar cambio de contraseña | `POST /auth/login` → `403 FORCE_PASSWORD_CHANGE + limited_token` → `POST /auth/change-password` (Bearer con limited_token) → `200` → login normal para obtener token completo |

> Para detalle completo de cada endpoint (request, response, errores, diseño, flujo), ver el documento correspondiente en `01-api/endpoints/`.

---

## Convenciones Generales

### Base URL
```
Desarrollo:   http://localhost:8080/api/
Producción:   https://api.urbania.com/
```

### Headers Obligatorios
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>    (excepto endpoints públicos)
X-Trace-Id: <uuid>                   (opcional. Si no se envía, el servidor genera uno automáticamente)
X-Device-Name: <string>              (opcional, max 255 chars)
```

> [!note] Nota sobre X-Device-Fingerprint
> Este header ha sido **deprecado**.
> El servidor calcula el `device_fingerprint` automáticamente a partir de
> `User-Agent`, `IP`, `Accept-Language` y `X-Device-Name` (opcional).
> Ver [[API_JWT_IMPLEMENTATION]] §4.3 para detalles del cálculo.

### Formato de Fechas

Todas las fechas en respuestas DEBEN usar formato ISO 8601 en UTC:
- Formato: `YYYY-MM-DDThh:mm:ssZ`
- Ejemplo: `2026-06-07T12:00:00Z`
- **Prohibido** usar zonas horarias locales o formatos alternativos.

Ver [[API_ARCHITECTURE]] §13 (`APP_TIMEZONE=UTC`).

### Formato de Respuesta de Éxito
```json
{
  "data": { ... },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Formato de Respuesta de Error (ÚNICO FORMATO)
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "El usuario solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

> [!warning] IMPORTANTE
> Este es el ÚNICO formato de error permitido en toda la API.
> Todos los documentos deben usar este formato. No usar `error_code` a nivel raíz
> ni `success: false`.
> **Excepción**: `GET /health` en estado unhealthy responde `{ data: { status: "unhealthy", ... } }` con HTTP 503 — ver [[endpoints/HEALTH]] §11.1.

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 OK | GET exitoso, recurso encontrado |
| 201 Created | POST exitoso, recurso creado |
| 204 No Content | DELETE exitoso, PUT sin body |
| 400 Bad Request | Error de validación de negocio |
| 401 Unauthorized | Token inválido o expirado |
| 403 Forbidden | Sin permisos para el recurso |
| 404 Not Found | Recurso no existe |
| 409 Conflict | Conflicto de estado (ej: reserva duplicada) |
| 422 Unprocessable Entity | Error de validación de campos |
| 429 Too Many Requests | Rate limit excedido |
| 500 Internal Server Error | Error del servidor |
| 503 Service Unavailable | Servicio no disponible (health check) |

---

## Códigos de Error Completos

> [!note] Organización
> Códigos **base** (heredados por todos los endpoints) + códigos específicos por módulo. Cada código pertenece a un único módulo aunque algunos son reutilizable conceptualmente (ej: `*_NOT_FOUND`).

### Base (Auth + transversales)

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `TOKEN_EXPIRED` | 401 | El token JWT ha expirado |
| `TOKEN_INVALID` | 401 | El token JWT es inválido |
| `UNAUTHORIZED` | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos para esta acción |
| `USER_NOT_FOUND` | 404 | Usuario no encontrado |
| `EMAIL_ALREADY_EXISTS` | 409 | El email ya está registrado |
| `MFA_REQUIRED` | 401 | MFA requerido, verificación pendiente |
| `MFA_INVALID_CODE` | 401 | Código MFA incorrecto o expirado |
| `MFA_BACKUP_USED` | 401 | Código de respaldo ya utilizado |
| `FORCE_PASSWORD_CHANGE` | 403 | Debes cambiar tu contraseña antes de continuar |
| `PASSWORD_REUSED` | 400 | La contraseña no puede ser una de las 12 últimas utilizadas |
| `DEVICE_NOT_RECOGNIZED` | 403 | Dispositivo no reconocido, requiere re-autenticación |
| `SESSION_NOT_FOUND` | 404 | Sesión no encontrada o ya revocada |
| `RATE_LIMIT_EXCEEDED` | 429 | Límite de peticiones excedido |
| `VALIDATION_ERROR` | 422 | Error de validación de campos |
| `DATABASE_ERROR` | 500 | Error de base de datos |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

### Propiedades (§2, §3, §4, §5)

| Código | HTTP | Descripción |
|--------|------|-------------|
| `CONDOMINIUM_NOT_FOUND` | 404 | El condominio solicitado no existe |
| `TOWER_NOT_FOUND` | 404 | La torre solicitada no existe |
| `TOWER_HAS_PROPERTIES` | 409 | La torre tiene unidades asociadas y no puede eliminarse |
| `TOWER_NAME_ALREADY_EXISTS` | 409 | Ya existe una torre con ese nombre en el condominio |
| `PROPERTY_NOT_FOUND` | 404 | La unidad solicitada no existe |
| `PROPERTY_HAS_DEPENDENCIES` | 409 | La unidad tiene dependencias activas y no puede eliminarse |
| `PROPERTY_DUPLICATE_UNIT` | 409 | El número de unidad ya existe en el piso/torre especificado |
| `FLOOR_EXCEEDS_TOWER_LIMIT` | 422 | El piso supera la cantidad de pisos de la torre |
| `STATUS_HAS_ACTIVE_RESIDENTS` | 400 | No se puede cambiar a un estado que no admite residentes mientras haya residentes activos |
| `SAME_STATUS` | 400 | El estado seleccionado es el mismo que el actual |
| `STATUS_REASON_REQUIRED` | 422 | El motivo del cambio de estado es obligatorio |
| `COEFFICIENT_IMBALANCE` | 400 | El coeficiente causaría un desbalance en la suma total del condominio |
| `PROPERTY_TYPE_NOT_FOUND` | 404 | El tipo de propiedad no existe |
| `PROPERTY_TYPE_CODE_ALREADY_EXISTS` | 409 | El código del tipo de propiedad ya está en uso |
| `PROPERTY_TYPE_IN_USE` | 409 | El tipo está en uso (propiedades activas o seed protegido) |
| `PROPERTY_STATUS_NOT_FOUND` | 404 | El estado de propiedad no existe |
| `PROPERTY_STATUS_CODE_ALREADY_EXISTS` | 409 | El código del estado de propiedad ya está en uso |
| `PROPERTY_STATUS_IN_USE` | 409 | El estado está en uso (propiedades activas o seed protegido) |
| `PROPERTY_DOCUMENT_NOT_FOUND` | 404 | El documento solicitado no existe |
| `DOCUMENT_TOO_LARGE` | 400 | El archivo excede el tamaño máximo permitido (20MB) |
| `DOCUMENT_INVALID_TYPE` | 400 | El tipo de archivo no está permitido |
| `PROPERTY_DOCUMENT_TYPE_NOT_FOUND` | 404 | El tipo de documento no existe |
| `PROPERTY_DOCUMENT_TYPE_CODE_ALREADY_EXISTS` | 409 | El código del tipo de documento ya está en uso |
| `PROPERTY_DOCUMENT_TYPE_IN_USE` | 409 | El tipo de documento está en uso |

---

## Rate Limiting

> [!info] Fuente de verdad
> Ver configuración completa en [[API_JWT_IMPLEMENTATION]] Sección 4.1.
>
> Resumen para endpoints de Auth:
>
> | Endpoint | Límite | Ventana |
> |----------|--------|---------|
> | `POST /auth/login` | 5 intentos | 15 minutos |
> | `POST /auth/register` | 3 intentos | 1 hora |
> | `POST /auth/forgot-password` | 3 intentos | 1 hora |
> | `POST /auth/mfa/verify` | 3 intentos | 5 minutos |
> | API general (autenticado) | 1000 requests | 1 minuto |
> | API general (no autenticado) | 60 requests | 1 hora |

---

## Cómo Agregar un Endpoint Nuevo

> [!important] Flujo obligatorio
> Antes de escribir una sola línea de código, el endpoint debe estar documentado.

1. Crear o actualizar el documento en `01-api/endpoints/<FEATURE>.md` usando [[endpoints/_TEMPLATE]]
2. Completar: request, response, errores, sección **Diseño** (reglas, precondiciones, side effects, casos borde)
3. Agregar sección **Flujo** (Mermaid) solo si el endpoint es complejo
4. Agregar fila en el "Índice de Endpoints" de este documento (estado: "Diseñado")
5. Agregar códigos de error nuevos a "Códigos de Error Completos" de este documento
6. Si el flujo de uso no es obvio, agregar fila en "Flujos Comunes"
7. Verificar rate limiting en "Rate Limiting" / [[API_JWT_IMPLEMENTATION]] §4.1
8. Al implementar, cambiar estado a "Implementado" en el índice de este documento
9. Si afecta a Web o App, verificar si es cambio cross-project con skill `cross-project-change`

---

## Checklist de Implementación (código, una vez el contrato ya está documentado)

- [ ] Verificar que el endpoint está en el scope de la sesión actual ([[API_IMPLEMENTATION_PLAN]])
- [ ] Si requiere cambios en sesiones anteriores (Domain, Application), documentar como deuda técnica en [[API_SESSION_MANIFEST]]
- [ ] Crear Request DTO en `Application/DTOs/`
- [ ] Crear Response DTO en `Application/DTOs/`
- [ ] Crear o modificar UseCase en `Application/UseCases/`
- [ ] Crear Resource en `Infrastructure/Http/Resources/` (si aplica)
- [ ] Actualizar Controller en `Infrastructure/Http/Controllers/`
- [ ] Registrar ruta en `Presentation/routes.php`
- [ ] Crear Feature Test para el endpoint
- [ ] Documentar en Scribe (`php artisan scribe:generate`)
- [ ] Verificar formato de error único (sección "Formato de Respuesta de Error" de este documento)
- [ ] Marcar endpoint como "Implementado" en el índice de este documento
- [ ] Actualizar [[API_SESSION_MANIFEST]] con el nuevo endpoint y tests asociados

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|---|
| [[endpoints/_TEMPLATE]] | Plantilla para nuevos documentos de endpoint |
| [[endpoints/AUTH]] | Detalle de endpoints de autenticación |
| [[endpoints/HEALTH]] | Detalle de endpoint de health check |
| [[endpoints/PROPIEDADES]] | Detalle de endpoints de propiedades, documentos y cambios de estado |
| [[endpoints/TOWERS]] | Detalle de endpoints de torres |
| [[endpoints/PROPERTY_CATALOGS]] | Detalle de endpoints de catálogos (tipos y estados) |
| [[endpoints/CONDOMINIUMS]] | Detalle de endpoints de condominiums |
| [[API_DATABASE]] | Esquema de base de datos PostgreSQL |
| [[API_JWT_IMPLEMENTATION]] | Seguridad JWT (claims, rotación, blacklist, device fingerprint) |
| [[API_ARCHITECTURE]] | Arquitectura DDD, convenciones, ADRs |
| [[API_AGENTS]] | Mapa de navegación del proyecto API |
| [[00-shared/SYSTEM_CONTRACT]] | Contrato formal entre proyectos (índice cross-project) |
| [[00-shared/features/PROPIEDADES]] | Panorama global del feature Propiedades y Unidades |
                            