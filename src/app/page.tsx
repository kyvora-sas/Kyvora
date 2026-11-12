import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ManifestoSection from "@/components/ManifestoSection";
import Services from "@/components/Services";
import PricingSection from "@/components/PricingSection";
import LabProjects from "@/components/LabProjects";
import ProcessSection from "@/components/ProcessSection";
import HumanSection from "@/components/HumanSection";
import DonateSection from "@/components/DonateSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080B12] text-white flex flex-col font-sans selection:bg-[#1677FF] selection:text-white">
      <Navbar />

      <main id="contenido-principal" className="flex-1">
        <Hero />
        <ManifestoSection />
        <Services />
        <PricingSection />
        <LabProjects />
        <ProcessSection />
        <HumanSection />
        <DonateSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
