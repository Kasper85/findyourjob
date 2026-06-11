import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/evaluaciones/$id/result")({
  head: () => ({ meta: [{ title: "Resultado — Evaluación" }] }),
  component: Result,
});

function Result() {
  // Result is shown after submitEvaluationResult redirects here.
  // The actual result data comes from the submission response (via toast/state).
  // For now, show a placeholder indicating the result was submitted.
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="p-10 text-center border-primary/40 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-10 [background:radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_60%)]" />
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 text-primary grid place-items-center"><CheckCircle2 className="h-7 w-7" /></div>
        <h1 className="mt-4 text-2xl font-bold">Resultado enviado</h1>
        <p className="mt-2 text-muted-foreground">Tu resultado fue registrado correctamente.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/app/evaluaciones" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Ver evaluaciones</Link>
        </div>
      </Card>
    </div>
  );
}
