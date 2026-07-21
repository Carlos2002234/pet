"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logAction } from "./actions";

type ActionType = {
  id: string;
  name: string;
  xp_value: number;
  difficulty: string;
};

export function ActionList({ actionTypes }: { actionTypes: ActionType[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleLog(actionType: ActionType) {
    setPendingId(actionType.id);
    setFeedback(null);

    startTransition(async () => {
      try {
        const result = await logAction(actionType.id);
        setFeedback(
          result.evolved
            ? `+${result.xpAwarded} XP · ¡Tu mascota evolucionó a ${result.newStage.stageName}!`
            : `+${result.xpAwarded} XP`,
        );
        router.refresh();
      } catch (error) {
        setFeedback(
          error instanceof Error ? error.message : "No se pudo registrar la acción",
        );
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      {feedback && (
        <p className="rounded-md border border-emerald-800 bg-emerald-950 px-3 py-2 text-sm text-emerald-300">
          {feedback}
        </p>
      )}

      <ul className="space-y-2">
        {actionTypes.map((actionType) => (
          <li
            key={actionType.id}
            className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 p-4"
          >
            <div>
              <p className="font-medium text-neutral-50">{actionType.name}</p>
              <p className="text-xs text-neutral-500">
                {actionType.difficulty} · +{actionType.xp_value} XP
              </p>
            </div>
            <button
              onClick={() => handleLog(actionType)}
              disabled={isPending && pendingId === actionType.id}
              className="rounded-md bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-900 disabled:opacity-50"
            >
              {isPending && pendingId === actionType.id ? "..." : "Marcar cumplida"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
