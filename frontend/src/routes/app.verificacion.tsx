import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/EmptyState";
import { VerificationBadge } from "@/components/app/VerificationBadge";
import { zeroTrustRequirements } from "@/lib/mock/extra";
import { CheckCircle2, Circle, ShieldCheck, Lock } from "lucide-react";

export const Route = createFileRoute("/app/verificacion")({
  head: () => ({ meta: [{ title: "Verificación Zero Trust — Find Your Job" }] }),
  component: Page,
});

function Page() {
  const totalWeight = zeroTrustRequirements.reduce((a, r) => a + r.weight, 0);
  const earned = zeroTrustRequirements.filter((r) => r.done).reduce((a, r) => a + r.weight, 0);
  const pct = Math.round((earned / totalWeight) * 100);
  const level: "none" | "partial" | "full" = pct >= 100 ? "full" : pct >= 60 ? "partial" : "none";
  const pending = zeroTrustRequirements.filter((r) => !r.done);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Verificación Zero Trust"
        description="Cuanto más verificado tu perfil, más vacantes premium desbloqueas y mayor confianza generan las empresas."
      />

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Tu estado actual</h2>
            </div>
            <VerificationBadge level={level} size="lg" />
            <p className="text-sm text-muted-foreground max-w-md">
              Completa los pasos restantes para alcanzar el nivel{" "}
              <span className="text-primary font-semibold">100% Verificado</span> y aparecer en el
              Top Talento Verificado de las empresas.
            </p>
          </div>
          <div className="md:w-72">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso Zero Trust</span>
              <span className="font-mono font-bold text-primary text-lg">{pct}%</span>
            </div>
            <Progress value={pct} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              {zeroTrustRequirements.filter((r) => r.done).length} de {zeroTrustRequirements.length}{" "}
              requisitos completados
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <LevelCard
          active={pct < 60}
          done={false}
          title="No Verificado"
          desc="Acceso básico a la plataforma. Visibilidad limitada para empresas."
          min="0%"
        />
        <LevelCard
          active={pct >= 60 && pct < 100}
          done={pct >= 60}
          title="Parcialmente Verificado"
          desc="Apareces en búsquedas. Match elevado en vacantes Junior y Semi-Senior."
          min="60%"
        />
        <LevelCard
          active={pct >= 100}
          done={pct >= 100}
          title="100% Verificado"
          desc="Top Talento. Acceso a vacantes premium, success fee y ofertas confidenciales."
          min="100%"
          premium
        />
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Checklist de requisitos</h3>
        <ul className="divide-y divide-border">
          {zeroTrustRequirements.map((r) => (
            <li key={r.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {r.done ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-none" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-none" />
                )}
                <span className={r.done ? "text-sm" : "text-sm font-medium"}>{r.label}</span>
              </div>
              <div className="flex items-center gap-3 flex-none">
                <Badge variant="outline" className="font-mono text-[10px]">
                  +{r.weight} pts
                </Badge>
                {!r.done && (
                  <Button size="sm" variant="outline">
                    Completar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {pending.length > 0 && (
        <Card className="p-6 bg-warning/5 border-warning/30">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-warning flex-none mt-0.5" />
            <div>
              <h3 className="font-semibold">Próximo paso recomendado</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {pending[0].label} — sumaría{" "}
                <span className="text-warning font-mono font-bold">+{pending[0].weight} pts</span> a
                tu nivel Zero Trust.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link to="/app/empleabilidad">Ver plan completo</Link>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function LevelCard({
  active,
  done,
  title,
  desc,
  min,
  premium,
}: {
  active: boolean;
  done: boolean;
  title: string;
  desc: string;
  min: string;
  premium?: boolean;
}) {
  return (
    <Card
      className={`p-5 ${active ? "border-primary ring-1 ring-primary/40" : ""} ${premium ? "bg-primary/5" : ""}`}
    >
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`font-mono text-[10px] ${done ? "border-primary/40 text-primary bg-primary/10" : ""}`}
        >
          {min}
        </Badge>
        {active && <Badge className="font-mono text-[10px]">Actual</Badge>}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </Card>
  );
}
