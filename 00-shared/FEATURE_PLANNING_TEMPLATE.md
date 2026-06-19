---
type: meta
status: active
priority: P0
module: shared
tags: [template, feature-planning, cross-project, shared]
updated: 2026-06-18
---

# 🧩 FEATURE_PLANNING_TEMPLATE
## Plantilla de Planificación para Features Multi-Capa

> [!info] Consultar
> Al planear desde cero una feature que se sabe de antemano va a afectar a más de un proyecto (ej. Reservas, Pagos, Chat). No usar para cambios reactivos pequeños — para eso ver [[CROSS_PROJECT_CHANGES]] directamente.

> [!tip] Cómo usar esta plantilla
> Copiar el bloque de la sección 2 a una nota nueva (ej. `00-shared/features/RESERVAS.md`) y completarla. No se edita esta plantilla directamente.

---

## 1. Por Qué Existe esta Plantilla

Cuando una feature nace afectando 3 capas, el riesgo más caro no es construir mal una capa — es que cada capa construya **contra una suposición distinta** del contrato, y el desajuste se descubra en integración. Esta plantilla obliga a que el contrato se discuta y se escriba antes de que cualquier capa empiece a implementar.

---

## 2. Plantilla

```markdown
# Feature: <nombre>

## 1. Resumen y motivación de negocio
¿Qué problema resuelve? ¿Por qué ahora?

## 2. Capas afectadas
- [ ] API (origen del contrato)
- [ ] Web
- [ ] App

## 3. Contrato propuesto (borrador)
- Endpoints / forma de request-response
- Eventos en tiempo real si aplica
- Códigos de error nuevos y su significado
> Este borrador vive aquí hasta que el equipo de API lo formaliza en
> `01-api/API_CONTRACT.md` — en ese momento, esta sección se reemplaza
> por un enlace al contrato real.

## 4. Orden de implementación recomendado
Por defecto: API define y estabiliza el contrato → Web y App implementan
en paralelo contra ese contrato (o contra un mock server, ver
*_TESTING.md de cada proyecto).

## 5. Checklist de coherencia
- [ ] Nombres de campos consistentes con [[GLOSSARY|GLOSSARY]]
- [ ] Códigos de error nuevos agregados a `SYSTEM_CONTRACT.md` §1
- [ ] Cada proyecto afectado tiene una sesión planeada en su
      `*_IMPLEMENTATION_PLAN.md`
- [ ] Si la feature requiere identidad visual compartida, se revisó con
      cada `*_DESIGN_SYSTEM.md` afectado

## 6. Estado de sincronización
Enlace a la entrada correspondiente en `CHANGES_LOG.md`.
```

---

## 3. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[CROSS_PROJECT_CHANGES]] | Proceso general del cual esta plantilla es una variante para features planeadas |
| [[SYSTEM_CONTRACT]] | Donde termina el contrato una vez formalizado |
| [[CHANGES_LOG]] | Seguimiento del estado de sincronización |
