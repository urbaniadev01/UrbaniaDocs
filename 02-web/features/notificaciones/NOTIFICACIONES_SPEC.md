---
type: spec-tecnico
status: active
module: web
feature: notificaciones
tags: [web, notificaciones, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Notificaciones

> Panorama global: [[00-shared/features/NOTIFICACIONES]]
> Endpoints: [[01-api/endpoints/NOTIFICACIONES]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Centro de notificaciones | Página | `/notificaciones` | [[02-web/features/notificaciones/NOTIFICACIONES_UI_centro]] |
| Panel de notificaciones (header) | Inline | — | [[02-web/features/notificaciones/NOTIFICACIONES_UI_panel-header]] |
| Detalle de notificación | Modal | — | [[02-web/features/notificaciones/NOTIFICACIONES_UI_detalle]] |
| Preferencias | Página | `/notificaciones/preferencias` | [[02-web/features/notificaciones/NOTIFICACIONES_UI_preferencias]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/notificaciones` | `NotificacionesPage` | `ProtectedRoute` |
| `/notificaciones/preferencias` | `NotificacionesPreferenciasPage` | `ProtectedRoute` |

---

## Servicios y hooks

| Hook | Endpoint |
|---|---|
| `useNotificaciones` | `GET /notifications` |
| `useMarcarLeida` | `PATCH /notifications/{id}` |
| `useMarcarTodasLeidas` | `POST /notifications/read-all` |
| `usePreferencias` | `GET /notifications/preferences` |
| `useUpdatePreferencias` | `PATCH /notifications/preferences` |
| `useNotificacionesNoLeidas` (polling 60s) | `GET /notifications?leida=false&limit=10` |

---

## Tipos TypeScript

```ts
export type TipoNotificacion =
  | 'pago_recibido' | 'cuota_vencida' | 'pqrs_actualizada'
  | 'comunicado_nuevo' | 'asamblea_programada' | 'visitante_autorizado'
  | 'mora_nueva' | 'acuerdo_pago' | 'orden_trabajo';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  cuerpo: string;
  leida: boolean;
  accion_url: string | null;   // ruta a la que navegar al hacer click
  created_at: string;
}

export interface PreferenciasNotificaciones {
  [tipo: string]: {
    in_app: boolean;
    push: boolean;
    email: boolean;
  };
}
```

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /notifications` | [[01-api/endpoints/NOTIFICACIONES]] §1 |
| `PATCH /notifications/{id}` | [[01-api/endpoints/NOTIFICACIONES]] §2 |
| `POST /notifications/read-all` | [[01-api/endpoints/NOTIFICACIONES]] §3 |
| `GET/PATCH /notifications/preferences` | [[01-api/endpoints/NOTIFICACIONES]] §4 |
