"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BearCreature,
  DolphinCreature,
  DragonCreature,
  OwlCreature,
  PhoenixCreature,
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
};

export function FarmZone({
  slug,
  petName,
  stageName,
  stageOrder,
  totalXp,
  energy,
  duration,
  delay,
}: {
  slug: string;
  petName: string;
  stageName: string;
  stageOrder: number;
  totalXp: number;
  energy: number;
  duration: number;
  delay: number;
}) {
  const router = useRouter();
  const [isPoked, setIsPoked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const zone = ZONE_BY_SLUG[slug];
  if (!zone) return null;

  const { zoneLabel, Creature } = zone;
  const scale = 0.85 + Math.min(stageOrder, 7) * 0.04;
  const opacity = 0.55 + (energy / 100) * 0.45;

  function handleClick() {
    setIsPoked(true);
    setTimeout(() => router.push(`/categories/${slug}`), 400);
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-24 w-24">
        {isHovering && (
          <div className="absolute -top-14 left-1/2 z-10 w-max -translate-x-1/2 rounded-md border border-neutral-700 bg-neutral-900/95 px-3 py-1.5 text-center text-xs text-neutral-200 shadow-lg">
            <p className="font-medium text-neutral-50">{petName}</p>
            <p>
              {stageName} · {totalXp} XP · Energía {energy}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="absolute inset-0 flex cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          aria-label={`Ir al detalle de ${petName}`}
        >
          <div
            style={{
              animation: isPoked
                ? "farm-poke 0.4s ease-out 0s forwards"
                : `farm-roam ${duration}s ease-in-out ${delay}s infinite`,
              transform: `scale(${scale})`,
              opacity,
              filter: isHovering ? "brightness(1.15)" : undefined,
            }}
          >
            <Creature className="h-16 w-16 drop-shadow-lg" />
          </div>
        </button>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-neutral-50">{petName}</p>
        <p className="text-xs text-neutral-300">{zoneLabel}</p>
      </div>
    </div>
  );
}
