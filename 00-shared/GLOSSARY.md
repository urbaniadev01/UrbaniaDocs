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

> [!info] Consultar
> Antes de nombrar un concepto de dominio en código o documentación nueva. Si el término que necesitas no está aquí, propónlo — no se inventa un sinónimo paralelo a uno ya existente.

> [!warning] Regla
> Si "zona común" se llama distinto en dos proyectos, se corrige el código/los documentos para que coincidan — no se agrega una segunda entrada como "sinónimo válido".

---

## Términos Confirmados (semilla inicial)

> Extraídos de la documentación ya existente de API y App. Se completa/corrige a medida que se incorpora Web y surgen divergencias.

| Término | Significado | Aparece en |
|---|---|---|
| Residente | Usuario final de la app/web que habita o administra una unidad dentro de una propiedad horizontal | API (`users`), App |
| Propiedad horizontal | El conjunto/edificio/condominio administrado por el sistema (término legal colombiano para "condominio") | API, App |
| Unidad | Apartamento/casa/local dentro de una propiedad horizontal, asociado a uno o más residentes | API, App |
| Zona común | Espacio compartido reservable (salón social, piscina, BBQ, etc.) — ver tabla `common_zones` en `API_DATABASE.md` | API, App (`APP_FEATURE_SCOPE.md`) |
| Reserva | Solicitud de uso de una zona común en un horario específico | App (`APP_FEATURE_SCOPE.md`, `APP_DATA_STRATEGY.md`) — contrato de API pendiente |
| Visita | Registro de un visitante esperado/ingresado a la propiedad horizontal | App — contrato de API pendiente |
| PQRS | Petición, Queja, Reclamo o Sugerencia — mecanismo formal de comunicación del residente hacia la administración | App — contrato de API pendiente |
| MFA | Autenticación multifactor (TOTP + códigos de respaldo) | API (`API_JWT_IMPLEMENTATION.md`), App |
| `trace_id` | Identificador único de una request/respuesta del API, usado para correlacionar logs entre cliente y servidor | API, App |
| Device fingerprint | Huella de dispositivo calculada server-side (User-Agent + IP + Accept-Language + X-Device-Name) para identificar sesiones | API, App |
| Refresh token rotation | Mecanismo de seguridad donde cada uso de un refresh token lo invalida y emite uno nuevo, detectando reutilización | API, App |

---

## Términos Pendientes de Confirmar (al incorporar Web)

- ¿Web usa el mismo término "Residente" o algo como "Usuario"/"Cliente"?
- ¿El flujo de chat se llama igual en los 3 proyectos, o Web lo llama "Mensajería" y App "Chat"?
- Confirmar si Web tiene su propio concepto de "sesión activa" equivalente al de App.

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[SYSTEM_CONTRACT]] | Referencia este glosario como parte del contrato compartido |
| [[FEATURE_PLANNING_TEMPLATE]] | Checklist de coherencia que exige usar estos términos |
