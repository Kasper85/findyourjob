import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getJob } from "@/lib/api/jobs";
import { applyToJob, listMyApplications } from "@/lib/api/applications";
import { getJobMatch } from "@/lib/api/matching";
import type { Job, MatchResponse } from "@/lib/api/types";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/vacantes/$id")({
  head: () => ({ meta: [{ title: "Vacante — Find Your Job" }] }),
  component: Detail,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Vacante no encontrada.</div>
  ),
});

function Detail() {
  const { id } = Route.useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [match, setMatch] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    getJob(id)
      .then((resp) => setJob(resp.job))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
    // Try to get match score (may fail if not candidate or no profile)
    getJobMatch(id)
      .then(setMatch)
      .catch(() => {});
    listMyApplications()
      .then((resp) => setAlreadyApplied(resp.data.some((item) => item.application.job_id === id)))
      .catch(() => {});
  }, [id]);

  async function handleApply() {
    if (!job) return;
    setApplying(true);
    try {
      await applyToJob(job.id);
      setAlreadyApplied(true);
      toast.success("Postulación enviada");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al postular";
      toast.error(msg);
    } finally {
      setApplying(false);
    }
  }

  if (loading)
    return <div className="p-10 text-center text-muted-foreground">Cargando vacante...</div>;
  if (!job) throw notFound();

  const score = match?.score ?? 0;
  const matchedSkills = match?.matched_skills ?? [];
  const missingSkills = match?.missing_skills ?? [];
  const canApply = !alreadyApplied;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link
        to="/app/vacantes"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver a vacantes
      </Link>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-md bg-muted grid place-items-center font-mono font-bold flex-none">
                {job.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">{job.title}</h1>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                  )}
                  {job.job_type && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.job_type}
                    </span>
                  )}
                  {job.is_remote && <Badge variant="outline">Remoto</Badge>}
                </div>
              </div>
            </div>
            {job.description && (
              <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
            )}
            {job.requirements && (
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Requisitos</p>
                <p className="text-sm whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}
            {job.responsibilities && (
              <div className="mt-4">
                <p className="font-semibold text-sm mb-1">Responsabilidades</p>
                <p className="text-sm whitespace-pre-wrap">{job.responsibilities}</p>
              </div>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          {match && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="font-semibold">Match ponderado</p>
              </div>
              <div className="text-4xl font-bold">{score}%</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {match.level.replace("_", " ")}
              </p>
              {matchedSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Skills coincidentes
                  </p>
                  <div className="mt-1 space-y-1">
                    {matchedSkills.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-none" />
                        <span className="font-mono">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Brechas detectadas
                  </p>
                  <div className="mt-1 space-y-1">
                    {missingSkills.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-destructive flex-none" />
                        <span className="font-mono">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
          <Card className="p-6">
            {canApply ? (
              <Button className="w-full" onClick={handleApply} disabled={applying}>
                {applying ? "Enviando..." : "Postular ahora"}
              </Button>
            ) : (
              <Button className="w-full" disabled>
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                Ya postulaste
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
