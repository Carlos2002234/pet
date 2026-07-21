"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGoal } from "./actions";

type Category = {
  id: string;
  name: string;
};

export function NewGoalForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);

    const subtaskTitles = String(formData.get("subtasks") || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    startTransition(async () => {
      try {
        await createGoal({
          categoryId: String(formData.get("categoryId")),
          title: String(formData.get("title")),
          description: String(formData.get("description") || ""),
          dueDate: String(formData.get("dueDate") || ""),
          difficulty: formData.get("difficulty") as "fácil" | "medio" | "difícil",
          xpReward: Number(formData.get("xpReward")),
          subtaskTitles,
        });
        formRef.current?.reset();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo crear el objetivo");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4"
    >
      <h2 className="font-medium text-neutral-50">Nuevo objetivo</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="categoryId"
          required
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="difficulty"
          required
          defaultValue="medio"
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
        >
          <option value="fácil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="difícil">Difícil</option>
        </select>
      </div>

      <input
        name="title"
        placeholder="Título (ej. Leer 20 libros este año)"
        required
        className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
      />

      <textarea
        name="description"
        placeholder="Descripción (opcional)"
        rows={2}
        className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="date"
          name="dueDate"
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
        />
        <input
          type="number"
          name="xpReward"
          placeholder="Recompensa en XP"
          min={1}
          required
          defaultValue={50}
          className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
        />
      </div>

      <textarea
        name="subtasks"
        placeholder="Subtareas, una por línea (opcional)"
        rows={3}
        className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
      >
        {isPending ? "Creando..." : "Crear objetivo"}
      </button>
    </form>
  );
}
