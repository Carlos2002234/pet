-- Catálogo global de etapas de evolución (igual para todas las mascotas).
insert into public.pet_evolution_stages (stage_order, stage_name, xp_required) values
  (0, 'Huevo', 0),
  (1, 'Bebé', 100),
  (2, 'Juvenil', 300),
  (3, 'Adulto', 700),
  (4, 'Épico', 1500),
  (5, 'Legendario', 3000),
  (6, 'Mítico', 6000),
  (7, 'Divino', 12000)
on conflict (stage_order) do nothing;
