import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/EmptyState";
import { getProfile, updateProfile } from "@/lib/api/users";
import type { UserProfileResponse } from "@/lib/api/types";
import { toast } from "sonner";

export const Route = createFileRoute("/app/perfil/editar")({
  head: () => ({ meta: [{ title: "Editar perfil — Find Your Job" }] }),
  component: Edit,
});

function Edit() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { getProfile().then(setProfile).catch(() => {}).finally(() => setLoading(false)); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data: Record<string, unknown> = {};
    const location = (form.elements.namedItem("location") as HTMLInputElement).value;
    const summary = (form.elements.namedItem("summary") as HTMLTextAreaElement).value;
    const expYears = (form.elements.namedItem("experience_years") as HTMLInputElement).value;
    const linkedin = (form.elements.namedItem("linkedin_url") as HTMLInputElement).value;
    const github = (form.elements.namedItem("github_url") as HTMLInputElement).value;
    const portfolio = (form.elements.namedItem("portfolio_url") as HTMLInputElement).value;
    const prefLoc = (form.elements.namedItem("preferred_location") as HTMLInputElement).value;
    const salaryMin = (form.elements.namedItem("salary_min") as HTMLInputElement).value;
    const salaryMax = (form.elements.namedItem("salary_max") as HTMLInputElement).value;
    const prefRemote = (form.elements.namedItem("preferred_remote") as HTMLInputElement).checked;

    if (location) data.location = location;
    if (summary) data.summary = summary;
    if (expYears) data.experience_years = parseInt(expYears);
    if (linkedin) data.linkedin_url = linkedin;
    if (github) data.github_url = github;
    if (portfolio) data.portfolio_url = portfolio;
    if (prefLoc) data.preferred_location = prefLoc;
    if (salaryMin) data.salary_min = parseInt(salaryMin);
    if (salaryMax) data.salary_max = parseInt(salaryMax);
    data.preferred_remote = prefRemote;

    setSaving(true);
    try {
      await updateProfile(data);
      toast.success("Perfil actualizado");
      nav({ to: "/app/perfil" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-center text-muted-foreground">Cargando...</div>;
  const p = profile?.profile;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Editar perfil" description="Mantén tu información profesional al día.">
        <Button asChild variant="ghost"><Link to="/app/perfil">Cancelar</Link></Button>
        <Button form="profile-form" type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
      </PageHeader>
      <form id="profile-form" onSubmit={save} className="space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Información profesional</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="location" label="Ubicación" defaultValue={p?.location ?? ""} />
            <Field id="preferred_location" label="Ubicación preferida" defaultValue={p?.preferred_location ?? ""} />
            <Field id="experience_years" label="Años de experiencia" type="number" defaultValue={p?.experience_years?.toString() ?? "0"} />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" id="preferred_remote" name="preferred_remote" defaultChecked={p?.preferred_remote ?? true} /> Prefiero remoto</label>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="summary">Bio</Label>
            <Textarea id="summary" name="summary" defaultValue={p?.summary ?? ""} rows={4} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Enlaces</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field id="linkedin_url" label="LinkedIn" defaultValue={p?.linkedin_url ?? ""} />
            <Field id="github_url" label="GitHub" defaultValue={p?.github_url ?? ""} />
            <Field id="portfolio_url" label="Portafolio" defaultValue={p?.portfolio_url ?? ""} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Salario esperado</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="salary_min" label="Mínimo" type="number" defaultValue={p?.salary_min?.toString() ?? ""} />
            <Field id="salary_max" label="Máximo" type="number" defaultValue={p?.salary_max?.toString() ?? ""} />
          </div>
        </Card>
      </form>
    </div>
  );
}

function Field({ id, label, type = "text", defaultValue }: { id: string; label: string; type?: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} defaultValue={defaultValue} />
    </div>
  );
}
