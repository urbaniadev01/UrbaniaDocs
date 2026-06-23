---
type: spec-tecnico
status: active
module: web
feature: vehiculos
tags: [web, vehiculos, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Control de vehículos

> Panorama global: [[00-shared/features/VEHICULOS]]

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Catálogo de vehículos | Página | `/vehiculos` | [[02-web/features/vehiculos/VEHICULOS_UI_catalogo]] |
| Registrar / editar | Modal | — | [[02-web/features/vehiculos/VEHICULOS_UI_crear-editar]] |
| Log de acceso vehicular | Página | `/vehiculos/acceso` | [[02-web/features/vehiculos/VEHICULOS_UI_log-acceso]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/vehiculos` | `AdminOnlyRoute` |
| `/vehiculos/acceso` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useVehiculos` | `GET /vehicles` |
| `useCreateVehiculo` | `POST /vehicles` |
| `useUpdateVehiculo` | `PATCH /vehicles/{id}` |
| `useDeleteVehiculo` | `DELETE /vehicles/{id}` |
| `useLogAcceso` | `GET /vehicles/access-log` |
| `useRegistrarAcceso` | `POST /vehicles/access-log` |

---

## Tipos TypeScript

```ts
export type TipoVehiculo = 'carro' | 'moto' | 'bicicleta' | 'otro';

export interface Vehiculo {
  id: string;
  tipo: TipoVehiculo;
  placa: string;
  marca: string;
  modelo: string | null;
  color: string;
  cupo_parqueadero: string | null;
  unidad: { id: string; torre: string; numero: string; };
  activo: boolean;
}
```
