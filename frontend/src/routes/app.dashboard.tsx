import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmployabilityGauge } from "@/components/app/EmployabilityGauge";
import { VerificationBadge } from "@/components/app/VerificationBadge";
import { JobCard } from "@/components/app/JobCard";
import { PageHeader } from "@/components/app/EmptyState";
import { getRecommendations } from "@/lib/api/matching";
import type { RecommendationItem } from "@/lib/api/types";
import {
  jobs,
  user,
  certifications,
  evalHistory,
  learningPath,
  applications,
} from "@/lib/mock/data";
import {
  ArrowRight,
  Briefcase,
  Award,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Find Your Job" }] }),
  component: Dashboard,
});

function Dashboard() {
  const top = jobs.slice(0, 3);
  const next = learningPath.slice(0, 3);
  const [recs, setRecs] = useState<RecommendationItem[]>([]);
  useEffect(() => {
    getRecommendations({ limit: "3" })
      .then((r) => setRecs(r.data))
      .catch(() => {});
  }, []);
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Hola, ${user.name.split(" ")[0]} 👋`}
        description="Este es el estado de tu carrera tech hoy."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-10 [background:radial-gradient(circle_at_80%_30%,var(--color-primary),transparent_60%)]" />
          <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
            <EmployabilityGauge value={user.employabilityIndex} />
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-mono uppercase tracking-widest text-primary">
                  Índice de empleabilidad
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold">Estás en el top 25% de tu campo</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Completa 1 evaluación más y verifica tu identidad para subir a 85+ y desbloquear
                vacantes Lead.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/app/evaluaciones">
                    Hacer evaluación <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/app/perfil/editar">Mejorar perfil</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Verificación Zero Trust
          </p>
          <div className="mt-3">
            <VerificationBadge level={user.verification} size="lg" />
          </div>
          <ul className="mt-5 space-y-2.5 text-sm">
            <CheckItem ok label="Email verificado" />
            <CheckItem ok label="CV analizado con señales verificables" />
            <CheckItem ok label="1 evaluación aprobada" />
            <CheckItem label="Verificación de identidad" />
            <CheckItem label="3+ evaluaciones aprobadas" />
          </ul>
          <Button asChild variant="outline" size="sm" className="mt-5 w-full">
            <Link to="/app/configuracion">Subir nivel</Link>
          </Button>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Briefcase}
          label="Vacantes compatibles"
          value={jobs.filter((j) => j.match >= 70).length.toString()}
          delta="+3 esta semana"
        />
        <MetricCard
          icon={Award}
          label="Certificaciones"
          value={certifications.length.toString()}
          delta="+1 este mes"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Evaluaciones aprobadas"
          value={`${evalHistory.filter((e) => e.passed).length}/${evalHistory.length}`}
        />
        <MetricCard icon={BookOpen} label="Aprendizaje" value="32%" progress={32} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Vacantes recomendadas para ti</h3>
              <p className="text-xs text-muted-foreground">
                Ordenadas por compatibilidad semántica
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/vacantes">
                Ver todas <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3">
            {top.map((j) => (
              <JobCard key={j.id} job={j as unknown as import("@/lib/api/types").Job} />
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Próximos pasos</h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/app/learning">Ver más</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {next.map((l) => (
                <div key={l.id} className="flex items-start gap-3 text-sm">
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary grid place-items-center flex-none">
                    {l.type === "Curso" ? (
                      <BookOpen className="h-4 w-4" />
                    ) : l.type === "Evaluación" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Award className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{l.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {l.type} · {l.skill}
                    </p>
                    {l.progress > 0 && <Progress value={l.progress} className="h-1 mt-1.5" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold">Actividad reciente</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {applications.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.jobTitle}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {a.company} · {a.appliedAt}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {a.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          {recs.length > 0 && (
            <Card className="p-6 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recomendaciones</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/app/vacantes">Ver todas</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {recs.map((r) => (
                  <Link key={r.job.id} to="/app/vacantes/$id" params={{ id: r.job.id }}>
                    <div className="flex items-center justify-between gap-3 p-3 rounded-md hover:bg-muted/40">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{r.job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.job.location ?? "Remoto"}
                        </p>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {Math.round(
                          r.match.skills * 0.5 +
                            r.match.evaluations * 0.25 +
                            r.match.experience * 0.15 +
                            r.match.certifications * 0.1,
                        )}
                        %
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckItem({ ok, label }: { ok?: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "" : "text-muted-foreground"}`}>
      <div
        className={`h-4 w-4 rounded-full grid place-items-center ${ok ? "bg-primary text-primary-foreground" : "bg-muted border border-border"}`}
      >
        {ok && <Check className="h-3 w-3" />}
      </div>
      <span>{label}</span>
    </li>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  progress,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  progress?: number;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {delta && (
          <span className="text-[10px] font-mono text-primary flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-3xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {progress !== undefined && <Progress value={progress} className="h-1 mt-3" />}
    </Card>
  );
}
