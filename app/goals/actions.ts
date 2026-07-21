"use server";

import { createClient } from "@/lib/supabase/server";
import { PetEngine } from "@/lib/pets/engine";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No hay sesión activa");
  }

  return { supabase, user };
}

export async function createGoal(input: {
  categoryId: string;
  title: string;
  description?: string;
  dueDate?: string;
  difficulty: "fácil" | "medio" | "difícil";
  xpReward: number;
  subtaskTitles: string[];
}) {
  const { supabase, user } = await requireUser();

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      category_id: input.categoryId,
      title: input.title,
      description: input.description || null,
      due_date: input.dueDate || null,
      difficulty: input.difficulty,
      xp_reward: input.xpReward,
    })
    .select("id")
    .single();

  if (goalError || !goal) {
    throw new Error(`No se pudo crear el objetivo: ${goalError?.message}`);
  }

  const subtaskTitles = input.subtaskTitles
    .map((title) => title.trim())
    .filter(Boolean);

  if (subtaskTitles.length > 0) {
    const { error: subtaskError } = await supabase.from("goal_subtasks").insert(
      subtaskTitles.map((title, index) => ({
        goal_id: goal.id,
        title,
        order_index: index,
      })),
    );

    if (subtaskError) {
      throw new Error(`No se pudieron crear las subtareas: ${subtaskError.message}`);
    }
  }
}

export async function toggleSubtask(subtaskId: string) {
  const { supabase } = await requireUser();

  const { data: subtask, error: subtaskError } = await supabase
    .from("goal_subtasks")
    .select("id, is_done, goal_id")
    .eq("id", subtaskId)
    .single();

  if (subtaskError || !subtask) {
    throw new Error(`Subtarea no encontrada: ${subtaskError?.message}`);
  }

  const { error: updateError } = await supabase
    .from("goal_subtasks")
    .update({ is_done: !subtask.is_done })
    .eq("id", subtask.id);

  if (updateError) {
    throw new Error(`No se pudo actualizar la subtarea: ${updateError.message}`);
  }

  const { data: siblings, error: siblingsError } = await supabase
    .from("goal_subtasks")
    .select("is_done")
    .eq("goal_id", subtask.goal_id);

  if (siblingsError || !siblings) {
    throw new Error(`No se pudieron leer las subtareas: ${siblingsError?.message}`);
  }

  const doneCount = siblings.filter((s) => s.is_done).length;
  const progressPercent = Math.round((doneCount / siblings.length) * 100);

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("category_id, xp_reward, status")
    .eq("id", subtask.goal_id)
    .single();

  if (goalError || !goal) {
    throw new Error(`Objetivo no encontrado: ${goalError?.message}`);
  }

  const justCompleted = progressPercent === 100 && goal.status === "activo";

  const { error: goalUpdateError } = await supabase
    .from("goals")
    .update({
      progress_percent: progressPercent,
      status: justCompleted ? "completado" : goal.status,
    })
    .eq("id", subtask.goal_id);

  if (goalUpdateError) {
    throw new Error(`No se pudo actualizar el objetivo: ${goalUpdateError.message}`);
  }

  if (justCompleted) {
    await PetEngine.applyXP(goal.category_id, goal.xp_reward);
  }

  return { progressPercent, completed: justCompleted };
}

export async function completeGoal(goalId: string) {
  const { supabase } = await requireUser();

  const { data: goal, error: goalError } = await supabase
    .from("goals")
    .select("category_id, xp_reward, status")
    .eq("id", goalId)
    .single();

  if (goalError || !goal) {
    throw new Error(`Objetivo no encontrado: ${goalError?.message}`);
  }

  if (goal.status !== "activo") {
    return;
  }

  const { error: updateError } = await supabase
    .from("goals")
    .update({ status: "completado", progress_percent: 100 })
    .eq("id", goalId);

  if (updateError) {
    throw new Error(`No se pudo completar el objetivo: ${updateError.message}`);
  }

  await PetEngine.applyXP(goal.category_id, goal.xp_reward);
}

export async function abandonGoal(goalId: string) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("goals")
    .update({ status: "abandonado" })
    .eq("id", goalId)
    .eq("status", "activo");

  if (error) {
    throw new Error(`No se pudo abandonar el objetivo: ${error.message}`);
  }
}
