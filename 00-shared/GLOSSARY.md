---
type: reference
status: active
priority: P1
module: shared
tags: [glossary, domain, shared]
updated: 2026-06-28
---

# 📖 GLOSSARY
## Vocabulario de Dominio Compartido

> [!warning] Regla
> Confirmar el término aquí antes de nombrarlo en código o docs. Si el término no existe, propónlo. Si el mismo concepto aparece con nombres distintos entre proyectos, se corrige el código — no se agrega un sinónimo.

---

## Términos

| Término                | Significado                                                                                                               | Aparece en                                                                       |     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --- |
| Residente              | Persona que habita o administra una unidad. Se modela como `contact` + `property_occupants` con tipo `residente`; ya no como atributo de `users`. | API (`contacts`, `property_occupants`), App, Web                               |     |
| Propiedad horizontal   | El conjunto/edificio/condominio administrado por el sistema (término legal colombiano para "condominio")                  | API, App                                                                         |     |
| Unidad                 | Apartamento/casa/local dentro de una propiedad horizontal, asociado a uno o más residentes                                | API, App                                                                         |     |
| Zona común             | Espacio compartido reservable (salón social, piscina, BBQ, etc.) — ver tabla `common_zones` en `API_DATABASE.md`          | API, App (`APP_FEATURE_SCOPE.md`)                                                |     |
| Reserva                | Solicitud de uso de una zona común en un horario específico                                                               | App (`APP_FEATURE_SCOPE.md`, `APP_DATA_STRATEGY.md`) — contrato de API pendiente |     |
| Visita                 | Registro de un visitante esperado/ingresado a la propiedad horizontal                                                     | App — contrato de API pendiente                                                  |     |
| PQRS                   | Petición, Queja, Reclamo o Sugerencia — mecanismo formal de comunicación del residente hacia la administración            | App — contrato de API pendiente                                                  |     |
| MFA                    | Autenticación multifactor (TOTP + códigos de respaldo)                                                                    | API (`API_JWT_IMPLEMENTATION.md`), App                                           |     |
| `trace_id`             | Identificador único de una request/respuesta del API, usado para correlacionar logs entre cliente y servidor              | API, App                                                                         |     |
| Device fingerprint     | Huella de dispositivo calculada server-side (User-Agent + IP + Accept-Language + X-Device-Name) para identificar sesiones | API, App                                                                         |     |
| Refresh token rotation | Mecanismo de seguridad donde cada uso de un refresh token lo invalida y emite uno nuevo, detectando reutilización         | API, App                                                                         |     |
| Condominium | Conjunto residencial / propiedad horizontal administrado por el sistema. Entidad raíz del inventario. | API, Web, App |
| Torre / Bloque | Subdivisión estructural dentro de un condominio. | API, Web |
| Unidad (Property) | Apartamento, casa, local o parqueadero individual dentro de un condominio. Tabla `properties`. | API, Web, App |
| Coeficiente de copropiedad | Fracción (NUMERIC 7,6) que determina el porcentaje de propiedad y gastos comunes de una unidad. | API |
| Contacto (Contact) | Persona registrada en el directorio del conjunto. Todo usuario del sistema tiene un contacto asociado (`contacts.user_id` UNIQUE). Tabla `contacts`. | API, Web |
| Ocupante (Occupant) | Vínculo entre un contacto y una unidad con un tipo de ocupante específico. Tabla `property_occupants`. | API, Web |
| Tipo de ocupante | Catálogo configurable de roles dentro de una unidad (propietario, residente, inquilino, etc.). Tabla `occupant_types`. | API, Web |
| Party | Concepto de pertenencia: la persona (`contact_id`) vinculada a una unidad (`property_id`) para efectos de derechos, obligaciones o trámites (dueño de cuenta, residente de reserva, radicante de PQRS). | API, Web, App |
| Actor | Concepto de autoría: el usuario (`user_id`) que ejecuta una acción o crea un registro (created_by, aprobó pago, cambió estado). Distinto de party. | API, Web, App |

## Términos Pendientes de Confirmar

| Término | Pregunta pendiente | Aparece en |
|---|---|---|
| ~~Residente~~ → Cerrado | Resuelto: todos los proyectos usan **"Residente"** para el usuario final que habita una unidad. Web usará "Residente" en toda la interfaz de administración. | API, Web, App |
| ~~Chat / Mensajería~~ → Cerrado | Resuelto: el módulo se llama **"Comunicaciones"** (ver feature #6). El canal interno es "Mensajería". "Chat" se reserva para integración con WhatsApp. | App |
| ~~Sesión activa~~ → Cerrado | Resuelto: Web refleja el estado del token JWT (access_token vigente). No tiene sesión server-side propia más allá del refresh token. | Web |
| Organization / Tenant | ¿El tenant raíz es "organization" o "condominium" directamente? Pendiente de definir en la capa multi-tenant (CAMBIO-006) | API, Web |
| Contact / Vendor / Third Party | ¿Cómo se relacionan `contact`, `vendor` (proveedor) y `third_party` (tercero contable)? ¿Son tablas separadas o una sola con tipo? Pendiente de definir en Contabilidad | API |
| Condominium vs Propiedad Horizontal | ¿Se usa "Condominium" en código (inglés) y "Propiedad Horizontal" / "Conjunto" en UI? Confirmar con el equipo de producto | API, Web, App |

> [!warning] Términos nuevos
> Los términos `organization`, `vendor` y `third_party` se resolverán al implementar la capa SaaS (CAMBIO-006) y Contabilidad (Feature #17). No inventar sinónimos antes de esa decisión.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[SYSTEM_CONTRACT]] | Referencia este glosario como parte del contrato compartido |
| [[FEATURE_PLANNING_TEMPLATE]] | Checklist de coherencia que exige usar estos términos |
