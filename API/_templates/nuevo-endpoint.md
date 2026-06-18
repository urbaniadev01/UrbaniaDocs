<%*
const seccion = await tp.system.prompt("Número.sub-número (ej. 2.1)");
const nombre = await tp.system.prompt("Nombre corto del endpoint");
const metodo = await tp.system.prompt("Método HTTP", "POST");
const ruta = await tp.system.prompt("Ruta", "/recurso");
-%>
### <% seccion %> <% nombre %>
```
<% metodo %> /api/v1<% ruta %>
```

**Headers:** (solo si difiere de los Headers Obligatorios globales)

**Request:**
```json
{ }
```

**Response <codigo>:**
```json
{ "data": { }, "meta": { "trace_id": "..." } }
```

**Response <codigo_error>:**
```json
{ "error": { "code": "...", "message": "...", "trace_id": "..." } }
```

- [ ] Agregar fila en "Indice de Endpoints" (estado: Diseñado)
- [ ] Agregar codigos de error nuevos a "Codigos de Error Completos"
- [ ] Si el flujo de uso no es obvio, agregar fila en "Flujos Comunes"
- [ ] Verificar rate limiting en "Rate Limiting" / [[JWT_IMPLEMENTATION]] §4.1
- [ ] Al implementar, cambiar estado a "Implementado" en el indice
