import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewGoalForm } from "./new-goal-form";
import { GoalList } from "./goal-list";

export default async function GoalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  const { data: goals } = await supabase
    .from("goals")
    .select(
      "id, title, description, due_date, status, progress_percent, difficulty, xp_reward, category_id",
    )
    .order("created_at", { ascending: false });

  const goalIds = (goals ?? []).map((goal) => goal.id);

  const { data: subtasks } = goalIds.length
    ? await supabase
        .from("goal_subtasks")
        .select("id, goal_id, title, is_done, order_index")
        .in("goal_id", goalIds)
        .order("order_index", { ascending: true })
    : { data: [] };

  const categoryNameById = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );

  const goalsWithSubtasks = (goals ?? []).map((goal) => ({
    ...goal,
    category_name: categoryNameById.get(goal.category_id) ?? "",
    subtasks: (subtasks ?? []).filter((subtask) => subtask.goal_id === goal.id),
  }));

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-50">Objetivos</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Metas concretas por categoría, con subtareas y recompensa en XP.
          </p>
        </div>

        <NewGoalForm categories={categories ?? []} />

        <GoalList goals={goalsWithSubtasks} />
      </div>
    </main>
  );
}
