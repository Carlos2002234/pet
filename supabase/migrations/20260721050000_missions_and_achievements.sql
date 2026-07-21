-- Módulo 8: misiones, logros y decaimiento de energía

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  icon text
);

alter table public.achievements enable row level security;

create policy "achievements readable by authenticated users"
  on public.achievements
  for select
  to authenticated
  using (true);

insert into public.achievements (slug, name, description, icon) values
  ('primera-accion', 'Primer paso', 'Registra tu primera acción en LifeOS', '🥇'),
  ('racha-3', 'Constancia', 'Alcanza una racha de 3 días seguidos', '🔥'),
  ('racha-7', 'Hábito', 'Alcanza una racha de 7 días seguidos', '⚡'),
  ('primer-objetivo', 'Meta cumplida', 'Completa tu primer objetivo', '🏆'),
  ('primera-evolucion', 'Evolución', 'Haz evolucionar a una de tus mascotas por primera vez', '✨');

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "users manage own user_achievements"
  on public.user_achievements
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- rule_key/target_count no están en docs/database.md; se agregan porque las
-- misiones se auto-completan comparando progreso real contra una regla fija
-- (sin esto no habría forma de saber cuándo se cumplió cada misión).
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('daily', 'weekly', 'monthly')),
  title text not null,
  category_id uuid references public.categories (id) on delete cascade,
  rule_key text not null,
  target_count int not null default 1,
  xp_reward int not null check (xp_reward > 0),
  status text not null default 'pendiente' check (status in ('pendiente', 'completada', 'expirada')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.missions enable row level security;

create policy "users manage own missions"
  on public.missions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index missions_user_status_idx on public.missions (user_id, status, expires_at);

-- Decaimiento global (todos los usuarios), pensado para ejecutarse vía cron,
-- no request-scoped como decay_inactive_pets() del Módulo 3.
create or replace function public.decay_inactive_pets_all()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.pet_progress
  set energy = greatest(energy - 10, 0)
  where last_activity_at < now() - interval '7 days';
end;
$$;

revoke execute on function public.decay_inactive_pets_all() from public, anon, authenticated;

create extension if not exists pg_cron;

select cron.schedule(
  'decay-inactive-pets-daily',
  '0 3 * * *',
  $$select public.decay_inactive_pets_all();$$
);
