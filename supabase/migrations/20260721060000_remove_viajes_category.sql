-- El usuario decidió reducir el alcance de 6 a 5 categorías, quitando "viajes".
-- Se borra el dato existente (cascada a pet_progress, action_types, action_logs, goals)
-- y se actualiza el trigger de siembra para que los usuarios nuevos ya no la reciban.

delete from public.categories where slug = 'viajes';

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
     'Representa el renacimiento, el crecimiento espiritual y el propósito de vida.');
  return new;
end;
$$;

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
       else 'Cumplí una acción destacada'
     end,
     30, case new.slug when 'deporte' then 'difícil' else 'medio' end);
  return new;
end;
$$;

revoke execute on function public.seed_default_categories() from public, anon, authenticated;
revoke execute on function public.seed_action_types_for_category() from public, anon, authenticated;
