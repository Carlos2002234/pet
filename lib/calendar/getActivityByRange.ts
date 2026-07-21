import "server-only";
import { createClient } from "@/lib/supabase/server";

export type DayActivity = {
  day: string;
  count: number;
  xp: number;
  categoryIds: string[];
};

export async function getActivityByRange(
  startDate: string,
  endDate: string,
  categoryId?: string,
): Promise<DayActivity[]> {
  const supabase = await createClient();

  let query = supabase
    .from("action_logs")
    .select("logged_at, category_id, xp_awarded")
    .gte("logged_at", startDate)
    .lte("logged_at", endDate);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: logs, error } = await query;

  if (error) {
    throw new Error(`No se pudo cargar la actividad: ${error.message}`);
  }

  const byDay = new Map<
    string,
    { count: number; xp: number; categoryIds: Set<string> }
  >();

  for (const log of logs ?? []) {
    const day = log.logged_at.slice(0, 10);
    const entry = byDay.get(day) ?? {
      count: 0,
      xp: 0,
      categoryIds: new Set<string>(),
    };
    entry.count += 1;
    entry.xp += log.xp_awarded;
    entry.categoryIds.add(log.category_id);
    byDay.set(day, entry);
  }

  return Array.from(byDay.entries()).map(([day, entry]) => ({
    day,
    count: entry.count,
    xp: entry.xp,
    categoryIds: Array.from(entry.categoryIds),
  }));
}
