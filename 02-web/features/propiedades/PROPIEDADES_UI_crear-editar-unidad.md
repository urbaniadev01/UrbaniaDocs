---
type: ui-pantalla
status: active
module: web
feature: propiedades
pantalla: crear-editar-unidad
tags: [web, propiedades, ui, crear-editar-unidad]
updated: 2026-06-22
---

# Crear / editar unidad — Propiedades y unidades (Web)

> Spec técnico del feature: [[02-web/features/propiedades/PROPIEDADES_SPEC]]
> Panorama global: [[00-shared/features/PROPIEDADES]]
> Visual Standards: [[WEB_VISUAL_STANDARDS]]

**Tipo:** Modal
**Se abre desde:** Botón "Nueva unidad" en lista, o Menú contextual → Editar, o Botón "Editar" en detalle

---

## Qué muestra

Modal de formulario centrado. El título cambia según el modo: "Nueva unidad" o "Editar unidad — [número]".

Campos del formulario:
- `Torre / Bloque` — input texto, requerido (ej: "Torre A", "Bloque 1")
- `Piso` — input numérico, requerido, mínimo 1
- `Número de unidad` — input texto alfanumérico, requerido (ej: "101", "PH2", "L-01")
- `Tipo` — select: Apartamento / Local comercial / Parqueadero / Depósito
- `Área (m²)` — input numérico con decimales, requerido, mínimo 0.01
- `Coeficiente` — input numérico 4 decimales (ej: 0.0125), requerido; helper text: "Suma actual del conjunto: X.XXXX"

Pie del modal:
- Botón "Cancelar" — secundario, cierra el modal
- Botón "Guardar" — primario, muestra spinner durante el request

---

## Acciones

| Elemento | Acción | Resultado |
|---|---|---|
| Botón "Cancelar" | Click | Cierra el modal sin guardar |
| Botón "Guardar" | Click | Valida Zod → llama a `useCreatePropiedad` o `useUpdatePropiedad` |
| Cualquier campo | Enter | Mueve el foco al siguiente campo |
| Último campo | Enter | Dispara submit |

**Flujos post-submit:**
| Resultado | Qué hace el cliente |
|---|---|
| Éxito | Cierra el modal, invalida la query de la lista, muestra toast de éxito |
| Error de validación del servidor | Muestra errores en los campos correspondientes |
| Error de duplicado (unidad ya existe) | Error inline: "Ya existe una unidad con ese número en esa torre" |

---

## Estados de la vista

| Estado | Cómo se ve |
|---|---|
| Crear (vacío) | Todos los campos vacíos, foco en "Torre" |
| Editar (precargado) | Campos con los valores actuales de la unidad |
| Cargando (submit) | Botón con spinner, campos deshabilitados |
| Error | Mensajes de error por campo; botón desbloqueado |

---

## Elementos condicionales

- `Helper text de coeficiente` — visible siempre, muestra la suma actual del conjunto
- `Advertencia de suma` — visible si la suma con el nuevo coeficiente supera 1.0001
