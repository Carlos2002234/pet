-- Siembra las 6 categorías/mascotas por defecto para cada usuario nuevo.
-- Las categorías viven por usuario (no son un catálogo global), así que se
-- clonan aquí en vez de insertarse una sola vez en seed.sql.

create or replace function public.seed_default_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories
    (user_id, slug, name, icon, pet_name, pet_archetype, pet_justification)
  values
    (new.id, 'deporte', 'Deporte', '🏋️', 'Oso Titán',
     'Oso musculoso en pose de fuerza',
     'Representa la fuerza bruta y la resistencia física; crece con cada sesión de ejercicio.'),
    (new.id, 'lectura', 'Lectura', '📚', 'Búho Sabio',
     'Búho con libros y lentes',
     'El búho es símbolo universal de sabiduría; crece con cada libro y hábito de lectura.'),
    (new.id, 'estudio', 'Estudio', '🎓', 'Delfín del Conocimiento',
     'Delfín curioso e inteligente',
     'Uno de los animales más inteligentes; representa el aprendizaje continuo.'),
    (new.id, 'finanzas', 'Finanzas', '💰', 'Dragón del Tesoro',
     'Dragón guardián de un tesoro',
     'Los dragones custodian riquezas; representa el ahorro y el crecimiento patrimonial.'),
    (new.id, 'espiritualidad', 'Espiritualidad', '🕊️', 'Fénix Interior',
     'Fénix renaciendo de sus cenizas',
     'Representa el renacimiento, el crecimiento espiritual y el propósito de vida.'),
    (new.id, 'viajes', 'Viajes', '✈️', 'Golondrina Viajera',
     'Golondrina en vuelo migratorio',
     'Las golondrinas migran grandes distancias; representa la exploración y los viajes.');
  return new;
end;
$$;

create trigger on_auth_user_created_seed_categories
  after insert on auth.users
  for each row
  execute function public.seed_default_categories();
