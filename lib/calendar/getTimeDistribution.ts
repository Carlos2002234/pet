import "server-only";
import { createClient } from "@/lib/supabase/server";

export type CategoryDistribution = {
  categoryId: string;
  slug: string;
  name: string;
  icon: string | null;
  count: number;
  xp: number;
  percent: number;
};

/** @param month formato 'YYYY-MM' */
export async function getTimeDistribution(
  month: string,
): Promise<CategoryDistribution[]> {
  const supabase = await createClient();

  const [year, monthIndex] = month.split("-").map(Number);
  const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
  const endDate = new Date(Date.UTC(year, monthIndex, 1));

  const [{ data: logs, error: logsError }, { data: categories, error: categoriesError }] =
    await Promise.all([
      supabase
        .from("action_logs")
        .select("category_id, xp_awarded")
        .gte("logged_at", startDate.toISOString())
        .lt("logged_at", endDate.toISOString()),
      supabase.from("categories").select("id, slug, name, icon"),
    ]);

  if (logsError) {
    throw new Error(`No se pudo cargar la distribución: ${logsError.message}`);
  }
  if (categoriesError) {
    throw new Error(`No se pudieron cargar las categorías: ${categoriesError.message}`);
  }

  const totalsByCategory = new Map<string, { count: number; xp: number }>();
  for (const log of logs ?? []) {
    const entry = totalsByCategory.get(log.category_id) ?? { count: 0, xp: 0 };
    entry.count += 1;
    entry.xp += log.xp_awarded;
    totalsByCategory.set(log.category_id, entry);
  }

  const totalActions = (logs ?? []).length;

  return (categories ?? [])
    .map((category) => {
      const totals = totalsByCategory.get(category.id) ?? { count: 0, xp: 0 };
      return {
        categoryId: category.id,
        slug: category.slug,
        name: category.name,
        icon: category.icon,
        count: totals.count,
        xp: totals.xp,
        percent: totalActions > 0 ? Math.round((totals.count / totalActions) * 100) : 0,
      };
    })
    .sort((a, b) => b.count - a.count);
}
