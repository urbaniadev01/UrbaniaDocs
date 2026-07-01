---
type: spec
status: draft
module: web
feature: comunicaciones
tags: [web, spec, comunicaciones, wip]
updated: 2026-06-28
---

# Spec Técnico Web: Comunicaciones

> Panorama: [[00-shared/features/COMUNICACIONES]] · Endpoints: [[01-api/endpoints/COMUNICACIONES]] · Componentes: [[WEB_COMPONENTS]]

---

## Pantallas del feature
| Pantalla | Tipo | Doc |
|---|---|---|
| Bandeja de comunicados | Página | [[COMUNICACIONES_UI_bandeja]] |
| Redactar comunicado | Página | [[COMUNICACIONES_UI_redactar]] |
| Detalle de comunicado | Drawer | [[COMUNICACIONES_UI_detalle]] |
| Cartelera / muro | Página | [[COMUNICACIONES_UI_cartelera]] |
| Plantillas | Página | [[COMUNICACIONES_UI_plantillas]] |
| Encuestas | Página | [[COMUNICACIONES_UI_encuestas]] |
| Resultados de encuesta | Drawer | [[COMUNICACIONES_UI_resultados-encuesta]] |
| Configurar canales | Página | [[COMUNICACIONES_UI_canales]] |

## Rutas
| Ruta | Componente | Guard |
|---|---|---|
| `/comunicaciones` | `AnnouncementsInboxPage` | `Can('comunicaciones.ver')` |
| `/comunicaciones/nuevo` | `ComposeAnnouncementPage` | `Can('comunicaciones.crear')` |
| `/comunicaciones/encuestas` | `SurveysPage` | `Can('comunicaciones.ver')` |
| `/comunicaciones/canales` | `ChannelsPage` | `Can('comunicaciones.configurar')` |

## Componentes
### Crear nuevos
| Componente | Responsabilidad |
|---|---|
| `AnnouncementComposer` | Editor + selector de segmento + canales + IA de redacción |
| `SegmentPicker` | todos/torre/morosos/unidad |
| `ChannelToggles` | WhatsApp/email/push (deshabilita si canal inactivo) |
| `DeliveryStats` | Barras de enviados/entregados/leídos |
| `SurveyBuilder` | Pregunta + opciones + cierre |
### Reutilizar
`DataTable`, `Drawer`, `EmptyState`, `RichTextEditor` — [[WEB_COMPONENTS]]

## Servicios y hooks
| Hook | Endpoint |
|---|---|
| `useAnnouncements` / `useAnnouncement` | `GET /comunicaciones/announcements[/:id]` |
| `useCreateAnnouncement` | `POST /comunicaciones/announcements` |
| `useTemplates` | `* /comunicaciones/templates` |
| `useSurveys` / `useSurveyResults` | `/comunicaciones/surveys…` |
| `useChannels` | `GET/PUT /comunicaciones/channels` |

## Estrategia de cache
| Query | staleTime | Invalidar |
|---|---|---|
| bandeja | 30s | al crear/enviar |
| detalle+métricas | 15s | polling mientras `estado != enviado` completo |
| resultados encuesta | 10s | polling en tiempo real |

## Tipos TypeScript
```ts
export type Channel = 'whatsapp'|'email'|'push';
export type Segment = 'todos'|'torre'|'morosos'|'unidad';
export interface Announcement { id:string; titulo:string; cuerpo:string; segmento:Segment;
  target_id:string|null; estado:'borrador'|'programado'|'enviado'; programado_para:string|null;
  fijado:boolean; metrics?:{enviados:number;entregados:number;leidos:number}; }
```

## Permisos
| Acción | Permiso |
|---|---|
| Ver | `comunicaciones.ver` |
| Crear/programar/plantillas/encuestas | `comunicaciones.crear` |
| Configurar canales | `comunicaciones.configurar` |

## Testing
| Tipo | Qué cubre |
|---|---|
| Unit | hooks con MSW (crear, métricas) |
| Component | `AnnouncementComposer` (segmento+canal), `SurveyBuilder` |
| E2E | redactar → enviar → ver métricas; crear encuesta → ver resultados |
