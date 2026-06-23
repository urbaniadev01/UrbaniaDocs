---
type: meta
status: active
priority: P0
module: shared
tags: [log, cross-project, traceability, shared]
updated: 2026-06-23
---

# 📊 CHANGES_LOG
## Registro de Cambios Cross-Project

> [!warning] Disciplina de uso
> Cada entrada incrementa el número (`CAMBIO-001`, `CAMBIO-002`, ...) sin reutilizar números, aunque se cierre como "no aplicaba".

---

## Formato de Entrada

```markdown
## CAMBIO-NNN — <título corto>
- Fecha de apertura: AAAA-MM-DD
- Afecta a: API / Web / App (marcar los que correspondan)
- Estado API: Propuesto | En progreso | Sincronizado | No aplica
- Estado Web: Propuesto | En progreso | Sincronizado | No aplica
- Estado App: Propuesto | En progreso | Sincronizado | No aplica
- Documento de referencia: enlace a la sección de SYSTEM_CONTRACT.md correspondiente
- Notas: contexto breve, decisiones tomadas, enlaces a sesiones de IMPLEMENTATION_PLAN
```

---

## Entradas

## CAMBIO-001 — Diseño de endpoints API para todos los features de negocio

- Fecha de apertura: 2026-06-23
- Afecta a: API / Web / App (diseño contratado para los tres; Web y App ya documentan y/o implementan)
- Estado API: En progreso
- Estado Web: Sincronizado (documentación de features existente en `02-web/features/*/`)
- Estado App: Sincronizado (documentación de features existente en `03-app/features/*/`)
- Documento de referencia: [[00-shared/SYSTEM_CONTRACT]] §Contrato REST entre proyectos; índices [[00-shared/FEATURES_INDEX]] y [[00-shared/FEATURES_Y_PANTALLAS]]
- Notas:
  - **Motivo**: completar la columna "origen del contrato" que faltaba en Web y App: el diseño de los endpoints de cada feature en la API. Sin este diseño, Web y App no tienen contrato REST formalmente firmado más allá de Auth.
  - **Alcance API**: se documentaron los 21 módulos de negocio en `01-api/endpoints/<FEATURE>.md` con estado **"Diseñado"** (sin código). Auth y Health Check ya estaban **Implementados**. Las 58 tablas de negocio se agregaron a [[01-api/API_DATABASE]]. El índice de [[01-api/API_CONTRACT]] se reconstruyó con numeración §N.M por módulo (§2-§23 + §C Configuración).
  - **Numeración global acordada**: §1 Auth (Implementado), §2 Propiedades, §3 Residentes, §4 Cuotas, §5 Pagos, §6 Mora, §7 Reservas, §8 Visitantes, §9 Vehículos, §10 Presupuesto, §11 Health (Implementado, infraestructura), §12 Notificaciones, §13 Comunicados, §14 PQRS, §15 Órdenes de trabajo, §16 Asambleas, §17 Votaciones, §18 Correspondencia/Paquetes, §19 Mantenimiento, §20 Proveedores, §21 Cuentas por pagar, §22 Informes, §23 Dashboard, §C Configuración (sin endpoints propios).
  - **CONFIGURACION**: agregado formalmente a `00-shared/FEATURES_Y_PANTALLAS` y a `FEATURES_INDEX` como feature #23. Reusa endpoints de Auth ya implementados (no introduce endpoints nuevos — ver [[01-api/endpoints/CONFIGURACION]]).
  - **Deuda técnica / observaciones** a resolver en la siguiente fase (no bloquean el diseño, se afinarán al implementar cada módulo):
    - `audience` de COMUNICADOS: contrato API usa `all/owners/tenants/specific_units`; panorama y SPEC web usan `todos/por_torre/por_unidad`. Sincronizar vocabulario antes de implementar.
    - `agent_payments` MORA: la acción PATCH `/arrears/agreements/{id}/status` cubre cancel/completed/defaulted — verificar máquina completa contra panorama.
    - ~~Panorama `00-shared/features/PAQUETES.md` y carpeta `03-app/features/paquetes/` aún no creados~~ ✅ **Resuelto 2026-06-23**: panorama y 3 UI App de paquetes creados.
    - ~~`03-app/features/auth/` vacío (faltan SPEC + 4 UI)~~ ✅ **Resuelto 2026-06-23**: AUTH_SPEC.md + AUTH_UI_login/verificacion-mfa/recuperar-contrasena/resetear-contrasena creados.
    - ENUM de tipos de Notificación: añadir tipo `paquete_recibido` sugerido por el módulo PAQUETES.
    - Rate limiting de los nuevos endpoints aún no definido — ver [[API_JWT_IMPLEMENTATION]] §4.1 al implementar.
    - `technician` no es rol definido en `users.role` (actual: admin/user). El módulo ORDENES-TRABAJO lo asume como rol: decidir si añadir ENUM o usar flag interno.
  - **Próximo paso**: usar este diseño como base para meter sesiones en [[API_IMPLEMENTATION_PLAN]] (un módulo por sesión, en el orden de dependencias de `FEATURES_Y_PANTALLAS`).
  - **Cierre**: cuando todos los módulos pasen a "Implementado" en `API_CONTRACT`, esta entrada se cierra como "Sincronizado" en los tres proyectos y el cambio se consolida en [[SYSTEM_CONTRACT]].

---

## Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Flujo que genera estas entradas |
| [[SYSTEM_CONTRACT]] | Destino final del cambio una vez sincronizado |
| [[FEATURES_INDEX]] | Índice global de features con estado por proyecto |
| [[FEATURES_Y_PANTALLAS]] | Lista maestra de features + prompts de documentación |
| [[01-api/API_CONTRACT]] | Índice de endpoints (FUENTE ÚNICA en API) |
| [[01-api/API_DATABASE]] | Esquema de BD (FUENTE ÚNICA en API) |
