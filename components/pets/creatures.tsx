type CreatureProps = {
  className?: string;
};

/** Deporte — oso musculoso, flexiona los brazos */
export function BearCreature({ className }: CreatureProps) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <ellipse cx="40" cy="50" rx="22" ry="20" fill="#b45309" />
      <circle cx="24" cy="27" r="8" fill="#92400e" />
      <circle cx="56" cy="27" r="8" fill="#92400e" />
      <circle cx="24" cy="27" r="4" fill="#fde68a" />
      <circle cx="56" cy="27" r="4" fill="#fde68a" />
      <ellipse cx="40" cy="55" rx="10" ry="8" fill="#fde68a" />
      <circle cx="36" cy="42" r="2.4" fill="#1c1917" />
      <circle cx="44" cy="42" r="2.4" fill="#1c1917" />
      <circle cx="40" cy="53" r="2" fill="#1c1917" />
      <rect x="20" y="34" width="40" height="6" rx="3" fill="#dc2626" />
      <rect x="10" y="60" width="60" height="4" rx="2" fill="#57534e" />
      <circle cx="12" cy="62" r="7" fill="#292524" />
      <circle cx="68" cy="62" r="7" fill="#292524" />
      <g className="bear-arm-left">
        <ellipse cx="16" cy="52" rx="7" ry="10" fill="#b45309" />
      </g>
      <g className="bear-arm-right">
        <ellipse cx="64" cy="52" rx="7" ry="10" fill="#b45309" />
      </g>
    </svg>
  );
}

/** Lectura — búho con gafas, pasa las páginas de un libro */
export function OwlCreature({ className }: CreatureProps) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <path d="M30 20 L36 30 L24 30 Z" fill="#64748b" />
      <path d="M50 20 L56 30 L44 30 Z" fill="#64748b" />
      <ellipse cx="40" cy="48" rx="20" ry="22" fill="#94a3b8" />
      <ellipse cx="40" cy="54" rx="12" ry="14" fill="#f1f5f9" />
      <circle cx="31" cy="40" r="9" fill="#f8fafc" />
      <circle cx="49" cy="40" r="9" fill="#f8fafc" />
      <circle cx="31" cy="40" r="4" fill="#1c1917" />
      <circle cx="49" cy="40" r="4" fill="#1c1917" />
      <path d="M37 47 L43 47 L40 52 Z" fill="#f59e0b" />
      <g className="owl-wing">
        <ellipse cx="20" cy="55" rx="5" ry="10" fill="#64748b" />
      </g>
      <g className="owl-page">
        <rect x="46" y="52" width="14" height="18" rx="1.5" fill="#fefce8" stroke="#d6d3d1" />
        <line x1="53" y1="52" x2="53" y2="70" stroke="#d6d3d1" />
      </g>
    </svg>
  );
}

/** Estudio — delfín con birrete, asiente sobre un cuaderno */
export function DolphinCreature({ className }: CreatureProps) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <g className="dolphin-nod">
        <ellipse cx="40" cy="50" rx="22" ry="13" fill="#0ea5e9" transform="rotate(-8 40 50)" />
        <path d="M40 38 L46 24 L50 40 Z" fill="#0ea5e9" />
        <path d="M60 50 L72 44 L62 58 Z" fill="#0ea5e9" />
        <ellipse cx="18" cy="52" rx="8" ry="5" fill="#0ea5e9" />
        <circle cx="24" cy="46" r="2.2" fill="#0c4a6e" />
        <rect x="30" y="26" width="16" height="4" fill="#1c1917" />
        <rect x="36" y="22" width="4" height="6" fill="#1c1917" />
        <line x1="40" y1="28" x2="46" y2="34" stroke="#facc15" strokeWidth="1.5" />
        <circle cx="46" cy="34" r="1.6" fill="#facc15" />
      </g>
      <rect x="26" y="64" width="28" height="8" rx="1" fill="#fefce8" stroke="#d6d3d1" />
    </svg>
  );
}

/** Finanzas — dragón guardián, custodia su tesoro */
export function DragonCreature({ className }: CreatureProps) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <ellipse cx="24" cy="68" rx="7" ry="5" fill="#facc15" />
      <ellipse cx="34" cy="70" rx="7" ry="5" fill="#fde047" />
      <ellipse cx="46" cy="70" rx="7" ry="5" fill="#facc15" />
      <ellipse cx="56" cy="68" rx="7" ry="5" fill="#fde047" />
      <ellipse cx="40" cy="52" rx="21" ry="18" fill="#059669" />
      <path d="M28 34 L32 24 L36 34 Z" fill="#047857" />
      <path d="M38 32 L42 20 L46 32 Z" fill="#047857" />
      <path d="M48 34 L52 24 L56 34 Z" fill="#047857" />
      <ellipse cx="40" cy="60" rx="10" ry="7" fill="#a7f3d0" />
      <circle cx="34" cy="46" r="2.4" fill="#facc15" />
      <circle cx="46" cy="46" r="2.4" fill="#facc15" />
      <g className="dragon-wing-left">
        <path d="M18 50 L4 40 L16 62 Z" fill="#047857" />
      </g>
      <g className="dragon-wing-right">
        <path d="M62 50 L76 40 L64 62 Z" fill="#047857" />
      </g>
    </svg>
  );
}

/** Espiritualidad — fénix en meditación, aura pulsante */
export function PhoenixCreature({ className }: CreatureProps) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="48" r="26" fill="none" stroke="#fb923c" strokeOpacity="0.35" className="phoenix-aura" />
      <circle cx="40" cy="48" r="20" fill="none" stroke="#fb923c" strokeOpacity="0.25" className="phoenix-aura phoenix-aura-delay" />
      <path d="M20 30 L26 44 L14 42 Z" fill="#f97316" className="phoenix-wing-left" />
      <path d="M60 30 L54 44 L66 42 Z" fill="#f97316" className="phoenix-wing-right" />
      <ellipse cx="40" cy="50" rx="16" ry="18" fill="#fb923c" />
      <ellipse cx="40" cy="54" rx="9" ry="11" fill="#fde68a" />
      <path d="M34 24 L40 12 L46 24 Z" fill="#dc2626" />
      <circle cx="35" cy="42" r="2" fill="#1c1917" />
      <circle cx="45" cy="42" r="2" fill="#1c1917" />
    </svg>
  );
}
