import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "surface" | "elevated" | "signal" | "interactive";

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
  className?: string;
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  surface: "bg-[#0D121D] border border-[rgba(175,196,232,0.12)]",
  elevated:
    "bg-[#141B2B]/90 border border-[rgba(175,196,232,0.18)] shadow-[0_14px_36px_-18px_rgba(0,0,0,0.8)]",
  signal:
    "bg-gradient-to-b from-[#141B2B]/95 to-[#0D121D] border border-[#1677FF]/45 shadow-[0_0_28px_-10px_rgba(22,119,255,0.28)]",
  interactive:
    "bg-[#0D121D] border border-[rgba(175,196,232,0.12)] transition-all duration-200 hover:border-[#1677FF]/55 hover:bg-[#141B2B]/80 hover:-translate-y-0.5",
};

const CARD_PADDING = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-7",
  lg: "p-7 sm:p-9",
} as const;

export function Card({
  children,
  variant = "surface",
  padding = "md",
  as: Component = "div",
  className,
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl",
        CARD_VARIANTS[variant],
        CARD_PADDING[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>;
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("text-sm sm:text-base text-[#8F9BB3] leading-relaxed", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pt-4 mt-4 border-t border-[rgba(175,196,232,0.12)] flex items-center justify-between gap-3", className)}>
      {children}
    </div>
  );
}

