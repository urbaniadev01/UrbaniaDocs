---
type: ui-pantalla
status: active
module: mobile
feature: paquetes
pantalla: confirmar-entrega
tags: [app, paquetes, ui, confirmar-entrega]
updated: 2026-06-23
---

# Confirmar entrega — Paquetes (App)

> Spec técnico del feature: [[03-app/features/paquetes/PAQUETES_SPEC]]
> Panorama global: [[00-shared/features/PAQUETES]]
> Design System: [[APP_DESIGN_SYSTEM]]

**Tipo:** Dialog
**Se abre desde:** Botón "Confirmar entrega" en [[03-app/features/paquetes/PAQUETES_UI_detalle]] o botón "Entregar" en card de [[03-app/features/paquetes/PAQUETES_UI_lista]]

---

## Qué muestra

Título "Confirmar recepción". Texto explicativo "Ingresa el nombre de quien recibe". Campo de texto `delivered_to_name`, opcional, pre-poblado con el nombre del residente autenticado (editable). Botón primario "Confirmar" y botón secundario "Cancelar".

> [!note] Sin firma
> Esta confirmación desde la app no exige `signature_url` ni captura de firma. Solo registra `delivered_to_name` (puede quedar vacío y el server asume el residente autenticado).

---

## Acciones

| Elemento | Gesto | Resultado |
|---|---|---|
| Botón "Confirmar" | Tap | `POST /packages/{id}/deliver {delivered_to_name}` → ver tabla de outcomes |
| Botón "Cancelar" | Tap | Cierra el Dialog sin acción |
| Backdrop | Tap | Cierra el Dialog sin acción |

### Outcomes del submit

| Respuesta API | Resultado UI |
|---|---|
| `200` | Cierra Dialog + refresca lista (`GET /packages`) + snackbar "Entrega confirmada" |
| `409 PACKAGE_ALREADY_DELIVERED` | Cierra Dialog + snackbar "Este paquete ya fue entregado" + refresca lista |
| `409 PACKAGE_NOT_NOTIFIED` | Mantiene Dialog + snackbar "Aún no puedes confirmar — se notificará al receptor" |
| `404 PACKAGE_NOT_FOUND` | Cierra Dialog + snackbar "Paquete no encontrado" + refresca lista |
| Error de red | Mantiene Dialog + snackbar "Sin conexión, intenta de nuevo" |

---

## Estados de la pantalla

| Estado | Cómo se ve |
|---|---|
| Inactivo | Dialog normal, botón "Confirmar" habilitado |
| Enviando | Botón "Confirmar" muestra spinner y se deshabilita |
| Error de validación | Mensaje inline si `delivered_to_name` excede 255 caracteres |
| Sin conexión | Snackbar "Sin conexión, intenta de nuevo" |

---

## Elementos condicionales

- Campo `delivered_to_name` — pre-poblado con nombre del residente autenticado; editable (puede ser otra persona autorizada en la unidad)
- Botón "Confirmar" — deshabilitado mientras el request está en vuelo

---

## Accesibilidad

- Campo de nombre — `Semantics` con label "Nombre de quien recibe el paquete"
- Botones "Confirmar" / "Cancelar" — labels explícitos; "Confirmar" anuncia acción destructiva-soft (cambia estado del paquete)

> Ver [[APP_ACCESSIBILITY]] para reglas generales.
