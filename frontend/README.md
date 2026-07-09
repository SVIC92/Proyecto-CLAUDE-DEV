# Task Manager — Frontend

Frontend en React + Vite + Tailwind CSS que consume la [API del gestor de tareas](../backend/README.md).
No forma parte de `../docs/spec.md` (esa especificación cubre solo el backend); es una
capa visual adicional para crear, filtrar, ordenar y dar seguimiento a las tareas desde
el navegador.

## Requisitos previos

- Node.js 18 o superior.
- pnpm.
- El backend corriendo (ver [`../backend/README.md`](../backend/README.md)) — por defecto en `http://localhost:3000`.

## Instalación

```bash
pnpm install
```

## Ejecución local

```bash
pnpm dev
```

Abre `http://localhost:5173`. En desarrollo, Vite hace de proxy de `/api/*` hacia
`http://localhost:3000` (ver `vite.config.js`), así que **no necesitas** configurar
ninguna variable de entorno mientras el backend corra en ese puerto.

Si tu backend corre en otra URL, o si vas a servir el build de producción sin proxy,
copia `.env.example` a `.env` y define `VITE_API_BASE_URL` apuntando directamente al
backend.

## Build de producción

```bash
pnpm build   # genera dist/
pnpm preview # sirve el build localmente para probarlo
```

## Funcionalidad

- Dashboard de estadísticas (total, por estado, por prioridad, vencidas) — `GET /tasks/stats`.
- Filtro por estado/prioridad y ordenamiento por fecha límite, prioridad o fecha de
  creación (ascendente/descendente) — `GET /tasks?status=&priority=&sort=&order=`.
- Crear, editar y eliminar tareas mediante modales, con los errores de validación del
  backend (`400`, campo específico) mostrados junto al campo correspondiente.
- Cambio rápido de estado (pendiente / en progreso / completada) desde cada tarjeta.
- Las tareas vencidas (fecha límite pasada y no completadas) se resaltan visualmente.

## Estructura

```
src/
  api/tasksApi.js          Cliente HTTP hacia la API (fetch + manejo de errores).
  hooks/useTaskManager.js  Estado de tareas/estadísticas/filtros y acciones CRUD.
  components/              UI: StatsBar, FilterBar, TaskList/TaskCard, TaskFormModal, ConfirmDialog...
  utils/taskMeta.js        Labels, colores y helpers de fecha para status/priority.
  App.jsx                  Composición de la pantalla principal.
```
