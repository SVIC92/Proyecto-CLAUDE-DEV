# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Two independent sibling projects, each with its own `package.json`/pnpm lockfile:

- **`backend/`** — plain JavaScript (no TypeScript) Node.js + Express REST API for
  managing tasks, persisted in Supabase (Postgres) via `@supabase/supabase-js`. Full
  functional spec lives in `docs/spec.md`; setup/API docs live in `backend/README.md`.
- **`frontend/`** — React + Vite + Tailwind UI that consumes the backend API. Not part
  of `docs/spec.md` (that spec covers only the backend) — it's an added UI layer.
  Docs in `frontend/README.md`.

Top-level `README.md` is the overview/quick-start linking both.

## Commands

Package manager is **pnpm** (not npm/yarn), run independently in each project folder.

### Backend (`backend/`)

- `cd backend && pnpm install` — install dependencies.
- `pnpm start` — run the server (production, no reload).
- `pnpm dev` — run the server with nodemon (auto-reload), on `http://localhost:3000`.
- `pnpm test` — run the full Jest test suite (`--runInBand`). Tests mock
  `src/repositories/taskRepository.js` (or the Supabase builder for one low-level
  test), so they need no real Supabase credentials or network access.
- `pnpm test:watch` — Jest in watch mode.
- Run a single test file: `pnpm test -- tests/integration/tasks.create.test.js`.
- Run a single test by name: `pnpm test -- -t "nombre del test"`.

Before running the backend against real data, the Supabase project's `tasks` table
must be created by executing `backend/db/schema.sql` in the Supabase SQL Editor, and
`backend/.env` must be filled in from `backend/.env.example` (`SUPABASE_URL`,
`SUPABASE_KEY`, `PORT`).

### Frontend (`frontend/`)

- `cd frontend && pnpm install` — install dependencies.
- `pnpm dev` — runs Vite on `http://localhost:5173`. Its dev server proxies `/api/*` to
  `http://localhost:3000` (see `frontend/vite.config.js`) — no env var needed as long
  as the backend runs on that port.
- `pnpm build` / `pnpm preview` — production build and local preview of it.
- `pnpm lint` — oxlint.

## Architecture

### Backend (`backend/src/`)

Strict one-directional layering — never skip a layer or call a lower layer from a
higher one out of order:

```
routes → controllers → services → repositories → lib/supabaseClient
```

`validators/` and `utils/` are cross-cutting with no upward dependencies.

- `repositories/taskRepository.js` is the **only** module that talks to `supabase-js`.
  It exposes five plain domain functions (`createTask`, `getAllTasks`, `getTaskById`,
  `updateTask`, `deleteTask`) that return plain JS objects (or `null` when a row
  doesn't exist) or throw `ApiError(500, ...)` if Supabase itself errors. This is the
  seam mocked by almost all tests.
- `services/taskService.js` owns all business rules: input validation via
  `taskValidator`, stripping/ignoring `id`/`created_at`/`updated_at` from request
  bodies (the `id` is immutable), 404 translation when a repository call returns
  `null`, and the **in-memory** filter/sort logic for `GET /tasks`. Filtering and
  sorting are deliberately done in JS after fetching all rows from Supabase — not
  delegated to a dynamic Supabase query builder — because the target dataset is small
  and scalability is explicitly out of scope (see `docs/spec.md`).
- `services/taskStatsService.js` computes `GET /tasks/stats` (total, byStatus,
  byPriority, overdue) from an already-fetched task array — no Supabase access, so
  it's testable with zero mocks.
- `validators/taskValidator.js` and `validators/queryValidator.js` hand-roll validation
  (no Joi/Zod/express-validator) and throw `ApiError(400, message, field)` — the
  `field` is what lets API responses point at the exact invalid input field.
- Route ordering matters: in `routes/taskRoutes.js`, `GET /tasks/stats` **must** be
  declared before `GET /tasks/:id`, or Express would treat `stats` as an `:id`.
- `app.js` builds the Express app (JSON parser, cors, routes, `errorHandler` last)
  without calling `.listen()`, so Supertest can drive it directly in tests;
  `server.js` is the only file that calls `.listen()`.

#### Key backend design decisions (also documented in backend/README.md)

- `PATCH` with an empty body `{}` is a valid no-op → `200` with the task unchanged
  (or `404` if the id doesn't exist), not `400`.
- "Overdue" = `due_date` strictly before today AND `status !== 'done'`; a task due
  today is not overdue.
- Sorting by `due_date`: tasks with no `due_date` always sort last, in both `asc` and
  `desc` order.
- Test mocking has two levels: most integration tests mock `taskRepository` directly
  (`jest.mock('../../src/repositories/taskRepository')`); only
  `tests/unit/taskRepository.test.js` mocks the chained Supabase builder itself (via
  `tests/helpers/mockSupabase.js`), specifically to verify Supabase errors translate
  to HTTP 500.

### Frontend (`frontend/src/`)

- `api/tasksApi.js` is the only module that calls `fetch` against the backend;
  everything else goes through it.
- `hooks/useTaskManager.js` owns all state (tasks, stats, filters, loading, mutating,
  error) and every mutation refetches both the task list and stats together, so the
  UI never shows stale counts after a create/update/delete.
- `components/` are presentation-only — they receive data and callbacks as props, no
  direct API calls.
- `utils/taskMeta.js` centralizes status/priority labels, colors, and the client-side
  "overdue" check (mirrors the backend's rule: `due_date` strictly before today AND
  `status !== 'done'`) purely for display; the backend `taskStatsService` remains the
  source of truth for the numbers shown in `StatsBar`.
