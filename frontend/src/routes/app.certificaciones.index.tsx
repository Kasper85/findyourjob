import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/app/EmptyState";
import { listMyCertifications, createCertification, deleteCertification } from "@/lib/api/certifications";
import type { Certification } from "@/lib/api/types";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/app/certificaciones/")({
  head: () => ({ meta: [{ title: "Certificaciones — Find Your Job" }] }),
  component: Certs,
});

function Certs() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    listMyCertifications().then((r) => setCerts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("cname") as HTMLInputElement).value;
    const issuer = (form.elements.namedItem("cissuer") as HTMLInputElement).value;
    const url = (form.elements.namedItem("curl") as HTMLInputElement).value;
    if (!name || !issuer) { toast.error("Nombre y emisor son requeridos"); return; }
    try {
      const resp = await createCertification({ name, issuer, credential_url: url || undefined });
      setCerts([...certs, resp.certification]);
      toast.success("Certificación agregada");
      setAdding(false);
      form.reset();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error"); }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCertification(id);
      setCerts(certs.filter((c) => c.id !== id));
      toast.success("Eliminada");
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Error"); }
  }

  if (loading) return <div className="p-10 text-center text-muted-foreground">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader title="Mis certificaciones" description={`${certs.length} certificaciones.`}>
        <Button size="sm" onClick={() => setAdding(!adding)}><Plus className="h-4 w-4 mr-1" /> Agregar</Button>
      </PageHeader>
      {adding && (
        <Card className="p-4">
          <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
            <div><Label htmlFor="cname">Nombre *</Label><Input id="cname" name="cname" placeholder="AWS Solutions Architect" required /></div>
            <div><Label htmlFor="cissuer">Emisor *</Label><Input id="cissuer" name="cissuer" placeholder="Amazon" required /></div>
            <div><Label htmlFor="curl">URL credencial</Label><Input id="curl" name="curl" placeholder="https://..." /></div>
            <Button type="submit" size="sm">Guardar</Button>
          </form>
        </Card>
      )}
      {certs.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground"><p>No tienes certificaciones todavía.</p></Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm">{c.name}</p>
                <div className="flex gap-1">
                  {c.verified && <Badge className="bg-primary text-primary-foreground text-[10px]">Verificado</Badge>}
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(c.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{c.issuer}</p>
              {c.issue_date && <p className="text-xs text-muted-foreground mt-1">Emitida: {c.issue_date}</p>}
              {c.credential_url && <a href={c.credential_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 block">Ver credencial</a>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
