"use server";

import { createClient } from "@/lib/supabase/server";
import { PetEngine } from "@/lib/pets/engine";

export async function logAction(actionTypeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No hay sesión activa");
  }

  const { data: actionType, error: actionTypeError } = await supabase
    .from("action_types")
    .select("id, category_id, xp_value")
    .eq("id", actionTypeId)
    .single();

  if (actionTypeError || !actionType) {
    throw new Error(`Acción no encontrada: ${actionTypeError?.message}`);
  }

  const { error: logError } = await supabase.from("action_logs").insert({
    user_id: user.id,
    action_type_id: actionType.id,
    category_id: actionType.category_id,
    xp_awarded: actionType.xp_value,
  });

  if (logError) {
    throw new Error(`No se pudo registrar la acción: ${logError.message}`);
  }

  const result = await PetEngine.applyXP(actionType.category_id, actionType.xp_value);

  return {
    xpAwarded: actionType.xp_value,
    evolved: result.evolved,
    newStage: result.newStage,
  };
}
