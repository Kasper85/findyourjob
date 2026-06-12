import { Link } from "@tanstack/react-router";
import { Users, Zap, BarChart3, Lock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/landing/SectionHeader";

const items = [
  {
    icon: Users,
    title: "Talento pre-validado",
    desc: "Sólo recibes candidatos que pasaron evaluaciones técnicas reales.",
  },
  {
    icon: Zap,
    title: "Ranking por match",
    desc: "Ordena tu pipeline por compatibilidad semántica con la vacante.",
  },
  {
    icon: BarChart3,
    title: "Menor tiempo de selección",
    desc: "Reduce 60% el time-to-hire eliminando candidatos no calificados.",
  },
  {
    icon: Lock,
    title: "Zero Trust",
    desc: "Cada credencial es verificable públicamente. Cero CV inflados.",
  },
];

export function ForCompaniesSection() {
  return (
    <section id="empresas" className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader eyebrow="Para empresas" title="Contrata sin sorpresas técnicas" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((b) => (
            <Card key={b.title} className="p-6 hover:border-primary/40 transition-colors group">
              <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="outline" className="font-semibold">
            <Link to="/auth/register">
              Crear cuenta de empresa <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
