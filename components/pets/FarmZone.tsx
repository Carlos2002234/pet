import type { ReactElement } from "react";
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
    bgClass: string;
    Creature: typeof BearCreature;
    Prop: () => ReactElement;
  }
> = {
  deporte: {
    zoneLabel: "Gimnasio",
    bgClass: "from-amber-950/60 to-neutral-900",
    Creature: BearCreature,
    Prop: () => (
      <svg viewBox="0 0 100 30" className="h-6 w-full opacity-70">
        <rect x="10" y="12" width="80" height="6" rx="2" fill="#57534e" />
        <circle cx="14" cy="15" r="9" fill="#292524" />
        <circle cx="86" cy="15" r="9" fill="#292524" />
      </svg>
    ),
  },
  lectura: {
    zoneLabel: "Biblioteca",
    bgClass: "from-slate-800/60 to-neutral-900",
    Creature: OwlCreature,
    Prop: () => (
      <svg viewBox="0 0 100 30" className="h-6 w-full opacity-70">
        <rect x="6" y="6" width="88" height="20" fill="none" stroke="#57534e" strokeWidth="1.5" />
        {[10, 20, 30, 40, 55, 65, 75, 85].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="8"
            width="7"
            height="16"
            fill={["#7f1d1d", "#1e3a8a", "#166534", "#78350f", "#581c87"][i % 5]}
          />
        ))}
      </svg>
    ),
  },
  estudio: {
    zoneLabel: "Escritorio",
    bgClass: "from-sky-950/60 to-neutral-900",
    Creature: DolphinCreature,
    Prop: () => (
      <svg viewBox="0 0 100 30" className="h-6 w-full opacity-70">
        <rect x="8" y="14" width="84" height="4" fill="#57534e" />
        <rect x="70" y="2" width="10" height="12" fill="#facc15" opacity="0.6" />
        <line x1="75" y1="14" x2="75" y2="2" stroke="#78716c" strokeWidth="1.5" />
      </svg>
    ),
  },
  finanzas: {
    zoneLabel: "Bóveda",
    bgClass: "from-emerald-950/60 to-neutral-900",
    Creature: DragonCreature,
    Prop: () => (
      <svg viewBox="0 0 100 30" className="h-6 w-full opacity-70">
        <circle cx="20" cy="14" r="11" fill="none" stroke="#78716c" strokeWidth="2" />
        <circle cx="20" cy="14" r="3" fill="#78716c" />
        <circle cx="70" cy="18" r="6" fill="#facc15" />
        <circle cx="80" cy="16" r="5" fill="#fde047" />
        <circle cx="76" cy="22" r="4" fill="#facc15" />
      </svg>
    ),
  },
  espiritualidad: {
    zoneLabel: "Rincón zen",
    bgClass: "from-orange-950/50 to-neutral-900",
    Creature: PhoenixCreature,
    Prop: () => (
      <svg viewBox="0 0 100 30" className="h-6 w-full opacity-70">
        <ellipse cx="50" cy="20" rx="26" ry="6" fill="#7c2d12" opacity="0.6" />
        <line x1="80" y1="20" x2="80" y2="4" stroke="#a8a29e" strokeWidth="1" />
        <circle cx="80" cy="4" r="1.6" fill="#fb923c" />
      </svg>
    ),
  },
  viajes: {
    zoneLabel: "Pista de despegue",
    bgClass: "from-blue-950/60 to-neutral-900",
    Creature: SwallowCreature,
    Prop: () => (
      <svg viewBox="0 0 100 30" className="h-6 w-full opacity-70">
        <line
          x1="4"
          y1="15"
          x2="96"
          y2="15"
          stroke="#78716c"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        <rect x="72" y="8" width="14" height="10" rx="1.5" fill="#57534e" />
        <rect x="76" y="5" width="6" height="3" fill="#78716c" />
      </svg>
    ),
  },
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

  const { zoneLabel, bgClass, Creature, Prop } = zone;
  const scale = 0.85 + Math.min(stageOrder, 7) * 0.04;
  const opacity = 0.55 + (energy / 100) * 0.45;

  return (
    <div
      className={`relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-neutral-800 bg-gradient-to-b ${bgClass} p-5`}
    >
      <p className="self-start text-xs font-medium uppercase tracking-wide text-neutral-400">
        {zoneLabel}
      </p>

      <div
        style={{
          animation: `farm-wander ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        <Creature className="h-16 w-16" />
      </div>

      <Prop />

      <div className="text-center">
        <p className="text-sm font-medium text-neutral-50">{petName}</p>
        <p className="text-xs text-neutral-500">
          {stageName} · Energía {energy}
        </p>
      </div>
    </div>
  );
}
