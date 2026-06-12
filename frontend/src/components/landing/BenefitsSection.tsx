import { BarChart3, Briefcase, ShieldCheck, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/landing/SectionHeader";

const benefits = [
  {
    icon: BarChart3,
    title: "Índice de empleabilidad",
    desc: "Sabe exactamente qué te falta para conseguir el trabajo que quieres.",
  },
  {
    icon: Briefcase,
    title: "Matching ponderado real",
    desc: "Comparación NLP entre tus skills y cada vacante, no keywords.",
  },
  {
    icon: ShieldCheck,
    title: "Certificaciones verificables",
    desc: "Badges públicos firmados que comprueban competencias reales.",
  },
  {
    icon: GraduationCap,
    title: "Plan de aprendizaje personalizado",
    desc: "Aprende justo lo que te falta para aplicar a más vacantes.",
  },
];

export function BenefitsSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader eyebrow="Para candidatos" title="Construye una carrera tech con evidencia" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <Card key={b.title} className="p-6 hover:border-primary/40 transition-colors group">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
