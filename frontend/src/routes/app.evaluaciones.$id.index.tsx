import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEvaluation, submitEvaluationResult } from "@/lib/api/evaluations";
import type { Evaluation } from "@/lib/api/types";
import { ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/evaluaciones/$id/")({
  head: () => ({ meta: [{ title: "Evaluación — Find Your Job" }] }),
  component: EvalPage,
});

function EvalPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [ev, setEv] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState("");

  useEffect(() => {
    getEvaluation(id)
      .then((r) => setEv(r.evaluation))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    const s = parseInt(score);
    if (isNaN(s) || s < 0) {
      toast.error("Ingresa un score válido");
      return;
    }
    setSubmitting(true);
    try {
      const resp = await submitEvaluationResult(id, s);
      toast.success(resp.result.passed ? `¡Aprobado! (${s})` : `Resultado enviado (${s})`);
      nav({ to: `/app/evaluaciones/${id}/result` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error";
      toast.error(msg.includes("already submitted") ? "Ya enviaste esta evaluación" : msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-10 text-center text-muted-foreground">Cargando...</div>;
  if (!ev)
    return <div className="p-10 text-center text-muted-foreground">Evaluación no encontrada.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => nav({ to: "/app/evaluaciones" })}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{ev.title}</h1>
          <Badge variant="outline">{ev.type}</Badge>
        </div>
        {ev.description && <p className="text-sm text-muted-foreground mb-4">{ev.description}</p>}
        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
          {ev.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {ev.duration_minutes} minutos
            </span>
          )}
          {ev.max_score && <span>Puntaje máximo: {ev.max_score}</span>}
          {ev.passing_score && <span>Aprueba con: {ev.passing_score}</span>}
        </div>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">
              Tu puntaje (0-{ev.max_score ?? 100})
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="0"
              max={ev.max_score ?? 100}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="85"
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar resultado"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
