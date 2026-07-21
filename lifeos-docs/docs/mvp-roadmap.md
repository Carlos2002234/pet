# MVP Roadmap — LifeOS

Un módulo = una sesión de Claude Code (o varias sesiones cortas si el módulo es grande).
No avanzar al siguiente módulo sin terminar y commitear el actual.

---

## Módulo 1: Setup + Auth ✅
- [x] `npx create-next-app` + Tailwind + Supabase client (`/lib/supabase/client.ts`, `server.ts`)
- [x] Login/Register (email/password funcional; Google OAuth queda como botón placeholder hasta tener credenciales de Google Cloud Console)
- [x] Proxy de sesión protegiendo `/dashboard` y rutas privadas (Next.js 16 renombró `middleware.ts` a `proxy.ts`)
- Archivos: `/app/(auth)/*`, `/lib/supabase/*`, `middleware.ts`
- Dependencias: ninguna

## Módulo 2: Modelo de categorías + seed de las 6 mascotas ✅
- [x] Tablas `categories`, `pet_evolution_stages` en Supabase (SQL migration)
- [x] Seed de las 6 categorías (deporte, lectura, estudio, finanzas, espiritualidad, viajes)
      vía trigger `on_auth_user_created_seed_categories` (categories es por-usuario, no catálogo global)
- [x] Seed de las 8 etapas de evolución con umbrales de XP (`supabase/seed.sql`)
- [x] Página simple que liste las 6 mascotas (sin diseño final aún, solo datos reales)
- Archivos: `supabase/migrations/*`, `supabase/seed.sql`, `/app/categories/page.tsx`
- Dependencias: Módulo 1

## Módulo 3: Motor de XP y evolución (Pet Engine) ✅
- [x] Tabla `pet_progress` (trigger la crea automáticamente por cada categoría, etapa inicial "Huevo")
- [x] `/lib/pets/engine.ts` — `applyXP()`, cálculo de stage, `decayCheck()`
- [x] Tests manuales: +50xp (no evoluciona) → +60xp más (evoluciona Huevo→Bebé) →
      +1000xp (salta directo Bebé→Adulto, saltándose Juvenil correctamente)
- Archivos: `/lib/pets/engine.ts`, migration de `pet_progress`
- Dependencias: Módulo 2

## Módulo 4: Acciones/hábitos (logging) ✅
- [x] Tablas `action_types`, `action_logs`
- [x] Seed de 2 acciones base por categoría vía trigger (ej. "Entrené hoy" +15xp /
      "Sesión intensa de entrenamiento" +30xp en Deporte)
- [x] UI para marcar una acción como cumplida → llama a `logAction()` → dispara `PetEngine`
- [x] Feedback visual simple de "+XP" al registrar
- Archivos: `/app/categories/[slug]/*`, server action `logAction`
- Dependencias: Módulo 3

## Módulo 5: Objetivos (goals) ✅
- [x] Tablas `goals`, `goal_subtasks`
- [x] CRUD de objetivos con fecha límite, dificultad, recompensa (crear, completar, abandonar)
- [x] UI de progreso (barra %, calculada por subtareas cumplidas) y subtareas checkeables
- Archivos: `/app/goals/*`
- Dependencias: Módulo 2 (no depende del pet engine directamente)

## Módulo 6: Dashboard principal ✅
- [x] Vista con las 6 mascotas y su estado (etapa, energía, XP)
- [x] Resumen: racha actual, XP total, % cumplimiento semanal
- [x] Objetivos activos destacados
- [x] `/` y `/login`/`/register` ahora redirigen a `/dashboard` según sesión
- Archivos: `/app/dashboard/*`, `getDashboardSummary()`
- Dependencias: Módulos 3, 4, 5

## Módulo 7: Calendario e historial ✅
- [x] Vista calendario con `action_logs` por día (heatmap de un solo tono, intensidad por cantidad
      de acciones, filtro por categoría, navegación de mes)
- [x] Queries de distribución de tiempo por categoría del mes (`getTimeDistribution()`)
- Archivos: `/app/calendar/*`, `getActivityByRange()`, `getTimeDistribution()`
- Dependencias: Módulo 4

## Módulo 8: Gamificación (misiones, logros, decaimiento)
- [ ] Tablas `missions`, `achievements`, `user_achievements`
- [ ] Generador simple de misiones diarias/semanales (reglas fijas, sin IA)
- [ ] Cron de decaimiento de energía (Supabase Edge Function programada)
- [ ] Sistema de insignias básico
- Archivos: `/lib/missions/*`, edge function `decay-check`
- Dependencias: Módulos 3, 4

## Módulo 9: Pulido visual de mascotas
- [ ] Ilustraciones o generación de arte por etapa (placeholder → arte final)
- [ ] Animación simple de evolución
- Archivos: `/components/pets/*`
- Dependencias: Módulo 3

---

## FASE 2 (después del MVP — no empezar antes)
- Especialistas de IA por categoría vía Anthropic API
- Memoria compartida entre agentes ("si el psicólogo detecta estrés...")
- Reportes generados por IA (semanal/mensual/anual)

## FASE 3 (después de FASE 2)
- Wearables, APIs de salud, importación bancaria, voz, visión

## FASE 4 (proyecto separado, según indicaste)
- Módulo financiero avanzado (presupuestos, deudas, inversiones, simulaciones)
