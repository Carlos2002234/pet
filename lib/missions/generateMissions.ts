import "server-only";
import { createClient } from "@/lib/supabase/server";
import { endOfDayUTC, endOfWeekUTC, startOfDayUTC, startOfWeekUTC } from "./dateRanges";

type NewMission = {
  user_id: string;
  type: "daily" | "weekly";
  title: string;
  category_id: string | null;
  rule_key: string;
  target_count: number;
  xp_reward: number;
  expires_at: string;
};

export async function generateMissions(userId: string) {
  const supabase = await createClient();
  const now = new Date();

  await supabase
    .from("missions")
    .update({ status: "expirada" })
    .eq("user_id", userId)
    .eq("status", "pendiente")
    .lt("expires_at", now.toISOString());

  const todayStart = startOfDayUTC(now);
  const todayEnd = endOfDayUTC(now);

  const { data: existingDaily } = await supabase
    .from("missions")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "daily")
    .gte("created_at", todayStart.toISOString())
    .limit(1);

  if (!existingDaily || existingDaily.length === 0) {
    const { data: mostNeglected } = await supabase
      .from("pet_progress")
      .select("category_id, energy")
      .order("energy", { ascending: true })
      .limit(1);

    const dailyMissions: NewMission[] = [
      {
        user_id: userId,
        type: "daily",
        title: "Completa 3 acciones hoy",
        category_id: null,
        rule_key: "daily_three_actions",
        target_count: 3,
        xp_reward: 20,
        expires_at: todayEnd.toISOString(),
      },
    ];

    const neglectedCategoryId = mostNeglected?.[0]?.category_id;
    if (neglectedCategoryId) {
      dailyMissions.push({
        user_id: userId,
        type: "daily",
        title: "Cuida a tu mascota más descuidada: completa 1 acción",
        category_id: neglectedCategoryId,
        rule_key: "daily_neglected_category",
        target_count: 1,
        xp_reward: 15,
        expires_at: todayEnd.toISOString(),
      });
    }

    await supabase.from("missions").insert(dailyMissions);
  }

  const weekStart = startOfWeekUTC(now);
  const weekEnd = endOfWeekUTC(now);

  const { data: existingWeekly } = await supabase
    .from("missions")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "weekly")
    .gte("created_at", weekStart.toISOString())
    .limit(1);

  if (!existingWeekly || existingWeekly.length === 0) {
    const weeklyMission: NewMission = {
      user_id: userId,
      type: "weekly",
      title: "Completa 10 acciones esta semana",
      category_id: null,
      rule_key: "weekly_ten_actions",
      target_count: 10,
      xp_reward: 50,
      expires_at: weekEnd.toISOString(),
    };

    await supabase.from("missions").insert(weeklyMission);
  }
}
