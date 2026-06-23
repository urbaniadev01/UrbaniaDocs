---
type: feature-panorama
status: active
module: shared
tags: [proveedores, contratos, shared]
updated: 2026-06-22
---

# Feature: Proveedores y contratos

## 1. Resumen y motivación

Catálogo de proveedores de servicios del conjunto con sus contratos vigentes. Es la fuente de datos para MANTENIMIENTO, ORDENES-TRABAJO y CUENTAS-PAGAR. Sin este módulo, los otros features no pueden asignar proveedores de manera estructurada.

## 2. Capas afectadas

- [x] API
- [x] Web
- [ ] App *(N/A — gestión administrativa)*

## 3. Características principales

- Ficha completa de cada proveedor: razón social, NIT, contacto, categoría
- Gestión de contratos: vigencia, valor mensual, servicios contratados
- Estado de contratos: activo, vencido o por vencer (alerta)

## 4. Relaciones con otras features

- Depende de: *(ninguna)*
- Es consumido por: [[00-shared/features/MANTENIMIENTO]], [[00-shared/features/ORDENES-TRABAJO]], [[00-shared/features/CUENTAS-PAGAR]]

## 5. Inventario de pantallas

### Web

| Pantalla | Tipo | Descripción breve |
|---|---|---|
| Catálogo de proveedores | Página | Lista de proveedores con estado de contrato |
| Crear / editar proveedor | Modal | Datos de la empresa y contacto |
| Detalle de proveedor | Drawer | Ficha completa + contratos + historial |
| Crear / editar contrato | Modal | Datos del contrato vinculado al proveedor |
| Documentos del contrato | Inline | Lista de PDFs adjuntos al contrato |

### App

> N/A — este feature es solo Web.

---

## 6. Mapeo de acciones a endpoints

| Acción | Verbo | Endpoint |
|---|---|---|
| Ver catálogo | GET | `/suppliers` |
| Crear proveedor | POST | `/suppliers` |
| Ver detalle | GET | `/suppliers/{id}` |
| Editar proveedor | PATCH | `/suppliers/{id}` |
| Crear contrato | POST | `/suppliers/{id}/contracts` |
| Ver contratos | GET | `/suppliers/{id}/contracts` |

---

## 7. Reglas de negocio globales

- Un proveedor puede tener múltiples contratos históricos pero solo uno activo por categoría.
- El sistema alerta cuando un contrato está a menos de 30 días de vencer.
- Los documentos del contrato (PDF) se almacenan en el storage del sistema.

## 8. Estados del contrato

```
activo | vencido | cancelado
```

## 9. Endpoints

> Ver [[01-api/endpoints/PROVEEDORES]] para el detalle completo.

## 11. Documentos de implementación

> Ver [[02-web/features/proveedores/PROVEEDORES_SPEC]] (App N/A).
