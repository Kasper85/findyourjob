import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, X } from "lucide-react";
import type { MatchFactor } from "@/lib/mock/extra";

export function MatchBreakdown({
  total,
  factors,
  matched,
  missing,
  audience = "candidate",
  signal,
}: {
  total: number;
  factors: MatchFactor[];
  matched: string[];
  missing: string[];
  audience?: "candidate" | "recruiter";
  signal?: string;
}) {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {audience === "candidate"
              ? "¿Por qué obtuve este match?"
              : "¿Por qué recomendamos este candidato?"}
          </p>
          <h3 className="mt-1 text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> Explicabilidad del match
          </h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-4xl font-bold text-primary leading-none">{total}%</p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
            Match total
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{f.label}</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  peso {f.weight}%
                </Badge>
              </div>
              <span className="font-mono font-semibold">{f.score}%</span>
            </div>
            <Progress value={f.score} className="mt-1.5 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{f.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Skills coincidentes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 text-primary px-2 py-0.5 text-xs font-mono"
              >
                <Check className="h-3 w-3" /> {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Brechas detectadas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missing.length === 0 && <span className="text-xs text-muted-foreground">Ninguna</span>}
            {missing.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-md border border-warning/40 bg-warning/10 text-warning px-2 py-0.5 text-xs font-mono"
              >
                <X className="h-3 w-3" /> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {signal && (
        <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-xs text-primary font-mono">
          {signal}
        </div>
      )}
    </Card>
  );
}
