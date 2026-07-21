-- Módulo 2: catálogo global de etapas de evolución + categorías por usuario

create table public.pet_evolution_stages (
  id uuid primary key default gen_random_uuid(),
  stage_order int not null unique,
  stage_name text not null,
  xp_required int not null
);

alter table public.pet_evolution_stages enable row level security;

create policy "pet_evolution_stages readable by authenticated users"
  on public.pet_evolution_stages
  for select
  to authenticated
  using (true);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null,
  name text not null,
  icon text,
  pet_name text not null,
  pet_archetype text not null,
  pet_justification text not null,
  parent_category_id uuid references public.categories (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

alter table public.categories enable row level security;

create policy "users manage own categories"
  on public.categories
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
