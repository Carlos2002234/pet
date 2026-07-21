import "server-only";
import { createClient } from "@/lib/supabase/server";

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getDashboardSummary() {
  const supabase = await createClient();

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [
    { data: categories },
    { data: progress },
    { data: stages },
    { data: activeGoals },
    { data: recentLogs },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, name, icon, pet_name")
      .order("name"),
    supabase.from("pet_progress").select("category_id, total_xp, energy, current_stage_id"),
    supabase.from("pet_evolution_stages").select("id, stage_name"),
    supabase
      .from("goals")
      .select("id, title, progress_percent, due_date, category_id")
      .eq("status", "activo")
      .order("due_date", { ascending: true, nullsFirst: false }),
    supabase
      .from("action_logs")
      .select("logged_at")
      .gte("logged_at", sixtyDaysAgo.toISOString()),
  ]);

  const stageNameById = new Map((stages ?? []).map((stage) => [stage.id, stage.stage_name]));
  const progressByCategory = new Map((progress ?? []).map((row) => [row.category_id, row]));

  const pets = (categories ?? []).map((category) => {
    const row = progressByCategory.get(category.id);
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      icon: category.icon,
      petName: category.pet_name,
      totalXp: row?.total_xp ?? 0,
      energy: row?.energy ?? 100,
      stageName: row ? stageNameById.get(row.current_stage_id) ?? "Huevo" : "Huevo",
    };
  });

  const totalXp = pets.reduce((sum, pet) => sum + pet.totalXp, 0);

  const activeDays = new Set(
    (recentLogs ?? []).map((log) => toDateKey(new Date(log.logged_at))),
  );

  const today = new Date();

  let streak = 0;
  for (let i = 0; ; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    if (activeDays.has(toDateKey(day))) {
      streak++;
    } else if (i === 0) {
      continue; // hoy sin actividad aún no rompe la racha
    } else {
      break;
    }
  }

  let daysWithActivityThisWeek = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    if (activeDays.has(toDateKey(day))) {
      daysWithActivityThisWeek++;
    }
  }
  const weeklyCompliance = Math.round((daysWithActivityThisWeek / 7) * 100);

  return {
    pets,
    totalXp,
    streak,
    weeklyCompliance,
    activeGoals: activeGoals ?? [],
  };
}
