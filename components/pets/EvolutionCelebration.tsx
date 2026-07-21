export function EvolutionCelebration({
  petIcon,
  stageName,
}: {
  petIcon: string | null;
  stageName: string;
}) {
  return (
    <div className="animate-pet-evolve flex items-center gap-3 rounded-md border border-emerald-700 bg-emerald-950 px-4 py-3">
      <span className="text-3xl">{petIcon}</span>
      <p className="text-sm text-emerald-300">
        ¡Tu mascota evolucionó a{" "}
        <span className="font-semibold">{stageName}</span>!
      </p>
    </div>
  );
}
