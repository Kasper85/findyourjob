import { Eye, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/landing/SectionHeader";

const levels = [
  {
    name: "No verificado",
    desc: "Sólo CV cargado",
    color: "bg-muted text-muted-foreground",
    icon: Eye,
  },
  {
    name: "Parcialmente verificado",
    desc: "Email + 1 evaluación + 1 cert",
    color: "bg-warning/15 text-warning border-warning/40",
    icon: ShieldCheck,
  },
  {
    name: "100% verificado",
    desc: "Identidad + 3+ evaluaciones + certs",
    color: "bg-primary/15 text-primary border-primary/40",
    icon: ShieldCheck,
  },
];

export function ZeroTrustSection() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <SectionHeader eyebrow="Zero Trust" title="Validamos antes de que postules" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Nada se asume. Cada skill, certificación y experiencia pasa por validación antes de
          aparecer ante un reclutador.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {levels.map((l, i) => (
            <Card
              key={l.name}
              className={`p-6 border-2 ${i === 2 ? "border-primary/40" : "border-border"}`}
            >
              <div
                className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-mono ${l.color}`}
              >
                <l.icon className="h-3.5 w-3.5" /> Nivel {i + 1}
              </div>
              <h3 className="mt-4 font-semibold">{l.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{l.desc}</p>
              <div className="mt-4 flex gap-1">
                {[0, 1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full ${s <= i ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
