const STAGE_GLOW = [
  "0 0 0 rgba(16,185,129,0)",
  "0 0 8px rgba(16,185,129,0.25)",
  "0 0 12px rgba(16,185,129,0.35)",
  "0 0 16px rgba(16,185,129,0.45)",
  "0 0 20px rgba(16,185,129,0.55)",
  "0 0 26px rgba(16,185,129,0.65)",
  "0 0 32px rgba(16,185,129,0.75)",
  "0 0 40px rgba(16,185,129,0.9)",
] as const;

const STAGE_ICON_SIZE = [
  "text-2xl",
  "text-2xl",
  "text-3xl",
  "text-3xl",
  "text-4xl",
  "text-4xl",
  "text-5xl",
  "text-5xl",
] as const;

const SIZE_DIMENSIONS = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
} as const;

export function PetAvatar({
  icon,
  stageOrder,
  size = "md",
  showStageDots = true,
}: {
  icon: string | null;
  stageOrder: number;
  size?: keyof typeof SIZE_DIMENSIONS;
  showStageDots?: boolean;
}) {
  const clampedStage = Math.min(Math.max(stageOrder, 0), 7);

  return (
    <div className="inline-flex flex-col items-center gap-1.5">
      <div
        className={`flex items-center justify-center rounded-full border border-emerald-900/60 bg-gradient-to-br from-emerald-950 to-neutral-900 ${SIZE_DIMENSIONS[size]}`}
        style={{ boxShadow: STAGE_GLOW[clampedStage] }}
      >
        <span className={STAGE_ICON_SIZE[clampedStage]}>{icon}</span>
      </div>

      {showStageDots && (
        <div className="flex gap-0.5">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className={`h-1 w-1 rounded-full ${
                i <= clampedStage ? "bg-emerald-400" : "bg-neutral-700"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
