import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActionList } from "./action-list";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: category } = await supabase
    .from("categories")
    .select("id, slug, name, icon, pet_name")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: progress } = await supabase
    .from("pet_progress")
    .select("total_xp, energy, current_stage_id")
    .eq("category_id", category.id)
    .single();

  let stage: string | undefined;
  if (progress) {
    const { data: stageRow } = await supabase
      .from("pet_evolution_stages")
      .select("stage_name")
      .eq("id", progress.current_stage_id)
      .single();
    stage = stageRow?.stage_name;
  }

  const { data: actionTypes } = await supabase
    .from("action_types")
    .select("id, name, xp_value, difficulty")
    .eq("category_id", category.id)
    .order("xp_value", { ascending: true });

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <Link href="/categories" className="text-sm text-neutral-400 underline">
            ← Tus mascotas
          </Link>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-50">
                {category.pet_name}
              </h1>
              <p className="text-sm text-neutral-400">{category.name}</p>
            </div>
          </div>

          {progress && (
            <p className="mt-2 text-sm text-neutral-300">
              Etapa: {stage} · {progress.total_xp} XP · Energía: {progress.energy}
            </p>
          )}
        </div>

        <ActionList actionTypes={actionTypes ?? []} />
      </div>
    </main>
  );
}
