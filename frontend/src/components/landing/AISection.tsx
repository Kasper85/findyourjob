import { Bot, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const features = [
  "Extrae skills de tu CV con redes neuronales especializadas",
  "Compara semánticamente contra cada vacante",
  "Explica el score: qué coincide, qué falta, por qué",
  "Recomienda cursos y evaluaciones para cerrar brechas",
];

export function AISection() {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary font-mono text-xs"
            >
              <Bot className="mr-1.5 h-3 w-3" /> IA aplicada
            </Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Match Semántico NLP, no{" "}
              <span className="line-through text-muted-foreground/60">keyword matching</span>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nuestro motor entiende el significado de tu experiencia. Sabe que &quot;construí
              pipelines CI/CD en GCP&quot; equivale a DevOps en cloud, aunque la vacante diga
              &quot;automation engineer&quot;.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {features.map((t) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-none" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="p-6 border-border/80">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Análisis IA
            </p>
            <div className="mt-3 space-y-3 font-mono text-xs">
              <div className="rounded bg-muted/50 p-3">
                <p className="text-muted-foreground">$ analyzing cv.pdf...</p>
                <p className="text-primary mt-1">✓ 14 skills detectadas</p>
                <p className="text-primary">✓ 7 años de experiencia</p>
                <p className="text-warning">! 2 huecos temporales detectados</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <p className="text-muted-foreground">$ matching vs vacante #4821</p>
                <p className="text-primary mt-1">score: 0.94</p>
                <p className="text-muted-foreground">confidence: high</p>
                <p className="text-muted-foreground">latency: 1.2s</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <p className="text-muted-foreground">$ recommend learning path</p>
                <p className="text-primary mt-1">→ Kubernetes Operations</p>
                <p className="text-primary">→ GraphQL Fundamentals</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
