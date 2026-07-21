-- Módulo 3: estado de XP/evolución por (usuario, categoría)

create table public.pet_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  total_xp int not null default 0,
  current_stage_id uuid not null references public.pet_evolution_stages (id),
  energy int not null default 100 check (energy >= 0 and energy <= 100),
  last_activity_at timestamptz not null default now(),
  unique (user_id, category_id)
);

alter table public.pet_progress enable row level security;

create policy "users manage own pet_progress"
  on public.pet_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index pet_progress_user_category_idx on public.pet_progress (user_id, category_id);

-- Cada categoría nueva arranca su mascota en la etapa 0 (Huevo) con 100 de energía.
create or replace function public.seed_pet_progress_for_category()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  initial_stage_id uuid;
begin
  select id into initial_stage_id
  from public.pet_evolution_stages
  where stage_order = 0
  limit 1;

  insert into public.pet_progress (user_id, category_id, total_xp, current_stage_id, energy, last_activity_at)
  values (new.user_id, new.id, 0, initial_stage_id, 100, now());

  return new;
end;
$$;

revoke execute on function public.seed_pet_progress_for_category() from public, anon, authenticated;

create trigger on_category_created_seed_pet_progress
  after insert on public.categories
  for each row
  execute function public.seed_pet_progress_for_category();

-- Decae energía por inactividad (7+ días sin registrar acciones). Corre en el
-- contexto del usuario autenticado (SECURITY INVOKER + RLS), pensado para que
-- lo dispare la propia app o, en el Módulo 8, un cron que itere por usuario.
create or replace function public.decay_inactive_pets()
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  update public.pet_progress
  set energy = greatest(energy - 10, 0)
  where user_id = auth.uid()
    and last_activity_at < now() - interval '7 days';
end;
$$;
