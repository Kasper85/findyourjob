import { createFileRoute, notFound } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CertificationBadge } from "@/components/app/CertificationBadge";
import { Logo } from "@/components/Logo";
import { certifications, user } from "@/lib/mock/data";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/verify/$credentialId")({
  loader: ({ params }) => {
    const cert = certifications.find((c) => c.id === params.credentialId);
    if (!cert) throw notFound();
    return { cert };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Verificación pública — ${loaderData?.cert.name}` },
      { name: "description", content: `Credencial verificable emitida por Find Your Job.` },
    ],
  }),
  component: Verify,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background p-6">
      <div className="text-center">
        <p className="font-mono text-xs text-destructive">ERROR</p>
        <h1 className="mt-2 text-2xl font-bold">Credencial no encontrada</h1>
        <p className="mt-1 text-muted-foreground">Verifica el enlace o ID de la certificación.</p>
      </div>
    </div>
  ),
});

function Verify() {
  const { cert } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Logo />
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary font-mono text-[10px]"
          >
            <ShieldCheck className="h-3 w-3 mr-1" /> Zero Trust
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <Card className="p-10 text-center border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-10 [background:radial-gradient(circle_at_50%_0%,var(--color-primary),transparent_60%)]" />
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/15 text-primary grid place-items-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="mt-3 text-xs font-mono uppercase tracking-widest text-primary">
            Credencial verificada
          </p>
          <h1 className="mt-2 text-3xl font-bold">{cert.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Esta credencial es auténtica y fue emitida por Find Your Job.
          </p>

          <div className="mt-8 flex justify-center">
            <CertificationBadge cert={cert} size="lg" />
          </div>

          <div className="mt-8 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-sm">
            <Field label="Titular" value={user.name} />
            <Field label="Nivel" value={cert.level} />
            <Field label="Emisor" value={cert.issuer} />
            <Field label="Emitido" value={cert.issuedAt} />
            <Field label="ID credencial" value={cert.id.toUpperCase()} />
            <Field label="Estado" value="Válida" />
          </div>

          <div className="mt-8 pt-6 border-t border-border max-w-md mx-auto text-left">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              Competencias validadas
            </p>
            <div className="flex flex-wrap gap-2">
              {cert.skills.map((s: string) => (
                <Badge key={s} variant="outline" className="font-mono text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
        <p className="mt-6 text-center text-xs text-muted-foreground font-mono">
          Verificada con firma criptográfica · findyourjob.io
        </p>
      </div>
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
