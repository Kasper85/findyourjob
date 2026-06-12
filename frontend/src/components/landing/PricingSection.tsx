import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/landing/SectionHeader";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Empieza a verificarte",
    features: [
      "Perfil profesional",
      "Análisis CV con señales verificables",
      "1 evaluación / mes",
      "Match con vacantes públicas",
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

export function PricingSection() {
  return (
    <section id="precios" className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader
          eyebrow="Planes y precios"
          title="Comienza gratis, paga sólo cuando creces"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
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
        <div className="mt-8 text-center text-sm text-muted-foreground">
          ¿Eres empresa?{" "}
          <Link to="/precios" className="text-primary font-semibold hover:underline">
            Ver planes B2B →
          </Link>
        </div>
      </div>
    </section>
  );
}
