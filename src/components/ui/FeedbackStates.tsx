import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

export function LoadingState({
  label = "Cargando...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#252D3A] bg-[#0D121D] p-8 text-center",
        className
      )}
    >
      <Loader2 className="w-6 h-6 text-[#1677FF] animate-spin" aria-hidden="true" />
      <p className="text-sm text-[#AFC4E8] font-medium">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "No pudimos completar esta operación",
  description,
  retryLabel,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-3 rounded-2xl border border-red-500/35 bg-red-500/10 p-6",
        className
      )}
    >
      <div className="flex items-center gap-2.5 text-red-200 font-semibold text-sm">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
        <span>{title}</span>
      </div>
      {description ? <p className="text-xs sm:text-sm text-red-200/85 leading-relaxed">{description}</p> : null}
      {onRetry && retryLabel ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#252D3A] bg-[#0D121D]/70 p-10 text-center",
        className
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-[#141B2B] border border-[#252D3A] flex items-center justify-center text-[#AFC4E8]">
        <Inbox className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
        {description ? <p className="text-sm text-[#8F9BB3]">{description}</p> : null}
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}

export function SuccessState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-8 text-center",
        className
      )}
    >
      <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" aria-hidden="true" />
      <div className="space-y-1.5 max-w-md">
        <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        {description ? <p className="text-sm text-[#AFC4E8] leading-relaxed">{description}</p> : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

export function NoticeBanner({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warning" | "success" | "danger";
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const toneClasses = {
    info: "border-[#1677FF]/35 bg-[#1677FF]/10 text-[#AFC4E8]",
    warning: "border-amber-500/35 bg-amber-500/10 text-amber-200",
    success: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
    danger: "border-red-500/35 bg-red-500/10 text-red-200",
  } as const;

  return (
    <div className={cn("rounded-xl border px-4 py-3 text-xs sm:text-sm flex items-start gap-3", toneClasses[tone], className)}>
      <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-1 leading-relaxed">
        {title ? <p className="font-semibold text-white">{title}</p> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

