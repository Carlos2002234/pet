import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActivityByRange } from "@/lib/calendar/getActivityByRange";
import { getTimeDistribution } from "@/lib/calendar/getTimeDistribution";
import { CalendarFilters } from "./calendar-filters";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function monthKey(year: number, monthIndex: number) {
  return `${year}-${pad(monthIndex + 1)}`;
}

function shiftMonth(month: string, delta: number) {
  const [year, monthIndex] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthIndex - 1 + delta, 1));
  return monthKey(date.getUTCFullYear(), date.getUTCMonth());
}

function buildMonthWeeks(month: string): (string | null)[][] {
  const [year, monthIndex] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, monthIndex - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const leadingBlanks = (firstDay.getUTCDay() + 6) % 7; // semana empieza en lunes

  const cells: (string | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => `${year}-${pad(monthIndex)}-${pad(i + 1)}`,
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function intensityClass(count: number) {
  if (count === 0) return "bg-neutral-900";
  if (count === 1) return "bg-emerald-900";
  if (count === 2) return "bg-emerald-700";
  if (count <= 4) return "bg-emerald-500";
  return "bg-emerald-400";
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; category?: string }>;
}) {
  const { month: monthParam, category: categorySlug } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const now = new Date();
  const month = monthParam ?? monthKey(now.getUTCFullYear(), now.getUTCMonth());

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, icon")
    .order("name");

  const selectedCategory = (categories ?? []).find((c) => c.slug === categorySlug);

  const weeks = buildMonthWeeks(month);
  const [year, monthIndex] = month.split("-").map(Number);
  const startDate = `${month}-01T00:00:00.000Z`;
  const endDate = new Date(Date.UTC(year, monthIndex, 1)).toISOString();

  const activity = await getActivityByRange(startDate, endDate, selectedCategory?.id);
  const activityByDay = new Map(activity.map((a) => [a.day, a]));

  const distribution = await getTimeDistribution(month);
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-50">
            Calendario e historial
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Actividad por día y en qué invertiste más tiempo este mes.
          </p>
        </div>

        <CalendarFilters
          categories={categories ?? []}
          month={month}
          prevMonth={shiftMonth(month, -1)}
          nextMonth={shiftMonth(month, 1)}
        />

        <div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>
          <div className="mt-1 space-y-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={dayIndex} className="aspect-square" />;
                  }
                  const dayActivity = activityByDay.get(day);
                  const count = dayActivity?.count ?? 0;
                  return (
                    <div
                      key={dayIndex}
                      title={`${day}: ${count} acción${count === 1 ? "" : "es"}${
                        dayActivity ? ` · ${dayActivity.xp} XP` : ""
                      }`}
                      className={`aspect-square rounded-sm ${intensityClass(count)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-medium text-neutral-50">
            Distribución del mes
          </h2>
          {distribution.every((d) => d.count === 0) ? (
            <p className="text-sm text-neutral-400">
              Sin acciones registradas este mes.
            </p>
          ) : (
            <ul className="space-y-2">
              {distribution.map((item) => (
                <li key={item.categoryId}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-300">
                      {item.icon} {item.name}
                    </span>
                    <span className="text-neutral-500">
                      {item.count} acciones · {item.percent}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
