---
type: reference
status: active
module: auth
tags: [api, endpoints, rest]
updated: 2026-06-17
---

# 🔌 API_CONTRACT
## Contrato de API RESTful de Urbania

> [!info] Consultar
> Si la tarea involucra endpoints nuevos, modificacion de request/response, o autenticacion.
> **Fuente unica de endpoints**: Este es el UNICO documento con la lista de endpoints del proyecto.
> No existen specs de modulo por separado. Toda la informacion de un endpoint
> (request, response, errores, reglas) vive aqui. Al agregar un endpoint, agregarlo
> en este archivo en la misma sesion (ver "Plantilla para Endpoint Nuevo" al final).
> **Alcance actual**: Solo modulo Auth + Health Check. Otros modulos se agregan
> como nuevas secciones numeradas cuando se implementen.

---

## Indice de Endpoints

| #    | Metodo | Ruta                          | Auth                       | Estado   |
| ---- | ------ | ----------------------------- | -------------------------- | -------- |
| 1.1  | POST   | `/auth/login`                 | No                         | Diseñado |
| 1.2  | POST   | `/auth/register`              | No                         | Diseñado |
| 1.3  | POST   | `/auth/logout`                | Si                         | Diseñado |
| 1.4  | POST   | `/auth/refresh`               | No (refresh_token en body) | Diseñado |
| 1.5  | GET    | `/auth/me`                    | Si                         | Diseñado |
| 1.6  | POST   | `/auth/forgot-password`       | No                         | Diseñado |
| 1.7  | POST   | `/auth/reset-password`        | No                         | Diseñado |
| 1.8  | GET    | `/auth/sessions`              | Si                         | Diseñado |
| 1.9  | DELETE | `/auth/sessions`              | Si                         | Diseñado |
| 1.10 | DELETE | `/auth/sessions/{session_id}` | Si                         | Diseñado |
| 1.11 | POST   | `/auth/change-password`       | Si                         | Diseñado |
| 1.12 | POST   | `/auth/verify-email`          | No                         | Diseñado |
| 1.13 | POST   | `/auth/resend-verification`   | Si                         | Diseñado |
| 1.14 | PATCH  | `/auth/me`                    | Si                         | Diseñado |
| 1.15 | POST   | `/auth/mfa/setup`             | Si                         | Diseñado |
| 1.16 | POST   | `/auth/mfa/verify`            | No*                        | Diseñado |
| 1.17 | POST   | `/auth/mfa/verify-backup`     | No*                        | Diseñado |
| 1.18 | POST   | `/auth/mfa/enable`            | Si                         | Diseñado |
| 1.19 | POST   | `/auth/mfa/disable`           | Si                         | Diseñado |
| 1.20 | POST   | `/auth/mfa/backup-codes`      | Si                         | Diseñado |
| 11.1 | GET    | `/health`                     | No                         | Diseñado |

> `*` `/auth/mfa/verify` y `/auth/mfa/verify-backup` se usan tanto durante login (sin token, tras credenciales validas) como ya autenticado; ver Sec 1.16-1.17.
> **Estado**: "Diseñado" = contrato definido aqui, pendiente o en implementacion. "Implementado" = codigo y tests en `main`. Actualizar la columna al cerrar cada endpoint (ver checklist de [[AGENTS]]).
> Todas las rutas llevan el prefijo `/api/v1` (omitido aqui por brevedad). Base URL en la seccion siguiente.

---

## Flujos Comunes (referencia rapida para integracion)

> Notacion compacta para que un cliente (web, movil, u otro servicio) sepa
> encadenar llamadas sin tener que leer cada seccion. `Bearer` = requiere
> `Authorization: Bearer <access_token>`.

