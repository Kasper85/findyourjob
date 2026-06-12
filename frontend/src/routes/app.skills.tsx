import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/EmptyState";
import { skillMap } from "@/lib/mock/extra";
import { ShieldCheck, Circle } from "lucide-react";

export const Route = createFileRoute("/app/skills")({
  head: () => ({ meta: [{ title: "Mapa de Habilidades — Find Your Job" }] }),
  component: SkillsPage,
});

function SkillsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Mapa de Habilidades"
        description="Visualización de tu perfil técnico por dominio. El sistema compara nivel actual vs verificado."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Radar técnico</h3>
          <RadarChart categories={skillMap} />
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" /> Nivel actual
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary/30" /> Verificado
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Resumen por dominio</h3>
          <div className="space-y-4">
            {skillMap.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {c.level}% · <span className="text-primary">{c.verified}% verificado</span>
                  </span>
                </div>
                <div className="relative h-2 rounded-full bg-muted mt-1.5 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/30"
                    style={{ width: `${c.level}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: `${c.verified}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillMap.map((c) => (
          <Card key={c.name} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{c.name}</h4>
              <Badge variant="outline" className="font-mono text-[10px]">
                {c.level}%
              </Badge>
            </div>
            <ul className="space-y-2">
              {c.skills.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {s.verified ? (
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span>{s.name}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{s.level}</span>
                </li>
              ))}
            </ul>
            <Progress value={c.level} className="mt-3 h-1" />
          </Card>
        ))}
      </div>
    </div>
  );
}

function RadarChart({
  categories,
}: {
  categories: { name: string; level: number; verified: number }[];
}) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const n = categories.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, value: number) => {
    const a = angle(i);
    const rad = (r * value) / 100;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  };

  const levelPath =
    categories
      .map((c, i) => point(i, c.level))
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
      .join(" ") + " Z";
  const verifiedPath =
    categories
      .map((c, i) => point(i, c.verified))
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
      .join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
      {[20, 40, 60, 80, 100].map((p) => (
        <polygon
          key={p}
          points={categories.map((_, i) => point(i, p).join(",")).join(" ")}
          fill="none"
          stroke="oklch(0.3 0 0)"
          strokeWidth="0.5"
        />
      ))}
      {categories.map((_, i) => {
        const [x, y] = point(i, 100);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="oklch(0.3 0 0)" strokeWidth="0.5" />
        );
      })}
      <path
        d={levelPath}
        fill="oklch(0.7 0.18 150 / 0.15)"
        stroke="oklch(0.7 0.18 150 / 0.5)"
        strokeWidth="1.5"
      />
      <path
        d={verifiedPath}
        fill="oklch(0.7 0.18 150 / 0.45)"
        stroke="oklch(0.7 0.18 150)"
        strokeWidth="2"
      />
      {categories.map((c, i) => {
        const [x, y] = point(i, 115);
        return (
          <text
            key={c.name}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground"
            style={{ fontSize: 11, fontFamily: "ui-monospace, monospace" }}
          >
            {c.name}
          </text>
        );
      })}
    </svg>
  );
}
