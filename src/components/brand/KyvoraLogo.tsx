"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export interface KyvoraLogoProps {
  variant?: "mark" | "lockup" | "stacked";
  size?: "sm" | "md" | "lg";
  tone?: "default" | "mono-white" | "mono-dark";
  subtitle?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: {
    mark: "h-6 w-auto",
    wordmark: "text-base tracking-[0.22em]",
    gap: "gap-2.5",
  },
  md: {
    mark: "h-7 w-auto",
    wordmark: "text-lg tracking-[0.24em]",
    gap: "gap-3",
  },
  lg: {
    mark: "h-10 w-auto",
    wordmark: "text-2xl tracking-[0.26em]",
    gap: "gap-3.5",
  },
} as const;

/**
 * Anatomía vectorial fiel del isotipo modular K (3 segmentos independientes a 45°),
 * derivada geométricamente de src/img/logo.png.
 */
export const KYVORA_K_SEGMENTS = [
  {
    id: "pillar-left",
    d: "M 39 7 Q 45 0 53 0 Q 59 0 59 6 L 59 93 Q 59 100 54 105 L 5 154 Q 0 159 0 152 L 0 52 Q 0 46 4 42 Z",
    gradient: "top",
    initialOffset: { x: -12, y: -8, delay: 0.04 },
  },
  {
    id: "diagonal-main",
    d: "M 169 7 Q 176 0 185 0 L 257 0 Q 261 0 258 3 L 29 232 Q 23 238 15 238 L 6 238 Q 0 238 0 232 L 0 184 Q 0 176 6 170 Z",
    gradient: "main",
    initialOffset: { x: 14, y: -14, delay: 0.14 },
  },
  {
    id: "leg-lower",
    d: "M 147 134 Q 155 126 163 134 L 258 232 Q 261 237 256 238 L 185 238 Q 178 238 173 232 L 119 175 Q 113 168 120 161 Z",
    gradient: "main",
    initialOffset: { x: 14, y: 14, delay: 0.24 },
  },
] as const;

export function KyvoraMark({
  className = "h-7 w-auto",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "mono-white" | "mono-dark";
}) {
  const uid = useId().replace(/:/g, "");
  const gradMainId = `kyvora-k-main-${uid}`;
  const gradTopId = `kyvora-k-top-${uid}`;

  const solidFill =
    tone === "mono-white" ? "#FFFFFF" : tone === "mono-dark" ? "#080B12" : undefined;

  return (
    <svg
      viewBox="0 0 261 238"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("shrink-0 select-none", className)}
    >
      {tone === "default" && (
        <defs>
          <linearGradient id={gradTopId} x1="0" y1="0" x2="64" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1677FF" />
            <stop offset="100%" stopColor="#2B85FF" />
          </linearGradient>
          <linearGradient id={gradMainId} x1="12" y1="230" x2="256" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1661FB" />
            <stop offset="55%" stopColor="#1677FF" />
            <stop offset="100%" stopColor="#3B93FF" />
          </linearGradient>
        </defs>
      )}
      {KYVORA_K_SEGMENTS.map((seg) => (
        <path
          key={seg.id}
          d={seg.d}
          fill={solidFill ?? `url(#${seg.gradient === "top" ? gradTopId : gradMainId})`}
        />
      ))}
    </svg>
  );
}

export default function KyvoraLogo({
  variant = "lockup",
  size = "md",
  tone = "default",
  subtitle,
  className,
}: KyvoraLogoProps) {
  const sizing = SIZE_MAP[size];
  const wordmarkColor = tone === "mono-dark" ? "text-[#080B12]" : "text-white";
  const subtitleColor = tone === "mono-dark" ? "text-[#252D3A]" : "text-[#AFC4E8]";

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex items-center justify-center", className)}>
        <KyvoraMark className={sizing.mark} tone={tone} />
        <span className="sr-only">KYVORA</span>
      </span>
    );
  }

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center text-center select-none", sizing.gap, className)}>
        <KyvoraMark className={sizing.mark} tone={tone} />
        <span className="flex flex-col items-center gap-1">
          <span className={cn("font-display font-bold uppercase leading-none", sizing.wordmark, wordmarkColor)}>
            KYVORA
          </span>
          {subtitle ? (
            <span className={cn("text-[10px] font-mono uppercase tracking-[0.22em]", subtitleColor)}>
              {subtitle}
            </span>
          ) : null}
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center select-none", sizing.gap, className)}>
      <KyvoraMark className={sizing.mark} tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-bold uppercase leading-none", sizing.wordmark, wordmarkColor)}>
          KYVORA
        </span>
        {subtitle ? (
          <span className={cn("text-[9px] font-mono uppercase tracking-[0.2em] mt-1", subtitleColor)}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}

