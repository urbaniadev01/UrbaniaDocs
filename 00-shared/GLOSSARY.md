---
type: reference
status: active
priority: P1
module: shared
tags: [glossary, domain, shared]
updated: 2026-06-18
---

# 📖 GLOSSARY
## Vocabulario de Dominio Compartido

> [!warning] Regla
> Confirmar el término aquí antes de nombrarlo en código o docs. Si el término no existe, propónlo. Si el mismo concepto aparece con nombres distintos entre proyectos, se corrige el código — no se agrega un sinónimo.

---

## Términos

| Término                | Significado                                                                                                               | Aparece en                                                                       |     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --- |
| Residente              | Usuario final de la app/web que habita o administra una unidad dentro de una propiedad horizontal                         | API (`users`), App                                                               |     |
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

## Términos Pendientes de Confirmar

| Término | Pregunta pendiente | Aparece en |
|---|---|---|
| Residente / `[PENDIENTE Web]` | ¿Web usa "Residente" (igual que API y App) o prefiere "Usuario"/"Cliente"? | API, App |
| Chat / Mensajería / `[PENDIENTE Web]` | ¿El módulo de mensajería se llama "Chat" o "Mensajería" en Web? | App |
| Sesión activa / `[PENDIENTE Web]` | ¿Web tiene concepto propio de "sesión activa" o simplemente refleja el estado del token JWT? | App |

> [!warning] El agente Web no debe inventar un sinónimo — escalar antes de nombrar entidades en código TypeScript.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[SYSTEM_CONTRACT]] | Referencia este glosario como parte del contrato compartido |
| [[FEATURE_PLANNING_TEMPLATE]] | Checklist de coherencia que exige usar estos términos |
