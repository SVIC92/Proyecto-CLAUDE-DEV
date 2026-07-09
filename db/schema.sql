-- Esquema de la tabla `tasks` para el Gestor de Tareas.
-- Ejecutar este script completo en el SQL Editor del dashboard de Supabase
-- del proyecto que se vaya a usar (ver README.md, sección "Configuración de Supabase").

create extension if not exists pgcrypto;

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title varchar(120) not null,
  description varchar(1000),
  status varchar(20) not null default 'pending'
    check (status in ('pending', 'in_progress', 'done')),
  priority varchar(10) not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on tasks;

create trigger tasks_set_updated_at
before update on tasks
for each row
execute function set_updated_at();
