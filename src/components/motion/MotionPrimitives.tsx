"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  KYVORA_DURATION,
  KYVORA_EASE,
  kyvoraLineExpandVariants,
  kyvoraReducedVariants,
  kyvoraRevealVariants,
  kyvoraSignalPathVariants,
  kyvoraStaggerContainer,
} from "@/lib/motion";
import { cn } from "@/lib/cn";

const SAFE_VIEWPORT = {
  once: true,
  amount: 0.12,
} as const;

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Activa animación al montar sin IntersectionObserver (para Hero / above-the-fold). */
  immediate?: boolean;
  /** Variants alternativos que respetan reduced-motion. */
  variants?: Variants;
}

export function MotionReveal({
  children,
  className,
  delay = 0,
  immediate = false,
  variants,
}: MotionRevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const activeVariants: Variants =
    variants ??
    (immediate
      ? {
          hidden: { opacity: 0.92, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: KYVORA_DURATION.reveal,
              delay,
              ease: KYVORA_EASE.standard,
            },
          },
        }
      : {
          hidden: kyvoraRevealVariants.hidden,
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: KYVORA_DURATION.reveal,
              delay,
              ease: KYVORA_EASE.standard,
            },
          },
        });

  return (
    <motion.div
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: SAFE_VIEWPORT })}
      variants={activeVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface KineticHeadlineProps {
  as?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export function KineticHeadline({
  as = "h2",
  children,
  className,
  delay = 0,
  immediate = false,
}: KineticHeadlineProps) {
  const prefersReduced = useReducedMotion();
  const Tag = motion[as];

  if (prefersReduced) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  const variants: Variants = immediate
    ? {
        hidden: { opacity: 0.95, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: KYVORA_DURATION.hero,
            delay,
            ease: KYVORA_EASE.standard,
          },
        },
      }
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: KYVORA_DURATION.hero,
            delay,
            ease: KYVORA_EASE.standard,
          },
        },
      };

  return (
    <Tag
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: SAFE_VIEWPORT })}
      variants={variants}
      className={className}
    >
      {children}
    </Tag>
  );
}

interface MotionStaggerProps {
  children: ReactNode;
  className?: string;
  immediate?: boolean;
}

export function MotionStagger({
  children,
  className,
  immediate = false,
}: MotionStaggerProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: SAFE_VIEWPORT })}
      variants={kyvoraStaggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      variants={prefersReduced ? kyvoraReducedVariants : kyvoraRevealVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BlueprintDivider({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div aria-hidden="true" className={cn("h-px w-full bg-[var(--color-border)]", className)} />;
  }

  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="visible"
      viewport={SAFE_VIEWPORT}
      variants={kyvoraLineExpandVariants}
      className={cn(
        "h-px w-full origin-left bg-gradient-to-r from-[var(--color-accent)]/60 via-[var(--color-border)] to-transparent",
        className
      )}
    />
  );
}

export function SignalTrace({
  d,
  viewBox = "0 0 800 40",
  className,
  stroke = "#2B85FF",
  strokeWidth = 1.5,
}: {
  d: string;
  viewBox?: string;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.svg
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={SAFE_VIEWPORT}
    >
      <path d={d} stroke="#252D3A" strokeWidth={strokeWidth} strokeLinecap="round" />
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        variants={prefersReduced ? undefined : kyvoraSignalPathVariants}
      />
    </motion.svg>
  );
}

