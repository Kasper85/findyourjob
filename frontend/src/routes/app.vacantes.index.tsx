import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/app/JobCard";
import { PageHeader } from "@/components/app/EmptyState";
import { listJobs } from "@/lib/api/jobs";
import type { Job } from "@/lib/api/types";
import { Search } from "lucide-react";

export const Route = createFileRoute("/app/vacantes/")({
  head: () => ({ meta: [{ title: "Vacantes — Find Your Job" }] }),
  component: Vacantes,
});

function Vacantes() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("published");

  useEffect(() => {
    listJobs({ status, limit: "50" })
      .then((resp) => setJobs(resp.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [status]);

  const filtered = jobs.filter(
    (j) =>
      q === "" ||
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      (j.description ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Vacantes"
        description={loading ? "Cargando..." : `${filtered.length} vacantes disponibles.`}
      />
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por rol o empresa…"
              className="pl-8"
            />
          </div>
        </div>
      </Card>
      {loading ? (
        <p className="text-muted-foreground text-sm">Cargando vacantes...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No se encontraron vacantes.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
