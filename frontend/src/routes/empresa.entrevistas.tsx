import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/EmptyState";
import { listMyInterviews } from "@/lib/api/interviews";
import type { Interview } from "@/lib/api/types";
import { Calendar, Clock, Video, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/empresa/entrevistas")({
  head: () => ({ meta: [{ title: "Entrevistas — Empresa" }] }),
  component: Entrevistas,
});

const statusColors: Record<string, string> = {
  scheduled: "bg-primary/15 text-primary",
  confirmed: "bg-chart-2/15 text-chart-2",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
  no_show: "bg-destructive/15 text-destructive",
};

function Entrevistas() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listMyInterviews()
      .then((r) => setInterviews(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const upcoming = interviews.filter((i) => i.status === "scheduled" || i.status === "confirmed");
  const past = interviews.filter((i) => i.status !== "scheduled" && i.status !== "confirmed");

  if (loading)
    return <div className="p-10 text-center text-muted-foreground">Cargando entrevistas...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader
        title="Entrevistas"
        description="Coordina y haz seguimiento de todas las entrevistas."
      />
      <Tabs defaultValue="proximas">
        <TabsList>
          <TabsTrigger value="proximas">Próximas ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="pasadas">Historial ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="proximas" className="mt-4 space-y-3">
          {upcoming.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">
              <p>No hay entrevistas próximas.</p>
            </Card>
          ) : (
            upcoming.map((i) => <InterviewCard key={i.id} iv={i} />)
          )}
        </TabsContent>
        <TabsContent value="pasadas" className="mt-4 space-y-3">
          {past.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">
              <p>No hay historial.</p>
            </Card>
          ) : (
            past.map((i) => <InterviewCard key={i.id} iv={i} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InterviewCard({ iv }: { iv: Interview }) {
  const typeIcon =
    iv.type === "video" ? (
      <Video className="h-4 w-4" />
    ) : iv.type === "phone" ? (
      <Phone className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted grid place-items-center">{typeIcon}</div>
          <div>
            <p className="font-semibold text-sm">{iv.type ?? "Entrevista"}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {iv.scheduled_at?.slice(0, 16) ?? "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {iv.duration_minutes > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {iv.duration_minutes}m
            </span>
          )}
          {iv.location_or_link && (
            <span className="text-xs text-muted-foreground max-w-[150px] truncate">
              {iv.location_or_link}
            </span>
          )}
          <Badge variant="outline" className={`text-[10px] ${statusColors[iv.status] ?? ""}`}>
            {iv.status}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
