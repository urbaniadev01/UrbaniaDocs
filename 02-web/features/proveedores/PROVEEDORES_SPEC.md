---
type: spec-tecnico
status: active
module: web
feature: proveedores
tags: [web, proveedores, spec]
updated: 2026-06-22
---

# Spec Técnico Web: Proveedores y contratos

> Panorama global: [[00-shared/features/PROVEEDORES]]

> Este feature es solo Web (App N/A).

---

## Pantallas

| Pantalla | Tipo | Ruta | Doc de diseño |
|---|---|---|---|
| Catálogo de proveedores | Página | `/proveedores` | [[02-web/features/proveedores/PROVEEDORES_UI_catalogo]] |
| Crear / editar proveedor | Modal | — | [[02-web/features/proveedores/PROVEEDORES_UI_crear-editar]] |
| Detalle de proveedor | Drawer | — | [[02-web/features/proveedores/PROVEEDORES_UI_detalle]] |
| Crear / editar contrato | Modal | — | [[02-web/features/proveedores/PROVEEDORES_UI_crear-contrato]] |
| Documentos del contrato | Inline | — | [[02-web/features/proveedores/PROVEEDORES_UI_documentos]] |

---

## Rutas

| Ruta | Guard |
|---|---|
| `/proveedores` | `AdminOnlyRoute` |

---

## Hooks

| Hook | Endpoint |
|---|---|
| `useProveedores` | `GET /suppliers` |
| `useProveedor` | `GET /suppliers/{id}` |
| `useCreateProveedor` | `POST /suppliers` |
| `useUpdateProveedor` | `PATCH /suppliers/{id}` |
| `useContratos` | `GET /suppliers/{id}/contracts` |
| `useCreateContrato` | `POST /suppliers/{id}/contracts` |

---

## Tipos TypeScript

```ts
export interface Proveedor {
  id: string;
  razon_social: string;
  nit: string;
  categoria: string;
  contacto_nombre: string;
  contacto_telefono: string;
  contacto_email: string;
  contratos: Contrato[];
  activo: boolean;
}

export interface Contrato {
  id: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  valor_mensual: number;
  estado: 'activo' | 'vencido' | 'cancelado';
  documentos: { nombre: string; url: string; }[];
}
```
