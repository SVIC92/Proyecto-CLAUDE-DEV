# Task Manager API

API REST para gestión de tareas: operaciones CRUD completas, validación de datos de
entrada, y un endpoint con lógica propia de filtrado, ordenamiento y estadísticas. La
especificación completa del proyecto está en [`docs/spec.md`](docs/spec.md).

## Stack

- Node.js + Express (JavaScript, sin TypeScript).
- Persistencia: [Supabase](https://supabase.com) (Postgres gestionado) vía
  `@supabase/supabase-js`.
- Tests: Jest + Supertest.
- Gestor de paquetes: [pnpm](https://pnpm.io).

## Requisitos previos

- Node.js 18 o superior.
- pnpm (`npm install -g pnpm` si no lo tienes instalado).
- Una cuenta gratuita en [supabase.com](https://supabase.com).

## Configuración de Supabase

1. Crea una cuenta y un proyecto nuevo en [supabase.com](https://supabase.com).
2. En el dashboard del proyecto, abre **SQL Editor** y pega y ejecuta el contenido
   completo de [`db/schema.sql`](db/schema.sql). Esto crea la tabla `tasks` con sus
   restricciones y el trigger de `updated_at`.
3. Ve a **Project Settings → API** y copia:
   - **Project URL** → variable `SUPABASE_URL`.
   - **anon public key** → variable `SUPABASE_KEY` (es suficiente porque este
     proyecto no implementa autenticación de usuarios; ver "Fuera de alcance" en
     `docs/spec.md`).
4. **Row Level Security (RLS):** si Supabase activa RLS por defecto en la tabla
   `tasks`, esta API (sin autenticación) necesita poder leer/escribir sin
   restricciones. Desactiva RLS en la tabla `tasks` (**Table Editor → tasks →
   RLS disabled**) o crea una política permisiva que autorice todas las
   operaciones. Esto es aceptable porque la autenticación está fuera de alcance.

## Variables de entorno

Copia el archivo de ejemplo y completa tus credenciales:

```bash
cp .env.example .env
```

| Variable       | Descripción                                   | Default |
|----------------|------------------------------------------------|---------|
| `SUPABASE_URL` | Project URL de tu proyecto Supabase.            | —       |
| `SUPABASE_KEY` | anon public key de tu proyecto Supabase.        | —       |
| `PORT`         | Puerto en el que escucha el servidor Express.   | `3000`  |

## Instalación

```bash
pnpm install
```

## Ejecución local

```bash
pnpm start   # producción
pnpm dev     # desarrollo, con recarga automática (nodemon)
```

El servidor queda disponible en `http://localhost:3000` (o el puerto configurado en `PORT`).

## Ejecución de tests

```bash
pnpm test
```

Los tests **mockean el repositorio/cliente de Supabase**: ninguno hace una llamada de
red real, por lo que no requieren un archivo `.env` con credenciales reales ni conexión
a internet para pasar.

## Referencia de la API

Entidad `Task`: `id`, `title`, `description`, `status` (`pending` | `in_progress` |
`done`), `priority` (`low` | `medium` | `high`), `due_date` (`YYYY-MM-DD`),
`created_at`, `updated_at`.

### `POST /tasks`

Crea una tarea. Body: `{ "title": "string (requerido)", "description"?, "status"?,
"priority"?, "due_date"? }`.

- `201` — tarea creada, incluyendo `id`, `created_at`, `updated_at` y defaults
  (`status: "pending"`, `priority: "medium"`) aplicados.
- `400` — dato inválido (ej. `title` vacío/ausente/> 120 chars, `status`/`priority`
  fuera de enum, `due_date` no ISO-8601 o inexistente). Respuesta:
  `{ "error": { "message": "...", "field": "title" } }`.

### `GET /tasks`

Lista tareas. Query params opcionales: `status`, `priority`, `sort`
(`due_date`|`priority`|`created_at`, default `created_at`), `order`
(`asc`|`desc`, default `asc`).

- `200` — arreglo de tareas (vacío si no hay ninguna) filtrado y ordenado.
- `400` — algún query param tiene un valor fuera del enum/lista soportada (nunca se
  interpreta como lista vacía).

Ejemplo: `GET /tasks?status=pending&sort=due_date&order=asc`

### `GET /tasks/stats`

Estadísticas sobre todas las tareas (no acepta filtros).

- `200` — `{ "total": n, "byStatus": { "pending": n, "in_progress": n, "done": n },
  "byPriority": { "low": n, "medium": n, "high": n }, "overdue": n }`.
  `overdue` cuenta tareas con `due_date` estrictamente anterior a hoy y `status`
  distinto de `done`. Con cero tareas, todos los contadores son `0` (nunca es un error).

### `GET /tasks/:id`

- `200` — la tarea solicitada.
- `404` — no existe una tarea con ese `id`.

### `PUT /tasks/:id` / `PATCH /tasks/:id`

Actualiza una tarea, total (`PUT`) o parcialmente (`PATCH`). Mismo body y mismas
reglas de validación que en la creación, pero todos los campos son opcionales. El
`id` es inmutable: si se envía en el body, se ignora.

- `200` — tarea actualizada. Un body vacío `{}` es un no-op válido: responde `200`
  con la tarea sin modificar (ver "Decisiones de diseño").
- `400` — algún campo enviado es inválido.
- `404` — no existe una tarea con ese `id`.

### `DELETE /tasks/:id`

- `204` — tarea eliminada, sin cuerpo de respuesta.
- `404` — no existe una tarea con ese `id` (incluye el caso de eliminar dos veces
  el mismo `id`).

## Decisiones de diseño

- **`PATCH` con body vacío `{}`**: se trata como una actualización sin cambios
  válida (`200` con la tarea actual), no como un error `400`. Un conjunto vacío de
  cambios es un caso trivial e idempotente; exigir un mínimo de campos añadiría una
  regla que la especificación no pide en ningún otro punto.
- **Criterio de "vencida"**: `due_date` estrictamente anterior a la fecha de hoy
  (comparación de fecha, no de hora) y `status` distinto de `done`. Una tarea que
  vence hoy no cuenta como vencida.
- **Tareas sin `due_date` al ordenar por `due_date`**: siempre se colocan al final
  del arreglo, tanto en orden ascendente como descendente.
- **Filtro/orden/estadísticas en memoria**: la API siempre trae todas las filas de
  Supabase y filtra/ordena/calcula en JavaScript plano, en vez de delegar en un
  query builder dinámico. El dataset objetivo es pequeño y la escalabilidad está
  explícitamente fuera de alcance (ver `docs/spec.md`); esto simplifica la lógica y
  los tests.
- **Nivel de mock en los tests**: la mayoría de los tests mockean el módulo
  `taskRepository` completo (nivel alto), evitando simular el builder encadenado de
  `supabase-js` en cada caso. Solo `tests/unit/taskRepository.test.js` mockea el
  builder de bajo nivel (`tests/helpers/mockSupabase.js`), específicamente para
  verificar que los errores de Supabase se traducen a errores HTTP 500. Ningún test
  hace una llamada de red real.
- **Validación a mano**: sin librería externa (Joi/Zod/express-validator). La
  especificación es pequeña (5 campos) y requiere mensajes de error muy específicos
  por campo; escribirla a mano mantiene el código legible sin dependencias extra.

## Estructura del proyecto

```
db/schema.sql              DDL de la tabla `tasks` en Supabase/Postgres.
src/
  app.js                   Configura la app Express (sin levantar el servidor).
  server.js                Punto de entrada: arranca el servidor.
  config/env.js            Carga y valida variables de entorno (única fuente).
  lib/supabaseClient.js    Cliente singleton de supabase-js.
  repositories/            Única capa que habla con Supabase.
  validators/              Validación de body (taskValidator) y query params (queryValidator).
  services/                Reglas de negocio, filtros/orden (taskService) y estadísticas (taskStatsService).
  controllers/             Handlers Express: parsean request, llaman a services, formatean response.
  routes/                  Define las rutas /tasks y las conecta al controller.
  middlewares/errorHandler.js  Traduce errores a status code + JSON.
  utils/                   ApiError y helpers de fechas.
tests/
  unit/                    Tests puros, sin Express (validators, stats, repository con mock del builder).
  integration/             Tests con Supertest contra la app, mockeando taskRepository.
  helpers/mockSupabase.js  Helper para simular el builder encadenado de supabase-js.
```
