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
- Fase: MVP - Módulo 4 (Acciones/hábitos)
- Último módulo completado: Módulo 4 — `action_types`/`action_logs` (2 acciones base por
  categoría vía trigger), Server Action `logAction()` en `/app/categories/[slug]/actions.ts`
  que registra la acción y llama a `PetEngine.applyXP()`, con feedback "+XP" en la UI.
  Verificado con usuario de prueba real: XP sube, la mascota evoluciona y el header se
  actualiza tras cada acción.
- Próximo módulo: Módulo 5 — Objetivos (goals)

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
