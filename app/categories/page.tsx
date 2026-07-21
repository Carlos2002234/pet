import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PetAvatar } from "@/components/pets/PetAvatar";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, slug, name, icon, pet_name, pet_archetype, pet_justification")
    .order("name");

  const { data: progress } = await supabase
    .from("pet_progress")
    .select("category_id, current_stage_id");

  const { data: stages } = await supabase
    .from("pet_evolution_stages")
    .select("id, stage_order");

  const stageOrderById = new Map((stages ?? []).map((s) => [s.id, s.stage_order]));
  const stageOrderByCategory = new Map(
    (progress ?? []).map((p) => [p.category_id, stageOrderById.get(p.current_stage_id) ?? 0]),
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-50">
              Tus mascotas
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Cada área de tu vida es una mascota que evoluciona contigo.
            </p>
          </div>
          <Link href="/farm" className="text-sm text-neutral-400 underline">
            Ver la granja 🌾
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-400">
            No se pudieron cargar las categorías: {error.message}
          </p>
        )}

        {!error && categories?.length === 0 && (
          <p className="text-sm text-neutral-400">
            Aún no tienes categorías registradas.
          </p>
        )}

        <ul className="grid gap-4 sm:grid-cols-2">
          {categories?.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="block rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-600"
              >
                <div className="flex items-center gap-3">
                  <PetAvatar
                    icon={category.icon}
                    stageOrder={stageOrderByCategory.get(category.id) ?? 0}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium text-neutral-50">
                      {category.name}
                    </p>
                    <p className="text-sm text-neutral-400">
                      {category.pet_name}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-neutral-500">
                  {category.pet_archetype}
                </p>
                <p className="mt-1 text-sm text-neutral-300">
                  {category.pet_justification}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
