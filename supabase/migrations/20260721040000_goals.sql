-- Módulo 5: objetivos (goals) con subtareas checkeables

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  title text not null,
  description text,
  start_date date not null default current_date,
  due_date date,
  status text not null default 'activo' check (status in ('activo', 'completado', 'abandonado')),
  progress_percent int not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  difficulty text not null check (difficulty in ('fácil', 'medio', 'difícil')),
  xp_reward int not null check (xp_reward > 0),
  created_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "users manage own goals"
  on public.goals
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index goals_user_status_idx on public.goals (user_id, status);

create table public.goal_subtasks (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  order_index int not null default 0
);

alter table public.goal_subtasks enable row level security;

-- goal_subtasks no tiene user_id propio: la RLS verifica dueño vía el goal padre.
create policy "users manage own goal_subtasks"
  on public.goal_subtasks
  for all
  to authenticated
  using (
    exists (
      select 1 from public.goals g
      where g.id = goal_subtasks.goal_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.goals g
      where g.id = goal_subtasks.goal_id and g.user_id = auth.uid()
    )
  );

create index goal_subtasks_goal_idx on public.goal_subtasks (goal_id);
