# Base de Datos — LifeOS (MVP)

Todas las tablas usan RLS: `user_id = auth.uid()` como policy base salvo que se indique lo contrario.

## `categories`
Las 6 categorías iniciales se insertan como seed data, no hardcodeadas en el código.

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk → auth.users | |
| slug | text | ej. `salud`, `finanzas` |
| name | text | ej. "Salud" |
| icon | text | emoji o nombre de ícono |
| pet_name | text | ej. "Oso de la Vitalidad" |
| pet_archetype | text | ej. "oso fuerte" — usado para prompts de generación de arte |
| pet_justification | text | por qué esa mascota representa la categoría |
| parent_category_id | uuid nullable | permite subcategorías |
| created_at | timestamptz | |

## `pet_evolution_stages`
Catálogo fijo de 8 etapas, igual para todas las mascotas (umbral de XP configurable).

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| stage_order | int | 0=Huevo … 7=Divino |
| stage_name | text | Huevo, Bebé, Juvenil, Adulto, Épico, Legendario, Mítico, Divino |
| xp_required | int | XP acumulado mínimo para alcanzar esta etapa |

## `pet_progress`
Una fila por categoría por usuario. El "estado" de cada mascota.

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk | |
| category_id | uuid fk | |
| total_xp | int default 0 | |
| current_stage_id | uuid fk → pet_evolution_stages | |
| energy | int default 100 | 0-100, decae con inactividad, nunca borra total_xp |
| last_activity_at | timestamptz | usado por el cron de decaimiento |

## `action_types`
Catálogo de acciones posibles por categoría (ej. "Entrené hoy", "Leí 30 min").

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk | permite acciones custom del usuario |
| category_id | uuid fk | |
| name | text | |
| xp_value | int | |
| difficulty | text | fácil / medio / difícil |

## `action_logs`
Cada vez que el usuario marca una acción cumplida.

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk | |
| action_type_id | uuid fk | |
| category_id | uuid fk | denormalizado para queries rápidas del calendario |
| logged_at | timestamptz | fecha/hora real de la acción |
| xp_awarded | int | snapshot del XP en el momento (por si cambia después) |

## `goals`
Objetivos tipo "Perder peso", "Leer 20 libros".

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk | |
| category_id | uuid fk | |
| title | text | |
| description | text | |
| start_date | date | |
| due_date | date nullable | |
| status | text | activo / completado / abandonado |
| progress_percent | int default 0 | |
| difficulty | text | |
| xp_reward | int | |

## `goal_subtasks`
| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| goal_id | uuid fk | |
| title | text | |
| is_done | boolean default false | |
| order_index | int | |

## `achievements` / `user_achievements`
Insignias/logros desbloqueables. `achievements` es catálogo global; `user_achievements` registra
cuáles tiene cada usuario y cuándo.

## `missions`
Misiones diarias/semanales/mensuales generadas por reglas simples en el MVP (sin IA todavía).

| columna | tipo | notas |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk | |
| type | text | daily / weekly / monthly |
| title | text | |
| category_id | uuid nullable | |
| xp_reward | int | |
| status | text | pendiente / completada / expirada |
| expires_at | timestamptz | |
| rule_key | text | agregado en Módulo 8: identifica la regla fija que evalúa el progreso |
| target_count | int | agregado en Módulo 8: cuántas veces hay que cumplir la regla para auto-completar |

## Índices recomendados
- `action_logs(user_id, logged_at)` — para queries de calendario y reportes
- `action_logs(category_id, logged_at)` — para "¿cuánto entrené en junio?"
- `pet_progress(user_id, category_id)` unique — una mascota por categoría por usuario

## RLS
Policy estándar en todas las tablas con `user_id`:
```sql
create policy "users manage own rows"
on <tabla>
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```
`pet_evolution_stages` y `achievements` son catálogos globales de solo lectura para todos.
