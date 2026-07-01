---
type: endpoints
status: draft
module: api
feature: comunicaciones
tags: [api, endpoints, comunicaciones, wip]
updated: 2026-06-28
---

# Endpoints: Comunicaciones

> Panorama: [[00-shared/features/COMUNICACIONES]] · Esquema: [[01-api/API_DATABASE]] · Índice: [[API_CONTRACT]]
> Módulo `src/Comunicaciones`. JWT + `org_id`; scopeado por `condominium_id`. **WIP**.

---

## Endpoints en este documento
| # | Método | Ruta | Permiso | Estado |
|---|--------|------|---------|--------|
| 1 | GET | `/comunicaciones/announcements` | `comunicaciones.ver` | Diseñado |
| 2 | POST | `/comunicaciones/announcements` | `comunicaciones.crear` | Diseñado |
| 3 | GET | `/comunicaciones/announcements/:id` | `comunicaciones.ver` | Diseñado |
| 4 | GET/POST/PATCH/DELETE | `/comunicaciones/templates` | `comunicaciones.crear` | Diseñado |
| 5 | POST | `/comunicaciones/surveys` | `comunicaciones.crear` | Diseñado |
| 6 | GET | `/comunicaciones/surveys/:id/results` | `comunicaciones.ver` | Diseñado |
| 7 | POST | `/comunicaciones/surveys/:id/responses` | (residente) | Diseñado |
| 8 | GET/PUT | `/comunicaciones/channels` | `comunicaciones.configurar` | Diseñado |

---

## §1 Listar comunicados
```
GET /api/v1/comunicaciones/announcements?estado&segmento&page
```
**Response 200:** lista con `{ id, titulo, segmento, estado, programado_para, fijado, metrics:{enviados,entregados,leidos} }`.

## §2 Crear / programar comunicado
```
POST /api/v1/comunicaciones/announcements
```
**Request:**
```json
{ "titulo": "Corte de agua", "cuerpo": "...", "segmento": "torre", "target_id": "<tower_id>",
  "canales": ["whatsapp","email"], "programado_para": null, "fijado": false }
```
**Response 201:** comunicado en `borrador`/`programado`/`enviado`.
### Diseño
- **Reglas:** `segmento=morosos` requiere Cobranza activa; `target_id` obligatorio si segmento∈{torre,unidad}; valida que los `canales` estén `activo`.
- **Side effects:** resuelve destinatarios (`contacts`), encola `announcement_deliveries`, dispara jobs de envío. Emite `AnnouncementSent`.
- **Casos borde:** sin canal configurado → 422 `NO_ACTIVE_CHANNEL`.

## §3 Detalle + métricas
```
GET /api/v1/comunicaciones/announcements/:id
```
**Response 200:** contenido + desglose de `announcement_deliveries` por canal y estado (enviado/entregado/leído/fallido).

## §4 Plantillas (CRUD)
```
GET|POST|PATCH|DELETE /api/v1/comunicaciones/templates[/:id]
```
- `message_templates` reutilizables; `tipo` (convocatoria, recordatorio_pago, aviso).

## §5 Crear encuesta
```
POST /api/v1/comunicaciones/surveys
```
**Request:** `{ "pregunta":"...", "opciones":["A","B"], "cierra_el":"2026-07-01T00:00:00Z" }`

## §6 Resultados de encuesta
```
GET /api/v1/comunicaciones/surveys/:id/results
```
**Response 200:** conteo por opción + total; en tiempo real.

## §7 Responder encuesta (residente)
```
POST /api/v1/comunicaciones/surveys/:id/responses
```
**Request:** `{ "option_id":"..." }` — actor = `user`, party = `contact`. UNIQUE(survey, contact) → 409 `ALREADY_ANSWERED`.

## §8 Configurar canales
```
GET|PUT /api/v1/comunicaciones/channels
```
**Request (PUT):** `{ "canal":"whatsapp", "config":{ "provider":"meta|wati", "token":"..." }, "activo":true }`
### Diseño
- **Seguridad:** `config` nunca se devuelve en claro (solo `activo` + `provider` + máscara). Credenciales cifradas.
- **Webhook:** `POST /comunicaciones/webhooks/:provider` (público firmado) recibe estados de entrega y actualiza `announcement_deliveries`.

## Referencias
- Índice: [[API_CONTRACT]] · Esquema: [[API_DATABASE]] · Spec Web: [[02-web/features/comunicaciones/COMUNICACIONES_SPEC]]
