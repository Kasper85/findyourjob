import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CertificationBadge } from "@/components/app/CertificationBadge";
import { certifications } from "@/lib/mock/data";
import { ArrowLeft, Copy, Download, Share2, ShieldCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/certificaciones/$id")({
  loader: ({ params }) => {
    const cert = certifications.find((c) => c.id === params.id);
    if (!cert) throw notFound();
    return { cert };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.cert.name} — Certificación` }] }),
  component: Detail,
  notFoundComponent: () => (
    <div className="p-10 text-center text-muted-foreground">Certificación no encontrada.</div>
  ),
});

function Detail() {
  const { cert } = Route.useLoaderData();
  const url = `/verify/${cert.id}`;
  function share() {
    navigator.clipboard?.writeText(window.location.origin + url);
    toast.success("Enlace copiado al portapapeles");
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/app/certificaciones"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Volver
      </Link>

      <Card className="p-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <CertificationBadge cert={cert} size="lg" />
          <div>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary font-mono text-[10px]"
            >
              <ShieldCheck className="h-3 w-3 mr-1" /> Verificable Zero Trust
            </Badge>
            <h1 className="mt-3 text-2xl font-bold">{cert.name}</h1>
            <p className="text-sm text-muted-foreground">Emitido por {cert.issuer}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm max-w-md">
              <Field label="Nivel" value={cert.level} />
              <Field label="Emitido" value={cert.issuedAt} />
              <Field label="ID" value={cert.id.toUpperCase()} />
              <Field label="Skills" value={`${cert.skills.length} validadas`} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={share}>
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                Compartir
              </Button>
              <Button variant="outline" onClick={share}>
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                Copiar enlace
              </Button>
              <Button variant="outline">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Descargar
              </Button>
              <Button asChild variant="ghost">
                <Link to="/verify/$credentialId" params={{ credentialId: cert.id }}>
                  Ver verificación pública <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-3">Competencias validadas</h3>
        <div className="flex flex-wrap gap-2">
          {cert.skills.map((s: string) => (
            <Badge key={s} variant="outline" className="font-mono">
              {s}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-sm">{value}</p>
    </div>
  );
}
