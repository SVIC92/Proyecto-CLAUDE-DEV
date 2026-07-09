# Especificación — Gestor de Tareas

## Objetivo

Construir una API para un gestor de tareas (to-do manager) que permita crear, consultar,
actualizar y eliminar tareas, validando los datos de entrada, y que además exponga una
operación de consulta con lógica propia (filtrado, ordenamiento y estadísticas) más allá
del CRUD básico. El proyecto debe incluir pruebas automatizadas y documentación que permita
a cualquier persona levantar el entorno y ejecutarlo sin conocimiento previo del código.

## Entidad principal: Tarea (`Task`)

| Campo         | Tipo                                    | Obligatorio | Descripción                                  |
|---------------|------------------------------------------|-------------|-----------------------------------------------|
| `id`          | string/UUID                              | generado    | Identificador único de la tarea.              |
| `title`       | string (1–120 caracteres)                | sí          | Título de la tarea.                           |
| `description` | string (0–1000 caracteres)               | no          | Detalle opcional de la tarea.                 |
| `status`      | enum: `pending`, `in_progress`, `done`   | sí (default `pending`) | Estado actual de la tarea.         |
| `priority`    | enum: `low`, `medium`, `high`            | sí (default `medium`)  | Prioridad de la tarea.              |
| `due_date`    | string ISO-8601 (`YYYY-MM-DD`)           | no          | Fecha límite.                                 |
| `created_at`  | string ISO-8601 datetime                 | generado    | Fecha de creación.                            |
| `updated_at`  | string ISO-8601 datetime                 | generado    | Fecha de última modificación.                 |

## Requisitos

1. El sistema debe permitir **crear** una tarea (`POST /tasks`) recibiendo al menos `title`,
   y opcionalmente `description`, `status`, `priority` y `due_date`.
2. El sistema debe permitir **listar** todas las tareas (`GET /tasks`).
3. El sistema debe permitir **obtener** una tarea individual por `id` (`GET /tasks/{id}`).
4. El sistema debe permitir **actualizar** una tarea existente, total o parcialmente
   (`PUT /tasks/{id}` o `PATCH /tasks/{id}`).
5. El sistema debe permitir **eliminar** una tarea por `id` (`DELETE /tasks/{id}`).
6. El sistema debe **validar los datos de entrada** en creación y actualización:
   - `title` es obligatorio, no vacío y con máximo 120 caracteres.
   - `status` debe ser uno de los valores permitidos (`pending`, `in_progress`, `done`).
   - `priority` debe ser uno de los valores permitidos (`low`, `medium`, `high`).
   - `due_date`, si se envía, debe ser una fecha válida en formato ISO-8601.
   - Cualquier violación debe responder `400 Bad Request` con un mensaje descriptivo del
     error, indicando el campo inválido.
7. El sistema debe exponer un endpoint de **consulta avanzada** más allá del CRUD:
   `GET /tasks/stats` y `GET /tasks?status=&priority=&sort=&order=`, que debe soportar:
   - **Filtrado** por `status` y/o `priority`.
   - **Ordenamiento** por `due_date`, `priority` o `created_at`, ascendente o descendente
     (`order=asc|desc`).
   - **Estadísticas** (`GET /tasks/stats`): total de tareas, conteo por `status`, conteo por
     `priority` y cantidad de tareas vencidas (`due_date` anterior a la fecha actual y
     `status` distinto de `done`).
8. El sistema debe responder `404 Not Found` al operar (`GET`, `PUT`, `PATCH`, `DELETE`)
   sobre un `id` de tarea que no existe.
9. El proyecto debe incluir al menos **3 tests automatizados**, cubriendo como mínimo:
   - Un *happy path* de creación de tarea (`201 Created` con los datos correctos).
   - Un *happy path* del endpoint de lógica propia (filtrado, ordenamiento o estadísticas).
   - Un caso de error de validación (por ejemplo, crear una tarea sin `title` o con
     `status` inválido, esperando `400 Bad Request`).
10. El proyecto debe incluir un `README.md` con instrucciones para instalar dependencias,
    configurar variables de entorno (si aplica), ejecutar el proyecto localmente y correr
    la suite de tests.

