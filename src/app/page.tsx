import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import LabProjects from "@/components/LabProjects";
import PricingSection from "@/components/PricingSection";
import ProcessSection from "@/components/ProcessSection";
import DonateSection from "@/components/DonateSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[var(--color-accent)] selection:text-white">
      <Navbar />
      
      <main id="contenido-principal" className="flex-1">
        <Hero />
        <Services />
        <LabProjects />
        <PricingSection />
        <ProcessSection />
        <DonateSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
