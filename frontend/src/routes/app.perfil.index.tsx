import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProfile } from "@/lib/api/users";
import { listMyCertifications } from "@/lib/api/certifications";
import type { UserProfileResponse, Certification } from "@/lib/api/types";
import { Mail, MapPin, Linkedin, Github, Globe, Pencil, Briefcase } from "lucide-react";

export const Route = createFileRoute("/app/perfil/")({
  head: () => ({ meta: [{ title: "Perfil — Find Your Job" }] }),
  component: Perfil,
});

function Perfil() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => {}).finally(() => setLoading(false));
    listMyCertifications().then((r) => setCerts(r.data)).catch(() => {});
  }, []);

  if (loading) return <div className="p-10 text-center text-muted-foreground">Cargando perfil...</div>;
  if (!profile) return <div className="p-10 text-center text-muted-foreground">No se pudo cargar el perfil.</div>;

  const u = profile.user;
  const p = profile.profile;
  const initials = u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const completion = p ? Math.min(100, 30 + (p.summary ? 20 : 0) + (p.location ? 20 : 0) + (p.linkedin_url ? 15 : 0) + (p.github_url ? 15 : 0)) : 30;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-24 w-24 rounded-full bg-primary text-primary-foreground grid place-items-center text-2xl font-bold flex-none">{initials}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{u.name}</h1>
                <p className="text-sm text-muted-foreground">{u.email}</p>
                <Badge className="mt-1">{u.role}</Badge>
              </div>
              <Button asChild size="sm" variant="outline"><Link to="/app/perfil/editar"><Pencil className="h-4 w-4 mr-1" /> Editar</Link></Button>
            </div>
            {p && (
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                {p.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location}</span>}
                {p.linkedin_url && <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><Linkedin className="h-3.5 w-3.5" />LinkedIn</a>}
                {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><Github className="h-3.5 w-3.5" />GitHub</a>}
                {p.portfolio_url && <a href={p.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground"><Globe className="h-3.5 w-3.5" />Portafolio</a>}
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{p.experience_years} años exp.</span>
              </div>
            )}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1"><span>Perfil completado</span><span>{completion}%</span></div>
              <Progress value={completion} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      {p?.summary && (
        <Card className="p-6"><h3 className="font-semibold mb-2">Bio</h3><p className="text-sm text-muted-foreground whitespace-pre-wrap">{p.summary}</p></Card>
      )}

      {certs.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Certificaciones ({certs.length})</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((c) => (
              <Card key={c.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm">{c.name}</p>
                  {c.verified && <Badge className="bg-primary text-primary-foreground text-[10px]">Verificado</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{c.issuer}</p>
                {c.issue_date && <p className="text-xs text-muted-foreground mt-1">Emitida: {c.issue_date}</p>}
                {c.credential_url && <a href={c.credential_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 block">Ver credencial</a>}
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
