import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2" | "h3";
  action?: ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  headingLevel = "h2",
  action,
  className,
  id,
}: SectionHeaderProps) {
  const HeadingTag = headingLevel;
  const isCenter = align === "center";

  const headingClasses =
    headingLevel === "h1"
      ? "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
      : headingLevel === "h2"
      ? "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
      : "text-xl sm:text-2xl font-bold tracking-tight";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCenter ? "items-center text-center mx-auto max-w-3xl" : "items-start",
        action && !isCenter ? "md:flex-row md:items-end md:justify-between md:gap-8" : "",
        className
      )}
    >
      <div className={cn("space-y-3", isCenter ? "flex flex-col items-center" : "max-w-3xl")}>
        {eyebrow ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-[#252D3A] bg-[#0D121D] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#AFC4E8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]" aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>
        ) : null}

        <HeadingTag id={id} className={cn("font-display text-white text-balance", headingClasses)}>
          {title}
        </HeadingTag>

        {description ? (
          <p className="text-base sm:text-lg text-[#8F9BB3] leading-relaxed text-balance">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

