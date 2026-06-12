import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getJob, updateJob, deleteJob } from "@/lib/api/jobs";
import { listJobApplications, updateApplicationStatus } from "@/lib/api/applications";
import { createInterview } from "@/lib/api/interviews";
import type { Job, ApplicationResponse } from "@/lib/api/types";
import { ArrowLeft, MapPin, Users, Sparkles, Play, Pause, X, CalendarPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/vacantes/$id")({
  head: () => ({ meta: [{ title: "Detalle vacante — Empresa" }] }),
  component: VacancyDetail,
});

function VacancyDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [realApps, setRealApps] = useState<ApplicationResponse[]>([]);
  const [schedulingAppId, setSchedulingAppId] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    getJob(id)
      .then((r) => setJob(r.job))
      .catch(() => {})
      .finally(() => setLoading(false));
    listJobApplications(id)
      .then((r) => setRealApps(r.data))
      .catch(() => {});
  }, [id]);

  async function handleStatusChange(appId: string, status: string) {
    try {
      await updateApplicationStatus(appId, status);
      setRealApps((prev) =>
        prev.map((a) =>
          a.application.id === appId ? { ...a, application: { ...a.application, status } } : a,
        ),
      );
      toast.success(`Estado: ${status}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleToggleStatus() {
    if (!job) return;
    const newStatus = job.status === "published" ? "draft" : "published";
    try {
      const r = await updateJob(job.id, { status: newStatus });
      setJob(r.job);
      toast.success(newStatus === "published" ? "Vacante publicada" : "Vacante pausada");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleClose() {
    if (!job) return;
    try {
      await updateJob(job.id, { status: "closed" });
      setJob({ ...job, status: "closed" });
      toast.success("Vacante cerrada");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleDelete() {
    if (!job) return;
    if (!confirm("¿Eliminar esta vacante?")) return;
    try {
      await deleteJob(job.id);
      toast.success("Eliminada");
      nav({ to: "/empresa/vacantes" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  }

  async function handleScheduleInterview(e: React.FormEvent<HTMLFormElement>, appId: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const scheduledAt = (form.elements.namedItem("scheduled_at") as HTMLInputElement).value;
    const duration = (form.elements.namedItem("duration_minutes") as HTMLInputElement).value;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;
    const locationOrLink = (
      form.elements.namedItem("location_or_link") as HTMLInputElement
    ).value.trim();
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value.trim();

    if (!scheduledAt) {
      toast.error("Selecciona fecha y hora.");
      return;
    }

    setScheduling(true);
    try {
      await createInterview(appId, {
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: Number(duration) || 60,
        type,
        location_or_link: locationOrLink || undefined,
        notes: notes || undefined,
      });
      toast.success("Entrevista programada");
      setSchedulingAppId(null);
      form.reset();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al programar entrevista");
    } finally {
      setScheduling(false);
    }
  }

  if (loading)
    return <div className="p-10 text-center text-muted-foreground">Cargando vacante...</div>;
  if (!job)
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="p-10 text-center">
          <h2 className="font-semibold">Vacante no encontrada</h2>
          <Button asChild className="mt-4">
            <Link to="/empresa/vacantes">Volver</Link>
          </Button>
        </Card>
      </div>
    );

  const appsCount = realApps.length;
  const shortlisted = realApps.filter((a) => a.application.status === "shortlisted").length;
  const salaryStr =
    job.salary_min || job.salary_max
      ? `${job.salary_min ?? "?"} - ${job.salary_max ?? "?"} ${job.currency}`
      : "—";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <button
        onClick={() => nav({ to: "/empresa/vacantes" })}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Vacantes
      </button>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
            >
              {job.status}
            </Badge>
            <h1 className="mt-2 text-2xl font-bold">{job.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              )}
              <span>· {job.is_remote ? "Remoto" : "Presencial"}</span>
              {job.job_type && <span>· {job.job_type}</span>}
              <span>· {salaryStr}</span>
              <span>· {job.created_at?.slice(0, 10)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleStatus}>
              {job.status === "published" ? (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1" />
                  Publicar
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClose}>
              <X className="h-3.5 w-3.5 mr-1" />
              Cerrar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Eliminar
            </Button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Stat icon={Users} label="Postulantes" value={appsCount} />
          <Stat icon={Sparkles} label="Shortlist" value={shortlisted} />
        </div>
        {job.description && <p className="mt-4 text-sm whitespace-pre-wrap">{job.description}</p>}
      </Card>

      {realApps.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/40">
          <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">
            Postulantes ({realApps.length})
          </p>
          <div className="space-y-2">
            {realApps.map((a) => (
              <div
                key={a.application.id}
                className="rounded-md border border-border/60 bg-background/70 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{a.job_title ?? a.application.job_id}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {a.application.status}
                    </Badge>
                    <select
                      value={a.application.status}
                      onChange={(e) => handleStatusChange(a.application.id, e.target.value)}
                      className="h-7 rounded border border-input bg-background px-2 text-xs"
                    >
                      {[
                        "pending",
                        "reviewed",
                        "shortlisted",
                        "rejected",
                        "offered",
                        "accepted",
                        "withdrawn",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSchedulingAppId(
                          schedulingAppId === a.application.id ? null : a.application.id,
                        )
                      }
                    >
                      <CalendarPlus className="h-3.5 w-3.5 mr-1" /> Programar entrevista
                    </Button>
                  </div>
                </div>
                {schedulingAppId === a.application.id && (
                  <form
                    onSubmit={(e) => handleScheduleInterview(e, a.application.id)}
                    className="mt-3 grid gap-3 rounded-md bg-muted/30 p-3 md:grid-cols-2"
                  >
                    <label className="text-xs font-medium">
                      Fecha y hora
                      <input
                        name="scheduled_at"
                        type="datetime-local"
                        required
                        className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-sm"
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Duración
                      <input
                        name="duration_minutes"
                        type="number"
                        min="1"
                        defaultValue={60}
                        className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-sm"
                      />
                    </label>
                    <label className="text-xs font-medium">
                      Tipo
                      <select
                        name="type"
                        defaultValue="video"
                        className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-sm"
                      >
                        {["phone", "video", "in_person", "technical", "hr"].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-medium">
                      Link o ubicación
                      <input
                        name="location_or_link"
                        placeholder="https://meet..."
                        className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-sm"
                      />
                    </label>
                    <label className="text-xs font-medium md:col-span-2">
                      Notas
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-1 w-full rounded border border-input bg-background px-2 py-2 text-sm"
                      />
                    </label>
                    <div className="flex gap-2 md:col-span-2">
                      <Button type="submit" size="sm" disabled={scheduling}>
                        {scheduling ? "Programando..." : "Guardar entrevista"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSchedulingAppId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="p-3 bg-muted/30 flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </Card>
  );
}
