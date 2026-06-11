import { Cpu, ShieldAlert, Banknote, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/landing/SectionHeader";

const items = [
  { icon: Cpu, title: "Tech", desc: "Backend, full-stack, ML, data, DevOps." },
  { icon: ShieldAlert, title: "Ciberseguridad", desc: "Pentesting, SecOps, Cloud Security." },
  { icon: Banknote, title: "Fintech", desc: "Pagos, banca digital, criptoactivos." },
  { icon: Radio, title: "Telco", desc: "Redes, 5G, infraestructura crítica." },
];

export function UseCasesSection() {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader eyebrow="Casos de uso" title="Especializados en industrias críticas" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <Card key={i.title} className="p-6 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center">
                <i.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{i.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{i.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