## Criterios de aceptación

- [ ] `POST /tasks` con un `title` válido responde `201 Created` y devuelve la tarea creada
      con `id`, `created_at` y `updated_at` generados automáticamente.
- [ ] `POST /tasks` sin `title`, o con `title` vacío, `status` o `priority` inválidos,
      responde `400 Bad Request` y no persiste ninguna tarea.
- [ ] `GET /tasks` devuelve un arreglo (vacío si no hay tareas) con todas las tareas
      existentes.
- [ ] `GET /tasks/{id}` devuelve `200 OK` con la tarea solicitada si existe, y
      `404 Not Found` si no existe.
- [ ] `PUT /tasks/{id}` o `PATCH /tasks/{id}` actualiza los campos enviados, valida los
      nuevos valores, actualiza `updated_at` y devuelve `404 Not Found` si el `id` no existe.
- [ ] `DELETE /tasks/{id}` elimina la tarea y responde `204 No Content`; responde
      `404 Not Found` si el `id` no existe.
- [ ] `GET /tasks?status=done` devuelve únicamente tareas con ese estado.
- [ ] `GET /tasks?sort=due_date&order=asc` devuelve las tareas ordenadas correctamente por
      fecha límite ascendente.
- [ ] `GET /tasks/stats` devuelve el total de tareas, el desglose por `status`, el desglose
      por `priority` y el número de tareas vencidas, coherente con el estado real de los
      datos.
- [ ] Existen al menos 3 tests automatizados, todos en verde (`pass`) al ejecutar el
      comando de test descrito en el README, cubriendo al menos un happy path de CRUD, el
      endpoint con lógica propia y un caso de error de validación.
- [ ] El README permite a una persona sin contexto previo clonar el repo, instalar
      dependencias y levantar el proyecto siguiendo únicamente esas instrucciones.

## Edge cases

- Crear una tarea con `title` compuesto solo por espacios en blanco (debe tratarse como
  inválido, no como vacío técnicamente).
- Crear/actualizar una tarea con `title` de más de 120 caracteres.
- Enviar `due_date` en un formato no ISO-8601 (ej. `09/07/2026`) o con una fecha
  inexistente (ej. `2026-02-30`).
- Enviar `status` o `priority` con un valor que no está en el enum (ej. `status: "urgent"`).
- Actualizar una tarea enviando un cuerpo vacío `{}` (no debe modificar nada, o debe
  devolver `400` si se exige al menos un campo, según se decida — debe quedar documentado
  en el README).
- Actualizar el `id` de una tarea a través del body (el `id` debe ser inmutable; si se
  envía, debe ignorarse).
- Filtrar por un `status` o `priority` que no existe en el enum (`GET /tasks?status=foo`):
  debe responder `400 Bad Request`, no simplemente devolver una lista vacía.
- Ordenar (`sort`) por un campo no soportado: debe responder `400 Bad Request`.
- Consultar `GET /tasks/stats` cuando no existe ninguna tarea (debe devolver ceros, no
  error).
- Tarea con `due_date` igual a la fecha actual: no debe contarse como vencida hasta que
  pase la fecha.
- Eliminar dos veces la misma tarea (la segunda solicitud debe responder `404`, no `204`).
- Concurrencia básica: dos actualizaciones simultáneas sobre la misma tarea no deben dejar
  el registro en un estado inconsistente (a nivel de especificación, basta con que la
  última escritura gane — *last write wins*).

## Fuera de alcance

- Autenticación y autorización de usuarios (no habrá login, tokens ni permisos por rol).
- Soporte multi-usuario o multi-workspace (todas las tareas pertenecen a un único espacio
  global).
- Subtareas, etiquetas (`tags`), comentarios o archivos adjuntos sobre una tarea.
- Notificaciones (email, push, recordatorios) sobre vencimientos.
- Interfaz gráfica (UI web o móvil); el alcance es únicamente la API/backend.
- Persistencia distribuida, caché o requisitos de escalabilidad horizontal.
- Internacionalización (i18n) de mensajes de error o contenido.
- Versionado de historial de cambios de una tarea (auditoría).
- Integraciones con terceros (calendarios, Slack, etc.).
