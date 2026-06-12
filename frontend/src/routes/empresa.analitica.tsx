import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/EmptyState";
import { companyAnalytics, postedVacancies } from "@/lib/mock/company";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

export const Route = createFileRoute("/empresa/analitica")({
  head: () => ({ meta: [{ title: "Analítica — Empresa" }] }),
  component: Analitica,
});

function Analitica() {
  const maxWeekly = Math.max(...companyAnalytics.weeklyApplicants.map((w) => w.v));
  const totalVertical = companyAnalytics.verticalBreakdown.reduce((a, b) => a + b.value, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Analítica"
        description="Métricas de reclutamiento, conversión y rendimiento del matching."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Time-to-hire" value="18d" delta="-3d" up />
        <Stat label="Cost per hire" value="$840" delta="-$120" up />
        <Stat label="Calidad de match" value="84%" delta="+6%" up />
        <Stat label="Aceptación de oferta" value="78%" delta="-2%" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold">Aplicaciones por día</h3>
          <p className="text-xs text-muted-foreground">Últimos 7 días</p>
          <div className="mt-6 flex items-end gap-3 h-48">
            {companyAnalytics.weeklyApplicants.map((w) => (
              <div key={w.d} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[11px] font-mono text-muted-foreground">{w.v}</div>
                <div
                  className="w-full bg-primary/20 rounded-t-md relative"
                  style={{ height: `${(w.v / maxWeekly) * 100}%` }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-full bg-primary rounded-t-md opacity-80" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {w.d}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Por vertical</h3>
          <div className="mt-5 space-y-3">
            {companyAnalytics.verticalBreakdown.map((v) => (
              <div key={v.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span>{v.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {Math.round((v.value / totalVertical) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(v.value / totalVertical) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold">Funnel global</h3>
            <p className="text-xs text-muted-foreground">Conversión por etapa</p>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
          >
            <Sparkles className="h-3 w-3 mr-1" /> Matching reduce -42% el ruido
          </Badge>
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

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Rendimiento por vacante</h3>
        <div className="space-y-3">
          {postedVacancies
            .filter((v) => v.status === "Activa")
            .map((v) => (
              <div
                key={v.id}
                className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center border-b border-border last:border-0 pb-3 last:pb-0"
              >
                <div className="col-span-2">
                  <p className="text-sm font-medium truncate">{v.title}</p>
                  <p className="text-[11px] text-muted-foreground">{v.vertical}</p>
                </div>
                <Mini label="Vistas" value={v.views} />
                <Mini label="Aplicaciones" value={v.applicants} />
                <Mini
                  label="Conversión"
                  value={`${Math.round((v.shortlisted / v.applicants) * 100)}%`}
                  primary
                />
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  up,
}: {
  label: string;
  value: string;
  delta: string;
  up?: boolean;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold">{value}</p>
      <p
        className={`mt-1 text-[10px] font-mono inline-flex items-center gap-0.5 ${up ? "text-primary" : "text-destructive"}`}
      >
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {delta}
      </p>
    </Card>
  );
}

function Mini({
  label,
  value,
  primary,
}: {
  label: string;
  value: string | number;
  primary?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
        {label}
      </p>
      <p className={`font-mono text-sm font-semibold ${primary ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}
