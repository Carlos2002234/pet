import {
  BearCreature,
  DolphinCreature,
  DragonCreature,
  OwlCreature,
  PhoenixCreature,
  SwallowCreature,
} from "./creatures";

const ZONE_BY_SLUG: Record<
  string,
  {
    zoneLabel: string;
    Creature: typeof BearCreature;
  }
> = {
  deporte: { zoneLabel: "Gimnasio", Creature: BearCreature },
  lectura: { zoneLabel: "Biblioteca", Creature: OwlCreature },
  estudio: { zoneLabel: "Escritorio", Creature: DolphinCreature },
  finanzas: { zoneLabel: "Bóveda", Creature: DragonCreature },
  espiritualidad: { zoneLabel: "Rincón zen", Creature: PhoenixCreature },
  viajes: { zoneLabel: "Pista de despegue", Creature: SwallowCreature },
};

export function FarmZone({
  slug,
  petName,
  stageName,
  stageOrder,
  energy,
  duration,
  delay,
}: {
  slug: string;
  petName: string;
  stageName: string;
  stageOrder: number;
  energy: number;
  duration: number;
  delay: number;
}) {
  const zone = ZONE_BY_SLUG[slug];
  if (!zone) return null;

  const { zoneLabel, Creature } = zone;
  const scale = 0.85 + Math.min(stageOrder, 7) * 0.04;
  const opacity = 0.55 + (energy / 100) * 0.45;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        style={{
          animation: `farm-wander ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <Creature className="h-20 w-20 drop-shadow-lg" />
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-neutral-50">{petName}</p>
        <p className="text-xs text-neutral-300">{zoneLabel}</p>
        <p className="text-[11px] text-neutral-400">
          {stageName} · Energía {energy}
        </p>
      </div>
    </div>
  );
}
