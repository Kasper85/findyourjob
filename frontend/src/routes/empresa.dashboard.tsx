import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/EmptyState";
import { MatchBadge } from "@/components/app/VerificationBadge";
import {
  postedVacancies,
  applicants,
  talentPool,
  interviews,
  companyAnalytics,
  company,
} from "@/lib/mock/company";
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Plus,
  Eye,
  UserCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/empresa/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard Empresa — Find Your Job" }] }),
  component: EmpresaDashboard,
});

function EmpresaDashboard() {
  const active = postedVacancies.filter((v) => v.status === "Activa");
  const topApplicants = applicants
    .map((a) => ({ ...a, cand: talentPool.find((c) => c.id === a.candidateId)! }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 4);
  const upcoming = interviews.filter((i) => i.status === "Programada").slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title={`Hola, ${company.recruiter.name.split(" ")[0]} 👋`}
        description={`Resumen de reclutamiento de ${company.name}.`}
      >
        <Button asChild variant="outline" size="sm">
          <Link to="/empresa/talento">Buscar talento</Link>
        </Button>
        <Button asChild size="sm">
          <Link to="/empresa/vacantes/nueva">
            <Plus className="h-3.5 w-3.5 mr-1" /> Nueva vacante
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Briefcase}
          label="Vacantes activas"
          value={companyAnalytics.activeVacancies.toString()}
          delta="+1 esta semana"
        />
        <MetricCard
          icon={Users}
          label="Aplicaciones"
          value={companyAnalytics.totalApplicants.toString()}
          delta="+24 últimos 7d"
        />
        <MetricCard
          icon={Sparkles}
          label="Match promedio"
          value={`${companyAnalytics.avgMatch}%`}
        />
        <MetricCard
          icon={Calendar}
          label="Time-to-hire"
          value={`${companyAnalytics.timeToHire}d`}
          delta="-3d vs promedio"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Top candidatos por match ponderado</h3>
              <p className="text-xs text-muted-foreground">
                Pre-cualificados con Zero Trust verificado
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/empresa/talento">
                Ver todos <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            {topApplicants.map((a) => {
              const vac = postedVacancies.find((v) => v.id === a.vacancyId);
              return (
                <Link
                  key={a.id}
                  to="/empresa/candidatos/$id"
                  params={{ id: a.cand.id }}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/40 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-mono font-bold text-xs flex-none">
                      {a.cand.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{a.cand.name}</p>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {a.stage}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {a.cand.title} · {vac?.title}
                      </p>
                    </div>
                    <MatchBadge match={a.match} size="sm" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Vacantes activas</h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/empresa/vacantes">Ver más</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {active.slice(0, 3).map((v) => (
                <Link key={v.id} to="/empresa/vacantes/$id" params={{ id: v.id }} className="block">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium truncate">{v.title}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {v.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {v.applicants}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="h-3 w-3 text-primary" /> {v.shortlisted}
                      </span>
                    </div>
                    <Progress
                      value={(v.shortlisted / Math.max(v.applicants, 1)) * 100}
                      className="h-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Próximas entrevistas</h3>
              <Button asChild variant="ghost" size="sm">
                <Link to="/empresa/entrevistas">Calendario</Link>
              </Button>
            </div>
            <ul className="space-y-3">
              {upcoming.map((i) => {
                const c = talentPool.find((t) => t.id === i.candidateId)!;
                return (
                  <li key={i.id} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center font-mono text-[10px] flex-none">
                      <div className="text-center leading-none">
                        <div className="text-[8px] uppercase">
                          {new Date(i.date).toLocaleDateString("es", { month: "short" })}
                        </div>
                        <div className="text-sm font-bold mt-0.5">{new Date(i.date).getDate()}</div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {i.time} · {i.type}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold">Funnel de contratación</h3>
            <p className="text-xs text-muted-foreground">Últimos 30 días</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/empresa/analitica">
              Ver analítica <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {companyAnalytics.funnel.map((s, i) => {
            const max = companyAnalytics.funnel[0].value;
            const pct = (s.value / max) * 100;
            return (
              <div key={s.stage} className="flex items-center gap-3">
                <div className="w-44 text-xs text-muted-foreground truncate">{s.stage}</div>
                <div className="flex-1 h-7 rounded-md bg-muted relative overflow-hidden">
                  <div
                    className="h-full bg-primary/80 rounded-md flex items-center pl-3 text-[11px] font-mono font-semibold text-primary-foreground"
                    style={{ width: `${pct}%` }}
                  >
                    {s.value}
                  </div>
                </div>
                <div className="w-12 text-right text-[11px] font-mono text-muted-foreground">
                  {i > 0 &&
                    `${Math.round((s.value / companyAnalytics.funnel[i - 1].value) * 100)}%`}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
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
    </Card>
  );
}
