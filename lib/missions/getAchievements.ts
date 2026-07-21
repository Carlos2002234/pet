import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function computeStreak(supabase: SupabaseClient, userId: string) {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const { data: logs } = await supabase
    .from("action_logs")
    .select("logged_at")
    .eq("user_id", userId)
    .gte("logged_at", sixtyDaysAgo.toISOString());

  const activeDays = new Set(
    (logs ?? []).map((log) => new Date(log.logged_at).toISOString().slice(0, 10)),
  );

  const today = new Date();
  let streak = 0;
  for (let i = 0; ; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    if (activeDays.has(key)) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export async function getAchievements(userId: string) {
  const supabase = await createClient();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, slug, name, description, icon");

  const { data: unlocked } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  const unlockedIds = new Set((unlocked ?? []).map((u) => u.achievement_id));
  const bySlug = new Map((achievements ?? []).map((a) => [a.slug, a]));
  const toUnlock: string[] = [];

  const primeraAccion = bySlug.get("primera-accion");
  if (primeraAccion && !unlockedIds.has(primeraAccion.id)) {
    const { count } = await supabase
      .from("action_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if ((count ?? 0) >= 1) toUnlock.push(primeraAccion.id);
  }

  const streak = await computeStreak(supabase, userId);
  const racha3 = bySlug.get("racha-3");
  if (racha3 && !unlockedIds.has(racha3.id) && streak >= 3) toUnlock.push(racha3.id);
  const racha7 = bySlug.get("racha-7");
  if (racha7 && !unlockedIds.has(racha7.id) && streak >= 7) toUnlock.push(racha7.id);

  const primerObjetivo = bySlug.get("primer-objetivo");
  if (primerObjetivo && !unlockedIds.has(primerObjetivo.id)) {
    const { count } = await supabase
      .from("goals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completado");
    if ((count ?? 0) >= 1) toUnlock.push(primerObjetivo.id);
  }

  const primeraEvolucion = bySlug.get("primera-evolucion");
  if (primeraEvolucion && !unlockedIds.has(primeraEvolucion.id)) {
    const { data: stageZero } = await supabase
      .from("pet_evolution_stages")
      .select("id")
      .eq("stage_order", 0)
      .single();

    const { data: progress } = await supabase
      .from("pet_progress")
      .select("current_stage_id")
      .eq("user_id", userId);

    const anyEvolved = (progress ?? []).some(
      (p) => p.current_stage_id !== stageZero?.id,
    );
    if (anyEvolved) toUnlock.push(primeraEvolucion.id);
  }

  if (toUnlock.length > 0) {
    await supabase
      .from("user_achievements")
      .insert(toUnlock.map((achievement_id) => ({ user_id: userId, achievement_id })));
    toUnlock.forEach((id) => unlockedIds.add(id));
  }

  return (achievements ?? []).map((achievement) => ({
    ...achievement,
    unlocked: unlockedIds.has(achievement.id),
  }));
}
