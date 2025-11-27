import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { AdditionalFeatures } from "@/components/AdditionalFeatures";
import { Process } from "@/components/Process";
import { FAQs } from "@/components/FAQs";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <AdditionalFeatures />
        <Process />
        <FAQs />
        <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
