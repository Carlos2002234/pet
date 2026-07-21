import { PetAvatar } from "./PetAvatar";

export function FarmCreature({
  icon,
  stageOrder,
  petName,
  categoryName,
  duration,
  delay,
}: {
  icon: string | null;
  stageOrder: number;
  petName: string;
  categoryName: string;
  duration: number;
  delay: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-28 w-24 items-end justify-center">
        <div
          className="absolute bottom-1 h-2.5 w-12 rounded-full bg-black/50 blur-[2px]"
          style={{
            animation: "farm-shadow-pulse 3s ease-in-out infinite",
            animationDelay: `${delay}s`,
          }}
        />
        <div
          style={{
            animation: `farm-wander ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        >
          <PetAvatar
            icon={icon}
            stageOrder={stageOrder}
            size="lg"
            showStageDots={false}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-neutral-50">{petName}</p>
        <p className="text-xs text-neutral-500">{categoryName}</p>
      </div>
    </div>
  );
}
