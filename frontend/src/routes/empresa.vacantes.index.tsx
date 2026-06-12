import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/app/EmptyState";
import { listJobs } from "@/lib/api/jobs";
import type { Job } from "@/lib/api/types";
import { Plus, Search, Eye } from "lucide-react";

export const Route = createFileRoute("/empresa/vacantes/")({
  head: () => ({ meta: [{ title: "Vacantes — Empresa" }] }),
  component: VacantesList,
});

const statusColor: Record<string, string> = {
  published: "bg-primary/15 text-primary border-primary/40",
  draft: "bg-muted text-muted-foreground border-border",
  closed: "bg-muted text-muted-foreground border-border",
  archived: "bg-muted text-muted-foreground border-border",
};

function VacantesList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("Todas");

  useEffect(() => {
    listJobs({ limit: "50" })
      .then((resp) => setJobs(resp.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    if (tab !== "Todas" && j.status !== tab) return false;
    if (q && !j.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Vacantes"
        description="Administra todas las posiciones abiertas y borradores."
      >
        <Button asChild>
          <Link to="/empresa/vacantes/nueva">
            <Plus className="h-4 w-4 mr-1" /> Nueva vacante
          </Link>
        </Button>
      </PageHeader>
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar vacante..."
              className="pl-8"
            />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="Todas">Todas</TabsTrigger>
              <TabsTrigger value="published">Publicadas</TabsTrigger>
              <TabsTrigger value="draft">Borrador</TabsTrigger>
              <TabsTrigger value="closed">Cerradas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>
      {loading ? (
        <p className="text-muted-foreground text-sm">Cargando...</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vacante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.title}</TableCell>
                  <TableCell>
                    <Badge className={statusColor[j.status] ?? ""}>{j.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{j.job_type ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{j.location ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/empresa/vacantes/$id" params={{ id: j.id }}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
