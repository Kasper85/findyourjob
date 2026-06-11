import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/EmptyState";
import { learningPath } from "@/lib/mock/data";
import { BookOpen, CheckCircle2, Award, Clock, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/learning")({
  head: () => ({ meta: [{ title: "Learning Path — Find Your Job" }] }),
  component: Learning,
});

const typeIcon: Record<string, any> = {
  Curso: BookOpen,
  Evaluación: CheckCircle2,
  Certificación: Award,
};

function Learning() {
  const overall = Math.round(
    learningPath.reduce((a, b) => a + b.progress, 0) / learningPath.length,
  );
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title="Tu Learning Path"
        description="Generado por IA según las brechas detectadas en tu perfil."
      />

      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Progreso global
          </span>
          <span className="font-mono font-bold text-primary">{overall}%</span>
        </div>
        <Progress value={overall} className="h-2" />
      </Card>

      <div className="space-y-3">
        {learningPath.map((l) => {
          const Icon = typeIcon[l.type];
          return (
            <Card
              key={l.id}
              className="p-4 flex items-center gap-4 hover:border-primary/40 transition-colors"
            >
              <div className="h-11 w-11 rounded-md bg-primary/10 text-primary grid place-items-center flex-none">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm">{l.title}</p>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {l.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="font-mono text-[10px] text-primary border-primary/40 bg-primary/10"
                  >
                    {l.skill}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{l.provider}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {l.duration}
                  </span>
                </div>
                {l.progress > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={l.progress} className="h-1 flex-1" />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {l.progress}%
                    </span>
                  </div>
                )}
              </div>
              <Button asChild size="sm" variant={l.progress > 0 ? "default" : "outline"}>
                <Link to={l.type === "Evaluación" ? "/app/evaluaciones" : "/app/learning"}>
                  {l.progress > 0 ? "Continuar" : "Comenzar"}{" "}
                  <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
