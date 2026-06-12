import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/EmptyState";
import { roiData } from "@/lib/mock/extra";
import { TrendingDown, TrendingUp, DollarSign, Clock, Award, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/empresa/roi")({
  head: () => ({ meta: [{ title: "ROI Empresarial — Find Your Job" }] }),
  component: Page,
});

function Page() {
  const r = roiData;
  const timeReduction = Math.round(
    ((r.timeToHire.industry - r.timeToHire.fyj) / r.timeToHire.industry) * 100,
  );
  const costReduction = Math.round(
    ((r.costPerHire.industry - r.costPerHire.fyj) / r.costPerHire.industry) * 100,
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="ROI Empresarial"
        description="Impacto medible de Find Your Job en tu organización vs. benchmarks de industria."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          icon={Clock}
          label="Time-to-hire"
          value={`${r.timeToHire.fyj} días`}
          delta={`-${timeReduction}%`}
          positive
          detail={`Industria: ${r.timeToHire.industry} días`}
        />
        <KPI
          icon={DollarSign}
          label="Cost-per-hire"
          value={`$${r.costPerHire.fyj.toLocaleString()}`}
          delta={`-${costReduction}%`}
          positive
          detail={`Industria: $${r.costPerHire.industry.toLocaleString()}`}
        />
        <KPI
          icon={Award}
          label="Quality of hire"
          value={`${r.qualityOfHire.fyj}/10`}
          delta={`+${(r.qualityOfHire.fyj - r.qualityOfHire.industry).toFixed(1)}`}
          positive
          detail={`Industria: ${r.qualityOfHire.industry}/10`}
        />
        <KPI
          icon={Users}
          label="Early attrition"
          value={`${r.earlyAttrition.fyj}%`}
          delta={`-${r.earlyAttrition.industry - r.earlyAttrition.fyj}pp`}
          positive
          detail={`Industria: ${r.earlyAttrition.industry}%`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Time-to-hire por trimestre</h3>
          <div className="space-y-3">
            {r.hireQuarter.map((q) => {
              const max = Math.max(...r.hireQuarter.flatMap((x) => [x.fyj, x.industry]));
              return (
                <div key={q.q}>
                  <p className="text-xs font-mono text-muted-foreground mb-1">{q.q}</p>
                  <div className="space-y-1">
                    <Bar label="FYJ" value={q.fyj} max={max} accent />
                    <Bar label="Industria" value={q.industry} max={max} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Eficiencia del funnel</h3>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span>Find Your Job</span>
              <span className="font-mono text-primary font-bold">{r.funnelEfficiency.fyj}%</span>
            </div>
            <Progress value={r.funnelEfficiency.fyj} className="h-2 mt-1" />
          </div>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span>Industria</span>
              <span className="font-mono text-muted-foreground">
                {r.funnelEfficiency.industry}%
              </span>
            </div>
            <Progress value={r.funnelEfficiency.industry} className="h-2 mt-1 opacity-60" />
          </div>
          <div className="pt-4 border-t border-border space-y-3">
            <Highlight
              icon={Clock}
              value={`${r.savings.hours} h`}
              label="Ahorro de tiempo del equipo este trimestre"
            />
            <Highlight
              icon={DollarSign}
              value={`$${r.savings.money.toLocaleString()}`}
              label="Ahorro económico estimado vs. industria"
            />
            <Highlight icon={Zap} value={`${r.csat}%`} label="CSAT de hiring managers" />
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-primary/5 border-primary/30">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Resumen ejecutivo
        </p>
        <p className="mt-2 text-lg leading-relaxed">
          Find Your Job reduce tu tiempo de contratación en{" "}
          <span className="text-primary font-bold">{timeReduction}%</span>, baja el costo por
          contratación en <span className="text-primary font-bold">{costReduction}%</span> y eleva
          la calidad de contratación a{" "}
          <span className="text-primary font-bold">{r.qualityOfHire.fyj}/10</span>, con una rotación
          temprana de solo <span className="text-primary font-bold">{r.earlyAttrition.fyj}%</span>.
        </p>
      </Card>
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  delta,
  positive,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  detail: string;
}) {
  const Trend = positive ? TrendingDown : TrendingUp;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <Badge
          variant="outline"
          className={`font-mono text-[10px] ${positive ? "border-primary/40 text-primary bg-primary/10" : "border-warning/40 text-warning bg-warning/10"}`}
        >
          <Trend className="h-3 w-3 mr-1" /> {delta}
        </Badge>
      </div>
      <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{detail}</p>
    </Card>
  );
}

function Bar({
  label,
  value,
  max,
  accent,
}: {
  label: string;
  value: number;
  max: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono w-16 text-muted-foreground">{label}</span>
      <div className="flex-1 h-4 bg-muted rounded relative overflow-hidden">
        <div
          className={`h-full ${accent ? "bg-primary" : "bg-muted-foreground/40"}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-xs font-mono w-12 text-right">{value}d</span>
    </div>
  );
}

function Highlight({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary flex-none" />
      <div className="min-w-0">
        <p className="font-mono font-bold text-primary">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
