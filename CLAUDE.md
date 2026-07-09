# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Task Manager API — a plain JavaScript (no TypeScript) Node.js + Express REST API for
managing tasks, persisted in Supabase (Postgres) via `@supabase/supabase-js`. Full
functional spec lives in `docs/spec.md`; user-facing setup/API docs live in `README.md`.

## Commands

Package manager is **pnpm** (not npm/yarn).

- `pnpm install` — install dependencies.
- `pnpm start` — run the server (production, no reload).
- `pnpm dev` — run the server with nodemon (auto-reload).
- `pnpm test` — run the full Jest test suite (`--runInBand`). Tests mock
  `src/repositories/taskRepository.js` (or the Supabase builder for one low-level
  test), so they need no real Supabase credentials or network access.
- `pnpm test:watch` — Jest in watch mode.
- Run a single test file: `pnpm test -- tests/integration/tasks.create.test.js`.
- Run a single test by name: `pnpm test -- -t "nombre del test"`.

Before running the app against real data, the Supabase project's `tasks` table must
be created by executing `db/schema.sql` in the Supabase SQL Editor, and `.env` must
be filled in from `.env.example` (`SUPABASE_URL`, `SUPABASE_KEY`, `PORT`).

## Architecture

Strict one-directional layering — never skip a layer or call a lower layer from a
higher one out of order:

```
routes → controllers → services → repositories → lib/supabaseClient
```

`validators/` and `utils/` are cross-cutting with no upward dependencies.

- `src/repositories/taskRepository.js` is the **only** module that talks to
  `supabase-js`. It exposes five plain domain functions (`createTask`, `getAllTasks`,
  `getTaskById`, `updateTask`, `deleteTask`) that return plain JS objects (or `null`
  when a row doesn't exist) or throw `ApiError(500, ...)` if Supabase itself errors.
  This is the seam mocked by almost all tests.
- `src/services/taskService.js` owns all business rules: input validation via
  `taskValidator`, stripping/ignoring `id`/`created_at`/`updated_at` from request
  bodies (the `id` is immutable), 404 translation when a repository call returns
  `null`, and the **in-memory** filter/sort logic for `GET /tasks`. Filtering and
  sorting are deliberately done in JS after fetching all rows from Supabase — not
  delegated to a dynamic Supabase query builder — because the target dataset is
  small and scalability is explicitly out of scope (see `docs/spec.md`).
- `src/services/taskStatsService.js` computes `GET /tasks/stats` (total, byStatus,
  byPriority, overdue) from an already-fetched task array — no Supabase access, so
  it's testable with zero mocks.
- `src/validators/taskValidator.js` and `src/validators/queryValidator.js` hand-roll
  validation (no Joi/Zod/express-validator) and throw `ApiError(400, message, field)`
  — the `field` is what lets API responses point at the exact invalid input field.
- Route ordering matters: in `src/routes/taskRoutes.js`, `GET /tasks/stats` **must**
  be declared before `GET /tasks/:id`, or Express would treat `stats` as an `:id`.
- `src/app.js` builds the Express app (JSON parser, cors, routes, `errorHandler` last)
  without calling `.listen()`, so Supertest can drive it directly in tests;
  `src/server.js` is the only file that calls `.listen()`.

### Key design decisions (also documented in README.md)

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
