import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FarmZone } from "@/components/pets/FarmZone";

export default async function FarmPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, icon, pet_name")
    .order("name");

  const { data: progress } = await supabase
    .from("pet_progress")
    .select("category_id, current_stage_id, energy");

  const { data: stages } = await supabase
    .from("pet_evolution_stages")
    .select("id, stage_name, stage_order");

  const stageById = new Map(
    (stages ?? []).map((s) => [s.id, { name: s.stage_name, order: s.stage_order }]),
  );
  const progressByCategory = new Map((progress ?? []).map((p) => [p.category_id, p]));

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-50">La Granja</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Todas tus mascotas conviven aquí, cada una haciendo lo suyo.
            </p>
          </div>
          <Link href="/categories" className="text-sm text-neutral-400 underline">
            ← Tus mascotas
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-neutral-900 via-neutral-900 to-emerald-950/70 p-10">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-emerald-900/50 to-transparent" />

          <div className="relative flex flex-wrap items-end justify-center gap-x-10 gap-y-10">
            {(categories ?? []).map((category, index) => {
              const row = progressByCategory.get(category.id);
              const stage = row ? stageById.get(row.current_stage_id) : undefined;
              return (
                <FarmZone
                  key={category.id}
                  slug={category.slug}
                  petName={category.pet_name}
                  stageName={stage?.name ?? "Huevo"}
                  stageOrder={stage?.order ?? 0}
                  energy={row?.energy ?? 100}
                  duration={4 + (index % 3)}
                  delay={index * 0.35}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
