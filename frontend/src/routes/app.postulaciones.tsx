import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/EmptyState";
import { listMyApplications } from "@/lib/api/applications";
import type { ApplicationResponse } from "@/lib/api/types";

export const Route = createFileRoute("/app/postulaciones")({
  head: () => ({ meta: [{ title: "Mis postulaciones — Find Your Job" }] }),
  component: Postulaciones,
});

const statusTone: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  reviewed: "bg-secondary text-secondary-foreground",
  shortlisted: "bg-chart-2/15 text-chart-2 border-chart-2/40",
  rejected: "bg-destructive/15 text-destructive border-destructive/40",
  offered: "bg-primary text-primary-foreground",
  accepted: "bg-primary/15 text-primary border-primary/40",
  withdrawn: "bg-muted text-muted-foreground",
};

function Postulaciones() {
  const [apps, setApps] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyApplications()
      .then((resp) => setApps(resp.data))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Mis postulaciones"
        description={loading ? "Cargando..." : `${apps.length} postulaciones.`}
      />
      {loading ? (
        <p className="text-muted-foreground text-sm">Cargando postulaciones...</p>
      ) : apps.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">
          <p>No has postulado a ninguna vacante todavía.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Vacante</th>
                  <th className="text-left p-4">Postulada</th>
                  <th className="text-left p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {apps.map((a) => (
                  <tr key={a.application.id} className="hover:bg-muted/40">
                    <td className="p-4 font-medium">{a.job_title ?? a.application.job_id}</td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">
                      {a.application.applied_at?.slice(0, 10) ?? "—"}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={`font-mono text-[10px] ${statusTone[a.application.status] ?? ""}`}
                      >
                        {a.application.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
