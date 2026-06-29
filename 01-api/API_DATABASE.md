---
type: reference
status: active
module: auth, propiedades, directorio
tags: [postgresql, schema, migrations]
updated: 2026-06-28
---

# 🗄️ DATABASE_SCHEMA
## Esquema de Base de Datos de Urbania API

> [!info] Consultar
> Si la tarea involucra tablas, relaciones, migraciones, o modificaciones de esquema.
> **Migracion-Transparente**: El esquema de BD debe soportar evolucion sin perdida de datos. Migrations reversibles.

### Conexión al servidor de base de datos

> **PostgreSQL corre exclusivamente dentro de Docker** (servicio `db`, ver [[API_ARCHITECTURE#11. Docker Compose (Desarrollo)]]). No se instala ni se ejecuta una instancia local/nativa de PostgreSQL en ningún entorno (desarrollo, testing o producción) — siempre vía contenedor.

> [!danger] Seguridad
> Las credenciales NUNCA se documentan en texto plano en este archivo.
> Se configuran exclusivamente vía variables de entorno (`.env`, no versionado en git).
> Ver [[API_ARCHITECTURE#13. Variables de Entorno Requeridas]] para la lista completa
> (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
> Copiar `.env.example` a `.env` y ajustar los valores — `DB_HOST` debe quedar como `db`.

---

## Convenciones de Nomenclatura

| Elemento | Convencion | Ejemplo |
|----------|-----------|---------|
| Tablas | snake_case, plural | `users`, `common_zones` |
| Columnas | snake_case | `first_name`, `created_at` |
| Claves primarias | `id` (UUID v7) | `550e8400-e29b-41d4-a716-446655440000` |
| Claves foraneas | `{tabla_singular}_id` | `user_id` |
| Timestamps | `created_at`, `updated_at` | Laravel automatico |
| Soft deletes | `deleted_at` | Laravel automatico |

> [!note] Nota sobre timezone
> PostgreSQL debe configurarse con `timezone = 'UTC'`
> y Laravel con `APP_TIMEZONE=UTC`. Todas las fechas se almacenan y retornan 
> en formato ISO 8601 UTC (`YYYY-MM-DDThh:mm:ssZ`). Ver [[API_CONTRACT]].

> [!note] Nota sobre soft delete
> Usuarios con `deleted_at` NOT NULL no pueden autenticarse.
> El endpoint `/auth/me` retorna 404 para usuarios soft-deleted. 
> Solo admins pueden ver/restaurar usuarios eliminados (módulo Admin, P1).

| Indices | `idx_{tabla}_{columnas}` | `idx_entidad_entidad` |
| Constraints | `fk_{tabla}_{columna}` | `fk_reservations_user_id` |

---

### 2.1 Tabla: `users`

Almacena la información de autenticación principal de cada usuario.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único del usuario |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Correo electrónico (identificador de login) |
| `name` | VARCHAR(255) | NOT NULL | Nombre completo del usuario |
| `phone` | VARCHAR(20) | NULLABLE | Teléfono de contacto |
| `avatar_url` | VARCHAR(500) | NULLABLE | URL del avatar del usuario |
| `organization_id` | UUID v7 | FK → organizations.id, NOT NULL | Tenant/organización a la que pertenece el usuario |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash de contraseña (Argon2id) |
| `email_verified_at` | TIMESTAMP | NULLABLE | Fecha de verificación de email |
| `mfa_secret` | VARCHAR(32) | NULLABLE | Secreto TOTP para MFA (encriptado con AES-256-GCM) |
| `mfa_enabled` | BOOLEAN | DEFAULT FALSE | Indica si MFA está activo |
| `mfa_backup_codes` | JSONB | NULLABLE | Array de 10 códigos de respaldo (hasheados con Argon2id) |
| `failed_login_attempts` | SMALLINT | DEFAULT 0 | Contador de intentos fallidos consecutivos |
| `locked_until` | TIMESTAMP | NULLABLE | Timestamp hasta el cual la cuenta está bloqueada |

> [!note] Nota sobre bloqueo
> El desbloqueo es automático cuando `locked_until < NOW()`.
> No requiere acción manual. El campo `failed_login_attempts` se resetea a 0 en cada login exitoso.

| `last_login_at` | TIMESTAMP | NULLABLE | Último inicio de sesión exitoso |
| `last_login_ip` | INET | NULLABLE | IP del último login exitoso |
| `password_changed_at` | TIMESTAMP | NOT NULL | Fecha del último cambio de contraseña |
| `must_change_password` | BOOLEAN | DEFAULT FALSE | Forzar cambio de contraseña en próximo login |

> [!note] Nota sobre cambio forzado
> Si `must_change_password = true`, el login retorna 403 con código `FORCE_PASSWORD_CHANGE`.
> El usuario debe llamar a `POST /auth/change-password` antes de obtener tokens válidos. 
> Ver [[API_CONTRACT]] para detalles del endpoint.

| `role` | ENUM | NOT NULL, DEFAULT 'user' | Valores: `admin`, `user`. Derivado en claims JWT como `role` |
| `status` | ENUM | DEFAULT 'active' | Valores: `active`, `suspended`, `inactive` |

> [!note] Nota sobre transiciones de estado
> - `active` → `suspended`: Solo admin. Notifica al usuario por email.
> - `suspended` → `active`: Solo admin o automático después de periodo de suspensión.
> - `active` → `inactive`: Usuario desactiva su cuenta (soft delete).
> - `inactive` → `active`: Usuario reactiva su cuenta (requiere re-verificación si > 30 días).
> - Cualquier estado → `deleted` (soft delete): Solo admin o usuario propietario.

| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Índices recomendados:**
- `UNIQUE` en `email`
- `INDEX` en `role`
- `INDEX` en `status`
- `INDEX` en `locked_until` (para limpieza de bloqueos)
- `INDEX` en `deleted_at`

> [!note] Nota sobre `password_hash`
> Laravel por defecto espera la columna `password`.
> Para usar `password_hash`, configurar en el modelo Eloquent:
> ```php
> protected string $authPasswordName = 'password_hash';
> ```
> O sobrescribir el método `getAuthPassword()` en el modelo User.

> [!danger] Deprecación de `users.unit`
> La columna `unit` fue eliminada de `users` en CAMBIO-006 Sesión 3. La asociación persona-unidad es ahora canónica via `contacts` + `property_occupants`. Ver regla actor/party en [[SYSTEM_CONTRACT]].

> [!note] Invariante usuario-contacto
> Todo usuario activo debe tener un `contact` asociado (`contacts.user_id` UNIQUE). La migración `2026_06_28_000004_backfill_contacts_from_users` crea contacts faltantes al desplegar.

**Sintaxis ENUM PostgreSQL:**
```sql
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'inactive');
```

> [!note] Nota
> En Laravel migrations, usar `$table->enum('role', ['admin', 'user'])->default('user')` y `$table->enum('status', ['active', 'suspended', 'inactive'])`, o crear los TYPEs manualmente en PostgreSQL.

> [!note] Estructura de `mfa_backup_codes`
> La columna JSONB almacena un array de objetos:
> ```json
> [
>     {"hash": "$argon2id$v=19$...", "used_at": null},
>     {"hash": "$argon2id$v=19$...", "used_at": "2026-06-07T12:00:00Z"}
> ]
> ```
> Cada código es un string de 8 dígitos. Se almacena el hash Argon2id (no el código en claro).
> El campo `used_at` es NULL si no se ha usado, o contiene el timestamp ISO 8601 de uso.

### 2.2 Tabla: `refresh_tokens`

Almacena los refresh tokens activos con control de rotación y dispositivos.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador del registro |
| `user_id` | UUID v7 | FK → users.id, ON DELETE CASCADE | Usuario propietario |
| `session_id` | UUID v7 | NOT NULL | ID de sesión (vincula con Redis session:{session_id}) |
| `token_hash` | CHAR(64) | UNIQUE, NOT NULL | SHA-256 del refresh token (nunca almacenar el token en claro) |
| `token_family` | UUID v7 | NOT NULL | Familia de rotación (todos los tokens de una sesión comparten familia) |
| `previous_token_hash` | CHAR(64) | NULLABLE | SHA-256 del token anterior en la cadena de rotación |
| `device_fingerprint` | VARCHAR(64) | NOT NULL | Hash de fingerprint del dispositivo (user-agent + IP subnet) |
| `device_name` | VARCHAR(255) | NULLABLE | Nombre descriptivo del dispositivo (ej: "iPhone de Juan") |
| `ip_address` | INET | NOT NULL | IP desde la que se creó el token |
| `user_agent` | TEXT | NULLABLE | User-Agent del cliente |
| `expires_at` | TIMESTAMP | NOT NULL | Fecha de expiración del token |
| `revoked_at` | TIMESTAMP | NULLABLE | Fecha de revocación (si aplica) |
| `revocation_reason` | VARCHAR(50) | NULLABLE | Razón: `logout`, `password_change`, `suspicious_activity`, `admin_action` |
| `last_used_at` | TIMESTAMP | DEFAULT NOW() | Último uso del token |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Índices:**
- `UNIQUE` en `token_hash`
- `INDEX` en `user_id` + `revoked_at` (para listar sesiones activas)
- `INDEX` en `session_id` (para vinculación con sesiones Redis)
- `INDEX` en `token_family` (para detectar rotación ilegítima)
- `INDEX` en `expires_at` (para limpieza de tokens expirados)
- `INDEX` en `device_fingerprint` (para detectar dispositivos nuevos)

### 2.3 Tabla: `password_history`

Previene reutilización de contraseñas recientes.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador |
| `user_id` | UUID v7 | FK → users.id, ON DELETE CASCADE | Usuario |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash histórico de la contraseña |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha en que se usó esta contraseña |

**Restricción:** Mantener máximo los últimos 12 registros por usuario.

**Trigger PostgreSQL (máximo 12 registros por usuario):**

```sql
CREATE OR REPLACE FUNCTION limit_password_history()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM password_history
    WHERE user_id = NEW.user_id
    AND id NOT IN (
        SELECT id FROM password_history
        WHERE user_id = NEW.user_id
        ORDER BY created_at DESC
        LIMIT 12
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_password_history
BEFORE INSERT ON password_history
FOR EACH ROW
EXECUTE FUNCTION limit_password_history();
```

> [!note] Nota
> Implementar en migración de password_history. Ver [[API_SETUP_GUIDE]] Sección 7.2.

### 2.4 Tabla: `login_attempts`

Registro de auditoría de intentos de autenticación (para detección de ataques).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador |
| `user_id` | UUID v7 | NULLABLE, FK → users.id | Usuario (si se identificó) |
| `email_attempted` | VARCHAR(255) | NOT NULL | Email usado en el intento |
| `ip_address` | INET | NOT NULL | IP del cliente |
| `user_agent` | TEXT | NULLABLE | User-Agent |
| `was_successful` | BOOLEAN | NOT NULL | Si el login fue exitoso |
| `failure_reason` | VARCHAR(50) | NULLABLE | `invalid_credentials`, `account_locked`, `mfa_failed`, `token_expired` |
| `mfa_used` | BOOLEAN | DEFAULT FALSE | Si se requirió y usó MFA |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha del intento |

**Índices recomendados:**
- `INDEX` en `ip_address` + `created_at` (para rate limiting por IP)
- `INDEX` en `email_attempted` + `created_at` (para detección de fuerza bruta)
- `INDEX` en `was_successful` + `created_at` (para reportes de auditoría)

### 2.5 Tabla: `security_events`

Registro centralizado de eventos de seguridad relevantes.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador |
| `user_id` | UUID v7 | NULLABLE, FK → users.id | Usuario afectado |
| `event_type` | VARCHAR(50) | NOT NULL | Tipo: `login_success`, `login_failure`, `logout`, `token_refresh`, `token_revocation`, `password_change`, `mfa_enabled`, `mfa_disabled`, `account_locked`, `suspicious_activity` |
| `severity` | ENUM | NOT NULL | `low`, `medium`, `high`, `critical` |
| `ip_address` | INET | NOT NULL | IP del evento |
| `user_agent` | TEXT | NULLABLE | User-Agent |
| `details` | JSONB | NULLABLE | Datos adicionales estructurados |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha del evento |

**Índices recomendados:**
- `INDEX` en `user_id` + `created_at`
- `INDEX` en `event_type` + `created_at`
- `INDEX` en `severity` + `created_at`
- `GIN` en `details` (para consultas JSON)

**Sintaxis de índice GIN:**
```sql
CREATE INDEX idx_security_events_details ON security_events USING GIN (details);
```
> [!tip] Justificación del índice GIN
> Se utilizará para consultas de auditoría
> que filtran por campos específicos dentro del JSON `details`, como:
> - `details->>'ip_address'` para búsquedas por IP
> - `details->>'device_fingerprint'` para búsquedas por dispositivo
> - `details->>'token_family'` para investigación de rotación ilegítima

> [!note] Nota
> Implementar en migración de security_events. Ver [[API_SETUP_GUIDE]] Sección 7.2.

### 2.6 Tabla: `password_reset_tokens`

Almacena tokens para recuperación de contraseña.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `email` | VARCHAR(255) | PK | Email del usuario (clave primaria, un token activo por email) |
| `token` | VARCHAR(255) | NOT NULL | Token hash (SHA-256) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación del token |

**Índices:**
- `PRIMARY KEY` en `email`
- `INDEX` en `created_at` (para limpieza de tokens expirados)

**TTL**: Tokens expiran después de 60 minutos (limpieza por cron o verificación en código).

> [!note] Nota sobre roles
> Los roles se almacenan en la columna `users.role` (ENUM `admin`/`user`, DEFAULT `user`).
> No requieren tabla de roles/permisos separada para el MVP — el enum `UserRole { ADMIN, USER }` de [[API_ARCHITECTURE]] mapea 1:1 con los valores de esta columna.
> El claim `role` del JWT se deriva directamente de `users.role` al emitir el token.
> Ejemplo: `admin` → acceso de lectura/escritura completo, `user` → acceso limitado a sus propios recursos.

---

## 3. Directorio (3 tablas)

### 3.1 Tabla: `occupant_types`
Catálogo configurable de tipos de ocupante de una unidad (propietario, residente, inquilino, familiar, contacto_emergencia, empleado).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Código interno del tipo (ej: `owner`, `renter`, `family`) |
| `name` | VARCHAR(100) | NOT NULL | Nombre legible del tipo |
| `description` | TEXT | NULLABLE | Descripción opcional |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si está activo para nuevo uso |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de última actualización |

### 3.2 Tabla: `contacts`
Personas en el directorio del conjunto (con o sin usuario del sistema). Reemplaza `users.unit` como forma canónica de asociar personas a unidades. Regida por Ley 675 de 2001 (libro de propietarios).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único del contacto |
| `user_id` | UUID v7 | FK → users.id, ON DELETE SET NULL, UNIQUE, NULLABLE | Usuario del sistema vinculado (opcional) |
| `document_type` | VARCHAR(20) | NOT NULL | Tipo de documento (CC, NIT, CE, PA) |
| `document_number` | VARCHAR(30) | NOT NULL | Número de documento |
| `full_name` | VARCHAR(255) | NOT NULL | Nombre completo |
| `email` | VARCHAR(255) | NULLABLE | Correo electrónico |
| `phone` | VARCHAR(20) | NULLABLE | Teléfono de contacto |
| `emergency_contact_name` | VARCHAR(255) | NULLABLE | Contacto de emergencia — nombre |
| `emergency_contact_phone` | VARCHAR(20) | NULLABLE | Contacto de emergencia — teléfono |
| `notes` | TEXT | NULLABLE | Notas adicionales |
| `organization_id` | UUID v7 | FK → organizations.id, NOT NULL | Tenant/organización a la que pertenece el contacto |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Índices:**
- `UNIQUE` parcial en `(document_type, document_number)` WHERE `deleted_at IS NULL`
- `INDEX` en `user_id`

### 3.3 Tabla: `property_occupants`
Vincula un contacto a una unidad con un rol específico (tipo de ocupante), fechas de mudanza y flag de ocupante principal. Tabla central del Directorio.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único |
| `property_id` | UUID v7 | INDEX, FK → properties.id | Unidad ocupada |
| `contact_id` | UUID v7 | FK → contacts.id, ON DELETE RESTRICT | Contacto ocupante |
| `occupant_type_id` | UUID v7 | FK → occupant_types.id, ON DELETE RESTRICT | Tipo de ocupante |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Si es el ocupante principal (contacto oficial) |
| `move_in_date` | DATE | NULLABLE | Fecha de mudanza/ingreso |
| `move_out_date` | DATE | NULLABLE | Fecha de mudanza/salida |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si la ocupación está activa |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Índices:**
- `UNIQUE` parcial en `(property_id, contact_id, occupant_type_id)` WHERE `deleted_at IS NULL`
- `INDEX` en `property_id`
- `INDEX` en `contact_id`
- `INDEX` en `occupant_type_id`

### 3.4 Tabla: `reconciliation_users_unit` (tabla de migración)
Tabla temporal de reconciliación generada durante CAMBIO-006 Sesión 3. Guarda los valores de `users.unit` que no hicieron match con ninguna `properties.unit_number` para revisión manual antes de descartar la información.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador del registro |
| `user_id` | UUID v7 | NOT NULL | Usuario origen cuyo `unit` no pudo migrarse |
| `unit` | VARCHAR(50) | NOT NULL | Valor original de `users.unit` |
| `organization_id` | UUID v7 | NULLABLE | Organización del usuario origen |
| `reason` | TEXT | NULLABLE | Motivo del no-match |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de generación del reporte |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

> [!note] Nota
> Esta tabla no es parte del modelo de negocio permanente; se crea y limpia con la migración `2026_06_28_000005_migrate_users_unit_to_occupants`. Su `down()` la elimina. Sirve como punto de partida para la reconciliación manual de datos históricos de la era Auth.

---

## 4. Propiedades (8 tablas)

### 4.1 Tabla: `condominiums`
Conjunto residencial / propiedad horizontal. Raíz del inventario de propiedades. Cada condominio es un cliente/tenant del sistema SaaS. Contiene validación de coeficientes totales.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único del conjunto |
| `name` | VARCHAR(255) | NOT NULL | Nombre del conjunto residencial |
| `address` | TEXT | NULLABLE | Dirección física |
| `city` | VARCHAR(100) | NULLABLE | Ciudad |
| `department` | VARCHAR(100) | NULLABLE | Departamento/Estado |
| `country` | VARCHAR(100) | DEFAULT 'Colombia' | País |
| `nit` | VARCHAR(20) | UNIQUE, NULLABLE | NIT (identificación tributaria colombiana) |
| `phone` | VARCHAR(20) | NULLABLE | Teléfono del conjunto |
| `email` | VARCHAR(255) | NULLABLE | Correo electrónico oficial |
| `legal_representative` | VARCHAR(255) | NULLABLE | Representante legal (administrador) |
| `total_coefficient` | NUMERIC(7,6) | DEFAULT 1.000000 | Suma de coeficientes de copropiedad (debe ser 1.000000) |
| `logo_url` | VARCHAR(500) | NULLABLE | URL del logo del conjunto |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si el conjunto está activo en el sistema |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

### 4.2 Tabla: `towers`
Torre, bloque o sección dentro de un conjunto residencial. Entidad jerárquica entre condominium y property.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único de la torre |
| `condominium_id` | UUID v7 | FK → condominiums.id, CASCADE DELETE | Conjunto al que pertenece |
| `name` | VARCHAR(100) | NOT NULL | Nombre de la torre (ej: "Torre A", "Bloque 3") |
| `code` | VARCHAR(20) | NULLABLE | Código corto opcional |
| `floor_count` | SMALLINT | DEFAULT 1, CHECK > 0 | Cantidad de pisos |
| `has_elevator` | BOOLEAN | DEFAULT FALSE | Si tiene ascensor |
| `description` | TEXT | NULLABLE | Descripción opcional |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Índices:**
- `UNIQUE` en `(condominium_id, name)` — no pueden existir dos torres con el mismo nombre en el mismo conjunto
- `CHECK` `floor_count > 0`

### 4.3 Tabla: `property_types`
Catálogo configurable de tipos de unidad. El administrador puede agregar nuevos tipos sin deploy (apartamento, local, parqueadero, depósito, oficina, etc.).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Código interno (ej: `apartment`, `commercial`, `parking`) |
| `name` | VARCHAR(100) | NOT NULL | Nombre legible |
| `description` | TEXT | NULLABLE | Descripción opcional |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si está activo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

### 4.4 Tabla: `property_statuses`
Catálogo configurable de estados de unidad. Incluye `allows_residents` para proteger consistencia: si un estado no admite residentes, el sistema rechaza asignaciones.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Código interno (ej: `occupied`, `vacant`, `for_sale`, `renovation`) |
| `name` | VARCHAR(100) | NOT NULL | Nombre legible |
| `description` | TEXT | NULLABLE | Descripción opcional |
| `allows_residents` | BOOLEAN | DEFAULT TRUE | Si permite asignar residentes en este estado |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si está activo |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

### 4.5 Tabla: `property_document_types`
Catálogo configurable de tipos de documento que se pueden adjuntar a una unidad (escritura, plano, certificado de libertad, recibo de pago, contrato, etc.).

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Código interno (ej: `deed`, `blueprint`, `freedom_cert`) |
| `name` | VARCHAR(100) | NOT NULL | Nombre legible |
| `description` | TEXT | NULLABLE | Descripción opcional |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `is_active` | BOOLEAN | DEFAULT TRUE | Si está activo |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |

### 4.6 Tabla: `properties`
**Tabla central del módulo Propiedades.** Cada unidad individual dentro de un conjunto. Contiene datos catastrales, área, coeficiente de copropiedad y ubicación dentro de la torre.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único de la unidad |
| `condominium_id` | UUID v7 | FK → condominiums.id, CASCADE DELETE | Conjunto al que pertenece |
| `tower_id` | UUID v7 | FK → towers.id, CASCADE DELETE | Torre/bloque al que pertenece |
| `property_type_id` | UUID v7 | FK → property_types.id, CASCADE DELETE | Tipo de unidad |
| `property_status_id` | UUID v7 | FK → property_statuses.id, CASCADE DELETE | Estado actual de la unidad |
| `floor` | SMALLINT | NOT NULL, CHECK ≥ 0 | Piso donde se ubica (0 = sótano) |
| `unit_number` | VARCHAR(20) | NOT NULL | Número o identificación de la unidad (ej: "101", "A-201") |
| `area_m2` | NUMERIC(8,2) | NOT NULL, CHECK > 0 | Área en metros cuadrados |
| `coefficient` | NUMERIC(7,6) | NOT NULL, CHECK > 0 | Coeficiente de copropiedad (fracción) |
| `bedrooms` | SMALLINT | NULLABLE | Cantidad de habitaciones |
| `bathrooms` | SMALLINT | NULLABLE | Cantidad de baños |
| `has_parking` | BOOLEAN | DEFAULT FALSE | Si incluye parqueadero |
| `parking_lot` | VARCHAR(20) | NULLABLE | Identificador del parqueadero (ej: "Sótano 1 - Puesto 12") |
| `notes` | TEXT | NULLABLE | Notas adicionales |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Fecha de actualización |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Índices:**
- `UNIQUE` parcial en `(tower_id, floor, unit_number)` WHERE `deleted_at IS NULL`
- `INDEX` en `(condominium_id, tower_id)`
- `INDEX` en `(condominium_id, property_type_id)`
- `INDEX` en `(condominium_id, property_status_id)`
- `INDEX` en `coefficient`
- `INDEX` en `deleted_at`
- `CHECK` `floor >= 0`
- `CHECK` `area_m2 > 0`
- `CHECK` `coefficient > 0`

### 4.7 Tabla: `property_status_log`
Auditoría de cambios de estado por unidad. Registro obligatorio con motivo, origen y destino, para cumplimiento normativo.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único del registro |
| `property_id` | UUID v7 | FK → properties.id, CASCADE DELETE | Unidad cuyo estado cambió |
| `from_status_id` | UUID v7 | FK → property_statuses.id, CASCADE DELETE, NULLABLE | Estado anterior (NULL = primera vez) |
| `to_status_id` | UUID v7 | FK → property_statuses.id, CASCADE DELETE, NOT NULL | Nuevo estado |
| `changed_by_user_id` | UUID v7 | FK → users.id, CASCADE DELETE | Usuario que realizó el cambio |
| `reason` | TEXT | NOT NULL | Motivo del cambio (obligatorio por normativa) |
| `created_at` | TIMESTAMP | NOT NULL | Fecha del cambio |

**Índices:**
- `INDEX` en `(property_id, created_at)`

### 4.8 Tabla: `property_documents`
Documentos adjuntos por unidad (escrituras, planos, certificados, recibos). Archivos referenciados por URL con metadatos.

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID v7 | PK | Identificador único del documento |
| `property_id` | UUID v7 | FK → properties.id, CASCADE DELETE | Unidad asociada |
| `property_document_type_id` | UUID v7 | FK → property_document_types.id, CASCADE DELETE | Tipo de documento |
| `name` | VARCHAR(255) | NOT NULL | Nombre del archivo |
| `file_url` | VARCHAR(500) | NOT NULL | URL de almacenamiento del archivo |
| `file_size_bytes` | INTEGER | NULLABLE | Tamaño del archivo en bytes |
| `mime_type` | VARCHAR(100) | NULLABLE | Tipo MIME del archivo |
| `notes` | TEXT | NULLABLE | Notas adicionales |
| `uploaded_by_user_id` | UUID v7 | FK → users.id, CASCADE DELETE | Usuario que subió el documento |
| `created_at` | TIMESTAMP | NOT NULL | Fecha de subida |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete |

**Índices:**
- `INDEX` en `(property_id, created_at)`

---

## Migraciones Reversibles

Toda migration DEBE implementar el metodo `down()`:

---

## Checklist al Modificar el Esquema

