---
type: spec-tecnico
status: active
module: web
feature: mora
tags: [web, mora, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Cartera de mora

> Panorama global: [[00-shared/features/MORA]]
> Endpoints: [[01-api/endpoints/MORA]]

---

## Pantallas del feature

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Reporte de mora | Página | `/mora` | [[02-web/features/mora/MORA_UI_reporte]] |
| Detalle de mora por unidad | Drawer | — | [[02-web/features/mora/MORA_UI_detalle-unidad]] |
| Generar acuerdo de pago | Modal | — | [[02-web/features/mora/MORA_UI_acuerdo-pago]] |

---

## Rutas

| Ruta | Componente | Guard |
|---|---|---|
| `/mora` | `MoraPage` | `AdminOnlyRoute` |

---

## Servicios y hooks

| Hook | Endpoint |
|---|---|
| `useMoraReporte` | `GET /arrears` |
| `useMoraUnidad` | `GET /arrears/unit/{id}` |
| `useGenerarAcuerdo` | `POST /arrears/unit/{id}/agreement` |

---

## Tipos TypeScript

```ts
export interface UnidadEnMora {
  unidad: { id: string; torre: string; numero: string; };
  residente: { nombre: string; email: string; };
  saldo_moroso: number;
  dias_vencidos: number;
  interes_acumulado: number;
  cuotas_vencidas: number;
  acuerdo_vigente: boolean;
}
```

---

## Endpoints referenciados

| Endpoint | Detalle |
|---|---|
| `GET /arrears` | [[01-api/endpoints/MORA]] §1 |
| `GET /arrears/unit/{id}` | [[01-api/endpoints/MORA]] §2 |
| `POST /arrears/unit/{id}/agreement` | [[01-api/endpoints/MORA]] §3 |