| Flujo | Secuencia |
|-------|-----------|
| Login simple | `POST /auth/login {email,password}` → `200 {access_token,refresh_token,user}` |
| Login con MFA | `POST /auth/login {email,password}` → `401 MFA_REQUIRED` → `POST /auth/mfa/verify {code,type:"login"}` → `200 {access_token,refresh_token,user}` |
| Sesion expirada | `401 TOKEN_EXPIRED` en cualquier endpoint Bearer → `POST /auth/refresh {refresh_token}` → `200 {access_token,refresh_token}` → reintentar request original |
| Logout | `POST /auth/logout` (Bearer) → `204` (revoca el refresh_token de la sesion actual) |
| Registro | `POST /auth/register {...}` → `201 {user}` (sin tokens) → `POST /auth/login` para obtener tokens |
| Olvido de contraseña | `POST /auth/forgot-password {email}` → `200` → usuario recibe email → `POST /auth/reset-password {email,token,password,password_confirmation}` → `200` |
| Cambio de contraseña autenticado | `POST /auth/change-password {current_password,new_password,new_password_confirmation}` (Bearer) → `200` (revoca TODAS las sesiones, incl. la actual: requiere nuevo login) |
| Activar MFA | `POST /auth/mfa/setup` (Bearer) → `200 {secret,qr_code_url,backup_codes}` → `POST /auth/mfa/enable {code}` (Bearer) → `200` |
| Desactivar MFA | `POST /auth/mfa/disable {password,code}` (Bearer) → `200` |
| Verificar email | Usuario hace click en link del email → `POST /auth/verify-email {token}` → `200` |
| Forzar cambio de contraseña | Login → `403 FORCE_PASSWORD_CHANGE` → `POST /auth/change-password` (con credenciales actuales) → luego login normal |

---

## Convenciones Generales

### Base URL
```
Desarrollo:   http://localhost:8080/api/
Produccion:   https://api.urbania.com/
```

