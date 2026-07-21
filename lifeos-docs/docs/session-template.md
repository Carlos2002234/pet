# Template para nueva sesión de Claude Code

## Prompt de inicio estándar (copiar y completar):

```
Lee primero:
- CLAUDE.md (contexto del proyecto)
- docs/mvp-roadmap.md (estado del roadmap)
- docs/[archivo relevante al módulo de hoy, ej. database.md]

Hoy trabajamos en: Módulo [N] — [nombre del módulo]
Archivos a modificar: [lista específica]
Archivos a crear: [lista específica]
No tocar: [qué no debe modificar]

Empieza explicando tu plan antes de codear.
```

## Ejemplo real (Módulo 1):
```
Lee CLAUDE.md y docs/mvp-roadmap.md.
Hoy construimos el Módulo 1: Setup + Auth.
Archivos a crear: /lib/supabase/client.ts, /lib/supabase/server.ts,
/app/(auth)/login/page.tsx, /app/(auth)/register/page.tsx, middleware.ts
No tocar: nada de /app/dashboard todavía (no existe aún, es Módulo 6).

Empieza explicando tu plan antes de codear.
```

## Si la sesión se rompe (prompt too long / context limit)
1. `/compact` → si falla:
2. Esc + Esc para retroceder mensajes, luego `/compact` → si falla:
3. `/clear` → nueva sesión, pegar de nuevo el prompt de inicio de arriba

## Fin de sesión (OBLIGATORIO, siempre)
```bash
git add .
git commit -m "feat: módulo [N] - [descripción breve]"
```
Luego actualizar manualmente en `CLAUDE.md` la sección "Estado actual del proyecto":
- Fase / Último módulo completado / Próximo módulo

## Reglas de oro
- Un módulo por sesión. Si Claude Code empieza a "adelantarse" a otro módulo, detenlo.
- Nunca pedir que lea toda la carpeta `/app` o `/lib` de una vez — solo los archivos del módulo actual.
- Nunca implementar IA, wearables, banca o el módulo financiero avanzado dentro del MVP.
