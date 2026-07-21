import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PetEngine } from "@/lib/pets/engine";
import { startOfDayUTC, startOfWeekUTC } from "./dateRanges";

export async function evaluateMissions(userId: string) {
  const supabase = await createClient();
  const now = new Date();

  const { data: missions } = await supabase
    .from("missions")
    .select("id, rule_key, target_count, category_id, xp_reward")
    .eq("user_id", userId)
    .eq("status", "pendiente");

  if (!missions || missions.length === 0) {
    return;
  }

  for (const mission of missions) {
    let count = 0;

    if (mission.rule_key === "daily_three_actions") {
      const { count: c } = await supabase
        .from("action_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("logged_at", startOfDayUTC(now).toISOString());
      count = c ?? 0;
    } else if (mission.rule_key === "daily_neglected_category" && mission.category_id) {
      const { count: c } = await supabase
        .from("action_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("category_id", mission.category_id)
        .gte("logged_at", startOfDayUTC(now).toISOString());
      count = c ?? 0;
    } else if (mission.rule_key === "weekly_ten_actions") {
      const { count: c } = await supabase
        .from("action_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("logged_at", startOfWeekUTC(now).toISOString());
      count = c ?? 0;
    }

    if (count >= mission.target_count) {
      await supabase.from("missions").update({ status: "completada" }).eq("id", mission.id);

      if (mission.category_id) {
        await PetEngine.applyXP(mission.category_id, mission.xp_reward);
      }
    }
  }
}
