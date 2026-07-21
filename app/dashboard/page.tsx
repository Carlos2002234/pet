import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardSummary } from "@/lib/dashboard/getDashboardSummary";
import { PetAvatar } from "@/components/pets/PetAvatar";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { pets, totalXp, streak, weeklyCompliance, activeGoals } =
    await getDashboardSummary();

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-50">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Tu resumen de hoy en LifeOS.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center">
            <p className="text-2xl font-semibold text-emerald-400">{totalXp}</p>
            <p className="mt-1 text-xs text-neutral-500">XP total</p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center">
            <p className="text-2xl font-semibold text-emerald-400">{streak}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {streak === 1 ? "día de racha" : "días de racha"}
            </p>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-center">
            <p className="text-2xl font-semibold text-emerald-400">
              {weeklyCompliance}%
            </p>
            <p className="mt-1 text-xs text-neutral-500">cumplimiento semanal</p>
          </div>
        </div>

        <Link
          href="/missions"
          className="block rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-center text-sm text-neutral-300 underline transition hover:border-neutral-600"
        >
          Ver misiones y logros →
        </Link>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-50">Tus mascotas</h2>
            <Link href="/categories" className="text-sm text-neutral-400 underline">
              Ver todas
            </Link>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {pets.map((pet) => (
              <li key={pet.id}>
                <Link
                  href={`/categories/${pet.slug}`}
                  className="block rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-600"
                >
                  <div className="flex items-center gap-3">
                    <PetAvatar icon={pet.icon} stageOrder={pet.stageOrder} size="sm" />
                    <div>
                      <p className="font-medium text-neutral-50">{pet.petName}</p>
                      <p className="text-sm text-neutral-400">{pet.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">
                    Etapa: {pet.stageName} · {pet.totalXp} XP · Energía: {pet.energy}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-50">
              Objetivos activos
            </h2>
            <Link href="/goals" className="text-sm text-neutral-400 underline">
              Ver todos
            </Link>
          </div>

          {activeGoals.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No tienes objetivos activos ahora mismo.
            </p>
          ) : (
            <ul className="space-y-2">
              {activeGoals.slice(0, 5).map((goal) => (
                <li
                  key={goal.id}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-neutral-50">{goal.title}</p>
                    <p className="text-xs text-neutral-500">
                      {goal.progress_percent}%
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${goal.progress_percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
