# LifeOS

## Visión
Sistema operativo personal gamificado: cada área de la vida es una mascota que evoluciona
según el cumplimiento de hábitos y objetivos reales del usuario.

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Backend/DB: Supabase (Postgres + Auth + Storage)
- IA: Anthropic API — FASE 2 (no está en el MVP)
- Deploy: Vercel

## Convenciones de código
- TypeScript estricto (`strict: true`)
- Componentes en PascalCase, hooks en camelCase con prefijo `use`
- `/app` para rutas, `/components` para UI, `/lib` para lógica de negocio,
  `/lib/supabase` para queries, `/types` para tipos compartidos
- Toda tabla de Supabase tiene RLS activado desde el día 1 (nunca desactivar "para probar rápido")
- Un módulo = una feature completa (schema + UI + lógica), no se mezcla trabajo de dos módulos en el mismo commit

## Estado actual del proyecto
- Fase: MVP - Módulo 8 (Gamificación)
- Último módulo completado: Módulo 8 — `/app/missions` con misiones diarias/semanales
  auto-completadas (`/lib/missions/generateMissions.ts`, `evaluateMissions.ts`) y logros
  básicos (`getAchievements.ts`). El decaimiento de energía corre vía `pg_cron` (diario,
  3am) llamando a `decay_inactive_pets_all()` — se usó `pg_cron` + función SQL en vez de
  una Edge Function Deno porque la lógica es pura SQL. Se agregaron `rule_key`/`target_count`
  a `missions` (no estaban en `docs/database.md`) porque las misiones se auto-completan
  comparando progreso real, no con un botón manual. Verificado con usuario real: 3 acciones
  en Deporte completaron ambas misiones diarias (+60 XP total en Deporte) y desbloqueó el
  logro "Primer paso"; decaimiento probado directamente (una categoría inactiva 10 días
  bajó de 100→90 de energía, las demás quedaron intactas).
- Próximo módulo: Módulo 9 — Pulido visual de mascotas

## Alcance reducido (decisión del usuario)
- El MVP arranca con 6 categorías/mascotas, no 15 (deporte, lectura, estudio, finanzas,
  espiritualidad, viajes). Los módulos 6+ que mencionan "15 mascotas" ya se actualizaron a 6.

## Reglas importantes para Claude Code
- NUNCA leer `/src` completo. Pedir siempre archivos específicos.
- SIEMPRE hacer commit al terminar un módulo (ver docs/session-template.md).
- NO implementar IA, integraciones bancarias, wearables ni voz en el MVP —
  eso es FASE 2/3 (ver docs/mvp-roadmap.md). Si Claude Code lo sugiere, recordarle el alcance.
- NO tocar el módulo financiero avanzado (presupuestos, deudas, inversiones) — tiene su propio
  prompt/proyecto futuro. El MVP solo incluye la mascota "Finanzas" con XP básico, nada más.
- Antes de escribir código, leer docs/mvp-roadmap.md para saber en qué módulo estamos.