### Headers Obligatorios
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>    (excepto endpoints publicos)
X-Trace-Id: <uuid>                   (opcional. Si no se envia, el servidor genera uno automaticamente)
X-Device-Name: <string>              (opcional, max 255 chars)
```

> [!note] Nota sobre X-Device-Fingerprint
> Este header ha sido **deprecado**.
> El servidor calcula el `device_fingerprint` automáticamente a partir de 
> `User-Agent`, `IP`, `Accept-Language` y `X-Device-Name` (opcional).
> Ver [[JWT_IMPLEMENTATION]] §4.3 para detalles del cálculo.

### Formato de Fechas

Todas las fechas en respuestas DEBEN usar formato ISO 8601 en UTC:
- Formato: `YYYY-MM-DDThh:mm:ssZ`
- Ejemplo: `2026-06-07T12:00:00Z`
- **Prohibido** usar zonas horarias locales o formatos alternativos.

Ver [[ARCHITECTURE]] §13 (`APP_TIMEZONE=UTC`).

### Formato de Respuesta de Exito
```json
{
  "data": { ... },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Formato de Respuesta de Error (UNICO FORMATO)
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
> Este es el UNICO formato de error permitido en toda la API.
> Todos los documentos deben usar este formato. No usar `error_code` a nivel raiz
> ni `success: false`.

### Codigos HTTP

| Codigo | Uso |
|--------|-----|
| 200 OK | GET exitoso, recurso encontrado |
| 201 Created | POST exitoso, recurso creado |
| 204 No Content | DELETE exitoso, PUT sin body |
| 400 Bad Request | Error de validacion de negocio |
| 401 Unauthorized | Token invalido o expirado |
| 403 Forbidden | Sin permisos para el recurso |
| 404 Not Found | Recurso no existe |
| 409 Conflict | Conflicto de estado (ej: reserva duplicada) |
| 422 Unprocessable Entity | Error de validacion de campos |
| 429 Too Many Requests | Rate limit excedido |
| 500 Internal Server Error | Error del servidor |
| 503 Service Unavailable | Servicio no disponible (health check) |

##### 1. Autenticacion (`/auth`)

### 1.1 Login
```
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "juan.perez@email.com",
  "password": "SecurePass123!"
}
```

> [!note] Nota
> El login requiere `email` y `password`. Si el usuario tiene MFA habilitado, el login retorna 401 con `error.code = "MFA_REQUIRED"`. Ver [[JWT_IMPLEMENTATION]] §7.1.

> [!note] Nota sobre soft-delete
> Si el usuario autenticado tiene `deleted_at` NOT NULL,
> el endpoint retorna **404** con código `USER_NOT_FOUND`. Solo administradores pueden acceder a usuarios eliminados.

**Response 200:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Perez",
      "email": "juan.perez@email.com",
      "phone": "3001234567",
      "unit": "Apto 101",
      "role": "user",
      "status": "active",
      "avatar_url": null
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 401:**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Las credenciales proporcionadas son incorrectas",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.2 Register
```
POST /api/v1/auth/register
```

**Request:**
```json
{
  "name": "Juan Perez",
  "email": "juan.perez@email.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "phone": "3001234567",
  "unit": "Apto 205"
}
```

> [!info] Nota
> El registro solo requiere datos básicos del usuario. La asociación con una propiedad/unidad queda fuera del alcance de este modulo y de esta documentacion.

**Response 201:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Juan Perez",
    "email": "juan.perez@email.com",
    "phone": "3001234567",
    "unit": "Apto 205",
    "role": "user",
    "status": "active",
    "message": "Registro exitoso. Bienvenido a Urbania."
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.3 Logout
```
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 204:** (No Content)
### 1.4 Refresh Token
```
POST /api/v1/auth/refresh
```

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 900
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.5 Me (Perfil Actual)
```
GET /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 200:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Perez",
    "email": "juan.perez@email.com",
    "phone": "3001234567",
    "unit": "Apto 101",
    "role": "user",
    "status": "active",
    "avatar_url": null
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.6 Forgot Password
```
POST /api/v1/auth/forgot-password
```

**Request:**
```json
{
  "email": "juan.perez@email.com"
}
```

> [!note] Nota
> Se requiere el email para enviar el enlace de recuperacion.
> La tabla `password_reset_tokens` usa `email` como clave primaria.

**Response 200:**
```json
{
  "data": {
    "message": "Se ha enviado un enlace de recuperacion a tu correo electronico"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.7 Reset Password
```
POST /api/v1/auth/reset-password
```

**Request:**
```json
{
  "email": "juan.perez@email.com",
  "token": "reset-token-from-email",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Contrasena actualizada exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.8 Listar Sesiones Activas
```
GET /api/v1/auth/sessions
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 200:**
```json
{
  "data": {
    "sessions": [
      {
        "session_id": "550e8400-e29b-41d4-a716-446655440000",
        "device_name": "Chrome 125 en Windows 10",
        "device_fingerprint": "a1b2c3d4...",
        "ip_address": "192.168.1.1",
        "last_used_at": "2026-06-07T12:00:00Z",
        "created_at": "2026-06-01T10:00:00Z",
        "is_current": true
      }
    ]
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---
### 1.9 Revocar Todas las Sesiones (excepto actual)
```
DELETE /api/v1/auth/sessions
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 204:** (No Content)

---
### 1.10 Revocar Sesión Específica
```
DELETE /api/v1/auth/sessions/{session_id}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 204:** (No Content)

**Response 404:**
```json
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Sesión no encontrada o ya revocada",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---
### 1.11 Cambiar Contraseña (Autenticado)
```
POST /api/v1/auth/change-password
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "current_password": "SecurePass123!",
  "new_password": "NewSecurePass456!",
  "new_password_confirmation": "NewSecurePass456!"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Contraseña actualizada exitosamente. Se han revocado todas las sesiones activas."
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 400:**
```json
{
  "error": {
    "code": "PASSWORD_REUSED",
    "message": "La nueva contraseña no puede ser una de las 12 últimas utilizadas",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---
### 1.12 Verificar Email
```
POST /api/v1/auth/verify-email
```

**Request:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Email verificado exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.13 Reenviar Verificación de Email
```
POST /api/v1/auth/resend-verification
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 200:**
```json
{
  "data": {
    "message": "Se ha enviado un nuevo enlace de verificación a tu correo"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---
### 1.14 Actualizar Perfil
```
PATCH /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "Juan Perez Actualizado",
  "phone": "3009876543",
  "avatar": "base64-encoded-image"   // Maximo 2MB. Formatos: JPEG, PNG, WebP
}
```

**Response 200:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Perez Actualizado",
    "email": "juan.perez@email.com",
    "phone": "3009876543",
    "role": "user",
    "status": "active",
    "avatar_url": "https://api.urbania.com/storage/avatars/550e8400-e29b-41d4-a716-446655440000.jpg"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---
### 1.15 MFA - Configurar (Setup)
```
POST /api/v1/auth/mfa/setup
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 200:**
```json
{
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qr_code_url": "otpauth://totp/Urbania:juan.perez@email.com?secret=JBSWY3DPEHPK3PXP&issuer=Urbania",
    "backup_codes": ["12345678", "87654321", "11223344", "44332211", "55667788", "88776655", "99001122", "22110099", "33445566", "66554433"]
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

> [!note] Nota
> Los backup codes se muestran SOLO durante el setup. Almacenar hash (Argon2id) en DB.
### 1.16 MFA - Verificar Código (Setup/Login)
```
POST /api/v1/auth/mfa/verify
```

**Request:**
```json
{
  "code": "123456",
  "type": "setup"  // "setup" o "login"
}
```

**Response 200 (Setup):**
```json
{
  "data": {
    "message": "MFA habilitado exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 200 (Login - despu¨¦s de credenciales válidas):**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Perez",
      "email": "juan.perez@email.com",
      "role": "user",
      "status": "active"
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.17 MFA - Verificar Código de Respaldo
```
POST /api/v1/auth/mfa/verify-backup
```

**Request:**
```json
{
  "code": "12345678"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Código de respaldo verificado exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 401 (código ya usado):**
```json
{
  "error": {
    "code": "MFA_BACKUP_USED",
    "message": "Código de respaldo ya utilizado",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

> [!note] Nota
> Los códigos de respaldo son de un solo uso. Al usarse, se invalidan permanentemente. Ver [[JWT_IMPLEMENTATION]] §7.2.
### 1.18 MFA - Habilitar
```
POST /api/v1/auth/mfa/enable
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "code": "123456"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "MFA habilitado exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.19 MFA - Deshabilitar
```
POST /api/v1/auth/mfa/disable
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "password": "Usuario2026!",
  "code": "123456"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "MFA deshabilitado exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```
### 1.20 MFA - Regenerar Backup Codes
```
POST /api/v1/auth/mfa/backup-codes
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 200:**
```json
{
  "data": {
    "backup_codes": ["99887766", "66554433", "11223344", "44332211", "55667788", "88776655", "99001122", "22110099", "33445566", "12345678"]
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

> [!note] Nota
> Los códigos anteriores quedan invalidados. Almacenar hash (Argon2id) de cada código.

---

---

## 11. Health Check (`/health`)

> [!note] Implementacion
> Ver [[SETUP_GUIDE]] §10 para verificacion post-setup.
> **Testing**: Ver [[TESTING]] §3.4 para feature tests del endpoint.

### 11.1 Health Check
```
GET /api/v1/health
```

**Response 200 (Healthy):**
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "2026-05-20T16:00:00Z",
    "checks": {
      "database": {
        "healthy": true,
        "message": "Connected"
      },
      "redis": {
        "healthy": true,
        "message": "Connected"
      },
      "storage": {
        "healthy": true,
        "message": "Writable"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 503 (Unhealthy):**
```json
{
  "data": {
    "status": "unhealthy",
    "timestamp": "2026-05-20T16:00:00Z",
    "checks": {
      "database": {
        "healthy": false,
        "message": "Connection refused"
      },
      "redis": {
        "healthy": true,
        "message": "Connected"
      },
      "storage": {
        "healthy": true,
        "message": "Writable"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Codigos de Error Completos

| Codigo | HTTP | Descripcion |
|--------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email o contrasena incorrectos |
| `TOKEN_EXPIRED` | 401 | El token JWT ha expirado |
| `TOKEN_INVALID` | 401 | El token JWT es invalido |
| `UNAUTHORIZED` | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos para esta accion |
| `USER_NOT_FOUND` | 404 | Usuario no encontrado |
| `EMAIL_ALREADY_EXISTS` | 409 | El email ya esta registrado |
| `MFA_REQUIRED` | 401 | MFA requerido, verificación pendiente |
| `MFA_INVALID_CODE` | 401 | Código MFA incorrecto o expirado |
| `MFA_BACKUP_USED` | 401 | Código de respaldo ya utilizado |
| `FORCE_PASSWORD_CHANGE` | 403 | Debes cambiar tu contraseña antes de continuar |
| `PASSWORD_REUSED` | 400 | La contraseña no puede ser una de las 12 últimas utilizadas |
| `DEVICE_NOT_RECOGNIZED` | 403 | Dispositivo no reconocido, requiere re-autenticación |
| `SESSION_NOT_FOUND` | 404 | Sesión no encontrada o ya revocada |
| `RATE_LIMIT_EXCEEDED` | 429 | Limite de peticiones excedido |
| `VALIDATION_ERROR` | 422 | Error de validacion de campos |
| `DATABASE_ERROR` | 500 | Error de base de datos |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

> [!note] Nota
> Esta tabla solo incluye codigos usados por los endpoints documentados
> en este archivo (base + Auth). Al agregar un endpoint de un modulo nuevo, agregar
> aqui sus codigos de error especificos en la misma sesion en que se implementa.

---

## Rate Limiting

> [!info] Fuente de verdad
> Ver configuración completa en [[JWT_IMPLEMENTATION]] Sección 4.1.
> 
> Resumen para endpoints de Auth:
> 
> | Endpoint | Limite | Ventana |
> |----------|--------|---------|
> | `POST /auth/login` | 5 intentos | 15 minutos |
> | `POST /auth/register` | 3 intentos | 1 hora |
> | `POST /auth/forgot-password` | 3 intentos | 1 hora |
> | `POST /auth/mfa/verify` | 3 intentos | 5 minutos |
> | API general (autenticado) | 1000 requests | 1 minuto |
> | API general (no autenticado) | 60 requests | 1 hora |

---

## Plantilla para Endpoint Nuevo

> Copiar este bloque dentro de la seccion del modulo correspondiente (o crear
> una seccion numerada nueva si es el primer endpoint del modulo) y completar.

`### N.M <Nombre corto>`
```
METODO /api/v1/<ruta>
```

**Headers:** (solo si difiere de los Headers Obligatorios globales)

**Request:**
```json
{ }
```

**Response <codigo>:**
```json
{ "data": { }, "meta": { "trace_id": "..." } }
```

**Response <codigo_error>:**
```json
{ "error": { "code": "...", "message": "...", "trace_id": "..." } }
```

- [ ] Agregar fila en "Indice de Endpoints" (estado: Diseñado)
- [ ] Agregar codigos de error nuevos a "Codigos de Error Completos"
- [ ] Si el flujo de uso no es obvio, agregar fila en "Flujos Comunes"
- [ ] Verificar rate limiting en "Rate Limiting" / [[JWT_IMPLEMENTATION]] §4.1
- [ ] Al implementar, cambiar estado a "Implementado" en el indice

---

## Checklist de Implementacion (codigo, una vez el contrato ya esta documentado arriba)

- [ ] Verificar que el endpoint esta en el scope de la sesion actual ([[IMPLEMENTATION_PLAN]])
- [ ] Si requiere cambios en sesiones anteriores (Domain, Application), documentar como deuda tecnica en [[SESSION_MANIFEST]]
- [ ] Crear Request DTO en `Application/DTOs/`
- [ ] Crear Response DTO en `Application/DTOs/`
- [ ] Crear o modificar UseCase en `Application/UseCases/`
- [ ] Crear Resource en `Infrastructure/Http/Resources/` (si aplica)
- [ ] Actualizar Controller en `Infrastructure/Http/Controllers/`
- [ ] Registrar ruta en `Presentation/routes.php`
- [ ] Crear Feature Test para el endpoint
- [ ] Documentar en Scribe (`php artisan scribe:generate`)
- [ ] Verificar formato de error unico (seccion "Formato de Respuesta de Error" de este documento)
- [ ] Actualizar [[SESSION_MANIFEST]] con el nuevo endpoint y tests asociados