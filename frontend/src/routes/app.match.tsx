import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/EmptyState";
import { MatchBreakdown } from "@/components/app/MatchBreakdown";
import { matchExplanation } from "@/lib/mock/extra";
import { Sparkles, Briefcase } from "lucide-react";

export const Route = createFileRoute("/app/match")({
  head: () => ({ meta: [{ title: "Explicabilidad del Match ponderado — Find Your Job" }] }),
  component: Page,
});

function Page() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Explicabilidad del Match ponderado"
        description="Cada match es transparente: los factores, su peso y su evidencia."
      >
        <Button variant="outline" size="sm">
          <Sparkles className="h-3 w-3 mr-1" /> Recalcular
        </Button>
      </PageHeader>

      <Card className="p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center flex-none">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Vacante evaluada
            </p>
            <p className="font-semibold truncate">{matchExplanation.jobTitle}</p>
            <p className="text-xs text-muted-foreground">{matchExplanation.company}</p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          Modelo NLP v2.4
        </Badge>
      </Card>

      <MatchBreakdown
        total={matchExplanation.total}
        factors={matchExplanation.factors}
        matched={matchExplanation.matched}
        missing={matchExplanation.missing}
        signal={matchExplanation.signal}
      />

      <Card className="p-5">
        <h3 className="font-semibold mb-3">¿Cómo se calcula?</h3>
        <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
          <li>
            Extraemos entidades (skills, herramientas, niveles) de la vacante con NLP semántico.
          </li>
          <li>Comparamos contra tu perfil verificado y evidencia de evaluaciones.</li>
          <li>Ponderamos por relevancia del rol y por nivel de verificación Zero Trust.</li>
          <li>Generamos una explicación auditable para ti y para el reclutador.</li>
        </ol>
      </Card>
    </div>
  );
}
