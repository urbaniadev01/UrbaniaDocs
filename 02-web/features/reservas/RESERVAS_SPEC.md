---
type: spec-tecnico
status: active
module: web
feature: reservas
tags: [web, reservas, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Reservas de áreas comunes

> Panorama global: [[00-shared/features/RESERVAS]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Gestión de áreas | Página | `/reservas/areas` | [[02-web/features/reservas/RESERVAS_UI_areas]] |
| Crear / editar área | Modal | — | [[02-web/features/reservas/RESERVAS_UI_crear-area]] |
| Gestión de reservas | Página | `/reservas` | [[02-web/features/reservas/RESERVAS_UI_gestion]] |
| Detalle de reserva | Drawer | — | [[02-web/features/reservas/RESERVAS_UI_detalle]] |
| Aprobar / rechazar | Modal | — | [[02-web/features/reservas/RESERVAS_UI_aprobar-rechazar]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/reservas` | `AdminOnlyRoute` |
| `/reservas/areas` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useAreas` | `GET /amenities` |
| `useCreateArea` | `POST /amenities` |
| `useUpdateArea` | `PATCH /amenities/{id}` |
| `useReservas` | `GET /bookings` |
| `useReserva` | `GET /bookings/{id}` |
| `useAprobarReserva` | `POST /bookings/{id}/approve` |
| `useRechazarReserva` | `POST /bookings/{id}/reject` |
| `useCancelarReserva` | `POST /bookings/{id}/cancel` |

---

## Tipos TypeScript

```ts
export type EstadoReserva = 'pendiente' | 'aprobada' | 'en_uso' | 'finalizada' | 'rechazada' | 'cancelada';

export interface AreaComun {
  id: string;
  nombre: string;
  descripcion: string;
  capacidad: number;
  tarifa: number;        // 0 si es gratuita
  horario_inicio: string;  // 'HH:MM'
  horario_fin: string;
  dias_disponibles: ('lun'|'mar'|'mie'|'jue'|'vie'|'sab'|'dom')[];
  activa: boolean;
  imagen_url: string | null;
}

export interface Reserva {
  id: string;
  area: AreaComun;
  unidad: { id: string; torre: string; numero: string; };
  residente: { nombre: string; };
  estado: EstadoReserva;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  asistentes: number;
  costo: number;
  comentario_admin: string | null;
  created_at: string;
}
```
