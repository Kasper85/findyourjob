import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/landing/SectionHeader";

const testimonials = [
  {
    quote:
      "Pasamos de tener entrevistas decepcionantes a contratar talento que entrega desde el día uno. El ranking IA es brutal.",
    name: "María Castillo",
    role: "Head of Engineering, Bloomline",
  },
  {
    quote:
      "Mi índice de empleabilidad me dijo exactamente qué estudiar. Conseguí oferta en 3 semanas.",
    name: "Diego R.",
    role: "Senior Backend Engineer",
  },
  {
    quote: "Los badges Zero Trust nos ahorran 4 rondas de filtros técnicos por candidato.",
    name: "Andrés Park",
    role: "CTO, Vault Networks",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader
          eyebrow="Testimonios"
          title="Lo que dicen quienes ya validan talento con nosotros"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
                <div className="h-9 w-9 rounded-full bg-muted grid place-items-center text-xs font-bold">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
