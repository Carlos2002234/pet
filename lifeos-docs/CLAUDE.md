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
- Fase: MVP - Módulo 9 (Pulido visual) — con esto se cierra el MVP completo (Módulos 1-9)
- Último módulo completado: Módulo 9 — `/components/pets/PetAvatar.tsx` (glow + tamaño de
  ícono + 8 puntos de progreso, todo escalado por `stageOrder`) reemplaza el emoji plano en
  `/categories`, `/categories/[slug]` y `/dashboard`; `/components/pets/EvolutionCelebration.tsx`
  anima la evolución (keyframe CSS) cuando `PetEngine.applyXP()` devuelve `evolved: true`.
  Sin herramienta de generación de imágenes disponible, se documentó la desviación del
  roadmap (arte real → sistema visual por etapa). Verificado con usuario real en 6 etapas
  distintas (Huevo a Divino): el glow y los puntos escalan visualmente de forma correcta, y
  la animación de evolución se disparó y confirmó al cruzar 300 XP (Bebé→Juvenil en Finanzas).
- Próximo: MVP completo. Quedan Fase 2 (IA por categoría, memoria compartida, reportes) y
  Fase 3 (wearables, banca, voz, visión) — explícitamente fuera de alcance hasta que el
  usuario lo indique.

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
