import { useMemo } from "react";

export type BearReaction = "idle" | "wave" | "happy" | "eat" | "dance" | "think" | "wear";

type Props = {
  reaction?: BearReaction;
  necklace?: string[];
  className?: string;
  label?: string;
};

export function MagicBear({
  reaction = "idle",
  necklace = [],
  className = "",
  label = "Ο Πισιπούκ το αρκουδάκι",
}: Props) {
  const necklaceDots = useMemo(() => {
    if (!necklace.length) return [];
    const start = -46;
    const end = 46;
    return necklace.map((color, index) => {
      const t = necklace.length === 1 ? 0.5 : index / (necklace.length - 1);
      const x = start + (end - start) * t;
      const y = 122 + Math.pow((x / 46), 2) * 22;
      return { color, x, y };
    });
  }, [necklace]);

  return (
    <svg
      className={`pm-bear pm-bear--${reaction} ${className}`}
      viewBox="0 0 320 360"
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id="pm-fur" cx="45%" cy="30%">
          <stop offset="0%" stopColor="#f3b56b" />
          <stop offset="56%" stopColor="#c9783f" />
          <stop offset="100%" stopColor="#8e492a" />
        </radialGradient>
        <radialGradient id="pm-muzzle" cx="48%" cy="34%">
          <stop offset="0%" stopColor="#fff2cf" />
          <stop offset="100%" stopColor="#e9bd83" />
        </radialGradient>
        <linearGradient id="pm-overalls" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1f80ec" />
          <stop offset="1" stopColor="#1451b4" />
        </linearGradient>
        <linearGradient id="pm-star" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff67a" />
          <stop offset="1" stopColor="#ffb30e" />
        </linearGradient>
        <filter id="pm-shadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="11" stdDeviation="9" floodColor="#43240f" floodOpacity=".28" />
        </filter>
        <filter id="pm-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
      </defs>

      <g className="pm-bear-float" filter="url(#pm-shadow)">
        <ellipse cx="160" cy="337" rx="83" ry="14" fill="#392819" opacity=".12" />

        <g className="pm-bear-legs">
          <ellipse cx="117" cy="284" rx="34" ry="48" fill="url(#pm-fur)" transform="rotate(8 117 284)" />
          <ellipse cx="202" cy="284" rx="34" ry="48" fill="url(#pm-fur)" transform="rotate(-8 202 284)" />
          <ellipse cx="111" cy="310" rx="24" ry="17" fill="#b46235" />
          <ellipse cx="208" cy="310" rx="24" ry="17" fill="#b46235" />
        </g>

        <ellipse cx="160" cy="218" rx="86" ry="91" fill="url(#pm-fur)" />
        <path d="M103 190 Q111 164 132 163 H188 Q210 164 218 190 L220 265 Q191 287 160 287 Q128 287 100 265Z" fill="url(#pm-overalls)" />
        <path d="M126 171 L113 121 M193 171 L207 121" stroke="#1451b4" strokeWidth="18" strokeLinecap="round" />
        <circle cx="116" cy="174" r="8" fill="#ffd66a" />
        <circle cx="204" cy="174" r="8" fill="#ffd66a" />

        <g className="pm-bear-arm pm-bear-arm--left">
          <ellipse cx="74" cy="207" rx="28" ry="64" fill="url(#pm-fur)" transform="rotate(26 74 207)" />
          <ellipse cx="48" cy="169" rx="25" ry="31" fill="#d98b4f" transform="rotate(26 48 169)" />
        </g>
        <g className="pm-bear-arm pm-bear-arm--right">
          <ellipse cx="246" cy="207" rx="28" ry="64" fill="url(#pm-fur)" transform="rotate(-26 246 207)" />
          <ellipse cx="272" cy="169" rx="25" ry="31" fill="#d98b4f" transform="rotate(-26 272 169)" />
        </g>

        <g className="pm-bear-head">
          <circle cx="91" cy="74" r="38" fill="#9a512e" />
          <circle cx="91" cy="74" r="24" fill="#e2a56a" />
          <circle cx="229" cy="74" r="38" fill="#9a512e" />
          <circle cx="229" cy="74" r="24" fill="#e2a56a" />
          <ellipse cx="160" cy="113" rx="92" ry="89" fill="url(#pm-fur)" />

          <g className="pm-bear-eye pm-bear-eye--left">
            <ellipse cx="128" cy="104" rx="24" ry="30" fill="#fff" />
            <circle cx="132" cy="110" r="13" fill="#332216" />
            <circle cx="136" cy="105" r="4" fill="#fff" />
          </g>
          <g className="pm-bear-eye pm-bear-eye--right">
            <ellipse cx="193" cy="104" rx="24" ry="30" fill="#fff" />
            <circle cx="189" cy="110" r="13" fill="#332216" />
            <circle cx="193" cy="105" r="4" fill="#fff" />
          </g>

          <ellipse cx="160" cy="148" rx="49" ry="37" fill="url(#pm-muzzle)" />
          <ellipse cx="160" cy="133" rx="18" ry="13" fill="#3a2118" />
          <path className="pm-bear-mouth" d="M138 154 Q160 179 182 154 Q178 190 160 194 Q142 190 138 154Z" fill="#57231e" />
          <path d="M149 169 Q160 175 171 169" stroke="#ff8d8b" strokeWidth="8" strokeLinecap="round" />
          <path d="M145 153 Q160 163 175 153" fill="none" stroke="#3a2118" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="119" cy="144" rx="17" ry="8" fill="#f6a06e" opacity=".38" filter="url(#pm-soft)" />
          <ellipse cx="201" cy="144" rx="17" ry="8" fill="#f6a06e" opacity=".38" filter="url(#pm-soft)" />
        </g>

        <path
          d="M160 204 l11 22 25 4-18 18 4 26-22-12-22 12 4-26-18-18 25-4z"
          fill="url(#pm-star)"
          stroke="#f39a00"
          strokeWidth="4"
          className="pm-bear-star"
        />

        {necklaceDots.length > 0 && (
          <g className="pm-necklace-worn" aria-label="Το κολιέ που δημιούργησε το παιδί">
            <path d="M108 116 Q160 178 212 116" fill="none" stroke="#fff1d4" strokeWidth="7" strokeLinecap="round" />
            {necklaceDots.map((dot, index) => (
              <circle key={`${dot.color}-${index}`} cx={160 + dot.x} cy={dot.y} r="10" fill={dot.color} stroke="#fff" strokeWidth="3" />
            ))}
          </g>
        )}
      </g>
    </svg>
  );
}
