# API — LifeOS (MVP)

Se usan Next.js Server Actions en vez de una API REST separada. Todo requiere sesión activa de Supabase Auth.

## Categorías / Mascotas
- `getCategories()` → lista las 15 categorías del usuario con su `pet_progress`
- `getCategoryDetail(slug)` → categoría + progreso + últimas 10 acciones + objetivos activos

## Acciones (hábitos)
- `getActionTypes(categoryId)` → catálogo de acciones disponibles para esa categoría
- `logAction(actionTypeId, loggedAt?)` → crea `action_logs`, dispara `PetEngine.applyXP()`, retorna
  el nuevo estado de la mascota (por si evolucionó, para animación)
- `createCustomActionType(categoryId, name, xpValue, difficulty)` → acción personalizada del usuario

## Motor de mascotas (server-only, `/lib/pets/engine.ts`)
- `PetEngine.applyXP(categoryId, xp)` → suma XP, recalcula stage, retorna `{ evolved: boolean, newStage? }`
- `PetEngine.decayCheck()` → ejecutado por cron diario (Supabase Edge Function), reduce `energy`
  de categorías inactivas +7 días

## Objetivos
- `getGoals(status?)` → lista objetivos, filtrable por estado
- `createGoal(input)` / `updateGoal(id, input)` / `completeGoal(id)`
- `addSubtask(goalId, title)` / `toggleSubtask(id)`

## Dashboard
- `getDashboardSummary()` → agrega: todas las mascotas, XP total, racha actual, % cumplimiento
  semanal, misiones activas — una sola query optimizada para la home

## Calendario
- `getActivityByRange(startDate, endDate)` → `action_logs` agrupados por día y categoría
- `getTimeDistribution(month)` → responde "¿dónde gasté más tiempo este mes?"

## Gamificación
- `getMissions(type)` → misiones activas
- `completeMission(id)`
- `getAchievements()` → catálogo + cuáles tiene el usuario

## Autenticación
- Maneja por Supabase Auth directamente (email/password + OAuth Google/GitHub) — no requiere
  endpoints propios, se usa `@supabase/ssr`.

## Fuera del MVP (no implementar)
- Endpoints de IA (`/api/ai/*`) — FASE 2
- Endpoints financieros avanzados — proyecto separado
- Webhooks de wearables — FASE 3
