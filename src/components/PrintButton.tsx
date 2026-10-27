"use client";

import { Printer } from "lucide-react";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export default function PrintButton({
  label = "Imprimir / Guardar PDF",
  className = "",
}: PrintButtonProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      aria-label="Imprimir este documento legal o guardarlo en PDF"
      className={`no-print inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-foreground-muted hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cyan)] cursor-pointer ${className}`}
    >
      <Printer className="w-3.5 h-3.5 text-[var(--color-accent-cyan)]" />
      <span>{label}</span>
    </button>
  );
}
