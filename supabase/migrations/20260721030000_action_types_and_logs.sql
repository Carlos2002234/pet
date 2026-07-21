-- Módulo 4: catálogo de acciones (hábitos) por categoría + su historial

create table public.action_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  name text not null,
  xp_value int not null check (xp_value > 0),
  difficulty text not null check (difficulty in ('fácil', 'medio', 'difícil')),
  created_at timestamptz not null default now()
);

alter table public.action_types enable row level security;

create policy "users manage own action_types"
  on public.action_types
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index action_types_category_idx on public.action_types (category_id);

create table public.action_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_type_id uuid not null references public.action_types (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  logged_at timestamptz not null default now(),
  xp_awarded int not null
);

alter table public.action_logs enable row level security;

create policy "users manage own action_logs"
  on public.action_logs
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index action_logs_user_logged_idx on public.action_logs (user_id, logged_at);
create index action_logs_category_logged_idx on public.action_logs (category_id, logged_at);

-- Siembra 2 acciones base por categoría nueva (mismo patrón que categories/pet_progress:
-- action_types es por usuario, no un catálogo global, para permitir acciones custom).
create or replace function public.seed_action_types_for_category()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.action_types (user_id, category_id, name, xp_value, difficulty)
  values
    (new.user_id, new.id,
     case new.slug
       when 'deporte' then 'Entrené hoy'
       when 'lectura' then 'Leí 20 min'
       when 'estudio' then 'Repasé apuntes'
       when 'finanzas' then 'Registré mis gastos'
       when 'espiritualidad' then 'Medité 10 min'
       when 'viajes' then 'Planifiqué un viaje'
       else 'Cumplí una acción'
     end,
     15, 'fácil'),
    (new.user_id, new.id,
     case new.slug
       when 'deporte' then 'Sesión intensa de entrenamiento'
       when 'lectura' then 'Terminé un capítulo'
       when 'estudio' then 'Sesión de estudio profundo (1h)'
       when 'finanzas' then 'Ahorré hoy'
       when 'espiritualidad' then 'Escribí en mi diario de gratitud'
       when 'viajes' then 'Exploré algo nuevo cerca de casa'
       else 'Cumplí una acción destacada'
     end,
     30, case new.slug when 'deporte' then 'difícil' else 'medio' end);
  return new;
end;
$$;

revoke execute on function public.seed_action_types_for_category() from public, anon, authenticated;

create trigger on_category_created_seed_action_types
  after insert on public.categories
  for each row
  execute function public.seed_action_types_for_category();
