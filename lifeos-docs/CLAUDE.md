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
- Fase: MVP - Módulo 1 (Setup + Auth)
- Último módulo completado: Módulo 1 — Setup, Next.js + Supabase Auth (email/password; Google OAuth pendiente de credenciales)
- Próximo módulo: Módulo 2 — Modelo de categorías + seed de las 15 mascotas

## Reglas importantes para Claude Code
- NUNCA leer `/src` completo. Pedir siempre archivos específicos.
- SIEMPRE hacer commit al terminar un módulo (ver docs/session-template.md).
- NO implementar IA, integraciones bancarias, wearables ni voz en el MVP —
  eso es FASE 2/3 (ver docs/mvp-roadmap.md). Si Claude Code lo sugiere, recordarle el alcance.
- NO tocar el módulo financiero avanzado (presupuestos, deudas, inversiones) — tiene su propio
  prompt/proyecto futuro. El MVP solo incluye la mascota "Finanzas" con XP básico, nada más.
- Antes de escribir código, leer docs/mvp-roadmap.md para saber en qué módulo estamos.
