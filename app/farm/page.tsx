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
      <div className="mx-auto max-w-5xl space-y-8">
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

        <div className="relative h-[480px] overflow-hidden rounded-2xl border border-emerald-900/40">
          {/* Cielo */}
          <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200" />
          <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute left-0 top-0 h-[40%] w-full">
            <circle cx="350" cy="16" r="16" fill="#fde047" />
            <ellipse cx="60" cy="16" rx="26" ry="9" fill="white" opacity="0.85" />
            <ellipse cx="130" cy="26" rx="20" ry="7" fill="white" opacity="0.75" />
          </svg>

          {/* Granero al fondo, arriba de la línea de pasto */}
          <svg
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            className="absolute left-1/2 top-[16%] h-[38%] w-[180px] -translate-x-1/2"
          >
            <polygon points="30,120 30,60 100,20 170,60 170,120" fill="#7f1d1d" />
            <polygon points="24,62 100,16 176,62 176,50 100,8 24,50" fill="#450a0a" />
            <rect x="88" y="88" width="24" height="32" fill="#450a0a" />
            <rect x="46" y="70" width="16" height="16" fill="#fca5a5" opacity="0.85" />
            <rect x="138" y="70" width="16" height="16" fill="#fca5a5" opacity="0.85" />
          </svg>

          {/* Pasto */}
          <div className="absolute inset-x-0 bottom-0 top-[55%] bg-gradient-to-b from-emerald-500 to-emerald-700" />
          <svg
            viewBox="0 0 400 16"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-[55%] h-4 w-full -translate-y-1/2"
          >
            <line x1="0" y1="8" x2="400" y2="8" stroke="#78350f" strokeWidth="3" />
            {Array.from({ length: 18 }, (_, i) => (
              <rect key={i} x={i * 24 + 4} y="0" width="3" height="16" fill="#78350f" />
            ))}
          </svg>

          {/* Mascotas, todas paradas sobre el pasto */}
          <div className="absolute inset-x-0 bottom-6 flex flex-wrap items-end justify-center gap-x-6 gap-y-4 px-6">
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
