import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Building2, User } from "lucide-react";

export const Route = createFileRoute("/precios")({
  head: () => ({
    meta: [
      { title: "Precios — Find Your Job" },
      {
        name: "description",
        content:
          "Planes para candidatos (Freemium y Pro) y empresas (SaaS mensual, anual y Success Fee).",
      },
      { property: "og:title", content: "Precios — Find Your Job" },
      { property: "og:description", content: "Planes para candidatos y empresas. Empieza gratis." },
    ],
  }),
  component: Pricing,
});

const b2c = [
  {
    name: "Free",
    price: "$0",
    desc: "Empieza a verificarte",
    features: [
      "Perfil profesional",
      "Análisis CV con IA",
      "1 evaluación / mes",
      "Vacantes públicas",
    ],
    cta: "Crear cuenta",
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    per: "/mes",
    desc: "Talento que destaca",
    features: [
      "Evaluaciones ilimitadas",
      "Learning path completo",
      "Insights de carrera",
      "Vacantes premium",
      "Soporte prioritario",
    ],
    cta: "Empezar Pro",
    featured: true,
  },
  {
    name: "Pay per Cert",
    price: "$29",
    per: "/cert",
    desc: "Sólo certificaciones",
    features: ["Pagas sólo lo que certificas", "Badge verificable público", "Sin suscripción"],
    cta: "Ver certificaciones",
    featured: false,
  },
];
const b2b = [
  {
    name: "Starter",
    price: "$199",
    per: "/mes",
    desc: "Equipos pequeños",
    features: [
      "5 vacantes activas",
      "Buscador de talento",
      "100 perfiles desbloqueables/mes",
      "Ranking IA",
    ],
    cta: "Empezar",
    featured: false,
  },
  {
    name: "Growth",
    price: "$599",
    per: "/mes",
    desc: "Empresas en escala",
    features: [
      "Vacantes ilimitadas",
      "Perfiles ilimitados",
      "Analítica avanzada",
      "Integración ATS",
      "Soporte dedicado",
    ],
    cta: "Hablar con ventas",
    featured: true,
  },
  {
    name: "Success Fee",
    price: "12%",
    per: "por contratación",
    desc: "Sin riesgo inicial",
    features: [
      "Sin mensualidad",
      "Pagas sólo si contratas",
      "Garantía 90 días",
      "Onboarding incluido",
    ],
    cta: "Agendar demo",
    featured: false,
  },
];

function Pricing() {
  const [billing, setBilling] = useState<"mensual" | "anual">("mensual");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-mono uppercase tracking-widest text-primary">Precios</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
              Planes simples. Resultados verificados.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Empieza gratis. Escala cuando lo necesites.
            </p>
          </div>

          <Tabs defaultValue="candidato" className="mt-10">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <TabsList>
                <TabsTrigger value="candidato">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  Candidato
                </TabsTrigger>
                <TabsTrigger value="empresa">
                  <Building2 className="h-3.5 w-3.5 mr-1.5" />
                  Empresa
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-1 text-xs">
                <button
                  onClick={() => setBilling("mensual")}
                  className={`px-3 py-1.5 rounded ${billing === "mensual" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setBilling("anual")}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 ${billing === "anual" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  Anual{" "}
                  <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0">
                    -20%
                  </Badge>
                </button>
              </div>
            </div>

            <TabsContent value="candidato" className="mt-10">
              <PriceGrid plans={b2c} />
            </TabsContent>
            <TabsContent value="empresa" className="mt-10">
              <PriceGrid plans={b2b} />
            </TabsContent>
          </Tabs>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Todos los planes incluyen Zero Trust, badges verificables y soporte por email.
          </p>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}

function PriceGrid({ plans }: { plans: typeof b2c }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
      {plans.map((p) => (
        <Card
          key={p.name}
          className={`p-6 relative ${p.featured ? "border-primary shadow-lg shadow-primary/10" : ""}`}
        >
          {p.featured && (
            <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground">
              Más popular
            </Badge>
          )}
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {p.name}
          </p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-bold">{p.price}</span>
            {p.per && <span className="text-sm text-muted-foreground">{p.per}</span>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2">
                <Check className="h-4 w-4 text-primary flex-none mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 w-full" variant={p.featured ? "default" : "outline"}>
            <Link to="/auth/register">{p.cta}</Link>
          </Button>
        </Card>
      ))}
    </div>
  );
}
