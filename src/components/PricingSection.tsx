"use client";

import Link from "next/link";
import { Check, ArrowRight, Info } from "lucide-react";
import { pricingConfig } from "@/config/pricing";
import { useLanguage } from "@/context/LanguageContext";
import { triggerContactServiceSelection } from "@/lib/service-selection";
import { Container } from "@/components/ui";
import {
  KineticHeadline,
  MotionItem,
  MotionReveal,
  MotionStagger,
} from "@/components/motion/MotionPrimitives";

export default function PricingSection() {
  const { t, language } = useLanguage();

  return (
    <section
      id="precios"
      aria-labelledby="pricing-heading"
      className="py-20 md:py-28 bg-[#0D121D] border-t border-[#252D3A]/80 relative"
    >
      <Container>
        {/* Header alineado al sistema visual KYVORA Studio */}
        <div className="mb-14 md:mb-18 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#252D3A] pb-8">
          <MotionReveal className="space-y-3">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.18em] uppercase text-[#2B85FF]">
              <span className="w-2 h-2 rounded-full bg-[#1677FF]" />
              <span>{t.pricing.badge}</span>
            </div>
            <KineticHeadline
              as="h2"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
            >
              <span id="pricing-heading">{t.pricing.title}</span>
            </KineticHeadline>
          </MotionReveal>

          <MotionReveal delay={0.08} className="lg:max-w-md">
            <p className="text-[#9AA5B8] text-sm sm:text-base font-light leading-relaxed">
              {t.pricing.subtitle}
            </p>
          </MotionReveal>
        </div>

        {/* Tarifas referenciales y modelos de cotización */}
        <MotionStagger className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {pricingConfig.tiers.map((tier) => {
            const locTier = t.pricing.tiers.find((pt) => pt.id === tier.id);
            const title = locTier?.title || tier.title;
            const badge = locTier?.badge || tier.badge;
            const description = locTier?.description || tier.description;
            const deliveryTime = locTier?.deliveryTimeEstimated || tier.deliveryTimeEstimated;
            const priceNote = locTier?.priceNote || tier.priceNote;
            const deliverables = locTier?.deliverables || tier.deliverables;
            const ctaText = locTier?.ctaText || tier.ctaText;
            const isHighlighted = tier.id === "mvp-web-app";

            return (
              <MotionItem key={tier.id} className="flex">
                <div
                  className={`w-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors border ${
                    isHighlighted
                      ? "bg-[#141B2B] border-[#1677FF]/60 shadow-2xl shadow-black/60"
                      : "bg-[#080B12] border-[#252D3A] hover:border-[#2B85FF]/40"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      {badge && (
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-[11px] font-mono uppercase tracking-[0.14em] ${
                            isHighlighted
                              ? "bg-[#1677FF]/20 border border-[#1677FF]/40 text-[#5CA8FF]"
                              : "bg-[#0D121D] border border-[#252D3A] text-[#AFC4E8]"
                          }`}
                        >
                          {badge}
                        </span>
                      )}

                      <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                        {title}
                      </h3>

                      <p className="text-sm text-[#9AA5B8] font-light leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <div className="py-4 border-y border-[#252D3A] space-y-1.5">
                      <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
                        {priceNote}
                      </div>
                      <div className="text-xs font-mono text-[#5CA8FF]">
                        {language === "en" ? "Reference window:" : "Ventana estimada:"} {deliveryTime}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-xs font-mono uppercase tracking-wider text-white block">
                        {t.pricing.deliverablesLabel}
                      </span>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-[#9AA5B8] font-light">
                        {deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#2B85FF] shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="#contacto"
                      onClick={() => triggerContactServiceSelection(tier.id)}
                      className={`w-full py-3.5 px-5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B85FF] ${
                        isHighlighted
                          ? "bg-[#1677FF] hover:bg-[#2B85FF] text-white shadow-lg shadow-[#1677FF]/25"
                          : "bg-[#0D121D] hover:bg-[#141B2B] text-white border border-[#252D3A] hover:border-[#2B85FF]/50"
                      }`}
                    >
                      <span>{ctaText}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </MotionItem>
            );
          })}
        </MotionStagger>

        {/* Factores de alcance en proyectos personalizados */}
        <MotionReveal delay={0.1} className="mt-14 pt-12 border-t border-[#252D3A]">
          <h3 className="font-display text-lg font-bold text-white mb-6 tracking-tight">
            {t.pricing.scopeFactorsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.pricing.scopeFactors.map((factor, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#080B12] border border-[#252D3A] space-y-2"
              >
                <span className="text-[11px] font-mono text-[#2B85FF] uppercase tracking-[0.14em]">
                  0{idx + 1}
                </span>
                <h4 className="font-semibold text-white text-sm">{factor.title}</h4>
                <p className="text-xs text-[#9AA5B8] font-light leading-relaxed">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </MotionReveal>

        {/* Disclaimer comercial transparente */}
        <MotionReveal delay={0.12} className="mt-8">
          <div className="p-5 rounded-xl bg-[#080B12] border border-[#252D3A] flex items-start gap-3 text-xs text-[#9AA5B8] font-light leading-relaxed">
            <Info className="w-4 h-4 text-[#2B85FF] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>{language === "en" ? "Pricing note" : "Nota comercial"}:</strong> {t.pricing.disclaimer}{" "}
              <Link href="/legal/contratacion" className="text-[#5CA8FF] underline font-normal">
                {t.pricing.contractConditionsLink}
              </Link>
              .
            </p>
          </div>
        </MotionReveal>
      </Container>
    </section>
  );
}
