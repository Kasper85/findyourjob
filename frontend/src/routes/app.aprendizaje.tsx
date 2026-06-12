import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/EmptyState";
import { learningMarketplace } from "@/lib/mock/extra";
import { useState } from "react";
import { Star, Clock, TrendingUp, Briefcase, ExternalLink, Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/aprendizaje")({
  head: () => ({ meta: [{ title: "Marketplace de Aprendizaje — Find Your Job" }] }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const filtered = learningMarketplace.filter(
    (c) =>
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      c.skill.toLowerCase().includes(q.toLowerCase()),
  );
  const sorted = [...filtered].sort((a, b) => b.employabilityImpact - a.employabilityImpact);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Marketplace de Aprendizaje"
        description="Cursos recomendados por señales para cerrar tus brechas y maximizar tu empleabilidad."
      />

      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-primary/5 border-primary/30">
        <Sparkles className="h-5 w-5 text-primary flex-none" />
        <p className="text-sm flex-1">
          Basado en tu mapa de skills, te recomendamos enfocarte en{" "}
          <span className="text-primary font-semibold">Kubernetes</span> y{" "}
          <span className="text-primary font-semibold">AWS</span> para maximizar tus matches en
          vacantes Senior.
        </p>
        <Badge
          variant="outline"
          className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
        >
          Personalizado
        </Badge>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar curso o skill..."
          className="pl-9"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((c) => (
          <Card key={c.id} className="p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono text-[10px]">
                {c.provider}
              </Badge>
              <Badge variant="outline" className="font-mono text-[10px]">
                {c.level}
              </Badge>
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{c.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Skill principal: <span className="font-mono text-foreground">{c.skill}</span>
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-warning" /> {c.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {c.durationHours}h
              </span>
              <span>{c.students.toLocaleString()} alumnos</span>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-primary">
                  <TrendingUp className="h-3 w-3" /> Impacto
                </span>
                <span className="font-mono font-bold text-primary">
                  +{c.employabilityImpact} pts
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="h-3 w-3" /> Vacantes
                </span>
                <span className="font-mono">{c.relatedVacancies} compatibles</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="font-mono text-xl font-bold">${c.price}</p>
              <Button size="sm" variant={c.affiliate ? "default" : "outline"}>
                Ver curso <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
            {c.affiliate && (
              <p className="text-[10px] text-muted-foreground mt-2">Enlace de afiliado</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
