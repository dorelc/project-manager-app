create extension if not exists pgcrypto;

drop table if exists public.tasks;
drop table if exists public.projects;

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'planned' check (status in ('planned', 'active', 'on_hold', 'completed')),
  owner text,
  due_date date,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  details text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  assignee text,
  created_at timestamptz not null default now()
);

create index idx_projects_status on public.projects(status);
create index idx_tasks_project_id on public.tasks(project_id);
create index idx_tasks_status on public.tasks(status);

insert into public.projects (id, name, description, status, owner, due_date)
values
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d001',
    'Platformă internă pentru HR',
    'Portal pentru cereri de concediu, onboarding și documente interne.',
    'active',
    'Ioana',
    current_date + 14
  ),
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d002',
    'Website agenție',
    'Refacerea site-ului de prezentare cu landing pages noi.',
    'planned',
    'Andrei',
    current_date + 30
  ),
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d003',
    'Aplicație mobilă MVP',
    'Definire scope și livrare MVP pentru pilotul inițial.',
    'on_hold',
    'Maria',
    current_date + 45
  );

insert into public.tasks (project_id, title, details, status, assignee)
values
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d001',
    'Model bazei de date',
    'Definire tabele pentru utilizatori, cereri și aprobări.',
    'done',
    'Vlad'
  ),
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d001',
    'Ecran listă cereri',
    'Implementare listă cu filtre și statusuri.',
    'doing',
    'Diana'
  ),
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d002',
    'Structură homepage',
    'Wireframe + secțiuni finale pentru homepage.',
    'todo',
    'Alex'
  ),
  (
    '1c9171d4-d0a4-4ca1-9f2b-0dfc48a0d003',
    'Workshop cerințe MVP',
    'Clarificare fluxuri critice și prioritizare backlog.',
    'todo',
    'Bianca'
  );
