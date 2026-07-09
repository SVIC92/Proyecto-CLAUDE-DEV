# Task Manager

Gestor de tareas compuesto por dos proyectos independientes, cada uno con su propio
`package.json`, dependencias y `pnpm` lockfile:

- **[`backend/`](backend/README.md)** — API REST (Node.js + Express + Supabase). Cumple
  la especificación completa en [`docs/spec.md`](docs/spec.md): CRUD, validación,
  filtrado/orden/estadísticas, y tests automatizados.
- **[`frontend/`](frontend/README.md)** — interfaz web (React + Vite + Tailwind CSS) que
  consume esa API. No forma parte de la especificación original; es una capa visual
  adicional.

## Ejecución rápida

Backend y frontend se instalan y ejecutan por separado, en dos terminales:

```bash
# Terminal 1 — backend (puerto 3000)
cd backend
pnpm install
pnpm dev

# Terminal 2 — frontend (puerto 5173)
cd frontend
pnpm install
pnpm dev
```

Luego abre `http://localhost:5173`. En desarrollo, el frontend hace proxy de `/api/*`
hacia `http://localhost:3000`, así que no necesitas configurar variables de entorno en
el frontend mientras el backend corra en ese puerto.

Antes de levantar el backend por primera vez, sigue la sección "Configuración de
Supabase" de [`backend/README.md`](backend/README.md) para crear la tabla `tasks` y
completar `backend/.env`.

## Estructura

```
docs/spec.md    Especificación funcional del backend (CRUD, validación, edge cases, alcance).
backend/        API REST + tests (ver backend/README.md).
frontend/       Interfaz web que consume la API (ver frontend/README.md).
```
