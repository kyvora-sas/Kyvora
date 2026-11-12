import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ContainerProps {
  children: ReactNode;
  size?: "default" | "narrow" | "wide" | "reading";
  as?: "div" | "section" | "article" | "main";
  className?: string;
}

const CONTAINER_SIZES = {
  reading: "max-w-[76ch]",
  narrow: "max-w-4xl",
  default: "max-w-7xl",
  wide: "max-w-[1400px]",
} as const;

export function Container({
  children,
  size = "default",
  as: Component = "div",
  className,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto px-5 sm:px-6 lg:px-8",
        CONTAINER_SIZES[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

export interface ModularGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const GRID_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  12: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
} as const;

const GRID_GAPS = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
} as const;

export function ModularGrid({
  children,
  cols = 3,
  gap = "md",
  className,
}: ModularGridProps) {
  return (
    <div className={cn("grid", GRID_COLS[cols], GRID_GAPS[gap], className)}>
      {children}
    </div>
  );
}

