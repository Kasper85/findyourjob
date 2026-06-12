import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustedCompanies } from "@/components/landing/TrustedCompanies";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { AISection } from "@/components/landing/AISection";
import { ZeroTrustSection } from "@/components/landing/ZeroTrustSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { ForCompaniesSection } from "@/components/landing/ForCompaniesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Find Your Job — Talento tech verificado con señales verificables" },
      {
        name: "description",
        content:
          "Reclutamiento inteligente para Tech, Ciberseguridad, Fintech y Telco. Matching ponderado explicable, evaluaciones técnicas y certificaciones Zero Trust.",
      },
      {
        property: "og:title",
        content: "Find Your Job — Talento tech verificado con señales verificables",
      },
      {
        property: "og:description",
        content:
          "Reclutamiento inteligente con señales verificables, matching ponderado y validación Zero Trust.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <HeroSection />
      <TrustedCompanies />
      <BenefitsSection />
      <HowItWorksSection />
      <AISection />
      <ZeroTrustSection />
      <UseCasesSection />
      <ForCompaniesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <LandingFooter />
    </div>
  );
}
