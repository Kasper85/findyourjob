import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchBadge, VerificationBadge } from "@/components/app/VerificationBadge";
import { talentPool, postedVacancies, applicants } from "@/lib/mock/company";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Award,
  Mail,
  MessageSquare,
  CalendarPlus,
  Sparkles,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/candidatos/$id")({
  head: () => ({ meta: [{ title: "Perfil candidato — Empresa" }] }),
  component: CandidateDetail,
});

function CandidateDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const c = talentPool.find((x) => x.id === id);

  if (!c) {
    return (
      <Card className="p-10 text-center max-w-3xl mx-auto">
        <h2 className="font-semibold">Candidato no encontrado</h2>
        <Button asChild className="mt-4">
          <Link to="/empresa/talento">Volver</Link>
        </Button>
      </Card>
    );
  }

  const apps = applicants.filter((a) => a.candidateId === c.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <button
        onClick={() => nav({ to: "/empresa/talento" })}
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Talento
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground grid place-items-center font-mono font-bold text-xl flex-none">
              {c.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{c.name}</h1>
                <VerificationBadge level={c.verification} size="sm" />
                {!c.available && (
                  <Badge variant="outline" className="text-[10px] font-mono">
                    No disponible
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{c.title}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {c.location}
                </span>
                <span>· {c.modality}</span>
                <span>· {c.seniority}</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {c.experienceYears} años
                </span>
              </div>
              <p className="mt-3 text-sm">{c.bio}</p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Skills validadas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {c.skills.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="font-mono text-[11px] border-primary/30 bg-primary/5 text-primary"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                Expectativa salarial
              </p>
              <p className="font-mono text-lg font-semibold">{c.salaryExpectation}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {c.vertical} · {c.modality}
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Match con tu vacante
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-bold text-primary">{c.match ?? "—"}%</span>
              <MatchBadge match={c.match ?? 0} size="sm" />
            </div>
            <Progress value={c.match ?? 0} className="h-1.5 mt-3" />
            {c.matchReasons && (
              <ul className="mt-4 space-y-1.5 text-xs">
                {c.matchReasons.map((r) => (
                  <li key={r} className="flex items-start gap-1.5">
                    <Sparkles className="h-3 w-3 mt-0.5 text-primary flex-none" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-6 space-y-2">
            <Button
              className="w-full"
              onClick={() => toast.success("Mensaje enviado al candidato")}
            >
              <MessageSquare className="h-4 w-4 mr-1.5" /> Contactar
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.success("Invitación a entrevista enviada")}
            >
              <CalendarPlus className="h-4 w-4 mr-1.5" /> Agendar entrevista
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.success("Guardado en shortlist")}
            >
              Agregar a shortlist
            </Button>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              Índice
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold">{c.employabilityIndex}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <Progress value={c.employabilityIndex} className="h-1.5 mt-2" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-md border border-border p-2">
                <Award className="h-3.5 w-3.5 mx-auto text-primary" />
                <p className="font-mono text-lg font-bold mt-1">{c.certifications}</p>
                <p className="text-[10px] text-muted-foreground">Certs</p>
              </div>
              <div className="rounded-md border border-border p-2">
                <GraduationCap className="h-3.5 w-3.5 mx-auto text-primary" />
                <p className="font-mono text-lg font-bold mt-1">{c.skills.length}</p>
                <p className="text-[10px] text-muted-foreground">Skills</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {apps.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Postulaciones en tu empresa</h3>
          <div className="space-y-2">
            {apps.map((a) => {
              const v = postedVacancies.find((x) => x.id === a.vacancyId);
              if (!v) return null;
              return (
                <Link
                  key={a.id}
                  to="/empresa/vacantes/$id"
                  params={{ id: v.id }}
                  className="flex items-center justify-between gap-3 p-3 rounded-md border border-border hover:border-primary/40"
                >
                  <div>
                    <p className="text-sm font-medium">{v.title}</p>
                    <p className="text-[11px] text-muted-foreground">{a.appliedAt}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {a.stage}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
