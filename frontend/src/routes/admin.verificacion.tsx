import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listCertifications, verifyCertification } from "@/lib/api/certifications";
import type { Certification } from "@/lib/api/types";
import { ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/verificacion")({
  head: () => ({ meta: [{ title: "Verificación de Certificaciones — Admin" }] }),
  component: Page,
});

function Page() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    listCertifications({ limit: "50" })
      .then((resp) => setCerts(resp.data))
      .catch(() => toast.error("Error al cargar certificaciones"))
      .finally(() => setLoading(false));
  }, []);

  async function handleVerify(id: string) {
    setVerifying(id);
    try {
      await verifyCertification(id, true);
      setCerts((prev) => prev.map((c) => (c.id === id ? { ...c, verified: true } : c)));
      toast.success("Certificación verificada");
    } catch {
      toast.error("Error al verificar certificación");
    } finally {
      setVerifying(null);
    }
  }

  const pending = certs.filter((c) => !c.verified);
  const verified = certs.filter((c) => c.verified);

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">Cargando certificaciones...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Verificación de Certificaciones
        </h1>
        <p className="text-muted-foreground mt-1">
          Verifica las certificaciones de los candidatos para aumentar su nivel de confianza.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="text-2xl font-bold text-warning">{pending.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Verificadas</p>
          <p className="text-2xl font-bold text-primary">{verified.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{certs.length}</p>
        </Card>
      </div>

      {/* Pending Certifications */}
      {pending.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Pendientes de verificación</h2>
          <div className="space-y-3">
            {pending.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer}
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Ver credencial <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleVerify(cert.id)}
                  disabled={verifying === cert.id}
                >
                  {verifying === cert.id ? "Verificando..." : "Verificar"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Verified Certifications */}
      {verified.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Certificaciones verificadas</h2>
          <div className="space-y-3">
            {verified.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
                <Badge variant="outline" className="text-primary border-primary/40">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verificada
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {certs.length === 0 && (
        <Card className="p-10 text-center">
          <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No hay certificaciones para verificar.</p>
        </Card>
      )}
    </div>
  );
}
