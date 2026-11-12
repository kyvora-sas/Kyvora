"use client";

import { Printer } from "lucide-react";

interface PrintButtonProps {
  label?: string;
  ariaLabel?: string;
  className?: string;
}

export default function PrintButton({
  label = "Imprimir / Guardar PDF",
  ariaLabel = "Imprimir este documento legal o guardarlo en PDF",
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
      aria-label={ariaLabel}
      className={`no-print inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#252D3A] bg-[#0D121D] hover:bg-[#141B2B] text-xs font-mono text-[#AFC4E8] hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] cursor-pointer ${className}`}
    >
      <Printer className="w-3.5 h-3.5 text-[#2B85FF]" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
