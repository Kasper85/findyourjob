import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/EmptyState";
import { edgeChallenges } from "@/lib/mock/extra";
import { Cpu, Clock, Sparkles, Shield, Fingerprint, Zap, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/app/challenges")({
  head: () => ({ meta: [{ title: "Challenges técnicos — Find Your Job" }] }),
  component: Page,
});

const statusStyle: Record<string, string> = {
  Disponible: "border-primary/40 text-primary bg-primary/10",
  "En progreso": "border-warning/40 text-warning bg-warning/10",
  Completado: "border-border text-muted-foreground bg-muted",
  Expirado: "border-destructive/40 text-destructive bg-destructive/10",
};

function Page() {
  const available = edgeChallenges.filter((c) => c.status === "Disponible");
  const completed = edgeChallenges.filter((c) => c.status === "Completado");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Challenges técnicos"
        description="Micro-retos técnicos generados dinámicamente. Únicos para tu perfil, imposibles de copiar."
      />

      <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <Feature
            icon={Cpu}
            title="Challenge técnico"
            desc="El reto se genera en el borde, no en el servidor central."
          />
          <Feature
            icon={Fingerprint}
            title="Seed único"
            desc="Cada reto se firma con un identificador irrepetible."
          />
          <Feature
            icon={Shield}
            title="Anti-fraude"
            desc="Imposible compartir respuestas: cada candidato recibe variantes distintas."
          />
        </div>
      </Card>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Disponibles para ti</h2>
          <Badge variant="outline" className="font-mono text-[10px]">
            {available.length} retos activos
          </Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {available.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Generado {c.generatedAt}
                  </p>
                  <h3 className="mt-1 font-semibold">{c.topic}</h3>
                  <div className="mt-1.5 flex gap-1.5 flex-wrap">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {c.vertical}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {c.level}
                    </Badge>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-md border text-[10px] font-mono ${statusStyle[c.status]}`}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">{c.description}</p>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {c.durationMin} min
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Fingerprint className="h-3 w-3" /> {c.uniqueSeed}
                  </span>
                </div>
                <Button size="sm">
                  <Zap className="h-3 w-3 mr-1" /> Iniciar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {completed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Historial</h2>
          </div>
          <Card className="divide-y divide-border">
            {completed.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm">{c.topic}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {c.uniqueSeed} · {c.generatedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {c.level}
                  </Badge>
                  <span className="font-mono text-lg font-bold text-primary">{c.score}/100</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="h-9 w-9 rounded-md bg-primary/15 text-primary grid place-items-center flex-none">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
