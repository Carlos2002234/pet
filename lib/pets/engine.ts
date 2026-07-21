import "server-only";
import { createClient } from "@/lib/supabase/server";

type StageInfo = {
  stageOrder: number;
  stageName: string;
};

type ApplyXPResult = {
  evolved: boolean;
  totalXp: number;
  previousStage: StageInfo;
  newStage: StageInfo;
};

export const PetEngine = {
  async applyXP(categoryId: string, xp: number): Promise<ApplyXPResult> {
    if (xp <= 0) {
      throw new Error("xp debe ser un número positivo");
    }

    const supabase = await createClient();

    const { data: progress, error: progressError } = await supabase
      .from("pet_progress")
      .select("id, total_xp, current_stage_id")
      .eq("category_id", categoryId)
      .single();

    if (progressError || !progress) {
      throw new Error(
        `No se encontró pet_progress para la categoría ${categoryId}: ${progressError?.message}`,
      );
    }

    const { data: stages, error: stagesError } = await supabase
      .from("pet_evolution_stages")
      .select("id, stage_order, stage_name, xp_required")
      .order("stage_order", { ascending: true });

    if (stagesError || !stages || stages.length === 0) {
      throw new Error(
        `No se pudieron cargar las etapas de evolución: ${stagesError?.message}`,
      );
    }

    const previousStage = stages.find(
      (stage) => stage.id === progress.current_stage_id,
    );
    if (!previousStage) {
      throw new Error("La etapa actual de la mascota no existe en el catálogo");
    }

    const totalXp = progress.total_xp + xp;

    const newStage = [...stages]
      .reverse()
      .find((stage) => totalXp >= stage.xp_required)!;

    const evolved = newStage.id !== progress.current_stage_id;

    const { error: updateError } = await supabase
      .from("pet_progress")
      .update({
        total_xp: totalXp,
        current_stage_id: newStage.id,
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", progress.id);

    if (updateError) {
      throw new Error(`No se pudo actualizar pet_progress: ${updateError.message}`);
    }

    return {
      evolved,
      totalXp,
      previousStage: {
        stageOrder: previousStage.stage_order,
        stageName: previousStage.stage_name,
      },
      newStage: {
        stageOrder: newStage.stage_order,
        stageName: newStage.stage_name,
      },
    };
  },

  async decayCheck(): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.rpc("decay_inactive_pets");

    if (error) {
      throw new Error(`No se pudo ejecutar el decay check: ${error.message}`);
    }
  },
};
