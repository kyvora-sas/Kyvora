import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "signal" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  href?: string;
  external?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1677FF] hover:bg-[#2B85FF] text-white border border-[#1677FF] shadow-[0_0_24px_-6px_rgba(22,119,255,0.45)]",
  secondary:
    "bg-[#0D121D] hover:bg-[#141B2B] text-white border border-[#252D3A] hover:border-[#1677FF]/60",
  ghost:
    "bg-transparent hover:bg-[#141B2B] text-[#AFC4E8] hover:text-white border border-transparent",
  signal:
    "bg-[#1677FF]/12 hover:bg-[#1677FF]/22 text-[#AFC4E8] hover:text-white border border-[#1677FF]/45",
  danger:
    "bg-red-500/15 hover:bg-red-500/25 text-red-200 border border-red-500/40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  href,
  external = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B12] disabled:opacity-55 disabled:pointer-events-none cursor-pointer select-none",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </a>
      );
    }

    return (
      <Link href={href} className={baseClasses}>
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={baseClasses}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" /> : leftIcon}
      <span>{children}</span>
      {!loading ? rightIcon : null}
    </button>
  );
}

