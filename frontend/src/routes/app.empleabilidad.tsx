import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/EmptyState";
import { EmployabilityGauge } from "@/components/app/EmployabilityGauge";
import { employability } from "@/lib/mock/extra";
import {
  TrendingUp,
  Trophy,
  AlertTriangle,
  Sparkles,
  ArrowUp,
  GraduationCap,
  Award,
  UserCircle,
  Cpu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/app/empleabilidad")({
  head: () => ({ meta: [{ title: "Centro de Empleabilidad — Find Your Job" }] }),
  component: Page,
});

const kindIcon = {
  skill: GraduationCap,
  cert: Award,
  profile: UserCircle,
  challenge: Cpu,
} as const;

function Page() {
  const e = employability;
  const delta = e.score - e.previousScore;
  const max = Math.max(...e.history.map((h) => h.score));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Centro de Empleabilidad"
        description="¿Por qué no consigo más entrevistas? El sistema compara tu perfil contra miles de vacantes activas."
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center">
          <EmployabilityGauge value={e.score} size={220} />
          <div className="mt-4 flex items-center gap-2 text-sm text-primary font-mono">
            <ArrowUp className="h-4 w-4" /> +{delta} pts vs mes anterior
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2 space-y-5">
          <Metric
            icon={TrendingUp}
            label="Probabilidad de recibir entrevista"
            value={`${e.interviewProbability}%`}
            detail="Basado en tu match promedio con vacantes activas."
          />
          <Metric
            icon={Trophy}
            label="Percentil entre candidatos similares"
            value={`Top ${100 - e.percentile}%`}
            detail={`Mejor que el ${e.percentile}% de perfiles con tu seniority y stack.`}
          />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Tendencia histórica
            </p>
            <div className="flex items-end gap-2 h-24">
              {e.history.map((h) => (
                <div key={h.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full rounded-t bg-primary/70"
                    style={{ height: `${(h.score / max) * 100}%` }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground">{h.month}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Fortalezas</h3>
          </div>
          <ul className="space-y-3">
            {e.strengths.map((s) => (
              <li
                key={s.label}
                className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.detail}</p>
                </div>
                {s.verified && (
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
                  >
                    Verificada
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="font-semibold">Debilidades</h3>
          </div>
          <ul className="space-y-3">
            {e.weaknesses.map((w) => (
              <li
                key={w.label}
                className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{w.label}</p>
                  <p className="text-xs text-muted-foreground">{w.detail}</p>
                </div>
                {w.critical && (
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] border-warning/40 text-warning bg-warning/10"
                  >
                    Crítica
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Plan de impacto recomendado por señales</h3>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            Priorizado por impacto
          </Badge>
        </div>
        <div className="space-y-3">
          {e.recommendations.map((r) => {
            const Icon = kindIcon[r.kind];
            return (
              <div
                key={r.id}
                className="rounded-lg border border-border p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center flex-none">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{r.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {r.reason} · {r.effort}
                  </p>
                  <Progress value={Math.min(r.impact * 5, 100)} className="mt-2 h-1.5" />
                </div>
                <div className="text-right flex-none">
                  <p className="font-mono text-2xl font-bold text-primary leading-none">
                    +{r.impact}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    pts
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="flex-none">
                  <Link
                    to={
                      r.kind === "cert"
                        ? "/app/certificaciones/catalogo"
                        : r.kind === "challenge"
                          ? "/app/challenges"
                          : r.kind === "profile"
                            ? "/app/perfil"
                            : "/app/aprendizaje"
                    }
                  >
                    Activar
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center flex-none">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="font-mono text-xl font-bold mt-0.5">{value}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
