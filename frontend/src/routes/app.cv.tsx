import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/EmptyState";
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/cv")({
  head: () => ({ meta: [{ title: "CV Inteligente — Find Your Job" }] }),
  component: CV,
});

type Stage = "idle" | "analyzing" | "ready";

function CV() {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);

  function start() {
    setStage("analyzing");
    setProgress(0);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setStage("ready");
          return 100;
        }
        return p + 8;
      });
    }, 120);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="CV Inteligente"
        description="Sube tu CV y el sistema registrará skills, experiencia y educación."
      />

      {stage === "idle" && (
        <Card className="p-10 border-dashed text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary grid place-items-center">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold">Arrastra tu CV aquí</h3>
          <p className="mt-1 text-sm text-muted-foreground">Formato PDF · Máx 5MB</p>
          <Button className="mt-5" onClick={start}>
            Seleccionar archivo
          </Button>
          <p className="mt-3 text-xs text-muted-foreground font-mono">demo — análisis simulado</p>
        </Card>
      )}

      {stage === "analyzing" && (
        <Card className="p-10 text-center">
          <Loader2 className="mx-auto h-10 w-10 text-primary animate-spin" />
          <h3 className="mt-4 font-semibold">Analizando tu CV con señales verificables…</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Extrayendo skills, experiencia y formación
          </p>
          <Progress value={progress} className="mt-5 max-w-md mx-auto h-2" />
          <p className="mt-2 font-mono text-xs text-muted-foreground">{progress}%</p>
        </Card>
      )}

      {stage === "ready" && (
        <div className="space-y-4">
          <Card className="p-5 border-primary/40 bg-primary/5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Análisis completado</p>
              <p className="text-xs text-muted-foreground">
                Nivel de confianza: <span className="font-mono text-primary">92%</span>
              </p>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground">diego_ramirez_cv.pdf</span>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Skills detectadas</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ["Go", 98],
                  ["Docker", 96],
                  ["PostgreSQL", 94],
                  ["AWS", 88],
                  ["gRPC", 86],
                  ["Linux", 90],
                  ["TypeScript", 75],
                  ["Terraform", 70],
                  ["Kafka", 65],
                ].map(([s, conf]) => (
                  <Badge key={s as string} variant="outline" className="font-mono text-xs">
                    {s} <span className="ml-1 text-primary">{conf}%</span>
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Experiencia detectada</h3>
              <ul className="space-y-3 text-sm">
                {[
                  ["Bloomline Fintech", "Senior Backend Engineer", "2022 — Presente"],
                  ["Northwind Cloud", "Backend Engineer", "2019 — 2022"],
                  ["Startup Foo", "Full-Stack Developer", "2017 — 2019"],
                ].map(([c, r, p]) => (
                  <li key={c} className="flex justify-between">
                    <div>
                      <p className="font-medium">{r}</p>
                      <p className="text-xs text-muted-foreground">{c}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Educación detectada</h3>
              <p className="text-sm font-medium">Ingeniería en Computación</p>
              <p className="text-xs text-muted-foreground">
                UNAM · <span className="font-mono">2012 — 2016</span>
              </p>
            </Card>

            <Card className="p-6 border-warning/40 bg-warning/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-warning" />
                <h3 className="font-semibold">Información faltante</h3>
              </div>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>· Teléfono de contacto</li>
                <li>· Portafolio personal</li>
                <li>· Nivel de inglés</li>
              </ul>
              <Button variant="outline" size="sm" className="mt-4">
                Completar manualmente
              </Button>
            </Card>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setStage("idle")}>
              Subir otro CV
            </Button>
            <Button>Confirmar y aplicar a mi perfil</Button>
          </div>
        </div>
      )}
    </div>
  );
}
