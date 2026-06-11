import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/landing/SectionHeader";

const steps = [
  {
    n: "01",
    title: "Sube tu CV",
    desc: "La IA analiza skills, experiencia y educación. Detecta vacíos.",
  },
  {
    n: "02",
    title: "Valida competencias",
    desc: "Evaluaciones en vivo: opción múltiple, código real, casos prácticos.",
  },
  {
    n: "03",
    title: "Obtén badges Zero Trust",
    desc: "Certificaciones verificables públicamente que viven en tu perfil.",
  },
  {
    n: "04",
    title: "Aplica con match alto",
    desc: "Postula a vacantes donde realmente tienes posibilidades reales.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader
          eyebrow="Cómo funciona"
          title="De CV anónimo a talento verificado en 4 pasos"
        />
        <div className="mt-12 grid gap-px bg-border md:grid-cols-4 rounded-lg overflow-hidden border border-border">
          {steps.map((s, i) => (
            <div key={s.n} className="bg-background p-6 relative">
              <span className="font-mono text-xs text-primary font-semibold">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 h-4 w-4 text-muted-foreground bg-background" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
