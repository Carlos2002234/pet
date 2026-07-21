import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateMissions } from "@/lib/missions/generateMissions";
import { evaluateMissions } from "@/lib/missions/evaluateMissions";
import { getAchievements } from "@/lib/missions/getAchievements";

export default async function MissionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await generateMissions(user.id);
  await evaluateMissions(user.id);

  const { data: missions } = await supabase
    .from("missions")
    .select("id, type, title, xp_reward, status, expires_at")
    .eq("user_id", user.id)
    .in("status", ["pendiente", "completada"])
    .order("type")
    .order("created_at", { ascending: false });

  const achievements = await getAchievements(user.id);

  const dailyMissions = (missions ?? []).filter((m) => m.type === "daily");
  const weeklyMissions = (missions ?? []).filter((m) => m.type === "weekly");

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-50">
            Misiones y logros
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Retos fijos del día y de la semana, más tus insignias desbloqueadas.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-medium text-neutral-50">
            Misiones de hoy
          </h2>
          <ul className="space-y-2">
            {dailyMissions.map((mission) => (
              <li
                key={mission.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-3"
              >
                <span
                  className={
                    mission.status === "completada"
                      ? "text-sm text-neutral-500 line-through"
                      : "text-sm text-neutral-50"
                  }
                >
                  {mission.title}
                </span>
                <span className="text-xs text-neutral-500">
                  +{mission.xp_reward} XP{" "}
                  {mission.status === "completada" ? "✅" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-medium text-neutral-50">
            Misión semanal
          </h2>
          <ul className="space-y-2">
            {weeklyMissions.map((mission) => (
              <li
                key={mission.id}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-3"
              >
                <span
                  className={
                    mission.status === "completada"
                      ? "text-sm text-neutral-500 line-through"
                      : "text-sm text-neutral-50"
                  }
                >
                  {mission.title}
                </span>
                <span className="text-xs text-neutral-500">
                  +{mission.xp_reward} XP{" "}
                  {mission.status === "completada" ? "✅" : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-medium text-neutral-50">Logros</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <li
                key={achievement.id}
                className={`rounded-lg border p-4 ${
                  achievement.unlocked
                    ? "border-emerald-800 bg-emerald-950"
                    : "border-neutral-800 bg-neutral-900 opacity-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <p className="font-medium text-neutral-50">{achievement.name}</p>
                </div>
                <p className="mt-1 text-sm text-neutral-400">
                  {achievement.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
