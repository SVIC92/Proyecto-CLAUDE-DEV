---
name: new-endpoint
description: Reglas a seguir cuando se crea un nuevo endpoint en el backend de este proyecto (routes → controllers → services → repositories). Úsalo cuando el usuario pida agregar, crear o modificar un endpoint/ruta de la API.
---

# Crear un nuevo endpoint (backend)

Este proyecto usa una arquitectura en capas **estrictamente unidireccional**:

```
routes → controllers → services → repositories → lib/supabaseClient
```

Nunca te saltes una capa ni llames a una capa inferior desde una superior fuera de orden.
`validators/` y `utils/` son transversales, sin dependencias hacia arriba.

## Checklist al crear un endpoint nuevo

1. **Ruta** (`backend/src/routes/taskRoutes.js` o el archivo de rutas correspondiente)
   - Define el método HTTP y el path.
   - **Orden importa**: rutas literales/estáticas (p. ej. `GET /tasks/stats`) deben declararse
     **antes** que rutas con parámetros (p. ej. `GET /tasks/:id`), o Express tratará el
     literal como valor del parámetro.
   - La ruta solo debe delegar al controller correspondiente, sin lógica propia.

2. **Controller** (`backend/src/controllers/`)
   - Solo orquesta: lee `req`, llama al service, arma la respuesta HTTP (status + JSON).
   - No contiene reglas de negocio ni acceso a datos.
   - Los errores se propagan (via `next(err)` o similar) al `errorHandler` central — no captures
     y ocultes errores aquí.

3. **Service** (`backend/src/services/`)
   - Aquí van las reglas de negocio: validación de input (usando `validators/`), transformación
     de datos, traducción de "repository devolvió null" → 404 (`ApiError(404, ...)`).
   - Nunca llama directamente a Supabase — siempre a través del repository.
   - Si el endpoint necesita filtrar/ordenar/agregar sobre datos ya traídos, hazlo en JS aquí
     (no delegues a un query builder dinámico de Supabase), siguiendo el patrón existente de
     `taskService`/`taskStatsService`.

4. **Repository** (`backend/src/repositories/taskRepository.js`)
   - Es el **único** módulo que puede hablar con `@supabase/supabase-js`.
   - Si el endpoint necesita una consulta nueva, agrega una función plana que:
     - devuelve objetos JS planos, o `null` si la fila no existe;
     - lanza `ApiError(500, ...)` si Supabase falla.
   - No agregues lógica de negocio ni validación aquí.

5. **Validators** (`backend/src/validators/`)
   - Validación hecha a mano (sin Joi/Zod/express-validator), lanzando
     `ApiError(400, message, field)` para que la API pueda apuntar al campo inválido exacto.
   - Si el endpoint acepta query params, usa/extiende `queryValidator.js`; si acepta body,
     usa/extiende `taskValidator.js` (o el validator equivalente del recurso).

6. **Reglas de negocio existentes a respetar** (no reinventar):
   - `id`, `created_at`, `updated_at` nunca se aceptan/modifican desde el body — se ignoran o
     se stripean en el service.
   - `PATCH` con body vacío `{}` es un no-op válido → `200` con la tarea sin cambios (o `404`
     si el id no existe), nunca `400`.
   - "Overdue" = `due_date` estrictamente anterior a hoy Y `status !== 'done'` (una tarea que
     vence hoy no está overdue).
   - Ordenar por `due_date`: las tareas sin `due_date` siempre van al final, tanto en `asc`
     como en `desc`.

7. **Tests** (`backend/tests/`)
   - Agrega un test de integración que mockee `taskRepository` directamente
     (`jest.mock('../../src/repositories/taskRepository')`), no la librería de Supabase.
   - Solo mockea el query builder de Supabase (`tests/helpers/mockSupabase.js`) si el test es
     específicamente para verificar que un error de Supabase se traduce a HTTP 500.
   - Cubre: caso feliz, caso 404 (recurso no encontrado), caso 400 (validación fallida).

8. **Documentación**
   - Actualiza `backend/README.md` con el nuevo endpoint (método, path, body/query, respuesta).
   - Si el endpoint cambia el contrato descrito en `docs/spec.md`, actualiza también ese archivo.

9. **Frontend (si aplica)**
   - Si el frontend necesita consumir el endpoint nuevo, el único punto de entrada es
     `frontend/src/api/tasksApi.js` — no hagas `fetch` desde componentes ni hooks directamente.
   - Cualquier mutación debe re-fetchear tasks y stats juntos vía `useTaskManager.js` para que
     la UI no muestre contadores desactualizados.
