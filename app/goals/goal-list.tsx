"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { abandonGoal, completeGoal, toggleSubtask } from "./actions";

type Subtask = {
  id: string;
  title: string;
  is_done: boolean;
};

type Goal = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  progress_percent: number;
  difficulty: string;
  xp_reward: number;
  category_name: string;
  subtasks: Subtask[];
};

export function GoalList({ goals }: { goals: Goal[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleToggleSubtask(subtaskId: string) {
    startTransition(async () => {
      const result = await toggleSubtask(subtaskId);
      if (result.completed) {
        setFeedback("¡Objetivo completado!");
      }
      router.refresh();
    });
  }

  function handleComplete(goalId: string) {
    startTransition(async () => {
      await completeGoal(goalId);
      setFeedback("¡Objetivo completado!");
      router.refresh();
    });
  }

  function handleAbandon(goalId: string) {
    startTransition(async () => {
      await abandonGoal(goalId);
      router.refresh();
    });
  }

  if (goals.length === 0) {
    return (
      <p className="text-sm text-neutral-400">Aún no tienes objetivos activos.</p>
    );
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <p className="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm text-emerald-300">
          {feedback}
        </p>
      )}

      <ul className="space-y-3">
        {goals.map((goal) => (
          <li
            key={goal.id}
            className="rounded-lg border border-neutral-800 bg-neutral-900 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-neutral-50">{goal.title}</p>
                <p className="text-xs text-neutral-500">
                  {goal.category_name} · {goal.difficulty} · +{goal.xp_reward} XP
                  {goal.due_date ? ` · vence ${goal.due_date}` : ""}
                </p>
                {goal.description && (
                  <p className="mt-1 text-sm text-neutral-300">{goal.description}</p>
                )}
              </div>

              {goal.status === "activo" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleComplete(goal.id)}
                    disabled={isPending}
                    className="rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-900 disabled:opacity-50"
                  >
                    Completar
                  </button>
                  <button
                    onClick={() => handleAbandon(goal.id)}
                    disabled={isPending}
                    className="rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-400 disabled:opacity-50"
                  >
                    Abandonar
                  </button>
                </div>
              )}
              {goal.status !== "activo" && (
                <span className="shrink-0 rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-400">
                  {goal.status}
                </span>
              )}
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${goal.progress_percent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">{goal.progress_percent}%</p>

            {goal.subtasks.length > 0 && (
              <ul className="mt-3 space-y-1">
                {goal.subtasks.map((subtask) => (
                  <li key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.is_done}
                      disabled={isPending || goal.status !== "activo"}
                      onChange={() => handleToggleSubtask(subtask.id)}
                      className="h-4 w-4"
                    />
                    <span
                      className={
                        subtask.is_done
                          ? "text-sm text-neutral-500 line-through"
                          : "text-sm text-neutral-300"
                      }
                    >
                      {subtask.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
