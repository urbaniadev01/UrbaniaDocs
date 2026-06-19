---
type: operational
status: active
priority: P0
module: shared
tags: [process, cross-project, shared]
updated: 2026-06-18
---

# 🔀 CROSS_PROJECT_CHANGES
## Rutas para Modificaciones Globales

> [!info] Consultar
> Antes de iniciar cualquier cambio que sospechas podría afectar a más de un proyecto.

---

## 1. Criterio: ¿es este cambio "cross-project"?

> Un cambio es cross-project si, después de hacerlo, **otro proyecto necesitaría actualizar su código o su documentación** para seguir funcionando correctamente con el resto del sistema.

| Ejemplo | ¿Cross-project? |
|---|---|
| Cambiar la forma de un campo en una respuesta del API que Web/App ya consumen | Sí |
| Agregar un campo opcional nuevo que ningún cliente usa todavía | No (hasta que alguien lo empiece a consumir) |
| Cambiar un código de error o su significado | Sí |
| Refactor interno de una clase sin cambiar ningún contrato externo | No |
| Cambiar el color primario de marca, si Web y App deben verse consistentes | Sí (si se decidió compartir identidad — ver `SYSTEM_CONTRACT.md` §1) |
| Agregar un test nuevo dentro de un solo proyecto | No |

Si hay duda razonable, se trata como cross-project — es más barato registrar un cambio que resultó ser local que descubrir tarde uno que no se registró.

---

## 2. El Flujo

```
1. Se identifica que un cambio es cross-project (criterio de §1)
2. Se abre una entrada nueva en CHANGES_LOG.md (estado inicial: "Propuesto")
3. Se actualiza la fila correspondiente en SYSTEM_CONTRACT.md §1,
   marcando el cambio como "en revisión" si todavía no está implementado en ningún lado
4. Cada proyecto afectado registra una tarea referenciando la entrada del log
   en su propio *_IMPLEMENTATION_PLAN.md / *_SESSION_MANIFEST.md
5. A medida que cada proyecto implementa su parte, actualiza su estado
   en CHANGES_LOG.md: Propuesto → En progreso → Sincronizado
6. Cuando todos los proyectos afectados están "Sincronizado", se actualiza
   SYSTEM_CONTRACT.md a estable y se cierra la entrada del log
```

---

## 3. Quién Puede Declarar un Cambio como Cross-Project

Cualquier persona del equipo, de cualquier proyecto. No requiere aprobación previa para **registrar** la entrada en `CHANGES_LOG.md` — el registro es barato y reversible (se puede cerrar como "no aplicaba" si tras discutirlo resulta ser local). Lo que sí requiere acuerdo entre los proyectos afectados es marcar la entrada como cerrada/sincronizada.

---

## 4. Para Features Nuevas (no cambios reactivos)

Si el cambio cross-project nace como una feature nueva planeada desde cero (no una corrección o ajuste a algo existente), usar [[FEATURE_PLANNING_TEMPLATE]] en vez de este flujo directamente — la plantilla ya incluye su propio enganche con `CHANGES_LOG.md`.

---

## 5. Documentos Relacionados

| Documento | Propósito |
|---|---|
| [[SYSTEM_CONTRACT]] | Qué interfaces están sujetas a este flujo |
| [[CHANGES_LOG]] | Dónde se registra cada cambio |
| [[FEATURE_PLANNING_TEMPLATE]] | Variante de este flujo para features planeadas desde cero |
