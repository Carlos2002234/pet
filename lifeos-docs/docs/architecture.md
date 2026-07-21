# Arquitectura — LifeOS

## Diagrama general (MVP)

```
                    ┌─────────────────────┐
                    │   Next.js App        │
                    │  (App Router, RSC)    │
                    └──────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                       │
  ┌─────▼─────┐        ┌───────▼────────┐      ┌───────▼────────┐
  │ Dashboard  │        │  Action Logger  │      │  Goals & Quests │
  │ (mascotas, │        │  (log hábito →  │      │  (objetivos +   │
  │  progreso) │        │   XP → evento)  │      │   subtareas)    │
  └─────┬─────┘        └───────┬────────┘      └───────┬────────┘
        │                      │                       │
        └──────────────────────┼───────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Supabase (Postgres)  │
                    │  Auth + RLS + Storage   │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Pet Engine (server)   │
                    │  calcula XP, nivel,    │
                    │  evolución, decaimiento │
                    └───────────────────────┘
```

## Flujo de datos principal
1. Usuario registra una acción (ej. "Entrené hoy") → `action_logs`.
2. Trigger/función server-side calcula el XP correspondiente según `action_types.xp_value`.
3. XP se suma a `pet_progress` de la categoría correspondiente.
4. Si el XP acumulado cruza el umbral de la siguiente etapa → se actualiza `pet_progress.stage`.
5. Un cron diario (Supabase Edge Function programada) revisa inactividad por categoría y aplica
   decaimiento de energía (`pet_progress.energy`) — nunca elimina progreso, solo energía.
6. El dashboard lee `pet_progress` + `action_logs` + `goals` en tiempo real (Supabase Realtime opcional
   en fase posterior; en MVP, fetch server-side + revalidate).

## Decisiones técnicas clave
- **Motor de mascotas como capa server-side pura** (no lógica de XP en el cliente): evita
  trampas y centraliza las reglas de evolución en un solo lugar (`/lib/pets/engine.ts`).
- **Supabase sobre backend propio**: acelera Auth, RLS por usuario, y Storage para assets de
  mascotas sin mantener infraestructura.
- **Categorías como tabla, no como enum hardcodeado**: permite que el usuario cree subcategorías
  o el sistema escale a más mascotas sin migración de schema.
- **Sin IA en el MVP**: los "especialistas" (coach, nutricionista, etc.) se integran en FASE 2
  vía Anthropic API una vez el tracking base funcione y tenga datos reales que analizar.

## Estructura de carpetas
```
lifeos/
├── CLAUDE.md
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── mvp-roadmap.md
│   ├── ux-flows.md
│   └── session-template.md
├── app/
│   ├── (auth)/login, register
│   ├── dashboard/
│   ├── categories/[slug]/
│   ├── goals/
│   ├── calendar/
│   └── api/ (route handlers si se necesitan, ej. cron)
├── components/
│   ├── pets/ (PetCard, PetEvolutionAnimation, PetStatus)
│   ├── dashboard/
│   ├── goals/
│   └── ui/ (primitivos compartidos)
├── lib/
│   ├── supabase/ (client.ts, server.ts, queries/)
│   ├── pets/engine.ts (cálculo de XP, evolución, decaimiento)
│   └── xp/rules.ts (tabla de valores de XP por acción)
└── types/
```

## Fases futuras (fuera del MVP, no implementar todavía)
- **FASE 2 — IA**: especialistas por categoría vía Anthropic API, memoria compartida entre agentes.
- **FASE 3 — Integraciones**: wearables, APIs de salud, importación bancaria, voz, visión.
- **FASE 4 — Módulo financiero avanzado**: prompt y proyecto separado según el propio usuario indicó.
