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
      { title: "Find Your Job — Talento tech verificado con IA" },
      {
        name: "description",
        content:
          "Reclutamiento inteligente para Tech, Ciberseguridad, Fintech y Telco. Match semántico con NLP, evaluaciones técnicas y certificaciones Zero Trust.",
      },
      { property: "og:title", content: "Find Your Job — Talento tech verificado con IA" },
      {
        property: "og:description",
        content: "Reclutamiento inteligente con IA, match semántico y validación Zero Trust.",
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
