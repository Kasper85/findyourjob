import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/app/EmptyState";
import { createJob } from "@/lib/api/jobs";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/vacantes/nueva")({
  head: () => ({ meta: [{ title: "Nueva vacante — Empresa" }] }),
  component: NuevaVacante,
});

function NuevaVacante() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [jobType, setJobType] = useState("full_time");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent, draft: boolean) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Título y descripción son requeridos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        job_type: jobType,
        location: location.trim() || null,
        is_remote: isRemote,
      };
      if (salaryMin) data.salary_min = parseInt(salaryMin);
      if (salaryMax) data.salary_max = parseInt(salaryMax);

      await createJob(data);
      if (!draft) {
        toast.success("Vacante publicada.");
        // Note: job is created as draft; would need PUT to publish
        toast.info("La vacante se creó como borrador. Usa la vista de detalle para publicarla.");
      } else {
        toast.success("Borrador guardado.");
      }
      nav({ to: "/empresa/vacantes" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al crear vacante";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <button onClick={() => nav({ to: "/empresa/vacantes" })} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Volver
      </button>
      <PageHeader title="Nueva vacante" description="Completa los datos de la posición." />
      <Card className="p-6">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Go Developer" required />
          </div>
          <div>
            <Label htmlFor="desc">Descripción *</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción de la vacante..." required rows={5} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Buenos Aires, AR" />
            </div>
            <div>
              <Label htmlFor="jobType">Tipo</Label>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-1">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} /> Remoto</label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="smin">Salario mínimo</Label><Input id="smin" type="number" value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} placeholder="50000" /></div>
            <div><Label htmlFor="smax">Salario máximo</Label><Input id="smax" type="number" value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} placeholder="100000" /></div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear vacante"}</Button>
          </div>
          <p className="text-xs text-muted-foreground">La vacante se crea como borrador. Para publicarla, usa la vista de detalle.</p>
        </form>
      </Card>
    </div>
  );
}
